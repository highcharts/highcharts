Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};


const editor = function () {
    Highcharts.chart('editor',
        {
            chart: {
                animation: {
                    enabled: true,
                    duration: 4000,
                    easing: 'easeOutQuint'
                },
                styledMode: true,
                alignTicks: false,
                margin: 0,
                spacing: 0,
                events: {
                    load: function () {
                        const chart = this;
                        const water = chart.series[1];
                        const cover = chart.series[2];
                        const columns = chart.series[7];

                        setTimeout(function () {
                            water.update({
                                data: [
                                    {
                                        x: 4,
                                        low: 0,
                                        high: 15
                                    },
                                    {
                                        x: 16,
                                        low: 0,
                                        high: 15
                                    }
                                ]
                            }, false);

                            cover.update({
                                data: [
                                    {
                                        x: 0,
                                        low: 0,
                                        high: 4
                                    },
                                    {
                                        x: 20,
                                        low: 0,
                                        high: 4
                                    }
                                ]
                            }, false);

                            columns.data[0].update(8, false);
                            columns.data[1].update(5, false);
                            columns.data[2].update(7, false);

                            chart.yAxis[2].setExtremes(0, 18);

                            chart.redraw();
                        }, 1400);


                    }
                }
            },
            title: {
                text: null
            },
            xAxis: [{
                min: 0,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            },
            {
                min: 0,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            }],
            yAxis: [{
                min: 0,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            },
            {
                min: -3,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            },
            {
                min: 0,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            }],
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    opacity: 1,
                    accessibility: {
                        enabled: false
                    },
                    // dragDrop: {
                    //     draggableX: true,
                    //     draggableY: true
                    // },
                    animation: false,
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    enableMouseTracking: false,
                    states: {
                        hover: {
                            enabled: false
                        },
                        inactive: {
                            enabled: false
                        }
                    }
                },
                scatter: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        allowOverlap: true
                    }
                }
            },
            series: [
                // 0 bottom
                {
                    type: 'arearange',
                    className: 'bottom',
                    data: [
                        {
                            x: 0,
                            low: 0,
                            high: 10
                        },
                        {
                            x: 20,
                            low: 0,
                            high: 10
                        }
                    ]
                },
                // 1 water
                {
                    type: 'arearange',
                    className: 'water',
                    data: [
                        {
                            x: 4,
                            low: 0,
                            high: 10
                        },
                        {
                            x: 16,
                            low: 0,
                            high: 10
                        }
                    ]
                },
                // 2 water cover
                {
                    type: 'arearange',
                    className: 'bottom',
                    data: [
                        {
                            x: 0,
                            low: 0,
                            high: 0
                        },
                        {
                            x: 20,
                            low: 0,
                            high: 0
                        }
                    ]
                },
                // 3 bottom menu line
                {
                    type: 'line',
                    className: 'menu',
                    yAxis: 2,
                    data: [
                        {
                            x: 3,
                            y: 10.4
                        },
                        {
                            x: 6,
                            y: 10.4
                        }
                    ]
                },
                // 4 middle menu line
                {
                    type: 'line',
                    className: 'menu',
                    yAxis: 2,
                    data: [
                        {
                            x: 3,
                            y: 11.4
                        },
                        {
                            x: 6,
                            y: 11.4
                        }
                    ]
                },
                // 5 top menu line
                {
                    type: 'line',
                    className: 'menu',
                    yAxis: 2,
                    data: [
                        {
                            x: 3,
                            y: 12.4
                        },
                        {
                            x: 6,
                            y: 12.4
                        }
                    ]
                },
                // 6 scatter
                {
                    type: 'scatter',
                    data: [{
                        x: 7.44,
                        y: 20,
                        dataLabels: {
                            formatter: function () {
                                return `<div id="particle-3"
                                class="particle"></div>`;
                            }
                        }
                    },
                    {
                        x: 9.88,
                        y: 20,
                        dataLabels: {
                            formatter: function () {
                                return `<div id="particle-2"
                                class="particle"></div>`;
                            }
                        }
                    },
                    {
                        x: 10.84,
                        y: 20,
                        dataLabels: {
                            formatter: function () {
                                return `<div id="particle-6"
                                class="particle"></div>`;
                            }
                        }
                    },
                    {
                        x: 13.92,
                        y: 20,
                        dataLabels: {
                            formatter: function () {
                                return `<div id="particle-5"
                                class="particle"></div>`;
                            }
                        }
                    }]
                },
                // 7 columns
                {
                    type: 'column',
                    colorByPoint: 'true',
                    xAxis: 1,
                    yAxis: 1,
                    data: [
                        {
                            x: 6,
                            y: 0,
                            className: 'purple'
                        },
                        {
                            x: 10,
                            y: 0,
                            className: 'green'
                        },
                        {
                            x: 14,
                            y: 0,
                            className: 'purple'
                        }
                    ]
                }
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 380
                    },
                    chartOptions: {
                        plotOptions: {
                            column: {
                                pointWidth: 30,
                                pointPadding: 0,
                                groupPadding: 0
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 399
                    },
                    chartOptions: {
                        plotOptions: {
                            column: {
                                pointWidth: 50,
                                pointPadding: 0,
                                groupPadding: 0
                            }
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 499
                    },
                    chartOptions: {
                        plotOptions: {
                            column: {
                                pointWidth: 60,
                                pointPadding: 0,
                                groupPadding: 0
                            }
                        }
                    }
                }

                ]
            }
        }
    );
};

editor();
