const params = (new URL(document.location)).search;
// const chartToShow = params.get('chart');


const pArray = params.split('&');

let chartStr = '';

let chartToShow = 'compare';

pArray.forEach(function (element) {
    if (element.indexOf('charts=') !== -1) {
        chartStr = element;
    }
});

const chartArray = chartStr.split('=');
if (chartArray.length > 1) {
    chartToShow = chartArray[1];
}

function ab() {
    (async () => {

        const data = await fetch(
            'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
        ).then(response => response.json());

        // split the data set into ohlc and volume
        const ohlc = [],
            volume = [],
            dataLength = data.length;

        for (let i = 0; i < dataLength; i += 1) {
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

        // create the chart
        Highcharts.stockChart('container', {
            chart: {
                height: 260
            },
            title: {
                text: ''
            },
            accessibility: {
                series: {
                    descriptionFormat: '{seriesDescription}.'
                },
                // eslint-disable-next-line max-len
                description: 'Use the dropdown menus above to display different ' +
                'indicator series on the chart.',
                screenReaderSection: {
                    beforeChartFormat: '<{headingTagName}>' +
                    '{chartTitle}</{headingTagName}><div>' +
                    '{typeDescription}</div><div>{chartSubtitle}</div><div>' +
                    '{chartLongdesc}</div>'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            rangeSelector: {
                selected: 2,
                dropdown: 'always',
                inputEnabled: false,
                floating: true
            },
            navigator: {
                height: 20
            },
            yAxis: [{
                height: '60%',
                top: '10%',
                labels: {
                    enabled: false
                }
            }, {
                top: '60%',
                height: '20%',
                labels: {
                    enabled: false
                }
            }, {
                top: '80%',
                height: '20%',
                labels: {
                    enabled: false
                }
            }],
            plotOptions: {
                series: {
                    showInLegend: true,
                    label: {
                        enabled: false
                    },
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }
            },
            series: [{
                type: 'candlestick',
                id: 'aapl',
                name: 'AAPL',
                data: data
            }, {
                type: 'column',
                id: 'volume',
                name: 'Volume',
                data: volume,
                yAxis: 1
            }, {
                type: 'pc',
                id: 'overlay',
                linkedTo: 'aapl',
                yAxis: 0
            }, {
                type: 'macd',
                id: 'oscillator',
                linkedTo: 'aapl',
                yAxis: 2
            }]
            // }, function (chart) {
            //     document.getElementById(
            //         'overlays'
            //     ).addEventListener('change', function (e) {
            //         const series = chart.get('overlay');

            //         if (series) {
            //             series.remove(false);
            //             chart.addSeries({
            //                 type: e.target.value,
            //                 linkedTo: 'aapl',
            //                 id: 'overlay'
            //             });
            //         }
            //     });

            //     document.getElementById(
            //         'oscillators'
            //     ).addEventListener('change', function (e) {
            //         const series = chart.get('oscillator');

        //         if (series) {
        //             series.remove(false);
        //             chart.addSeries({
        //                 type: e.target.value,
        //                 linkedTo: 'aapl',
        //                 id: 'oscillator',
        //                 yAxis: 2
        //             });
        //         }
        //     });
        });
    })();
}

function compare() {
    (async () => {

        const seriesOptions = [],
            names = ['MSFT', 'AAPL', 'GOOG'];
        let seriesCounter = 0;

        /**
         * Create the chart when all data is loaded
         * @return {undefined}
         */
        function createChart() {

            Highcharts.stockChart('container', {
                chart: {
                    borderWidth: 0,
                    events: {
                        load: function () {
                            const chart = this;
                            setTimeout(function () {
                            // 1 = YTD button index in the buttons array above
                                chart.rangeSelector.clickButton(3, true);
                            }, 300);
                        }
                    }
                },
                rangeSelector: {
                    selected: 4,
                    verticalAlign: 'top',
                    dropdown: 'always',
                    inputDateFormat: '%b %e, %y',
                    inputBoxHeight: 30,
                    inputSpacing: 2
                },
                navigator: {
                    height: 30,
                    xAxis: {
                        labels: {
                            style: {
                                textOutline: 'none'
                            }
                        }
                    },
                    maskFill: 'rgba(135,180,230,0.5)',
                    series: {
                        label: {
                            enabled: false
                        },
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                xAxis: {
                    gridLineColor: 'var(--highcharts-neutral-color-20)',
                    labels: {
                        style: {
                            color: 'var(--highcharts-neutral-color-100)',
                            fontSize: '12px',
                            textOutline: 'none'
                        }
                    },
                    lineColor: 'var(--highcharts-neutral-color-20)',
                    minorGridLineColor: 'var(--highcharts-neutral-color-10)',
                    tickColor: 'var(--highcharts-neutral-color-20)',
                    min: '2013-05-05',
                    max: '2013-05-10'
                },
                yAxis: {
                    gridLineColor: 'var(--highcharts-neutral-color-20)',
                    labels: {
                        formatter: function () {
                            return (this.value > 0 ?
                                ' + ' : '') + this.value + '%';
                        },
                        style: {
                            color: 'var(--text-primary)',
                            fontSize: '12px'
                        }
                    },
                    lineColor: 'var(--highcharts-neutral-color-20)',
                    minorGridLineColor: 'var(--highcharts-neutral-color-10)',
                    tickColor: 'var(--highcharts-neutral-color-20)',
                    tickWidth: 1,
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }]
                },
                plotOptions: {
                    series: {
                        compare: 'percent',
                        showInNavigator: true,
                        label: {
                            style: {
                                fontSize: '14px'
                            }
                        },
                        dataLabels: {
                            color: 'var(--highcharts-neutral-color-20)',
                            style: {
                                fontSize: '14px'
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">' +
                        '{series.name}</span>: <b>{point.y}</b> ' +
                        '({point.change}%)<br/>',
                    valueDecimals: 2,
                    split: true
                },
                series: seriesOptions,
                responsive: {
                    rules: [
                        {
                            condition: {
                                // /up tp this
                                maxWidth: 219
                            },
                            chartOptions: {
                                chart: {
                                    margin: [5, 10, 0, 10],
                                    spacing: 0,
                                    height: 140
                                },
                                navigator: {
                                    enabled: false
                                },
                                scrollbar: {
                                    enabled: false
                                },
                                rangeSelector: {
                                    enabled: true,
                                    inputEnabled: true
                                },
                                xAxis: {
                                    visible: false
                                },
                                yAxis: {
                                    visible: true
                                }
                            }
                        },
                        {
                            condition: {
                                minWidth: 220
                            },
                            chartOptions: {
                                chart: {
                                    margin: [15, 15, 20, 10],
                                    height: 260
                                },
                                navigator: {
                                    enabled: true
                                },
                                scrollbar: {
                                    enabled: false
                                },
                                rangeSelector: {
                                    enabled: true,
                                    inputEnabled: true
                                },
                                xAxis: {
                                    visible: true,
                                    top: '0%'
                                },
                                yAxis: {
                                    visible: true,
                                    top: '0%',
                                    height: '100%'
                                }
                            }
                        }
                    ]
                }
            });
        }

        function success(url, data) {
            const name = url.match(/(msft|aapl|goog)/u)[0].toUpperCase();
            const i = names.indexOf(name);
            seriesOptions[i] = {
                name: name,
                data: data
            };

            // As we 're loading the data asynchronously, we don't know what
            // order it will arrive. So we keep a counter and create the chart
            // when all the data is loaded.
            seriesCounter += 1;

            if (seriesCounter === names.length) {
                createChart();
            }
        }

        await fetch('https://www.highcharts.com/samples/data/msft-c.json')
            .then(response => response.json())
            .then(data => success('msft', data));

        await fetch('https://www.highcharts.com/samples/data/aapl-c.json')
            .then(response => response.json())
            .then(data => success('aapl', data));

        await fetch('https://www.highcharts.com/samples/data/goog-c.json')
            .then(response => response.json())
            .then(data => success('goog', data));
    })();
}

function dynamic() {
    const options = {
        title: {
            text: ''
        },

        xAxis: {
            overscroll: 500000,
            range: 4 * 200000,
            gridLineWidth: 1
        },

        exporting: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        rangeSelector: {
            dropdown: 'always',
            buttons: [{
                type: 'minute',
                count: 15,
                text: '15m'
            }, {
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 1,
            inputEnabled: false
        },

        navigator: {
            series: {
                color: '#000000'
            }
        },

        series: [{
            type: 'candlestick',
            color: '#FF7F7F',
            upColor: '#90EE90',
            lastPrice: {
                enabled: true,
                label: {
                    enabled: true,
                    backgroundColor: '#FF7F7F'
                }
            }
        }]
    };

    // Imitate getting point from backend
    function getNewPoint(i, data) {
        const lastPoint = data[data.length - 1];

        // Add new point
        if (i === 0 || i % 10 === 0) {
            return [
                lastPoint[0] + 60000,
                lastPoint[4],
                lastPoint[4],
                lastPoint[4],
                lastPoint[4]
            ];
        }
        const updatedLastPoint = data[data.length - 1],
            newClose = Highcharts.correctFloat(
                lastPoint[4] + Highcharts.correctFloat(Math.random() - 0.5, 2),
                4
            );

        // Modify last data point
        return [
            updatedLastPoint[0],
            data[data.length - 2][4],
            newClose >= updatedLastPoint[2] ? newClose : updatedLastPoint[2],
            newClose <= updatedLastPoint[3] ? newClose : updatedLastPoint[3],
            newClose
        ];
    }

    // On load, start the interval that adds points
    options.chart = {
        events: {
            load() {
                const chart = this,
                    series = chart.series[0];

                let i = 0;

                setInterval(() => {
                    const data = series.options.data,
                        newPoint = getNewPoint(i, data),
                        lastPoint = data[data.length - 1];

                    // Different x-value, we need to add a new point
                    if (lastPoint[0] !== newPoint[0]) {
                        series.addPoint(newPoint);
                    } else {
                        // Existing point, update it
                        series.options.data[data.length - 1] = newPoint;

                        series.setData(data);
                    }
                    i++;
                }, 100);
            }
        }
    };

    // Apply the data to the options
    options.series[0].data = [
        [
            1317888000000,
            372.5101,
            375,
            372.2,
            372.52
        ],
        [
            1317888060000,
            372.4,
            373,
            372.01,
            372.16
        ],
        [
            1317888120000,
            372.16,
            372.4,
            371.39,
            371.62
        ],
        [
            1317888180000,
            371.62,
            372.16,
            371.55,
            371.75
        ],
        [
            1317888240000,
            371.75,
            372.4,
            371.57,
            372
        ],
        [
            1317888300000,
            372,
            372.3,
            371.8,
            372.24
        ],
        [
            1317888360000,
            372.22,
            372.45,
            372.22,
            372.3
        ],
        [
            1317888420000,
            372.3,
            373.25,
            372.3,
            373.15
        ],
        [
            1317888480000,
            373.01,
            373.5,
            373,
            373.24
        ],
        [
            1317888540000,
            373.36,
            373.88,
            373.19,
            373.88
        ],
        [
            1317888600000,
            373.8,
            374.34,
            373.75,
            374.29
        ],
        [
            1317888660000,
            374.29,
            374.43,
            374,
            374.01
        ],
        [
            1317888720000,
            374.05,
            374.35,
            373.76,
            374.35
        ],
        [
            1317888780000,
            374.41,
            375.24,
            374.37,
            374.9
        ],
        [
            1317888840000,
            374.83,
            375.73,
            374.81,
            374.96
        ],
        [
            1317888900000,
            374.81,
            375.4,
            374.81,
            375.25
        ],
        [
            1317888960000,
            375.2,
            375.7,
            375.14,
            375.19
        ],
        [
            1317889020000,
            375.43,
            375.43,
            374.75,
            374.76
        ],
        [
            1317889080000,
            374.94,
            375.5,
            374.81,
            375.13
        ],
        [
            1317889140000,
            375.12,
            375.48,
            375,
            375.04
        ],
        [
            1317889200000,
            375.24,
            375.24,
            375,
            375.08
        ],
        [
            1317889260000,
            375.16,
            375.16,
            374.51,
            374.51
        ],
        [
            1317889320000,
            374.51,
            374.75,
            374.2,
            374.27
        ],
        [
            1317889380000,
            374.22,
            374.55,
            373.83,
            374.55
        ],
        [
            1317889440000,
            374.69,
            374.86,
            374.01,
            374.2
        ],
        [
            1317889500000,
            374.32,
            374.65,
            374.31,
            374.51
        ],
        [
            1317889560000,
            374.65,
            375.12,
            374.51,
            375.12
        ],
        [
            1317889620000,
            375.13,
            375.25,
            374.83,
            375.22
        ],
        [
            1317889680000,
            375.16,
            375.22,
            375,
            375
        ],
        [
            1317889740000,
            375,
            375,
            374.66,
            374.8
        ],
        [
            1317889800000,
            374.88,
            375,
            374.5,
            374.85
        ],
        [
            1317889860000,
            374.41,
            374.67,
            374.25,
            374.67
        ],
        [
            1317889920000,
            374.5,
            374.75,
            374.27,
            374.42
        ],
        [
            1317889980000,
            374.4,
            374.93,
            374.38,
            374.85
        ],
        [
            1317890040000,
            374.86,
            375.3,
            374.8,
            375.09
        ],
        [
            1317890100000,
            375,
            375.18,
            374.9,
            375.02
        ],
        [
            1317890160000,
            375.02,
            375.08,
            374.86,
            374.87
        ],
        [
            1317890220000,
            374.93,
            375.75,
            374.93,
            375.75
        ],
        [
            1317890280000,
            375.75,
            376.5,
            375.75,
            376.31
        ],
        [
            1317890340000,
            376.31,
            377.2,
            376.19,
            377.04
        ],
        [
            1317890400000,
            377.2,
            377.33,
            376.45,
            376.47
        ],
        [
            1317890460000,
            376.75,
            376.99,
            376.53,
            376.54
        ],
        [
            1317890520000,
            376.54,
            376.67,
            376.08,
            376.35
        ],
        [
            1317890580000,
            376.41,
            376.94,
            376.2,
            376.5
        ],
        [
            1317890640000,
            376.46,
            376.51,
            376.06,
            376.09
        ],
        [
            1317890700000,
            376.38,
            376.84,
            376.09,
            376.78
        ],
        [
            1317890760000,
            376.55,
            376.6,
            376.41,
            376.44
        ],
        [
            1317890820000,
            376.45,
            376.87,
            376.31,
            376.87
        ],
        [
            1317890880000,
            376.83,
            377,
            376.63,
            376.95
        ],
        [
            1317890940000,
            376.95,
            377,
            376.1,
            376.1
        ],
        [
            1317891000000,
            376.1,
            376.17,
            375.64,
            375.65
        ],
        [
            1317891060000,
            375.68,
            376.05,
            375.32,
            376.05
        ],
        [
            1317891120000,
            376.03,
            376.04,
            375.5,
            375.72
        ],
        [
            1317891180000,
            375.83,
            376.195,
            375.7,
            376
        ],
        [
            1317891240000,
            376.01,
            376.6,
            376,
            376.5
        ],
        [
            1317891300000,
            376.5,
            376.53,
            376.11,
            376.21
        ],
        [
            1317891360000,
            376.17,
            376.3,
            376.1,
            376.25
        ],
        [
            1317891420000,
            376.4,
            376.4,
            376.13,
            376.29
        ],
        [
            1317891480000,
            376.15,
            376.39,
            376.1,
            376.39
        ],
        [
            1317891540000,
            376.4,
            377.11,
            376.4,
            377
        ],
        [
            1317891600000,
            377.01,
            377.15,
            376.79,
            377.15
        ],
        [
            1317891660000,
            377.02,
            377.15,
            376.55,
            376.88
        ],
        [
            1317891720000,
            376.67,
            376.76,
            376.52,
            376.53
        ],
        [
            1317891780000,
            376.78,
            376.91,
            376.53,
            376.82
        ],
        [
            1317891840000,
            376.73,
            376.86,
            376.7,
            376.75
        ],
        [
            1317891900000,
            376.7,
            376.71,
            376.5,
            376.57
        ],
        [
            1317891960000,
            376.53,
            376.74,
            376.2,
            376.2
        ],
        [
            1317892020000,
            376.17,
            376.17,
            375.91,
            376
        ],
        [
            1317892080000,
            376,
            376,
            375.77,
            375.77
        ],
        [
            1317892140000,
            375.78,
            375.88,
            375.51,
            375.57
        ],
        [
            1317892200000,
            375.57,
            375.79,
            375.34,
            375.63
        ],
        [
            1317892260000,
            375.63,
            375.78,
            375.35,
            375.41
        ],
        [
            1317892320000,
            375.38,
            375.61,
            375.35,
            375.58
        ],
        [
            1317892380000,
            375.55,
            375.57,
            375.34,
            375.48
        ],
        [
            1317892440000,
            375.43,
            375.57,
            375.12,
            375.13
        ],
        [
            1317892500000,
            375.15,
            375.3,
            374.86,
            375
        ],
        [
            1317892560000,
            374.9,
            375.31,
            374.72,
            375.14
        ],
        [
            1317892620000,
            375,
            375.2,
            374.9,
            375.06
        ],
        [
            1317892680000,
            375.18,
            375.6,
            375.12,
            375.6
        ],
        [
            1317892740000,
            375.6,
            375.87,
            375.5,
            375.5
        ],
        [
            1317892800000,
            375.49,
            375.49,
            375.04,
            375.25
        ],
        [
            1317892860000,
            375.25,
            375.46,
            375,
            375.24
        ],
        [
            1317892920000,
            375.38,
            375.45,
            375,
            375.1
        ],
        [
            1317892980000,
            375.09,
            375.24,
            374.83,
            374.97
        ],
        [
            1317893040000,
            375.01,
            375.01,
            374.8,
            374.87
        ],
        [
            1317893100000,
            374.98,
            375.12,
            374.98,
            375
        ],
        [
            1317893160000,
            374.9,
            374.95,
            374.75,
            374.87
        ],
        [
            1317893220000,
            374.89,
            375.44,
            374.87,
            375.12
        ],
        [
            1317893280000,
            375.06,
            375.12,
            373.56,
            374.05
        ],
        [
            1317893340000,
            374.1,
            374.3,
            373.16,
            373.21
        ],
        [
            1317893400000,
            373.39,
            375,
            372.58,
            374.8
        ],
        [
            1317893460000,
            374.899,
            375.23,
            374.33,
            374.75
        ],
        [
            1317893520000,
            374.79,
            376.71,
            374.69,
            376.31
        ],
        [
            1317893580000,
            376.32,
            376.37,
            375.27,
            375.331
        ],
        [
            1317893640000,
            375.3301,
            377.44,
            375.33,
            377.43
        ],
        [
            1317893700000,
            377.43,
            378.14,
            376.83,
            377.08
        ],
        [
            1317893760000,
            377.18,
            378,
            376.5,
            376.7
        ],
        [
            1317893820000,
            376.83,
            377,
            375.51,
            375.79
        ],
        [
            1317893880000,
            375.6501,
            376.74,
            375.23,
            376.39
        ],
        [
            1317893940000,
            376.38,
            378.75,
            376.25,
            378.5
        ],
        [
            1317894000000,
            378.54,
            378.63,
            376.75,
            376.87
        ],
        [
            1317894060000,
            376.8664,
            377.62,
            376.64,
            376.908
        ],
        [
            1317894120000,
            376.8336,
            377.88,
            376.8289,
            377.55
        ],
        [
            1317894180000,
            377.36,
            377.9,
            376.52,
            376.75
        ],
        [
            1317894240000,
            376.83,
            377.73,
            376.71,
            376.98
        ],
        [
            1317894300000,
            377,
            377.69,
            376.87,
            377.1212
        ],
        [
            1317894360000,
            377.225,
            377.33,
            376.01,
            376.26
        ],
        [
            1317894420000,
            376.42,
            376.64,
            375.55,
            375.5534
        ],
        [
            1317894480000,
            375.74,
            375.94,
            374.77,
            375.3
        ],
        [
            1317894540000,
            375.3313,
            376,
            374.92,
            375.06
        ],
        [
            1317894600000,
            375.11,
            375.46,
            374.82,
            374.92
        ],
        [
            1317894660000,
            374.82,
            375.68,
            374.64,
            375.668
        ],
        [
            1317894720000,
            375.62,
            376.13,
            375.46,
            376.13
        ],
        [
            1317894780000,
            376.14,
            376.6,
            375.89,
            376.34
        ],
        [
            1317894840000,
            376.39,
            376.39,
            375.55,
            375.99
        ],
        [
            1317894900000,
            376,
            376.28,
            375.42,
            376.21
        ],
        [
            1317894960000,
            376,
            377.38,
            375.7,
            376.591
        ],
        [
            1317895020000,
            376.59,
            377.46,
            376.57,
            376.9348
        ],
        [
            1317895080000,
            376.9481,
            377.749,
            376.84,
            377.563
        ],
        [
            1317895140000,
            377.452,
            377.65,
            376.43,
            376.78
        ],
        [
            1317895200000,
            376.94,
            377.01,
            375.75,
            375.98
        ],
        [
            1317895260000,
            376.27,
            377.29,
            375.95,
            376.98
        ],
        [
            1317895320000,
            376.9962,
            377.3,
            376.69,
            376.71
        ],
        [
            1317895380000,
            376.75,
            377.5,
            376.75,
            377.41
        ],
        [
            1317895440000,
            377.26,
            377.49,
            376.89,
            377.368
        ],
        [
            1317895500000,
            377.345,
            378,
            377.17,
            378
        ],
        [
            1317895560000,
            377.97,
            378.3199,
            377.68,
            377.97
        ],
        [
            1317895620000,
            378.01,
            378.07,
            377.25,
            377.37
        ],
        [
            1317895680000,
            377.37,
            377.75,
            377.05,
            377.12
        ],
        [
            1317895740000,
            377.16,
            377.79,
            377.01,
            377.4512
        ]
    ];

    // Create the chart
    Highcharts.stockChart('container', options);


}

function eft() {
    (async () => {

        const PERIOD_CAP = 22.1,
            PERIOD_BUFFER = 6.5;

        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@25f540deda/samples/data/etfs.json'
        ).then(response => response.json());

        Highcharts.stockChart('container', {
            title: {
                text: ''
            },

            rangeSelector: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            exporting: {
                enabled: false
            },

            navigator: {
                enabled: false
            },

            scrollbar: {
                enabled: false
            },

            legend: {
                enabled: false,
                verticalAlign: 'top',
                align: 'left'
            },

            xAxis: {
                accessibility: {
                    description: 'Datetime axis'
                }
            },

            yAxis: {
                labels: {
                    format: '{#if (gt value 0)}+{/if}{value}%'
                },
                opposite: false,
                plotLines: [{
                    value: PERIOD_CAP,
                    width: 2,
                    color: 'rgba(152, 251, 152, 0.4)',
                    dashStyle: 'Dash',
                    label: {
                        align: 'left',
                        text: `OUTCOME PERIOD CAP: ${PERIOD_CAP}%`,
                        x: 0,
                        style: {
                            color: '#006666',
                            fontWeight: 'bold'
                        }
                    }
                }, {
                    value: -PERIOD_BUFFER,
                    width: 2,
                    color: 'rgba(175, 238, 238, 0.6)',
                    dashStyle: 'Dash',
                    label: {
                        align: 'left',
                        verticalAlign: 'bottom',
                        text: `OUTCOME PERIOD BUFFER: ${PERIOD_BUFFER}%`,
                        x: 0,
                        y: 13,
                        style: {
                            color: '#007979',
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
                    color: 'rgba(152, 251, 152, 0.4)'
                }, {
                    from: 0,
                    to: -PERIOD_BUFFER,
                    color: 'rgba(175, 238, 238, 0.6)'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },

            tooltip: {
                // eslint-disable-next-line max-len
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                        '{series.name}</br> <b>{point.y} EUR</b> ' +
                        '({point.change}%)<br/>',
                valueDecimals: 2,
                split: false,
                fixed: true
            },

            series: [{
                name: 'iShares Core S&P 500 UCITS ETF',
                data: data.CSPX
            }, {
                name: 'Example Buffer ETF',
                data: data.Other
            }]
        });

    })();
}

function ao() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f56a420/samples/data/btc-historical.json'
        ).then(response => response.json());

        // Create the chart
        Highcharts.stockChart('container', {
            accessibility: {
                // eslint-disable-next-line max-len
                typeDescription: `Stock chart with a line series and a flags series
            indicating key events.`
            },

            title: {
                text: ''
            },

            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },

            xAxis: {
                overscroll: 2678400000 // 1 month
            },

            rangeSelector: {
                selected: 3,
                buttons: [{
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
                    type: 'year',
                    count: 1,
                    text: '1y',
                    title: 'View 1 year'
                }, {
                    type: 'all',
                    text: 'All',
                    title: 'View all'
                }]
            },

            series: [{
                name: 'Bitcoin Price',
                color: '#ffbf00',
                data: data,
                id: 'dataseries',
                tooltip: {
                    valueDecimals: 2,
                    valuePrefix: '$'
                }

            // the event marker flags
            }, {
                type: 'flags',
                color: '#fb922c',
                onSeries: 'dataseries',
                shape: 'squarepin',
                showInNavigator: true,
                navigatorOptions: {
                    type: 'flags',
                    onSeries: undefined,
                    data: [{
                        x: '2016-07-09',
                        title: '2nd'
                    },
                    {
                        x: '2020-05-11',
                        title: '3rd'
                    }]
                },
                accessibility: {
                    exposeAsGroupOnly: true,
                    description: 'Bitcoin Halving Events'
                },
                data: [{
                    x: '2016-07-09',
                    title: '2nd Halving',
                    text: 'Reward down: 25 BTC to 12.5 BTC per block'
                },
                {
                    x: '2020-05-11',
                    title: '3rd Halving',
                    text: 'Reward down: 12.5 BTC to 6.25 BTC per block'
                }]
            }, {
                type: 'flags',
                color: '#fb922c',
                shape: 'squarepin',
                showInNavigator: true,
                navigatorOptions: {
                    type: 'flags',
                    data: [{
                        x: '2024-04-19',
                        title: '4th'
                    }]
                },
                accessibility: {
                    exposeAsGroupOnly: true,
                    description: 'Bitcoin Halving Events'
                },
                data: [{
                    x: '2024-04-19',
                    title: '4th Halving',
                    text: 'Reward down: 6.25 BTC to 3.125 BTC per block'
                }]
            }]
        });
    })();

}

const charts = {
    compare: compare,
    ab: ab,
    dynamic: dynamic,
    ao: ao,
    eft: eft

};

charts[chartToShow]();
