// Funzione serverless (Netlify Functions v2) che riceve i dati del form
// "Richiedi un preventivo" e li invia via email tramite l'API di Resend,
// allegando eventuali file caricati (visure catastali).
//
// A differenza di Netlify Forms, qui i file non vengono mai salvati su
// Netlify: restano solo in memoria per la durata della richiesta, vengono
// allegati direttamente all'email e poi scartati.
//
// Richiede una variabile d'ambiente RESEND_API_KEY impostata nel pannello
// Netlify (Site settings → Environment variables). Non va mai inserita nel
// codice o nel repository.

const TO_EMAIL = "fmlabella@notariato.it";
const FROM_EMAIL = "Studio Notarile La Bella <preventivi@notaiofilippomatteolabella.it>";

const FIELD_LABELS = {
  nome: "Nome e cognome",
  email: "Email",
  telefono: "Telefono",
  tipo_atto: "Tipo di operazione",
  sede: "Sede di riferimento",
  prima_seconda_casa: "Prima o seconda casa",
  tipologia_terreno: "Tipologia di terreno",
  compravendita_mutuo: "Compravendita/Mutuo",
  importo_mutuo: "Importo del mutuo",
  prezzo_vendita: "Prezzo di vendita",
  rendita_catastale: "Rendita catastale",
  agevolazioni: "Agevolazioni",
  tipologia_societaria: "Tipologia (atti societari)",
  tipologia_successione: "Tipologia (successione/testamento)",
  grado_parentela: "Grado di parentela donatario",
  messaggio: "Informazioni aggiuntive",
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY non configurata");
    return jsonResponse({ ok: false, error: "config" }, 500);
  }

  try {
    const formData = await req.formData();

    // Honeypot anti-spam: se il campo nascosto "bot-field" è compilato,
    // si tratta quasi certamente di un bot. Rispondiamo positivamente senza
    // inviare nulla, così il bot non capisce di essere stato scartato.
    if (formData.get("bot-field")) {
      return jsonResponse({ ok: true }, 200);
    }

    const rows = Object.entries(FIELD_LABELS)
      .map(([key, label]) => {
        const value = (formData.get(key) || "").toString().trim();
        return value ? { label, value } : null;
      })
      .filter(Boolean);

    const uploadedFiles = formData
      .getAll("allegati")
      .filter((f) => f && typeof f === "object" && typeof f.arrayBuffer === "function" && f.size > 0);

    if (uploadedFiles.length) {
      rows.push({
        label: "Allegati",
        value: uploadedFiles.map((f) => f.name).join(", "),
      });
    }

    const html = `
      <h2 style="font-family:Georgia,serif;color:#22334C;">Nuova richiesta di preventivo dal sito</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        ${rows
          .map(
            (r) =>
              `<tr><td style="font-weight:600;vertical-align:top;color:#22334C;white-space:nowrap;">${escapeHtml(
                r.label
              )}</td><td style="color:#1D1D1B;">${escapeHtml(r.value).replace(/\n/g, "<br>")}</td></tr>`
          )
          .join("")}
      </table>
    `;

    const attachments = await Promise.all(
      uploadedFiles.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      }))
    );

    const replyTo = (formData.get("email") || "").toString().trim();
    const tipoAtto = (formData.get("tipo_atto") || "sito web").toString();

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: replyTo || undefined,
        subject: `Nuova richiesta di preventivo — ${tipoAtto}`,
        html,
        attachments: attachments.length ? attachments : undefined,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Errore Resend:", resendResponse.status, errorText);
      return jsonResponse({ ok: false, error: "resend" }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error("Errore invio preventivo:", err);
    return jsonResponse({ ok: false, error: "server" }, 500);
  }
};

export const config = { path: "/api/send-quote" };
