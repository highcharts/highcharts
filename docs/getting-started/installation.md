Installation
===

This article is about installing Highcharts Core, Stock, Maps, or Gantt.

## Using a framework?

If you are using an official framework integration, start with that installation guide instead:

- [React](https://www.highcharts.com/docs/react/getting-started)
- [Angular](https://www.highcharts.com/integrations/angular/)
- [Vue](https://www.highcharts.com/integrations/vue/)
- [Svelte](https://www.highcharts.com/integrations/svelte/)
- [Flutter](https://www.highcharts.com/docs/flutter/getting-started)

## Looking for Grid or Dashboards?

If you want a data grid or a dashboard product, use one of these guides instead:

- [Highcharts Grid installation](https://www.highcharts.com/docs/grid/installation)
- [Highcharts Dashboards installation](https://www.highcharts.com/docs/dashboards/installation)

## Choose an installation approach

For most projects, use one of these approaches:

- **npm + a bundler**: Best for React, Angular, Vue, Svelte, TypeScript, Vite, Webpack, Rollup, and most modern apps.
- **ES modules in the browser**: Useful for modern browser-only apps, prototypes, and lightweight setups without a bundler.
- **Script tags**: Fine for simple pages, demos, and quick experiments.
- **AMD or CommonJS**: Legacy compatibility only. Prefer modern ESM-based setups for new projects.

## Recommended: npm and a bundler

Install the main package:

```bash
npm install highcharts
```

Then import the product you need:

```js
import Highcharts from 'highcharts';
```

For Stock, Maps, or Gantt, import the product bundle instead:

```js
import Highcharts from 'highcharts/highstock';
// or
import Highcharts from 'highcharts/highmaps';
// or
import Highcharts from 'highcharts/highcharts-gantt';
```

Use a product bundle when your page only needs that one product. If you need to combine products on the same page, load `highcharts` once and then add the extra products as modules instead.

### Loading modules with npm

Many features are optional modules rather than part of the base bundle. Common examples include exporting, accessibility, data, annotations, boost, no-data-to-display, and advanced product features.

Load a module by importing it after Highcharts:

```js
import Highcharts from 'highcharts';
import 'highcharts/modules/exporting';
import 'highcharts/modules/accessibility';

Highcharts.chart('container', {
    series: [{
        data: [1, 2, 3, 4, 5]
    }]
});
```

The same pattern applies to product modules:

```js
import Highcharts from 'highcharts';
import 'highcharts/modules/stock';
import 'highcharts/modules/map';
import 'highcharts/modules/gantt';
```

Use this module-based setup when you need more than one product in the same application or want finer control over what gets loaded.

## ES modules in the browser

If you are not using a bundler, you can still use modern ESM imports directly in the browser:

```html
<script type="module">
    import Highcharts from 'https://code.highcharts.com/esm/highcharts.js';
    import 'https://code.highcharts.com/esm/modules/exporting.js';
    import 'https://code.highcharts.com/esm/modules/accessibility.js';

    Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4, 5]
        }]
    });
</script>
```

This is a good fit for modern browser environments and simple apps without a build step.

### When to use ESM core files

Highcharts also provides lower-level ESM source files under `es-modules/`. These are mainly useful when you want tighter control over bundle contents and tree shaking.

This is more advanced than most projects need. In most cases, start with `highcharts`, `highcharts/highstock`, or the `esm/*.js` product bundles shown above.

## Script tags

For plain HTML pages, you can load Highcharts with script tags:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
```

Then create a chart in your page script:

```html
<script>
    Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4, 5]
        }]
    });
</script>
```

If you need optional functionality, load the required modules after the main script:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
```

If you only need one product, you can use its bundle directly:

```html
<script src="https://code.highcharts.com/highstock.js"></script>
```

If you need to combine products on the same page, load `highcharts.js` first and then load the product modules:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/stock.js"></script>
<script src="https://code.highcharts.com/modules/map.js"></script>
<script src="https://code.highcharts.com/modules/gantt.js"></script>
```

## Self-hosted files

If you do not want to load files from `code.highcharts.com`, download the package from [highcharts.com/download](https://www.highcharts.com/download/) and serve the files from your own domain:

```html
<script src="/js/highcharts.js"></script>
<script src="/js/modules/exporting.js"></script>
```

The same loading rules apply: start with the base product or bundle, then add any modules that your charts use.

## Understanding Highcharts modules

Highcharts is modular. The base library gives you standard charting, and additional functionality is added through modules.

You typically need a module when:

- You want optional features such as exporting, accessibility, boost, annotations, data, or no-data-to-display.
- You need product functionality that is not part of the base `highcharts` bundle.
- You want to combine Core with Stock, Maps, or Gantt on the same page instead of using a single product bundle.

The loading order is important:

1. Load Highcharts or one product bundle first.
2. Load any additional modules after that.
3. Create the chart after all required modules are loaded.

If a chart option does not seem to work, the most common cause is that the required module has not been loaded yet.

## CDN usage

The CDN is useful for demos, prototypes, JSFiddle, CodePen, and simple static pages. For production applications, npm or self-hosted files are usually a better long-term choice.

If you use files from `code.highcharts.com`, make sure your usage complies with the [Highsoft fair usage policy](https://www.highcharts.com/blog/fair-usage-policy-pdf).

## AMD and CommonJS

Highcharts still works with AMD loaders such as RequireJS and with CommonJS-style setups, but these are now legacy installation patterns.

Use them only if you are maintaining an older application that already depends on them. For new projects, prefer npm with a modern bundler or native ES modules.

CommonJS example:

```js
const Highcharts = require('highcharts');
require('highcharts/modules/exporting');

Highcharts.chart('container', {
    series: [{
        data: [1, 2, 3, 4, 5]
    }]
});
```

AMD example:

```html
<script src="require.js"></script>
<script>
    require.config({
        packages: [{
            name: 'highcharts',
            main: 'highcharts'
        }],
        paths: {
            highcharts: 'https://code.highcharts.com'
        }
    });

    require(['highcharts', 'highcharts/modules/exporting'], function (Highcharts) {
        Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4, 5]
            }]
        });
    });
</script>
```

## Legacy browsers

If you need to support legacy browsers such as IE 11 or QtWeb, load files from the `es5` folder instead. See [System requirements](https://www.highcharts.com/docs/getting-started/system-requirements) for details.

## Build your own packages

If you need tighter control over file size or want to create a custom build, see [Creating custom Highcharts packages](https://www.highcharts.com/docs/getting-started/how-to-create-custom-highcharts-packages).

## Get started

Once Highcharts is installed, continue with [Your first chart](https://www.highcharts.com/docs/getting-started/your-first-chart).
