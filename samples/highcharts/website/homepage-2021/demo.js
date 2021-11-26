Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

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

let heroChart;

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const big = window.matchMedia("(min-width: 500px)").matches;

const bubbleData0 = [
    { x: 0, y: 3, z: 200, className: 'transparent', dataLabels: { enabled: false } },
    { x: 0.5, y: 16, z: 120000, className: 'bubble-black', zIndex: 1  },
    { x: 0.5, y: 18, z: 12000, className: 'bubble-green' },
    { x: 0.5, y: 12.9, z: 80000, className: 'bubble-brown', zIndex: 1 },
    { x: 0.5, y: 14.2, z: 2000, className: 'bubble-gray', zIndex: 10 },
    { x: 0.5, y: 8.97, z: 28000, className: 'bubble-gray' },
    { x: 0.5, y: 7.65, z: 50, className: 'bubble-orange' },
    { x: 0.5, y: 5.32, z: 40000, className: 'bubble-dpurple' },
    { x: 0.5, y: 2.6, z: 3000, className: 'bubble-gray' },
    { x: 0.5, y: 3.7, z: 9000, className: 'bubble-purple' }
];

const bubbleData1 = [
    { x: 1.6, y: 19, z: 100, className: 'bubble-orange' },
    { x: 1.6, y: 17, z: 24000, className: 'bubble-black' },
    { x: 1.6, y: 15.32, z: 3000, className: 'bubble-black' },
    { x: 1.6, y: 14.32, z: 2000, className: 'bubble-black' },
    { x: 1.6, y: 12.67, z: 22000, className: 'bubble-brown' },
    { x: 1.6, y: 11.32, z: 9000, className: 'bubble-purple' },
    { x: 1.6, y: 8.32, z: 9000, className: 'bubble-green' },
    { x: 1.6, y: 7.32, z: 3000, className: 'bubble-green' }
];

const bubbleData2 = [
    { x: 2.6, y: 18.5, z: 10, className: 'bubble-orange' },
    { x: 2.6, y: 17, z: 2000, className: 'bubble-gray' },
    { x: 2.6, y: 13.5, z: 50, className: 'bubble-orange' },
    { x: 2.6, y: 10.75, z: 40000, className: 'bubble-green' },
    { x: 2.6, y: 7, z: 80000, className: 'bubble-purple' },
    { x: 2.6, y: 5.8, z: 2000, className: 'bubble-purple' },
    { x: 2.6, y: 4.5, z: 9000, className: 'bubble-purple' },
    { x: 2.6, y: 3, z: 9000, className: 'bubble-green' }
];

const bubbleData3 = [
    { x: 3.84, y: 18, z: 9000, className: 'bubble-green' },
    { x: 3.84, y: 15.6, z: 6000, className: 'bubble-green' },
    { x: 3.84, y: 14.78, z: 40000, className: 'bubble-green' },
    { x: 3.84, y: 12.75, z: 80000, className: 'bubble-green' },
    { x: 3.84, y: 6.7, z: 130000, className: 'bubble-gray' },
    { x: 3.84, y: 8.9, z: 9000, className: 'bubble-orange' },
    { x: 3.84, y: 3.8, z: 9000, className: 'bubble-black' },
    { x: 3.84, y: 2.6, z: 3000, className: 'bubble-green' }
];

const bubbleData4 = [
    { x: 4.75, y: 17, z: 2000, className: 'bubble-black' },
    { x: 4.75, y: 11.5, z: 12000, className: 'bubble-brown' },
    { x: 4.75, y: 10.38, z: 3000, className: 'bubble-black' },
    { x: 4.75, y: 8.7, z: 10000, className: 'bubble-purple' },
    { x: 4.75, y: 7.2, z: 22000, className: 'bubble-black' },
    { x: 4.75, y: 6, z: 9000, className: 'bubble-green' },
    { x: 4.75, y: 4.9, z: 200, className: 'bubble-orange' },
    { x: 4.75, y: 3.8, z: 2000, className: 'bubble-green' }
];

