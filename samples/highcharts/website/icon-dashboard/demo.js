const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@feb8baf043cffb5e141ab065f95b8ca397569297/samples/graphics/homepage/';

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

// const old = {

//     chart: {
//         backgroundColor: '#46465C',
//         animation: {
//             duration: 4000,
//             easing: 'easeOutQuint'
//         },
//         margin: [0, 0, 0, 0],
//         // margin: 30,
//         events: {
//             load: function () {
//                 const chart = this;
//                 const particles = chart.series[12].data;

//                 const squares = document.querySelectorAll('.squares .highcharts-point');

//                 setTimeout(function () {
//                     document.querySelector('.highcharts-markers.particles').style.opacity = 1;
//                     particles[0].update({
//                         x: 17,
//                         y: 13
//                     }, false);
//                     particles[2].update({
//                         x: 16,
//                         y: 11
//                     }, false);

//                     particles[1].update({
//                         x: 9,
//                         y: 13
//                     }, false);
//                     particles[5].update({
//                         x: 11,
//                         y: 11
//                     }, false);

//                     particles[4].update({
//                         x: 4,
//                         y: 13
//                     }, false);
//                     particles[3].update({
//                         x: 4,
//                         y: 11
//                     }, false);

//                     chart.series[11].update({
//                         endAngle: 90
//                     }, false);
//                     chart.redraw();
//                 }, 1000);

//                 setTimeout(function () {
//                     [].forEach.call(
//                         squares,
//                         function (s) {
//                             s.style.fill = '#f0f0f0';
//                         }
//                     );
//                 }, 1100);

//                 setTimeout(function () {
//                     chart.series[9].data[0].update({
//                         y: 12.1,
//                         x: 3.8
//                     }, false);
//                     chart.series[10].data[0].update({
//                         y: 11.7,
//                         x: 4.2
//                     }, false);

//                     chart.series[9].data[1].update({
//                         y: 12.1,
//                         x: 9.8
//                     }, false);
//                     chart.series[10].data[1].update({
//                         y: 11.7,
//                         x: 10.2
//                     }, false);

//                     chart.series[9].data[2].update({
//                         y: 12.1,
//                         x: 15.8
//                     }, false);
//                     chart.series[10].data[2].update({
//                         y: 11.7,
//                         x: 16.2
//                     }, false);

//                     chart.redraw();

//                 }, 1500);

//                 setTimeout(function () {
//                     [].forEach.call(
//                         document.getElementsByClassName('dial'),
//                         function (e) {
//                             e.style.opacity = 0;
//                         }
//                     );
//                 }, 1515);
//             }
//         }
//     },

//     title: {
//         text: ''
//     },
//     exporting: {
//         enabled: false
//     },
//     credits: {
//         enabled: false
//     },
//     legend: {
//         enabled: false
//     },
//     xAxis: [
//         {
//             min: 0,
//             max: 20,
//             gridLineColor: 'white',
//             gridLineWidth: 0,
//             gridZIndex: 30,
//             tickInterval: 1
//         }
//     ],
//     // the value axis
//     yAxis: [
//         {
//             min: -2,
//             max: 18,
//             gridZIndex: 20,
//             gridLineWidth: 0,
//             gridLineColor: 'white',
//             tickInterval: 1,
//             startOnTick: false,
//             endOnTick: false
//         }],
//     plotOptions: {
//         series: {
//             marker: {
//                 enabled: false
//             },
//             enableMouseTracking: false,
//             animation: false,
//             dataLabels: {
//                 enabled: false
//             }
//         },
//         line: {
//             zIndex: 12
//         },
//         pie: {
//             zIndex: 14,
//             borderWidth: 0,
//             size: '60%',
//             innerSize: '60%',
//             center: ['50%', '88%'],
//             startAngle: -90,
//             endAngle: 90
//         },
//         scatter: {
//             dragDrop: {
//                 draggableY: true,
//                 draggableX: true
//             },
//             marker: {
//                 enabled: true
//             }
//         }
//     },

