---
sidebar_label: "Width"
---

# Column width

Column widths are configured using the `columns[].width` and/or `columnDefaults.width` option. Supported values are pixels (e.g. `150` or `'150px'`), percentages (e.g. `'20%'`), and `'auto'`.

The default value is `'auto'`. An `'auto'` width, either explicitly set or implied by omitting the option, causes the column to participate in automatic width distribution.

Percentage values are always calculated relative to the **total table width**.

## Width behavior

The table always fills the width of its container. Column widths are resolved according to the following rules:

- **No widths defined (or all set to `'auto'`)**  
  All columns are evenly distributed across the available table width.

- **Some widths defined**  
  Pixel and percentage widths are applied first. Any remaining available space is then **evenly distributed** among columns with `width: 'auto'` or no width defined.

- **Defined widths exceed table width**  
  If the total defined width exceeds the available table width, the table overflows horizontally and a scrollbar appears.

- **Defined widths below table width**  
  If all columns have defined widths and their combined width is less than the available table width, unused whitespace appears on the right.

Columns with percentage or `'auto'` widths automatically adjust when the container is resized.

For predictable layout and behavior, it is recommended to configure column widths using this API option rather than applying widths via CSS.

## Example 1

```js
columns: [{
    id: 'column_1',
    width: 150 // fixed at 150px
}, {
    id: 'column_2',
    width: '20%' // 20% of the table width
}, {
    id: 'column_3', // no width specified so defaults to 'auto'
}]
```

## Example 2

```js
columnDefaults: {
    width: 50 // all columns default to 50px
},
columns: [{
    id: 'column_1',
    width: 'auto' // overrides default and expands to fill remaining space
}]
```
