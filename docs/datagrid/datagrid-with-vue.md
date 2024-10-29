# DataGrid with Vue
To create a DataGrid with Vue please follow the steps below:

## 1. Install the Dashboards package
The Dashboards package contains the DataGrid
```bash
npm install @highcharts/dashboards
```

## 2. Create a DataGrid Vue component:

```html
// DataGrid.vue

<script setup lang="ts">
import { watch, ref } from 'vue';
import DataGrid from '@highcharts/dashboards/datagrid';
import "@highcharts/dashboards/css/datagrid.css";

const props = defineProps(['config']);
const datagridContainer = ref(null);

watch(datagridContainer, () => {
    if (datagridContainer.value) {
        DataGrid.dataGrid(datagridContainer.value, props.config);
    }
});
</script>

<template>
    <div ref="datagridContainer"></div>
</template>
```

## 3. Use the component in your application:
```html
// App.vue

<script setup lang="ts">    
import DataGrid from './components/DataGrid.vue';

const config: DataGrid.Options = {
    dataTable: {
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
        <DataGrid :config="config" />
    </div>
</template>
```

See the live example [here](https://stackblitz.com/edit/highcharts-datagrid-vue-ts?file=src%2FApp.vue,src%2Fcomponents%2FDataGrid.vue).
