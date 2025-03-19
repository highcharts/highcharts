// Create the chart
Highcharts.stockChart('container', {
    title: {
        text: 'Overscroll set in pixels'
    },

    xAxis: {
        overscroll: '50px'
    },

    series: [{
        name: 'Random data',
        pointStart: '2017-01-01',
        pointInterval: 1000 * 60 * 60 * 24, // 1 day
        data: (function () {
            // generate an array of random data
            const data = [];

            for (let i = 0; i <= 1000; i += 1) {
                data.push(
                    Math.round(Math.random() * 100)
                );
            }
            return data;
        }())
    }]
});