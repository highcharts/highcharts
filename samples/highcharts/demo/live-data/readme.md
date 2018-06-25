# Live and remote data
Datasets (CSV or JSON formatted) can be fetched remotely. There is also an option
to automatically refresh remote sets, leading to auto-updating charts.

*Supported formats*
  * JSON (column ordered), through [data.columnsURL](https://api.highcharts.com/highcharts/data.columnsURL)
  * JSON (row ordered), through [data.rowsURL](https://api.highcharts.com/highcharts/data.rowsURL)
  * CSV, through [data.csvURL](https://api.highcharts.com/highcharts/data.csvURL)

Polling can be enabled/disabled using [data.enablePolling](https://api.highcharts.com/highcharts/data.enablePolling), and the 
refresh rate can be set with [data.dataRefreshRate](https://api.highcharts.com/highcharts/data.dataRefreshRate).

