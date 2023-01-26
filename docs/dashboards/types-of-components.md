Types of components
===

Components are the building blocks of the dashboard layout. There are numbers of types of components, which you can use out of the box. Some of them have come with some default configuration (KPI, Highcharts, DataGrid), and some components which leave you some flexibility so that you can configure them all by yourself (HTMLComponent). You define which type of the component you want to use by defining its `type` property in the configuration object.
Each component apart from the most basic one, which is HTMLComponent, needs to be imported with the `dashboards-plugin.js` module.

Here is the overview of most important parameters, that can be defined for a component:
* `Id` - The unique id of the component, which is later used to identify it by dashboard and/or used to set CSS styles.
* `Cell` - id of the cell, in which the component should be placed
* `Class` - CSS class
* `Type` - the type of the component.
* `Events` - object containing a pair of name of the event and callback function that should be called on a given event.
* `Sync` - list of events, which should be synchronized between components.

### HTML Component
The most basic and generic component type. Allows you to add everything which could be defiend as HTML, as well as add some custom events, but requires the most configuration. The configuration is AST-like, where you can define the name of the tag, its attributes, and nested children elements. [Check out the basic HTML component demo here.](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/component-html)

### Highcharts Component
The option to include a Highcharts chart in one of the components is available out of the box. Here is the set of files that need to be included to make the Highcharts component work.
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/dashboards-plugin.js"></script>
```

The last thing that you have to do is to specify the `type: 'Highcharts'` in the component’s config and that’s it. All of the charts options can be defined in the `chartOptions` object. You can either define static data, as you would do in the basic highcharts chart, or use the store <LINK TO STORE> to connect some dynamic data. The data gets parsed through the `tableAxisMap` option to map correct values from the store to reflect them in the series.
[Here is the example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/component-highcharts)

### DataGrid Component
To visualize data in a row column format you can use the DataGrid component. Same as in Highcharts component, first, it needs to be imported. Here is the set of files.
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
    <script src="https://code.highcharts.com/modules/dashboards-plugin.js"></script>
```

Also the set of CSS styles needs to be imported, so that the DataGrid displays correctly.
```css
    @import "https://code.highcharts.com/css/datagrid.css";
```
Then you need to specify the component type with `type: 'DataGrid'`.
The if you connect this component to the store, the content of the component will be automatically filled with data, and will allow the user to change the data in the store and automatically in all components that also are connected to this store, by editing values in the cell. [Here is the example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/dashboards-datagrid-component)

### KPI Component
Another type of component type, that allows you to visualize key performance indicators is KPIComponent. This component type is added with the dashboard package, so nothing apart from basic dashboards package needs to be imported.
You can define the threshold to change the style of the component, when one value exceeds it and some other useful features to better show what is important to you.

[Here is the example](http://utils.highcharts.local/samples/#view/dashboards/demos/dashboards-component-kpi)
