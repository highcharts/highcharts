# Introduction to DataGrid

DataGrid is a versatile tool for displaying and managing tabular data. It offers developers a customizable and interactive table format for data visualization.

Integrated with the Highcharts Dashboards package, DataGrid can be used either as a standalone component or within a dashboard as a [Dashboards DataGrid Component](https://www.highcharts.com/docs/dashboards/datagrid-component). **However, its usage requires a Dashboards license**. This flexibility allows developers to incorporate DataGrid into various web applications for seamless data interaction and management.

This section of the documentation focuses on DataGrid as a whole. For specific information on DataGrid in a Dashboards context, see the article on [Dashboards DataGrid Component](https://www.highcharts.com/docs/dashboards/datagrid-component).

## My First DataGrid

Let's dive right in with a bare minimum example of a fully functional DataGrid:
 
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My First DataGrid</title>

    <script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
    <link
      rel="stylesheet"
      href="https://code.highcharts.com/dashboards/css/datagrid.css"
    />

    <script type="text/javascript">
      DataGrid.dataGrid("container", {
        dataTable: {
          columns: {
            product: ["Apple", "Pear", "Plum", "Banana"],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
          },
        },
      });
    </script>
  </head>
  <body>
    <div id="container"></div>
  </body>
</html>
```

### 1. Import required JS and CSS

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
<link
  rel="stylesheet"
  href="https://code.highcharts.com/dashboards/css/datagrid.css"
/>
```

Import the required JS and CSS from our public CDN. The [Installation article](https://www.highcharts.com/docs/datagrid/installation) provides more information and other installation options.

The CSS includes the necessary styles for the DataGrid to function correctly and the default style theme. For information on custom styling, see [Style by CSS](https://www.highcharts.com/docs/datagrid/style-by-css).

### 2. Configure the DataGrid

```js
DataGrid.dataGrid("container", {
  dataTable: {
    columns: {
      product: ["Apple", "Pear", "Plum", "Banana"],
      weight: [100, 40, 0.5, 200],
      price: [1.5, 2.53, 5, 4.5],
    },
  },
});
```

Inside the `<script>` tag, create a new instance of the DataGrid by utilizing the `DataGrid.dataGrid` factory function. This function takes two required arguments:

1. The ID of the HTML element where the DataGrid should be rendered.
2. The DataGrid configuration object.

Only the `dataTable` option is required for a DataGrid to be rendered. For more information on the configuration object, read the [Understanding DataGrid](https://www.highcharts.com/docs/datagrid/understanding-datagrid) article.

### 3. Add the HTML Element

```html
<div id="container"></div>
```

Add an HTML element to the `body` with the ID you specified as the first argument in `DataGrid.dataGrid`.

## View the Result

With the configuration above, your DataGrid should look like this:

<iframe src="https://www.highcharts.com/samples/embed/data-grid/demo/your-first-datagrid" allow="fullscreen"></iframe>

Go to [Understanding DataGrid](https://www.highcharts.com/docs/datagrid/understanding-datagrid) to read more about DataGrid structure and configuration options.
