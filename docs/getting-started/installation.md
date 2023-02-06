Installation
===

### npm and Bower

Highcharts is also available as packages through npm and Bower. Read more on installation with [npm](https://highcharts.com/docs/getting-started/install-from-npm) or [Bower](https://highcharts.com/docs/getting-started/install-from-bower) respectively. If you're not using these, continue reading.

### A. Include Highcharts

Include the JavaScript files in the `<head>` section of your web page as shown below.

```html
    <script src="https://code.highcharts.com/highcharts.js"></script>
```

### B. Alternatively, load files from your own domain

In the example above the JavaScript files are loaded from ajax.googleapis.com and [code.highcharts.com](https://code.highcharts.com). The Highcharts files can be downloaded from [highcharts.com](https://www.highcharts.com/download/) and put on your webpage. Here is an example with Highcharts served from your own server:

```html
<script src="/js/highcharts.js"></script>
```

### C. Load Highcharts Stock or Highcharts Maps

Highcharts is already included in Highcharts Stock, so it is not necessary to load both. The highstock.js file is included in the package. The highmaps.js file is also included, but unlike highstock.js, this doesn't include the complete Highcharts feature set. Highcharts Stock and Highcharts Maps can be loaded separate files like this:

```html
<script src="/js/highstock.js"></script>
<script src="/js/highmaps.js"></script>
```

But the separate files can't run in the same page along with each other or with highcharts.js. So if stock or maps are required in the same page as each other or with basic Highcharts, they can be loaded as modules:

```html
<script src="/js/highcharts.js"></script>
<script src="/js/modules/stock.js"></script>
<script src="/js/modules/map.js"></script>
```

### D. Get started

You are now ready to use Highcharts, see [Your first chart](https://highcharts.com/docs/getting-started/your-first-chart) to get started.

*) Highcharts version 1.x relied on excanvas.js for rendering in IE. From Highcharts 2.0 (and all Highcharts Stock versions) IE VML rendering is built into the library.
