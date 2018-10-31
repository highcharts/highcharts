# Highcharts expects data to be sorted

This happens when you are trying to create a line series or a stock chart where
the data is not sorted in ascending X order. For performance reasons, Highcharts
does not sort the data, instead it is required that the implementer pre-sorts
the data.
