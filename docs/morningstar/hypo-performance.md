# Hypothetical Performance

Using historical performance data, financial advisors can demonstrate how a portfolio personalized to a client’s needs might perform over time. The Portfolio X-Ray API’s Hypothetical Performance capability uses historical performance data to help you calculate hypothetical performance for the portfolios specified in the request body.
For standard performance, see the Performance connector.

## How to use HypoPerformance

You can use the HypoPerformance Connector to fetch return and hypothetical performances for multiple portfolios and benchmarks.
The returned data depends on the selected view and the various options set in the `hypoCalculationsSettings`.

## Available data converters

Currently the following data points are supported in the Hypo Performance connector:

- **GrowthConverter**

Example request:

```js
const connector =
new HighchartsConnectors.Morningstar.HypoPerformanceConnector({
    api: {
        access: {
            token: 'JWT token'
        }
    },
    viewId: 'Growth',
    requestSettings: {
        outputCurrency: 'USD',
        outputReturnsFrequency: 'Monthly',
        assetClassGroupConfigs: {
            assetClassGroupConfig: [
                {
                    Id: 'ACG-USBROAD'
                }
            ]
        },
        hypoCalculationSettings: {
            hypoType: 'Portfolio',
            filingStatus: 'NoTaxes',
            taxableIncome: 50000,
            payTaxes: 'OutOfPocket',
            federalIncomeTaxRate: 0,
            capitalGainTaxRate: 0,
            stateIncomeTaxRate: 0,
            dividendTaxRate: 0,
            illustrationTrailingTimePeriod: 'Customized',
            startDate: '2002-01-01',
            endDate: '2004-01-01',
            synchronizePortfolioStartDate: true,
            investmentDetailReturnsFrequency: 'Monthly',
            liquidateOnEndDate: true,
            subsequentInvestmentType: 'Invest',
            subsequentInvestmentAmount: 0,
            subsequentInvestmentWithdrawalFrequency: 'Monthly',
            assetBasedAnnualFee: 0,
            assetFeeFrequency: 'Annually',
            assetFeeType: 'Amount',
            payFees: 'OutOfPocketBeginning',
            payFeesUseCashFirst: true,
            frontLoadType: 'Standard',
            customFeeType: 'Amount',
            salesFeeAmount: 0,
            applySalesCharge: true,
            applyFeeForRebalance: false,
            entryExitFeeType: 'CustomEntry',
            rebalanceFrequency: 'None',
            rebalanceThreshold: 0,
            reinvestDividends: true,
            reinvestCapitalGains: true,
            portfolioAmountFee: 1000
        }
    },
    portfolios: [
        {
            name: 'TestPortfolio1',
            totalValue: 10000,
            currency: 'USD',
            holdings: [
                {
                    securityId: 'F00000VCTT',
                    weight: 20
                },
                {
                    securityId: '0P00002NW8',
                    weight: 10
                },
                {
                    tradingSymbol: 'AAPL',
                    weight: 15
                },
                {
                    isin: 'US09251T1034',
                    weight: 35
                },
                {
                    cusip: '256219106',
                    weight: 20
                }
            ],
            benchmark: {
                type: 'Standard',
                holdings: [
                    {
                        securityId: 'XIUSA04G92',
                        type: 'XI',
                        weight: 100
                    }
                ]
            }
        }
    ]
});

await connector.load();
```

For more details, see [Morningstar's Hypothetical Performance API].

[Morningstar's Hypothetical Performance API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/portfolio-analysis-americas/hypothetical-performance
