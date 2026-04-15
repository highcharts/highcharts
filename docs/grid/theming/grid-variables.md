---
sidebar_label: "Grid variables"
---

# Grid variables

Highcharts Grid includes a set of predefined CSS variables for theming the table surface and interaction states. Define global variables such as `--hcg-font-size`, `--hcg-background`, and `--hcg-padding` to establish a baseline style, then override specific areas with section-specific variables.

For theming of elements, such and inputs and buttons, see [Element variables](https://www.highcharts.com/docs/grid/theming/element-variables).

## Variable naming and fallback

Most variables follow this pattern:

1. Start from a global variable.
2. Override with section-specific variables where needed.
3. Fall back to global values when section variables are not defined.

Example:

```css
.theme-custom {
    --hcg-padding: 10px;
    --hcg-header-vertical-padding: 6px;
}
```

In this case, the initial global padding for all table cells (`th` and `td`) is set to `10px`, while top/bottom padding for headers (`th`) is overridden using `6px`.

## Background and color fallback chain

For normal body cells, the effective background fallback chain is `--hcg-cell-background` -> `--hcg-row-background` -> `--hcg-column-background` -> `--hcg-background`. Body cell text color follows the same pattern: `--hcg-cell-color` -> `--hcg-row-color` -> `--hcg-column-color` -> `--hcg-color`. In a non-conditional theme, setting every level usually adds little value because the most specific variable for that cell wins.

These options exist mainly for [Conditional theming](https://www.highcharts.com/docs/grid/theming/conditional.md), where you may want to style only selected rows, columns, or cells. There is no required variable for the "base" background color, but if you are not using conditional rules, `--hcg-background` is the recommended starting point because it is the simplest. Headers are a small exception: header backgrounds use `--hcg-header-background` -> `--hcg-cell-background` -> `--hcg-column-background`, while header text color uses `--hcg-header-color` -> `--hcg-column-color` -> `--hcg-cell-color` -> `--hcg-color`. Unless controls define their own input/button tokens, nested buttons and inputs inherit that resolved section color by default.

## Fonts and text

### Globals

| Variable          | Default Value   | Valid Values                                                                |
| ----------------- | --------------- | --------------------------------------------------------------------------- |
| --hcg-font-family | System fonts \* | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-font-size   | 1rem            | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)     |
| --hcg-font-weight | normal          | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-color       | #000000/#ffffff | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)           |
| --hcg-text-align  | left            | [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)   |

\* System fonts: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, `Apple Color Emoji`, `Segoe UI Emoji`, `Segoe UI Symbol`, `sans-serif`.

### Section prefixes

| Variable Prefix         | Applies To                  | Fallback |
| ----------------------- | --------------------------- | -------- |
| --hcg-header            | Header cells                | Global   |
| --hcg-cell              | Body cells                  | --hcg-row   |
| --hcg-row               | Rows                        | --hcg-column   |
| --hcg-row-even          | Even rows                   | --hcg-row |
| --hcg-column            | Columns                     | Global   |
| --hcg-column-even       | Even columns                | --hcg-column |
| --hcg-caption           | Caption                     | Global   |
| --hcg-description       | Description                 | Global   |
| --hcg-pagination        | Pagination                  | Global   |


### Example

```css
.theme-custom {
    --hcg-font-family: Arial, sans-serif;
    --hcg-font-size: 14px;
    --hcg-header-font-weight: 700;
    --hcg-column-even-font-family: Georgia, serif;
    --hcg-caption-font-size: 20px;
}
```

## Backgrounds

### Globals

| Variable         | Default Value | Valid Values                                                              |
| ---------------- | ------------- | ------------------------------------------------------------------------- |
| --hcg-background | transparent   | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |

### Section Prefixes

| Variable Prefix         | Applies To                  | Fallback |
| ----------------------- | --------------------------- | -------- |
| --hcg-header            | Header cells                | Global   |
| --hcg-cell              | Body cells                  | --hcg-row   |
| --hcg-row               | Rows                        | --hcg-column   |
| --hcg-row-even          | Even rows                   | --hcg-row |
| --hcg-column            | Columns                     | Global   |
| --hcg-column-even       | Even columns                | --hcg-column |
| --hcg-pagination        | Pagination                  | Global   |

### Example

```css
.theme-custom {
    --hcg-background: #ffffff;
    --hcg-row-even-background: #f7f7f7;
    --hcg-header-background: #1f2937;
    --hcg-header-color: #ffffff;
}
```

## Borders

### Globals

| Variable           | Default Value   | Valid Values                                                                    |
| ------------------ | --------------- | ------------------------------------------------------------------------------- |
| --hcg-border-width | 0               | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)   |
| --hcg-border-style | solid           | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style)   |
| --hcg-border-color | #000000/#ffffff | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color)   |
| --hcg-border-radius *| 0               | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |

\* `--hcg-border-radius` controls the outer table radius only.

### Section Prefixes

