Goal Analysis
=======================

The Morningstar Goal Analysis service calculates the probabilities of an
investor meeting their financial goals based on assumptions about markets and
the assets in a portfolio.



How to use Goal Analysis
------------------------

The Goal Analysis Connector provides an easy way to create an analysis to
specific scenarios. The options give control over insights displayed in charts
and dashboards.

In order to fetch the analysis, you can request for example:

```js
const goalAnalysisConnector = MC.GoalAnalysisConnector({
    postman: {
        environmentJSON: postmanJSON
    },
    annualInvestment: 4800,
    assetClassWeights: [
        0.1, 0, 0, 0, 0, 0, 0, 0, 0.08, 0.03, 0, 0, 0.17,
        0.05, 0, 0, 0, 0.13, 0.28, 0, 0, 0, 0.11, 0, 0
    ],
    currentSavings: 20000,
    includeDetailedInvestmentGrowthGraph: true,
    requestProbability: 90,
    target: 9000,
    timeHorizon: 5
});
```

For more details, see [Morningstar's Goal Analysis API].



<!-- Links -->



[Morningstar's Goal Analysis API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/portfolio-analysis-apacemea/goal-analysis
