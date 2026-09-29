Themes
======

A Highcharts theme is a set of pre-defined options that are applied as default Highcharts options before each chart is instantiated.
Highcharts comes with several themes that can be easily applied to your chart by
including the following script tags on this pattern:

```html
<script src="https://code.highcharts.com/themes/sand-signika.js"></script>
```

The TypeScript sources for the themes can be found on the [Highcharts repository](https://github.com/highcharts/highcharts/tree/master/ts/masters/themes).

When using [styled
mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css),
themes can be applied by loading [additional CSS
files](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode#featured-themes).


Creating your own theme
-----------------------

Custom themes are applied by creating an options object and applying it to the
chart using the
[Highcharts.setOptions](https://api.highcharts.com/class-reference/Highcharts#.setOptions)
method (which is done in the theme JavaScript files).

See the [branding
page](https://www.highcharts.com/docs/chart-design-and-style/branding) for
concrete steps to set up your theme.

Here's an example of how a simple theme may look:

```js
Highcharts.theme = {
    palette: {
        light: {
            backgroundColor: '#ffffff',
            neutralColor: '#171A21',
            highlightColor: '#0057FF',
            colors: [
                '#0057FF',
                '#4E5AE8',
                '#00A86B',
                '#F26B1D',
                '#C23D9A',
                '#1E8AA8',
                '#C0A000',
                '#7D4CDB'
            ]
        },

        dark: {
            backgroundColor: '#0F1115',
            neutralColor: '#F3F5F8',
            highlightColor: '#66A3FF',
            colors: [
                '#66A3FF',
                '#8C94FF',
                '#37D39B',
                '#FF9A57',
                '#F48AE0',
                '#6FD3ED',
                '#F6D65B',
                '#B39DFF'
            ]
        }
    },

    chart: {
        backgroundColor: 'light-dark(#F7F9FC, #171A21)',
        plotBackgroundColor: 'light-dark(#FFFFFF, #11151C)',
        borderRadius: 10
    },

    title: {
        style: {
            color: 'light-dark(#111827, #F3F4F6)'
        }
    },

    xAxis: {
        gridLineColor: 'light-dark(#E5E7EB, #2A2E39)',
        labels: {
            style: {
                color: 'light-dark(#4B5563, #D1D5DB)'
            }
        }
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
```
