# {{BASE_NAME}} Airtable Base

Describe what this Airtable base is designed to manage and the problems it solves. Provide an overview of its purpose, key workflows, and the type of users it’s meant for (e.g., freelancers, agencies, internal finance teams).

Typical points to include:

* **Core objective** — what area of work or process the base organizes (e.g., billing, content management, HR tracking).
* **Key automations or efficiencies** — what the base does automatically or simplifies.
* **Main views or interfaces** — highlight how users interact with the data.
* **Who it benefits** — clarify roles or perspectives (team, client, accountant, etc.).

Use this intro to set context for anyone opening the documentation — what they can expect to learn and how to navigate the sections.

## Tables and their relationships

Describe the main tables and how they connect. Include a diagram when possible.

```mermaid
classDiagram
  {{TABLE_1}} <|-- {{TABLE_2}}
  {{TABLE_1}} <|-- {{TABLE_3}}
  {{TABLE_1}} <|-- {{TABLE_4}}

  {{TABLE_5}} --> {{TABLE_1}}
  {{TABLE_5}} <|-- {{TABLE_2}}
  {{TABLE_5}} <|-- {{TABLE_3}}

  {{TABLE_6}} "0..1" --|> {{TABLE_2}}
  {{TABLE_6}} "0..1" --|> {{TABLE_3}}
  {{TABLE_6}} "0..1" --|> {{TABLE_4}}
```

*Replace or extend this diagram to represent your base’s schema visually.*
