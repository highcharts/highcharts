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

const big = window.matchMedia("(min-width: 500px)").matches;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@feb8baf043cffb5e141ab065f95b8ca397569297/samples/graphics/homepage/';
const maps = {
    chart: {
        animation: {
            enabled: true,
            duration: 3000,
            easing: 'easeOutQuint'
        },
        styledMode:
        true,
        margin: 0,
        spacing: 0,
        plotBackgroundImage: 'bg.png',
        events: {
            load: function () {
                const chart = this;

                const updateData = function () {
                    chart.series[10].update({
                        data: [
                            { x: 4, y: 2 },
                            { x: 6, y: 7 },
                            { x: 10, y: 5 }
                        ]
                    });
                    chart.series[11].update({
                        data: [
                            { x: 4, y: 2 },
                            { x: 6, y: 7 },
                            { x: 10, y: 5 }
                        ]
                    });
                    chart.series[12].update({
                        data: [
                            { x: 4, y: 2 },
                            { x: 10, y: 5 },
                            { x: 16, y: 2 }
                        ]
                    });
                    chart.series[13].update({
                        data: [
                            { x: 6, y: 9 },
                            { x: 10, y: 11 },
                            { x: 14, y: 9 }
                        ]
                    });

                };

                const growEnvelope = function () {
                    $('.left').css({ transition: 'none' });
                    $('.right').css({ transition: 'none' });
                    chart.series[10].data[2].update({
                        x: 10, y: 5
                    });
                    chart.series[10].data[1].update({
                        x: 6
                    });
                    chart.series[11].data[2].update({
                        x: 10, y: 5
                    });
                    chart.series[11].data[1].update({
                        x: 6
                    });
                    chart.series[12].data[1].update({
                        x: 10, y: 5
                    });
                    chart.series[13].data[1].update({
                        x: 10, y: 11
                    });
                };

                if (reduced) {
                    updateData();
                }

                setTimeout(function () {
                    if (!reduced) {
                        growEnvelope();
                    }
                    if (big) {
                        $('.map-point-point').css({ transform: 'translate(-250px, -300px) scale(2)' });
                        $('.map-point-top').css({ transform: 'translate(-250px, -300px) scale(2)' });
                        $('.map-point-center').css({ transform: 'translate(-250px, -300px) scale(2)' });
                    } else {
                        $('.map-point-point').css({ transform: 'translate(-87px, -106px) scale(1.7)' });
                        $('.map-point-top').css({ transform: 'translate(14px, -11px) scale(.89)' });
                        $('.map-point-center').css({ transform: 'translate(0px, -25px) scale(1)' });
                    }

                }, 1000);

                setTimeout(function () {
                    $('.particle').css({ opacity: 0, transition: 'all 1s' });
                    $('.green').css({ opacity: 0, transition: 'all 1s' });
                    $('.left').css({ opacity: 0, transition: 'all 1s' });
                    $('.right').css({ opacity: 0, transition: 'all 1s' });

                }, 4000);

                setTimeout(function () {
                    $('.top').css({
                        opacity: 0,
                        transition: 'none'
                    });
                    if (reduced) {
                        $('.bottom').css({
                            opacity: 0
                        });
                    } else {
                        $('.bottom').css({
                            fill: '#45445d',
                            transition: 'fill  1s'
                        });
                    }
                    $('.map-point-point').css({ opacity: 0, transition: 'all 0s' });
                    $('.map-point-top').css({ opacity: 0, transition: 'all 0s' });
                    $('.map-point-center').css({ opacity: 0, transition: 'all 0s' });
                    $('.highcharts-plot-background').css({ fill: '#1f1836' });
                }, 4200);

                setTimeout(function () {
                    chart.update({
                        chart: {
                            animation: {
                                duration: 1000
                            }
                        }
                    });
                    if (!reduced) {
                        $('.bottom').css({ transform: 'translateY(4px)' });
                        chart.series[12].data[0].update({
                            y: 15.7
                        });
                        chart.series[12].data[1].update({
                            y: 15.7
                        });
                        chart.series[12].data[2].update({
                            y: 15.7
                        });
                    }
                }, 5000);

                setTimeout(function () {
                    if (!reduced) {
                        chart.series[12].data[2].update({
                            x: 19.68
                        });
                        chart.series[12].data[0].update({
                            x: 0.4
                        });
                    }

                }, 5700);


            }
        }
    },
    credits: {
        enabled: false
    },

    title: {
        text: ''
    },
    xAxis: [
        //0 - bottom, top map area
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1
        },
        //1 - left map area
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1
        },
        ///2 - right map area
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1,
            reversed: true
        },

        ///3 - for particle group 2
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1
        }],
    yAxis: [
        //0
        {
            min: -2,
            max: 18,
            gridZIndex: 20,
            gridLineColor: 'transparent',
            tickInterval: 1,
            startOnTick: false,
            endOnTick: false
        },
        ///1 - for the top map area
        {
            min: -2,
            max: 18,
            gridZIndex: 20,
            gridLineColor: 'transparent',
            tickInterval: 1,
            startOnTick: false,
            endOnTick: false,
            reversed: true
        }],
    legend: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    plotOptions: {
        series: {
            allowOverlap: true,
            opacity: 1,
            dataLabels: {
                enabled: false
            },
            marker: {
                enabled: false,
                allowOverlap: true
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
            animation: false
        }

    },
    series: [
        //0 - bottom line
        {
            type: 'line',
            className: 'transparent',
            data: [
                { x: 0, y: -1 },
                { x: 20, y: -1 }
            ],
            zIndex: 10

        },
        //1 - line
        {
            type: 'line',
            lineWidth: 1,
            className: 'transparent',
            data: [
                { x: 0, y: 0 },
                { x: 20, y: 0 }
            ],
            zIndex: 10
        },
        //2 - line
        {
            type: 'line',
            lineWidth: 1,
            className: 'transparent',
            data: [
                { x: 0, y: 1 },
                { x: 20, y: 1 }
            ],
            zIndex: 10
        },
        //3 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 2 },
                { x: 20, y: 2 }
            ],
            zIndex: 10

        },
        //4 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 3 },
                { x: 20, y: 3 }
            ],
            zIndex: 10

        },
        //5 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 4 },
                { x: 20, y: 4 }
            ],
            zIndex: 10
        },
        //6 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 5 },
                { x: 20, y: 5 }
            ],
            zIndex: 10

        },
        //7 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 6 },
                { x: 20, y: 6 }
            ],
            zIndex: 10
        },
        //8 - line
        {
            type: 'line',
            className: 'green',
            lineWidth: 1,
            data: [
                { x: 0, y: 7 },
                { x: 20, y: 7 }
            ],
            zIndex: 10
        },
        // 9 area - foreground-water
        {
            type: 'arearange',
            name: 'foreground',
            className: 'foreground',
            animation: false,
            data: [{ x: 0, low: -2, high: 8 }, { x: 20, low: -2, high: 8 }],
            zIndex: 4,
            visible: true
        },
        // 10 - left map
        {
            type: 'area',
            name: 'left',
            animation: false,
            className: 'left',
            data: [
                { x: 4, y: 2 },
                { x: 4, y: 7 },
                { x: 4, y: 2 }

            ],
            xAxis: 1,
            zoneAxis: 'y',
            zones: [{
                value: 2,
                color: 'transparent'
            }],
            zIndex: 15,
            visible: true
        },
        // 11 - right map
        {
            type: 'area',
            name: 'right',
            animation: false,
            className: 'right',
            xAxis: 2,
            data: [
                { x: 4, y: 2 },
                { x: 4, y: 7 },
                { x: 4, y: 2 }

            ],
            zoneAxis: 'y',
            zones: [{
                value: 2,
                color: 'transparent'
            }],
            zIndex: 15,
            visible: true
        },
        // 12 - bottom map
        {
            type: 'area',
            name: 'bottom',
            animation: false,
            className: 'bottom',

            data: [
                { x: 4, y: 2 },
                { x: 10, y: 2 },
                { x: 16, y: 2 }

            ],
            zoneAxis: 'y',
            zones: [{
                value: 2,
                color: 'transparent'
            }],
            zIndex: 15,
            visible: true
        },
        // 13 - top map
        {
            type: 'area',
            name: 'top',
            animation: false,
            className: 'top',

            data: [
                { x: 6, y: 9 },
                { x: 10, y: 9 },
                { x: 14, y: 9 }

            ],
            yAxis: 1,
            zoneAxis: 'y',
            zones: [{
                value: 9,
                color: 'transparent'
            }],
            zIndex: 15,
            visible: true
        },

        // 14 - map point top
        {
            type: 'scatter',
            name: 'map point top',
            animation: false,
            className: 'map-point-top',
            data: [
                {
                    x: 10,
                    y: 8.4, //11,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 37
                    }
                }
            ],
            zIndex: 15,
            xAxis: 1,
            visible: true
        },
        // 15 - map center
        {
            type: 'scatter',
            name: 'map point center',
            animation: false,
            className: 'map-point-center',
            data: [
                {
                    x: 10,
                    y: 8.44,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 14
                    }
                }
            ],
            zIndex: 19,
            xAxis: 1,
            visible: true
        },
        // 16 - map point point
        {
            type: 'area',
            name: 'map point',
            animation: false,
            className: 'map-point-point',
            data: [
                { x: 8.84, y: 8.48 },
                { x: 10, y: 10 },
                { x: 11.16, y: 8.52 }

            ],
            zoneAxis: 'y',
            zones: [{
                value: 7,
                color: 'transparent'
            }],
            zIndex: 18,
            marker: {
                enabled: false
            },
            yAxis: 1,
            visible: true
        },
        //17 - particles
        {
            type: 'scatter',
            name: 'particles',
            animation: false,
            className: 'particle',
            data: [
                {
                    x: 6.5,
                    y: 12.7,
                    className: 'particle-1',
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p1.svg)',
                        width: 25,
                        height: 35

                    }
                },
                {
                    x: 4.5,
                    y: 8.2,
                    className: 'particle-2',
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p2.svg)',
                        width: 30,
                        height: 45

                    }
                },
                {
                    x: 3,
                    y: 1.5,
                    className: 'particle-6',
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p6.svg)',
                        width: 45,
                        height: 45

                    }
                },
                {
                    x: 16.8,
                    y: 1.5,
                    className: 'particle-5',
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p5.svg)',
                        width: 35,
                        height: 50

                    }
                }
            ],
            zIndex: 30,
            xAxis: 2,
            visible: true
        }
    ]
};


