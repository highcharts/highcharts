Labels and string formatting
============================

Anywhere in Highcharts where text strings occur, they allow modification by _formatters_ or _format_ options. All format string options have matching formatter callbacks. While formatter callbacks have greater flexibility, format strings are typically more compact, and they are JSON compatible.

### HTML in Highcharts

Texts and labels in Highcharts are given in HTML, but as the HTML is parsed and rendered in SVG, only a subset is supported. The following tags are supported: `<a>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<br/>`, `<span>`. Spans can be styled with a style attribute, but only text-related CSS that is shared with SVG is handled.

Most places where text is handled in Highcharts, it is also followed by an
option called `useHTML`. When this is true, the text is laid out as HTML on top
of the chart. This allows for full HTML support and can be a good idea if you
want to add images in your labels, tables in your tooltip etc.

Prior to Highcharts v12.2, the downsides are:

*   It will always be laid out on top of all other SVG content. Specifically the
    tooltip may be rendered below the _useHTML_ label, unless
    [tooltip.outside](https://api.highcharts.com/highcharts/tooltip.outside) is
    set to true.
*   It is not rendered the same way in exported charts, unless you use the
    experimental
    [exporting.allowHTML](https://api.highcharts.com/highcharts/exporting.allowHTML)
    option.

Since v12.2, we implemented an experimental feature to render HTML inside
`foreignObject` elements in SVG. This fixed the z-index issue, and works across
all modern browsers. Our goal is to make this the default behavior, but want to
try it out behind a flag first. To enable this feature, set
`Highcharts.HTMLElement.useForeignObject` to true. See the [live demo of
`useHTML` with foreign
object](https://highcharts.com/samples/highcharts/members/renderer-usehtml-foreignobject).

For the default behavior (a parallel HTML structure outside the SVG), see the
[live demo of
`useHTML`](https://highcharts.com/samples/highcharts/members/renderer-usehtml)
in some common elements.

Using HTML also works around some older browser bugs with bi-directional text.
Read more
under [Internationalization](https://highcharts.com/docs/advanced-chart-features/internationalization).

### Filtering
For security reasons, Highcharts since version 9 filters out unknown tags and attributes. See [the security page](https://highcharts.com/docs/chart-concepts/security) for details.

If your config comes from a trusted source, you may add tags, attributes or reference patterns to the allow lists:
```js
Highcharts.AST.allowedTags.push('blink');
Highcharts.AST.allowedAttributes.push('data-value');
// Allow links to the `tel` protocol
Highcharts.AST.allowedReferences.push('tel:');
```

### Format strings

Format strings are templates for labels. Since v11.1 the format strings support logic. We recommend using format strings if you
* Need to save the chart configuration to JSON.
* Need to provide a GUI for end users so that callbacks are not practical, or XSS is a concern.
* Need to send the charts over to our export server to execute (all callbacks are stripped out).
* Are creating a wrapper for another programming language than JavaScript.

Examples of format strings are [xAxis.labels.format](https://api.highcharts.com/highcharts/xAxis.labels.format), [tooltip.pointFormat](https://api.highcharts.com/highcharts/tooltip.pointFormat) and [legend.labelFormat](https://api.highcharts.com/highcharts/legend.labelFormat). 

For a full overview over templating in format strings, read the [Templating](https://www.highcharts.com/docs/chart-concepts/templating) article.

### Formatter callbacks

For full control over string handling and additional scripting capabilities around the labels, you might need to use formatter callbacks. These formatters return HTML (subset). Examples of these are [xAxis.labels.formatter](https://api.highcharts.com/highcharts/xAxis.labels.formatter), [tooltip.formatter](https://api.highcharts.com/highcharts/tooltip.formatter) and [legend.labelFormatter](https://api.highcharts.com/highcharts/legend.labelFormatter). Often times you'll need to call [Highcharts.dateFormat()](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat) and [Highcharts.numberFormat()](https://api.highcharts.com/class-reference/Highcharts#.numberFormat) from the formatters.


