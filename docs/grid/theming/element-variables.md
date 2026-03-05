---
sidebar_label: "Element variables"
---

# Element variables

This article covers theming variables for interactive form elements in Highcharts Grid:

1. `.hcg-input`
2. `.hcg-button`

These variables are separate from table-surface variables documented in [Grid variables](https://www.highcharts.com/docs/grid/theming/grid-variables).

## How element variables inherit

Element variables use a layered fallback model:

1. Scope-specific overrides (`header`, `cell`, `pagination` for buttons).
2. Global element tokens (`--hcg-input-*`, `--hcg-button-*`).
3. Built-in defaults.

This lets you define a consistent base style and then adjust specific areas without duplicating every token.

## Input variables (`.hcg-input`)

### Variables

| Variable                      | Default Value | Valid Values |
| ----------------------------- | ------------- | ------------ |
| --hcg-input-padding           | 5px           | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-input-font-weight       | normal        | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-input-font-size         | 0.9em         | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) |
| --hcg-input-font-family       | --hcg-font-family | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-input-color             | --hcg-color   | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-input-text-align        | --hcg-text-align | [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) |
| --hcg-input-border-radius     | 0             | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-input-border-width      | 1px           | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-input-border-style      | solid         | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-input-border-color      | --hcg-color   | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-input-background        | --highcharts-background-color | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-input-hover-border-color| --hcg-input-border-color | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

### Example

```css
.theme-inputs {
    --hcg-input-font-size: 13px;
    --hcg-input-padding: 8px;
    --hcg-input-border-radius: 6px;
    --hcg-input-border-color: #c9c9c9;
    --hcg-input-hover-border-color: #8e8e8e;
    --hcg-input-background: #ffffff;
}
```

## Button variables (`.hcg-button`)

### Global button variables

| Variable                           | Default Value | Valid Values |
| ---------------------------------- | ------------- | ------------ |
| --hcg-button-border-width          | 1px           | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-button-border-style          | solid         | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-button-border-color          | Default color scheme | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-button-border-radius         | 0             | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-button-background            | transparent   | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-padding               | 6px           | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-button-color                 | Default color scheme | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-hover-color           | Inverted against default scheme | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-hover-background      | Inverted against default scheme | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-hover-border-color    | --hcg-button-border-color | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-button-selected-color        | Inverted against default scheme | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-selected-background   | Inverted against default scheme | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-selected-border-color | --hcg-button-border-color | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

### Scoped button variables

Buttons support three scoped families:

| Scope Prefix             | Applies To                   | Fallback |
| ------------------------ | ---------------------------- | -------- |
| --hcg-header-button-*    | Buttons inside header cells  | --hcg-button-* |
| --hcg-cell-button-*      | Buttons inside body cells    | --hcg-button-* |
| --hcg-pagination-button-*| Buttons inside pagination UI | --hcg-button-* |

Scoped families support the same token endings as global buttons:

1. `background`
2. `color`
3. `padding`
4. `border-width`
5. `border-style`
6. `border-color`
7. `border-radius`
8. `hover-color`
9. `hover-background`
10. `hover-border-color`
11. `selected-color`
12. `selected-background`
13. `selected-border-color`

Expanded variable names:

| Family | Variables |
| ------ | --------- |
| Header buttons | `--hcg-header-button-background`, `--hcg-header-button-color`, `--hcg-header-button-padding`, `--hcg-header-button-border-width`, `--hcg-header-button-border-style`, `--hcg-header-button-border-color`, `--hcg-header-button-border-radius`, `--hcg-header-button-hover-color`, `--hcg-header-button-hover-background`, `--hcg-header-button-hover-border-color`, `--hcg-header-button-selected-color`, `--hcg-header-button-selected-background`, `--hcg-header-button-selected-border-color` |
| Cell buttons | `--hcg-cell-button-background`, `--hcg-cell-button-color`, `--hcg-cell-button-padding`, `--hcg-cell-button-border-width`, `--hcg-cell-button-border-style`, `--hcg-cell-button-border-color`, `--hcg-cell-button-border-radius`, `--hcg-cell-button-hover-color`, `--hcg-cell-button-hover-background`, `--hcg-cell-button-hover-border-color`, `--hcg-cell-button-selected-color`, `--hcg-cell-button-selected-background`, `--hcg-cell-button-selected-border-color` |
| Pagination buttons | `--hcg-pagination-button-background`, `--hcg-pagination-button-color`, `--hcg-pagination-button-padding`, `--hcg-pagination-button-border-width`, `--hcg-pagination-button-border-style`, `--hcg-pagination-button-border-color`, `--hcg-pagination-button-border-radius`, `--hcg-pagination-button-hover-color`, `--hcg-pagination-button-hover-background`, `--hcg-pagination-button-hover-border-color`, `--hcg-pagination-button-selected-color`, `--hcg-pagination-button-selected-background`, `--hcg-pagination-button-selected-border-color` |

### Example

```css
.theme-buttons {
    --hcg-button-border-radius: 6px;
    --hcg-button-padding: 5px;
    --hcg-button-border-color: #d0d0d0;
    --hcg-button-hover-background: #ececec;

    --hcg-header-button-background: transparent;
    --hcg-header-button-hover-background: #d7e4ff;

    --hcg-cell-button-border-color: #b8d7bf;
    --hcg-cell-button-selected-background: #1a7f37;
    --hcg-cell-button-selected-color: #ffffff;

    --hcg-pagination-button-selected-background: #000000;
    --hcg-pagination-button-selected-color: #ffffff;
}
```

## Shared focus ring variables

Both inputs and buttons use the shared focus ring tokens:

| Variable               | Default Value | Valid Values |
| ---------------------- | ------------- | ------------ |
| --hcg-focus-ring-color | --hcg-color   | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-focus-ring-width | 2px           | [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) |

### Example

```css
.theme-focus {
    --hcg-focus-ring-color: #5b6ee1;
    --hcg-focus-ring-width: 3px;
}
```

## Putting It All Together

```css
.theme-elements {
    --hcg-input-padding: 8px;
    --hcg-input-border-radius: 6px;
    --hcg-input-border-color: #d2d2d2;
    --hcg-input-hover-border-color: #8b8b8b;

    --hcg-button-border-radius: 6px;
    --hcg-button-border-color: #d2d2d2;
    --hcg-button-hover-background: #ececec;

    --hcg-header-button-hover-background: #dde8ff;
    --hcg-pagination-button-selected-background: #111111;
    --hcg-pagination-button-selected-color: #ffffff;

    --hcg-focus-ring-color: #5b6ee1;
}
```

Check our [theming demo](https://www.highcharts.com/demo/grid/grid-theming) for a complete setup that combines table and element theming.
