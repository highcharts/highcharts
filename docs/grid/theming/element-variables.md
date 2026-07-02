---
sidebar_label: "Element variables"
---

# Element variables

Highcharts Grid includes a set of predefined CSS variables for theming interactive elements such as inputs, icon controls, and buttons used in headers, body cells, and pagination.

For table surfaces such as rows, columns, headers, and cells, see [Grid variables](https://www.highcharts.com/docs/grid/theming/grid-variables).

## Variable naming and fallback

Most element variables follow this pattern:

1. Start from global element variables.
2. Override with section-specific variables where needed.
3. Fall back to global values when section variables are not defined.

Example:

```css
.theme-elements {
    --hcg-input-border-radius: 6px;
    --hcg-pagination-input-border-radius: 0;
}
```

In this case, all inputs use `6px` radius globally, while inputs in pagination are overridden to `0`.

## Inputs

### Globals

| Variable                       | Default Value                  | Valid Values |
| ------------------------------ | ------------------------------ | ------------ |
| --hcg-input-padding            | 5px                            | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-input-font-weight        | inherit                        | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-input-font-size          | inherit                        | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) |
| --hcg-input-font-family        | inherit                        | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-input-color              | inherit | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-input-text-align         | --hcg-text-align               | [text-align](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) |
| --hcg-input-border-radius      | 0                              | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-input-border-width       | 1px                            | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-input-border-style       | solid                          | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-input-border-color       | --hcg-input-color                  | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-input-background         | #ffffff/#141414              | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-input-hover-color        | --hcg-input-color              | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-input-hover-background   | --hcg-input-background         | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-input-hover-border-color | --hcg-input-border-color       | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

Inputs inherit surrounding typography by default. That means header inputs follow header typography, body-cell inputs follow cell typography, and pagination inputs follow pagination typography unless input-specific font variables are set. When input-specific color tokens are unset, resting text color inherits the surrounding section color and the resting border follows that same color via `currentColor`.

### Section prefixes

| Variable Prefix             | Applies To                  | Fallback |
| --------------------------- | --------------------------- | -------- |
| --hcg-header-input        | Inputs inside header cells  | Global |
| --hcg-cell-input          | Inputs inside body cells    | Global |
| --hcg-pagination-input    | Inputs inside pagination UI | Global |

### Example

```css
.theme-inputs {
    --hcg-input-font-size: 13px;
    --hcg-input-padding: 8px;
    --hcg-input-border-radius: 2px;
    --hcg-input-border-color: #c9c9c9;
    --hcg-input-hover-border-color: #8e8e8e;

    --hcg-pagination-input-border-color: #676767;
}
```

## Buttons

### Globals

| Variable                            | Default Value                  | Valid Values |
| ----------------------------------- | ------------------------------ | ------------ |
| --hcg-button-padding                | 6px                            | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-button-font-weight            | inherit                        | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-button-font-size              | inherit                        | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) |
| --hcg-button-font-family            | inherit                        | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-button-color                  | inherit | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-border-radius          | 0                              | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-button-border-width           | 1px                            | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-button-border-style           | solid                          | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-button-border-color           | --hcg-button-color                  | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-button-background             | transparent                    | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-hover-color            | #ffffff/#000000                | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-hover-background       | #000000/#ffffff                | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-hover-border-color     | --hcg-button-border-color      | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-button-selected-color         | #ffffff/#000000                | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-button-selected-background    | #000000/#ffffff                | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-button-selected-border-color  | --hcg-button-border-color      | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

Buttons inherit surrounding typography by default. That means body-cell buttons follow cell typography and pagination buttons follow pagination typography unless button-specific font variables are set. When button-specific color tokens are unset, resting text color inherits the surrounding section color and the resting border follows that same color via `currentColor`. Theme classes can still override those defaults.

### Section prefixes

| Variable Prefix               | Applies To                   | Fallback |
| ----------------------------- | ---------------------------- | -------- |
| --hcg-cell-button           | Buttons inside body cells    | Global |
| --hcg-pagination-button     | Buttons inside pagination UI | Global |

### Example

```css
.theme-buttons {
    --hcg-button-font-weight: 600;
    --hcg-button-font-size: 13px;
    --hcg-button-border-radius: 2px;
    --hcg-button-padding: 5px;
    --hcg-button-border-color: #d0d0d0;
    --hcg-button-hover-background: #ececec;

    --hcg-cell-button-selected-background: #1a7f37;
    --hcg-cell-button-selected-color: #ffffff;

    --hcg-pagination-button-selected-background: #000000;
    --hcg-pagination-button-selected-color: #ffffff;
}
```

Header toolbar controls use the dedicated `--hcg-icon-*` variables described below, not the button token family.

## Icons

### Globals

| Variable                          | Default Value                                    | Valid Values |
| --------------------------------- | ------------------------------------------------ | ------------ |
| --hcg-icon-padding                | 6px                                              | [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) |
| --hcg-icon-font-weight            | inherit                                          | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) |
| --hcg-icon-font-size              | inherit                                          | [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) |
| --hcg-icon-font-family            | inherit                                          | [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) |
| --hcg-icon-color                  | inherit                                          | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-icon-border-radius          | 0                                                | [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) |
| --hcg-icon-border-width           | 1px                                              | [border-width](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) |
| --hcg-icon-border-style           | solid                                            | [border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) |
| --hcg-icon-border-color           | transparent                                      | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |
| --hcg-icon-background             | transparent                                      | [background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) |
| --hcg-icon-hover-color            | --hcg-icon-color                                 | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-icon-hover-background       | black/white tint source color                    | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-icon-hover-border-color     | --hcg-icon-border-color                          | [border-color](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color) |

 Resting background is transparent by default. The hover background token expects a source color, not a pre-mixed translucent background. Grid applies its own transparent mix to that source, so `--hcg-icon-hover-background: green` produces a translucent green hover surface rather than a solid fill. Hovered and highlighted icon controls reuse that hover tint, while selected icon controls keep the resting surface styling unless they are also hovered.

### Section prefixes

| Variable Prefix               | Applies To                    | Fallback |
| ----------------------------- | ----------------------------- | -------- |
| --hcg-header-icon           | Icons inside header cells | Global |
| --hcg-cell-icon             | Icons inside body cells   | Global |

### Example

```css
.theme-icons {
    --hcg-icon-padding: 3px;
    --hcg-icon-font-size: 15px;
    --hcg-header-icon-color: red;
    --hcg-cell-icon-background: gray;
}
```

## Focus ring

### Globals

| Variable               | Default Value | Valid Values |
| ---------------------- | ------------- | ------------ |
| --hcg-focus-ring-color | --hcg-color   | [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color) |
| --hcg-focus-ring-width | 2px           | [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) |

### Example

```css
.theme-focus {
    --hcg-focus-ring-color: #5b6ee1;
    --hcg-focus-ring-width: 1px;
}
```

## Summary

1. Define global input, icon, and button variables first.
2. Override by section using `--hcg-header-*`, `--hcg-cell-*`, and `--hcg-pagination-*`.
3. Use shared focus ring variables for accessible focus styling.
4. Combine with [Grid variables](https://www.highcharts.com/docs/grid/theming/grid-variables) for full table and element theming.