//     series: [
//         // 0 - arearange bottom
//         {
//             type: 'arearange',
//             color: '#201836',
//             fillOpacity: 1,
//             data: [
//                 {
//                     x: 0,
//                     low: -2,
//                     high: 3
//                 },
//                 {
//                     x: 20,
//                     low: -2,
//                     high: 3
//                 }
//             ]
//         },
//         // 1 - white line
//         {
//             type: 'line',
//             color: '#fff',
//             data: [
//                 {
//                     y: -1,
//                     x: 0
//                 },
//                 {
//                     y: -1,
//                     x: 20
//                 }
//             ]
//         },
//         // 2 - white line
//         {
//             type: 'line',
//             color: '#fff',
//             data: [
//                 {
//                     y: 0,
//                     x: 0
//                 },
//                 {
//                     y: 0,
//                     x: 20
//                 }
//             ]
//         },
//         // 3 - white line
//         {
//             type: 'line',
//             color: '#fff',
//             data: [
//                 {
//                     y: 1,
//                     x: 0
//                 },
//                 {
//                     y: 1,
//                     x: 20
//                 }
//             ]
//         },
//         // 4 - white line
//         {
//             type: 'line',
//             color: '#fff',
//             data: [
//                 {
//                     y: 2,
//                     x: 0
//                 },
//                 {
//                     y: 2,
//                     x: 20
//                 }
//             ]
//         },
//         // 5 - pie fake gauge
//         {
//             name: 'Speed',
//             visible: true,
//             borderColor: '#a3edba',
//             borderWidth: 0,
//             type: 'pie',
//             data: [
//                 {
//                     y: 100,
//                     color: '#78758C'
//                 }

//             ]
//         },
//         // 6 - scatter - dial point 1
//         {
//             name: 'dial',
//             zIndex: 15,
//             className: 'dial',
//             type: 'scatter',
//             data: [{
//                 y: 10,
//                 x: 10
//             }],
//             dataLabels: {
//                 enabled: false
//             },
//             marker: {
//                 enabled: true,
//                 symbol: 'url(http://192.168.1.176:3030/dial-small.png)',
//                 width: 40,
//                 height: 80
//             }
//         },
//         // 7 - scatter - dial point 2
//         {
//             name: 'dial',
//             zIndex: 15,
//             className: 'dial2',
//             type: 'scatter',
//             data: [{
//                 y: 10,
//                 x: 10
//             }],
//             dataLabels: {
//                 enabled: false
//             },
//             marker: {
//                 enabled: true,
//                 symbol: 'url(http://192.168.1.176:3030/dial-small.png)',
//                 width: 40,
//                 height: 80
//             }
//         },
//         // 8 - pie - dial center
//         {
//             name: 'dials',
//             zIndex: 34,
//             type: 'pie',
//             startAngle: -180,
//             endAngle: 180,
//             animation: false,
//             opacity: 1,
//             borderWidth: 1,
//             borderColor: 'transparent',
//             center: ['50%', '90%'
//             ],
//             data: [{
//                 y: 100,

//                 color: '#78758C'
//             }],
//             size: '8%',
//             innerSize: '0%',
//             dataLabels: {
//                 enabled: false
//             }
//         },
//         // 9 scatter squares
//         {
//             type: 'scatter',
//             className: 'squares',
//             enableMouseTracking: false,
//             animation: false,
//             zIndex: 2,
//             data: [
//                 {
//                     y: 12,
//                     x: 4
//                 },
//                 {
//                     y: 12,
//                     x: 10
//                 },
//                 {
//                     y: 12,
//                     x: 16
//                 }
//             ],
//             marker: {
//                 enabled: true,
//                 symbol: 'square'
//             }
//         },
//         // 10 scatter squares
//         {
//             type: 'scatter',
//             visible: true,
//             className: 'squares2',
//             enableMouseTracking: false,
//             animation: false,
//             zIndex: 1,
//             data: [
//                 {
//                     y: 12,
//                     x: 4
//                 },
//                 {
//                     y: 12,
//                     x: 10
//                 },
//                 {
//                     y: 12,
//                     x: 16
//                 }
//             ],
//             marker: {
//                 enabled: true,
//                 symbol: 'square'
//             }
//         },
//         // 11 pie - fake gague fill
//         {
//             type: 'pie',
//             visible: true,
//             data: [{
//                 y: 100,
//                 color: '#8087E8'
//             }],
//             startAngle: -90,
//             endAngle: -89.9
//         },
//         // 12 scatter particles
//         {
//             type: 'scatter',
//             enableMouseTracking: false,
//             name: 'particles',
//             animation: false,
//             className: 'particles',
//             data: [
//                 {
//                     x: 0,
//                     y: 11,
//                     className: 'particle-1',
//                     marker: {
//                         enabled: true,
//                         symbol: 'url(' + imgPath + 'p1.svg)',
//                         width: 35,
//                         height: 60

