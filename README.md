# Sito Studio Notarile Filippo Matteo La Bella

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

### 4. Attiva le notifiche email del form "Richiedi un preventivo"

Il bottone "Richiedi un preventivo" apre un modulo che usa **Netlify Forms** (incluso gratuitamente, nessun servizio esterno da configurare). Perché le richieste arrivino via email a `fmlabella@notariato.it`, dopo il primo deploy:

1. Nel pannello Netlify del sito, vai su "Forms" (compare in automatico dopo il primo deploy che include il form).
2. Dovresti vedere un modulo chiamato "preventivo" nell'elenco — significa che Netlify lo ha riconosciuto correttamente.
3. Vai su "Settings" del form (o "Forms → Notifications") → "Add notification" → "Email notification".
4. Inserisci `fmlabella@notariato.it` come indirizzo di destinazione e salva.

Da quel momento ogni richiesta compilata sul sito arriverà automaticamente via email. Puoi anche consultare tutte le richieste ricevute (ed eventuali allegati) direttamente nel pannello Netlify, sezione "Forms".

**Nota sugli allegati**: Netlify Forms accetta un solo file per campo, per questo il modulo ha tre campi distinti "Allega visure catastali" (fino a 3 file). L'email di notifica di Netlify non allega il file direttamente: contiene un link che rimanda al file archiviato nel pannello Netlify, sezione "Forms" — quindi i file restano su Netlify finché non cancelli manualmente la relativa richiesta (consigliato farlo periodicamente se il modulo raccoglie dati sensibili, vedi sezione "Forms → Submissions" per esportare/cancellare le richieste).

## Modifiche future

Ogni volta che vorrai modificare qualcosa, potrai chiedermelo: aggiornerò i file in questa cartella (`src/App.jsx` contiene tutti i contenuti e la grafica del sito) e dovrai solo ricaricare i file aggiornati su GitHub — Netlify ricompila e ripubblica automaticamente il sito ad ogni aggiornamento.

## Struttura del progetto

- `src/App.jsx` — tutti i contenuti e componenti del sito (testi, sezioni, contatti)
- `src/main.jsx` — punto di avvio dell'applicazione
- `src/index.css` — stili globali (Tailwind CSS)
- `public/assets/` — logo e icone
- `tailwind.config.js` — colori e font del brand
