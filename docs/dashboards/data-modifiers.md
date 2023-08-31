Data Modifiers
===

The data comes in different shapes and sizes from all over the internet, so there needs to be a way of adjusting its format so that it is accessible to the Dashboards. Instead of manually parsing the data, there is an option to use the `DataModifiers`. Those modifiers allow the user to modify the data on the initial load, as well as the end user to modify visible data through the GUI. Each of the modifiers is accessible through the main Dashboards package, except for the `MathModifier` which is the most complex one, and requires loading a separate module from `https://code.highcharts.com/dashboards/modules/math-modifier.js`

### Where the modifier is defined?
The modifier is attached to the connector that is defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling), in its options.

### Types of modifiers
The types of modifiers that are available are:

* Chain (Allows to combine multiple modifiers in the same connector)
* Range
* Invert
* Math

### How to add the modifier?
To add the modifier, you need to specify it in the options of the connector.
```javascript
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
* Chain - Allows to combine multiple modifiers in the same connector. This is useful, if you need to perform multiple operations on the same dataset. In the `chain` property the user can define the order and configuration objects of the modifiers, that should be applied to the modifier. Here is an example usage of this modifier:
```javascript
dataModifier: {
    type: 'Chain',
    chain: [{
     // ... Another modifier options
    }, {
     // ... Another modifier options
    }]
}
```
* Range - Allows to filter the data, which are exeeding the min and max properties. It works both for numbers as well as alphanumerical values. the `column` option specifies, from which column the values should be used to perform a filtering, and the `minValue` and `maxValue` specify the range limits. Here is the example:
```javascript
dataModifier: {
    type: 'Range',
    ranges: [{
        column: 'year',
        minValue: '1961',
        maxValue: '2021'
    }]
}
```
* Invert - Allows to flip the data, and replace the columns with rows. This comes in handy, when your data is structured in a wrong way, and you want to adjust the data to the format acceptable by Dashboards. No other options need to be specified here. Example:
```javascript
dataModifier: {
    type: 'Invert'
}
```
* Math - This is the only modifier, that comes in the seperate module. It allows to perform the complex math calculations, and add columns of values that are calculated based on the existing values. It uses the commands similar to the those, that you can find in spreadsheets like Excel. You can read more in the [MathModifier Article](<link to mathmodifier article>).
Example:
```javascript
dataModifier: {
    type: 'Math',
    columnFormulas: [{
        column: 'USD',
        formula: 'B1*C1' // Multiply EUR (B1) with the rate (C1)
    }]
}
```

### Example demos
You can check the modifiers in work in given demos:
* [DataGrid with MathModifier](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/datagrid-mathmodifier/)
* [Parsing the data in CSV using different modifiers](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/csv-modifiers)