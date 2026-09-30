# Prism Editorial

A standalone, English-language demonstration of a context-led editorial platform. Turquoise and purple product styling; all organizations, experts, examples and article comparisons in the demo are fictional.

## Demo access

- Email: `sales@prism.demo`
- Password: `PrismDemo!26`

This is a public demonstration gate, not secure authentication. Credentials are intentionally shared, and the static source is visible. Do not enter confidential information. No personal AI account, API key, external model, analytics or paid service is connected.

## What works

- Two article frameworks: how-to and comparison/listicle.
- Four prepared topics with editable brief title, keyword, audience and angle.
- Topic-based context selection from an editable knowledge base.
- Saved source snapshots per article.
- Direction review, expert question packet, answers and completed-brief approval.
- Prepared article assembly incorporating expert responses and selected knowledge.
- Human approval gates, Markdown editing, two prepared rewrite actions, revision history and restoration.
- Rule-based editorial checks, search, status/type filters and activity history.
- Markdown and formatted HTML export.
- Browser-local persistence and resettable examples.

## Demonstration boundaries

No live AI, web research, market research or SEO metrics are generated. All topic bodies are prepared scenarios, not arbitrary-topic generation. Brief edits and target length are editorial requirements to review; the prepared engine does not infer arbitrary instructions or guarantee a word count. Expert answer fields and source excerpts are inserted as supplied. The editor checks factual accuracy, relevance and tone. All roles are performed by one demo user. Each browser has its own data; this is not shared storage.

## Run locally

No installation or build required:

```sh
python3 -m http.server 4173 --directory prism-editorial
```

Open `http://localhost:4173`. If already inside this folder, omit `--directory prism-editorial`. Serve over HTTP; ES modules do not load reliably from a `file://` URL.

## GitHub Pages

Upload the files in this folder to the root of a repository. In repository Settings > Pages, select **Deploy from a branch**, **main**, **/(root)**, then save. This app uses relative asset paths and hash routes, so repository subpaths and refreshing a route work without a server rewrite.

## Future production implementation

Keep the interface and replace the prepared engine with a separately deployed, authenticated service. Add server-side identities and roles, a shared database, durable workflow state, document ingestion, retrieval with citations, an isolated model provider account, request quotas, audit logging, quality evaluations and permission checks. Enforce every approval transition on the server. Never put model provider keys in browser code. Production costs and estimates belong in the separate delivery guide, not this public demo.

## Files

- `data.js`: fictional knowledge, templates and prepared topic material.
- `engine.js`: context selection, brief/draft assembly, safe text rendering and checks.
- `app.js`: interface, local state, approval workflow and exports.
- `styles.css`: responsive product styling.
- `index.html`, `favicon.svg`: application entry and identity.

Source material from private projects is not included in this repository.
