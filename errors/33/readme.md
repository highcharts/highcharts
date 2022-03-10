# Invalid attribute or tagName

This error occurs in the following situations for SVG and HTML attributes or
tagNames in a chart configuration. One, if the attribute or tagName is unknown;
for example, linearGradient is a known SVG tagName but lineargradient is
unknown because it is a misspelling. Two, if the attribute or tagName is not
allowed; for example, onclick is a known HTML element but it is not allowed
in a chart configuration.

This error occurs because attributes and tagNames are sanitized of potentially
harmful content from the chart configuration before being added to the DOM.
Consult the [security documentation](https://www.highcharts.com/docs/chart-concepts/security)
for more information.
