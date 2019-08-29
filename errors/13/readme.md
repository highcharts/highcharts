# Rendering div not found

This error occurs if the
[chart.renderTo](https://api.highcharts.com/highcharts#chart.renderTo)
option is misconfigured so that Highcharts is unable to find the HTML element to
render the chart in.

If using a DOM ID when creating the chart, make sure a node with the same ID exists
somewhere in the DOM.
