# Morningstar Connectors

With the Highcharts Connectors for the Morningstar Direct Web Services you can
access finance-related information to different kinds of financial assets. This
requires a Highcharts license and a Morningstar subscription.



## Requirements

* Morningstar credentials: You will need credentials to access the services.
  This can be either:
  - Access token from your server
  - Username and password

* Morningstar standalone for Highcharts:
  `@highcharts/connectors-morningstar/connectors-morningstar.js`

* Morningstar connectors for Dashboards:
  `@highcharts/connectors-morningstar`

* Package bundler like Webpack.



## Quick Start

The integration of the Morningstar connectors differs between Highcharts core
products and Highcharts Dashboards.



### Highcharts Quick Start

You can connect Highcharts core products with Morningstar by using
`connectors-morningstar.js` in the `connectors-morningstar` bundle. You have to manually create the connector and
assign the resulting table to your series options.



### Highcharts Dashboards Quick Start

For Highcharts Dashboards you just need to load the `connectors-morningstar`
bundle, which will register all connectors to the Dashboards registry. All
Morningstar connectors are then available in the data pool as other connector
types.



### Available Connectors

* [Goal Analysis](morningstar/goal-analysis.md)
* [RNANews](morningstar/regulatory-news-announcements.md)
* [Risk Score](morningstar/risk-score.md)
* [TimeSeries](morningstar/time-series/time-series.md)
* [XRay](morningstar/x-ray.md)
* [Screener](morningstar/screeners/screener.md)
* [Security Details](morningstar/security-details.md)
