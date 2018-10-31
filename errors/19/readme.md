# Too many ticks

This error happens when you try to apply too many ticks to an axis, specifically
when you add more ticks than the axis pixel length.

With default value this will not happen, but there are edge cases, for example
when setting axis categories and `xAxis.labels.step` in combination with a long
data range, when the axis is instructed to create a great number of ticks.
