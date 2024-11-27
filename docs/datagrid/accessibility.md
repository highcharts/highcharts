# Accessibility (a11y) in Highcharts DataGrid

Accessibility (a11y) ensures that web content is usable by everyone, including people with disabilities. Highcharts DataGrid, rendered using a standard and accessible HTML `<table>`, is designed with accessibility in mind to provide an inclusive experience for all users.

Using proper `<table>` semantics, such as `<thead>`, `<tbody>`, and `<th>` with appropriate `scope` attributes, ensures the structure is clear for users relying on assistive technologies like screen readers. Features like keyboard navigation, descriptive headers, and ARIA roles make the datagrid not only functional but also inclusive for users with visual or motor impairments. By prioritizing accessibility, our table-based datagrid becomes an effective tool for everyone.

## Default options

Accessibility features are enabled by default, and we generally recommend keeping them active. However, if necessary, they can be configured in the root `accessibility` options object:

```js
{
  accessibility: {
    enabled: false,
    announcements: {
      cellEditing: true,
      sorting: false // Superfluous since `enabled` is also false
    }
  }
}
```

Setting `accessibility.enabled: false` disables all a11y features, including ARIA attributes and any [ARIA live announcements](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

All `accessibility` options are optional, and options in `announcements` override the global `enabled` setting.

## Localization

To customize the default language or wording for ARIA attributes and announcers, use the `lang.accessibility` options:

```js
{
  lang: {
    accessibility: {
      cellEditing: {
        editable: "Editable",
        announcements: {
          started: "Entered cell editing mode",
          // Additional announcements can be added here
        }
      },
      sorting: {
        announcements: {
          ascending: "Sorted ascending",
          // Additional announcements can be added here
        }
      }
    }
  }
}
```

For a complete list of available options, check out the [API reference](?).

## Header descriptions

You can add an `aria-description` attribute to individual `<th>` table headers by configuring `header[].accessibility.description`. This is especially useful when [grouped headers](https://www.highcharts.com/docs/datagrid/header) are used, as descriptions of header groups provide additional clarity for users relying on assistive technologies.

## Caption vs. headers

Screen readers often skip table captions (`<caption>`) when users scan a page's headings for structure. To ensure accessibility, pair a table caption with a proper heading (`<h1>`–`<h6>`) placed above the table. This approach ensures that users relying on screen readers can understand the table's context while navigating the page.

While the `<caption>` can be configured via the `caption` root option, adding the heading requires manual insertion at an appropriate location in the DOM, as this is not managed by the datagrid.
