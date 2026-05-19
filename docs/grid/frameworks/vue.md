---
sidebar_label: "Vue"
---

# Highcharts Grid with Vue

Use Grid Lite or Grid Pro in Vue by creating a small wrapper component that mounts the Grid into a template ref.

## 1. Install the Grid package

Install Grid Lite:

```bash
npm install @highcharts/grid-lite
```

## 2. Create a Grid component

```vue
// Grid.vue

<script setup lang="ts">
import { ref, watch } from 'vue';
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
import '@highcharts/grid-lite/css/grid-lite.css';

const props = defineProps(['config']);
const gridContainer = ref(null);

watch(gridContainer, () => {
    if (gridContainer.value) {
        Grid.grid(gridContainer.value, props.config);
    }
});
</script>

<template>
    <div ref="gridContainer"></div>
</template>
```

## 3. Use the component

```vue
// App.vue

<script setup lang="ts">
import GridComponent from './components/Grid.vue';

const config: Grid.Options = {
    data: {
        columns: {
            name: ['Alice', 'Bob', 'Charlie', 'David'],
            age: [23, 34, 45, 56],
            city: ['New York', 'Oslo', 'Paris', 'Tokyo']
        }
    }
};
</script>

<template>
    <div id="app">
        <GridComponent :config="config" />
    </div>
</template>
```

For Grid Pro, swap the imports to `@highcharts/grid-pro/...` and load the Grid Pro CSS file.

See the [live Vue example](https://stackblitz.com/edit/highcharts-grid-vue-ts-fbnz62i9).
