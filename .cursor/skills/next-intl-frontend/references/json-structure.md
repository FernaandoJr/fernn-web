# JSON message shape (no translation arrays)

## Rule

**Do not** use JSON arrays for user-visible repeating content (feature cards, command tables, FAQ items, etc.). Use:

1. **Keyed objects** under a stable prefix (`home.features.slashFirst.title`, …).
2. A **`as const` array of those keys in TypeScript** to define render order.

Translators add/edit **keys**, not array positions. Code owns **order**.

## Example: features block

**JSON** (`locales/en/common.json` excerpt):

```json
{
  "home": {
    "features": {
      "slashFirst": {
        "title": "Slash-first experience",
        "description": "…"
      },
      "moderation": {
        "title": "Moderation toolkit",
        "description": "…"
      }
    }
  }
}
```

**TS** (Server or Client component):

```ts
const FEATURE_KEYS = ["slashFirst", "moderation"] as const

// with getTranslations / useTranslations as `t`:
FEATURE_KEYS.map((key) => (
  <li key={key}>
    <h3>{t(`home.features.${key}.title`)}</h3>
    <p>{t(`home.features.${key}.description`)}</p>
  </li>
))
```

## Example: commands table

Use one object per command with at least `name` (slash string) and `description`:

```json
"home": {
  "commands": {
    "ping": {
      "name": "/ping",
      "description": "…"
    }
  }
}
```

```ts
const COMMAND_KEYS = ["ping", "ship"] as const

COMMAND_KEYS.map((key) => (
  <tr key={key}>
    <td>{t(`home.commands.${key}.name`)}</td>
    <td>{t(`home.commands.${key}.description`)}</td>
  </tr>
))
```

## Sync across locales

Every locale file (`en`, `es`, `ptBR`, …) must expose the **same key paths**. Values differ; structure must match. After adding a key in `en`, add it everywhere before merging.

## Why avoid JSON arrays

- Order-only changes in JSON reorder translations silently.
- Harder to grep/review diffs per logical item.
- Type generators and strict `t()` typings often struggle with tuple message shapes.
