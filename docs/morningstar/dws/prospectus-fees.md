# Prospectus Fees

The **Prospectus Fees** view provides the fee and expense data disclosed in a
fund's prospectus, such as management, administration, and distribution fees
(including their breakpoints), front-end and deferred sales loads, redemption
fees, gross/net/adjusted expense ratios, and acquired-fund expenses.

It populates a single `ProspectusFees` data table.

## Available data tables

Currently the following data tables are supported in the `ProspectusFees`
connector:

- **ProspectusFees**

## How to use Prospectus Fees

Select the `ProspectusFees` converter on the `InvestmentsConnector`. The
example below loads the data into a Dashboards Grid; the `Invert` data modifier
turns the single-row table into a label/value list.

```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'prospectus-fees',
            type: 'MorningstarDWSInvestments',
            api: {
                access: {
                    token: 'your_access_token'
                }
            },
            security: {
                id: '0P00000FIA'
            },
            converters: {
                ProspectusFees: {}
            },
            dataModifier: {
                type: 'Invert'
            }
        }]
    },
    components: [{
        renderTo: 'container',
        type: 'Grid',
        connector: {
            id: 'prospectus-fees',
            dataTableKey: 'ProspectusFees'
        },
        title: 'Prospectus Fees'
    }]
});
```

## Relevant demos

You will find examples of how to use `ProspectusFees` converter in our demos.

- **Highcharts Dashboards Grid + Morningstar Prospectus Fees**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