const bubbleData5 = [
    { x: 5.64, y: 18.25, z: 10000, className: 'bubble-purple' },
    { x: 5.64, y: 16.2, z: 40000, className: 'bubble-green' },
    { x: 5.64, y: 14.3, z: 10000, className: 'bubble-green' },
    { x: 5.64, y: 13.45, z: 3000, className: 'bubble-gray' },
    { x: 5.64, y: 11.54, z: 80000, className: 'bubble-brown' },
    { x: 5.64, y: 9.3, z: 6000, className: 'bubble-gray' },
    { x: 5.64, y: 8.2, z: 24000, className: 'bubble-gray' },
    { x: 5.64, y: 5, z: 120000, className: 'bubble-black' },
    { x: 5.64, y: 7.25, z: 200, className: 'bubble-orange' }

];

const bubbleData6 = [
    { x: 6.58, y: 17.9, z: 200, className: 'bubble-orange' },
    { x: 6.58, y: 15.9, z: 2000, className: 'bubble-gray' },
    { x: 6.58, y: 14.75, z: 5, className: 'bubble-orange' },
    { x: 6.58, y: 11.24, z: 22000, className: 'bubble-green' },
    { x: 6.58, y: 9.8, z: 10000, className: 'bubble-green' },
    { x: 6.58, y: 4.53, z: 12000, className: 'bubble-purple' },
    { x: 6.58, y: 3.2, z: 3000, className: 'bubble-purple' }

];

const sankeyData = [
    ['  ', '29,265', 90],
    ['94,236', '29,265', 80],
    ['86,811', '29,265', 70],
    ['72,638', '29,265', 60],
    ['70,770', '29,265', 50],
    [' ', '29,265', 0],
    ['30,903', '29,265', 30],
    ['26,253', '29,265', 20],
    ['', '29,265', 0],

    ['', '21,546', 0],
    ['94,236', '21,546', 40],
    ['86,811', '21,546', 10],
    ['72,638', '21,546', 40],
    ['70,770', '21,546', 10],
    [' ', '21,546', 0],
    ['30,903', '21,546', 10],
    ['26,253', '21,546', 40],
    [' ', '21,546', 20],

    ['', '15,447', 10],
    ['94,236', '15,447', 10],
    ['86,811', '15,447', 10],
    ['72,638', '15,447', 0],
    ['70,770', '15,447', 10],
    [' ', '15,447', 5],
    ['30,903', '15,447', 0],
    ['26,253', '15,447', 10],
    ['', '15,447', 10],

    ['', '8,123', 0],
    ['94,236', '8,123', 0],
    ['86,811', '8,123', 10],
    ['72,638', '8,123', 40],
    ['70,770', '8,123', 10],
    [' ', '8,123', 0],
    ['30,903', '8,123', 50],
    ['26,253', '8,123', 10],
    ['', '8,123', 0],


    ['', '3,959', 0],
    ['94,236', '3,959', 10],
    ['86,811', '3,959', 0],
    ['72,638', '3,959', 0],
    ['70,770', '3,959', 10],
    ['', '3,959', 0],
    ['30,903', '3,959', 40],
    ['26,253', '3,959', 10],
    ['', '3,959', 20]
];

const updateStyle = function (selector, property, value, duration) {
    [].forEach.call(
        document.querySelectorAll('.' + selector),
        function (elem) {
            elem.style.transition = property + ' ' + duration;
            elem.style[property] = value;
        }
    );
};
const bubbleData = [bubbleData0, bubbleData1, bubbleData2, bubbleData3,
    bubbleData4, bubbleData5, bubbleData6];


//bubble, sankey, candlestick, bubble2, clear intervals
//const loops = [0, 7000, 13000, 21000];


