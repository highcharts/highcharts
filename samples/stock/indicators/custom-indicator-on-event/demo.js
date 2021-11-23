function getSum(xData, yData) {
    const data = [],
        xDataSum = [],
        yDataSum = [],
        dataLength = xData.length;
    let previousSum = 0;

    // Calculate each point.
    for (let i = 0; i < dataLength; i++) {
        const x = xData[i],
            y = previousSum;

        // Save the sum for the next iteration.
        previousSum += yData[i];

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

Highcharts.seriesType('customIndicator', 'sma', {}, {
    getValues: function (series) {
        return this.getSum(
            series.processedXData || series.xData,
            series.processedYData || series.yData
        );
    },
    calculateOn: {
        chart: 'init',
        xAxis: 'afterSetExtremes'
    },
    getSum: getSum
});

Highcharts.stockChart('container', {
    series: [{
        id: 'main',
        data: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    }, {
        type: 'customIndicator',
        linkedTo: 'main'
    }]
});
