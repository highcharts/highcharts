---
tags: ["grid-pro"]
sidebar_label: "Grid Key"
---

# What is the Grid Key?

**Highcharts Grid Pro** requires a valid **Grid Key** in deployed environments. Grid Lite does not use a Grid Key.

When Grid Pro loads or updates, it validates the `gridKey` API property. If the key is missing, invalid, or expired, Grid Pro writes a browser console warning.


## How to set the Grid Key

You can set the key once for the whole page, or pass it to specific Grid Pro instances. The Grid Key can be obtained in your License Statement.

**Globally**:

```js
Grid.setOptions({
    gridKey: 'YOUR-GRID-KEY-HERE'
});
```

**Per instance**:

```js
Grid.grid('container', {
    gridKey: 'YOUR-GRID-KEY-HERE',
    data: {
        columns: {
            product: ['Apple', 'Pear'],
            price: [1.5, 2.53]
        }
    }
});
```

## Getting and renewing a key

Purchase or manage Grid Pro licensing through the [Highsoft shop](https://shop.highcharts.com). The Grid Key is located in the provided License Statement. A new Grid Key is issued on each renewal, and the key in your application must be updated.

Customers who purchased a Grid Pro or Dashboards license before **May 6, 2026** can find their Grid Key in the updated license statement.

From **May 6, 2026**, Grid Pro is no longer included with new Dashboards licenses, but if you
purchased Dashboards prior to this date you are still entitled to use Grid Pro.

## Expiry and license types

The Grid Key contains an expiry date. Grid Pro treats keys as expired after that date, for both annual and perpetual licenses.

For annual licenses, the key follows the subscription period. When the subscription ends, you must stop using Grid Pro, including all releases.

For perpetual licenses, the license allows use of the covered software in perpetuity. Highcharts Advantage is included for the first year and renewed yearly until cancellation. After the Advantage period ends, you may continue using covered releases, but not new releases published after that period.
