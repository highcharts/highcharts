Types of Dashboards components
===

Components are the building blocks of the Dashboards layout. Several types of components are provided and can be used out of the box. The KPI, Highcharts, DataGrid components come pre-configured with default configurations, whereas the HTML component can be customized to fit specific needs. It is also possible to create and register Custom components. 

This is an overview of the most important parameters of a component:
* `id` - The unique identifier of the component, which is later used to identify it by dashboard and/or used to set CSS styles.
* `renderTo` - id of the cell to which which the component should be rendered
* `className` - CSS class that is applied to the component's container
* `type` - the type of the component. It can be [`HTML`](#html-component), [`KPI`](#kpi-component), [`Highcharts`](#highcharts-component),
[`DataGrid`](#datagrid-component) or [custom defined](https://www.highcharts.com/docs/dashboards/custom-component).
* `events` - object containing a pair of name of the event and callback function that should be called on a given event. The list of events can be found in the API Reference but the most common one is `mount`.
* `sync` - list of events, which should be synchronized between components.

### HTML Component
The most basic and generic component type. Allows you to add everything which could be defined as HTML, as well as add some custom events.

The HTML component can be defined in two ways:  
1. **Abstract Syntax Tree (AST) style**  
    Defines the HTML code as a nested tree structure. [Check out the basic HTML component demo here.](https://www.highcharts.com/samples/embed/dashboards/components/component-html)

    Code snippet:
    ```js
    {
        type: 'HTML',
        renderTo: 'dashboard-1',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }
    ```
2. **HTML string**  
    Defines the HTML code as a standard HTML string. [Check out the basic HTML component demo here.](https://www.highcharts.com/samples/embed/dashboards/components/component-html)

    Code snippet:
    ```js
    {
        type: 'HTML',
        renderTo: 'dashboard-1',
        html: '<img src="https://www.highcharts.com/samples/graphics/stock-dark.svg">'
    }
    ```

Alternative ways of creating HTML components are explained in the [Custom Component](https://www.highcharts.com/docs/dashboards/custom-component) section below.

Further information about the HTML Component can be found [here.](https://www.highcharts.com/docs/dashboards/html-component)

### Highcharts Component
Dashboards support the use of Highcharts charts or maps out of the box.

The Highcharts component needs these two files to work:
```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
```
Note that the import order matters, so make sure that the Dashboards module is imported after the Highcharts module. For a chart to be displayed the type `Highcharts` must be specified, the `renderTo` options given and some data must be provided as part of the chart options.

The `chartOptions` object offers the possibility to configure anything that can be configured in a stand-alone Highcharts chart.

Data may be provided directly in the chart series but in a dashboard context one normally wants to share data between components and in this case the Dashboard [Data Pool](https://www.highcharts.com/docs/dashboards/data-handling) offers the necessary mechanism.

Code snippet with data embedded in the chart series, no data connector used:
```js
{
    renderTo: 'dashboard-1',
    type: 'Highcharts',
    chartOptions: {
        series: [{
            data: [1, 2, 3, 4]
        }]
    }
},
```
Here is an example [without a data connector](https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts).

Code snippet using the Data Connector mechanism. Here the connector ID is the key as it links 
the component to the Data Pool:
```js
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Food', 'Vitamin A',  'Iron'],
                data: [
                    ['Beef Liver', 6421, 6.5],
                    ['Lamb Liver', 2122, 6.5],
                    ['Cod Liver Oil', 1350, 0.9],
                    ['Mackerel', 388, 1],
                    ['Tuna', 214, 0.6]
                ]
            }
        }]
    },
    components: [
    {
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'micro-element',
            columnAssignment: [{
                seriesId: 'Vitamin A',
                data: ['Food', 'Vitamin A']
            }]
        }
    }]
```
When using a Data Connector the data is parsed and organised in rows where `columnNames` either are given explicitly
or the first row is used as column names.

The chart then uses the [columnAssignment](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.ConnectorOptions#columnAssignment) option to map the values of a specific column to the chart's series.
Here is an [example](https://www.highcharts.com/samples/embed/dashboards/demo/minimal) that uses column assignment.

If the data connector is connected, you can load the Highcharts' `dragDrop` module, 
to allow the user to change the value and sync the changes of this value with other 
components. If a `mathModifier` is applied to the data from the connector,
chart editing is disabled. See the `dataPool` section for more details.

See the [HighchartsComponent](https://www.highcharts.com/docs/dashboards/highcharts-component) page for more detailed information.

### DataGrid Component
To visualize data in a row column format you can use the DataGrid component. Same as in Highcharts component, first, it needs to be imported. Here is the set of files.  
With classic scripts import order matters, so make sure that the Dashboards module is imported after the DataGrid module.
```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
```

Also the set of CSS styles needs to be imported, so that the DataGrid displays correctly.
```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```
Then you need to specify the component type with `type: 'DataGrid'`.
If you connect this component to the data connector, the content of the component will be automatically filled with data, and will allow the user to change the data in the data connector and automatically in all components that also are connected to this connector, by editing values in the cell. [Here is the example](https://www.highcharts.com/samples/embed/dashboards/datagrid-component/datagrid-options). By default, some columns have this option disabled, if the data was created by [mathModifier](https://www.highcharts.com/docs/dashboards/data-handling#datamodifier).

You can read more about the DataGrid Component [here](https://www.highcharts.com/docs/dashboards/datagrid-component).

### KPI Component
Another type of component type that allows you to visualize key performance indicators is KPIComponent. It is a simple component that displays a title and a value but it also can display the value on the chart to better visualize the data and the limit of the value.
You can define the threshold to change the style of the component when one value exceeds it and some other useful features to better show what is important to you.

This component type is bundled with the Highcharts plugin and you need to connect the Highcharts with the dashboard plugin to use it (similarly to the Highcharts component).

[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/component-kpi)

Code snippet:
```js
{
    renderTo: 'kpi-00',
    type: 'KPI',
    title: 'Average revenue',
    value: 888,
    threshold: [200, 800],
    thresholdColors: ['#f45b5b', '#f7a35c', '#90ed7d']
},
```

You can find more information about KPIComponent [here](https://www.highcharts.com/docs/dashboards/kpi-component).
