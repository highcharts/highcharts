---
sidebar_label: "Installation"
---

# Grid Installation

Highcharts Grid comes in two versions: **Grid Lite** and **Grid Pro**.
- **Grid Lite** is a free version of Grid with a basic feature set.
- **Grid Pro** is a more advanced, commercial version with additional features. It is currently part of the **Dashboards** package and will be available as a standalone package in parallel with the next major **Dashboards** version (v4.0).

## Installing Grid Pro

Currently, **Grid Pro** is part of Highcharts Dashboards and will be available as a standalone library after the release of Dashboards v4. See the [Dashboards Grid Standalone](https://www.highcharts.com/docs/dashboards/grid-standalone) documentation article for more info.

## Installing Grid Lite

### Install via NPM

You can install **Grid Lite** via NPM:

```bash
npm install @highcharts/grid-lite
```

Then, import the package into your project:

```js
import * as Grid from '@highcharts/grid-lite/grid-lite';
import '@highcharts/grid-lite/css/grid.css';
```

### Include Grid Lite via `<script>` tag

Load **Grid Lite** from our public CDN by adding the appropriate JavaScript and CSS files to your page's `<head>` section:

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid.css" />
```

Alternatively, you can download the files from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server:

```html
<script src="../code/grid/grid-lite.js"></script>
<link rel="stylesheet" href="../code/grid/css/grid.css" />
```

### Get Started
Once installed, you are ready to use **Grid Lite**. Check out [Your First Grid](https://www.highcharts.com/docs/grid/general) to learn more.


