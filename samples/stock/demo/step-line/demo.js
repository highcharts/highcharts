(async () => {
    Highcharts.Templating.helpers.lastValue = function () {
        const points = arguments[0].ctx.points;
        return points[points.length - 1].y.toFixed(2);
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
            labels: {
                align: 'left',
                format: '{value:,.2f}'
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
                pointInterval: 86400000 // One day
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