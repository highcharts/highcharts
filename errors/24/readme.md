# Cannot run Point.update on a grouped point

Running `Point.update` in Highstock when a point is grouped by data
grouping is not supported.

This is not supported because when data grouping is enabled, there won't be any 
references to the raw points, which is required by the `Point.update` function.
