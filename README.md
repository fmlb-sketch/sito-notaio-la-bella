si# Sito Studio Notarile Filippo Matteo La Bella

Questo è il progetto sorgente del sito, pronto per essere compilato e pubblicato online. A differenza del file `index.html` di anteprima nella cartella principale, questa versione viene "compilata" prima di andare online: più veloce, più affidabile, adatta a un sito pubblico definitivo.

## Come pubblicarlo online (senza installare nulla sul tuo computer)

### 1. Carica questa cartella su GitHub

1. Crea un account gratuito su [github.com](https://github.com) (se non ne hai già uno).
2. Crea un nuovo repository (es. chiamato `sito-notaio-la-bella`).
3. Carica tutti i file di questa cartella `site/` nel repository (puoi trascinarli direttamente dalla pagina web di GitHub, sezione "Add file → Upload files").

### 2. Collega il repository a Netlify

1. Crea un account gratuito su [netlify.com](https://netlify.com) (puoi accedere direttamente con l'account GitHub).
2. Clicca "Add new site" → "Import an existing project" → scegli GitHub e seleziona il repository appena creato.
3. Netlify riconoscerà automaticamente le impostazioni di build (comando `npm run build`, cartella `dist`) grazie al file `netlify.toml` già incluso.
4. Clicca "Deploy": in un paio di minuti il sito sarà online con un indirizzo tipo `nome-a-caso.netlify.app`.

### 3. Collega il tuo dominio (opzionale)

Se hai già acquistato un dominio (es. `notaiolabella.it`) o vuoi acquistarne uno:

1. Nel pannello Netlify del sito, vai su "Domain settings" → "Add a domain".
2. Segui le istruzioni per puntare il dominio al sito (di solito basta modificare i record DNS presso il tuo fornitore del dominio).

## Modifiche future

Ogni volta che vorrai modificare qualcosa, potrai chiedermelo: aggiornerò i file in questa cartella (`src/App.jsx` contiene tutti i contenuti e la grafica del sito) e dovrai solo ricaricare i file aggiornati su GitHub — Netlify ricompila e ripubblica automaticamente il sito ad ogni aggiornamento.

## Struttura del progetto

- `src/App.jsx` — tutti i contenuti e componenti del sito (testi, sezioni, contatti)
- `src/main.jsx` — punto di avvio dell'applicazione
- `src/index.css` — stili globali (Tailwind CSS)
- `public/assets/` — logo e icone
- `tailwind.config.js` — colori e font del brand
