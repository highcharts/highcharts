Installation with ES6 modules
=============================

Our product packages (bundles) are available as ES6-compatible modules since
Highcharts v6.1. Some core files can also be loaded directly as ES6 modules
since Highcharts v9.2. Latter allows you to make use of tree shaking to only
load what is needed and reduces download and package sizes.



Including a product package (ES6 bundle)
----------------------------------------

Include the JavaScript file in the `<head>` section of your web page as shown
below.

```html
    <script type="module">
        import Highcharts from "https://code.highcharts.com/es-modules/masters/highcharts.src.js"

        // Example to create a simple chart:
        Highcharts.chart('container', { series: [{ data: [1, 2, 3]}] });
    </script>
```



Including a core module (ES6 module)
------------------------------------

The advantage of core modules in comparison to packages is to load only the
series, you need. If you write your own ES6 module, you have to import modules
there and skip the HTML tags.

For a line chart include the JavaScript files as shown below.

```html
    <script type="module">
        import Chart from 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
        import LineSeries from 'https://code.highcharts.com/es-modules/Series/Line/LineSeries.js';

        // Example to create a simple line chart in a div#container:
        const myChart = new Chart('container', { series: [{ type: 'line', data: [1, 2, 3]}] });
    </script>
```

For a column chart or pie chart, do as shown below.

```html
    <script type="module">
        import Chart from 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
        import ColumnSeries from 'https://code.highcharts.com/es-modules/Series/Column/ColumnSeries.js';

        // Example to create a simple column chart in a div#container:
        const myChart = new Chart('container', { series: [{ type: 'column', data: [1, 2, 3]}] });
    </script>
```

```html
    <script type="module">
        import Chart from 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
        import PieSeries from 'https://code.highcharts.com/es-modules/Series/Pie/PieSeries.js';

        // Example to create a simple pie chart in a div#container:
        const myChart = new Chart('container', { series: [{ type: 'pie', data: [1, 2, 3]}] });
    </script>
```



Optional functionality via compositions
---------------------------------------

Unlike packages the core modules provide not all funcationality out of the box.
You can find details about optional functionality in the source code of product
packages.

Do as below to activate data labels for example. 

```js
    import Chart from 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
    import LineSeries from 'https://code.highcharts.com/es-modules/Series/Line/LineSeries.js';
    import DataLabel from 'https://code.highcharts.com/es-modules/Core/Series/DataLabel.js';

    DataLabel.compose(LineSeries);
```

```js
    import Chart from 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
    import ColumnSeries from 'https://code.highcharts.com/es-modules/Series/Column/ColumnSeries.js';
    import ColumnDataLabel from 'https://code.highcharts.com/es-modules/Series/Column/ColumnDataLabel.js';

    ColumnDataLabel.compose(ColumnSeries);
```

```js
    import Chart from 'https://code.highcharts.com/es-modules/Core/Chart/Chart.js';
    import PieSeries from 'https://code.highcharts.com/es-modules/Series/Pie/PieSeries.js';
    import PieDataLabel from 'https://code.highcharts.com/es-modules/Series/Pie/PieDataLabel.js';

    PieDataLabel.compose(PieSeries);
```



Advantage of tree shaking
-------------------------

Tree shaking by loading core files directly helps to reduce the size of files to
download and reduces the size of your project. It is especially useful when only
a specific chart type is needed. See the following comparison for our examples:

| File              | Download Size | Saving |
|-------------------|---------------|--------|
| highcharts.src.js | 3,27 MB       | 0%     |
| LineSeries.js     | 1,01 MB       | 69%    |
| ColumnSeries.js   | 1,33 MB       | 59%    |
| PieSeries.js      | 1,40 MB       | 57%    |



Troubleshooting
---------------

If loading a core file fails with missing some code, the file is not ready to
be directly loaded. In this case you have to use the product packages. Combining
product packages and core modules is not supported.

If using a function fails with missing some code, a compose call might be
necessary after loading one of the module files. Consult the source code of the
product packages in the master path for details.