| Variable Prefix              | Applies To                    | Fallback |
| --------------------------- | ----------------------------- | -------- |
| --hcg-row          | Border between rows     | Global border |
| --hcg-column       | Border between columns  | Global border |
| --hcg-header-row   | Borders between header rows   | --hcg-row |
| --hcg-header-column| Borders between header columns| --hcg-column |

### Example

```css
.theme-custom {
    --hcg-border-width: 2px;
    --hcg-border-style: solid;
    --hcg-border-color: #d6d6d6;
    --hcg-border-radius: 8px;
    --hcg-column-border-width: 0;
    --hcg-row-border-width: 1px;
}
```

## Padding

### Globals

| Variable                 | Fallback      | Default Value | Valid Values                                                                       |
| ------------------------ | ------------- | ------------- | ---------------------------------------------------------------------------------- |
| --hcg-padding            |               | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |
| --hcg-horizontal-padding | --hcg-padding | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |
| --hcg-vertical-padding   | --hcg-padding | 0             | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) (single value) |

### Section Prefixes

| Variable Prefix            | Applies To         | Fallback |
| -------------------------- | ------------------ | -------- |
| --hcg-header      | Header cells       | Globals |
| --hcg-caption     | Caption            | Globals |
| --hcg-description | Description        | Globals |
| --hcg-pagination  | Pagination | Globals |

### Example

```css
.theme-custom {
    --hcg-padding: 8px;
    --hcg-header-vertical-padding: 6px;
    --hcg-pagination-padding: 12px;
}
```

## Links

If `format` or `formatter` are used to insert links in table cells, or caption/description, the following variables can be used to style them. Color and font weight is always inherited from the parent element.

| Variable                           | Default Value | Valid Values                                                                        |
| ---------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| --hcg-link-color                   | inherit       | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)                     |
| --hcg-link-text-decoration         | underline     | [text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) |
| --hcg-link-font-weight             | inherit       | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)         |
| --hcg-link-hovered-color           | --hcg-link-color | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)                  |
| --hcg-link-hovered-text-decoration | none          | [text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) |


## Hover colors

### Globals

The following global variables are available for hover states on cells, rows, columns and column headers:

| Variable          | Default Value   | Valid Values                                                                |
| ----------------- | --------------- | --------------------------------------------------------------------------- |
| --hcg-color       | inherit | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color)           |
| --hcg-background       | inherit | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background)           |

### Section Prefixes

| Variable Prefix               | Applies To                        | Fallback |
| ----------------------------- | --------------------------------- | ---------------- |
| --hcg-header-hover            | Header cells                      | --hcg-column-hover   |
| --hcg-cell-hover              | Body cells                        | --hcg-row OR --hcg-column   |
| --hcg-row-hover               | Rows                              | None   |
| --hcg-column-hover            | Columns                           | None |
| --hcg-column-hover-header     | Header cells when hovering column | --hcg-column-hover   |

### Hover Opacity

The `--hcg-hover-opacity` variable control blending strength of hover layers.
When you use even/odd row or column backgrounds, opacity can be used if you want those stripes to remain visible in hover states.
The global `--hcg-hover-opacity` can be overridden per section using the same hover prefixes as in [Hover colors](#hover-colors), such as `--hcg-header-hover-opacity`, `--hcg-column-hover-opacity`, and `--hcg-cell-hover-opacity`.

| Variable          | Default Value   | Valid Values                                                                |
| ----------------- | --------------- | --------------------------------------------------------------------------- |
| --hcg-hover-opacity       | 100% | [opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)           |

### Example

```css
.theme-custom {
    --my-hover-color: red;
    --hcg-row-even-background: lightgrey;
    --hcg-cell-hover-background: var(--my-hover-color);
    --hcg-column-hover-background: var(--my-hover-color);
    --hcg-hover-opacity: 18%;
    --hcg-cell-hover-opacity: 60%;
}
```

In this example, hover color is set once through `--my-hover-color`, even rows keep their `lightgrey` striping through opacity blending, global hover uses `18%`, and direct cell hover is strengthened to `60%`.

## Sync colors

When using Highcharts Grid as a component in Highcharts Dashboards, [synchronization highlights cells, rows and columns](https://www.highcharts.com/docs/dashboards/synchronize-components). By default hover states are used for sync as well, but can be overridden by using sync section prefixes instead.

The same section-prefix, fallback, and opacity logic from [Hover colors](#hover-colors) applies, using `-sync-` variables instead of `-hover-`.

```css
.theme-custom {
    --hcg-cell-hover-background: lightred;
    --hcg-cell-sync-hover-background: red;
    --hcg-cell-sync-hover-color: white;
}
```

In this example hover uses a light red background, while sync uses a solid red background and white text to draw extra attention when users interacts with a synced chart on the same page.

Check our [theming demo](https://www.highcharts.com/demo/grid/grid-theming) to see these concepts in practice.

## Summary

1. Define globals first (`font`, `color`, `background`, `border`, `padding`).
2. Refine table sections with row/column/header/cell variables.
3. Use hover/sync color variables together with opacity variables for interaction tuning.
4. For other elements, use [Element variables](https://www.highcharts.com/docs/grid/theming/element-variables).
