# Two realistic Gemma acceptance exercises (synthetic data)

These are **sample templates, not a new PDF generator or accounting service**.
All people, organizations, dates and amounts are fabricated as a reproducible
non-confidential test case, chosen to match common maintenance acceptance and
procurement workflows. No claim is made that actual Gemma execution has passed.

## 1. PDF Maintenance Acceptance Review

Import [pdf-maintenance-acceptance.json](../templates/pdf-maintenance-acceptance.json)
through Templates, create a project, and select your installed local Ollama Gemma
model separately on **both** assistant chats. For a concrete run, use the PDF
`examples/gemma-pdf-maintenance-acceptance/acceptance-case.pdf` (or export the
text source in that folder to a searchable PDF); the PDF is *fixture data*, not
part of the template JSON. Upload the PDF to the **PDF Evidence Reader** Knowledge
and, for independent verification, also to **PDF Findings Reviewer** Knowledge.
Wait for ready/processed status. A local embedding service may be useful for
semantic search; native read_document can inspect available chunks when supported.

Ask the first assistant: "From FM-2026-017, list R1-R4 with document/page
citations and distinguish supplier claims from acceptance evidence."

Ask the second assistant: "Which evidence is missing for acceptance, and why
would it be premature to sign off? Provide a short Markdown findings report."

Expected evidence: 12 F7 filters are **claimed** replaced; delivery/service
note dated 2026-11-03 versus contractual deadline 2026-10-31; missing signed
checklist, measurements for AHU-01/AHU-02, serial numbers and commissioning
date. No measured airflow is available; no acceptance or compliance assertion.
The date comparison is three calendar days but a late service-note date alone
does not prove the date actual work occurred; distinguish these concepts.

For project-chat delegation, **opt in** to orchestration and optionally
`share_results` after choosing the ordered two assistants; passing the first
text report does not give the second assistant its PDF access. No automatic
PDF-output promise: `create_report` generates a downloadable **Markdown**
report, which the user can separately convert to PDF if needed.

## 2. Spreadsheet Purchase Order Reconciliation

Import [spreadsheet-purchase-reconciliation.json](../templates/spreadsheet-purchase-reconciliation.json)
through Templates. Select local Gemma separately on each assistant.
Load the two small, ordinary, non-confidential CSV datasets into the Knowledge
of the **Spreadsheet Data Inspector** and **Deterministic Invoice Analyst**:

- `examples/gemma-spreadsheet-purchase-reconciliation/purchase-orders.csv`
- `examples/gemma-spreadsheet-purchase-reconciliation/supplier-invoices.csv`

In Knowledge, check readiness, column types, currency grouping, and the
relation on (`po_number`, `line_id`); never join by item name alone.
The synthetic exercise has three order lines and three invoice lines, one
invoice line per order line; production data may have partial/multiple invoices
and requires **aggregation before joining**. The CSVs use **EUR net amounts**,
no VAT, freight, credits or FX, and positive quantities.

Ask the inspector: "Inspect my two datasets. Check keys, types and join
cardinality. Do not compute totals before confirming the mapping."

Ask the analyst: "Calculate ordered and invoiced net totals using validated
local Structured Data Analysis, identify quantity and unit-price discrepancies,
and show source, column and calculation evidence."

**Expected deterministic results from the fixtures (not from Gemma):**

| Metric | Expected |
| --- | ---: |
| Ordered net total | EUR 296.00 |
| Invoiced net total | EUR 261.00 |
| Arithmetic difference | EUR 35.00 |
| FILT-A ordered/invoiced | 12 / 10 units |
| BOLT-C ordered/invoiced unit price | EUR 0.80 / 0.90 |
| BOLT-C price delta across 20 invoiced units | EUR 2.00 |

**Crucial:** an ordered-versus-invoiced quantity gap is *not* evidence of
undelivered goods. A model producing unsupported totals, ignoring `currency`
or inventing VAT is **FAIL**. If structured JSON planning fails or times out,
use the **model-free Query editor** to run a verified plan; record the model
failure separately. Never count a deterministic fallback as a Gemma PASS.

## Gemma and acceptance boundaries

- The portable JSON intentionally retains `model: null`; it must not assume a
  local Ollama install, machine path, model digest or credentials.
- `gemma4:e4b-it-q4_K_M` is an **example known model identifier**, not a
  guaranteed available model. Select a model shown in SIAAS. Native agents
  require Ollama `completion` + `tools` capabilities; some models can chat
  but cannot execute agent tools. The app can still run deterministic queries
  without an LLM.
- Coordinator and result sharing start **off**. When testing project-chat,
  enable them explicitly; chosen project participants still have isolated
  Knowledge and individual per-assistant routers.
- Test sequentially with the PDF and CSV scenarios, first each chat, then
  optional project-chat routing; record model digest, tool calls, elapsed time,
  correct/incorrect evidence and whether tool calling was actually observed.
- Published RC5 does **not** accept the new v2 bundles. Use the candidate v2
  consumer PR or a later release after executable validation and publication.
