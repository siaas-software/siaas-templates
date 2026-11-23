# SIAAS Personal Templates

The canonical source for the Personal project templates used by [SIAAS Personal](https://github.com/siaas-software/siaas-personal) and the [public website](https://siaas.vercel.app/).

## Templates

| Template | Assistants | Importable file |
| --- | --- | --- |
| Computer Science Study | 3 | [computer-science-study.json](templates/computer-science-study.json) |
| Production Planning | 1 | [production-planning.json](templates/production-planning.json) |
| Personal Finance | 1 | [personal-finance.json](templates/personal-finance.json) |
| Construction Cost Analysis | 1 | [construction-cost-analysis.json](templates/construction-cost-analysis.json) |
| Technical Documentation | 1 | [technical-documentation.json](templates/technical-documentation.json) |
| Materials & Procurement | 1 | [materials-procurement.json](templates/materials-procurement.json) |
| PDF Maintenance Acceptance Review | 2 | [pdf-maintenance-acceptance.json](templates/pdf-maintenance-acceptance.json) |
| Spreadsheet Purchase Order Reconciliation | 2 | [spreadsheet-purchase-reconciliation.json](templates/spreadsheet-purchase-reconciliation.json) |
| Business Launch & Business Plan | 5 | [business-launch-plan.json](templates/business-launch-plan.json) |
| AI Image Studio (RC7 test preset) | 2 | [ai-image-studio.json](templates/ai-image-studio.json) |
| AI Video Studio (RC7 test preset) | 2 | [ai-video-studio.json](templates/ai-video-studio.json) |

Download a JSON file and import it from Templates in SIAAS Personal. Files now use `siaas-project-v2` (catalog version 2); updated Personal consumers also accept legacy `siaas-project-v1` files. Each assistant owns a `sources` array of public URL strings and has `model: null`, allowing a recommendation for the destination computer. Color belongs only to the project. Documents, local folders, local paths, downloaded content, embeddings, chats and indexing metadata are never exported.

Creating a project from a template registers sources even offline. Supported pages are fetched and indexed locally when available; failed or pending sources can be retried from Knowledge. Source enablement is local; all imported sources start enabled. These links reference third-party pages, whose availability and extraction restrictions may change.

Catalog-only categories, display order and translations live in `listings.json`. The generated `catalog.json` combines them with the portable definitions for app/site maintainers; importable files in `templates/` contain only `format` and `project`.

## Contribute

1. Edit or add a file under `templates/`. Keep existing filenames stable: these are the built-in template IDs used to preserve users' changes and deletions.
2. Provide the project configuration in `templates/` and its category, display order and English/Italian descriptions in `listings.json`. Never add `listing` to portable files.
3. Run `npm run build` and `npm test` with Node.js 22+ (no dependencies to install).
4. Commit the template files and generated `catalog.json` together.
5. In each consumer repository run `npm run templates:sync -- --ref <commit-sha>` and commit the generated data and `templates-source.json`.

The consumers keep generated snapshots for offline use and reproducible builds. They no longer own template definitions. A catalog update is deliberately adopted by commit SHA; it does not silently replace a user's saved templates. The template repository is public. Maintainers pin a reviewed catalog revision; end users use the bundled snapshot without repository credentials. For a local checkout, add `--catalog ../siaas-templates/catalog.json` to the sync command.

## License

Original code and content in this repository are licensed under [MIT](LICENSE).
Third-party dependencies retain their own licenses.

## Structured analysis templates

Production Planning and Personal Finance use the shared analytical engine. Read the
[input datasets, examples and limitations](docs/structured-analysis-templates.md).

This repository has no npm runtime dependencies. Its MIT license covers original
template instructions and repository code, not user data, referenced websites or
model weights. No private data is included in the official template files.

## Structured Data Analysis templates

`production-planning` and `personal-finance` use SIAAS Personal's local Structured
Data Analysis engine. Import the portable JSON through Templates, create a project,
choose an installed local Ollama model, and upload XLSX/CSV files in the assistant's
Knowledge. Review and confirm each worksheet's header, column types and currency/unit
partitions, then explicitly configure any cross-file relationships. Dataset values,
local paths and confirmed mappings are never included in these templates.

Production Planning covers orders versus stock, BOM requirements, outstanding
purchase orders, missing product codes and pallet estimates. Recipe quantity bases,
units, stock semantics and join cardinality must be verified. It is not a scheduling
or workforce optimization solver. Personal Finance covers transactions, spending,
budgets, duplicate candidates and savings analysis. Confirm debit/credit sign conventions,
period completeness and currencies; absent transactions are not zero.

Example: ask "Compare orders with inventory and show shortages" after mapping
product identifiers and aggregating each side at product grain. For finance ask
"Group spending by month, category and currency" after confirming the transaction
amount convention. Partial datasets remain useful; assistants explain unavailable
inputs instead of inventing them. Formula caches may be stale and need explicit
acceptance in Knowledge. Financial analysis is factual assistance, not a guarantee
or a substitute for investment, tax or legal expertise.

The application ships an offline snapshot pinned to this repository's commit.
Adding files here alone does not update installed applications: maintainers must
run the app's `templates:sync -- --catalog <checkout>/catalog.json --ref <commit>`
and commit both its generated snapshot and `templates-source.json`. Existing projects and user-saved configurations remain unchanged when the official catalog changes.

## Semantic palettes

The optional `project.palette` extension introduced in `siaas-project-v1` names a palette in
SIAAS Personal's authoritative `src/lib/project-colors.ts` `PROJECT_PALETTES`.
All eight official definitions supply it. Consumers that support the extension use
its background, foreground and accent; `project.color` remains the compatible
hexadecimal fallback for older consumers. Bundles without a palette remain valid
legacy imports. This repository validates identifiers, but does not duplicate the
application's palette values. Catalog version and bundle format are now 2; v1 imports remain supported by updated Personal consumers.

| Template | Palette | Importable file |
| --- | --- | --- |
| Computer Science Study | sky | [JSON](templates/computer-science-study.json) |
| Production Planning | slate | [JSON](templates/production-planning.json) |
| Personal Finance | mint | [JSON](templates/personal-finance.json) |
| Construction Cost Analysis | peach | [JSON](templates/construction-cost-analysis.json) |
| Technical Documentation | lavender | [JSON](templates/technical-documentation.json) |
| Materials & Procurement | aqua | [JSON](templates/materials-procurement.json) |
| PDF Maintenance Acceptance Review | lavender | [JSON](templates/pdf-maintenance-acceptance.json) |
| Spreadsheet Purchase Order Reconciliation | aqua | [JSON](templates/spreadsheet-purchase-reconciliation.json) |
| Business Launch & Business Plan | lemon | [JSON](templates/business-launch-plan.json) |
| AI Image Studio (RC7 test preset) | rose | [JSON](templates/ai-image-studio.json) |
| AI Video Studio (RC7 test preset) | slate | [JSON](templates/ai-video-studio.json) |

The legacy hex values are retained unchanged. Adoption is explicit and SHA-pinned;
a catalog update never changes saved projects or user-customized configurations.

## Portable project chat configuration (v2)

Each `siaas-project-v2` bundle includes `project.orchestration`:
`enabled` (off by default), coordinator `instructions`, `share_results`
(off by default), `assistant_indices` (zero-based positions in the portable
`project.assistants` array) and `max_steps` (1–8). Up to eight unique indexes
are allowed. Enabling orchestration requires at least one participant within
the configured step budget.

No local UUIDs, conversations, model credentials or documents travel in the
template. SIAAS Personal maps indices to newly generated assistant IDs inside
the destination project; each assistant retains its own model, Knowledge scope
and Hybrid Router. Sharing output is separately opted in and grants no access
to another assistant's files or URLs. Import does not automatically enable
orchestration, and catalog adoption never overwrites existing customized work.

v1 remains importable by updated Personal applications; older releases supporting
only v1 cannot consume v2. Consumers adopt the reviewed catalog by exact SHA.
Public-site adoption is a separate change.

## Gemma multi-assistant test templates

Two **synthetic but operationally realistic** fixtures are documented in
[the Gemma example guide](docs/gemma-template-examples.md): a two-step PDF
maintenance acceptance review and an Excel/CSV purchase-order reconciliation.
Templates have `model: null` for portability: select your installed
`gemma4:e4b-it-q4_K_M` (or another compatible local Ollama model) **after**
creating the project. Model capabilities, real tool calling and accurate answers
must be confirmed in the application. Import the PDF and CSV fixtures locally;
the JSON template carries no user documents. By default, coordinator and
cross-assistant result sharing remain **disabled** and must be opted into.

## Business launch and plan project

The [Business Launch & Business Plan guide](docs/business-launch-plan.md) describes the five role-separated assistants, required evidence, launch and financial checks, synthetic scenario dataset, acceptance tests and limits. The v2 official template stays disabled for orchestration and result sharing until the user opts in. For **RC5** manual testing, the standalone [v1-compatible example](examples/business-launch-plan/business-launch-plan-rc5-v1.json) has the same five assistant definitions but no v2 orchestration settings; it is deliberately excluded from the catalog. Both definitions contain no user data or configured websites. This template is a preparation and drafting aid, not automated business registration, independent live market research or a guaranteed funding-grade financial model.

## RC7 media generation acceptance presets (not yet available in RC5/RC6)

[AI Image Studio](templates/ai-image-studio.json) and [AI Video Studio](templates/ai-video-studio.json) are **official test configurations** for the proposed RC7 runtime, not a claim that image or video native tools are already implemented. They are model-agnostic, contain no executable code, weights, local paths, private sources or credentials, and have orchestration and result sharing disabled by default. stable-diffusion.cpp is the only proposed generative backend; FFmpeg performs deterministic video processing only. See [the acceptance guide](docs/media-generation-acceptance.md). Do not automatically update a Personal consumer before its runtime and template schema pass acceptance.
