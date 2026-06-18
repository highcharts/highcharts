---
sidebar_label: "Custom icons"
---

# Replace built-in icons via API

Highcharts Grid lets you replace built-in SVG icons through the API using `rendering.icons`. Use this when you want the existing Grid controls to use iconography that matches your theme, brand, or product style.

## Why icons are configured through the API

Grid icons are not exposed as CSS variables because the icon itself is SVG markup, not a simple style token. CSS variables work well for values such as colors, spacing, and font sizes, but they do not replace the SVG path data or structure that defines an icon.

The Grid therefore uses `rendering.icons` in the API to let you replace the actual icon definition used by built-in UI controls.

## Built-in icon names

These built-in icon names can be overridden through `rendering.icons`:

- `filter`
- `menu`
- `checkmark`
- `arrowUpDown`
- `arrowUp`
- `arrowDown`
- `chevronLeft`
- `chevronRight`
- `doubleChevronLeft`
- `doubleChevronRight`

## Override built-in icons

You can override built-in names used by built-in UI (for example header toolbar, sorting, filtering, and pagination controls).

```js
{
    rendering: {
        icons: {
            filter: {
                width: 12,
                height: 12,
                children: [{
                    d: "M 1 1 L 11 1 L 7 6 V 11 L 5 10 V 6 Z"
                }]
            },
        }
    }
}
```

## Icon value formats

Each built-in icon override can use one of two formats:

1. Raw SVG string
2. SVG definition object

### Raw SVG string

```js
{
    rendering: {
        icons: {
            filter: '<svg width="8" height="12" viewBox="0 0 4 12"><path d="M2 1.5A1.5 1.5 0 1 0 2 4.5A1.5 1.5 0 1 0 2 1.5Z"/></svg>'
        }
    }
}
```

Use this format when you already have replacement SVG markup from a design system or icon pipeline.

### SVG definition object

| Property | Required | Description |
| -------- | -------- | ----------- |
| `width` | No | Rendered icon width in pixels. |
| `height` | No | Rendered icon height in pixels. |
| `viewBox` | No | SVG viewBox. If omitted, derived from width/height. |
| `fill` | No | Root SVG fill value. |
| `children` | No | Array of path definitions. |

Each child in `children` supports:

| Property | Required | Description |
| -------- | -------- | ----------- |
| `d` | Yes | SVG path data. |
| `stroke` | No | Path stroke color. |
| `stroke-width` | No | Path stroke width. |
| `stroke-linecap` | No | Path line cap. |
| `stroke-linejoin` | No | Path line join. |
| `opacity` | No | Path opacity. |
