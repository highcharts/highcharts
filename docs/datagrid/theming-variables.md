# Variable Reference

Highcharts DataGrid theming uses a set of CSS variables. By defining global variables, such as `--font-size`, `--background-color`, `--border-width`, and `--padding`, you establish a baseline style for the entire datagrid. To customize specific sections, prepend section-specific prefixes, such as `--header`, `--caption`, `--row`, to these global variables. If no section-specific variable is defined, the datagrid defaults to the global value.

For example, setting a global `--font-size` and `--font-family` affects the whole datagrid. To make headers bold or captions larger, define `--header-font-weight` or `--caption-font-size`. This pattern ensures your theme remains clean and consistent.

## Fonts and Text

### Globals

Global font and text variables apply to all sections of the datagrid unless overridden.

| Variable      | Default Value   | Valid Values                                                                |
| ------------- | --------------- | --------------------------------------------------------------------------- |
| --font-family | System fonts \* | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --font-size   | 1rem            | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)     |
| --font-weight | normal          | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --color       | #000000         | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)             |
| --text-align  | left            | [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)   |

\* Default: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif.

### Section Prefixes

Add these prefixes to refine fonts and text for specific sections. All sections inherit directly from the global variables.

| Section Prefix | Fallback |
| -------------- | -------- |
| --header       | Globals  |
| --description  | Globals  |
| --caption      | Globals  |

### Example

This example sets a base font family and size for the entire datagrid. Headers are bold, and the caption uses a larger font size.

```css
.theme-custom {
  --font-family: Arial, sans-serif;
  --font-size: 12px;
  --header-font-weight: bold;
  --caption-font-size: 20px;
}
```

## Borders

### Globals

Global border variables define the appearance of the outer table border and the borders between rows and columns.

| Variable           | Default Value | Valid Values                                                                    |
| ------------------ | ------------- | ------------------------------------------------------------------------------- |
| --border-width     | 0             | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)   |
| --border-style     | solid         | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style)   |
| --border-color     | #000000       | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color)   |
| --border-radius \* | 0             | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |

\* `--border-radius` applies only to the outer table border, not individual cells.

### Section Prefixes

Use these prefixes to refine borders by section. If no section-specific variables are defined, global values are used (except for `--border-radius`).

| Section Prefix  | Fallback |
| --------------- | -------- |
| --row           | Global   |
| --column        | Global   |
| --header-row    | --row    |
| --header-column | --column |

### Example

This example starts with a 3px global border. Rows and columns have narrower borders, and header column borders use a different style and color.

```css
.theme-custom {
  --border-width: 3px;
  --border-color: #000000;
  --row-border-width: 1px;
  --column-border-width: 2px;
  --header-column-border-color: #eeeeee;
  --header-column-border-style: dashed;
}
```

## Padding

### Globals

Global padding is applied to all table cells, caption and description. Use `--horizontal-padding` and `--vertical-padding` for finer control. If these aren’t defined, `--padding` applies to all sides.

| Variable             | Default Value | Valid Values                                                                       |
| -------------------- | ------------- | ---------------------------------------------------------------------------------- |
| --padding            | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |
| --horizontal-padding | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |
| --vertical-padding   | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |

### Section Prefixes

Add these prefixes to customize padding for specific sections.

| Section Prefix | Fallback |
| -------------- | -------- |
| --header       | Globals  |
| --caption      | Globals  |
| --description  | Globals  |

### Example

This example sets global padding to 8px, reduces vertical padding for headers, and removes horizontal padding for captions.

```css
.theme-custom {
  --padding: 8px;
  --header-vertical-padding: 4px;
  --caption-horizontal-padding: 0;
}
```

## Background Colors

### Globals

The global background color applies to the entire `<table>` element. Default transparency allows the color to "shine through" unless section-specific variables are defined.

| Variable           | Default Value | Valid Values                                                                          |
| ------------------ | ------------- | ------------------------------------------------------------------------------------- |
| --background-color | transparent   | [background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) |

### Section Prefixes

Use prefixes to define specific background colors for rows, columns, and hover states.

| Section Prefix          | Fallback     |
| ----------------------- | ------------ |
| --row                   | None         |
| --row-hovered           | --row        |
| --row-even              | None         |
| --row-even-hovered      | --row-even   |
| --header-row            | --row        |
| --column-hovered        | --row        |
| --header-column-hovered | --header-row |

### Example

This example starts with a global table background color. It adds a darker background for headers, alternating row colors, and hover states for rows and columns.

```css
.theme-custom {
  --background-color: #aaaaaa;
  --header-row-background-color: #888888;
  --row-even-background-color: #aeaeae;
  --row-hovered-background-color: #999999;
  --column-hovered-background-color: #999999;
}
```

## Synced Background Colors

When using Highcharts DataGrid as a component in Highcharts Dashboards, [synchronization highlights rows and columns](https://www.highcharts.com/docs/dashboards/synchronize-components). These variables allow you to override default hover styles for synced states.

### Section Prefixes

| Section Prefix         | Fallback                |
| ---------------------- | ----------------------- |
| --row-synced           | --row-hovered           |
| --row-even-synced      | --row-even-hovered      |
| --column-synced        | --column-hovered        |
| --header-column-synced | --header-column-hovered |

## Putting It All Together

Define a few global variables for a consistent base style. Use section-specific prefixes to refine headers, captions, rows, and columns.

```css
.theme-custom {
  /* Global values */
  --font-family: Arial, sans-serif;
  --font-size: 12px;
  --border-width: 3px;
  --border-color: #000000;
  --padding: 8px;
  --background-color: #aaaaaa;

  /* Section-specific refinements */
  --caption-font-size: 20px;
  --caption-horizontal-padding: 0;

  --header-font-weight: bold;
  --header-vertical-padding: 4px;
  --header-column-border-color: #eeeeee;
  --header-column-border-style: dashed;
  --header-row-background-color: #888888;

  --row-border-width: 1px;
  --row-even-background-color: #aeaeae;
  --row-hovered-background-color: #999999;

  --column-border-width: 2px;
  --column-hovered-background-color: #999999;
}
```

## Summary

1. Define global variables for fonts, borders, padding, and backgrounds.
2. Use section-specific prefixes to refine specific areas.
3. The DataGrid falls back to global values when no section-specific variable is defined.

This system ensures flexible, maintainable, and consistent theming.

