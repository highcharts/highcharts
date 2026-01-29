# Highcharts Dashboards with Vue

To create a dashboard with **Vue**, please follow the steps below:

## 1. Install the Dashboards package

```bash
npm install @highcharts/dashboards
```

## 2. Import the Dashboards package

```typescript
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
```

## 3. Additional packages

If you need charts or data grids in your dashboard you need to install the  **Highcharts Core** and **Highcharts Grid Pro** NPM packages.

First, install the packages you need:

```bash
npm install highcharts
npm install @highcharts/grid-pro
```

Then, import the packages and the dedicated plugin to connect it to the dashboard:

```typescript
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import Grid from '@highcharts/grid-pro';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(Grid);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);
```

__Please Note:__ If you are using the **Visual Studio Code** editor with the
**Volar** extension, you should change the extension setting
`"vue.server.maxFileSize"` to a value of at least `25000000` bytes to get
full editor support for all Highcharts modules. You will find it in the menu
`File` -> `Preferences` -> `Settings`, where you have to scroll to the
`Vue: Max File Size` value.

## 4. Prepare the structure and layout

Dashboards can use the built-in layout system or your own custom HTML.

### Option A: Built-in layout

The layout module is required to use the built-in [layout system](https://www.highcharts.com/docs/dashboards/layout-description):

```typescript
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';
```

Then create a Vue component that mounts the dashboard:

```vue
<!-- Dashboard.vue -->
<template>
  <div ref="dashboardContainer"></div>
</template>

<script setup>
// Import necessary Vue functions
import { watch, ref } from 'vue';

// Import Highcharts, Dashboards and Dashboard Plugins
import Highcharts from 'highcharts';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

// Define props and the Dashboards container
const props = defineProps(['config']);
const dashboardsContainer = ref(null);

// Once the container is added to the DOM, render the Dashboard
// with the config given in props
watch(dashboardsContainer, () => {
  if (dashboardsContainer.value) {
    Dashboards.board(dashboardsContainer.value, props.config, true);
  }
});
</script>
```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <Dashboard :config="config"></Dashboard>
  </div>
</template>

<script setup>
import Dashboard from './Dashboard.vue';
import '../src/style.css';

const config = {
  gui: {
    layouts: [{
      rows: [{
        cells: [{ id: 'cell-0' }, { id: 'cell-1' }]
      }]
    }]
  },
  components: [{
    renderTo: 'cell-0',
    type: 'Highcharts',
    chartOptions: { title: { text: 'Series A' }, series: [{ data: [1, 2, 3] }] }
  }, {
    renderTo: 'cell-1',
    type: 'Highcharts',
    chartOptions: { title: { text: 'Series B' }, series: [{ data: [3, 2, 1] }] }
  }]
};
</script>
```

### Option B: Custom layout

When you need [full markup control](https://www.highcharts.com/docs/dashboards/layout-description#custom-layout), disable `gui` and point components to your own element ids.

```vue
<!-- Dashboard.vue -->
<template>
  <div id="container" ref="dashboardsContainer">
    <div class="row">
      <div class="cell" id="cell-0" />
      <div class="cell" id="cell-1" />
    </div>
  </div>
</template>

<script setup>
// Import necessary Vue functions
import { watch, ref } from 'vue';

// Import Highcharts, Dashboards and Dashboard Plugins
import Highcharts from 'highcharts';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

// Define props and the Dashboards container
const props = defineProps(['config']);
const dashboardsContainer = ref(null);

// Watch for changes in config prop and reinitialize if necessary
watch([props.config, dashboardsContainer], () => {
  if (dashboardsContainer.value) {
    Dashboards.board(dashboardsContainer.value, props.config);
  }
});
</script>
```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <Dashboard :config="config"></Dashboard>
  </div>
</template>

<script setup>
import Dashboard from './Dashboard.vue';
import '../src/style.css';

const config = {
  gui: { enabled: false },
  components: [{
    renderTo: 'cell-0',
    type: 'Highcharts',
    chartOptions: { title: { text: 'Sales' }, series: [{ data: [5, 3, 4] }] }
  }, {
    renderTo: 'cell-1',
    type: 'Highcharts',
    chartOptions: { title: { text: 'Profit' }, series: [{ data: [2, 2, 5] }] }
  }]
};
</script>
```

## Demos
See how it works in the following demos:
- [Example using built-in layout](https://stackblitz.com/edit/dashboards-vue3-rvlfu5f6)
- [Example using custom layout](https://stackblitz.com/edit/dashboards-vue3-j7wsgkjr)
