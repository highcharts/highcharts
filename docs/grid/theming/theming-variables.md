---
sidebar_label: "Variables"
---

# Theming variables

Highcharts Grid includes a set of predefined CSS variables for theming. By defining global variables, such as `--hcg-font-size`, `--hcg-background`, `--hcg-padding` etc., you establish a baseline style for the entire grid. To customize specific sections, replace the global prefix (`--hcg`) with a section-specific prefix, such as `--hcg-header` or `--hcg-caption`. For example, the global variable `--hcg-padding` becomes `--hcg-header-padding` for headers. If no section-specific variable is defined, the grid defaults to the global value.

The part of the variable name following the prefix corresponds 1:1 to the associated CSS property, such as `padding`, `font-size` or `background`. This makes it intuitive to understand the expected values and their behavior.

## Fonts

### Globals

Global font variables apply to all sections of the grid unless overridden.

| Variable          | Default Value   | Valid Values                                                                |
| ----------------- | --------------- | --------------------------------------------------------------------------- |
| --hcg-font-family | System fonts \* | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-font-size   | 1rem            | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)     |
| --hcg-font-weight | normal          | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-color       | #000000/#ffffff | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)             |
| --hcg-text-align  | left            | [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)   |

\* System fonts: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif.

### Section Prefixes

Use these prefixes to refine fonts for specific sections.

| Section Prefix    | Fallback   |
| ----------------- | ---------- |
| --hcg-cell        | Globals    |
| --hcg-header      | --hcg-cell |
| --hcg-description | Globals    |
| --hcg-caption     | Globals    |

### Example

This example sets a base font family and size for the entire grid, caption uses a larger font size and column headers are bold.

```css
.theme-custom {
    --hcg-font-family: Arial, sans-serif;
    --hcg-font-size: 14px;
    --hcg-caption-font-size: 20px;
    --hcg-header-font-weigth: bold;
}
```

## Table backgrounds and colors

**Note:**: If you created a custom theme before Highcharts Grid 2.2, you should read the section below on [deprecated and removed variables](https://www.highcharts.com/docs/grid/theming/theming-variables#deprecated-and-removed-variables).

### Globals

An HTML table does not have an explicit layering model, but the theming system is based on a layered approach: the table forms the base layer, followed by columns, then rows, with cells on top. As a result, if e.g. columns and rows use the same background color, the row background takes precedence and the column background will not be visible. While this distinction is usually irrelevant in static themes, it becomes important when styling specific elements, such as highlighting an individual column. 

| Variable         | Default Value | Valid Values                                                              |
| ---------------- | ------------- | ------------------------------------------------------------------------- |
| --hcg-background | transparent   | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-color       | Fonts Global | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)           |
| --hcg-hover-opacity \* | 100% | [opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/opacity)             |

\* Only applies to hover state background (see below)

### Base Section Prefixes

Use these prefixes to set base backgrounds and colors for specific sections.

| Section Prefix | Fallback  |
| -------------- | --------- |
| --hcg-column      | Globals   |
| --hcg-column-even | --hcg-column |
| --hcg-row      | --hcg-column   |
| --hcg-row-even | --hcg-row |
| --hcg-cell   | --hcg-row   |
| --hcg-header   | --hcg-cell   |
| --hcg-header-even   | --hcg-header   |

### Hover Section Prefixes

Use these prefixes to set backgrounds and colors for hover states.

| Section Prefix            | Fallback |
| ------------------------- | -------- |
| --hcg-column-hover        | --hcg-column     |
| --hcg-column-hover-header | --hcg-column-hover     |
| --hcg-row-hover           | --hcg-row     |
| --hcg-cell-hover          | --hcg-cell     |
| --hcg-header-hover        | --hcg-column-hover      |

### Example

This example sets a base background color for the entire grid. Header and even rows then use darker colors. On row hover it will be colored with a transparent red, due to `--hcg-row-hover-opacity`. In addition the header uses a brighter font color for increased contrast.

```css
.theme-custom {
    --hcg-background: #dedede;
    --hcg-header-background: #505050;
    --hcg-row-even-background: #cbcbcb;
    --hcg-header-color: #dedede;
    --hcg-row-hover-color: red;
    --hcg-row-hover-opacity: 5%;
}
```

**Tip:** If you need hover backgrounds for multiple sections, such as row, column and cell it's often best to use one single hover color, and then adjust opacity if needed. This approach also makes sure that odd rows or columns have their own matching tint.

```css
.opacity-theme {
    --my-hover-color: blue;
    --hcg-hover-opacity: 5%;
    --hcg-column-even-background: #cbcbcb;
    --hcg-row-hover-background: var(--my-hover-color);
    --hcg-column-hover-background: var(--my-hover-color);
    --hcg-cell-hover-background: var(--my-hover-color);
    --hcg-cell-hover-opacity: 50%; /* Override to make cell hover stand out more */
}
```

### Sync Section Prefixes

