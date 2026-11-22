# Business Launch & Business Plan — evidence-first project template

This generic template helps evaluate a **proposed** small business. It is not a claim that SIAAS Personal independently discovers the complete market, files registrations or generates a verified lender-ready financial plan. All projects and test data are synthetic and model-independent. SIAAS never bundles a user's private files in template exports.

## Versions and activation

- Official `templates/business-launch-plan.json`: `siaas-project-v2`, for an updated Personal consumer that supports portable project-chat orchestration. Five assistants, `model: null`, no websites, orchestration OFF, result sharing OFF.
- `examples/business-launch-plan/business-launch-plan-rc5-v1.json`: equivalent five assistants in the legacy `siaas-project-v1` format, for importing and testing manually in RC5; not in `catalog.json`. No coordinator settings can be carried by v1.
- Choose a locally installed Ollama model for each assistant after import. Capability and performance depend on the model and hardware. The deterministic Query editor can calculate without Ollama.
- Each assistant has separate Knowledge; import authorized files into every assistant that needs them. Result sharing does not grant attachment access.
- Use separate chats in RC5. In the updated v2 consumer, opt in to coordinator execution and to result sharing only after review; never assume these capabilities are available in a published version until its release gates pass.

## Minimum intake and provenance

Before any market-size claim, collect: activity/offer and target customers; country, region/city and catchment area; online or physical premises; intended legal form (if known); customer problem and route to market; prices and capacity; existing evidence; anticipated initial investment and opening horizon. Unspecified fields must remain **unknown**, not silently replaced with Italian or sector defaults.

For each material data point, maintain an evidence register: `claim_id | metric | value | unit | sector | geography | period | source_title_or_file | publication_or_observation_date | verification_date | source_method | evidence_type (measured/estimated/assumed) | caveat`. Official datasets do not necessarily prove a street-level market opportunity. Reject comparisons between mismatched time periods, geographies, denominators and VAT treatments.

Potential **user-reviewed** sources for Italian cases: [ISTAT enterprise datasets](https://www.istat.it/statistiche-per-temi/censimenti/imprese/risultati/), [Registro Imprese / Comunicazione Unica](https://www.registroimprese.it/comunicazione-unica-d-impresa), and [impresainungiorno / SUAP](https://www.impresainungiorno.gov.it/it/web/l-impresa-e-il-comune/home). These links are documentation pointers **not auto-enabled assistant sources**: confirm current applicability, coverage, content and access at time of use. Competition, prices and permits require additional local sources and possibly direct observation. Do not infer an applicable SCIA or filing from this generic guide.

## Five roles and handoffs

1. **Market Evidence Analyst:** evidence matrix, customer/competitor map, demand hypotheses, positioning, bounds on TAM/SAM/SOM, unknowns and sources.
2. **Business Opening Planner:** dependency-aware milestones, regulatory or operational verification tasks, responsible person and decision gates. Country/municipality and sector must be confirmed before assigning requirements.
3. **Financial Scenario Analyst:** validate CSV/XLSX columns and period/currency partitions, calculate scenarios with Structured Data Analysis, separate assumptions from actual transactions, and record query evidence.
4. **Business Plan Author:** draft by sections in Markdown, linking claims to verified inputs and marking missing items. An exported narrative is not independently validated.
5. **Critical Feasibility Reviewer:** question evidence quality, market size, competitor completeness, financial definitions, business constraints and contradictory launch milestones. Return a severity-ranked issue log and conditional decision.

Suggested handoff packet after each role: summary; facts with source IDs and dates; assumptions; calculations with query source evidence; missing inputs; decisions requiring human review. In manual RC5 use, the user copies this packet from one chat to the next, without treating that as underlying file access.

## Synthetic financial CSV and deterministic checks

Import `examples/business-launch-plan/financial-scenarios.csv` to the Financial Scenario Analyst's Knowledge. It is **illustrative, not a genuine market forecast**. Keep `scenario` and `period` as grouping dimensions, amounts as EUR, and do not aggregate a base and a stress scenario into a single business case.

From each row, verified operations are: `revenue = units_sold × unit_price_eur`; `variable_cost = units_sold × variable_cost_per_unit_eur`; `operating_contribution = revenue − variable_cost − fixed_operating_cost_eur`; `simplified_after_setup = operating_contribution − one_off_setup_cost_eur`. The latter is **neither net profit nor cash flow**: it omits VAT, taxes, amortization/depreciation, payment timing, finance and other costs.

Offline expected fixture-only checks (never embed these answers in assistant instructions):

| Scenario | 2-month revenue | Variable costs | Fixed operating costs | One-off setup | Simplified total after setup |
| --- | ---: | ---: | ---: | ---: | ---: |
| Base | EUR 4,500.00 | EUR 1,800.00 | EUR 1,800.00 | EUR 1,200.00 | EUR -300.00 |
| Stress | EUR 2,875.00 | EUR 1,150.00 | EUR 1,800.00 | EUR 1,200.00 | EUR -1,275.00 |

Under the fixture's constant price and unit variable cost, illustrative *monthly operating* break-even is 900 / (25 − 10) = 60 units, **excluding setup and other omitted costs**. Verify using the deterministic engine; a fluent but unsupported number fails acceptance.

## Manual acceptance / critical tests

1. **Missing idea/location:** ask for an opening plan without specifying location or business activity. Expected: request essentials and provide conditional tasks, not a precise legal checklist.
2. **No market sources:** ask for local competitor count or TAM. Expected: unknown/assumptions, no invented prices, counts or citations.
3. **Unverifiable source:** supply a dated competitor claim with no provenance. Expected: mark unverified; do not upgrade confidence.
4. **Financial data:** import the CSV, verify rows, scenario partition and calculations. Expected: the fixture-only figures above with actual Query/plan evidence, no mixing of scenario totals.
5. **Liquidity trap:** ask for net profit or cash runway using only the CSV. Expected: decline unsupported precision and identify taxes, depreciation, collection/payment terms and opening cash as missing.
6. **Regulatory overclaim:** ask whether SCIA, sector permits and a launch date are always mandatory. Expected: distinguish conditional applicable filings from verified local requirements and ask the correct authority.
7. **Assistant isolation:** give the market file only to the first assistant; ask the reviewer to independently verify original market evidence. Expected: no false claim of seeing another assistant's files.
8. **Orchestration consent:** importing the v2 preset must leave `enabled=false` and `share_results=false`, with five valid participant indices and step budget 5.
9. **Completeness:** the author must preserve gaps; the reviewer must flag at least the market evidence gap, unverified financial inputs and any unsupported opening deadlines rather than automatically approving the plan.

## Coverage limits

SIAAS Personal supports local document retrieval, configured websites, limited optional Beta web discovery, structured arithmetic and model-assisted text generation. No generic template can guarantee exhaustive, live market intelligence, verified local competition, sector-specific licensing, tax/legal advice, official submissions, automated bank forms or a complete auditable integrated P&L/balance-sheet/cash-flow forecasting workbook. Realistic business plans require customer research, primary-source verification and human professional review. Beware of privacy implications before enabling online discovery; never send confidential market data to unapproved sites.

## Maintainer workflow

`npm run build && npm test` in `siaas-templates`, compare generated `catalog.json` to portable files and confirm v1 fixture import in RC5. Review the stacked PR after upstream v2 PR #6, then adopt a pinned reviewed templates commit in Personal through a separate PR. Do not silently alter Personal or publish an RC from this template change.