const finalMap = function () {
    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json',
        function (data) {
            // Assign id's
            data.forEach(function (p) {
                p.id = p.code;
            });
            // Initiate the chart
            Highcharts.mapChart('maps', {
                chart: {
                    styledMode: (true),
                    animation: {
                        duration: 2000
                    },
                    events: {
                        load: function () {
                            const chart = this;
                            $('.highcharts-map-series').css({ opacity: 0 });
                            chart.mapZoom(0.01, 4540, -8600);
                            if (reduced) {
                                chart.mapZoom(10);
                            }
                            $('.highcharts-map-series').css({ opacity: 0 });
                            $('.highcharts-title').animate({ opacity: 1 }, 500);
                            $('.highcharts-subtitle').animate({ opacity: 1 }, 500);

                            setTimeout(function () {
                                $('.highcharts-map-series').animate({ opacity: '1' }, 1000);
                                if (!reduced) {
                                    chart.mapZoom(10);
                                }
                                chart.tooltip.refresh(
                                    [chart.series[0].points[143]]
                                );
                            }, 500);
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Zoom to point',
                    style: {
                        fontFamily: 'IBM Plex Sans',
                        color: '#fff'
                    }
                },
                exporting: {
                    enabled: false
                },
                legend: {
                    title: {
                        text: 'Population density per km²'
                    },
                    labelStyle: {
                        color: '#fff'

                    },

                    floating: true,
                    y: 20
                },
                colorAxis: {
                    min: 1,
                    max: 1000,
                    type: 'logarithmic',
                    maxColor: '#4455f2'
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom',
                        x: 5
                    }
                },
                tooltip: {
                    useHTML: true,
                    distance: -15,
                    formatter: function () {
                        const htmlString =
                        `<div class="tip-grid">
                        <div class="tip-content">
                            <div class="dot"></div>${this.point.name}
                        </div>
                        <i class="fas fa-caret-down tip-point"></i>
                        </div>
                        `;
                        return htmlString;
                    },
                    valueSuffix: '/km²'
                },
                series: [{
                    data: data,
                    mapData: Highcharts.maps['custom/world-highres'],
                    joinBy: ['iso-a2', 'code'],
                    name: 'Population density',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    events: {
                        click: function (e) {
                            e.point.zoomTo();
                        }
                    }

                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 250
                        },
                        chartOptions: {
                            subtitle: {
                                text: ''
                            },
                            chart: {
                                margin: [40, 1, 65, 0]
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 499
                        },
                        chartOptions: {
                            subtitle: {
                                text: 'Click a country to zoom to it. Use buttons below map for selected tests.'
                            },
                            chart: {
                                margin: [60, 1, 65, 0]
                            }

                        }
                    }]
                }
            });
        });
};

$(document).ready(function () {
    Highcharts.mapChart('maps', maps);
    let dtime = 6500;
    if (reduced) {
        dtime = 5500;
    }
    setTimeout(function () {
        finalMap();
    }, dtime);

});