const candlestick = function (type) {
    Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {
    // create the chart
        heroChart = Highcharts.stockChart('hero', {
            chart: {
                styledMode: (true),
                margin: [0, 0, 0, 0],
                height: 430,
                animation: {
                    enabled: true,
                    duration: 1000,
                    easing: 'easeOutQuint'
                },
                events: {
                    load: function () {
                        const chart = this;

                        updateStyle('highcharts-title', 'opacity', 0, '0s');
                        updateStyle('candlestick', 'opacity', 0, '0s');
                        updateStyle('highcharts-yaxis-labels', 'opacity', 0, '0s');

                        if (type === 'static') {
                            chart.update({
                                navigator: {
                                    enabled: true
                                }
                            });
                            chart.update({
                                tooltip: {
                                    enabled: true
                                }
                            });
                            updateStyle('candlestick', 'transform', 'rotate(0deg)', '0s');
                            if (big) {
                                chart.rangeSelector.clickButton(3);
                            } else {
                                chart.rangeSelector.clickButton(1);
                            }
                        }

                        const p1 = function () {
                            chart.xAxis[0].update({ visible: true });
                            updateStyle('highcharts-axis-labels', 'opacity', 1, '800ms');
                            updateStyle('candlestick', 'opacity', 0, '0s');
                            updateStyle('candlestick', 'opacity', 1, '1s');
                            updateStyle('highcharts-point-up', 'fillOpacity', 1, '1s');
                            updateStyle('highcharts-point-down', 'fillOpacity', 1, '1s');
                            updateStyle('highcharts-range-selector-buttons', 'opacity', 1, '1s');
                            if (!reduced) {
                                updateStyle('candlestick', 'transform', 'rotate(0deg)', '1s');
                            }

                        };
                        setTimeout(p1, 700);

                        if (type === 'animated') {

                            chart.update({
                                tooltip: {
                                    enabled: true
                                }
                            });
                            chart.series[0].update({
                                enableMouseTracking: true
                            });
                            const p2 = function () {
                                if (big) {
                                    chart.rangeSelector.clickButton(3);
                                } else {
                                    chart.rangeSelector.clickButton(1);
                                }

                            };
                            setTimeout(p2, 3000);
                        }
                    }
                }
            },
            title: {
                text: '',
                y: 110

            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                valueDecimals: 2
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                enabled: true,
                inputEnabled: false,
                selected: 0,
                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '1w',
                    title: 'View 1 week'
                },
                {
                    type: 'week',
                    count: 4,
                    text: '1m',
                    title: 'View 1 month'
                }, {
                    type: 'month',
                    count: 2,
                    text: '2m',
                    title: 'View 2 months'
                },
                {
                    type: 'month',
                    count: 3,
                    text: '3m',
                    title: 'View 3 months'
                },

                {
                    type: 'month',
                    count: 4,
                    text: '4m',
                    title: 'View 4 months'
                }],
                floating: true,
                verticalAlign: 'middle',
                y: -130,
                buttonPosition: {
                    align: 'center'
                }
            },
            xAxis: [{
                visible: false,
                offset: -30,
                events: {
                    afterSetExtremes: function () {
                        // document.querySelector('.highcharts-candlestick-series.candlestick').classList.add('h');
                        updateStyle('highcharts-point-up', 'fillOpacity', 1, '1s');
                        updateStyle('highcharts-point-down', 'fillOpacity', 1, '1s');
                    }
                }
            }],
            yAxis: [{
                visible: false
            }],
            plotOptions: {
                series: {
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'AAPL',
                animation: {
                    enabled: true
                },
                type: 'candlestick',
                className: 'candlestick',
                dataGrouping: {
                    units: [
                        [
                            'week',
                            [1, 2, 3, 4, 6, 52]
                        ],
                        [
                            'month',
                            [12]
                        ]
                    ]
                },
                data: data
            }]
        });
    });
};

