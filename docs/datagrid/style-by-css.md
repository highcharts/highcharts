Style by CSS
===

By default the DataGrid is rendered as a table and all elements are styled by CSS.
It allows you to style the DataGrid as you need. You can also add your own classes to the elements.

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

## General classes
Each of the class name contains a prefix `highcharts-datagrid` and a suffix that
describes the element.

We can distinguish a few main elements and their classes:
- `highcharts-datagrid-container` - the main class for the DataGrid
- `highcharts-datagrid-row` - the class for the DataGrid's row
- `highcharts-datagrid-cell` - the class for the DataGrid's cell

The rest of the classes are specific for each element.

To style the DataGrid's row:
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

To style the DataGrid's cell:
```css
.highcharts-dashboards-hovered-cell {
    border: 1px solid red;
}

.highcharts-dashboards-focused-cell {
    border: 1px solid yellow;
}
```

To style the DataGrid's column:
```css
.highcharts-dashboards-column {
    padding: 10px;
}

.highcharts-dashboards-hovered-column {
    background-color: blue;
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

<iframe src="https://www.highcharts.com/samples/embed/datagrid/demo/datagrid-basic" allow="fullscreen"></iframe>
