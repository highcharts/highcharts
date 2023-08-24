(async () => {

    const names = ['MSFT', 'AAPL', 'GOOG'];

    /**
     * Create the chart when all data is loaded
     * @return {undefined}
     */
    function createChart(series) {

        Highcharts.stockChart('container', {

            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    format: '{#if (gt value 0)}+{/if}{value}%'
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            series
        });

    }

    const promises = names.map(name => new Promise(resolve => {
        (async () => {
            const data = await fetch(
                'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/' +
                'samples/data/' + name.toLowerCase() + '-c.json'
            )
                .then(response => response.json());
            resolve({ name, data });
        })();
    }));

    const series = await Promise.all(promises);
    createChart(series);

})();