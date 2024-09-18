DataGrid with React
===

To create a DataGrid with Angular please follow the steps below: <br>

1. Install the Dashboards package, that contains DataGrid

    ```bash
    npm install @highcharts/dashboards
    ```

2. Import the Dashboards package.

    ```typescript
    import * as Dashboards from '@highcharts/dashboards';
    ```

3. Create a HTML container.  

    Add a div where you want to render the dashboard:
    ```html
    <div id="container"></div>
    ```

    You can refer to the element by its id or you can use the `ElementRef` to get the element.

4. Create a DataGrid using the factory function `DataGrid.dataGrid`. The function takes three arguments:
    - `container` - the element where the DataGrid will be rendered, can be an id of the element or the direct reference to the element
    - `options` - the options object for the DataGrid
