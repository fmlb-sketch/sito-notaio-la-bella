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

### 4. Attiva l'invio email del form "Richiedi un preventivo"

Il bottone "Richiedi un preventivo" invia i dati (compresi gli eventuali allegati, es. visure catastali) a una piccola funzione del sito che spedisce subito una email a `fmlabella@notariato.it` tramite **Resend**, un servizio di invio email con un piano gratuito. A differenza di Netlify Forms, i file allegati non vengono mai salvati da nessuna parte: passano solo per la durata dell'invio e poi vengono scartati.

Per attivarlo, dopo aver collegato il sito a Netlify (punto 2):

1. Crea un account gratuito su [resend.com](https://resend.com).
2. Nel pannello Resend, vai su "Domains" → "Add Domain" e inserisci `notaiofilippomatteolabella.it`. Resend mostrerà alcuni record DNS (TXT/CNAME) da aggiungere presso il tuo fornitore del dominio: questo passaggio serve perché le email arrivino da un indirizzo del tuo dominio (es. `preventivi@notaiofilippomatteolabella.it`) invece che finire più facilmente nello spam. La verifica richiede di solito pochi minuti/ore.
3. Nel pannello Resend, vai su "API Keys" → "Create API Key" e copia la chiave generata (inizia con `re_...`).
4. Nel pannello Netlify del sito, vai su "Site configuration" → "Environment variables" → "Add a variable" e crea una variabile chiamata `RESEND_API_KEY` con il valore della chiave copiata al punto precedente. Non condividere né incollare mai questa chiave altrove (email, chat, repository).
5. Rifai il deploy del sito (basta un nuovo caricamento su GitHub, oppure "Trigger deploy" nel pannello Netlify) perché la funzione venga creata con la variabile disponibile.

Da quel momento ogni richiesta compilata sul sito arriverà come email vera e propria (allegati inclusi) a `fmlabella@notariato.it`, senza restare archiviata su Netlify. Se in futuro vuoi cambiare l'indirizzo di destinazione, basta chiedermelo: è una singola riga nel file `netlify/functions/send-quote.mjs`.

## Modifiche future

Ogni volta che vorrai modificare qualcosa, potrai chiedermelo: aggiornerò i file in questa cartella (`src/App.jsx` contiene tutti i contenuti e la grafica del sito) e dovrai solo ricaricare i file aggiornati su GitHub — Netlify ricompila e ripubblica automaticamente il sito ad ogni aggiornamento.

## Struttura del progetto

- `src/App.jsx` — tutti i contenuti e componenti del sito (testi, sezioni, contatti)
- `src/main.jsx` — punto di avvio dell'applicazione
- `src/index.css` — stili globali (Tailwind CSS)
- `public/assets/` — logo e icone
- `tailwind.config.js` — colori e font del brand
- `netlify/functions/send-quote.mjs` — funzione che invia via email (Resend) le richieste del form "Richiedi un preventivo", allegati inclusi, senza salvarli su Netlify
