Dark Mode and Themes
======

A Highcharts theme is a set of pre-defined options that are applied as default Highcharts options before each chart is instantiated.
Highcharts comes with several themes that can be easily applied to your chart by
including the following script tags on this pattern:

```html
<script src="https://code.highcharts.com/themes/adaptive.js"></script>
```

The TypeScript sources for the themes can be found on the [Highcharts repository](https://github.com/highcharts/highcharts/tree/master/ts/masters/themes).

When using [styled
mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css),
themes can be applied by loading [additional CSS
files](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode#featured-themes).

Dark mode in Highcharts, the Adaptive theme
-------------------------------------------
Highcharts ships with an adaptive theme, `/themes/adaptive.js`, that uses CSS
variables for responsively adhering to the user's preferred color scheme (since v12.3). It
operates in three modes:
1. **System**. Unless otherwise specified by the implementer, the Adaptive theme
uses the color scheme as per the
[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
CSS media query.
2. **Forced light**. If any of the chart parent elements has a `highcharts-light`
   class name.
3. **Forced dark**. If any of the chart parent elements has a `highcharts-dark`
   class name.

In a typical website setup, the end user is allowed to switch between System,
Light and Dark modes. This can be linked to body class names in order to make
the charts adhere.

The Adaptive theme can be extended in two layers:
1. Define your own color variables as seen below. For default CSS variable
   names, see [css/colors
   demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/colors).
2. For more granular control, color settings in Highcharts accept CSS variables,
   for example `background: 'var(--my-custom-background)'`.

<iframe style="width: 100%; height: 530px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/responsive/adaptive-theme" allow="fullscreen"></iframe>


Creating your own theme
-----------------------

Custom themes are applied by creating an options object and applying it to the
chart using the
[Highcharts.setOptions](https://api.highcharts.com/class-reference/Highcharts#.setOptions)
method (which is done in the theme JavaScript files).

Use the [palette
helper](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/palette-helper)
for help creating your own color theme.

Here's an example of how a simple non-adaptive theme may look:

```js
Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },

    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
```
