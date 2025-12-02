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

| Section Prefix    | Fallback |
| ----------------- | -------- |
| --hcg-header      | Globals  |
| --hcg-description | Globals  |
| --hcg-caption     | Globals  |

### Example

This example sets a base font family and size for the entire grid, and caption uses a larger font size.

```css
.theme-custom {
    --hcg-font-family: Arial, sans-serif;
    --hcg-font-size: 14px;
    --hcg-caption-font-size: 20px;
}
```

## Backgrounds

### Globals

The global background variable apply to header and all rows unless overridden.

| Variable         | Default Value | Valid Values                                                              |
| ---------------- | ------------- | ------------------------------------------------------------------------- |
| --hcg-background | transparent   | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |

### Section Prefixes

Use these prefixes to refine backgrounds for specific sections.

| Section Prefix | Fallback  |
| -------------- | --------- |
| --hcg-header   | Globals   |
| --hcg-row      | Globals   |
| --hcg-row-even | --hcg-row |

### Example

This example sets a base background color for the entire grid. Header and even rows then use darker colors. In addition the header uses a brighter font color for increased contrast.

```css
.theme-custom {
    --hcg-background: #dedede;
    --hcg-header-background: #505050;
    --hcg-row-even-background: #cbcbcb;
    --hcg-header-color: #dedede;
}
```

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

## Hover states

### Globals

When hovering over cells in the grid you can apply hover states to the cell, row, column and/or column header. The following global variables are available for hover states:

--hcg-color  
--hcg-background  
--hcg-border-width  
--hcg-border-style  
--hcg-border-color

### Section Prefixes

Use prefixes to define specific background, color and border for cell, row, column and/or column header.

| Section Prefix            | Fallback |
| ------------------------- | -------- |
| --hcg-cell-hovered        | None     |
| --hcg-cell-hovered-row    | None     |
| --hcg-cell-hovered-column | None     |
| --hcg-cell-hovered-header | None     |
| --hcg-header-hovered      | None     |

### Example

This example starts with a global table background color. It adds a darker background for headers, alternating row colors, and hover states for rows and columns. In addition a border is added to the column.

```css
.theme-custom {
    --hcg-background: #aaaaaa;
    --hcg-header-background: #888888;
    --hcg-row-even-background: #aeaeae;
    --hcg-cell-hovered-row-background: #999999;
    --hcg-cell-hovered-column-background: #999999;
    --hcg-cell-hovered-column-border-width: 1px;
    --hcg-cell-hovered-column-border-color: #d27676;
}
```

## Sync states

When using Highcharts Grid as a component in Highcharts Dashboards, [synchronization highlights cells, rows and columns](https://www.highcharts.com/docs/dashboards/synchronize-components). By default hover states are used for sync as well, but can be overridden by using sync section prefixes instead.

### Section Prefixes

| Section Prefix           | Fallback                  |
| ------------------------ | ------------------------- |
| --hcg-cell-synced        | --hcg-cell-hovered        |
| --hcg-cell-synced-row    | --hcg-cell-hovered-row    |
| --hcg-cell-synced-column | --hcg-cell-hovered-column |
| --hcg-cell-synced-header | --hcg-cell-hovered-header |
| --hcg-header-synced      | --hcg-header-hovered      |

### Example

This example starts with a global table background color. It adds a darker background for headers, alternating row colors, and hover states for rows and columns. In addition a border is added to the column.

```css
.theme-custom {
    --hcg-background: #aaaaaa;
    --hcg-header-background: #888888;
    --hcg-row-even-background: #aeaeae;
    --hcg-cell-hovered-row-background: #999999;
    --hcg-cell-hovered-column-background: #999999;
    --hcg-cell-hovered-column-border-width: 1px;
    --hcg-cell-hovered-column-border-color: #d27676;
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

Define a few global variables for a consistent base style. Use section-specific prefixes to refine headers, captions, rows, and columns. Use your own custom variables to avoid repetition.

```css
.my-theme {
    --my-hover-color: #ff0000;

    --hcg-font-size: 15px;
    --hcg-color: #666666;
    --hcg-header-color: #ffffff;
    --hcg-background: #ffffff;
    --hcg-padding: 10px;
    --hcg-header-background: #002933;
    --hcg-row-even-background: #e9faff;
    --hcg-cell-hovered-header-background: #1a3f48;
    --hcg-cell-hovered-border-width: 1px;
    --hcg-cell-hovered-column-border-width: 1px;
    --hcg-cell-hovered-column-border-color: #f2f2f2;
    --hcg-header-hovered-background: #1a3f48;
    --hcg-cell-hovered-border-color: var(--my-hover-color);
    --hcg-cell-hovered-header-color: var(--my-hover-color);
    --hcg-cell-hovered-row-color: var(--my-hover-color);
    --hcg-cell-hovered-column-color: var(--my-hover-color);
    --hcg-header-hovered-color: var(--my-hover-color);
}
```

Check our [theming demo](https://www.highcharts.com/demo/grid/grid-theming) to see this theme in practice.

## Summary

1. Define global variables for fonts, borders, padding, backgrounds, and pagination.
2. Use section-specific prefixes to refine specific areas.
3. The Grid falls back to global values when no section-specific variable is defined.
4. Pagination variables automatically adapt to light and dark modes for optimal contrast.

This system ensures flexible, maintainable, and consistent theming across all grid components.
