Templating
==========

Highcharts supports templating in format strings. Since v11.1 (2023) the templates support logic, and are generally [recommended](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#format-strings) over [formatter callbacks](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#formatter-callbacks) when the configuration needs to be secure and JSON compatible.

### Expressions
Expressions in format strings are enclosed by `{single brackets}`. They can be simple variables or constants, or conditional blocks or functions called _helpers_.

**Variables** are inserted directly inside the bracket, for example `"The point value at {point.x} is {point.y}"`.

**Numbers** are formatted with a subset of float formatting conventions from the C library function `sprintf`. The formatting is appended inside the expression, separated from the value by a colon. Note that even though a dot and a comma symbolizes the decimal point and the thousands separator respectively, how it is actually rendered depends on the [language settings](https://api.highcharts.com/highcharts/lang). For example:

*   Two decimal places: `"{point.y:.2f}"` [[Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/two-decimal-places)]
*   Thousands separator, no decimal places: `{point.y:,.0f}` [[Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/no-decimal-places)]
*   Thousands separator, one decimal place: `{point.y:,.1f}` [[Demo, internationalized](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/one-decimal-place)]

**Dates** allow, like numbers, the format to be appended behind a colon. The format conventions allowed are the same as those of [Highcharts.dateFormat()](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat). For example:

*   Full date: `{value:%Y-%m-%d}` [[Demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/labels/full-date)]

### Helpers




### Deprecated format functions
The accessibility module prior to v11.1 had two advanced functions, `#each()` and `#plural()`. These have been deprecated and replaced in the default language strings by the new `#each` and `#eq`. See [Advanced format strings](https://github.com/highcharts/highcharts/blob/v11.0.0/docs/chart-concepts/labels-and-string-formatting.md#advanced-format-strings) on GitHub for details.