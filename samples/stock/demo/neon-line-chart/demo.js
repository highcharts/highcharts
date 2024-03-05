(async () => {
    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    // Colors used for neon glow
    const lightColor = '#ffffff',
        ambientColor = '#f27ce6';

    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: ''
        }
    });

    Highcharts.stockChart('container', {
        chart: {
            styledMode: true,
            animation: false
        },

        exporting: {
            chartOptions: {
                chart: {
                    className: 'exported'
                },
                responsive: null
            }
        },

        tooltip: {
            split: false,
            distance: 30,
            shadow: false
        },

        rangeSelector: {
            animate: false,
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            buttonSpacing: 40,
            inputEnabled: false,
            dropdown: 'never',
            selected: 4
        },

        navigator: {
            enabled: false
        },

        title: {
            text: 'AAPL',
            y: 50
        },

        subtitle: {
            text: '$' + data[data.length - 1][1],
            align: 'left',
            x: 20,
            y: 60
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        xAxis: {
            events: {
                // Update subtitle to last visible price
                afterSetExtremes: e => {
                    const chart = e.target.chart;
                    chart.update({
                        subtitle: {
                            text: '$' + chart.series[0].lastVisiblePrice.y
                        }
                    });
                }
            },
            visible: false
        },

        yAxis: {
            visible: false,
            accessibility: {
                description: 'price'
            }
        },

        defs: {
            // Graph glow effect
            neon: {
                tagName: 'filter',
                id: 'neon',
                children: [{
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 1,
                    'flood-color': lightColor
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 2,
                    'flood-color': lightColor,
                    'flood-opacity': 0.7
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 2,
                    'flood-color': ambientColor
                }, {
                    tagName: 'feDropShadow',
                    dx: 0,
                    dy: 0,
                    stdDeviation: 8,
                    'flood-color': ambientColor,
                    'flood-opacity': 0.8
                }]
            }
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            tooltip: {
                pointFormat: '{point.y}'
            },
            lastVisiblePrice: {
                enabled: true
            }
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 700
                },
                chartOptions: {
                    chart: {
                        className: 'small-chart'
                    },
                    title: {
                        align: 'left',
                        verticalAlign: 'top'
                    },
                    subtitle: {
                        align: 'center',
                        verticalAlign: 'top'
                    },
                    scrollbar: {
                        enabled: false
                    },
                    rangeSelector: {
                        buttonSpacing: 20
                    }
                }
            }]
        }
    });
})();
