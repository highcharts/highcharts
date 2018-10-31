# Can't link axes of different type

This error occurs if you are using the linkedTo option to link two axes of
different types, for example a logarithmic axis to a linear axis. Highcharts
can't link those because the calculation of ticks, extremes, padding etc. is
different.
