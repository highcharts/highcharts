function getSum(xData, yData) {
    const data = [],
        xDataSum = [],
        yDataSum = [],
        dataLength = xData.length;

    // Iterate over points and calculate the sum.
    for (let i = 0; i < dataLength; i++) {
        const x = xData[i];
        let y;

        // Special case for the first point.
        if (i === 0) {
            y = yData[i];
        } else {
            y = yData[i] + yData[i - 1];

        }

        data[i] = [x, y];
        xDataSum[i] = x;
        yDataSum[i] = y;
    }

    return {
        xData: xDataSum,
        yData: yDataSum,
        values: data
    };
}

Highcharts.seriesType(
    'customIndicator',
    'sma', {
        name: 'Sum of previous 2 points',
        params: {},
        threshold: 0,
        groupPadding: 0.2,
        pointPadding: 0.2
    }, {
        getValues: function (series) {
            return this.getSum(series.xData, series.yData);
        },
        getSum: getSum,
        markerAttribs: Highcharts.noop,
        drawGraph: Highcharts.noop,
        crispCol: Highcharts.Series.types.column.prototype.crispCol,
        drawPoints: Highcharts.Series.types.column.prototype.drawPoints,
        getColumnMetrics:
            Highcharts.Series.types.column.prototype.getColumnMetrics,
        translate: Highcharts.Series.types.column.prototype.translate
    }
);

Highcharts.stockChart('container', {
    yAxis: [{
        height: '60%'
    }, {
        top: '65%',
        height: '25%'
    }],

    series: [{
        id: 'main',
        data: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]
    }, {
        type: 'customIndicator',
        linkedTo: 'main',
        yAxis: 1
    }]
});
