const PERIOD_CAP = 12.03,
    PERIOD_BUFFER = 15;
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
                opposite: false,
                plotLines: [{
                    value: PERIOD_CAP,
                    width: 2,
                    color: 'rgba(6, 79, 233, 1)',
                    dashStyle: 'Dash',
                    label: {
                        align: 'right',
                        text: `OUTCOME PERIOD CAP: ${PERIOD_CAP}%`,
                        x: -3,
                        style: {
                            color: 'rgba(6, 79, 233, 1)',
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    value: -PERIOD_BUFFER,
                    width: 2,
                    color: 'rgba(233, 6, 41, 1)',
                    dashStyle: 'Dash',
                    label: {
                        align: 'right',
                        verticalAlign: 'bottom',
                        text: `OUTCOME PERIOD BUFFER: ${PERIOD_BUFFER}%`,
                        x: -3,
                        y: 13,
                        style: {
                            color: 'rgba(233, 6, 41, 1)',
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    value: 0,
                    width: 2,
                    dashStyle: 'ShortDot'
                }],
                plotBands: [{
                    from: 0,
                    to: PERIOD_CAP,
                    color: 'rgba(6, 79, 233, 0.2)'
                }, {
                    from: 0,
                    to: -PERIOD_BUFFER,
                    color: 'rgba(233, 6, 41, 0.2)'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">' +
                    '{series.name}</span>: <b>{point.y}</b> ' +
                    '({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
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