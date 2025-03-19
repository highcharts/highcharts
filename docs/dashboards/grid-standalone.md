# Using Grid as a standalone component

Highcharts **Grid** (formerly **DataGrid**) was originally a basic [component](https://www.highcharts.com/docs/dashboards/grid-component) in **Highcharts Dashboards**, providing a high-performance, interactive, and editable data table solution. With the release of **Dashboards v4.0**, Grid will become a standalone product - **Grid Pro**. Its basic version, **Grid Lite**, is already available *([learn more about it here](https://www.highcharts.com/docs/grid/general)).*

For now **Grid Pro** is a part of **Highcharts Dashboards**, but can also be used as a standalone component outside of Dashboards, as described below.

## Installing Grid Pro

### Install via NPM

You can install **Grid Pro** via NPM:

```bash
npm install @highcharts/dashboards
```

Then, import the package into your project:

```js
import Grid from '@highcharts/dashboards/datagrid';
import '@highcharts/dashboards/css/datagrid.css';
```

### Include Grid Pro via `<script>` tag

Load **Grid Pro** from our public CDN by adding the appropriate JavaScript and CSS files to your page's `<head>` section:

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/dashboards/datagrid.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/dashboards/css/datagrid.css" />
```

Alternatively, you can download the files from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server:

```html
<script src="../code/dashboards/datagrid.js"></script>
<link rel="stylesheet" href="../code/dashboards/css/datagrid.css" />
```

## Usage
Usage is identical to standalone Grid packages, see [this article](https://www.highcharts.com/docs/grid/general) to learn more.