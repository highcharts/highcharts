# Data Modifiers

The data comes in different shapes and sizes from all over the internet, so its format needs to be adjusted to make it accessible to the dashboard. Instead of manually parsing the data, there is an option to use the `DataModifiers`. Those modifiers allow the user to modify the data on the initial load and the end user to modify visible data through the GUI. Each of the modifiers is accessible through the main Dashboards package, except for the `MathModifier`, which is the most complex one and requires loading a separate module from `https://code.highcharts.com/dashboards/modules/math-modifier.js`. Each of the modifiers can be connected to every type of connector.

## Where is the modifier defined?
The modifier is attached to the connector defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling) in its options.

## Types of modifiers
The types of modifiers that are available are:

* Chain
* Filter
* Invert
* Math
* Range
* Sort

## How to add the modifier?
To add the modifier, specify it in the connector options.
```js
connector: {
    type: 'CSV',
    id: 'connector-id',
    //... other options
    dataModifier: {
        type: 'Math' // or 'Invert'|'Math' etc,
        // additional modifier options
    }
}
```
The modifier modifies the `table.modified` property of the connector, leaving the original data unchanged so that it can be restored if needed.

## What does each of the modifiers do?

Here is a brief description of each of the modifiers:

### Chain
Allows the combination of multiple modifiers in the same connector. This is useful if you need to perform multiple operations on the same dataset. In the `chain` property, you can define the order and configuration objects of the modifiers that should be applied to the modifier. Here is an example usage of this modifier:
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
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_ChainModifierOptions.ChainModifierOptions.html)

### Filter
Filters rows based on arbitrary conditions - numeric comparisons, text matching, logical combinations or non-serializable JavaScript function. Keeps only the rows for which the condition returns true. 

```js
dataModifier: {
    type: 'Filter',
    // Single serializable condition, callback function or nested logic:
    condition: {
        operator: 'and', // combine multiple checks
        conditions: [{
            operator: '>', // numeric “greater than”
            columnId: 'score',
            value: 50
        }, {
            operator: 'contains', // text “contains”
            columnId: 'name',
            value: 'smith',
            ignoreCase: true
        }]
    }
}
```
[API documentation](https://api.highcharts.com/dashboards/#interfaces/Data_Modifiers_FilterModifierOptions.FilterModifierOptions)


### Invert
Allows flipping the data and replacing the columns with rows. This is handy when rows structure your data, and you want to present it by columns. No other options need to be specified here. Example:
```js
dataModifier: {
    type: 'Invert'
}
```

### Math
This is the only modifier delivered as a separate module. It allows for performing complex math calculations and adding columns of values calculated based on the existing values. It uses commands similar to those found in spreadsheets like Excel. You can read more in the [MathModifier Article](https://www.highcharts.com/docs/dashboards/mathmodifier-module).
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
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_MathModifierOptions.MathModifierOptions.html)

### Range
Allows on slicing rows of the original table based on a specified range of indices. Option `start` specifies the index at which the slice begins; option `end` specifies the index at which it ends (excluding the row at the end index), analogous to JavaScript’s slice method. Here is an example:
```js
dataModifier: {
    type: 'Range',
    start: 5,
    end: 100
}
```
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_RangeModifierOptions.RangeModifierOptions.html)


### Sort
This modifier rearranges the order of the rows based on the content of any selected column. The sorting order is either ascending or descending.
Example:
```js
dataModifier: {
    type: 'Sort',
    direction: 'desc', // 'desc' or 'asc', default 'asc'
    orderByColumn: 'y' // Default: 'y'
    orderInColumn: ''  // Optional
}
```
[API documentation](https://api.highcharts.com/dashboards/typedoc/interfaces/Data_Modifiers_SortModifierOptions.SortModifierOptions.html)

## Original and Modified Table relations

Every modified table contains two methods that allow you to manage the relationships between the rows of the original and modified tables:
- [`getLocalRowIndex`](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable#getLocalRowIndex) - Takes the original row index as an argument and returns the local row index in the modified table for which this function is called.
- [`getOriginalRowIndex`](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable#getOriginalRowIndex) - Takes the local row index (in the modified table for which it is called) as an argument and returns the index of the corresponding row in the original table.


## Example demos
You can check the modifiers in action with the following demos:

### Grid with MathModifier
<iframe style="width: 100%; height: 700px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/demo/grid-mathmodifier?force-light-theme" allow="fullscreen"></iframe>

### CSV data with FilterModifier
<iframe style="width: 100%; height: 733px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/data/csv-modifiers?force-light-theme" allow="fullscreen"></iframe>
