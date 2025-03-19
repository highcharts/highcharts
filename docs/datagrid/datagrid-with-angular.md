# DataGrid with Angular
To create a DataGrid with Angular, please follow the steps below:

## 1. Install the Dashboards package
The Dashboards package contains the DataGrid.
```bash
npm install @highcharts/dashboards
```

## 2. Import the Dashboards package
```ts
import DataGrid from '@highcharts/dashboards/datagrid';
```

## 3. Create an HTML container  
Add a div where you want to render the DataGrid.
```html
<div id="container"></div>
```

## 4. Create a DataGrid
Create a DataGrid using the factory function `DataGrid.dataGrid`. The function takes two arguments:
- `container` - the element where the DataGrid will be rendered, can be the id of the element or the direct reference to the element
- `options` - the object options for the DataGrid
```ts
DataGrid.dataGrid('container', this.options);
```

## Final example
```ts
import { Component, OnInit } from '@angular/core';
import DataGrid from '@highcharts/dashboards/datagrid';
import '@highcharts/dashboards/css/datagrid.css';

@Component({
    selector: 'app-root',
    standalone: true,
    template: '<div id="container"></div>',
})
export class AppComponent implements OnInit {
    private options: DataGrid.Options = {
        dataTable: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie', 'David'],
                age: [23, 34, 45, 56],
                city: ['New York', 'Oslo', 'Paris', 'Tokyo'],
            }
        }
    }

    ngOnInit() {
        DataGrid.dataGrid('container', this.options);
    }
}
```

See the live example [here](https://stackblitz.com/edit/highcharts-datagrid-angular?file=src%2Fmain.ts).

