---
sidebar_label: "Element variables"
---

# Element variables

Highcharts Grid has two theming layers:

1. Grid variables for table surfaces (`thead`, `tbody`, rows, columns, and cells), documented in [Grid variables](https://www.highcharts.com/docs/grid/theming/grid-variables).
2. Element variables for interactive controls rendered inside and around the table, mainly `.hcg-input` and `.hcg-button`.

This article documents the element layer.

## Variable naming and fallback

Most element variables follow this pattern:

1. Start from global element tokens (`--hcg-input-*`, `--hcg-button-*`).
2. Override button tokens with scoped families where needed (`--hcg-header-button-*`, `--hcg-cell-button-*`, `--hcg-pagination-button-*`).
3. Fall back to built-in defaults.

Example:

```css
.theme-elements {
    --hcg-button-border-radius: 6px;
    --hcg-header-button-border-radius: 0;
}
```

In this case, buttons use `6px` radius globally, while header buttons are overridden to `0`.

## Input variables (`.hcg-input`)

### Globals

| Variable                       | Default Value                  | Valid Values |
| ------------------------------ | ------------------------------ | ------------ |
| --hcg-input-padding            | 5px                            | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-input-font-weight        | normal                         | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-input-font-size          | 0.9em                          | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) |
| --hcg-input-font-family        | --hcg-font-family              | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-input-color              | --hcg-color                    | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-input-text-align         | --hcg-text-align               | [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) |
| --hcg-input-border-radius      | 0                              | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-input-border-width       | 1px                            | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-input-border-style       | solid                          | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-input-border-color       | --hcg-color                    | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-input-background         | --highcharts-background-color  | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-input-hover-color        | --hcg-input-color              | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-input-hover-background   | --hcg-input-background         | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-input-hover-border-color | --hcg-input-border-color       | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

### Scoped input prefixes

| Variable Prefix             | Applies To                  | Fallback |
| --------------------------- | --------------------------- | -------- |
| --hcg-header-input-*        | Inputs inside header cells  | --hcg-input-* |
| --hcg-cell-input-*          | Inputs inside body cells    | --hcg-input-* |
| --hcg-pagination-input-*    | Inputs inside pagination UI | --hcg-input-* |

### Hover border fallback precedence

Hover border color changes only when a hover token is defined.

1. Header input hover color:
`--hcg-header-input-hover-color -> --hcg-input-hover-color -> --hcg-header-input-color -> global/default`
2. Cell input hover color:
`--hcg-cell-input-hover-color -> --hcg-input-hover-color -> --hcg-cell-input-color -> global/default`
3. Pagination input hover color:
`--hcg-pagination-input-hover-color -> --hcg-input-hover-color -> --hcg-pagination-input-color -> global/default`
4. Header input hover background:
`--hcg-header-input-hover-background -> --hcg-input-hover-background -> --hcg-header-input-background -> global/default`
5. Cell input hover background:
`--hcg-cell-input-hover-background -> --hcg-input-hover-background -> --hcg-cell-input-background -> global/default`
6. Pagination input hover background:
`--hcg-pagination-input-hover-background -> --hcg-input-hover-background -> --hcg-pagination-input-background -> global/default`
7. Header input hover border:
`--hcg-header-input-hover-border-color -> --hcg-input-hover-border-color -> --hcg-header-input-border-color -> global/default`
8. Cell input hover border:
`--hcg-cell-input-hover-border-color -> --hcg-input-hover-border-color -> --hcg-cell-input-border-color -> global/default`
9. Pagination input hover border:
`--hcg-pagination-input-hover-border-color -> --hcg-input-hover-border-color -> --hcg-pagination-input-border-color -> global/default`

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

### Globals

| Variable                            | Default Value                  | Valid Values |
| ----------------------------------- | ------------------------------ | ------------ |
| --hcg-button-border-width           | 1px                            | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-button-border-style           | solid                          | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-button-border-color           | --ig-default-color             | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-button-border-radius          | 0                              | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-button-background             | transparent                    | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-padding                | 6px                            | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-button-color                  | --ig-default-color             | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-hover-color            | --ig-default-background        | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-hover-background       | --ig-default-color             | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-hover-border-color     | --hcg-button-border-color      | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-button-selected-color         | --ig-default-background        | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-selected-background    | --ig-default-color             | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-selected-border-color  | --hcg-button-border-color      | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

### Section prefixes

| Variable Prefix               | Applies To                   | Fallback |
| ----------------------------- | ---------------------------- | -------- |
| --hcg-header-button-*         | Buttons inside header cells  | --hcg-button-* |
| --hcg-cell-button-*           | Buttons inside body cells    | --hcg-button-* |
| --hcg-pagination-button-*     | Buttons inside pagination UI | --hcg-button-* |

Scoped button families support these suffixes:

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

### Header button color behavior

Header buttons have context-aware color fallbacks:

| Variable | Default behavior |
| -------- | ---------------- |
| --hcg-header-button-color | Falls back to current header text color |
| --hcg-header-button-hover-color | Falls back to current header text color |
| --hcg-header-button-selected-color | Falls back to current header text color |
| --hcg-header-button-hover-background | Falls back to a color mix based on header hover background |
| --hcg-header-button-selected-background | Falls back to current header button background |

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
