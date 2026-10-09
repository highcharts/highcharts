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
`10a296cdf02abfad7258104ef49557d4c1349f95`, used by the eligible visual samples
that load the Morningstar and Morningstar DWS connectors. They are served only
in the Playwright `visual` project through the existing JSON-source route
handler. Requests must match the recorded URL, method and POST body. ECInt
risk-return XRay entries retain the connector's double-encoded JSON request
format by storing `postData` as a string. Multiple portfolios can share an
endpoint, so each request is matched to its own recorded body. No API token or
live request is needed.

| Fixture | Source under `live-data-generator/data/` |
| --- | --- |
| `tesla-price.json` | `timeseries-price-USD-US88160R1014.json` |
| `amd-price.json` | `timeseries-price-EUR-US0079031078.json` |
| `amd-price-2021-2022.json` | `timeseries-price-EUR-US0079031078.json` |
| `nvidia-ohlcv.json` | `timeseries-ohlcv-EUR-0P000003RE.json` |
| `correlation-matrix.json` | `morningstar-fixtures/responses/jsons-xrayus-correlation-matrix-58367d517e2d.json` |
| `security-details-f00001gpcx.json` | `morningstar-fixtures/responses/jsons-securitydetails-f00001gpcx-42314cb31694.json` |
| `security-details-f00000zy5f.json` | `morningstar-fixtures/responses/jsons-securitydetails-f00000zy5f-cbbb99bb241b.json` |
| `security-details-f0gbr050dd.json` | `morningstar-fixtures/responses/jsons-securitydetails-f0gbr050dd-54f3285e49a0.json` |
| `security-details-us9229087104.json` | `morningstar-fixtures/responses/jsons-securitydetails-us9229087104-e0d897df4e8f.json` |
| `security-details-f0gbr052qa-hssnapshot.json` | `morningstar-fixtures/responses/jsons-securitydetails-f0gbr052qa-market-cap-hssnapshot-373ab2be4a82.json` |
| `security-details-f0gbr052qa-mfsnapshot.json` | `morningstar-fixtures/responses/jsons-securitydetails-f0gbr052qa-mfsnapshot-415c428b35ac.json` |
| `security-compare-country.json` | `morningstar-fixtures/responses/jsons-securitycompare-0p000151l5-euca000511-060c09b2d518.json` |
| `security-compare-returns.json` | `morningstar-fixtures/responses/jsons-securitycompare-f0gbr050dd-euca000527-1cb044444b82.json` |
| `security-compare-sector-region.json` | `morningstar-fixtures/responses/jsons-securitycompare-f0gbr052qa-euca000550-56db8f850ba4.json` |
| `dws-equity-aggregates-residual-risk.json` | `morningstar-fixtures/responses/jsons-dws-dws-equity-aggregates-residual-risk-d1440108bbc0.json` |
| `dws-equity-residual-risk.json` | `morningstar-fixtures/responses/jsons-dws-dws-equity-residual-risk-b715ced72b0b.json` |
| `dws-equity-style-box.json` | `morningstar-fixtures/responses/jsons-dws-dws-equity-style-box-1bfce627b603.json` |
| `dws-region-breakdown.json` | `morningstar-fixtures/responses/jsons-dws-dws-region-breakdown-chart-1b6aaabbb903.json` |
| `dws-sector-breakdown.json` | `morningstar-fixtures/responses/jsons-dws-dws-sector-breakdown-fa7ea37ec8d1.json` |
| `interactive-price.json` | `morningstar-fixtures/responses/jsons-timeseries-0p0001f5j3-interactive-chart-ba91a4231c9e.json` |
| `calendar-year-return.json` | `morningstar-fixtures/responses/jsons-performance-fousa05h5f-fousa04bcr-7dfe0a1b7b78.json` |
| `growth-chart-hypo.json` | `morningstar-fixtures/responses/jsons-hypo-growth-chart-hypo-f2d0a3ae290f.json` |
| `credit-quality.json` | `morningstar-fixtures/responses/jsons-securitycompare-f00001gpcx-f00000yg2f-00b968501f2c.json` |
| `risk-return-us31635v7293.json` | `morningstar-fixtures/responses/jsons-xray-risk-return-chart-us31635v7293-70517491fc2e.json` |
| `risk-return-f00001667w.json` | `morningstar-fixtures/responses/jsons-xray-risk-return-chart-f00001667w-9aecf82cfac7.json` |
| `risk-return-xiusa0010z.json` | `morningstar-fixtures/responses/jsons-xray-risk-return-chart-xiusa0010z-84eb7c32c075.json` |
| `xray-us-trailing-returns.json` | `morningstar-fixtures/responses/jsons-xrayus-f00000vctt-0p00002nw8-357841f992c8.json` |

The Tesla and dated AMD responses filter `TimeSeries.Security[].HistoryDetail`
by the request's inclusive start/end dates, matching the demo service's
`filterTimeSeries` behavior. Other responses are unchanged JSON data. When a
sample's request changes, refresh its fixture and registry entry together;
do not serve an unrelated security or portfolio response to make it pass.
