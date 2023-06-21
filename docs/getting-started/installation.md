Installation
===

## Loading Highcharts

There are many ways to use Highcharts, and you can choose the one that works best with your project.

### 1. npm

Highcharts is available as a package through npm. More info can be found on [installation with npm](https://highcharts.com/docs/getting-started/install-from-npm).

### 2. Loading from our CDN

Include the JavaScript files in the `<head>` section of your web page as shown below.

```html
    <script src="https://code.highcharts.com/highcharts.js"></script>
```

This will load Highcharts from our Content Delivery Network, where we host the files worldwide. An overview of the files available on the CDN can be found on [code.highcharts.com](https://code.highcharts.com). Specific versions can also be loaded.

*Note: We do not recommend loading the latest version automatically in production environments, as new versions may in rare occasions not be backwards-compatible.*

Here is an example of loading the latest v10 minor version:

```html
    <script src="https://code.highcharts.com/10/highcharts.js"></script>
```

### 3. Load the files from your own server

In the example above, the JavaScript files are loaded from our servers at [code.highcharts.com](https://code.highcharts.com). You can also serve the files yourself, from your own servers. The Highcharts files can be downloaded from [highcharts.com](https://www.highcharts.com/download/) and put on your webpage. Here is an example with Highcharts served from your own server:

```html
<script src="/js/highcharts.js"></script>
```

### 4. Load Highcharts as ES6 modules

Highcharts can be loaded using ECMAScript modules, both from the npm package and from our CDN. This allows for tree shaking, and can help reduce file size. For more information, see [installation with ES modules](https://highcharts.com/docs/getting-started/installation-with-esm).


### 5. Load Highcharts as an AMD or CommonJS module

Highcharts is compatible with AMD module loaders such as RequireJS, and can also be loaded as CommonJS modules, for example with Node.js. More info can be found on [installation with AMD or CommonJS](https://highcharts.com/docs/getting-started/installation-with-amd-commonjs).


## Loading Highcharts Stock, Highcharts Maps and Highcharts Gantt

Highcharts is already included in Highcharts Stock, Maps, and Gantt, so it is not necessary to load both.

The `highstock.js`, `highmaps.js` and `highcharts-gantt.js` files are included in the [download package](https://www.highcharts.com/download/) for installation on your own servers, and are also available on our [CDN](https://code.highcharts.com). They are also included in the [npm package](https://highcharts.com/docs/getting-started/install-from-npm).

These files can't run in the same page along with each other or with `highcharts.js`. If Stock, Maps, or Gantt are required in the same page as each other, or with basic Highcharts, they can be loaded as modules:

```html
<script src="/js/highcharts.js"></script>
<script src="/js/modules/stock.js"></script>
<script src="/js/modules/map.js"></script>
<script src="/js/modules/gantt.js"></script>
```

## Build your own packages

To reduce file size, or combine modules together to reduce latency, you may want to create your own build of the Highcharts modules. See [Creating custom Highcharts files](https://www.highcharts.com/docs/getting-started/how-to-create-custom-highcharts-packages) for more information.


## Get started

You are now ready to use Highcharts, see [Your first chart](https://highcharts.com/docs/getting-started/your-first-chart) to get started.
