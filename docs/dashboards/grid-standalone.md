# Using Grid Pro as a standalone component

**Highcharts Grid** (formerly known as DataGrid) is a versatile tool for displaying and managing tabular data. Originally introduced as a component in Highcharts Dashboards, it provides a high-performance, interactive, and editable data table solution.

Highcharts Grid is available in two versions:

**Highcharts Grid Lite** – A free version with a basic feature set.

**Highcharts Grid Pro** – A more advanced, commercial version that currently requires a Highcharts Dashboards license and includes additional features. Though it is part of the Dashboards package and license, Grid Pro can also be used as a standalone component outside of Dashboards.

Documentation for Highcharts Grid Pro can be found in the [general documentation for Higcharts Grid](https://www.highcharts.com/docs/grid/general).

## Installing Grid Pro

### Install via NPM

You can install **Grid Pro** via NPM:

```bash
npm install @highcharts/dashboards
```

Then, import the package into your project:

```js
import * as Grid from '@highcharts/dashboards/datagrid';
import '@highcharts/dashboards/css/datagrid.css';
```

### Include Grid Pro via `<script>` tag

Load **Grid Pro** from our public CDN by adding the appropriate JavaScript and CSS files to your page's `<head>` section:

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
<link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/datagrid.css" />
```

Alternatively, you can download the files from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server:

```html
<script src="../code/dashboards/datagrid.js"></script>
<link rel="stylesheet" href="../code/dashboards/css/datagrid.css" />
```

## Usage
Usage is identical to standalone Grid packages, see [this article](https://www.highcharts.com/docs/grid/general) to learn more.
