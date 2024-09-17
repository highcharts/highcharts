Style by CSS
===

The DataGrid is rendered as a HTML table and all table elements are styled via CSS.
All elements have default CSS classes, and you can also append your own custom classes to each element. This allows you to style the table as per your specific styling needs.

General structure:
```html
<table>
    <thead>
        <tr>
            <th>Column header 1</th>
            <th>Column header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Cell value 1</td>
            <td>Cell value 2</td>
        </tr>
    </tbody>
</table>
```

## Importing the CSS
The CSS is not included in the library by default, but you can import it like below:
```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

## Row height
The height of each row is dynamic and based on the highest cell. It allows adjusting the row height when changing the column width. However, this can impact performance. You can disable this feature by setting the [rendering.rows.strictHeights](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.RowsSettings#strictHeights) option to `true`.

```js
rendering: {
    rows: {
        strictHeights: true
    }
}
```

The default row height for the DataGrid with strict row heights enabled is determined by the `height` parameter set for `.highcharts-datagrid-table tbody tr`, which is `36px` by default. If you need to change it, you can override it using CSS:

```css
.highcharts-datagrid-table tbody tr {
    height: 50px;
}
```

The text in the cell will not wrap then, and anything that exceeds the width will be truncated and replaced with an ellipsis. If you use content that causes the cell height to exceed the declared row height, the row will not automatically expand. This will only happen if the `row.strictHeights` option is disabled.


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

.highcharts-dashboards-edited-cell {
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
.highcharts-dashboards-column-sortable {
    background-color: blue;
}

.highcharts-dashboards-column-sorted-asc {
    background: url(../myImages/arrowTop.png);
}

.highcharts-dashboards-column-sorted-desc {
    background: url(../myImages/arrowDown.png);
}
```

## Custom classes
In the DataGrid config you can add a custom class.

See how the `CSS class` can be added to the column:

```ts
DataGrid.dataGrid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200]
        }
    },
    columns: [{
        id: 'weight',
        className: 'custom-column-class-name'
    }]
});
```

```css
.custom-column-class-name {
    color: red;
}
```

The final result might look like:

<iframe src="https://www.highcharts.com/samples/embed/data-grid/demo/datagrid-custom-class" allow="fullscreen"></iframe>
