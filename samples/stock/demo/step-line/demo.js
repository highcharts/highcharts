(async () => {
    Highcharts.Templating.helpers.lastValue = function () {
        const data = arguments[0].ctx.data;
        return data[data.length - 1].y.toFixed(2);
    };

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@a9dcb12aad/samples/data/investment-simulator.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 4
        },

        title: {
            text: 'Investment simulator'
        },

        yAxis: {
            opposite: false,
            labels: {
                align: 'left',
                x: 0
            }
        },

        legend: {
            enabled: true
        },

        tooltip: {
            valueSuffix: ' EUR'
        },

        plotOptions: {
            series: {
                tooltip: {
                    valueDecimals: 2
                },
                pointStart: '2023-01-01',
                pointIntervalUnit: 'day'
            }
        },

        responsive: {
            rules: [{
                condition: {
                    minWidth: 1200
                },
                chartOptions: {
                    legend: {
                        align: 'right',
                        layout: 'proximate',
                        labelFormat: '{name} <b>({lastValue} EUR)</b>'
                    }
                }
            }]
        },

        series: [{
            name: 'Invested amount',
            data: data[0],
            step: true
        }, {
            name: 'Portfolio value',
            data: data[1]
        }]
    });
})();