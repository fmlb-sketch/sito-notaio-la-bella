import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ---------------------------------------------------------------- */
/* Conversione "click to call" (Google Ads)                          */
/* ---------------------------------------------------------------- */
function reportCallConversion(e, href) {
  e.preventDefault();
  if (typeof window !== "undefined" && typeof window.gtag_report_conversion === "function") {
    window.gtag_report_conversion(href);
  } else if (typeof window !== "undefined") {
    window.location.href = href;
  }
}

/* ---------------------------------------------------------------- */
/* shadcn/ui — Button                                                */
/* ---------------------------------------------------------------- */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-sm font-semibold tracking-wide transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border border-navy bg-navy text-offwhite hover:bg-navyDeep hover:border-navyDeep",
        outline: "border border-navy bg-transparent text-navy hover:bg-navy hover:text-offwhite",
        outlineInverse: "border border-offwhite/50 bg-transparent text-offwhite hover:bg-offwhite hover:text-navy",
        soft: "border border-line bg-paperDeep text-navy hover:border-navy hover:bg-line",
        ghost: "text-navy hover:bg-paperDeep",
        ghostInverse: "text-offwhite hover:bg-white/10",
      },
      size: {
        default: "px-[26px] py-[15px]",
        sm: "px-5 py-2.5 text-xs",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

/* ---------------------------------------------------------------- */
/* shadcn/ui — Sheet (built on Radix Dialog)                         */
/* ---------------------------------------------------------------- */
const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

function SheetContent({ className, children, ...props }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-navyDeep/50 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 lg:hidden" />
      <Dialog.Content
        className={cn(
          "fixed top-0 right-0 z-[70] flex h-full w-[86%] max-w-sm flex-col bg-navy text-offwhite outline-none transition-transform duration-300 ease-out data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full lg:hidden",
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

/* ---------------------------------------------------------------- */
/* Richiedi un preventivo — form (funzione serverless + Resend)      */
/* ---------------------------------------------------------------- */
const TIPO_ATTO_OPZIONI = [
  "Acquisto casa da privato",
  "Acquisto casa da costruttore/soggetto IVA",
  "Acquisto terreni",
  "Atti societari",
  "Donazione casa",
  "Successioni",
];
const PRIMA_SECONDA_CASA_OPZIONI = ["Prima casa", "Seconda casa"];
const TIPOLOGIA_TERRENO_OPZIONI = ["Terreno agricolo", "Terreno non agricolo"];
const COMPRAVENDITA_MUTUO_OPZIONI = ["Solo compravendita", "Compravendita e mutuo"];
const AGEVOLAZIONI_OPZIONI = ["Senza agevolazioni", "Piccola proprietà contadina"];
const TIPOLOGIA_SOCIETARIA_OPZIONI = [
  "Costituzione società",
  "Modifiche di società",
  "Scioglimento società",
  "Operazioni sul capitale",
  "Altro",
];
const TIPOLOGIA_SUCCESSIONE_OPZIONI = ["Dichiarazione di successione", "Testamento"];
const GRADO_PARENTELA_OPZIONI = [
  "Coniuge/parente in linea retta",
  "Fratello/sorella",
  "Parente entro il 4° grado",
  "Parente oltre il 4° grado/estraneo",
];

const EMPTY_FORM = {
  nome: "",
  email: "",
  telefono: "",
  tipoAtto: "",
  sede: "",
  primaSecondaCasa: "",
  tipologiaTerreno: "",
  compravenditaMutuo: "",
  importoMutuo: "",
  prezzoVendita: "",
  renditaCatastale: "",
  agevolazioni: "",
  tipologiaSocietaria: "",
  tipologiaSuccessione: "",
  gradoParentela: "",
  messaggio: "",
};

const fieldInputClass =
  "w-full border-0 border-b border-line bg-transparent px-0 py-2 text-[15px] text-ink outline-none transition-colors focus:border-navy";

const fileInputClass =
  fieldInputClass +
  " cursor-pointer file:mr-4 file:cursor-pointer file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-offwhite file:transition-colors hover:file:bg-navyDeep";

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-inkSoft">{label}</span>
      {children}
    </label>
  );
}

function QuoteForm() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([null, null, null]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function updateFile(index) {
    return (e) => {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
      setFiles((f) => {
        const next = [...f];
        next[index] = file;
        return next;
      });
    };
  }

  function updateTipoAtto(e) {
    const value = e.target.value;
    setForm((f) => ({
      ...EMPTY_FORM,
      nome: f.nome,
      email: f.email,
      telefono: f.telefono,
      sede: f.sede,
      messaggio: f.messaggio,
      tipoAtto: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const data = new FormData();
      const botField = e.target.elements["bot-field"];
      data.append("bot-field", botField ? botField.value : "");
      data.append("nome", form.nome);
      data.append("email", form.email);
      data.append("telefono", form.telefono);
      data.append("tipo_atto", form.tipoAtto);
      data.append("sede", form.sede);
      data.append("prima_seconda_casa", form.primaSecondaCasa);
      data.append("tipologia_terreno", form.tipologiaTerreno);
      data.append("compravendita_mutuo", form.compravenditaMutuo);
      data.append("importo_mutuo", form.importoMutuo);
      data.append("prezzo_vendita", form.prezzoVendita);
      data.append("rendita_catastale", form.renditaCatastale);
      data.append("agevolazioni", form.agevolazioni);
      data.append("tipologia_societaria", form.tipologiaSocietaria);
      data.append("tipologia_successione", form.tipologiaSuccessione);
      data.append("grado_parentela", form.gradoParentela);
      data.append("messaggio", form.messaggio);
      files.forEach((file, i) => {
        if (file) data.append(`allegato_${i + 1}`, file);
      });

      const res = await fetch("/api/send-quote", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Invio non riuscito");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-8 text-center">
        <p className="font-serif text-xl text-navy">Richiesta inviata.</p>
        <p className="mt-2 text-sm text-inkSoft">Grazie, ti risponderemo il prima possibile.</p>
      </div>
    );
  }

  return (
    <form
      name="preventivo"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="flex flex-col gap-5"
    >
      <p className="hidden">
        <label>
          Non compilare questo campo: <input name="bot-field" />
        </label>
      </p>

              <Field label="Nome e cognome *">
                <input required name="nome" value={form.nome} onChange={update("nome")} className={fieldInputClass} />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Email *">
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update("email")}
                    className={fieldInputClass}
                  />
                </Field>
                <Field label="Telefono">
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={update("telefono")}
                    className={fieldInputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Tipo di operazione *">
                  <select required name="tipo_atto" value={form.tipoAtto} onChange={updateTipoAtto} className={fieldInputClass}>
                    <option value="" disabled>
                      Seleziona…
                    </option>
                    {TIPO_ATTO_OPZIONI.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Sede di riferimento">
                  <select name="sede" value={form.sede} onChange={update("sede")} className={fieldInputClass}>
                    <option value="">Indifferente</option>
                    <option value="Nola">Nola</option>
                    <option value="San Felice a Cancello">San Felice a Cancello</option>
                  </select>
                </Field>
              </div>

              {/* Campi dinamici in base al tipo di atto selezionato */}
              {form.tipoAtto === "Acquisto casa da privato" && (
                <div className="flex flex-col gap-5 border-l-2 border-line pl-4">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Prima o seconda casa? *">
                      <select
                        required
                        name="prima_seconda_casa"
                        value={form.primaSecondaCasa}
                        onChange={update("primaSecondaCasa")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {PRIMA_SECONDA_CASA_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Compravendita/Mutuo *">
                      <select
                        required
                        name="compravendita_mutuo"
                        value={form.compravenditaMutuo}
                        onChange={update("compravenditaMutuo")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {COMPRAVENDITA_MUTUO_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  {form.compravenditaMutuo === "Compravendita e mutuo" && (
                    <Field label="Importo del mutuo *">
                      <input
                        required
                        type="text"
                        name="importo_mutuo"
                        value={form.importoMutuo}
                        onChange={update("importoMutuo")}
                        className={fieldInputClass}
                      />
                    </Field>
                  )}
                  <Field label="Prezzo di vendita *">
                    <input
                      required
                      type="text"
                      name="prezzo_vendita"
                      value={form.prezzoVendita}
                      onChange={update("prezzoVendita")}
                      className={fieldInputClass}
                    />
                  </Field>
                  <Field label="Rendita catastale *">
                    <input
                      required
                      type="text"
                      name="rendita_catastale"
                      value={form.renditaCatastale}
                      onChange={update("renditaCatastale")}
                      className={fieldInputClass}
                    />
                    <span className="text-xs text-inkSoft">
                      Indicare la rendita catastale del singolo immobile e, se presenti, delle eventuali{" "}
                      <span
                        title="Massimo un immobile in categoria C/6, un immobile in categoria C/7 ed un immobile in categoria C/2"
                        className="cursor-help underline decoration-dotted underline-offset-2"
                      >
                        pertinenze agevolabili
                      </span>
                    </span>
                  </Field>
                </div>
              )}

              {form.tipoAtto === "Acquisto casa da costruttore/soggetto IVA" && (
                <div className="flex flex-col gap-5 border-l-2 border-line pl-4">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Prima o seconda casa? *">
                      <select
                        required
                        name="prima_seconda_casa"
                        value={form.primaSecondaCasa}
                        onChange={update("primaSecondaCasa")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {PRIMA_SECONDA_CASA_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Compravendita/Mutuo *">
                      <select
                        required
                        name="compravendita_mutuo"
                        value={form.compravenditaMutuo}
                        onChange={update("compravenditaMutuo")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {COMPRAVENDITA_MUTUO_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  {form.compravenditaMutuo === "Compravendita e mutuo" && (
                    <Field label="Importo del mutuo *">
                      <input
                        required
                        type="text"
                        name="importo_mutuo"
                        value={form.importoMutuo}
                        onChange={update("importoMutuo")}
                        className={fieldInputClass}
                      />
                    </Field>
                  )}
                  <Field label="Prezzo di vendita *">
                    <input
                      required
                      type="text"
                      name="prezzo_vendita"
                      value={form.prezzoVendita}
                      onChange={update("prezzoVendita")}
                      className={fieldInputClass}
                    />
                  </Field>
                </div>
              )}

              {form.tipoAtto === "Acquisto terreni" && (
                <div className="flex flex-col gap-5 border-l-2 border-line pl-4">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Tipologia di terreno *">
                      <select
                        required
                        name="tipologia_terreno"
                        value={form.tipologiaTerreno}
                        onChange={update("tipologiaTerreno")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {TIPOLOGIA_TERRENO_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Compravendita/Mutuo *">
                      <select
                        required
                        name="compravendita_mutuo"
                        value={form.compravenditaMutuo}
                        onChange={update("compravenditaMutuo")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {COMPRAVENDITA_MUTUO_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  {form.compravenditaMutuo === "Compravendita e mutuo" && (
                    <Field label="Importo del mutuo *">
                      <input
                        required
                        type="text"
                        name="importo_mutuo"
                        value={form.importoMutuo}
                        onChange={update("importoMutuo")}
                        className={fieldInputClass}
                      />
                    </Field>
                  )}
                  <Field label="Prezzo di vendita *">
                    <input
                      required
                      type="text"
                      name="prezzo_vendita"
                      value={form.prezzoVendita}
                      onChange={update("prezzoVendita")}
                      className={fieldInputClass}
                    />
                  </Field>
                  <Field label="Agevolazioni *">
                    <select
                      required
                      name="agevolazioni"
                      value={form.agevolazioni}
                      onChange={update("agevolazioni")}
                      className={fieldInputClass}
                    >
                      <option value="" disabled>
                        Seleziona…
                      </option>
                      {AGEVOLAZIONI_OPZIONI.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {form.tipoAtto === "Atti societari" && (
                <div className="border-l-2 border-line pl-4">
                  <Field label="Tipologia *">
                    <select
                      required
                      name="tipologia_societaria"
                      value={form.tipologiaSocietaria}
                      onChange={update("tipologiaSocietaria")}
                      className={fieldInputClass}
                    >
                      <option value="" disabled>
                        Seleziona…
                      </option>
                      {TIPOLOGIA_SOCIETARIA_OPZIONI.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {form.tipoAtto === "Donazione casa" && (
                <div className="flex flex-col gap-5 border-l-2 border-line pl-4">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Prima o seconda casa? *">
                      <select
                        required
                        name="prima_seconda_casa"
                        value={form.primaSecondaCasa}
                        onChange={update("primaSecondaCasa")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {PRIMA_SECONDA_CASA_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Grado di parentela donatario *">
                      <select
                        required
                        name="grado_parentela"
                        value={form.gradoParentela}
                        onChange={update("gradoParentela")}
                        className={fieldInputClass}
                      >
                        <option value="" disabled>
                          Seleziona…
                        </option>
                        {GRADO_PARENTELA_OPZIONI.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Rendita catastale *">
                    <input
                      required
                      type="text"
                      name="rendita_catastale"
                      value={form.renditaCatastale}
                      onChange={update("renditaCatastale")}
                      className={fieldInputClass}
                    />
                    <span className="text-xs text-inkSoft">
                      Indicare la rendita catastale del singolo immobile e, se presenti, delle eventuali{" "}
                      <span
                        title="Massimo un immobile in categoria C/6, un immobile in categoria C/7 ed un immobile in categoria C/2"
                        className="cursor-help underline decoration-dotted underline-offset-2"
                      >
                        pertinenze agevolabili
                      </span>
                    </span>
                  </Field>
                </div>
              )}

              {form.tipoAtto === "Successioni" && (
                <div className="border-l-2 border-line pl-4">
                  <Field label="Tipologia *">
                    <select
                      required
                      name="tipologia_successione"
                      value={form.tipologiaSuccessione}
                      onChange={update("tipologiaSuccessione")}
                      className={fieldInputClass}
                    >
                      <option value="" disabled>
                        Seleziona…
                      </option>
                      {TIPOLOGIA_SUCCESSIONE_OPZIONI.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              <Field label="Informazioni aggiuntive">
                <textarea
                  name="messaggio"
                  rows={4}
                  value={form.messaggio}
                  onChange={update("messaggio")}
                  className={fieldInputClass}
                />
                <span className="text-xs text-inkSoft">
                  Scrivi ulteriori informazioni utili alla formulazione del preventivo
                </span>
              </Field>

              <Field label="Allega visure catastali (fino a 3 file)">
                <div className="flex flex-col gap-3">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="file"
                      name={`allegato_${i + 1}`}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={updateFile(i)}
                      className={fileInputClass}
                    />
                  ))}
                </div>
                <span className="text-xs text-inkSoft">
                  Facoltativo. Formati accettati: PDF, JPG, PNG — un file per campo.
                </span>
              </Field>

              <label className="flex items-start gap-3 text-xs text-inkSoft">
                <input required type="checkbox" name="privacy" className="mt-0.5 h-4 w-4 shrink-0 accent-navy" />
                <span>
                  Dichiaro di aver letto e compreso le informazioni contenute nella{" "}
                  <a href="/privacy-policy.html" target="_blank" rel="noopener" className="underline hover:text-navy">
                    Privacy Policy
                  </a>
                  . *
                </span>
              </label>

              {status === "error" && (
                <p className="text-sm text-red-700">
                  Si è verificato un errore nell'invio. Riprova oppure scrivi a fmlabella@notariato.it.
                </p>
              )}

              <Button type="submit" disabled={status === "sending"} className="mt-2 w-full sm:w-auto">
                {status === "sending" ? "Invio in corso…" : "Invia richiesta"}
              </Button>
    </form>
  );
}

/* ---------------------------------------------------------------- */
/* Icons custom al brand                                             */
/* ---------------------------------------------------------------- */
function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.36.101 11.943c0 2.105.548 4.16 1.588 5.971L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.005c6.582 0 11.941-5.36 11.944-11.943 0-3.192-1.243-6.19-3.494-8.443" />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Reveal on scroll                                                  */
/* ---------------------------------------------------------------- */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ className, children, ...props }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Header                                                             */
/* ---------------------------------------------------------------- */
const NAV_LINKS = [
  ["Studio", "#studio"],
  ["Aree", "#aree"],
  ["Sedi", "#sedi"],
  ["Contatti", "#contatti"],
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-offwhite/[0.18] bg-navy/95 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-24 max-w-[1180px] items-center justify-between gap-6 px-[clamp(24px,5vw,72px)]">
        <a href="#top" aria-label="Filippo Matteo La Bella, Notaio">
          <img className="h-[46px] w-auto" src="/assets/logo-invert.png" alt="Filippo Matteo La Bella — Notaio" />
        </a>

        <nav className="hidden items-center gap-10 text-sm tracking-[0.02em] lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href} className="group relative py-1 font-medium text-offwhite">
              {label}
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-offwhite transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Button asChild size="sm" variant="outlineInverse">
            <a href="/preventivo.html">Richiedi un preventivo</a>
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+390818231311"
            onClick={(e) => reportCallConversion(e, "tel:+390818231311")}
            className="hidden items-center gap-2.5 whitespace-nowrap font-serif text-base text-offwhite lg:flex lg:border-l lg:border-offwhite/[0.18] lg:pl-6"
          >
            <Phone className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            081 823 1311
          </a>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghostInverse" size="icon" className="lg:hidden" aria-label="Apri il menu">
                <Menu className="h-5 w-5" strokeWidth={1.6} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex h-24 items-center justify-between border-b border-offwhite/[0.18] px-7">
                <Dialog.Title className="font-serif text-lg italic text-offwhite/80">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Menu di navigazione dello studio notarile</Dialog.Description>
                <SheetClose asChild>
                  <Button variant="ghostInverse" size="icon" aria-label="Chiudi il menu">
                    <X className="h-5 w-5" strokeWidth={1.6} />
                  </Button>
                </SheetClose>
              </div>

              <nav className="flex flex-col gap-1 px-7 py-10">
                {NAV_LINKS.map(([label, href]) => (
                  <SheetClose asChild key={href}>
                    <a href={href} className="border-b border-offwhite/[0.12] py-3 font-serif text-3xl text-offwhite">
                      {label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a href="/preventivo.html" className="mt-6 text-left font-serif text-3xl italic text-offwhite/90">
                    Richiedi un preventivo
                  </a>
                </SheetClose>
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-offwhite/[0.18] px-7 py-8">
                <a
                  href="tel:+390818231311"
                  onClick={(e) => reportCallConversion(e, "tel:+390818231311")}
                  className="flex items-center gap-2.5 font-serif text-lg text-offwhite"
                >
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-offwhite" />
                  081 823 1311
                </a>
                <a href="https://wa.me/393760390780" target="_blank" rel="noopener" className="text-sm text-offwhite/70">
                  Scrivi su WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Hero                                                               */
/* ---------------------------------------------------------------- */
function Hero() {
  return (
    <section id="studio" className="relative overflow-hidden pb-[clamp(72px,10vw,130px)] pt-[clamp(64px,10vw,120px)]">
      <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-end gap-12 px-[clamp(24px,5vw,72px)] lg:grid-cols-[1.15fr_0.85fr]">
        <img
          src="/assets/logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-[4vw] -right-[2vw] z-0 h-auto w-[clamp(420px,46vw,820px)] select-none opacity-[0.06]"
        />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3.5">
            <span className="h-px w-10 bg-navy" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-inkSoft">Studio Notarile</span>
          </div>

          <h1 className="font-serif text-[clamp(44px,6.4vw,92px)] font-normal leading-[1.02] tracking-[-0.01em] text-navy">
            Filippo Matteo<br />
            <em className="font-normal italic">La Bella</em>
          </h1>
          <p className="mt-[18px] font-serif text-[clamp(20px,2.2vw,27px)] italic text-inkSoft">Notaio</p>
          <p className="mt-7 max-w-[50ch] text-[16.5px] text-inkSoft">
            Dal 2022 lo studio assiste privati, imprese e professionisti nella redazione di atti pubblici e
            nell'autenticazione di scritture private, con particolare esperienza in ambito immobiliare,
            societario, successorio e nella tutela del patrimonio familiare.
          </p>
          <p className="mt-4 max-w-[50ch] text-[16.5px] text-inkSoft">
            Un'attività condotta con rigore giuridico e attenzione alle esigenze di ciascun cliente, nelle sedi
            di San Felice a Cancello e Nola.
          </p>

          <div className="mt-10 hidden flex-wrap gap-4 lg:flex">
            <Button asChild>
              <a href="https://wa.me/393760390780" target="_blank" rel="noopener">
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                Scrivi su WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="tel:+390818231311" onClick={(e) => reportCallConversion(e, "tel:+390818231311")}>
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                Chiama lo studio
              </a>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 lg:hidden">
            <Button asChild>
              <a href="/preventivo.html">
                Richiedi un preventivo
                <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2} />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://wa.me/393760390780" target="_blank" rel="noopener">
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                Scrivi su WhatsApp
              </a>
            </Button>
            <Button asChild variant="soft">
              <a href="tel:+390818231311" onClick={(e) => reportCallConversion(e, "tel:+390818231311")}>
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                Chiama lo studio
              </a>
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-2 border-t border-line pb-1.5 pt-7 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
          <div className="mb-[18px] text-xs font-semibold uppercase tracking-[0.16em] text-inkSoft">Sedi dello studio</div>
          <ul className="list-none">
            <li className="border-b border-line py-2.5 pt-0 font-serif text-[19px] text-navy">
              Nola
              <span className="mt-[3px] block font-sans text-xs font-medium text-inkSoft">Via dell'Università, N. 16</span>
            </li>
            <li className="border-b border-line py-2.5 font-serif text-[19px] text-navy">
              San Felice a Cancello
              <span className="mt-[3px] block font-sans text-xs font-medium text-inkSoft">Via Roma, N. 129</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Aree di attività                                                    */
/* ---------------------------------------------------------------- */
const PRACTICE_AREAS = [
  {
    index: "01",
    title: "Immobiliare",
    text: "Compravendite, mutui e ogni altro atto finalizzato al trasferimento e alla gestione di beni immobili.",
  },
  {
    index: "02",
    title: "Societario",
    text: "Atti costitutivi, modifiche statutarie e operazioni straordinarie per imprese, società ed altri enti giuridici.",
  },
  {
    index: "03",
    title: "Successioni e donazioni",
    text: "Pianificazione del passaggio generazionale di patrimoni e imprese, mediante donazioni o predisposizione di testamenti pubblici e presentazione delle relative dichiarazioni di successione.",
  },
  {
    index: "04",
    title: "Volontaria giurisdizione",
    text: "Predisposizione dei ricorsi e/o rilascio delle autorizzazioni propedeutiche alla stipula di atti che coinvolgano minori, interdetti, inabilitati o beneficiari di amministrazione di sostegno.",
  },
];

function Aree() {
  return (
    <section id="aree" className="py-[clamp(72px,10vw,130px)]">
      <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,72px)]">
        <Reveal className="mb-[clamp(40px,6vw,64px)]">
          <div className="font-serif text-sm tracking-[0.08em] text-inkSoft">01 — Aree di attività</div>
          <h2 className="mt-2 font-serif text-[clamp(32px,4vw,48px)] font-normal text-navy">Come possiamo aiutarti</h2>
        </Reveal>

        <Reveal className="grid grid-cols-1 divide-y divide-line border-t border-line lg:grid-cols-4 lg:divide-y-0 lg:divide-x">
          {PRACTICE_AREAS.map((a) => (
            <div key={a.title} className="py-10 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <span className="font-serif text-[15px] italic text-inkSoft">{a.index}</span>
              <h3 className="mt-4 font-serif text-[22px] text-navy">{a.title}</h3>
              <p className="mt-3 text-[15px] text-inkSoft">{a.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Sedi                                                                */
/* ---------------------------------------------------------------- */
const HOURS = [
  ["Lunedì", "9:00 – 18:00"],
  ["Martedì", "9:00 – 18:00"],
  ["Mercoledì", "9:00 – 18:00"],
  ["Giovedì", "9:00 – 18:00"],
  ["Venerdì", "9:00 – 13:00"],
];

const OFFICES = [
  {
    index: "I",
    badge: "Studio di Nola",
    city: ["Nola"],
    address: "Via dell'Università, N. 16",
    mapsUrl: "https://maps.app.goo.gl/TEgE9StKTVH2YJmx8",
  },
  {
    index: "II",
    badge: "Studio di San Felice a Cancello",
    city: ["San Felice", "a Cancello"],
    address: "Via Roma, N. 129",
    mapsUrl: "https://maps.app.goo.gl/H7Thi5BoJqNuXNxf8",
  },
];

function Sedi() {
  return (
    <section id="sedi" className="bg-navy py-[clamp(72px,10vw,130px)] text-offwhite">
      <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,72px)]">
        <Reveal className="mb-[clamp(40px,6vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-serif text-sm tracking-[0.08em] text-offwhite/55">02 — Sedi</div>
            <h2 className="mt-2 font-serif text-[clamp(32px,4vw,48px)] font-normal text-offwhite">Dove trovarci</h2>
          </div>

          <div className="text-left lg:text-right">
            <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-offwhite/45">
              Orari di apertura
            </span>
            <div className="grid grid-cols-[auto_auto] justify-start gap-x-5 gap-y-[7px] lg:justify-end">
              {HOURS.map(([day, time]) => (
                <React.Fragment key={day}>
                  <span className="text-left font-serif text-[15.5px] text-offwhite/75">{day}</span>
                  <span className="whitespace-nowrap text-left font-serif text-[15.5px] font-medium text-offwhite [font-variant-numeric:tabular-nums]">
                    {time}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="grid grid-cols-1 border-t border-offwhite/[0.18] lg:grid-cols-2">
          {OFFICES.map((o, i) => (
            <div
              key={o.badge}
              className={cn(
                "py-11",
                i === 0 ? "lg:pr-14" : "border-t border-offwhite/[0.18] pt-11 lg:border-l lg:border-t-0 lg:pl-14"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-serif text-[15px] italic text-offwhite/50">{o.index}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">{o.badge}</span>
              </div>
              <h3 className="mt-[22px] font-serif text-[clamp(30px,3.4vw,42px)] font-normal text-offwhite">
                {o.city.map((line, idx) => (
                  <React.Fragment key={line}>
                    {idx > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h3>
              <p className="mt-3 text-base text-offwhite/70">{o.address}</p>
              <a
                className="group mt-[26px] inline-flex items-center gap-2 border-b border-offwhite/40 pb-[3px] text-[13.5px] font-semibold tracking-[0.02em] text-offwhite transition-all duration-300 hover:gap-3 hover:border-offwhite"
                href={o.mapsUrl}
                target="_blank"
                rel="noopener"
              >
                Indicazioni stradali
                <ArrowUpRight className="h-[13px] w-[13px]" strokeWidth={2} />
              </a>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Contatti                                                            */
/* ---------------------------------------------------------------- */
function ContactRow({ label, value, href, external, sub }) {
  const isPhoneLink = typeof href === "string" && href.startsWith("tel:");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      onClick={isPhoneLink ? (e) => reportCallConversion(e, href) : undefined}
      className="group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-line px-1 py-[30px] transition-all duration-300 hover:bg-paperDeep hover:pl-5 sm:grid-cols-[200px_1fr_auto]"
    >
      <span className="col-span-2 text-xs font-semibold uppercase tracking-[0.14em] text-inkSoft sm:col-span-1">
        {label}
      </span>
      <span className="break-all font-serif text-[clamp(19px,2.4vw,27px)] text-navy">
        {value}
        {sub && (
          <small className="mt-1 block font-sans text-[12.5px] font-normal normal-case tracking-normal text-inkSoft">
            {sub}
          </small>
        )}
      </span>
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:rotate-45 group-hover:border-navy group-hover:bg-navy">
        <ArrowUpRight className="h-3.5 w-3.5 stroke-navy transition-colors duration-300 group-hover:stroke-offwhite" strokeWidth={2} />
      </span>
    </a>
  );
}

function Contatti() {
  return (
    <section id="contatti" className="py-[clamp(72px,10vw,130px)]">
      <div className="mx-auto max-w-[1180px] px-[clamp(24px,5vw,72px)]">
        <Reveal className="mb-[clamp(40px,6vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-serif text-sm tracking-[0.08em] text-inkSoft">03 — Contatti</div>
            <h2 className="mt-2 font-serif text-[clamp(32px,4vw,48px)] font-normal text-navy">Recapiti dello studio</h2>
          </div>
        </Reveal>

        <Reveal className="border-t border-line">
          <ContactRow label="Centralino" value="081 823 1311" href="tel:+390818231311" />
          <ContactRow label="WhatsApp Business" value="376 039 0780" href="https://wa.me/393760390780" external />
          <ContactRow label="Email" value="fmlabella@notariato.it" href="mailto:fmlabella@notariato.it" />
          <ContactRow
            label="Posta certificata"
            value="filippomatteo.labella@postacertificata.notariato.it"
            href="mailto:filippomatteo.labella@postacertificata.notariato.it"
            sub="PEC — solo per comunicazioni via posta elettronica certificata"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                              */
/* ---------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 px-[clamp(24px,5vw,72px)]">
        <img className="h-[22px] opacity-[0.85]" src="/assets/logo.png" alt="Filippo Matteo La Bella — Notaio" />
        <div className="flex flex-wrap gap-7 text-[12.5px] text-inkSoft">
          <span>© 2026 Filippo Matteo La Bella, Notaio</span>
          <span>San Felice a Cancello · Nola</span>
          <a href="/privacy-policy.html" className="hover:text-navy">Privacy Policy</a>
          <a href="/cookie-policy.html" className="hover:text-navy">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- */
/* Pagina "Richiedi un preventivo"                                    */
/* ---------------------------------------------------------------- */
function QuotePageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-24 max-w-[1180px] items-center justify-between gap-6 px-[clamp(24px,5vw,72px)]">
        <a href="/" aria-label="Filippo Matteo La Bella, Notaio">
          <img className="h-[46px] w-auto" src="/assets/logo.png" alt="Filippo Matteo La Bella — Notaio" />
        </a>
        <a href="/" className="text-xs font-semibold uppercase tracking-[0.14em] text-navy hover:opacity-70">
          ← Torna al sito
        </a>
      </div>
    </header>
  );
}

export function QuotePage() {
  return (
    <div className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
      <QuotePageHeader />
      <main className="mx-auto max-w-[720px] px-[clamp(24px,5vw,72px)] py-[clamp(56px,8vw,96px)]">
        <div className="font-serif text-sm tracking-[0.08em] text-inkSoft">Contattaci</div>
        <h1 className="mt-2 font-serif text-[clamp(32px,4.4vw,48px)] font-normal text-navy">Richiedi un preventivo</h1>
        <p className="mt-4 max-w-[60ch] text-[15.5px] text-inkSoft">
          Compila il modulo con i dati della tua richiesta: i campi mostrati cambiano in base al tipo di
          pratica selezionato. Ti risponderemo al più presto per fornirti un preventivo. I campi con * sono
          obbligatori.
        </p>
        <div className="mt-10">
          <QuoteForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* App                                                                 */
/* ---------------------------------------------------------------- */
export default function App() {
  return (
    <div id="top" className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
      <Header />
      <main>
        <Hero />
        <Aree />
        <Sedi />
        <Contatti />
      </main>
      <Footer />
    </div>
  );
}
