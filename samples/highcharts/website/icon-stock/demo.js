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

const big = window.matchMedia("(min-width: 500px)").matches;

const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@feb8baf043cffb5e141ab065f95b8ca397569297/samples/graphics/homepage/';


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
    Highcharts.stockChart('stock',
        {
            chart: {
                animation: {
                    enabled: true,
                    duration: 2000,
                    easing: 'easeOutQuint'
                },
                styledMode: (true),
                margin: 0,
                spacing: 0,
                alignTicks: false,
                plotBackgroundImage: 'stock.png',
                events: {
                    load: function () {
                        const chart = this;
                        //particles fly by in the background
                        setTimeout(function () {
                            $('#stock .particle-1').css({ opacity: 1, transform: 'translate(500px, -50px)' });
                        }, 0);

                        setTimeout(function () {
                            $('#stock .particle-2').css({ opacity: 1, transform: 'translate(500px, -150px)' });
                        }, 100);

                        setTimeout(function () {
                            $('#stock .particle-5').css({ opacity: 1, transform: 'translate(500px, -250px)' });
                        }, 200);

                        setTimeout(function () {
                            $('#stock .particle-4').css({ opacity: 1, transform: 'translate(500px, 30px)' });
                        }, 400);

                        setTimeout(function () {
                            $('#stock .particle-3').css({ opacity: 1, transform: 'translate(500px, 230px)' });
                        }, 600);

                        setTimeout(function () {
                            $('#stock .particle-6').css({ opacity: 1, transform: 'translate(500px, 100px)' });
                        }, 800);

                        setTimeout(function () {

                            //moves green lie
                            chart.series[2].data[1].update({
                                x: 8.5,
                                y: 6.67
                            });

                            chart.series[2].data[2].update({
                                x: 8.5,
                                y: 6.67,
                                marker: {
                                    enabled: false
                                }
                            });

                            ///moves the purple line
                            chart.series[3].data[1].update({
                                x: 10.52,
                                y: 8.4
                            });
                            chart.series[3].data[2].update({
                                x: 10.52,
                                y: 8.4,
                                marker: {
                                    enabled: false
                                }
                            });
                        }, 1000);

                        setTimeout(function () {

                            let head = 40; //arrow head radius
                            if (big) {
                                head = 70;
                            }
                            ///moves green line
                            //turns on the marker
                            chart.series[2].data[2].update({
                                x: 14.2,
                                y: 12.14,
                                marker: {
                                    enabled: true,
                                    symbol: 'square',
                                    radius: head
                                }
                            });
                            ///moves purple line
                            //turns on the marker
                            chart.series[3].data[2].update({
                                x: 14,
                                y: 12.1,
                                marker: {
                                    enabled: true,
                                    symbol: 'square',
                                    radius: head
                                }
                            });
                        }, 2000);

                        setTimeout(function () {
                            ///grows the arrow heads (which are line markers)
                            $('.purple-line .highcharts-point').css({ fill: '#8087E8', transform: 'none' });
                            $('.green-line .highcharts-point').css({ fill: '#8bf2b6', transform: 'none' });
                        }, 3200);

                        setTimeout(function () {
                            ///set the x extremes to slide to the right
                            chart.xAxis[1].setExtremes(0, 7);
                        }, 5200);

                        setTimeout(function () {
                            ///hides all the earlier chart stuff and sets the yAxis extremes so
                            ///the lines part vertically
                            $('#stock .stock-bottom').css({ opacity: 0, transition: 'opacity 300ms' });
                            $('#stock .stock-top').css({ opacity: 0, transition: 'opacity 300ms' });
                            $('.purple-line .highcharts-point').css({ opacity: 0, transition: 'opacity 1s' });
                            $('.green-line .highcharts-point').css({ opacity: 0, transition: 'opacity 1s' });
                            chart.yAxis[2].setExtremes(10, 20);
                            chart.yAxis[3].setExtremes(10, 20);
                        }, 6000);

                        setTimeout(function () {
                            ///get the margins ready for the real chart
                            let margins = [50, 10, 30, 10];
                            if (big) {
                                margins = [80, 10, 30, 10];
                            }
                            chart.update({
                                chart: {
                                    margin: margins
                                }
                            });
                        }, 6300);

                        setTimeout(function () {
                            ///show the range selector and the series
                            $('.highcharts-range-selector-group').css({ opacity: 1 });
                            chart.series[12].update({
                                visible: true
                            });
                            chart.series[13].update({
                                visible: true
                            });
                        }, 6500);

                        setTimeout(function () {
                            ///fade in the candlestick and the column series, axis labels, title
                            $('.stick').animate({ opacity: 1 }, 1);
                            $('#stock .highcharts-column-series.column .highcharts-point').css({ opacity: 1 });
                            $('.highcharts-axis-labels').animate({ opacity: 1 }, 1000);
                            $('.highcharts-title').css({ opacity: 1 });
                            if (big) {
                                $('.highcharts-subtitle').css({ opacity: 1 });
                            }
                        }, 6800);

                        setTimeout(function () {
                            ///turn on the axes
                            chart.yAxis[0].update({
                                visible: true
                            });
                            chart.xAxis[0].update({
                                visible: true
                            });
                        }, 7500);
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
                text: 'Two panes, candlestick and volume',
                y: 30
            },
            subtitle: {
                text: 'The demo is divided into two panes, with a resizer handle between the panes',
                y: 50
            },
            xAxis: [
                //0
                {
                    min: Date.UTC(2021, 5, 2),
                    max: Date.UTC(2021, 8, 4),
                    visible: false

                },
                //1 -
                {
                    min: 0,
                    max: 20,
                    gridLineColor: 'transparent',
                    tickInterval: 1,
                    type: 'linear',
                    visible: false,
                    crosshair: {
                        snap: false
                    },
                    ordinal: false
                },

                ///2-
                {
                    min: 0,
                    max: 20,
                    gridLineColor: 'transparent',
                    tickInterval: 1,
                    reversed: true,
                    visible: false,
                    crosshair: {
                        snap: false
                    },
                    ordinal: false
                }
            ],
            yAxis: [
                ///0
                {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'OHLC'
                    },
                    height: '60%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    },
                    visible: false,
                    zIndex: 300
                },
                ///1
                {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'Volume'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2,
                    visible: true
                },
                //0
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
                ///1 -
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

                },
                pie: {
                    animation: false
                },
                line: {
                    animation: false,
                    dataGrouping: {
                        enabled: false
                    }
                }
            },
            series: [
            //0 - top area (11) y0
                {
                    type: 'arearange',
                    className: 'stock-top',
                    data: [
                        { x: 0, low: -2, high: 18 },
                        { x: 20, low: 18, high: 18 }
                    ],
                    zIndex: 11,
                    visible: true,
                    xAxis: 1,
                    yAxis: 2,
                    marker: {
                        enabled: false
                    }

                },
                //1- bottom area (11) y1
                {
                    type: 'arearange',
                    className: 'stock-bottom',
                    data: [
                        { x: 0, low: -2, high: 18 },
                        { x: 20, low: 18, high: 18 }
                    ],
                    zIndex: 11,
                    yAxis: 3,
                    xAxis: 1,
                    visible: true,
                    marker: {
                        enabled: false
                    }

                },
                //2 - green line (21) y0
                {
                    type: 'line',
                    lineColor: 'red',
                    className: 'green-line',
                    name: 'green line',
                    lineWidth: 30,
                    width: 30,
                    borderWidth: 30,
                    data: [{
                        x: 0,
                        y: 6.67
                    }, {
                        x: 0,
                        y: 6.67
                    },
                    {
                        x: 0,
                        y: 6.67,
                        marker: {
                            enabled: false,
                            radius: 70,
                            symbol: 'square'
                        }
                    }],
                    zIndex: 21,
                    xAxis: 1,
                    yAxis: 2
                },
                //3 - purple line (21) y1
                {
                    type: 'line',
                    name: 'purple line',
                    marker: {
                        enabled: true
                    },
                    className: 'purple-line',
                    data: [{
                        x: 0,
                        y: 8.25
                    }, {
                        x: 0,
                        y: 8.25
                    },
                    {
                        x: 0,
                        y: 8.25,
                        marker: {
                            enabled: false,
                            radius: 70,
                            symbol: 'square'
                        }
                    }],
                    zIndex: 21,
                    yAxis: 3,
                    xAxis: 1,
                    visible: true
                },
                //4 - minus (21) hidden
                {
                    type: 'line',
                    name: 'minus',
                    className: 'white-line',
                    data: [{
                        x: 4,
                        y: 2.5
                    }, {
                        x: 8,
                        y: 2.5
                    }],
                    zIndex: 21,
                    visible: false,
                    xAxis: 1,
                    yAxis: 2

                },
                /// 5- plus V (21) hidden
                {
                    type: 'line',
                    name: 'plusV',
                    lineColor: 'blue',
                    className: 'white-line',
                    lineWidth: 30,
                    width: 30,
                    borderWidth: 30,
                    data: [{
                        x: 6,
                        y: 10
                    }, {
                        x: 6,
                        y: 14
                    }],
                    zIndex: 21,
                    visible: false,
                    xAxis: 1,
                    yAxis: 2

                },
                ///6- plus H (21) hidden
                {
                    type: 'line',
                    name: 'plusH',
                    lineColor: 'blue',
                    className: 'white-line',
                    lineWidth: 30,
                    width: 30,
                    borderWidth: 30,
                    data: [{
                        x: 4,
                        y: 12
                    }, {
                        x: 8,
                        y: 12
                    }],
                    zIndex: 21,
                    visible: false,
                    xAxis: 1,
                    yAxis: 2

                },

                ///7- top arrow (21)
                {
                    type: 'arearange',
                    name: 'top arrow',
                    className: 'green',
                    marker: {
                        enabled: false
                    },
                    lineWidth: 30,
                    width: 30,
                    borderWidth: 30,
                    data: [{
                        x: 12,
                        low: 12.6,
                        high: 12
                    }, {
                        x: 14,
                        low: 10.18,
                        high: 14.99

                    }],
                    zIndex: 21,
                    xAxis: 1,
                    yAxis: 2

                },

                ///8- bottom arrow (21)
                {
                    type: 'arearange',
                    name: 'bottom arrow',
                    lineColor: 'blue',
                    className: 'purple',
                    lineWidth: 30,
                    width: 30,
                    borderWidth: 30,
                    data: [{
                        x: 12,
                        low: 14,
                        high: 14
                    }, {
                        x: 14,
                        low: 10,
                        high: 14

                    }],
                    zIndex: 21,
                    yAxis: 3,
                    xAxis: 1,
                    marker: {
                        enabled: false
                    }

                },


                //9 - particles (40)

                {
                    type: 'scatter',
                    name: 'particles',
                    animation: false,
                    className: 'particles',
                    data: [
                        {
                            x: 10,
                            y: 8,
                            className: 'particle-1',
                            marker: {
                                enabled: true,
                                symbol: 'url(' + imgPath + 'p1.svg)',
                                width: 35,
                                height: 60

                            }
                        },
                        {
                            x: 10,
                            y: 8,
                            className: 'particle-2',
                            marker: {
                                enabled: true,
                                symbol: 'url(' + imgPath + 'p2.svg)',
                                width: 23,
                                height: 42
                            }
                        },
                        {
                            x: 10,
                            y: 8,
                            className: 'particle-3',
                            marker: {
                                enabled: true,
                                symbol: 'url(' + imgPath + 'p3.svg)',
                                width: 23,
                                height: 34
                            }
                        },

                        {
                            x: 10,
                            y: 8,
                            className: 'particle-4',
                            marker: {
                                enabled: true,
                                symbol: 'url(' + imgPath + 'p4.svg)',
                                width: 27,
                                height: 17
                            }
                        },
                        {
                            x: 10,
                            y: 8,
                            className: 'particle-5',
                            marker: {
                                enabled: true,
                                symbol: 'url(' + imgPath + 'p5.svg)',
                                width: 35,
                                height: 50
                            }
                        },
                        {
                            x: 10,
                            y: 8,
                            className: 'particle-6',
                            marker: {
                                enabled: true,
                                symbol: 'url(' + imgPath + 'p6.svg)',
                                width: 45,
                                height: 45
                            }
                        }
                    ],
                    zIndex: 10,
                    xAxis: 2,
                    yAxis: 2,
                    visible: true
                },
                //10 - green line (21) y0
                {
                    type: 'line',
                    lineColor: 'red',
                    className: 'transparent',
                    name: 'green line',
                    lineWidth: 30,
                    width: 30,
                    borderWidth: 30,
                    data: [{
                        x: 0,
                        y: 6.5
                    }, {
                        x: 8.5,
                        y: 6.5
                    },
                    {
                        x: 13.9999,
                        y: 11.42
                    }],
                    zIndex: 21,
                    xAxis: 1,
                    yAxis: 2
                },
                //11 - purple line (21) y1
                {
                    type: 'line',
                    name: 'purple line',
                    className: 'transparent',
                    data: [{
                        x: 0,
                        y: 8.5
                    }, {
                        x: 11.502,
                        y: 8.5
                    },
                    {
                        x: 13.9999,
                        y: 12.02
                    }],
                    zIndex: 21,
                    yAxis: 3,
                    xAxis: 1
                },
                //12 -- candlestick
                {
                    type: 'candlestick',
                    name: 'AAPL',
                    className: 'stick',
                    data: ohlc,
                    zIndex: 300,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    visible: false

                },
                //13 --column
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
                    visible: false
                }


            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 300
                    },
                    chartOptions: {
                        rangeSelector: {
                            enabled: true,
                            dropdown: 'always',
                            inputEnabled: false,
                            buttonPosition: {
                                x: 120,
                                y: -60
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
                            inputEnabled: true,
                            y: -60
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
        }

    );

});
