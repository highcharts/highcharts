# OHLCV

 This type yields OHLCV time series data for a single or multiple securities.

 Returns Open, High, Low, Close, Volume for the securities specified.

 > **NOTE:** At the moment only a single security is supported.

 ## How to use OHLCV

 In order to fetch a OHLCV time series, specify series type 
 `OHLCV` in the Time Series Connector options.

 ```js
 const ohlcvConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
     postman: {
         environmentJSON: postmanJSON
     },
     series: {
         type: 'OHLCV'
     },
     securities: [{
         id: 'F0GBR04S23',
         idType: 'MSID'
     }]
 });
 ```

 ## Relevant demos

 - **Highcharts Stock + Morningstar OHLCV TimeSeries**: Shows how to use 
 TimeSeriesConnector to retrieve OHLCV time series and display in an OHLC chart.