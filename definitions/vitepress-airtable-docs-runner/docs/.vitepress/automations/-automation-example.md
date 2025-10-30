<script setup lang="ts">
import ScrollableScreenshot from '../components/ScrollableScreenshot.vue';
</script>

# Automation: {{AUTOMATION_NAME}}

**Purpose**
Describe what this automation accomplishes and why it exists. Explain its role within the workflow — what triggers it, what it updates or creates, and how it helps users avoid manual work.

<ScrollableScreenshot src="/automations/{{automation-slug}}.png" />

---

## Prompt for Airtable Omni

(Use this section to describe the logic for recreating the automation via AI or manually.)

```text
Create an automation:

• Trigger
  - Type: “{{TRIGGER_TYPE}}”
  - Table: {{TRIGGER_TABLE}}
  - {{TRIGGER_DETAILS}}

• Action 1: {{ACTION_1_TYPE}}
  - Table: {{ACTION_1_TABLE}}
  - Conditions:
      1. {{ACTION_1_CONDITION_1}}
      2. {{ACTION_1_CONDITION_2}}
  - Output variable: {{ACTION_1_OUTPUT}}

• Action 2: {{ACTION_2_TYPE}}
  - Table: {{ACTION_2_TABLE}}
  - Conditions:
      1. {{ACTION_2_CONDITION_1}}
      2. {{ACTION_2_CONDITION_2}}
  - Output variable: {{ACTION_2_OUTPUT}}

• Action 3: {{ACTION_3_TYPE}}
  - Table: {{ACTION_3_TABLE}}
  - Set fields:
      - {{FIELD_1}} → {{VALUE_1}}
      - {{FIELD_2}} → {{VALUE_2}}
      - ...
```

*Paste or adapt this block for the **AI Assist** prompt inside Airtable Automations. Replace the placeholders to match your tables and fields.*

---

## Notes & Variations

* Document any key assumptions (e.g., fields that must exist, naming conventions, linked record behavior).
* Mention possible variants or improvements (like additional filters, update actions, or email notifications).
* Optionally, add links to related tables or automations to clarify dependencies.