When using Highcharts Grid as a component in Highcharts Dashboards, [synchronization highlights cells, rows and columns](https://www.highcharts.com/docs/dashboards/synchronize-components). By default the hover states are used for sync as well, but can be overridden by using sync section prefixes instead.

All hover section prefixes have their sync equiequivalent, so e.g. `--hcg-column-hover-color` can be overriden by `--hcg-column-sync-color`.

## Borders

### Globals

Global border variables define the appearance of the outer table border and the borders between rows and columns.

| Variable               | Default Value   | Valid Values                                                                    |
| ---------------------- | --------------- | ------------------------------------------------------------------------------- |
| --hcg-border-width     | 0               | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)   |
| --hcg-border-style     | solid           | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style)   |
| --hcg-border-color     | #000000/#ffffff | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color)   |
| --hcg-border-radius \* | 0               | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |

\* `--hcg-border-radius` applies only to the outer table border, not individual cells.

### Section Prefixes

Use these prefixes to refine borders by section. If no section-specific variables are defined, global values are used (except for `--hcg-border-radius`).

| Section Prefix      | Fallback     |
| ------------------- | ------------ |
| --hcg-row           | Global       |
| --hcg-column        | Global       |
| --hcg-header-row    | --hcg-row    |
| --hcg-header-column | --hcg-column |

### Example

This example starts with a 3px global border. Rows and columns have narrower borders, and header column borders use a different style and color.

```css
.theme-custom {
    --hcg-border-width: 3px;
    --hcg-border-color: #000000;
    --hcg-row-border-width: 1px;
    --hcg-column-border-width: 2px;
    --hcg-header-column-border-color: #eeeeee;
    --hcg-header-column-border-style: dashed;
}
```

## Padding

### Globals

Global padding is applied to all table cells, header, caption and description. Use `--hcg-horizontal-padding` and `--hcg-vertical-padding` for finer control. If these aren’t defined, `--hcg-padding` applies to all sides.

| Variable                 | Fallback      | Default Value | Valid Values                                                                       |
| ------------------------ | ------------- | ------------- | ---------------------------------------------------------------------------------- |
| --hcg-padding            |               | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |
| --hcg-horizontal-padding | --hcg-padding | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |
| --hcg-vertical-padding   | --hcg-padding | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |

### Section Prefixes

Use these prefixes to customize padding for specific sections.

| Section Prefix    | Fallback |
| ----------------- | -------- |
| --hcg-header      | Globals  |
| --hcg-caption     | Globals  |
| --hcg-description | Globals  |

### Example

This example sets global padding to 8px, reduces vertical padding for headers, and removes horizontal padding for caption.

```css
.theme-custom {
    --hcg-padding: 8px;
    --hcg-header-vertical-padding: 4px;
    --hcg-caption-horizontal-padding: 0;
}
```

## Links

If `format` or `formatter` are used to insert links in table cells, or caption/description, the following variables can be used to style them. Color and font weight is always inherited from the parent element.

| Variable                           | Default value | Valid Values                                                                        |
| ---------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| --hcg-link-color                   | Parent        | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)                     |
| --hcg-link-text-decoration         | underline     | [text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) |
| --hcg-link-font-weight             | Parent        | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)         |
| --hcg-link-hovered-color           | Parent        | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)                     |
| --hcg-link-hovered-text-decoration | underline     | [text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) |

## Putting It All Together

Define a few global variables for a consistent base style. Use section-specific prefixes to refine headers, captions, rows, and columns and more. Use your own custom variables to avoid repetition.

Check our [theming demo](https://www.highcharts.com/demo/grid/grid-theming) to see theming in action.

## Deprecated and removed variables

### Section Prefixes

If you created a custom theme before **Highcharts Grid 2.2**, you should review it to see whether it uses any of these deprecated section prefixes and update it accordingly. The behavior remains unchanged; only the prefix have been updated.

| Deprecated prefix         | New prefix                |
| ------------------------- | ------------------------- |
| --hcg-cell-hovered        | --hcg-cell-hover          |
| --hcg-cell-hovered-row    | --hcg-row-hover           |
| --hcg-cell-hovered-column | --hcg-column-hover        |
| --hcg-cell-hovered-header | --hcg-column-hover-header |
| --hcg-header-hovered      | --hcg-header-hover        |
| --hcg-cell-synced         | --hcg-cell-sync           |
| --hcg-cell-synced-row     | --hcg-row-sync            |
| --hcg-cell-synced-column  | --hcg-column-sync         |
| --hcg-cell-synced-header  | --hcg-column-sync-header  |
| --hcg-header-synced       | --hcg-header-sync         |

So e.g. the deprecated variable `--hcg-cell-hovered-header-background` is now `--hcg-column-hover-header-background`.

### Hover/sync Globals

The following global variables for styling borders in hover and sync states were removed in **Highcharts Grid 2.2** and are no longer supported for theming:

```css
--hcg-border-width  
--hcg-border-style  
--hcg-border-color
```

This change was made due to low demand and to avoid increasing the size and complexity of the default CSS. Hover borders can still be styled using alternative approaches depending on the specific use case; guidance is provided in the [Conditional theming article](https://www.highcharts.com/docs/grid/theming/conditional-theming).