//                     }
//                 },
//                 {
//                     x: 0.1,
//                     y: 12,
//                     className: 'particle-2',
//                     marker: {
//                         enabled: true,
//                         symbol: 'url(' + imgPath + 'p2.svg)',
//                         width: 23,
//                         height: 42
//                     }
//                 },
//                 {
//                     x: 0.11,
//                     y: 14,
//                     className: 'particle-3',
//                     marker: {
//                         enabled: true,
//                         symbol: 'url(' + imgPath + 'p3.svg)',
//                         width: 23,
//                         height: 34
//                     }
//                 },

//                 {
//                     x: 0.111,
//                     y: 10,
//                     className: 'particle-4',
//                     marker: {
//                         enabled: true,
//                         symbol: 'url(' + imgPath + 'p4.svg)',
//                         width: 27,
//                         height: 17
//                     }
//                 },
//                 {
//                     x: 0.1111,
//                     y: 10,
//                     className: 'particle-5',
//                     marker: {
//                         enabled: true,
//                         symbol: 'url(' + imgPath + 'p5.svg)',
//                         width: 35,
//                         height: 50
//                     }
//                 },
//                 {
//                     x: 0.11111,
//                     y: 10,
//                     className: 'particle-6',
//                     marker: {
//                         enabled: true,
//                         symbol: 'url(' + imgPath + 'p6.svg)',
//                         width: 45,
//                         height: 45
//                     }
//                 }
//             ],
//             zIndex: 10,
//             visible: true
//         }
//     ],
//     responsive: {
//         rules: [
//             {
//                 condition: {
//                     minWidth: 300
//                 },
//                 chartOptions: {
//                     plotOptions: {
//                         scatter: {
//                             marker: {
//                                 radius: 40
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 condition: {
//                     minWidth: 400
//                 },
//                 chartOptions: {
//                     plotOptions: {
//                         scatter: {
//                             marker: {
//                                 radius: 55
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 condition: {
//                     minWidth: 500
//                 },
//                 chartOptions: {
//                     plotOptions: {
//                         scatter: {
//                             marker: {
//                                 radius: 70
//                             }
//                         }
//                     }
//                 }
//             }
//         ]
//     }

// };

Highcharts.chart('container', {

    chart: {
        backgroundColor: '#201836',
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        margin: [0, 0, 0, 0],
        events: {
            load: function () {
                const chart = this;
                const particles = chart.series[20].data;

                setTimeout(function () {
                    particles[0].update({
                        x: 20,
                        y: 8
                    }, false);

                    let start = 14;
                    const end = 11;
                    let top = -1;
                    setInterval(function () {
                        // console.log(start, top);
                        if (start >= end) {
                            chart.series[start].update({
                                data: [{
                                    x: 0,
                                    y: top
                                },
                                {
                                    x: 20,
                                    y: top
                                }
                                ]
                            }, false);
                            start = start - 1;
                            top = top + 1;
                        }
                    }, 100);

                    chart.redraw();

                    document.querySelector('.highcharts-markers.particles').style.opacity = 1;

                }, 100);

                setTimeout(function () {
                    // lines
                    let start = 4;
                    const end = 10;
                    let top = 18;
                    setInterval(function () {
                        // console.log(start, top);
                        if (start <= end) {
                            chart.series[start].update({
                                opacity: 0,
                                data: [{
                                    x: 0,
                                    y: top
                                },
                                {
                                    x: 20,
                                    y: top
                                }
                                ]
                            }, false);
                            start = start + 1;
                            top = top - 1;
                        }
                    }, 100);

                    chart.series[15].update({
                        color: '#201836'
                    }, false);

                    // fake column covers
                    chart.series[21].update({
                        visible: false
                    }, false);
                    chart.series[22].update({
                        visible: false
                    }, false);
                    chart.series[23].update({
                        visible: false
                    }, false);


                    chart.redraw();

                }, 150);

                setTimeout(function () {
                    particles[2].update({
                        x: 20,
                        y: 8
                    });
                }, 200);

                setTimeout(function () {
                    particles[1].update({
                        x: 20,
                        y: 8
                    });
                }, 300);

                setTimeout(function () {
                    particles[5].update({
                        x: 20,
                        y: 8
                    });
                }, 400);

                setTimeout(function () {
                    particles[4].update({
                        x: 20,
                        y: 8
                    });
                }, 500);

                setTimeout(function () {
                    particles[3].update({
                        x: 20,
                        y: 8
                    });
                }, 600);

                setTimeout(function () {

                    particles[0].update({
                        x: 10,
                        y: 11,
                        visible: false
                    }, false);
                    particles[1].update({
                        visible: false,
                        x: 8,
                        y: 14
                    }, false);

                    particles[2].update({
                        visible: false,
                        x: 11,
                        y: 15
                    }, false);

                    chart.redraw();
                }, 700);


                setTimeout(function () {
                    particles[5].update({
                        visible: false,
                        x: 13,
                        y: 14
                    });
                }, 900);

                setTimeout(function () {
                    particles[4].update({
                        visible: false,
                        x: 10,
                        y: 15.2
                    }, false);
                    chart.series[28].update({
                        data: [
                            {
                                x: 0,
                                low: 2.1,
                                high: 3
                            },
                            {
                                x: 20,
                                low: 2.1,
                                high: 3
                            }
                        ]
                    }, false);
                    chart.series[26].update({
                        data: [
                            {
                                x: 0,
                                low: 9,
                                high: 10
                            },
                            {
                                x: 20,
                                low: 9,
                                high: 10
                            }
                        ]
                    }, false);

                    chart.series[25].update({
                        data: [
                            {
                                x: 0,
                                low: 16,
                                high: 20
                            },
                            {
                                x: 20,
                                low: 16,
                                high: 20
                            }
                        ]
                    }, false);

                    chart.redraw();
                }, 1000);

                setTimeout(function () {
                    particles[3].update({
                        visible: false,
                        x: 12,
                        y: 13
                    });
                }, 1100);


                setTimeout(function () {

                    chart.series[20].update({
                        zIndex: 4
                    }, false);


                    // fake columns
                    chart.series[16].update({
                        color: '#A3EDBA',
                        borderRadius: 10,
                        borderWidth: 1,
                        data: [{
                            x: 4.5,
                            low: 4,
                            high: 6
                        },
                        {
                            x: 6.5,
                            low: 4,
                            high: 6
                        }]
                    }, false);

                    chart.series[17].update({
                        color: '#A3EDBA',
                        data: [{
                            x: 7.5,
                            low: 4,
                            high: 7.5
                        },
                        {
                            x: 9.5,
                            low: 4,
                            high: 7.5
                        }]
                    }, false);

                    chart.series[18].update({
                        color: '#8087E8',
                        data: [{
                            x: 10.5,
                            low: 4,
                            high: 7
                        },
                        {
                            x: 12.5,
                            low: 4,
                            high: 7
                        }]
                    }, false);

                    chart.series[19].update({
                        color: '#A3EDBA',
                        data: [{
                            x: 13.5,
                            low: 4,
                            high: 8
                        },
                        {
                            x: 15.5,
                            low: 4,
                            high: 8
                        }]
                    }, false);

                    // main square
                    chart.series[15].update({
                        data: [
                            {
                                x: 3,
                                low: 3,
                                high: 9
                            },
                            {
                                x: 17,
                                low: 3,
                                high: 9
                            }
                        ]
                    }, false);

                    // bottom right square
                    chart.series[2].update({
                        data: [
                            {
                                x: 0,
                                low: -2,
                                high: 3
                            },
                            {
                                x: 0.1,
                                low: -2,
                                high: 3
                            }
                        ]
                    }, false);

                    chart.redraw();

                }, 1200);

                setTimeout(function () {


                    particles[0].update({
                        visible: true
                    }, false);
                    particles[1].update({
                        visible: true
                    }, false);
                    particles[2].update({
                        visible: true
                    }, false);
                    particles[3].update({
                        visible: true
                    }, false);
                    particles[4].update({
                        visible: true
                    }, false);
                    particles[5].update({
                        visible: true
                    }, false);

                    chart.series[3].update({
                        data: [
                            {
                                x: 0,
                                low: -2,
                                high: 3
                            },
                            {
                                x: 0.1,
                                low: -2,
                                high: 3
                            }
                        ]
                    }, false);

                    chart.series[0].update({
                        data: [
                            {
                                x: 0,
                                low: 2.2,
                                high: 20
                            },
                            {
                                x: 3,
                                low: 2.2,
                                high: 20
                            }
                        ]
                    }, false);

                    chart.series[1].update({
                        data: [
                            {
                                x: 0,
                                low: 2.2,
                                high: 20
                            },
                            {
                                x: 3,
                                low: 2.2,
                                high: 20
                            }
                        ]
                    }, false);

                    chart.redraw();

                }, 1600);

                setTimeout(function () {

                    particles[0].update({
                        x: 7.5,
                        y: 13.5
                    }, false);
                    particles[1].update({
                        x: 5.6,
                        y: 13.5
                    }, false);
                    particles[4].update({
                        x: 6.8,
                        y: 12.5
                    }, false);
                    particles[3].update({
                        x: 15,
                        y: 14
                    }, false);
                    particles[2].update({
                        x: 14,
                        y: 13
                    }, false);
                    particles[5].update({
                        x: 13,
                        y: 15
                    }, false);

                    chart.series[29].update({
                        visible: true
                    }, false);

                    chart.series[30].update({
                        visible: true
                    }, false);

                    chart.series[31].update({
                        visible: true
                    }, false);

                    chart.series[27].update({
                        data: [
                            {
                                x: 9.5,
                                low: 9,
                                high: 20
                            },
                            {
                                x: 10.5,
                                low: 9,
                                high: 20
                            }
                        ]
                    }, false);

                    chart.redraw();

                }, 2200);

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
    legend: {
        enabled: false
    },
    xAxis: [
        {
            min: 0,
            max: 20,
            gridLineColor: 'white',
            gridLineWidth: 0,
            gridZIndex: 30,
            tickInterval: 1
        },
        {
            min: 0,
            max: 20,
            reversed: true,
            gridLineColor: 'white',
            gridLineWidth: 0,
            gridZIndex: 30,
            tickInterval: 1
        }
    ],
    // the value axis
    yAxis: [
        {
            min: -2,
            max: 18,
            gridZIndex: 20,
            gridLineWidth: 0,
            gridLineColor: 'white',
            tickInterval: 1,
            startOnTick: false,
            endOnTick: false
        }],
    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            enableMouseTracking: false,
            animation: false,
            dataLabels: {
                enabled: false
            }
        },
        line: {
            visible: true,
            zIndex: 3,
            opacity: 0.5
        },
        scatter: {
            zIndex: 1,
            tooltip: {
                enabled: false
            },
            enableMouseTracking: false
        }
    },

    series: [
        // 0 - arearange top left
        {
            type: 'arearange',
            color: '#30426b',
            fillOpacity: 1,
            zIndex: 4,
            data: [
                {
                    x: 0,
                    low: 13,
                    high: 20
                },
                {
                    x: 10,
                    low: 13,
                    high: 20
                }
            ]
        },
        // 1 - arearange top right
        {
            type: 'arearange',
            color: '#30426b',
            xAxis: 1,
            zIndex: 4,
            fillOpacity: 1,
            data: [
                {
                    x: 0,
                    low: 13,
                    high: 20
                },
                {
                    x: 10,
                    low: 13,
                    high: 20
                }
            ]
        },
        // 2 - arearange bottom left
        {
            type: 'arearange',
            color: '#30426b',
            fillOpacity: 1,
            zIndex: 4,
            data: [
                {
                    x: 0,
                    low: -2,
                    high: 3
                },
                {
                    x: 10,
                    low: -2,
                    high: 3
                }
            ]
        },
        // 3 - arearange bottom right
        {
            type: 'arearange',
            color: '#30426b',
            zIndex: 4,
            fillOpacity: 1,
            xAxis: 1,
            data: [
                {
                    x: 0,
                    low: -2,
                    high: 3
                },
                {
                    x: 10,
                    low: -2,
                    high: 3
                }
            ]
        },

        // 4 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 13,
                    x: 0
                },
                {
                    y: 13,
                    x: 20
                }
            ]
        },
        // 5 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 12,
                    x: 0
                },
                {
                    y: 12,
                    x: 20
                }
            ]
        },
        // 6 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 11,
                    x: 0
                },
                {
                    y: 11,
                    x: 20
                }
            ]
        },
        // 7 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 10,
                    x: 0
                },
                {
                    y: 10,
                    x: 20
                }
            ]
        },
        // 8 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 9,
                    x: 0
                },
                {
                    y: 9,
                    x: 20
                }
            ]
        },
        // 9 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 8,
                    x: 0
                },
                {
                    y: 8,
                    x: 20
                }
            ]
        },
        // 10 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 7,
                    x: 0
                },
                {
                    y: 7,
                    x: 20
                }
            ]
        },
        // 11 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 6,
                    x: 0
                },
                {
                    y: 6,
                    x: 20
                }
            ]
        },
        // 12 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 5,
                    x: 0
                },
                {
                    y: 5,
                    x: 20
                }
            ]
        },
        // 13 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 4,
                    x: 0
                },
                {
                    y: 4,
                    x: 20
                }
            ]
        },
        // 14 - white line
        {
            type: 'line',
            color: '#fff',
            data: [
                {
                    y: 3,
                    x: 0
                },
                {
                    y: 3,
                    x: 20
                }
            ]
        },
        // 15 - arearange main square
        {
            type: 'arearange',
            visible: true,
            color: '#46465c',
            zIndex: 5,
            fillOpacity: 1,
            data: [
                {
                    x: 3,
                    low: 1,
                    high: 15
                },
                {
                    x: 17,
                    low: 1,
                    high: 15
                }
            ]
        },
        // 16 - arearange - fake column 1
        {
            type: 'arearange',
            color: '#201836',
            zIndex: 6,
            fillOpacity: 1,
            data: [
                {
                    x: 4.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 6.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 17 - arearange - fake column 2
        {
            type: 'arearange',
            color: '#201836',
            zIndex: 6,
            fillOpacity: 1,
            data: [
                {
                    x: 7.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 9.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 18 - arearange - fake column 3
        {
            type: 'arearange',
            color: '#201836',
            zIndex: 6,
            fillOpacity: 1,
            data: [
                {
                    x: 10.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 12.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 19 - arearange - fake column 4
        {
            type: 'arearange',
            color: '#201836',
            zIndex: 6,
            fillOpacity: 1,
            data: [
                {
                    x: 13.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 15.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 20 scatter particles
        {
            type: 'scatter',
            name: 'particles',
            animation: false,
            className: 'particles',
            dragDrop: {
                draggableY: true,
                draggableX: true
            },
            enableMouseTracking: true,
            data: [
                {
                    x: 0,
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
                    x: 0.1,
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
                    x: 0.11,
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
                    x: 0.111,
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
                    x: 0.1111,
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
                    x: 0.11111,
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
            visible: true
        },
        // 21 - arearange - cover 1
        {
            type: 'arearange',
            color: '#46465c',
            zIndex: 11,
            fillOpacity: 1,
            data: [
                {
                    x: 6.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 7.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 22 - arearange - cover 2
        {
            type: 'arearange',
            color: '#46465c',
            zIndex: 11,
            fillOpacity: 1,
            data: [
                {
                    x: 9.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 10.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 23 - arearange - cover 3
        {
            type: 'arearange',
            color: '#46465c',
            zIndex: 11,
            fillOpacity: 1,
            data: [
                {
                    x: 12.5,
                    low: 4,
                    high: 11
                },
                {
                    x: 13.5,
                    low: 4,
                    high: 11
                }
            ]
        },
        // 24 - arearange - cover 4
        {
            type: 'arearange',
            visible: false,
            color: '#201836',
            zIndex: 11,
            fillOpacity: 1,
            data: [
                {
                    x: 17,
                    low: 7.1,
                    high: 7.9
                },
                {
                    x: 20,
                    low: 7.1,
                    high: 7.9
                }
            ]
        },
        // 25 - arearange top left end cover
        {
            type: 'arearange',
            color: '#30426b',
            fillOpacity: 1,
            zIndex: 4,
            data: [
                {
                    x: 0,
                    low: 16,
                    high: 20
                },
                {
                    x: 0.1,
                    low: 16,
                    high: 20
                }
            ]
        },
        // 26 - arearange middle end cover
        {
            type: 'arearange',
            color: '#30426b',
            fillOpacity: 1,
            zIndex: 4,
            data: [
                {
                    x: 0,
                    low: 9,
                    high: 10
                },
                {
                    x: 0.1,
                    low: 9,
                    high: 10
                }
            ]
        },
        // 27 - arearange center end cover
        {
            type: 'arearange',
            color: '#30426b',
            fillOpacity: 1,
            zIndex: 4,
            data: [
                {
                    x: 9.5,
                    low: 19.9,
                    high: 20
                },
                {
                    x: 10.5,
                    low: 19.9,
                    high: 20
                }
            ]
        },
        // 28 - arearange center end cover
        {
            type: 'arearange',
            color: '#30426b',
            fillOpacity: 1,
            zIndex: 14,
            data: [
                {
                    x: 0,
                    low: 2.1,
                    high: 3
                },
                {
                    x: 0.1,
                    low: 2.1,
                    high: 3
                }
            ]
        },
        // 29 - donut
        {
            type: 'pie',
            visible: false,
            colors: ['#8085ef', '#a3edba'],
            size: '23%',
            borderWidth: 1,
            borderColor: '#201836',
            center: ['30%', '23%'],
            innerSize: '75%',
            data: [80, 20]
        },
        // 30 - area spline green
        {
            type: 'areaspline',
            visible: false,
            fillOpacity: 1,
            marker: {
                enabled: false,
                radius: 4
            },
            enableMouseTracking: false,
            color: '#a3edba',
            borderWidth: 0,
            data: [{
                x: 10.46,
                y: 11.68
            },
            {
                x: 11.24,
                y: 12.84

            },
            {
                x: 12.68,
                y: 11.24

            },
            {
                x: 14.48,
                y: 15.2

            },
            {
                x: 16.5,
                y: 12.92

            },
            {
                x: 17,
                y: 12.84

            }]
        },
        // 31 - area spline purple
        {
            type: 'areaspline',
            visible: false,
            dragDrop: {
                draggableY: true,
                draggableX: true
            },
            fillOpacity: 1,
            marker: {
                enabled: false,
                radius: 4
            },
            // enableMouseTracking: true,
            color: '#8085ef',
            borderWidth: 0,
            data: [{
                x: 10.46,
                y: 11.68
            },
            {
                x: 11.32,
                y: 11

            },
            {
                x: 12.44,
                y: 12.12

            },
            {
                x: 13.4,
                y: 13

            },
            {
                x: 15.26,
                y: 11.4

            },
            {
                x: 17,
                y: 11.76

            }]
        }


    ],
    responsive: {
        rules: [
            {
                condition: {
                    minWidth: 300
                },
                chartOptions: {
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 40
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 400
                },
                chartOptions: {
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 55
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 70
                            }
                        }
                    }
                }
            }
        ]
    }

});