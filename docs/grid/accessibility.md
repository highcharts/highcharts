---
sidebar_label: "Accessibility"
---

# Accessibility (a11y) in Highcharts Grid

Accessibility (a11y) ensures that web content is usable by everyone, including people with disabilities. Highcharts Grid is rendered using a standard and accessible HTML `<table>`, and is designed with accessibility in mind to provide an inclusive experience for all users.

Using proper `<table>` semantics, such as `<thead>`, `<tbody>`, and `<th>` with appropriate `scope` attributes, ensures the structure is clear for users relying on assistive technologies like screen readers. Features like keyboard navigation, descriptive headers, and ARIA roles make the grid not only functional but also inclusive for users with visual or motor impairments.

## Default options

Accessibility features are enabled by default, and we generally recommend keeping them active. However, if necessary, they can be configured in the root `accessibility` options object:

```js
{
    accessibility: {
        enabled: false,
        announcements: {
            sorting: true,
            filtering: true,
            rowPinning: true
        }
    }
}
```

Setting `accessibility.enabled: false` disables all Grid accessibility features, including ARIA attributes, screen reader regions, and [ARIA live announcements](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

All `accessibility` options are optional. Use `announcements` to enable or disable specific live announcements while accessibility is enabled.

## Row pinning announcements

In Grid Pro, row pinning live announcements are enabled by default and can be
toggled with `accessibility.announcements.rowPinning`.

```js
{
    accessibility: {
        announcements: {
            rowPinning: false
        }
    }
}
```

## Row pinning localization

To customize Grid Pro row pinning announcements and ARIA descriptions, use
`lang.accessibility.rowPinning`:

```js
{
    lang: {
        accessibility: {
            rowPinning: {
                announcements: {
                    pinned: "Row {rowId} pinned to {position}.",
                    unpinned: "Row {rowId} unpinned."
                },
                descriptions: {
                    pinnedTop: "Pinned row in top section.",
                    pinnedBottom: "Pinned row in bottom section.",
                    alsoPinnedTop: "This row is also pinned to top section.",
                    alsoPinnedBottom: "This row is also pinned to bottom section."
                }
            }
        }
    }
}
```

For row pinning announcements, available template variables are:

- `{rowId}`
- `{position}` (for the `pinned` message)

Row pinning descriptions can be customized with:

- `lang.accessibility.rowPinning.descriptions.pinnedTop`
- `lang.accessibility.rowPinning.descriptions.pinnedBottom`
- `lang.accessibility.rowPinning.descriptions.alsoPinnedTop`
- `lang.accessibility.rowPinning.descriptions.alsoPinnedBottom`

## High contrast mode

When developing your own custom theme, it is recommended to include a high contrast variant.

```css
.my-grid-theme {
    --hcg-color: #404040;
    --hcg-border-color: #707070;
    --hcg-border-style: dashed;
}

@media (prefers-contrast: more) {
    .my-grid-theme {
        --hcg-color: #000000;
        --hcg-border-color: #000000;
        --hcg-border-style: solid;
    }
}
```

## Header descriptions

You can add an `aria-description` attribute to individual `<th>` table headers by configuring `header[].accessibility.description`. This is especially useful when [grouped headers](https://www.highcharts.com/docs/grid/columns/header) are used, as descriptions of header groups provide additional clarity for users relying on assistive technologies.

```js
header: [
    'id',
    {
        format: 'Product details',
        accessibility: {
            description: 'This group contains the product name and weight columns.'
        },
        columns: [{
            format: 'Product',
            columnId: 'product'
        }, {
            format: 'Weight',
            columnId: 'weight'
        }]
    }
]
```

## Caption and description

Screen readers often skip table captions (`<caption>`) when users scan a page's headers for structure. To ensure accessibility, Highcharts Grid inserts an element above the `<table>` instead of using `<caption>` inside it. The table references this element by using a proper `aria-labelledby` attribute.

Use `caption.htmlTag` to render the caption as a heading element so the grid fits naturally into the page outline. You can also add supporting context through `description.text`.

```js
caption: {
    text: 'Monthly sales report',
    htmlTag: 'h3'
},
description: {
    text: 'Sales totals for each product category.'
}
```

## Screen reader regions

There is full support for screen reader regions that are placed before and after the Grid. These regions provide additional context to screen reader users before or after the Grid content.

### Before-Grid screen reader region

You can configure the information text that is exposed to screen readers before the Grid using the `accessibility.screenReaderSection.beforeGridFormat` option. The format string is used to generate HTML with the information text.

```js
caption: {
    text: 'Sales Data',
    htmlTag: 'h2'
},
description: {
    text: 'Monthly sales data for different products.'
},
accessibility: {
    screenReaderSection: {
        beforeGridFormat:
            '{gridTitle}' +
            '<div>{gridDescription}</div>' +
            '<div>This grid contains {rowCount} rows and {columnCount} columns.</div>'
    }
}
```

Available template variables:
- `{gridTitle}`: The Grid caption/title.
- `{gridDescription}`: The Grid description.
- `{rowCount}`: Number of rows in the Grid.
- `{columnCount}`: Number of columns in the Grid.

If more detailed control is required, the `accessibility.screenReaderSection.beforeGridFormatter` option allows you to define a function that returns the HTML string, receiving the Grid instance as an argument.

```js
accessibility: {
    screenReaderSection: {
        beforeGridFormatter: function (grid) {
            const dataTable = grid.dataProvider?.getDataTable?.();
            const rowCount = dataTable?.rowCount || 0;
            const colCount = dataTable?.getColumnIds().length || 0;
            return `<div>Custom Grid information: ${rowCount} rows, ${colCount} columns</div>`;
        }
    }
}
```

### After-Grid screen reader region

Similarly, you can configure content after the Grid using `accessibility.screenReaderSection.afterGridFormat` or `accessibility.screenReaderSection.afterGridFormatter`.

```js
accessibility: {
    screenReaderSection: {
        afterGridFormat: '<div>End of Grid.</div>'
    }
}
```

To remove the region altogether, set the format to an empty string.
