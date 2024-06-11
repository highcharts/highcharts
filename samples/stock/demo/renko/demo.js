(async () => {
    const linearData = await fetch(
        'https://www.highcharts.com/samples/data/aapl-c.json'
    ).then(response => response.json());

    // Generate data in renko format from linear dataset
    function linearDataToRenko(data, change) {
        const renkoData = [],
            length = data.length;

        let prevPrice = data[0][1],
            prevTrend = 0; // 0 - no trend, 1 - uptrend, 2 - downtrend

        for (let i = 1; i < length; i++) {
            const currentChange = data[i][1] - data[i - 1][1];
            if (currentChange > change) {
                // Uptrend
                if (prevTrend === 2) {
                    prevPrice += change;
                }

                for (let j = 0; j < currentChange / change; j++) {
                    renkoData.push({
                        x: data[i][0] + j,
                        y: prevPrice,
                        low: prevPrice,
                        high: prevPrice + change
                    });
                    prevPrice += change;
                }
                prevTrend = 1;

            } else if (Math.abs(currentChange) > change) {

                if (prevTrend === 1) {
                    prevPrice -= change;
                }
                // Downtrend
                for (let j = 0; j < Math.abs(currentChange) / change; j++) {
                    renkoData.push({
                        x: data[i][0] + j,
                        y: prevPrice,
                        low: prevPrice - change,
                        high: prevPrice,
                        color: '#ff0000'
                    });
                    prevPrice -= change;
                }
                prevTrend = 2;
            }
        }
        return renkoData;
    }

    // Change "5" to check smaller steps.
    const data = linearDataToRenko(linearData, 5);
    // Create the chart
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'AAPL Stock Price on Renko chart'
        },
        series: [{
            name: 'AAPL',
            type: 'columnrange',
            fillColor: 'transparent',
            color: '#0000ff',
            turboThreshold: 0,
            groupPadding: 0,
            pointPadding: 0,
            borderWidth: 1,
            data: data,
            dataGrouping: {
                enabled: false
            },
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();