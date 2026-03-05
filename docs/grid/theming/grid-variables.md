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

| Variable          | Default Value   | Valid Values                                                                |
| ----------------- | --------------- | --------------------------------------------------------------------------- |
| --hcg-hover-opacity       | 100% | [opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)           |



### Example

```css
.theme-opacity-hover {
    --hcg-hover-opacity: 18%;
    --hcg-column-hover-opacity: 28%;
    --hcg-cell-hover-opacity: 60%;
}
```

In this example, all hover states start at `18%`, columns are stronger at `28%`, and direct cell hover becomes the strongest at `60%`.

### Focused sync-opacity example

```css
.theme-opacity-sync {
    --hcg-sync-opacity: 35%;
    --hcg-row-sync-opacity: 55%;
    --hcg-cell-synced-opacity: 75%;
}
```

In this example, synced states use `35%` by default, synced rows are stronger at `55%`, and final synced cell overlays are strongest at `75%`.

## Putting It All Together

```css
.my-theme {
    --hcg-font-size: 15px;
    --hcg-color: #1b1b1b;
    --hcg-background: #ffffff;
    --hcg-border-width: 1px;
    --hcg-border-color: #dddddd;
    --hcg-padding: 10px;

    --hcg-header-background: #0f2747;
    --hcg-header-color: #ffffff;
    --hcg-row-even-background: #f6f9ff;

    --hcg-hover-opacity: 12%;
    --hcg-column-hover-opacity: 20%;
    --hcg-row-sync-opacity: 38%;

    --hcg-link-color: #0b57d0;
    --hcg-link-hovered-text-decoration: none;
    --hcg-popup-border-color: #d6d6d6;
    --hcg-menu-item-active-background: #e9edff;
}
```

Check our [theming demo](https://www.highcharts.com/demo/grid/grid-theming) to see these concepts in practice.

## Summary

1. Define globals first (`font`, `color`, `background`, `border`, `padding`).
2. Refine table sections with row/column/header/cell variables.
3. Use hover/sync color variables together with opacity variables for interaction tuning.
4. Use supporting UI variables (links, popup, menu, focus ring, loader) for a complete theme.
5. For controls, use [Element variables](https://www.highcharts.com/docs/grid/theming/element-variables).
