Labels and string formatting
============================

Anywhere in Highcharts where text strings occur, they allow modification by _formatters_ or _format_ options. All format string options have matching formatter callbacks. While formatter callbacks have greater flexibility, format strings are typically more compact, and they are JSON compatible.

### HTML in Highcharts

Texts and labels in Highcharts are given in HTML, but as the HTML is parsed and rendered in SVG, only a subset is supported. The following tags are supported: `<b>`, `<strong>`, `<i>`, `<em>`, `<br/>`, `<span>`. Spans can be styled with a style attribute, but only text-related CSS that is shared with SVG is handled.

Most places where text is handled in Highcharts, it is also followed by an option called `useHTML`. When this is true, the text is laid out as HTML on top of the chart. This allows for full HTML support and can be a good idea if you want to add images in your labels, tables in your tooltip etc. The downsides are:

*   It will always be laid out on top of all other SVG content. Specifically the tooltip may be rendered below the _useHTML_ label. Since Highcharts v6.1.1 this can be avoided by setting [tooltip.outside](https://api.highcharts.com/highcharts/tooltip.outside) to true.
*   It is not rendered the same way in exported charts, unless you use the experimental [exporting.allowHTML](https://api.highcharts.com/highcharts/exporting.allowHTML) option.

Using HTML also works around some older browser bugs with bi-directional text. Read more under [Internationalization.](https://highcharts.com/docs/advanced-chart-features/internationalization)

Please note that this may become a security risk by running unauthorized code in the browser, if the content of the label comes from an untrusted source.

### Format strings

Format strings are templates for labels, where variables are inserted. Format strings were introduced in Highcharts 2.3 and improved in 3.0 to allow number and date formatting. Examples of format strings are [xAxis.labels.format](https://api.highcharts.com/highcharts/xAxis.labels.format), [tooltip.pointFormat](https://api.highcharts.com/highcharts/tooltip.pointFormat) and [legend.labelFormat](https://api.highcharts.com/highcharts/legend.labelFormat). 

**Variables** are inserted with a bracket notation, for example `"The point value at {point.x} is {point.y}"`.

**Numbers** are formatted with a subset of float formatting conventions from the C library function sprintf. The formatting is appended inside the variable brackets, separated by a colon. Note that even though a dot and a comma symbolizes the decimal point and the thousands separator respectively, how it is actually rendered depends on the [language settings](https://api.highcharts.com/highcharts/lang). For example:

*   Two decimal places: `"{point.y:.2f}"` [[Demo](https://jsfiddle.net/highcharts/AYWsW/)]
*   Thousands separator, no decimal places: `{point.y:,.0f}` [[Demo](https://jsfiddle.net/highcharts/rmTWS/)]
*   Thousands separator, one decimal place: `{point.y:,.1f}` [[Demo, internationalized](https://jsfiddle.net/highcharts/eeDnv/)]

**Dates** allow, like numbers, the format to be appended behind a colon. The format conventions allowed are the same as those of [Highcharts.dateFormat()](https://api.highcharts.com/class-reference/Highcharts#dateFormat). For example:

*   Full date: `{value:%Y-%m-%d}` [[Demo](https://jsfiddle.net/highcharts/PwEnd/)]

### Formatter callbacks

For full control over string handling and additional scripting capabilities around the labels, you might need to use formatter callbacks. These formatters return HTML (subset). Examples of these are [xAxis.labels.formatter](https://api.highcharts.com/highcharts/xAxis.labels.formatter), [tooltip.formatter](https://api.highcharts.com/highcharts/tooltip.formatter) and [legend.labelFormatter](https://api.highcharts.com/highcharts/legend.labelFormatter). Often times you'll need to call [Highcharts.dateFormat()](https://api.highcharts.com/class-reference/Highcharts#dateFormat) and [Highcharts.numberFormat()](https://api.highcharts.com/class-reference/Highcharts#numberFormat) from the formatters.

### Advanced format strings

Since 6.0.6, the [accessibility module](https://www.highcharts.com/docs/chart-concepts/accessibility) supports more advanced format strings, by also by also handling arrays and plural conditionals. The options this applies to can be found under [lang.accessibility](https://api.highcharts.com/highcharts/lang.accessibility). Arrays can be indexed as follows:

    
    Format: 'This is the first index: {myArray[0]}. The last: {myArray[-1]}.'
    Context: { myArray: [0, 1, 2, 3, 4, 5] }
    Result: 'This is the first index: 0. The last: 5.'

They can also be iterated using the `#each()` function. This will repeat the contents of the bracket expression for each element. Example:

    
    Format: 'List contains: {#each(myArray)cm }'
    Context: { myArray: [0, 1, 2] }
    Result: 'List contains: 0cm 1cm 2cm '

The `#each()` function optionally takes a length parameter. If positive, this parameter specifies the max number of elements to iterate through. If negative, the function will subtract the number from the length of the array. Use this to stop iterating before the array ends. Example:

    
    Format: 'List contains: {#each(myArray, -1), }and {myArray[-1]}.'
    Context: { myArray: [0, 1, 2, 3] }
    Result: 'List contains: 0, 1, 2, and 3.'

Use the `#plural()` function to pick a string depending on whether or not a context object is 1. Basic arguments are `#plural(obj, plural, singular)`. Example:

    
    Format: 'Has {numPoints} {#plural(numPoints, points, point}.'
    Context: { numPoints: 5 }
    Result: 'Has 5 points.'

Optionally there are additional parameters for dual and none: `#plural(obj,plural,singular,dual,none)`. Example:

    
    Format: 'Has {#plural(numPoints, many points, one point, two points, none}.'
    Context: { numPoints: 2 }
    Result: 'Has two points.'

The dual or none parameters will take precedence if they are supplied.