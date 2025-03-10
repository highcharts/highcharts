# Using Grid as a Standalone

The **Grid** (formerly **DataGrid**) was originally developed as the core of the [**Grid Component**](https://www.highcharts.com/docs/dashboards/grid-component) in **Highcharts Dashboards**, providing a high-performance, interactive, and editable data table solution. With the release of **Dashboards v4.0**, Grid will become a standalone product - **Grid Pro**. Its basic version, **Grid Lite**, is already available *([learn more about it here](https://www.highcharts.com/docs/grid/general)).*

## Installation

You can use **Grid Pro** as part of **Highcharts Dashboards** right now, as described below.

### Install via NPM

```bash
npm install @highcharts/dashboards
```

Then, import the package into your project:

```js
import Grid from '@highcharts/dashboards/datagrid';
import '@highcharts/dashboards/css/datagrid.css';
```

### Include Grid via `<script>` tag

You can also load **Grid** by adding the appropriate JavaScript file to your page's `<head>` section:

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
<link rel="stylesheet" href="https://code.highcharts.com/dashboards/css/datagrid.css" />
```

Alternatively, you can download the file from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server:

```html
<script src="../code/dashboards/datagrid.js"></script>
<link rel="stylesheet" href="../code/dashboards/css/datagrid.css" />
```

## Usage

Usage is identical to standalone Grid packages, see [this article](https://www.highcharts.com/docs/grid/general) to learn more.