---
sidebar_label: "Installation"
---

# Grid Installation

Highcharts Grid is available in two versions:

**Highcharts Grid Lite** – A free version with a basic feature set.

**Highcharts Grid Pro** – A more advanced, commercial version that currently requires a [Highcharts Dashboards](https://www.highcharts.com/docs/dashboards/grid-component) license and includes additional features. Though it is part of the Dashboards package and license, Grid Pro can also be used as a [standalone component](https://www.highcharts.com/docs/dashboards/grid-standalone).

## Installing Grid Pro

See the [Dashboards Grid Standalone](https://www.highcharts.com/docs/dashboards/grid-standalone) article for more information on installing **Grid Pro**.

## Installing Grid Lite

### Install via NPM

You can install **Grid Lite** via NPM:

```bash
npm install @highcharts/grid-lite
```

Then, import the package into your project:

```js
import * as Grid from '@highcharts/grid-lite/grid-lite';
import '@highcharts/grid-lite/css/grid-lite.css';
```

### Include Grid Lite via `<script>` tag

Load **Grid Lite** from our public CDN by adding the appropriate JavaScript and CSS files to your page's `<head>` section:

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid-lite.css" />
```

Alternatively, you can download the files from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server:

```html
<script src="../code/grid/grid-lite.js"></script>
<link rel="stylesheet" href="../code/grid/css/grid-lite.css" />
```

### Get Started
Once installed, you are ready to use **Grid Lite**. Check out [Your First Grid](https://www.highcharts.com/docs/grid/general) to learn more.