const bubble2 = {
    chart: {
        type: 'bubble',
        height: 430,
        styledMode: (true),
        margin: [0, 0, 0, 0],
        spacing: 0,
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                updateStyle('bubble2-purple', 'transform', 'none', '0s');
                updateStyle('highcharts-title', 'opacity', 0, '0s');
                updateStyle('highcharts-data-labels', 'opacity', 0, '0s');

                if (reduced) {
                    setTimeout(function () {
                        chart.xAxis[0].setExtremes(0, 10);
                        updateStyle('highcharts-data-labels', 'opacity', 1, '1s');
                    }, 200);
                    setTimeout(function () {
                        updateStyle('highcharts-bubble-series', 'opacity', 0, '1s');
                    }, 5000);
                } else {
                    setTimeout(function () {
                        chart.xAxis[0].setExtremes(-1000, 10);
                    }, 1000);
                    setTimeout(function () {
                        chart.xAxis[0].setExtremes(0, 10);
                        updateStyle('highcharts-data-labels', 'opacity', 1, '1s');
                    }, 2600);
                    setTimeout(function () {
                        updateStyle('highcharts-bubble-series', 'opacity', 0, '1s');
                        chart.yAxis[0].setExtremes(-2000, 2000);
                    }, 5000);
                    const p3 = function () {
                        if (heroChart) {
                            heroChart.destroy();
                        }
                        candlestick('animated');
                    };
                    setTimeout(p3, 6500);
                }
            }
        }
    },
    accessibility: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        y: 160
    },
    xAxis: [
        {
            offset: -40,
            min: -1000,
            max: 1000,
            visible: false,
            tickInterval: 1,
            labels: {
                style: {
                    color: '#fff'
                }
            }

        }],
    yAxis: [{
        tickInterval: 1,
        max: 24,
        min: -2,
        plotLines: [{
            value: 21
        }, {
            value: 17.6
        },
        {
            value: 15.4
        },
        {
            value: 12.5
        },
        {
            value: 10.3
        },
        {
            value: 7.2
        },
        {
            value: 5.2
        },
        {
            value: 2
        }],
        offset: 0
    }],
    plotOptions: {
        series: {
            name: 'Highcharts Bubble Chart',
            enableMouseTracking: false
        }
    },
    legend: {
        enabled: false
    },
    series: [
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            data: [
                { x: 0, y: 16.85, z: 20, className: 'transparent' },
                { x: 1.14, y: 19.125, z: 3, className: 'bubble2-gray', zIndex: 1  },
                { x: 1.57, y: 13.95, z: 5, className: 'bubble2-yellow', zIndex: 1  },
                { x: 2.46, y: 19.21, z: 10, className: 'bubble2-green', zIndex: 1  },
                { x: 2.76, y: 8.74, z: 12, className: 'bubble2-purple', zIndex: 1  },
                { x: 2.82, y: 3.57, z: 8, className: 'bubble2-green', zIndex: 1  },
                { x: 6.5, y: 3.43, z: 12, className: 'bubble2-orange', zIndex: 1  },
                { x: 8.63, y: 0.94, z: 3, className: 'bubble2-white', zIndex: 1  },
                { x: 9, y: 0.94, z: 3, className: 'bubble2-white', zIndex: 1  },
                { x: 10, y: 16.35, z: 20, className: 'transparent' }
            ],
            visible: true,
            zIndex: 100
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 1,
                    y: 19.125,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -40
                    }
                },
                { x: 1.21, y: 19.125, z: 3 },
                { x: 1.27, y: 19.125, z: 3 },
                { x: 1.7, y: 19.125, z: 3 },
                { x: 1.75, y: 19.125, z: 3 },
                { x: 1.78, y: 19.125, z: 3 },
                { x: 1.83, y: 19.125, z: 3 },
                { x: 2.35, y: 19.125, z: 3 },
                { x: 3.3, y: 19.125, z: 3 },
                { x: 3.46, y: 19.125, z: 3 },
                { x: 4.13, y: 19.125, z: 3 },
                { x: 4.4, y: 19.125, z: 3 },
                {
                    x: 4.97,
                    y: 19.125,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },

                { x: 10, y: 20, z: 30, className: 'transparent' }

            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 1.66,
                    y: 16.52,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 2.2, y: 16.52, z: 3 },
                { x: 2.38, y: 16.52, z: 3 },
                { x: 2.47, y: 16.52, z: 3 },
                { x: 2.59, y: 16.52, z: 3 },
                {
                    x: 2.86,
                    y: 16.52,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 0.95,
                    y: 13.9,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 1.47, y: 13.9, z: 3 },
                { x: 1.6, y: 13.9, z: 3 },
                { x: 1.7, y: 13.9, z: 3 },
                { x: 1.9, y: 13.9, z: 3 },
                { x: 2.33, y: 13.9, z: 3 },
                { x: 2.41, y: 13.9, z: 3 },
                {
                    x: 2.49,
                    y: 13.9,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 1.75,
                    y: 11.34,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 1.82, y: 11.34, z: 3 },
                { x: 1.89, y: 11.34, z: 3 },
                { x: 2, y: 11.34, z: 3 },
                { x: 2.2, y: 11.34, z: 3 },
                { x: 2.53, y: 11.34, z: 3 },
                { x: 2.7, y: 11.34, z: 3 },
                {
                    x: 3.57,
                    y: 11.34,
                    z: 3,

                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 2.58,
                    y: 8.74,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 3.3, y: 8.74, z: 3 },
                {
                    x: 3.57,
                    y: 8.74,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 3,
                    y: 6.14,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 3.16, y: 6.14, z: 3 },
                { x: 3.37, y: 6.14, z: 3 },
                { x: 3.7, y: 6.14, z: 3 },
                { x: 3.84, y: 6.14, z: 3 },
                { x: 4.16, y: 6.14, z: 3 },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 2.42,
                    y: 3.5,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 2.71, y: 3.5, z: 3 },
                { x: 3.31, y: 3.5, z: 3 },
                { x: 3.43, y: 3.5, z: 3 },
                { x: 3.57, y: 3.5, z: 3 },
                { x: 3.69, y: 3.5, z: 3 },
                { x: 3.85, y: 3.5, z: 3 },
                { x: 4.13, y: 3.5, z: 3 },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-dgray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                { x: 4.3, y: 6.14, z: 3 },
                { x: 4.4, y: 6.14, z: 3 },
                { x: 4.5, y: 6.14, z: 3 },
                { x: 4.95, y: 6.14, z: 3 },
                {
                    x: 5.9,
                    y: 6.14,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-dgray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                { x: 4.3, y: 3.5, z: 3 },
                { x: 4.63, y: 3.5, z: 3 },
                { x: 5.28, y: 3.5, z: 3 },
                { x: 5.47, y: 3.5, z: 3 },
                { x: 6.01, y: 3.5, z: 3 },
                { x: 6.36, y: 3.5, z: 8 },
                { x: 7, y: 3.5, z: 3 },
                { x: 7.32, y: 3.5, z: 3 },
                { x: 7.44, y: 3.5, z: 3 },
                {
                    x: 8.09,
                    y: 3.5,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-dgray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 5.9,
                    y: 0.94,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 6.53, y: 0.94, z: 3 },
                { x: 7.22, y: 0.94, z: 3 },
                { x: 7.34, y: 0.94, z: 3 },
                { x: 7.47, y: 0.94, z: 3 },
                { x: 7.84, y: 0.94, z: 3 },
                { x: 8.03, y: 0.94, z: 3 },
                { x: 8.53, y: 0.94, z: 3 },
                { x: 8.56, y: 0.94, z: 3 },
                { x: 8.58, y: 0.94, z: 3 },
                {
                    x: 8.85,
                    y: 0.94,
                    z: 12,
                    className: 'bubble2-blue',
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        }
    ]
};

