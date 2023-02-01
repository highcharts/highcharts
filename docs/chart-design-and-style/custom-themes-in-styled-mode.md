Custom themes in styled mode
===

Highcharts allows you to create your own custom charts’ theme using CSS.

The default the CSS file for [styled mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css) is available as `/css/highcharts.css` on the root of `code.highcharts.com` as well as under version folders.

In the `highcharts.css` file, there are CSS variables for all the colors used in the chart, both for the data and for the GUI like labels, borders and such. Use them to easily style the chart in the customs theme. As a result, there is no need to overwrite all CSS classes.

Highcharts uses two ranges of colors called the neutral and the highlight colors. These range from a full contrast color with a weight of 100, to low-contrast variations with lower weight. You can use the [Palette Helper](https://www.highcharts.com/samples/highcharts/css/palette-helper) tool to generate these variations.

Featured themes
---------------

Highcharts offers three different themes by default. There are available as CSS files at `code.highcharts.com/css/themes` :

*   [dark-unica.css](https://code.highcharts.com/css/themes/dark-unica.css)

*   [sand-signika.css](https://code.highcharts.com/css/themes/sand-signika.css)

*   [grid-light.css](https://code.highcharts.com/css/themes/grid-light.css)


How to create your own theme
----------------------------


Follow the steps below to create a custom theme using CSS rules:

1.  Create a CSS file

2.  Use import to load all default highcharts styles

3.  Re-declare CSS variables of the default `highcharts.css` file. For more fine-grained control over each element's appearance, declare individual classes.

4.  Use the `yourtheme.css` file on your website.


Example of `yourtheme.css`


    @import 'https://code.highcharts.com/css/highcharts.css';

    /* This will re-declare variables */
    :root {
      --highcharts-color-0: #f45b5b;
    }

    /* Example of individual components overriding variables */
    .highcharts-title {
      fill: black;
      font-size: 26px;
      font-weight: bold;
    }

See our [CSS colors demo](https://www.highcharts.com/samples/highcharts/css/colors) for a boiler plate of experimenting with the default CSS.

