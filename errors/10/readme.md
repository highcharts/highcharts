# Can't plot zero or subzero values on a logarithmic axis

This error occurs in the following situations:

- If a zero or subzero data value is added to a logarithmic axis

- If the minimum of a logarithimic axis is set to 0 or less

- If the threshold is set to 0 or less

Note: As of Highcharts 5.0.8 it's possible to bypass this error message by
setting `Axis.prototype.allowNegativeLog` to true, and add custom conversion
functions.
[View live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/samples/highcharts/yaxis/type-log-negative/).
It is also possible to use a similar workaround for colorAxis.
[View live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/samples/highcharts/coloraxis/logarithmic-with-emulate-negative-values/).
