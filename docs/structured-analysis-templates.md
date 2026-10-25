# Structured analysis templates

Production Planning and Personal Finance provide guidance for local analysis of
XLSX and CSV datasets using the shared Structured Data Analysis engine.

## Portable configuration

Both JSON files use `format: siaas-project-v1`. Each defines one project with a
name, description, project color and one assistant with name, description,
instructions, `model: null` and `sources: []`. Production Planning uses project
color `#173D35`; Personal Finance uses `#244C78`. There are no assistant colors,
credentials, private records, local folders or filesystem paths. No schema
extension is needed: dataset guidance is instruction text; real mappings belong
to the user's local assistant database and never travel in template exports.

The current three templates and schema are unchanged. The draft app ships five
presets through a generated offline snapshot pinned to the template commit.
A future adoption requires `templates:sync` in each consumer; committing JSON
here does not update an installed application or deploy website content.

## Production Planning

[Exact JSON reviewed](https://github.com/siaas-software/siaas-templates/blob/7ec5a819be9051242f1b9f94317629f593f1d265/templates/production-planning.json).
Assistant: **Production Planning Analyst**. Purpose: analyze production and
operational records locally, compare requirements and availability, and report
traceable shortages or missing information. It is not an ERP, MRP, MES or APS.

| Optional dataset | Suggested fields and validation |
| --- | --- |
| Bill of Materials / Recipes | Product/material codes, descriptions, required quantities, units, instructions; confirm per-unit/per-batch/weight basis |
| Palletization | Product code, cartons/layer, layers/pallet, cartons/pallet, weights/dimensions; confirm rounding and units |
| Workforce / Production Lines | Employee ID, role, skills, line, required staffing, capacity and compatibility; descriptive constraint checks only |
| Inventory | Product/material code, available/reserved quantities, unit, minimum stock; confirm whether available already excludes reserved |
| Sales Orders | Order ID, product code, quantity, delivery date, status; confirm dates/statuses in scope |
| Purchase Orders | Purchase order ID, material, ordered/received quantity, expected date; arrivals are not current stock |
| Sales History | Product, date, quantity sold, reference period |

Column names are suggestions. Users map their own XLSX/CSV columns, confirm
headers/types and unit partitions, and configure directional relationships.
Validate uniqueness, cardinality and matching identifiers; do not assume codes
match. Product/material/order/line/employee keys are only candidates.

Example: orders require 8 units of product A and 2 units of B. Confirm a recipe
of 2 kg of M per A and 3 kg of M per B; the generic engine computes 22 kg required.
With 17 kg available in a confirmed compatible inventory dataset, the difference
is 5 kg. Missing inventory is unknown, not zero. Aggregate each dataset at the
intended grain before joining, so repeated stock/order rows do not double count.
Use an anti join to identify ordered products absent from the BOM.

Technical instructions remain descriptive Knowledge and can accompany computed
results. Reports identify files, worksheets, columns, filters, relationships and
calculation methods. Formula caches require explicit acceptance. Partial datasets
are useful, with omitted inputs named. There is no optimizer: do not claim an
optimal schedule, workforce allocation or verified production feasibility.
Pallet quantities are estimates unless capacities and rounding are confirmed.

## Personal Finance

[Exact JSON reviewed](https://github.com/siaas-software/siaas-templates/blob/7ec5a819be9051242f1b9f94317629f593f1d265/templates/personal-finance.json).
Assistant: **Personal Finance Analyst**. Purpose: understand local financial
records with deterministic totals and explicit currency/completeness safeguards.

| Optional dataset | Suggested fields and validation |
| --- | --- |
| Bank Transactions | Date, description, amount, currency, account, transaction ID |
| Income / Expenses | Date, category, amount, transaction type, description |
| Monthly Budgets | Month, category, planned budget, actual spending |
| Savings Goals | Goal ID/description, target/current amount, target date |

Confirm debit/credit signs, account scope, dates and categories. Prevent double
counting transfers or overlapping exports. Configure relationships on verified
IDs, accounts, categories, currencies and normalized budget periods. Inferred
categories and recurring-payment candidates need user review.

Example: two confirmed EUR expenses of 10.10 and 20.20 produce 30.30 EUR. A USD
expense remains a separate group. Against a 50 EUR budget, planned minus actual
is 19.70 EUR; state the variance sign convention. Missing budgets/transactions
remain unknown. Never combine currencies without explicit, confirmed conversion
data/rates/dates. Average monthly spending requires the complete period set,
not just months that contain records. Savings rate requires nonzero income.

Duplicate detection returns candidates, not deletions or proof of fraud. Numerical
evidence comes from the engine, while explanations are labeled as AI text.
No invented records, guaranteed savings/returns or unsupported investment, tax
or legal conclusions. All private financial data stays in the local assistant.

## Validation and licensing

The implementation report records template project creation, confirmed mappings,
production shortages, finance totals/currencies, export privacy and regression
tests. Those historical fixture/API results do not demonstrate real-model quality
or graphical Windows/macOS behavior. Model-free query plans work independently
of Ollama; invalid model output must produce a limitation, not invented totals.

Original template instructions are under this repository's MIT license. Templates
do not redistribute websites, spreadsheets, confidential recipes, bank data or
model weights. Public source URLs in older templates are references, not licenses
to redistribute those pages. Imported data and AI models retain their own terms.
