Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

const berry = {
    enabled: true,
    fillColor: '#DC2626',
    radius: 0.3,
    symbol: 'circle'
};

Highcharts.chart('container', {
    chart: {
        backgroundColor: '#047857',
        height: '100%',
        margin: [0, 10, 100, 10],
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;

                const flakeSet1 = document.querySelectorAll(
                    '.highcharts-series-12 .highcharts-point'
                );

                const flakeSet2 = document.querySelectorAll(
                    '.highcharts-series-13 .highcharts-point'
                );

                const berryPoints = [4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

                const branchSnow = document.querySelectorAll(
                    '.highcharts-areasplinerange-series'
                );

                const bottomSnow = document.querySelectorAll(
                    '.highcharts-series-19'
                );

                const buds = document.querySelectorAll('.highcharts-series-18');

                berry.radius = 10;

                setTimeout(function () {
                    chart.update({
                        chart: {
                            margin: 0
                        }
                    });

                    [].forEach.call(
                        flakeSet1,
                        function (element) {
                            element.style.transform = 'translateY(1000px)';
                        }
                    );

                    [].forEach.call(
                        flakeSet2,
                        function (element) {
                            element.style.transform = 'translateY(1000px)';
                        }
                    );
                }, 1800);

                setTimeout(function () {
                    [].forEach.call(
                        branchSnow,
                        function (element) {
                            element.style.opacity = 1;
                        }
                    );

                    [].forEach.call(
                        bottomSnow,
                        function (element) {
                            element.style.opacity = 1;
                        }
                    );


                    [].forEach.call(
                        buds,
                        function (element) {
                            element.style.opacity = 0.4;
                        }
                    );

                    chart.update({
                        chart: {
                            backgroundColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0.4, '#34D399'],
                                    [1, '#047857']
                                ]
                            }
                        }
                    });

                    document.querySelector(
                        '.highcharts-title'
                    ).style.opacity = 1;


                }, 2000);

                setTimeout(function () {

                    chart.update({
                        plotOptions: {
                            areasplinerange: {
                                fillOpacity: 1
                            }
                        }
                    }, false);

                    chart.series[0].points[berryPoints[4]].update({
                        marker: {
                            radius: 10,
                            fillColor: '#DC2626'
                        }
                    }, false);

                    chart.series[14].points[1].update({
                        x: 14.3,
                        low: 12.9,
                        high: 13.6

                    }, false);

                    chart.series[15].points[1].update({
                        x: 10,
                        low: 12.9,
                        high: 13.3

                    }, false);

                    chart.series[16].points[1].update({
                        x: 7,
                        low: 10.7,
                        high: 11.4

                    }, false);

                    chart.series[17].points[1].update({
                        x: 10,
                        low: 11.2,
                        high: 11.8

                    }, false);

                    chart.yAxis[2].setExtremes(0, 0);

                    chart.redraw();

                    document.querySelector(
                        '.highcharts-subtitle'
                    ).style.opacity = 1;


                }, 2200);

            }
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        useHTML: true,
        text: '<div id="title">Wishing You A<br><span>Berry Bright</span> ' +
            'Holiday</div>',
        align: 'center',
        x: 0,
        y: 70
    },
    subtitle: {
        useHTML: true,
        text: '<div id="subtitle">From your friends at<br><img src="https://wp-assets.highcharts.com/svg/highcharts-logo.png"></div>',
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
    },
    tooltip: {
        backgroundColor: '#059669',
        style: {
            color: 'white'
        }
    },
    plotOptions: {
        series: {
            enableMouseTracking: true,
            dragDrop: {
                draggableX: {
                    enabled: true
                },
                draggableY: {
                    enabled: true
                }
            },
            animation: false,
            states: {
                inactive: {
                    enabled: false
                }
            }
        },
        line: {
            color: '#C8C7D1',
            linecap: 'square',
            lineWidth: 6,
            zIndex: 20,
            marker: {
                enabled: false,
                radius: 4
            },
            animation: {
                enabled: true,
                duration: 2000
            }
        },
        areasplinerange: {
            lineWidth: 0,
            color: '#fff',
            zIndex: 21,
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [
                    [0, '#ffffff'],
                    [1, '#f0f0f0']
                ]
            },
            fillOpacity: 1,
            animation: false
        },
        areaspline: {
            enableMouseTracking: true
        },
        scatter: {
            color: 'white',
            zIndex: 22,
            xAxis: 1,
            yAxis: 1,
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 6
            }
        }
    },
    xAxis: [{
        min: 0,
        max: 20,
        startOnTick: true,
        gridLineColor: '#10B981',
        gridLineWidth: 0,
        lineColor: '#E3E3E8',
        tickColor: '#E3E3E8',
        labels: {
            style: {
                color: '#E3E3E8'
            }
        }
    },
    {
        min: 0,
        max: 20,
        tickInterval: 1,
        startOnTick: true,
        visible: false
    }],
    yAxis: [{
        min: 0,
        max: 24,
        tickInterval: 1,
        gridLineColor: '#10B981',
        gridLineWidth: 0,
        visible: false
    },
    {
        min: -4,
        max: 20,
        reversed: true,
        tickInterval: 1,
        gridLineWidth: 0,
        visible: false
    },
    {
        min: 0,
        max: 200,
        startOnTick: true,
        tickInterval: 1,
        gridLineWidth: 0,
        visible: false
    },
    {
        min: 0,
        max: 34,
        tickInterval: 1,
        gridLineColor: '#10B981',
        gridLineWidth: 0,
        visible: false
    }],
    series: [
        // 0
        {
            name: 'branch 0',
            data: [
                {
                    x: 0,
                    y: 14
                },
                {
                    x: 5,
                    y: 12
                },
                {
                    x: 9,
                    y: 11.5
                },
                {
                    x: 13,
                    y: 12.7
                },

                {
                    x: 18,
                    y: 13.3,
                    marker: berry
                }
            ]
        },
        // 1
        {
            name: 'branch 1',
            data: [
                {
                    x: 6.93,
                    y: 11.76
                },
                {
                    x: 11,
                    y: 13.4
                },
                {
                    x: 13,
                    y: 15.7,
                    marker: berry
                }
            ]
        },
        // 2
        {
            name: 'branch 2',
            data: [
                {
                    x: 8.933,
                    y: 12.533
                },
                {
                    x: 10,
                    y: 14,
                    marker: berry
                }
            ]
        },
        // 3
        {
            name: 'branch 3',
            data: [
                {
                    x: 12,
                    y: 14.5
                },
                {
                    x: 14,
                    y: 15,
                    marker: berry
                }
            ]
        },
        // 4
        {
            name: 'branch 4',
            data: [
                {
                    x: 16,
                    y: 13.03
                },
                {
                    x: 19,
                    y: 15,
                    marker: berry
                }
            ]
        },
        // 5
        {
            name: 'branch 5',
            data: [
                {
                    x: 16.95,
                    y: 13.65
                },
                {
                    x: 18,
                    y: 15.2,
                    marker: berry
                }
            ]
        },
        // 6
        {
            name: 'branch 6',
            data: [
                {
                    x: 6,
                    y: 11.86
                },
                {
                    x: 8,
                    y: 9.5,
                    marker: berry
                }
            ]
        },
        // 7
        {
            name: 'branch 7',
            data: [
                {
                    x: 7,
                    y: 10.63
                },
                {
                    x: 9,
                    y: 9.8,
                    marker: berry
                }
            ]
        },
        // 8
        {
            name: 'branch 8',
            data: [
                {
                    x: 9,
                    y: 11.5
                },
                {
                    x: 13,
                    y: 10.5,
                    marker: berry
                }
            ]
        },
        // 9
        {
            name: 'branch 9',
            data: [
                {
                    x: 11,
                    y: 11
                },
                {
                    x: 13,
                    y: 11.2,
                    marker: berry
                }
            ]
        },
        // 10
        {
            name: 'branch 10',
            data: [
                {
                    x: 13,
                    y: 12.7
                },
                {
                    x: 16,
                    y: 11.7,
                    marker: berry
                }
            ]
        },
        // 11
        {
            name: 'branch 11',
            data: [
                {
                    x: 14,
                    y: 12.33
                },
                {
                    x: 15,
                    y: 11.2,
                    marker: berry
                }
            ]
        },
        // 12 scatter snow
        {
            name: 'snow flakes',
            enableMouseTracking: false,
            type: 'scatter',
            data: [
                { x: 17, y: 8 },
                { x: 8, y: 6 },
                { x: 20, y: 1 },
                { x: 2, y: 6 },
                { x: 16, y: 1 },
                { x: 16, y: 10 },
                { x: 2, y: 5 },
                { x: 16, y: 8 },
                { x: 17, y: 7 },
                { x: 7, y: 15 },
                { x: 5, y: 10 },
                { x: 12, y: 11 },
                { x: 3, y: 20 },
                { x: 5, y: 7 },
                { x: 3, y: 20 },
                { x: 18, y: 17 },
                { x: 17, y: 9 },
                { x: 4, y: 11 },
                { x: 14, y: 10 },
                { x: 11, y: 15 },
                { x: 9, y: 1 },
                { x: 10, y: 20 },
                { x: 17, y: 14 },
                { x: 16, y: 2 },
                { x: 3, y: 19 },
                { x: 0, y: 14 },
                { x: 18, y: 3 },
                { x: 0, y: 15 },
                { x: 1, y: 12 },
                { x: 12, y: 2 },
                { x: 20, y: 6 },
                { x: 7, y: 8 },
                { x: 18, y: 15 },
                { x: 2, y: 17 },
                { x: 6, y: 3 },
                { x: 11, y: 6 },
                { x: 11, y: 18 },
                { x: 3, y: 1 },
                { x: 0, y: 10 },
                { x: 2, y: 19 },
                { x: 2, y: 7 },
                { x: 8, y: 9 },
                { x: 19, y: 13 },
                { x: 3, y: 14 },
                { x: 19, y: 19 },
                { x: 1, y: 2 },
                { x: 11, y: 16 },
                { x: 2, y: 0 },
                { x: 10, y: 10 },
                { x: 18, y: 19 },
                { x: 2, y: 3 },
                { x: 3, y: 18 },
                { x: 20, y: 17 },
                { x: 1, y: 9 },
                { x: 13, y: 5 },
                { x: 14, y: 8 },
                { x: 18, y: 17 },
                { x: 16, y: 20 },
                { x: 13, y: 8 },
                { x: 8, y: 2 },
                { x: 19, y: 2 },
                { x: 19, y: 1 },
                { x: 13, y: 9 },
                { x: 10, y: 10 },
                { x: 1, y: 13 },
                { x: 13, y: 17 },
                { x: 18, y: 11 },
                { x: 5, y: 1 },
                { x: 3, y: 7 },
                { x: 19, y: 13 },
                { x: 5, y: 10 },
                { x: 16, y: 17 },
                { x: 1, y: 9 },
                { x: 6, y: 0 },
                { x: 6, y: 4 },
                { x: 12, y: 4 },
                { x: 13, y: 0 },
                { x: 1, y: 17 },
                { x: 18, y: 3 },
                { x: 19, y: 3 },
                { x: 18, y: 8 },
                { x: 3, y: 20 }
            ],
            xAxis: 1,
            yAxis: 1
        },
        // 13 scatter snow
        {
            name: 'snow flakes',
            enableMouseTracking: false,
            type: 'scatter',
            color: '#f0f0f0',
            data: [
                { x: 0, y: 6 },
                { x: 7, y: 15 },
                { x: 0, y: 7 },
                { x: 18, y: 9 },
                { x: 14, y: 13 },
                { x: 5, y: 6 },
                { x: 10, y: 14 },
                { x: 16, y: 19 },
                { x: 6, y: 16 },
                { x: 3, y: 10 },
                { x: 19, y: 13 },
                { x: 8, y: 11 },
                { x: 1, y: 15 },
                { x: 4, y: 10 },
                { x: 12, y: 12 },
                { x: 12, y: 19 },
                { x: 2, y: 8 },
                { x: 13, y: 19 },
                { x: 20, y: 1 },
                { x: 16, y: 20 },
                { x: 1, y: 1 },
                { x: 11, y: 12 },
                { x: 15, y: 4 },
                { x: 10, y: 7 },
                { x: 5, y: 0 },
                { x: 5, y: 6 },
                { x: 12, y: 9 },
                { x: 12, y: 10 },
                { x: 0, y: 9 },
                { x: 19, y: 17 },
                { x: 16, y: 6 },
                { x: 15, y: 18 },
                { x: 17, y: 14 },
                { x: 16, y: 13 },
                { x: 18, y: 7 },
                { x: 0, y: 3 },
                { x: 0, y: 9 },
                { x: 0, y: 10 },
                { x: 8, y: 14 },
                { x: 9, y: 7 },
                { x: 16, y: 6 }
            ]
        },
        // 14 arearange snow
        {
            name: 'snow',
            type: 'areasplinerange',
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 13,
                    low: 12.7,
                    high: 12.8
                },
                {
                    x: 14.3,
                    low: 12.9,
                    high: 13
                },
                {
                    x: 16,
                    low: 13,
                    high: 13.1
                }

            ]
        },
        // 15 arearange snow
        {
            name: 'snow',
            type: 'areasplinerange',
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 8.33,
                    low: 12.29,
                    high: 12.39
                },
                {
                    x: 10,
                    low: 12.9,
                    high: 13
                },
                {
                    x: 10.9,
                    low: 13.3,
                    high: 13.4
                }

            ]
        },
        // 16 arearange snow
        {
            name: 'snow',
            type: 'areasplinerange',
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 6.4,
                    low: 11.46,
                    high: 11.56
                },
                {
                    x: 7,
                    low: 10.7,
                    high: 10.8
                },
                {
                    x: 8,
                    low: 10.3,
                    high: 10.35
                }

            ]
        },
        // 17 arearange snow
        {
            name: 'snow',
            type: 'areasplinerange',
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 9,
                    low: 11.46,
                    high: 11.56
                },
                {
                    x: 10,
                    low: 11.2,
                    high: 11.3
                },
                {
                    x: 11,
                    low: 11,
                    high: 11.06
                }

            ]
        },
        // 18 scatter
        {
            type: 'scatter',
            name: 'berries',
            color: '#DC2626',
            opacity: 1,
            yAxis: 1,
            zIndex: 30,
            data: [
                {
                    x: 8,
                    y: 10.43
                },
                {
                    x: 9.1,
                    y: 10.13
                },
                {
                    x: 10.16,
                    y: 5.96
                },
                {
                    x: 13.12,
                    y: 4.23
                },
                {
                    x: 13.13,
                    y: 8.83
                },
                {
                    x: 13.1,
                    y: 9.6
                },
                {
                    x: 14.13,
                    y: 5
                },
                {
                    x: 15.1,
                    y: 8.83
                },
                {
                    x: 16.1,
                    y: 8.2
                },

                {
                    x: 18.06,
                    y: 6.7
                },
                {
                    x: 18.1,
                    y: 4.8
                },
                {
                    x: 19.03,
                    y: 4.96
                }
            ],
            marker: {
                enabled: true,
                radius: 4,
                symbol: 'circle',
                fillColor: '#FCA5A5'
            }
        },
        // 19 snow bank areaspline
        {
            name: 'fallen snow',
            type: 'areaspline',
            color: '#f5f5f5',
            fillOpacity: 1,
            yAxis: 2,
            zIndex: 1,
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 0,
                    y: 2
                },
                {
                    x: 14.1,
                    y: 2.42
                },
                {
                    x: 15.1,
                    y: 2.4
                },
                {
                    x: 20,
                    y: 2
                }
            ]
        }
    ]
});
