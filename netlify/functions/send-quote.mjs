// Funzione serverless (Netlify Functions v2) che riceve i dati del form
// "Richiedi un preventivo" e li inoltra come email tramite Resend, con gli
// eventuali allegati incorporati direttamente nel messaggio (nessuna copia
// dei file salvata su Netlify).
//
// Richiede la variabile d'ambiente RESEND_API_KEY (impostata come secret sul
// progetto Netlify) e un dominio mittente verificato su Resend.

const FROM = "Sito web — Richieste preventivo <preventivi@notaiofilippomatteolabella.it>";
const TO = ["fmlabella@notariato.it"];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Metodo non consentito." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await req.formData();

    // Honeypot anti-spam: se il campo esca compilato, la richiesta è quasi
    // certamente automatica. Rispondiamo comunque con successo per non dare
    // indizi utili ai bot, ma non inviamo alcuna email.
    if ((data.get("bot-field") || "").toString().trim()) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const get = (name) => (data.get(name) || "").toString().trim();

    const nome = get("nome");
    const email = get("email");

    if (!nome || !email) {
      return new Response(JSON.stringify({ error: "Nome ed email sono obbligatori." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fields = [
      ["Nome e cognome", nome],
      ["Email", email],
      ["Telefono", get("telefono")],
      ["Tipo di operazione", get("tipo_atto")],
      ["Sede di riferimento", get("sede")],
      ["Prima o seconda casa", get("prima_seconda_casa")],
      ["Tipologia di terreno", get("tipologia_terreno")],
      ["Compravendita/Mutuo", get("compravendita_mutuo")],
      ["Importo del mutuo", get("importo_mutuo")],
      ["Prezzo di vendita", get("prezzo_vendita")],
      ["Rendita catastale", get("rendita_catastale")],
      ["Agevolazioni", get("agevolazioni")],
      ["Tipologia societaria", get("tipologia_societaria")],
      ["Tipologia successione", get("tipologia_successione")],
      ["Grado di parentela donatario", get("grado_parentela")],
      ["Informazioni aggiuntive", get("messaggio")],
    ].filter(([, value]) => value);

    const rowsHtml = fields
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#5B5B57;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
            label
          )}</td><td style="padding:6px 0;color:#1D1D1B;font-size:14px;">${escapeHtml(value).replace(
            /\n/g,
            "<br>"
          )}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#22334C;font-size:20px;">Nuova richiesta di preventivo</h2>
        <table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>
      </div>
    `;

    const attachments = [];
    for (const key of ["allegato_1", "allegato_2", "allegato_3"]) {
      const file = data.get(key);
      if (file && typeof file === "object" && typeof file.arrayBuffer === "function" && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name || `${key}`,
          content: buffer.toString("base64"),
        });
      }
    }

    const tipoAtto = get("tipo_atto");

    const payload = {
      from: FROM,
      to: TO,
      reply_to: email,
      subject: `Nuova richiesta di preventivo${tipoAtto ? " — " + tipoAtto : ""}`,
      html,
    };

    if (attachments.length > 0) {
      payload.attachments = attachments;
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Errore invio Resend:", resendRes.status, errText);
      return new Response(JSON.stringify({ error: "Invio non riuscito." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Errore nella funzione send-quote:", err);
    return new Response(JSON.stringify({ error: "Errore interno." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/send-quote",
};
