Style by CSS
===

By default each Dashboard and its element is styled by CSS. It gives you the
ability to change the look and feel of the dashboard. Most of the elements
have classes that you can use to style them. You can also add your own classes
or ids to the elements.


### Importing the CSS
The CSS is not included in the library but you can import it from the CDN like:
```css
@import url("https://code.highcharts.com/css/dashboards.css");
@import url("https://code.highcharts.com/css/highcharts.css");
@import url("https://code.highcharts.com/css/datagrid.css");
```

Note that each component has its own CSS file. You can import only the CSS
files that you need.

### General classes
Each of the class name contains a prefix `highcharts-dashboards` and a suffix that
describes the element.   
For example, the class name for the dashboard's row is `highcharts-dashboards-row`.

We can distinguish a few main elements and their classes:
- `highcharts-dashboards` - the main class for the dashboard
- `highcharts-dashboards-row` - the class for the dashboard's row
- `highcharts-dashboards-cell` - the class for the dashboard's cell
- `highcharts-dashboards-component` - the class for the dashboard's component

The rest of the classes are specific for each component or element.

To access and style the whole dashboard, its background and component you can use:
```css
.highcharts-dashboards,
.highcharts-dashboards-wrapper {
    background-color: #f2f9fd;
}
```

To style the dashboard's row:
```css
.highcharts-dashboards-row {
    padding: 10px;
}
```

To style the dashboard's cell:
```css
.highcharts-dashboards-cell {
    text-align: left;
}
```

To style the dashboard's component:
```css
.highcharts-dashboards-component {
    border-radius: 10px;
}
```

### Component classes
Each component has the generic component CSS class `highcharts-dashboards-component` and its own CSS class.

To style the dashboard's component title:
```css
.highcharts-dashboards-component-title {
    font-size: 12px;
}
```

## KPI Component
To style the dashboard's KPI component:
```css
.highcharts-dashboards-component-kpi {
    border-radius: 10px;
}
```

To style the dashboard's KPI value:
```css
.highcharts-dashboards-component-kpi-value {
    color: red;
}
```

## Highcharts Component
To style the dashboard's Highcharts component:
```css
.chart-container {
    background-color: gray;
}
```

You can find more information about the classes in Highcharts [here](https://www.highcharts.com/docs/chart-design-and-style/style-by-css)
## DataGrid Component
To style the dashboard's DataGrid component:
```css
.highcharts-datagrid-container {
    border-radius: 10px;
}
```

To style the dashboard's DataGrid header:
```css
.highcharts-datagrid-column-header {
    background-color: gray;
}
```

To style the dashboard's DataGrid row:
```css
.highcharts-datagrid-row {
    background-color: gray;
}
```
### Edit Mode classes

### Custom classes