const sankey = {
    chart: {
        styledMode: (true),
        height: 430,
        marginRight: 0,
        animation: {
            duration: 1000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                updateStyle('highcharts-title', 'opacity', 0, '0s');
                updateStyle('highcharts-data-labels', 'opacity', 0, '0s');
                updateStyle('highcharts-data-labels', 'opacity', 1, '400ms');

                chart.series[0].update({
                    data: []
                });
                const p1 = function () {
                    //let count = 0;
                    //adds nodes to the sankey
                    /*const sankey = setInterval(function () {
                        if (count < sankeyData.length) {
                            chart.series[0].addPoint({
                                from: sankeyData[count][0],
                                to: sankeyData[count][1],
                                weight: sankeyData[count][2]
                            });
                            count = count + 1;
                        } else {
                            clearInterval(sankey);
                        }
                    }, 10);*/

                    for (let ii = 0; ii < sankeyData.length; ++ii) {
                        chart.series[0].addPoint({
                            from: sankeyData[ii][0],
                            to: sankeyData[ii][1],
                            weight: sankeyData[ii][2]
                        }, false);
                    }
                    chart.redraw();
                };
                setTimeout(p1, 200);

                const p2 = function () {
                    //makes the node connections very thin
                    //makes the nodes super curvy
                    updateStyle('highcharts-data-labels', 'opacity', 0, '1s');
                    chart.series[0].update({
                        nodePadding: 130
                    });
                    chart.series[0].update({
                        curveFactor: 2
                    });
                    updateStyle('highcharts-data-labels', 'opacity', 0, '1s');
                };
                ///if it's not reduced motion, execute p2
                if (!reduced) {
                    setTimeout(p2, 4000);
                }
                const p22 = function () {
                    updateStyle('highcharts-data-labels', 'opacity', 0, '1s');
                    updateStyle('highcharts-link', 'opacity', 0, '2s');
                    updateStyle('highcharts-node', 'opacity', 0, '2s');
                };
                setTimeout(p22, 4500);

                const p3 = function () {
                    if (heroChart) {
                        heroChart.destroy();
                    }
                    heroChart = Highcharts.chart('hero', bubble2);
                };
                setTimeout(p3, 6500);

            }
        }
    },
    accessibility: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        verticalAlign: 'middle',
        floating: true
    },
    xAxis: [
        {
            min: 0,
            max: 10,
            visible: false
        }
    ],
    yAxis: [
        {
            min: 0,
            max: 10,
            visible: false
        }
    ],
    plotOptions: {
        series: {
            enableMouseTracking: false
        },
        area: {
            marker: {
                enabled: false
            }
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        centerInCategory: true,
        linkOpacity: 1,
        data: [],
        curveFactor: 0.33,
        nodes: [{
            id: '',
            colorIndex: 0
        }, {
            id: '94,236',
            colorIndex: 1
        }, {
            id: '86,811',
            colorIndex: 2
        }, {
            id: '72,638',
            colorIndex: 3
        }, {
            id: '70,770',
            colorIndex: 4
        }, {
            id: ''
        },
        {
            id: '30,903'
        },
        {
            id: '26,253'
        },
        {
            id: ''
        }],
        type: 'sankey',
        name: 'Highcharts Sankey Diagram'
    },
    {
        type: 'area',
        className: 'cover',
        data: [
            {
                x: -1,
                y: 10
            },
            {
                x: 2.5,
                y: 10
            }
        ]
    },
    {
        type: 'area',
        className: 'cover',
        data: [
            {
                x: 7.5,
                y: 10
            },
            {
                x: 11,
                y: 10
            }
        ]

    }]

};
const bubble = {
    chart: {
        type: 'bubble',
        height: 430,
        styledMode: (true),
        margin: [0, 0, 0, 0],
        spacing: 0,
        animation: {
            duration: 1000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                let yaxis = 0;
                for (let ii = 0; ii < bubbleData.length; ++ii) {
                    chart.addSeries({
                        type: 'bubble',
                        data: bubbleData[ii],
                        yAxis: yaxis
                    });
                    if (yaxis === 0) {
                        yaxis = 1;
                    } else {
                        yaxis = 0;
                    }
                }

                if (reduced) {
                    chart.series[0].update({ visible: true });
                    updateStyle('highcharts-bubble-series', 'opacity',  1, '0s');
                    setTimeout(function () {
                        chart.yAxis[0].setExtremes(0, 24);
                        chart.yAxis[1].setExtremes(0, 24);
                        updateStyle('highcharts-plot-line', 'opacity', 1, '1s');
                    }, 1500);

                    setTimeout(function () {
                        ///moves all the bubbles down, fades them out
                        const bubbleClasses = ['green', 'brown', 'purple', 'dpurple', 'gray', 'orange', 'black'];

                        updateStyle('highcharts-data-labels', 'opacity', 0, '1s');

                        updateStyle('highcharts-plot-line', 'opacity', 0, '1s');

                        for (let ii = 0; ii < bubbleClasses.length; ++ii) {
                            const bubbleSelector = 'highcharts-point.bubble-' + bubbleClasses[ii];
                            updateStyle(bubbleSelector, 'opacity', 0, '300ms');
                        }
                    }, 3500);

                } else {
                    updateStyle('highcharts-bubble-series', 'opacity', 0, '0s');
                    setTimeout(function () {
                        chart.series[0].update({ visible: true });
                        updateStyle('highcharts-bubble-series', 'opacity', 1, '1s');
                        updateStyle('highcharts-data-labels', 'opacity', 0, '0s');
                    }, 100);

                    setTimeout(function () {
                        updateStyle('highcharts-plot-line', 'opacity', 1, '1s');
                        chart.yAxis[0].setExtremes(0, 24);
                        [].forEach.call(
                            document.querySelectorAll('.highcharts-data-labels'),
                            function (elem, index) {
                                if (index % 2 === 0) {
                                    elem.style.opacity = 1;
                                }
                            }
                        );

                    }, 1500);
                    setTimeout(function () {
                        chart.yAxis[1].setExtremes(0, 24);

                        [].forEach.call(
                            document.querySelectorAll('.highcharts-data-labels'),
                            function (elem, index) {
                                if (index % 2 !== 0) {
                                    elem.style.opacity = 1;
                                }
                            }
                        );

                    }, 3000);

                    setTimeout(function () {
                        ///moves all the bubbles down, fades them out
                        chart.yAxis[0].setExtremes(-2, 1000);
                        chart.yAxis[1].setExtremes(-2, 1000);
                        const bubbleClasses = ['green', 'brown', 'purple', 'dpurple', 'gray', 'orange', 'black'];

                        for (let ii = 0; ii < bubbleClasses.length; ++ii) {
                            const bubbleSelector = 'highcharts-point.bubble-' + bubbleClasses[ii];
                            updateStyle(bubbleSelector, 'opacity', 0, '0s');
                        }
                        updateStyle('highcharts-bubble-series', 'opacity', 0, '1s');
                        updateStyle('highcharts-data-labels', 'opacity', 0, '1s');
                        updateStyle('highcharts-plot-line', 'opacity', 0, '1s');
                    }, 5500);

                    setTimeout(function () {
                        if (heroChart) {
                            heroChart.destroy();
                        }
                        heroChart = Highcharts.chart('hero', sankey); //5500
                    }, 6000);

                }
            }
        }
    },
    accessibility: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    tooltip: {
        animation: {
            duration: 1000
        }
    },
    title: {
        text: '',
        y: 100
    },
    xAxis: [
        {
            offset: 0,
            labels: {
                style: {
                    color: '#fff'
                }
            },
            plotLines: [
                {
                    value: 0.5
                },
                {
                    value: 1.6
                },
                {
                    value: 2.6
                },
                {
                    value: 3.84
                },
                {
                    value: 4.75
                },
                {
                    value: 5.64
                },
                {
                    value: 6.58
                }
            ]
        }],

    yAxis: [{
        visible: false,
        offest: 0,
        min: -250,
        max: 250,
        labels: {
            style: {
                color: '#fff'
            }
        }
    },
    {
        visible: false,
        offest: 0,
        min: -250,
        max: 250,
        labels: {
            style: {
                color: '#fff'
            }
        }
    }],
    legend: {
        enabled: false,
        itemMarginTop: 10,
        bubbleLegend: {
            enabled: true,
            borderWidth: 1,
            maxSize: 60,
            minSize: 10,
            connectorDistance: 40,
            ranges: [
                { value: 1 },
                { value: 50 },
                { value: 100 },
                { value: 177 }
            ]
        }
    },
    plotOptions: {
        series: {
            animation: false,
            enableMouseTracking: false,
            maxSize: 160,
            name: 'Highcharts Bubble Chart',
            minSize: 20,
            allowOverlap: true,
            dataLabels: {
                enabled: true
            }
        }
    }
};


const createBubble = function () {
    if (heroChart) {
        heroChart.destroy();
    }
    heroChart = Highcharts.chart('hero', bubble);
};

createBubble();
