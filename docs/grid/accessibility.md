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
            filtering: true
        }
    }
}
```

Setting `accessibility.enabled: false` disables all a11y features, including ARIA attributes and any [ARIA live announcements](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

All `accessibility` options are optional, and options in `announcements` override the global `enabled` option.

## Localization

To customize the default language or wording for ARIA attributes and announcers, use the root `lang.accessibility` options:

```js
{
    lang: {
        accessibility: {
            cellEditing: {
                editable: "Editable",
                announcements: {
                    started: "Entered cell editing mode",
                    ...
                }
            },
            sorting: {
                announcements: {
                    ascending: "Sorted ascending",
                    ...
                }
            },
            filtering: {
                announcements: {
                    filterApplied: "Filter applied for {columnId}, {condition} {value}. {rowsCount} results found.",
                    ...
                }
            }
        }
    }
}
```

For a complete list of available options, check out the [API reference](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.LangOptions).

When configuring localization, it typically want it to apply to all grids on the same page. In such cases, we recommend using `setOptions()` to apply these changes globally. Read [Understanding Highcharts Grid](https://www.highcharts.com/docs/grid/understanding-grid#setOptions) for the details.

## High contrast mode

When developing your own custom theme it's recommended to include a high contrast variant if needed.

```css
.my-theme {
    --hcg-color: #606060;
    --hcg-border-stye: dashed;
    ...;
}
@media (prefers-contrast: more) {
    .my-theme {
        --hcg-color: #000000;
        --hcg-border-style: solid;
        ...;
    }
}
```

## Header descriptions

You can add an `aria-description` attribute to individual `<th>` table headers by configuring `header[].accessibility.description`. This is especially useful when [grouped headers](https://www.highcharts.com/docs/grid/columns/header) are used, as descriptions of header groups provide additional clarity for users relying on assistive technologies.

## Caption vs. header

Screen readers often skip table captions (`<caption>`) when users scan a page's headers for structure. To ensure accessibility, Highcharts Grid inserts an element above the `<table>` instead of using `<caption>` inside it. The table references this element by using a proper `aria-labelledby` attribute.

Make sure you use a proper heading level (`<h1>`–`<h6>`) when configuring the `caption` option. This approach ensures that users relying on screen readers can understand the table's context while navigating the page.

```js
caption: {
    text: "<h3>This is the caption</h3>";
}
```

## Screen reader regions

There is full support for screen reader regions that are placed before and after the Grid. These regions provide additional context to screen reader users before or after the Grid content.

### Before-Grid screen reader region

You can configure the information text that is exposed to screen readers before the Grid using the `accessibility.screenReaderSection.beforeGridFormat` option. The format string is used to generate HTML with the information text.

```js
caption: {
    text: '<h2>Sales Data</h2>'
},
description: {
    text: 'Monthly sales data for different products.'
},
accessibility: {
    screenReaderSection: {
        beforeGridFormat:
            '<div>{gridTitle}</div>' +
            '<div>{gridDescription}</div>' +
            '<div>This Grid contains {rowCount} rows and {columnCount} columns.</div>'
    }
}
```

Available template variables:
- `{gridTitle}`: The Grid caption/title (stripped of HTML tags).
- `{gridDescription}`: The Grid description (stripped of HTML tags).
- `{rowCount}`: Number of rows in the Grid.
- `{columnCount}`: Number of columns in the Grid.

If more detailed control is required, the `accessibility.screenReaderSection.beforeGridFormatter` option allows you to define a function that returns the HTML string, receiving the Grid instance as an argument.

```js
accessibility: {
    screenReaderSection: {
        beforeGridFormatter: function (grid) {
            const rowCount = grid.dataTable?.rowCount || 0;
            const colCount = grid.dataTable?.getColumnIds().length || 0;
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
