Your first DataGrid
===

When you are ready to create your first simple DataGrid, please follow these steps:

1. Add a div to your webpage with a specific id.

```html
<div id="container">
```

2. In this basic example we are going to create a simple Datagrid. Firstly we
have to import the Datagrid library.

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
```

3. The DataGrid requires a few basic styles, so you can get the basic one by
importing the modules to the CSS file as shown below.

```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

You can also use your own styles, check our [docs about styling](https://www.highcharts.com/docs/dashboards/style-by-css).

4. We are ready to start working on an actual Datagrid config.
Inside the script tag, create a new instance of the DataGrid.  

To do so, you have to pass two arguments:  
* the div’s id where the DataGrid should be initialize (see point 1).
* the object with DataGrid options.

To do so, you can use the factory function `DataGrid.dataGrid`:

```js
DataGrid.dataGrid('container', {...})
```

5. As options, you have to provide the data, that should be rendered:
```js
DataGrid.dataGrid('container', {
    table: {
        columns: {
            date: [1640995200000, 1641081600000, 1641168000000, 1641254400000],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    }
});
```

or use the [DataTable](https://www.highcharts.com/docs/dashboards/data-table).

```js
const columns = {
    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    weight: [100, 40, 0.5, 200],
    price: [1.5, 2.53, 5, 4.5],
    metaData: ['a', 'b', 'c', 'd']
};

DataGrid.dataGrid('container', {
    table: new DataTable({
        columns
    })
});
```

6. With that config, your DataGrid should look like the example below:

<iframe src="https://www.highcharts.com/samples/embed/data-grid/demo/your-first-datagrid" allow="fullscreen"></iframe>
