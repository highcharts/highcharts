# Invalid attribute or tagName

This error occurs if HTML in the chart configuration contains unknown tag names
or attributes. Unknown tag names or attributes are those not present in the
_allow lists_.

To fix the error, consider
* Is your tag name or attribute spelled correctly? For example, `lineargradient`
  would be blocked as it is a misspelling for `linearGradient`.
* Is it allowed in Highcharts? For example, `onclick` attributes are blocked as
  they pose a real security threat.

This error occurs because attributes and tag names are sanitized of potentially
harmful content from the chart configuration before being added to the DOM.
Consult the [security documentation](https://www.highcharts.com/docs/chart-concepts/security)
for more information.
