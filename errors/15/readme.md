# Highcharts expects data to be sorted

This happens when creating a line series or a stock chart where
the data is not sorted in ascending X order. 

For performance reasons, Highcharts
does not sort the data, instead it requires that the implementer pre-sorts
the data.
