---
sidebar_label: "Installation"
---

# Grid Installation

Highcharts Grid is available in two versions:

**Highcharts Grid Lite** – A free version with a basic feature set, focused on viewing and interacting with data.

**Highcharts Grid Pro** – A commercial version that includes everything in Grid Lite plus advanced features such as cell editing, data validation, sparklines and events to expand functionality and tailor the grid to your needs.

## Install via NPM

You can install both **Grid Lite** and **Grid Pro** via NPM and import the package into your project.

Grid Lite

```bash
npm install @highcharts/grid-lite
```

```js
import * as Grid from '@highcharts/grid-lite/grid-lite';
import '@highcharts/grid-lite/css/grid-lite.css';
```

Grid Pro

```bash
npm install @highcharts/grid-pro
```

```js
import * as Grid from '@highcharts/grid-pro/grid-pro';
import '@highcharts/grid-pro/css/grid-pro.css';
```

## Include Grid via `<script>` tag

Load **Grid** from the jsDelivr CDN by adding the appropriate JavaScript and CSS files to your page's `<head>` section.

Grid Lite:

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid-lite.css" />
```

Grid Pro:

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-pro/grid-pro.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-pro/css/grid-pro.css" />
```

Alternatively, you can download the files from [highcharts.com](https://www.highcharts.com/download/) and host it on your own server.

Grid Lite:

```html
<script src="../code/grid/grid-lite.js"></script>
<link rel="stylesheet" href="../code/grid/css/grid-lite.css" />
```

Grid Pro:

```html
<script src="../code/grid/grid-pro.js"></script>
<link rel="stylesheet" href="../code/grid/css/grid-pro.css" />
```

### Get Started

Once installed, you are ready to use **Highcharts Grid**. Check out [Your first Grid](https://www.highcharts.com/docs/grid/general) to learn more.
