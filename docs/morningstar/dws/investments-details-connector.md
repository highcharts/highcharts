# Investment Details Connector

The `HighchartsConnectors.MorningstarDWS.InvestmentsConnector` provides access
to Morningstar's **Investment Details API** (the newer DWS API). A single
connector instance can request multiple converters at once. Each converter
populates one or more named data tables that you bind to your Highcharts
series.

## Requirements

Using the Morningstar Connectors requires an active Highcharts license and a
Morningstar subscription, plus Morningstar Direct Web Services credentials -
either an access token from your server or a username and password. See the
[Morningstar Connectors overview](https://www.highcharts.com/docs/morningstar/morningstar)
for licensing and credential details.

## Setup

Load the DWS bundle alongside Highcharts. As an ES module:

```js
import Highcharts from 'highcharts';
import '@highcharts/connectors-morningstar/dws';
```

Or as a UMD script from the CDN:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/connectors/morningstar/connectors-morningstar-dws.js"></script>
```

## How to use the Investments Connector

The `InvestmentsConnector` allows you to select multiple converters
simultaneously. Each converter is selected by name under the `converters`
option, and each data table is retrieved with
`connector.getTable('<TableName>')`.

```js
new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        id: '0P00000FIA'
    },
    converters: {
        // Chosen converters
    }
});
```

## Available data converters

Below are the currently implemented data converters, each documented on its own
page, with more planned for the future.

- [Asset Allocation Breakdown](https://www.highcharts.com/docs/morningstar/dws/asset-allocation-breakdown) -
  the security's asset-allocation breakdown (general, Canadian, and
  underlying-instrument views).
- [Country and Regional Exposure Breakdown](https://www.highcharts.com/docs/morningstar/dws/country-and-regional-exposure-breakdown) -
  exposure broken down by region and country, for equity, fixed income, and
  revenue.
- [Equity Aggregates Residual Risk and Return Sensitivity](https://www.highcharts.com/docs/morningstar/dws/equity-aggregates-residual-risk) -
  aggregate equity residual-risk statistics (Alpha, Beta, and their company
  counts, including non-dividend variants).
- [Equity Residual Risk and Return Sensitivity](https://www.highcharts.com/docs/morningstar/dws/equity-residual-risk) -
  equity residual-risk statistics (Alpha, Beta, RSquare, including non-dividend
  variants) at daily and monthly granularity.
- [Morningstar Equity Sectors Breakdown](https://www.highcharts.com/docs/morningstar/dws/morningstar-equity-sectors-breakdown) -
  equity sector exposure at super-sector, sector, and industry levels.
- [Equity Style Box](https://www.highcharts.com/docs/morningstar/dws/equity-style-box) -
  the Morningstar equity style box: the current style/size grid and its
historical time series.
- [Morningstar Fixed Income Sectors Breakdown](https://www.highcharts.com/docs/morningstar/dws/morningstar-fixed-income-sectors-breakdown) -
  fixed-income sector exposure across super/primary/secondary sectors, their
  breakdown (`Brk`) variants, and per-region tables.
- [Prospectus Fees](https://www.highcharts.com/docs/morningstar/dws/prospectus-fees) -
  prospectus fee and expense data for the security.

## Relevant demos

Examples of using the **Investment Details Connector** are available in our
demos:

- **Highcharts Core + Morningstar Asset Allocation Breakdown**
- **Highcharts Core + Morningstar Asset Allocation Breakdown (Pre-fetched JSON)**
- **Highcharts Core + Morningstar Country and Region Exposure**
- **Highcharts Core + Morningstar Equity Aggregates Residual Risk**
- **Highcharts Core + Morningstar Equity Residual Risk**
- **Highcharts Core + Morningstar Equity Sectors Breakdown**
- **Highcharts Core + Morningstar Equity Style Box**
- **Highcharts Core + Morningstar Equity Style Box Time Series**
- **Highcharts Core + Morningstar Fixed Income Region Sectors Breakdown**
- **Highcharts Core + Morningstar Fixed Income Sectors Breakdown**
- **Highcharts Dashboards Grid + Morningstar Prospectus Fees**

## Morningstar API Reference

For more details, see [Morningstar’s Investment Details API].

<!-- Links -->
[Morningstar’s Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
