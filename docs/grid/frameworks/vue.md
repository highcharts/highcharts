---
sidebar_label: "Vue"
---

# Highcharts Grid with Vue
To create a Grid with Vue, please follow the steps below:

## 1. Install the Grid package
Install Grid Lite package with:
```bash
npm install @highcharts/grid-lite
```

## 2. Create a Grid Vue component:

```html
// Grid.vue

<script setup lang="ts">
import { watch, ref } from 'vue';
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

## 3. Use the component in your application:
```html
// App.vue

<script setup lang="ts">    
import Grid from './components/Grid.vue';

const config: Grid.Options = {
    data: {
        columns: {
            name: ['Alice', 'Bob', 'Charlie', 'David'],
            age: [23, 34, 45, 56],
            city: ['New York', 'Oslo', 'Paris', 'Tokyo'],
        }
    }
}
</script>

<template>
    <div id="app">
        <Grid :config="config" />
    </div>
</template>
```

See the live example [here](https://stackblitz.com/edit/highcharts-grid-vue-ts-fbnz62i9).
