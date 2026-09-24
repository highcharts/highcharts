---
name: api-ref-tone
description: Tone of voice guidance for Highcharts API reference doclets - covering sentence structure, vocabulary, and phrasing patterns for public-facing TS doclets.
---

# Highcharts API Reference - Tone of Voice

Use this skill when writing or reviewing JSDoc/TSDoc doclets on public-facing TypeScript members (classes, methods, properties, events, options). Do **not** apply to `@internal` members.

Read `ts/DOCLETS.md` for tag syntax, formatting rules, and tooling. Linting enforces structural formatting - this skill covers wording and tone only.

---

## Core principles

- **Factual, not instructional.** Describe what something *is* or *does*, not what the developer *should* do.
- **Neutral, third-person.** No "you", "we", "your chart", "our API".
- **Concise first sentence.** The opening sentence is the summary. It must stand alone in generated docs. Keep it to one clear clause. Drop "This property…", "This method…", "This option…" - the tag already states the type.
- **Present tense throughout.** "Returns a string", not "Will return a string".

---

## Opening sentence patterns by member type

| Member type | Pattern | Example |
|---|---|---|
| Property - specific instance | "The \<thing\> of the \<owner\>." | `The current pixel width of the chart.` |
| Property - singular optional/abstract item | "A \<thing\> for \<purpose\>." | `A class name for the data label.` |
| Property - collection | "A collection of \<things\>." / "An array containing \<things\>." | `All the current series in the chart.` |
| Property - boolean (on/off toggle) | "Whether \<condition\>." | `Whether the chart is in styled mode, meaning all presentational attributes are avoided.` |
| Property - boolean (feature enable/disable) | "Enable or disable \<feature\>." | `Enable or disable the data labels.` |
| Method | Imperative verb phrase naming what it returns or achieves. | `Translate a value in terms of axis units into pixels within the chart.` |
| Event callback | "Fires when \<condition\>." | `Fires when a point is clicked.` |
| Callback/function property | "Callback function to \<purpose\>." | `Callback function to format the data label as a string.` |
| Options interface / container object | "The \<name\> options for \<owner/context\>." | `The tooltip options for each individual series.` |

**"Whether" vs "Enable or disable":** Use `"Whether"` when the boolean controls a behavioral condition. Use `"Enable or disable"` when the option's sole purpose is switching a named feature on or off (e.g. `enabled`, `animation`).

---

## Vocabulary choices

**Prefer:**
- "Returns" (not "Gives back", "Gets", "Provides")
- "The chart" / "the axis" / "the series" (lowercase, no definite article repetition)
- "pixels" (not "px" in prose)
- `` `undefined` `` / `` `null` `` (code font in prose)
- "the plot area" (not "plotting area" or "canvas")
- "styled mode" (not "CSS mode")
- "options" (not "config", "configuration", "settings")
- "Read only." as a sentence prefix for immutable computed members (in addition to `@readonly`)

**Programmatic references** — option names, property names, and API identifiers in prose must be either in backticks or rephrased to natural language. Never leave them bare.
- Good: "Enable data labels for the series." - natural language
- Good: "Enable `dataLabels` for the series." - programmatic backtick-wrapped
- Bad: "Enable dataLabels for the series." - bare identifier reference

**Avoid:**
- "simply", "easily", "just", "straightforward"
- "allows you to", "lets you", "enables you to" - rephrase as a noun phrase
- "Note that", "Please note", "Keep in mind"
- Passive voice where active is available ("The chart redraws" not "The chart is redrawn")

---

## Multi-sentence structure

The first sentence is the summary. Everything after adds precision:

1. **Clarify edge cases** on a separate sentence: *"In a logarithmic axis, this is the logarithm of the real value…"*
2. **Defaults or fallbacks** as a separate sentence, but prefer `@default` tag over a sentence with the same info.
3. **Cross-reference related members** at the end of the description, before tags.

---

## Wording in tag descriptions

`@param` and `@return` descriptions follow the same wording style as property descriptions: capital letter, definite article, full sentence. *"The pixel value coordinate."* not *"pixel value coordinate"*.

For cross-references: use `{@link}` inline in prose for direct object/method references; use `@see` for "also relevant" pointers. For option-tree paths use the full URL form: `[xAxis.categories](https://api.highcharts.com/highcharts/xAxis.categories)`.

---

## Common mistakes to avoid

| Wrong | Right |
|---|---|
| `Get the series by its id.` | `Returns the series, axis, or point matching the given id.` |
| `This property contains the current height.` | `The current pixel height of the chart.` |
| `Alignment method for data labels.` | `The alignment method for data labels.` |
| `How many decimals to show in each series' y value.` | `The number of decimals shown for each series' y value.` |
| `Note that in logarithmic axes…` | `In a logarithmic axis, this is the logarithm of the real value.` |
| `Fires when the user clicks a point.` | `Fires when a point is clicked.` (avoid attributing to "the user") |
| `An optional boolean that controls…` | `Whether \<condition\>.` |
| `A configuration object for the tooltip rendering of each series.` | `The tooltip options for each individual series.` (use "options", not "configuration object"; use "The" for a specific instance) |
| `Whether to render the xAxis.` | `Whether to render the x-axis.` or `Whether to render the` `` `xAxis` `` `.` (bare identifier - rephrase or wrap in backticks) |
| `Enable dataLabels for the series.` | `Enable data labels for the series.` or `Enable` `` `dataLabels` `` `for the series.` (natural language does not require hyphens - "data labels", not "data-labels") |
