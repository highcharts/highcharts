(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@sha/samples/data/investment-simulator.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        chart: {
            spacingRight: 25
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Recurring stock investment simulator'
        },

        xAxis: {
            overscroll: '10px'
        },

        yAxis: {
            labels: {
                align: 'left'
            }
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                tooltip: {
                    valueDecimals: 2
                },
                pointStart: '2024-01-01',
                pointInterval: 86400000, // One day
                lastPrice: {
                    enabled: true,
                    color: 'transparent',
                    label: {
                        enabled: true,
                        format: '{value:.2f}',
                        backgroundColor: '#ffffff',
                        borderWidth: 1,
                        style: {
                            color: '#000000'
                        }
                    }
                }
            }
        },

        series: [{
            name: 'Invested amount',
            data: data[0],
            step: true,
            dashStyle: 'ShortDot',
            lastPrice: {
                label: {
                    borderColor: '#2caffe'
                }
            }
        }, {
            name: 'Portfolio value',
            data: data[1],
            lastPrice: {
                label: {
                    borderColor: '#544fc5'
                }
            }
        }]
    });
})();