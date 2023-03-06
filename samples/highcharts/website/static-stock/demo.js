Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
// Math.easeInQuint = function (pos) {
//     return Math.pow(pos, 5);
// },

Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

const big = window.matchMedia('(min-width: 500px)').matches;

// Create the chart
Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlcv.json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]],

        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    const static =   {
        chart: {
            animation: {
                enabled: true,
                duration: 2000,
                easing: 'easeOutQuint'
            },
            styledMode: true,
            margin: 0,
            spacing: 0,
            alignTicks: false,
            plotBackgroundImage: 'stock.png',
            events: {
                load: function () {
                    const chart = this;

                    let margins = [50, 10, 30, 10];
                    if (big) {
                        margins = [80, 10, 30, 10];
                    }
                    chart.update({
                        chart: {
                            margin: margins
                        }
                    });
                    chart.yAxis[1].update({
                        visible: true
                    });

                    const rangeSelectorGroup =  document.querySelector('#stock .highcharts-range-selector-group');
                    const candlestick =  document.querySelector('#stock .stick');
                    const column = document.querySelector('#stock .highcharts-column-series.column');
                    candlestick.classList.add('fade-in');
                    column.classList.add('fade-in');
                    rangeSelectorGroup.classList.add('fade-in');

                },
                redraw: function () {
                    const candlestick =  document.querySelector('.stick');
                    const rangeSelectorGroup =  document.querySelector('.highcharts-range-selector-group');
                    const column = document.querySelector('.highcharts-column-series.column');
                    column.classList.add('fade-in');
                    rangeSelectorGroup.classList.add('fade-in');
                    candlestick.classList.add('fade-in');
                }
            }
        },
        credits: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        rangeSelector: {
            selected: 1,
            floating: true,
            y: -20,
            buttons: [{
                type: 'month',
                count: 1,
                text: '1m',
                title: 'View 1 month'
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: 'View 6 months'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }]
        },
        title: {
            text: '',
            y: 30
        },
        subtitle: {
            text: '',
            y: 50
        },
        xAxis: [
            // 0
            {
                min: Date.UTC(2021, 5, 2),
                max: Date.UTC(2021, 8, 4),
                visible: true

            }
        ],
        yAxis: [
            // /0
            {
                labels: {
                    align: 'right',
                    x: -3,
                    style: {
                        color: 'transparent'
                    }
                },
                title: {
                    text: ''
                },
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                },
                visible: true,
                zIndex: 300
            },
            // /1
            {
                labels: {
                    align: 'right',
                    x: -3,
                    style: {
                        color: 'transparent'
                    }
                },
                title: {
                    text: null
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2,
                visible: false
            },
            // 2
            {
                min: -2,
                max: 18,
                gridZIndex: 20,
                gridLineColor: 'transparent',
                tickInterval: 1,
                startOnTick: false,
                endOnTick: false,
                visible: false
            },
            // /3
            {
                min: -2,
                max: 18,
                gridZIndex: 20,
                gridLineColor: 'transparent',
                tickInterval: 1,
                startOnTick: false,
                endOnTick: false,
                reversed: true,
                visible: false
            }
        ],
        legend: {
            enabled: false
        },
        lang: {
            accessibility: {
                chartContainerLabel: '',
                screenReaderSection: {
                    beforeRegionLabel: '',
                    endOfChartMarker: ''
                }
            }
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h1>{chartTitle}</h1><p>Interactive candlestick chart showing Apple (AAPL) stock prices and trading volume over time for the past 2 years.</p><p>The X-axis is showing time, and there are two Y-axes. One Y-axis is showing stock price, and the other is showing trading volume.</p>'
            }
        },
        tooltip: {
            split: true
        },
        plotOptions: {
            series: {
                animation: false,
                enabledMouseTracking: false,
                opacity: 1,
                dataLabels: {
                    enabled: false
                },
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    },
                    inactive: {
                        enabled: false
                    }
                }

            }
        },
        series: [
            // 0 -- candlestick
            {
                type: 'candlestick',
                name: 'AAPL',
                className: 'stick',
                data: ohlc,
                zIndex: 300,
                dataGrouping: {
                    units: groupingUnits
                },
                visible: true

            },
            // 1 --column
            {
                type: 'column',
                className: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                zIndex: 300,
                dataGrouping: {
                    units: groupingUnits
                },
                visible: true
            }


        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 250
                },
                chartOptions: {
                    rangeSelector: {
                        enabled: true,
                        dropdown: 'always',
                        inputEnabled: false,
                        buttonPosition: {
                            align: 'center'
                        }
                    },
                    plotOptions: {
                        arearange: {
                            marker: {
                                symbol: 'square',
                                radius: 40
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 251,
                    maxWidth: 300
                },
                chartOptions: {
                    rangeSelector: {
                        enabled: true,
                        dropdown: 'always',
                        inputEnabled: false,
                        buttonPosition: {
                            align: 'center'
                        }
                    },
                    plotOptions: {
                        arearange: {
                            marker: {
                                symbol: 'square',
                                radius: 40
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 301,
                    maxWidth: 400
                },
                chartOptions: {
                    rangeSelector: {
                        enabled: true,
                        dropdown: 'never',
                        inputEnabled: false,
                        buttonPosition: {
                            align: 'center'
                        }
                    },
                    plotOptions: {
                        arearange: {
                            marker: {
                                symbol: 'square',
                                radius: 40
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 499
                },
                chartOptions: {
                    rangeSelector: {
                        enabled: true,
                        dropdown: 'never',
                        inputEnabled: true
                    },
                    plotOptions: {
                        arearange: {
                            marker: {
                                symbol: 'square',
                                radius: 70
                            }
                        }
                    }
                }
            }]
        }
    };

    Highcharts.stockChart('stock', static);

});
