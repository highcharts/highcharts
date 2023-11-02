Templating
==========

Highcharts supports templating in format strings. Since v11.1 (2023) the templates support logic, and are generally [recommended](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#format-strings) over [formatter callbacks](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#formatter-callbacks) when the configuration needs to be secure and JSON compatible. The Highcharts templating style is inspired by well-proven languages like Handlebars and Mustache, but is more focused on numeric operations since charting is all about numeric data.

## Expressions
Expressions in format strings are enclosed by `{single brackets}`. They can be simple variables or constants, or conditional blocks or functions called _helpers_.

**Variables** and properties are inserted directly inside the bracket, for example `"The point value at {point.x} is {point.y}"`. Nested properties are supported using the dot notation. Arrays are also indexed using dot notation, for example `{series.xAxis.categories.0}`, or more practical, with a subexpression `{series.xAxis.categories.(point.x)}`

**Numbers** are formatted with a subset of float formatting conventions from the C library function `sprintf`. The formatting is appended inside the expression, separated from the value by a colon. Note that even though a dot and a comma symbolizes the decimal point and the thousands separator respectively, how it is actually rendered depends on the [language settings](https://api.highcharts.com/highcharts/lang). For example:

*   Two decimal places: `"{point.y:.2f}"` [[Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/two-decimal-places)]
*   Thousands separator, no decimal places: `{point.y:,.0f}` [[Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/no-decimal-places)]
*   Thousands separator, one decimal place: `{point.y:,.1f}` [[Demo, internationalized](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/one-decimal-place)]

**Dates** allow, like numbers, the format to be appended behind a colon. The format conventions allowed are the same as those of [Highcharts.dateFormat()](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat). For example:

*   Full date: `{value:%Y-%m-%d}` [[Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/full-date)]

## Helpers
Helpers define either a conditional block or a function to be used in an expression. Highcharts includes a number of [built-in helpers](#built-in-helpers), and allows custom helpers to be added.

```js
// Add two literal number using the `add` helper
format: '{add 1 2}' // => prints 3

// Add a literal number and a variable
format: '{add point.index 1}' // => prints a 1-based index from zero-based
```

**Block helpers** include a block that is executed conditionally. Block helpers start with a `#`, and end with a closing expression. They may also include an `{else}` expression to execute if the condition is falsy.
```js
// A simple #if helper
format: '{#if point.isNull}Null{else}{point.y:.2f} USD{/if}'

// A block helper looping through points, with nested expressions
format: '{#each points}{add this.index 1}) {this.name}<br>{/each}
```
[See demo of an #each helper in a shared tooltip](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/tooltip/format-shared).

**Custom helpers** can be defined by extending `Highcharts.Templating.helpers`. Each helper has a fixed number of arguments. A `match` object is then appended to the arguments, for use in case a block helper needs access to the context or the body of the block. Helpers can either return a boolean, in which case the helper works as a condition, or a string or number, in which case that is inserted for the whole block or expression.

```js
// Define a helper to return the absolute of a number
Highcharts.Templating.helpers.abs = value => Math.abs(value);

// Use it like this
format: 'Absolute value: {abs point.y}'
```
[View live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/bar-negative-stack).

## Subexpressions
Subexpressions provide a powerful way to invoke multiple helpers, and pass the results of the inner helper to the outer helper. Subexpressions are delimited by parentheses.

```js
// Celsius to Fahrenheit conversion, where point.y is degrees Celsius
format: '{add (multiply point.y (divide 9 5)) 32}℉'
```

When doing math like this, we sometimes end up with too many decimals or other results that we want to run through number or date formatting. In that case, we use a subexpression then apply the formatting as explained above.

```js
// Celsius to Fahrenheit conversion, where point.y is degrees Celsius.
// Format the result with 1 decimal place.
format: '{(add (multiply point.y (divide 9 5)) 32):.1f}℉'
```

[View live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-datalabels-format-subexpression).

Subexpressions can also be used inside conditions to asses whether a statement is truthy.
```js
// A subexpression inside a condition. Decide plural form.
format: 'The series exists of {points.length} ' +
    '{#if (eq 1 points.length)}point{else}points{/if}.'
```

## Debugging
One of the downsides of working with string formats versus formatter callbacks is the ability to log and debug inside callback. To alleviate that, you can define custom helpers allowing you to inspect the context.

```js
// Custom helper to log the context
Highcharts.Templating.helpers.log = function () {
    console.log(arguments[0].ctx);
};

// Usage
format: '{log}'
```
[View live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/format-log).

## Built-in helpers
* **add**. Add two numbers. For example `{add index 1}` where `index` is a zero-based index from the context. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-datalabels-format-subexpression).
* **divide**. Divide the first number with the second. For example `{divide 10 2}` prints 5. Division by zero returns an empty string. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-datalabels-format-subexpression).
* **eq**. Returns `true` for loose equality (JavaScript `==`) between the first and second argument. Can be used either as a block helper, `{#eq index 0}First item{/eq}`, or in a subexpression `{#if (eq index 0)}First item{/if}`.
* **#each**. Iterate over an array of items. The context of each child is given as `{this}` in the block body. Additional variables in the block body are `@index`, `@first` and `@last`. Example `{#each points}{@index}) {name}, {#if @last}and {/if}`. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/tooltip/format-shared).
* **ge**. Greater than or equal, JavaScript `>=`. Doubles as block helper and subexpression.
* **gt**. Greater than, JavaScript `>`. Doubles as block helper and subexpression.
* **#if**. Conditional block helper. `{#if point.isNull}The point is null{else}The value is {point.y}{/if}`.
* **le**. Less than or equal, JavaScript `<=`. Doubles as block helper and subexpression.
* **lt**. Less than, JavaScript `<`. Doubles as block helper and subexpression.
* **multiply**. Multiply two numbers. For example `{multiply value 1000}`. [Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-datalabels-format-subexpression).
* **ne**. Not equal, JavaScript `!=`. Doubles as block helper and subexpression.
* **subtract**. Subtract the second number from the first. Example `{subtract 5 2}` prints 3.
* **#unless**. The inverse of `#if`. `{#unless point.isNull}The value is {point.y}{/unless}`.

## Limitations
The templating system only works on the context that is passed in to each item. For data label, the context is the point, for tooltip formats the context holds the series, points, suggested header, for axis labels it holds the axis value etc. In most of these cases the context holds deep access to DOM elements (for example through `series.chart.container.ownerDocument`), but these properties are not accessible in templates due to XSS filtering. Preventing DOM access is one of the reasons for choosing string formats over formatter callbacks.

In cases where helpers are not sufficient to reach the desired formatting, it is better to preprocess the data set. Use [the custom option](https://api.highcharts.com/highcharts/series.line.custom) for series and points, and access that from the format string.

In the [column-comparison demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-comparison), we prepare a lookup object for axis labels and the tooltip, append that to the options on chart level, and access it from the axis and tooltip format strings.


## Deprecated format functions
The accessibility module prior to v11.1 had two advanced functions, `#each()` and `#plural()`. These have been deprecated and replaced in the default language strings by the new `#each` and `#eq`. See [Advanced format strings](https://github.com/highcharts/highcharts/blob/v11.0.0/docs/chart-concepts/labels-and-string-formatting.md#advanced-format-strings) on GitHub for details.