Style by CSS
===

By default the DataGrid is rendered as a table and all elements are styled by CSS.
All elements have default CSS classes, and you can also append your own custom classes to each element. This allows you to style the table as per your specific styling needs.

General structure:
```html
<table>
    <thead>
        <tr>
            <th>Column header</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Cell value</td>
        </tr>
    </tbody>
</table>
```

## Importing the CSS
The CSS is not included in the library by default, but you can import it like below:
```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

## Row/Cell height
For performance reasons the height of every row, and hence cell, is static and long texts are truncated with an ellipsis.
However, you can disable this by setting the [settings.rows.strictHeights](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnsSettings#strictHeights) option to `true`

```js
settings: {
    rows: {
        strictHeights: true
    }
}
```

## General classes
Each of the class name contains a prefix `highcharts-datagrid` and a suffix that
describes the element.

We can distinguish a few main elements and their classes:
- `highcharts-datagrid-container` - the main class for the DataGrid
- `highcharts-datagrid-row` - the class for the DataGrid's row
- `highcharts-datagrid-cell` - the class for the DataGrid's cell

The rest of the classes are specific for each element.

To style the DataGrid's rows:
```css
.highcharts-dashboards-row {
    padding: 10px;
}

.highcharts-dashboards-hovered-row {
    background-color: green;
}

.highcharts-dashboards-rows-odd {
    background-color: red;
}
```

To style the DataGrid's particular row:
```css
.highcharts-datagrid-row[data-row-index="1"] {
    background-color: red;
}
```

To style the DataGrid's cell:
```css
.highcharts-datagrid-row[data-row-index="1"] td {
    height: 150px;
}

.highcharts-dashboards-hovered-cell {
    border: 1px solid red;
}

.highcharts-dashboards-focused-cell {
    border: 1px solid yellow;
}
```

To style the DataGrid's columns:
```css
.highcharts-dashboards-column {
    padding: 10px;
}

.highcharts-dashboards-hovered-column {
    background-color: blue;
}
```

To style the DataGrid's particular column:
```css
.highcharts-datagrid-column[data-column-id="b"] {
    width: 30%;
}
```

To style column sorting option
```css
.highcharts-dashboards-column-sorting {
    background-color: blue;
}

.highcharts-dashboards-column-sorting-asc {
    background: url(../myImages/arrowTop.png);
}

.highcharts-dashboards-column-sorting-desc {
    background: url(../myImages/arrowDown.png);
}
```

## Custom classes
In the DataGrid config you can add a custom class.

See how the `CSS class` can be added to the column:

```ts
DataGrid.dataGrid('container', {
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200]
        }
    },
    columns: {
        weight: {
            className: 'custom-column-class-name'
        }
    }
});
```

```css
.custom-column-class-name {
    color: red;
}
```

The final result might look like:

<iframe src="https://www.highcharts.com/samples/embed/data-grid/demo/datagrid-custom-class" allow="fullscreen"></iframe>
