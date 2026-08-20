# Invalid attribute, tagName or CSS

This error occurs if HTML in the chart configuration contains unknown tag names
or attributes, or CSS that loads an external resource. Unknown tag names or
attributes are those not present in the _allow lists_.

To fix the error, consider
* Is your tag name or attribute spelled correctly? For example, `lineargradient`
  would be blocked as it is a misspelling for `linearGradient`.
* Is it allowed in Highcharts? For example, `onclick` attributes are blocked as
  they pose a real security threat.
* Does your style load an external resource? For example,
  `url(https://example.com)` would be blocked as it calls an external host.

This error occurs because attributes, tag names and styles are sanitized of
potentially harmful content from the chart configuration before being added to
the DOM.
Consult the [security documentation](https://www.highcharts.com/docs/chart-concepts/security)
for more information.
