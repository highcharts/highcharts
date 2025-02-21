(async () => {

    const names = ['MSFT', 'AAPL', 'GOOG'];

    /**
     * Create the chart when all data is loaded
     */
    function createChart(series) {

        Highcharts.stockChart('container', {

            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value;
                    }
                }
            },

            plotOptions: {
                series: {
                    compare: 'value'
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">' +
                    '{series.name}</span>: <b>{point.y} USD</b> ' +
                    '({point.change} USD)<br/>',
                changeDecimals: 2,
                valueDecimals: 2
            },

            series
        });
    }

    const series = [];
    for (const name of names) {
        const response = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/' +
            'samples/data/' + name.toLowerCase() + '-c.json'
        );
        const data = await response.json();
        series.push({ name, data });
    }
    createChart(series);

})();
