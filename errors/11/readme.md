# Can't link axes of different type

This error occurs when using the `linkedTo` option to link two axes of
different types, for example a logarithmic axis to a linear axis. Highcharts
can't link these because the calculation of ticks, extremes, padding etc. is
different.
