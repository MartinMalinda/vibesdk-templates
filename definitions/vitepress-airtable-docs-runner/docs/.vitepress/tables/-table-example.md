---

title: {{TABLE_NAME}}
outline: deep
-------------

<script setup lang="ts">
import FieldIcon from './components/FieldIcon.vue';
import ScrollableScreenshot from '../components/ScrollableScreenshot.vue';
</script>

# {{TABLE_NAME}}

[Open in Airtable]({{AIRTABLE_TABLE_URL}})

## Purpose

<!--what this table tracks and why it exists. Keep it concrete and user-facing. Don't make it too long. -->

{{TABLE_PURPOSE}}

<!-- Optional screenshot or live embed; keep one. -->
<!-- <ScrollableScreenshot src="/tables/{{table-slug}}.png" /> -->

<!--
<iframe
  class="airtable-embed"
  src="{{AIRTABLE_EMBED_URL}}"
  frameborder="0"
  width="100%"
  height="230"
  style="background: transparent; border: 1px solid #ccc;"
></iframe>
-->

## Fields

> Replace rows with your real schema. Keep “Type / Field / Key Options or Formula / Notes”.
> Use `FieldIcon` types: singleLineText, date, duration, singleSelect, multipleSelects, currency, number,
> checkbox, multipleRecordLinks, multipleLookupValues, rollup, formula, multilineText, attachment, collaborator.

| Type                                      | Field                            | Key Options / Formula                                                 | Notes                                                                       |
| ----------------------------------------- | -------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| <FieldIcon type="singleLineText" />       | **Name**                         | —                                                                     | Short label/title for the record.                                           |
| <FieldIcon type="date" />                 | **Date**                         | Format `l`                                                            | Drives time-based reporting.                                                |
| <FieldIcon type="duration" />             | **Duration**                     | Format `h:mm`                                                         | Airtable stores seconds; formulas divide by 3600 for hours.                 |
| <FieldIcon type="singleSelect" />         | **Status**                       | ▫︎ Planned ▫︎ In progress ▫︎ Done                                     | Tailor to your workflow.                                                    |
| <FieldIcon type="multipleSelects" />      | **Tags**                         | (example) ▫︎ Ops ▫︎ Dev ▫︎ Meeting                                    | Use sparingly; powers filtering.                                            |
| <FieldIcon type="multipleRecordLinks" />  | **{{PARENT_TABLE_NAME}}**        | —                                                                     | Primary link (e.g., “Client”, “Project”). Set first if you snapshot fields. |
| <FieldIcon type="currency" />             | **Rate (snapshot)**              | —                                                                     | Copied from linked {{PARENT_TABLE_NAME}} on create; does not retro-update.  |
| <FieldIcon type="singleSelect" />         | **Currency**                     | ▫︎ EUR ▫︎ USD ▫︎ CZK                                                  | Snapshot to lock historical rows.                                           |
| <FieldIcon type="formula" />              | **Value**                        | `{Rate (snapshot)} * ({Duration}/3600)`                               | Monetary value in native currency.                                          |
| <FieldIcon type="formula" />              | **Value ({{REPORT_CC}})**        | <details><summary>Formula</summary>`{{FX_FORMULA_EXAMPLE}}`</details> | Optional FX for consolidated reporting.                                     |
| <FieldIcon type="multipleRecordLinks" />  | **{{DOWNSTREAM_TABLE_NAME}}**    | —                                                                     | Attach when item moves downstream (e.g., “Invoice”).                        |
| <FieldIcon type="multipleLookupValues" /> | **{{DOWNSTREAM_STATUS_FIELD}}**  | from {{DOWNSTREAM_TABLE_NAME}} → **{{STATUS_FIELD}}**                 | Surfaced status (e.g., Draft/Sent/Paid).                                    |
| <FieldIcon type="checkbox" />             | **Settled**                      | `IF({{DOWNSTREAM_STATUS_FIELD}}='Paid', TRUE(), FALSE())`             | Auto-tick when downstream is paid/closed.                                   |
| <FieldIcon type="multilineText" />        | **Details**                      | —                                                                     | Notes, links, ticket IDs.                                                   |
| <FieldIcon type="multipleLookupValues" /> | **Rate (from {{PARENT_TABLE}})** | Lookup from {{PARENT_TABLE_NAME}} → **Rate**                          | For auditing: current value on parent.                                      |
| <FieldIcon type="multipleLookupValues" /> | **Currency (from {{PARENT}})**   | Lookup from {{PARENT_TABLE_NAME}} → **Currency**                      | For auditing: current value on parent.                                      |

## Relationships

<!-- use mermaid classDiagram and terminology: "has many" | "belongs to" -->

```mermaid
classDiagram
  {{TABLE_NAME | slug}} --> "1" {{PARENT_TABLE_NAME | slug}} : "belongs to"
  {{TABLE_NAME | slug}} --> "0..1" {{DOWNSTREAM_TABLE_NAME | slug}} : "linked to"
  %% Add more links as needed
```

<!-- Provide links to other tables -->

* **[{{PARENT_TABLE_NAME}}]({{AIRTABLE_PARENT_TABLE_URL}})** (linked via *{{PARENT_LINK_FIELD}}*)
* **[{{DOWNSTREAM_TABLE_NAME}}]({{AIRTABLE_DOWNSTREAM_TABLE_URL}})** (linked via *{{DOWNSTREAM_LINK_FIELD}}*)
* Optional: **[{{ANOTHER_TABLE}}]({{AIRTABLE_ANOTHER_TABLE_URL}})**

## Gotchas

Describe potential pitfalls one could reach when working with this table.

## Clarifications

Notable highlights from the table schema — for example, context on key relationships, calculated fields, or usage conventions.
