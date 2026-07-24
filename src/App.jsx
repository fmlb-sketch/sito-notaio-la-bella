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
/* shadcn/ui — Button                                                */
/* ---------------------------------------------------------------- */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-sm font-semibold tracking-wide transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border border-navy bg-navy text-offwhite hover:bg-navyDeep hover:border-navyDeep",
        outline: "border border-navy bg-transparent text-navy hover:bg-navy hover:text-offwhite",
        ghost: "text-navy hover:bg-paperDeep",
        ghostInverse: "text-offwhite hover:bg-white/10",
      },
      size: {
        default: "px-[26px] py-[15px]",
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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-24 max-w-[1180px] items-center justify-between gap-6 px-[clamp(24px,5vw,72px)]">
        <a href="#top" aria-label="Filippo Matteo La Bella, Notaio">
          <img className="h-[46px] w-auto" src="/assets/logo.png" alt="Filippo Matteo La Bella — Notaio" />
        </a>

        <nav className="hidden items-center gap-10 text-sm tracking-[0.02em] lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href} className="group relative py-1 font-medium text-navy">
              {label}
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-navy transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+390818231311"
            className="hidden items-center gap-2.5 whitespace-nowrap font-serif text-base text-navy sm:flex lg:border-l lg:border-line lg:pl-6"
          >
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-navy" />
            081 823 1311
          </a>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Apri il menu">
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
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-offwhite/[0.18] px-7 py-8">
                <a href="tel:+390818231311" className="flex items-center gap-2.5 font-serif text-lg text-offwhite">
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
            Lo studio assiste privati, imprese e professionisti nella redazione di atti pubblici e
            nell'autenticazione di scritture private, con particolare esperienza in ambito immobiliare,
            societario, successorio e nella tutela del patrimonio familiare. Un'attività condotta con rigore
            giuridico e attenzione alle esigenze di ciascun cliente, nelle sedi di San Felice a Cancello e Nola.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild>
              <a href="https://wa.me/393760390780" target="_blank" rel="noopener">
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                Scrivi su WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="tel:+390818231311">
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
    text: "Compravendite, mutui, donazioni e ogni atto relativo al trasferimento e alla gestione di beni immobili.",
  },
  {
    index: "02",
    title: "Societario",
    text: "Costituzione di società, modifiche statutarie e operazioni straordinarie per imprese e professionisti.",
  },
  {
    index: "03",
    title: "Successioni e donazioni",
    text: "Pianificazione successoria, dichiarazioni di successione e donazioni per il passaggio generazionale del patrimonio.",
  },
  {
    index: "04",
    title: "Famiglia e tutela del patrimonio",
    text: "Accordi patrimoniali tra coniugi e conviventi, e strumenti a tutela del patrimonio personale e familiare.",
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
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
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
        </div>
      </div>
    </footer>
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
