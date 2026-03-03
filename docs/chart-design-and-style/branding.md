Branding Highcharts
===================

Branding in Highcharts works best when you split it into layers:

1. Set a global palette with your brand colors for both light and dark mode.
2. Set global design tokens for specific chart options (backgrounds, grid lines,
   text colors, etc).
3. Apply typography and credits customization for a complete branded result.

All layers are theme configuration and are typically done with
`Highcharts.setOptions`.

<iframe style="width: 100%; height: 470px; border: none;"
src="https://www.highcharts.com/samples/embed/highcharts/palette/branding" allow="fullscreen"></iframe>

The palette layer (light and dark)
----------------------------------

The `palette` option defines the chart color system (since v13). It supports separate
light and dark palettes and can switch automatically based on user preference.

```js
Highcharts.setOptions({
    palette: {
        light: {
            colors: [
                '#e32412',
                '#fadb8b',
                '#2364b9',
                '#059649'
            ],
            backgroundColor: '#f6f5f4',
            highlightColor: '#e32412'
        },
        dark: {
            colors: [
                '#e32412',
                '#fadb8b',
                '#2364b9',
                '#059649'
            ],
            backgroundColor: '#1b1918',
            highlightColor: '#fadb8b'
        }
    }
});
```
Read the [full API docs for
palette](https://api.highcharts.com/highcharts/palette), and see a [live demo of
palette options](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/palette/colorscheme).

Notes:

* `palette.light.colors` and `palette.dark.colors` are the primary data series colors.
* `neutralColor` and `highlightColor` are used by labels and interactive UI elements.
* Use `colorScheme: 'light'` or `colorScheme: 'dark'` to force one mode. See
  [colorScheme example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/palette/colorscheme).
* Forced modes can also be applied by adding either the `highcharts-light` or
  `highcharts-dark` class name to any parent element of the chart (typically
  `body` or `html`). In a typical website setup, the end user is allowed to
  switch between System, Light and Dark modes. This can be linked to body class
  names in order to make the charts adhere.

Specific color options as a theme layer
---------------------------------------

Palette values are defaults. In addition, you can define specific chart color
options globally with `Highcharts.setOptions`. This is still theme setup, not
chart-by-chart configuration.

```js
Highcharts.setOptions({

    // ... palette options ...

    // Define the colors and styles for the specific chart elements,
    // extending the general palette
    yAxis: {
        // This is how to set a literal color
        gridLineColor: '#888a'
    },

    title: {
        style: {
            // This is how to use a color from the palette
            color: 'var(--highcharts-neutral-color-60)',
            fontSize: '1.5em'
        }
    },

    tooltip: {
        borderWidth: 1,
        // This is how to use the `light-dark` CSS function to set a color
        // that adapts to light and dark mode
        borderColor: 'light-dark(#fff, #666)'
    }
});
```

Per-chart overrides remain available when you need exceptions:

```js
Highcharts.chart('container', {
    chart: {
        backgroundColor: 'light-dark(#FFFFFF, #10131A)'
    }
});
```

The `light-dark(lightColor, darkColor)` syntax is useful when one option needs different
values per mode. It can be used directly in color options and together with
`var(--your-css-variable)` if you keep brand tokens in CSS.

Typography
----------

The fastest way to apply brand typography is setting `chart.style.fontFamily`
globally, then overriding specific text elements if needed.

```js
Highcharts.setOptions({

    // ... palette options ...

    chart: {
        style: {
            // Arial Narrow serves as a proxy for the Morningstar corporate font
            fontFamily: 'Arial Narrow, sans-serif',
            fontSize: '1.2rem'
        }
    },
    title: {
        style: {
            fontWeight: '600'
        }
    },
    legend: {
        itemStyle: {
            fontWeight: '500'
        }
    }
});
```

Use element-level style options like `title.style`, `subtitle.style`,
`xAxis.labels.style`, `yAxis.title.style` and `legend.itemStyle` for fine
control.

Custom logo in credits
----------------------

To add a branded logo, set `credits.text` to HTML and point `credits.href` to
your site.

```js
Highcharts.setOptions({
    // ... palette and other options ...
    credits: {
        href: 'https://example.com',
        text: '<img src="/assets/brand-mark.svg" alt="Example" ' +
            'style="height:12px;vertical-align:middle" />',
        style: {
            cursor: 'pointer'
        },
        useHTML: true
    }
});
```

You can combine logo and text:

```js
credits: {
    href: 'https://example.com',
    text: '<img src="/assets/brand-mark.svg" alt="" ' +
        'style="height:12px;vertical-align:middle" /> Example Analytics',
    useHTML: true
}
```

For reliable client-side exporting, host the logo on the same origin or make
sure it allows CORS.

Recommended setup workflow
--------------------------

1. Define your brand palette and key color options globally in `Highcharts.setOptions`. For
   direct color options, use `light-dark(...)` where needed.
2. Test both light and dark mode (`colorScheme: 'light dark'`).
3. Add per-chart overrides only where a chart should differ from the theme.
4. Set typography globally, then adjust key text elements.
5. Replace default credits text with logo + brand link.
6. Optionally, create a [theme file](https://www.highcharts.com/chart-design-and-style/themes) out of your configuration.
