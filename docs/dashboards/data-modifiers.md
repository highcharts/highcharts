Data Modifiers
===

The data comes in different shapes and sizes from all over the internet, so there needs to be a way of adjusting its format so that it is accessible to the Dashboards. Instead of manually parsing the data, there is an option to use the `DataModifiers`. Those modifiers allow the user to modify the data on the initial load, as well as the end user to modify visible data through the GUI. Each of the modifiers is accessible through the main Dashboards package, except for the `MathModifier` which is the most complex one, and requires loading a separate module from `https://code.highcharts.com/dashboards/modules/math-modifier.js`. Each of the modifiers is available to connect to every type of connector.

### Where the modifier is defined?
The modifier is attached to the connector that is defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling), in its options.

### Types of modifiers
The types of modifiers that are available are:

* Chain
* Range
* Invert
* Math
* Sort

### How to add the modifier?
To add the modifier, you need to specify it in the options of the connector.
```js
connector: {
    type: 'CSV',
    id: 'connector-id',
    options: {
        //... other options
        dataModifier: {
            type: 'Math' // or 'Invert'|'Math' etc,
            // additional modifier options
        }
    }
}
```
The modifier modifies the `table.modified` property of the connector, which leaves the original data unchanged so that there is a way of restoring the original data if needed.

### What does each of the modifiers do?

Here is a brief description of each of the modifiers:
* Chain - Allows to combine multiple modifiers in the same connector. This is useful if you need to perform multiple operations on the same dataset. In the `chain` property you can define the order and configuration objects of the modifiers that should be applied to the modifier. Here is an example usage of this modifier:
```js
dataModifier: {
    type: 'Chain',
    chain: [{
     // ... Another modifier options
    }, {
     // ... Another modifier options
    }]
}
```
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_ChainModifierOptions.ChainModifierOptions-1.html)

* Range - Can be used to filter the data by minimal and maximal value. It works both for numbers as well as alphanumerical values. The `column` option specifies, from which column the values should be used to perform a filtering, and the `minValue` and `maxValue` specify the range limits. Here is an example:
```js
dataModifier: {
    type: 'Range',
    ranges: [{
        column: 'year',
        minValue: '1961',
        maxValue: '2021'
    }]
}
```
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_RangeModifierOptions.RangeModifierOptions-1.html)

* Invert - Allows to flip the data, and replace the columns with rows. This comes in handy when your data is structured by rows and you want to present it by columns. No other options need to be specified here. Example:
```js
dataModifier: {
    type: 'Invert'
}
```

* Math - This is the only modifier that comes in a separate module. It allows performing complex math calculations and adding columns of values that are calculated based on the existing values. It uses commands similar to those that you can find in spreadsheets like Excel. You can read more in the [MathModifier Article](https://www.highcharts.com/docs/dashboards/mathmodifier-module).
Example:
```js
dataModifier: {
    type: 'Math',
    columnFormulas: [{
        column: 'USD',
        formula: 'B1*C1' // Multiply EUR (B1) with the rate (C1)
    }]
}
```
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_MathModifierOptions.MathModifierOptions-1.html)

* Sort - This modifier rearranges the order of the rows based on the content of any selected column. The sorting order is either ascending or descending.
Example:
```js
dataModifier: {
    type: 'Sort',
    direction: 'desc', // 'desc' or 'asc', default 'asc'
    orderByColumn: 'y' // Default: 'y'
    orderInColumn: ''  // Optional
}
```
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_SortModifierOptions.SortModifierOptions-1.html)

### Original and Modified Table relations

Every modified table contains two methods that allow you to manage the relationships between the rows of the original and modified tables:
- [`getLocalRowIndex`](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable-1#getLocalRowIndex) - Takes the original row index as an argument and returns the local row index in the modified table for which this function is called.
- [`getOriginalRowIndex`](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable-1#getOriginalRowIndex) - Takes the local row index (in the modified table for which it is called) as an argument and returns the index of the corresponding row in the original table.


### Example demos
You can check the modifiers in action with the following demos:

#### DataGrid with MathModifier
<iframe style="width: 100%; height: 700px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/demo/datagrid-mathmodifier" allow="fullscreen"></iframe>

#### CSV data with RangeModifier
<iframe style="width: 100%; height: 733px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/data/csv-modifiers" allow="fullscreen"></iframe>
