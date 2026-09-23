# Visual fixtures

`highcharts-favicon.ico` was retrieved on 2026-09-22 from
`https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2021/05/19085042/favicon-1.ico`
(SHA-256: `a65f1c0882344f4c2c88bd0ae795bab5e8e30fd5ca2cef69627057ec1651f8cc`).
The visual project serves it for that URL. The runner rewrites the retired
`https://www.highcharts.com/favicon.ico` URL to it because Playwright aborts
`/favicon.ico` requests before route handlers run. Both timeline samples use
the recorded asset.
This lets image markers finish loading and the chart load handlers run offline.

## Connector responses

These responses are snapshots from `highcharts/live-data-generator` commit
`10a296cdf02abfad7258104ef49557d4c1349f95`, used by the five eligible visual samples
that load the Morningstar connector. They are served only in the Playwright
`visual` project through the existing JSON-source route handler. Requests must
match the URL and method; the correlation response also requires the recorded
POST body. No API token or live request is needed.

| Fixture | Source under `live-data-generator/data/` |
| --- | --- |
| `tesla-price.json` | `timeseries-price-USD-US88160R1014.json` |
| `amd-price.json` | `timeseries-price-EUR-US0079031078.json` |
| `amd-price-2021-2022.json` | `timeseries-price-EUR-US0079031078.json` |
| `nvidia-ohlcv.json` | `timeseries-ohlcv-EUR-0P000003RE.json` |
| `correlation-matrix.json` | `morningstar-fixtures/responses/jsons-xrayus-correlation-matrix-58367d517e2d.json` |

The Tesla and dated AMD responses filter `TimeSeries.Security[].HistoryDetail`
by the request's inclusive start/end dates, matching the demo service's
`filterTimeSeries` behavior. Other responses are unchanged JSON data. When a
sample's request changes, refresh its fixture and registry entry together;
do not serve an unrelated security or portfolio response to make it pass.
