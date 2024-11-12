Types of components
===

Components are the building blocks of the dashboard layout. There are several types of components, which you can use out of the box. Some of them come with a default configuration (KPI, Highcharts, DataGrid), and some components are completely flexible, so that you can configure them all by yourself (HTMLComponent). You define which type of component you want to use by defining its `type` property in the configuration object.

Here is the overview of the most important parameters, that can be defined for a component:
* `id` - The unique id of the component, which is later used to identify it by dashboard and/or used to set CSS styles.
* `cell` - id of the cell, in which the component should be placed
* `class` - CSS class
* `type` - the type of the component. It can be [`HTML`](#html-component), [`KPI`](#kpi-component), [`Highcharts`](#highcharts-component),
[`DataGrid`](#datagrid-component) or [custom defined](https://www.highcharts.com/docs/dashboards/custom-component).
* `events` - object containing a pair of name of the event and callback function that should be called on a given event. The list of events can be found in the API Reference but the most common one is `mount`.
* `sync` - list of events, which should be synchronized between components.

### HTML Component
The most basic and generic component type. Allows you to add everything which could be defined as HTML, as well as add some custom events.

The component can be defined in two ways:  
1. **AST-like**  
    Where you can define the name of the tag, its attributes, and nested children elements. [Check out the basic HTML component demo here.](https://www.highcharts.com/samples/embed/dashboards/components/component-html)
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
2. **String**  
    Where you can define the HTML code as a string. [Check out the basic HTML component demo here.](https://www.highcharts.com/samples/embed/dashboards/components/component-html)
    Code snippet:
    ```js
    {
        type: 'HTML',
        renderTo: 'dashboard-1',
        html: '<img src="https://www.highcharts.com/samples/graphics/stock-dark.svg">'
    }
    ```

Also please check the [Custom Component](https://www.highcharts.com/docs/dashboards/custom-component) section below, where you can find alternative ways to create HTML components.

You can find more information about HTML Component [here.](https://www.highcharts.com/docs/dashboards/html-component)

### Highcharts Component
The option to include a Highcharts chart in one of the components is available out of the box.  
With classic scripts import order matters, so make sure that the Dashboards module is imported after the Highcharts module.

Here is the set of files that need to be included to make the Highcharts component work.
```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
```

The last thing that you have to do is to specify the `type: 'Highcharts'` in the component’s config and that’s it. All of the charts options can be defined in the `chartOptions` object. You can either define static data, as you would do in the basic highcharts chart, or use the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling) to connect some dynamic data. The data gets parsed through the [columnAssignment](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.ConnectorOptions#columnAssignment) option to map correct values from the connector to reflect them in the series.
[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts). If data connector is connected, you can load the Highcharts' `dragDrop` module, to allow the user to change the value and sync the changes of this value with other components. Also, the editing is disabled by default, if the series data is based on the columns in the connector, which were created by `mathModifier`. You can read more in the `dataPool` section.

You can find more information about HighchartsComponent [here](https://www.highcharts.com/docs/dashboards/highcharts-component);

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
