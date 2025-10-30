<script setup lang="ts">
import ScrollableScreenshot from '../components/ScrollableScreenshot.vue';
</script>

# {{INTERFACE_NAME}} Interface

**Purpose**
Describe the goal and function of this interface — who uses it, what data it exposes or edits, and how it fits into the overall base workflow. Mention if it’s meant for internal staff, clients, or collaborators.

Typical points to include:

* Whether access is **read-only** or **editable**
* Which tables or views are displayed
* Any special filters (e.g., show only current user’s records)
* How users are invited or authenticated (e.g., email matching, shared link)

Users can:

* {{USER_ACTION_1}}
* {{USER_ACTION_2}}
* {{USER_ACTION_3}}

<ScrollableScreenshot src="/interfaces/{{interface-slug}}.png" />

---

## Notes

* Mention visibility rules or linked record filters.
* Note any formulas or fields that control what appears (e.g., email match logic, role filtering).
* Include tips for extending or duplicating the interface for other users/groups.
