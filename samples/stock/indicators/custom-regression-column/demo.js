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

Highcharts.chart('container', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Average Monthly Temperature and Rainfall in Tokyo'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}°C',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Temperature',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Rainfall',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} mm',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series: [{
        name: 'Rainfall',
        id: 'rainfall',
        type: 'column',
        yAxis: 1,
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        tooltip: {
            valueSuffix: ' mm'
        }

    }, {
        name: 'Temperature',
        id: 'temp',
        type: 'spline',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
        tooltip: {
            valueSuffix: '°C'
        }
    }, {
        type: 'linearregression',
        linkedTo: 'rainfall',
        color: Highcharts.getOptions().colors[0],
        yAxis: 1
    }, {
        type: 'linearregression',
        color: Highcharts.getOptions().colors[1],
        linkedTo: 'temp'
    }]
});


