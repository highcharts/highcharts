---
sidebar_label: "Internationalization"
---

# Internationalization (i18n) in Highcharts Grid

Use the `lang` option to translate built-in Grid text and accessibility messages, and to control locale-aware date and number formatting.

## Translating Grid text

Use `lang` to localize UI labels such as loading text, filter and sort controls, pagination text, and accessibility announcements. If the same translations should apply to multiple grids on the page, use `Grid.setOptions()` to define them globally.

```js
Grid.setOptions({
    lang: {
        locale: 'nb-NO',
        loading: 'Laster...',
        noData: 'Ingen data å vise',
        filter: 'Filtrer',
        sortAscending: 'Sorter stigende',
        sortDescending: 'Sorter synkende',
        pagination: {
            pageInfo:
                'Viser {start} - {end} av {total} ' +
                '(side {currentPage} av {totalPages})',
            pageSizeLabel: 'rader per side'
        },
        accessibility: {
            sorting: {
                sortable: 'Sorterbar.',
                announcements: {
                    ascending: 'Sortert stigende.',
                    descending: 'Sortert synkende.',
                    none: 'Ikke sortert.'
                }
            }
        }
    }
});
```

You only need to override the strings you want to change. The remaining `lang` options fall back to the built-in defaults. For a full list of available options, see the [API reference](https://api.highcharts.com/grid/lang).

## Locale resolution

Locale-aware formatting follows this order:

1. `lang.locale`
2. The grid container or closest ancestor element with a `lang` attribute
3. The browser's default locale

This affects templated date and number formatting in Grid, including `cells.format` and `grid.time.dateFormat()`.

## Time formatting

Time formatting is handled by [`Intl.DateTimeFormat.prototype.format`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format) through the Grid time engine, and can be aware of the user's locale.

Grid uses `lang.locale` first, then the grid container or closest ancestor element with a `lang` attribute, and finally the browser's default locale.

To set the locale globally, use `Grid.setOptions()`:

```js
Grid.setOptions({
    lang: {
        locale: 'en-US'
    }
});
```

To format dates and times, use one of the [supported formats](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat).

```js
columns: [{
    id: 'date',
    header: {
        format: 'Date of purchase'
    },
    cells: {
        format: '{value:%[dbY]}'
    }
}, ...]
```

For more advanced formatting, use the `formatter` callback function:

```js
columns: [{
    id: 'date',
    cells: {
        formatter: function () {
            if (this.value === null) {
                return '';
            }

            return this.row.viewport.grid.time.dateFormat({
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }, this.value);
        }
    }
}]
```

## Number formatting

Number formatting in templates is handled by the [template engine](https://www.highcharts.com/docs/chart-concepts/templating). The following example formats numbers with thousands separators:

```js
columns: [{
    id: 'weight',
    className: 'custom-column-class-name',
    cells: {
        format: '{value:,.1f} kg'
    }
}, ...]
```

If you define `lang.decimalPoint` or `lang.thousandsSep`, those values override the locale-specific separators for templated numbers.

## API reference

- [`lang`](https://api.highcharts.com/grid/lang)
