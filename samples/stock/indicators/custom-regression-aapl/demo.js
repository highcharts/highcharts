function getLinearRegression(xData, yData) {
    var sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0,
        linearData = [],
        linearXData = [],
        linearYData = [],
        n = xData.length,
        alpha, beta, i, x, y;

    // Get sums:
    for (i = 0; i < n; i++) {
        x = xData[i];
        y = yData[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    // Get slope and offset:
    alpha = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    if (isNaN(alpha)) {
        alpha = 0;
    }
    beta = (sumY - alpha * sumX) / n;

    // Calculate linear regression:
    for (i = 0; i < n; i++) {
        x = xData[i];
        y = alpha * x + beta;

        // Prepare arrays required for getValues() method
        linearData[i] = [x, y];
        linearXData[i] = x;
        linearYData[i] = y;
    }

    return {
        xData: linearXData,
        yData: linearYData,
        values: linearData
    };
}

Highcharts.seriesType(
    'linearregression',
    'sma', {
        name: 'Linear Regression',
        enableMouseTracking: false,
        marker: {
            enabled: false
        },
        params: {} // linear regression doesn’t need params
    }, {
        getValues: function (series) {
            return this.getLinearRegression(series.xData, series.yData);
        },
        getLinearRegression: getLinearRegression
    }
);

$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'linearregression',
            linkedTo: 'aapl'
        }]
    });
});
