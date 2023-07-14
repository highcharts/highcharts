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

function indicators() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@2c6e89641888ae94c988649d96552c06c4e47351/samples/data/aapl-ohlcv.json'
        ).then(response => response.json());

        // split the data set into ohlc and volume
        var ohlc = [],
            volume = [],
            dataLength = data.length;

        for (var i = 0; i < dataLength; i += 1) {
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
                height: 270
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            accessibility: {
                series: {
                    descriptionFormat: '{seriesDescription}.'
                },
                description: 'Use the dropdown menus above to display different indicator series on the chart.',
                screenReaderSection: {
                    beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            rangeSelector: {
                selected: 0,
                inputEnabled: false,
                floating: true,
                allButtonsEnabled: true,
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d',
                    title: 'View 1 day'
                },
                {
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
            navigator: {
                height: 30,
                margin: 0,
                series: {
                    label: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            xAxis: {
                top: '90%',
                opposite: true
            },
            yAxis: [{
                height: '50%'
            }, {
                top: '40%',
                height: '20%'
            }, {
                top: '60%',
                height: '20%'
            }],
            plotOptions: {
                series: {
                    showInLegend: true,
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
        });

    })();
}

function compare() {
    (async () => {

        var seriesOptions = [],
            seriesCounter = 0,
            names = ['MSFT', 'AAPL', 'GOOG'];

        /**
         * Create the chart when all data is loaded
         * @return {undefined}
         */
        function createChart() {

            Highcharts.stockChart('container', {
                chart: {
                    borderWidth: 0,
                    borderColor: 'white',
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#1f1836'],
                            [1, '#45445d']
                        ]
                    }
                },
                rangeSelector: {
                    selected: 4,
                    labelStyle: {
                        color: '#fff'
                    },
                    verticalAlign: 'top',
                    buttonTheme: {
                        fill: '#46465C',
                        stroke: '#BBBAC5',
                        'stroke-width': 1,
                        height: 30,
                        y: 5,
                        style: {
                            color: '#fff'
                        },
                        states: {
                            hover: {
                                fill: '#1f1836',
                                style: {
                                    color: '#fff'
                                },
                                'stroke-width': 1,
                                stroke: 'white'
                            },
                            select: {
                                fill: '#1f1836',
                                style: {
                                    color: '#fff'
                                },
                                'stroke-width': 1,
                                stroke: 'white'
                            }
                        }
                    },
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
                                color: 'transparent'
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
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize: '12px'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    min: Date.UTC(2013, 4, 5),
                    max: Date.UTC(2013, 4, 10)
                },
                yAxis: {
                    gridLineColor: '#707073',
                    labels: {
                        formatter: function () {
                            return (this.value > 0 ? ' + ' : '') + this.value + '%';
                        },
                        style: {
                            color: '#fff',
                            fontSize: '12px'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
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
                            color: '#46465C',
                            style: {
                                fontSize: '14px'
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
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
                                    inputEnabled: false
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
                                    inputEnabled: false
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
            var name = url.match(/(msft|aapl|goog)/u)[0].toUpperCase();
            var i = names.indexOf(name);
            seriesOptions[i] = {
                name: name,
                data: data
            };

            // As we're loading the data asynchronously, we don't know what order it
            // will arrive. So we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;

            if (seriesCounter === names.length) {
                createChart();
            }
        }

        await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/msft-c.json')
            .then(response => response.json())
            .then(data => success('msft', data));

        await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/aapl-c.json')
            .then(response => response.json())
            .then(data => success('aapl', data));

        await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/goog-c.json')
            .then(response => response.json())
            .then(data => success('goog', data));
    })();
}

function ao() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@fd0e573985/samples/data/aapl-ohlc-ab.json'
        ).then(response => response.json());

        Highcharts.stockChart('container', {
            chart: {
                // height: 270
                // backgroundColor: 'brown'
                height: '100%'
            },
            rangeSelector: {
                // selected: 0,
                floating: true,
                inputEnabled: true,
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d',
                    title: 'View 1 day'
                },
                {
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
                    type: 'year',
                    count: 1,
                    text: '1y',
                    title: 'View 1 year'
                }, {
                    type: 'all',
                    text: 'All',
                    title: 'View all'
                }],
                dropdown: 'always',
                inputDateFormat: '%b %e, %y',
                buttonTheme: {

                    height: 30,
                    y: 5
                },
                inputBoxHeight: 30,
                inputPosition: {
                    y: 4
                },
                inputSpacing: 2
            },
            navigator: {
                height: 30
            },
            title: {
                text: ''
            },

            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },

            plotOptions: {
                series: {
                    showInLegend: true,
                    label: {
                        enabled: false
                    }
                }
            },

            yAxis: [{
                height: '50%',
                top: '30%'
            }, {
                top: '80%',
                height: '30%',
                offset: 0
            }],
            xAxis: {
                top: '10%',
                min: Date.UTC(2021, 1, 19),
                max: Date.UTC(2022, 4, 13)
            },
            series: [{
                type: 'candlestick',
                id: 'AAPL',
                name: 'AAPL',
                data: data,
                tooltip: {
                    valueDecimals: 2
                }
            }, {
                type: 'ao',
                yAxis: 1,
                greaterBarColor: '#00cc66',
                lowerBarColor: '#FF5E5E',
                linkedTo: 'AAPL',
                showInLegend: true
            }],
            responsive: {
                rules: [
                    // /up to 219
                    {
                        condition: {
                            // /up tp this
                            maxWidth: 219
                        },
                        chartOptions: {
                            chart: {
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
                                inputEnabled: false
                            },
                            xAxis: {
                                visible: false
                            },
                            yAxis: {
                                visible: true,
                                top: '20%',
                                height: '100%'
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 220
                        },
                        chartOptions: {
                            chart: {
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
                                inputEnabled: false
                            },
                            xAxis: {
                                visible: true,
                                top: '10%'
                            },
                            yAxis: {
                                visible: true,
                                top: '25%',
                                height: '70%'
                            }
                        }
                    }
                ]
            }
        });
    })();
}

function dynamic() {
    const chart = Highcharts.stockChart('container', {
        chart: {
            type: 'candlestick',
            height: 270,
            events: {
                load: function () {
                    const chart = this;
                    const price = Math.round(Math.random() * 100);
                    let count = 0;
                    const addData = setInterval(function () {
                        if (count < 5) {
                            chart.series[0].addPoint([
                                Math.round(+new Date() / 1000) * 1000,
                                price,
                                Math.round(price * 1.2),
                                Math.round(price * 0.8),
                                Math.round(price + price * 0.3 *
                                    (Math.random() - 0.5))
                            ]);
                            count = count + 1;
                        } else {
                            clearInterval(addData);
                        }

                    }, 1000);


                }
            }
            // backgroundColor: 'black'
        },
        title: {
            // text: 'Dynamic stock data'
            text: ''
        },
        rangeSelector: {
            allButtonsEnabled: true,
            dropdown: 'always',
            inputEnabled: false,
            buttonTheme: {
                width: 120,
                height: 30,
                y: 5
            },
            buttons: [
                {
                    type: 'second',
                    count: 1,
                    text: '1s',
                    title: 'View 1 second'
                },
                {
                    type: 'second',
                    count: 5,
                    text: '5s',
                    title: 'View 5 seconds'
                },
                {
                    type: 'all',
                    text: 'All',
                    title: 'View all'
                }],
            inputDateFormat: '%H:%M:%S.%L',
            inputEditDateFormat: '%H:%M:%S.%L',
            // Custom parser to parse the %H:%M:%S.%L format
            inputDateParser: function (value) {
                value = value.split(/[:\.]/u);
                return Date.UTC(
                    1970,
                    0,
                    1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10),
                    parseInt(value[3], 10)
                );
            }
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: {
            height: '70%',
            top: '30%'
        },
        navigator: {
            series: {
                label: {
                    enabled: false
                }
            },
            maskFill: 'rgba(135,180,230,0.5)',
            height: 30
        },
        subtitle: {
            // text: 'Click button to add candle to chart'
            text: ''
        },
        accessibility: {
            description: 'A test case for dynamic data in financial charts.',
            announceNewData: {
                enabled: true
            }
        },
        series: [{
            name: 'Random data',
            data: []
        }],
        responsive: {
            rules: [
                // /up to 219
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
                        xAxis: {
                            visible: false
                        },
                        yAxis: {
                            visible: true,
                            top: '0%',
                            height: '100%'
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

    // Add random point when clicking button
    document.getElementById('add').onclick = function () {
        const price = Math.round(Math.random() * 100);
        chart.series[0].addPoint([
            Math.round(+new Date() / 1000) * 1000,
            price,
            Math.round(price * 1.2),
            Math.round(price * 0.8),
            Math.round(price + price * 0.3 * (Math.random() - 0.5))
        ]);
    };

}

function ab() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@fd0e573985/samples/data/aapl-ohlc-ab.json'
        ).then(response => response.json());

        Highcharts.stockChart('container', {
            rangeSelector: {
                selected: 4,
                inputEnabled: true,
                height: 30,
                floating: false,
                dropdown: 'always',
                inputDateFormat: '%b %e, %y',
                buttonTheme: {
                    height: 30,
                    y: 4
                },
                inputBoxHeight: 30,
                inputPosition: {
                    y: 4
                },
                inputSpacing: 2
            },
            navigator: {
                series: {
                    label: {
                        enabled: false
                    }
                },
                xAxis: {
                    labels: {
                        style: {
                            color: 'transparent'
                        }
                    }
                },
                maskFill: 'rgba(135,180,230,0.5)',
                height: 30

            },
            title: {
                text: ''
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
            yAxis: {
                height: '75%',
                top: '35%'
            },
            xAxis: {
                min: Date.UTC(2022, 3, 27),
                max: Date.UTC(2022, 4, 22),
                top: '10%'
            },
            plotOptions: {
                series: {
                    showInLegend: true,
                    label: {
                        enabled: false
                    }
                },
                abands: {
                    tooltip: {
                        pointFormat: '{series.name}'
                    }
                }
            },
            series: [{
                type: 'ohlc',
                id: 'aapl',
                name: 'AAPL Stock Price',
                data: data

            }, {
                type: 'abands',
                linkedTo: 'aapl'
            }],
            responsive: {
                rules: [
                    // /up to 219
                    {
                        condition: {
                            // /up tp this
                            maxWidth: 219
                        },
                        chartOptions: {
                            chart: {
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
                                inputEnabled: false
                            },
                            xAxis: {
                                visible: false
                            },
                            yAxis: {
                                visible: true,
                                top: '20%',
                                height: '100%'
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 220,
                            margin: [40, 10, 0, 10]
                        },
                        chartOptions: {
                            chart: {
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
                                inputEnabled: false
                            },
                            xAxis: {
                                visible: true,
                                top: '10%'
                            },
                            yAxis: {
                                visible: true,
                                top: '25%',
                                height: '70%'
                            }
                        }
                    }
                ]
            }
        });
    })();
}

function flags() {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json'
        ).then(response => response.json());

        var lastDate = data[data.length - 1][0],  // Get year of last data point
            days = 24 * 36e5; // Milliseconds in a day

        // Create the chart
        Highcharts.stockChart('container', {
            chart: {
                height: 270,
                marginTop: 10
            },
            rangeSelector: {
                selected: 1,
                inputEnabled: false,
                dropdown: 'always',
                floating: true
            },
            navigator: {
                height: 30,
                series: {
                    label: {
                        enabled: false
                    }
                }
            },

            title: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            xAxis: {
                top: 30
            },
            yAxis: [{
                title: {
                    text: ''
                },
                top: '15%',
                height: '100%'
            }, {
                height: '25%'
            }],

            plotOptions: {
                series: {
                    label: {
                        enabled: false
                    }
                },
                flags: {
                    useHTML: true,
                    accessibility: {
                        exposeAsGroupOnly: true,
                        description: 'Flagged events.'
                    },
                    zIndex: 200,
                    shadow: true,
                    style: {
                        fontSize: '12px',
                        color: '#fff',
                        fontWeight: 400,
                        padding: '4px'
                    },
                    fillColor: '#46465C',
                    borderRadius: 4,
                    color: 'white',
                    label: {
                        maxFontSize: 20,
                        minFontSize: 12,
                        style: {
                            fontSize: '12px',
                            borderRadius: 4
                        }
                    }
                }
            },

            series: [{
                name: 'USD to EUR',
                data: data,
                id: 'dataseries',
                tooltip: {
                    valueDecimals: 4
                }
            }, {
                type: 'flags',
                name: 'Flags on series',
                data: [{
                    x: lastDate - 60 * days,
                    title: '<p style="margin-top:-14px;padding:0px 4px;text-align:center">On<br>series</p>'
                }, {
                    x: lastDate - 30 * days,
                    title: '&nbsp;On series&nbsp;'
                }],
                onSeries: 'dataseries',
                shape: 'circlepin',
                width: 40,
                height: 40,
                y: -40
            }, {
                type: 'flags',
                name: 'Flags on axis',
                data: [{
                    x: lastDate - 45 * days,
                    title: '&nbsp;On axis&nbsp;'
                }, {
                    x: lastDate - 15 * days,
                    title: '&nbsp;On axis&nbsp;'
                }],
                shape: 'squarepin'
            }, {
                type: 'flags',
                name: 'Flags in pane',
                data: [{
                    x: lastDate - 40 * days,
                    title: '&nbsp;In pane&nbsp;'
                }, {
                    x: lastDate - 15 * days,
                    title: '&nbsp;In pane&nbsp;'
                }],
                yAxis: 1,
                shape: 'squarepin'
            }]
        });

    })();
}

const charts = {
    compare: compare,
    indicators: indicators,
    ao: ao,
    dynamic: dynamic,
    flags: flags,
    ab: ab

};

if (chartToShow === 'dynamic') {
    document.getElementById('add').style.display = 'block';
} else {
    document.getElementById('add').style.display = 'none';
}

charts[chartToShow]();