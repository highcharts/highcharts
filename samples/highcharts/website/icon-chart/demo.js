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


const countOffset = 2;
const  icebergLabels = [180, 160, 140, 120, 100, 80, 60, 40, 20,
    10, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
let done = false;
const charts = {
    chart: {
        // width: 500,
        animation: {
            enabled: true,
            duration: 3000,
            easing: 'easeOutQuint'
        },
        styledMode: (true),
        margin: 0,
        spacing: 0,
        plotBackgroundImage: 'highcharts.png',
        events: {
            load: function () {
                const chart = this;

                $('.highcharts-grid').fadeOut(1500);

                setTimeout(function () {
                    $('.particles').addClass('rotate');
                    $('.particle').each(function () {
                        $(this).addClass('rotate');
                    });
                    chart.series[8].data[1].update({
                        x: 4,
                        low: 2,
                        high: 14
                    });

                    chart.series[9].data[1].update({
                        x: 4,
                        low: 2,
                        high: 14
                    });

                    chart.series[10].update({
                        data: [
                            { x: 0, low: -2, high: -2 },
                            { x: 4, low: -2, high: 2 },
                            { x: 20, low: -2, high: 2 }
                        ]
                    });
                    chart.series[11].update({
                        data: [
                            { x: 0, low: -2, high: -2 },
                            { x: 4, low: -2, high: 2 },
                            { x: 20, low: -2, high: 2 }
                        ]
                    });

                }, 500);

                setTimeout(function () {

                    for (let ii = 0; ii < 11; ++ii) {
                        chart.series[ii].hide();
                    }
                    chart.series[8].data[1].update({
                        x: 4,
                        low: 2,
                        high: 14
                    });

                    chart.series[9].data[1].update({
                        x: 4,
                        low: 2,
                        high: 14
                    });

                    chart.series[10].update({
                        data: [
                            { x: 0, low: -2, high: -2 },
                            { x: 4, low: -2, high: 2 },
                            { x: 20, low: -2, high: 2 }
                        ]
                    });
                    chart.series[11].update({
                        data: [
                            { x: 0, low: -2, high: 8 },

                            { x: 20, low: -2, high: 8 }
                        ],
                        zIndex: 40
                    });
                    chart.yAxis[0].update({
                        visible: true
                    });


                    done = true;
                    $('#charts .highcharts-grid-line').css({ stroke: 'transparent' });
                    $('.cover').css({ fill: '#30426B' });
                    $('.highcharts-background').css({ fill: '#f0f0f0' });
                    $('.highcharts-plot-background').css({ fill: '#f0f0f0', transition: 'fill 2s' });
                    $('.particle').each(function () {
                        $(this).addClass('iceberg');
                    });

                }, 5000);

                setTimeout(function () {
                    $('.particle').each(function () {
                        $(this).addClass('clip');
                    });
                    $('#charts .berg-depth').css({ opacity: 0.6 });
                    chart.series[13].update({
                        dataLabels: {
                            enabled: true
                        }
                    });

                    for (let ii = 1; ii <= 5; ++ii) {
                        $('#charts .berg-depth-' + ii + '').css({ opacity: 1 });
                    }
                    for (let hh = 14; hh <= 22; ++hh) {
                        if (hh % 2 === 0) {
                            chart.series[hh].update({
                                visible: true
                            });
                        }
                    }
                    $('#charts .highcharts-data-labels.iceberg-types').css({ color: '#000' });


                    chart.update({
                        tooltip: {
                            enabled: true
                        }
                    });

                    $('.highcharts-subtitle').css({ opacity: 1 });

                    $('#charts .highcharts-title').css({ opacity: 1 });
                }, 7500);
            }
        }
    },
    credits: {
        enabled: false
    },

    title: {
        text: 'Iceberg Topologies & Distribution',
        useHTML: true,
        floating: true,
        y: 10

    },
    subtitle: {
        text: '<p class="iceberg-subtitle">Above-water characterization and distribution of icebergs in "Iceberg Alley" in Newfoundland, Canada</p>',
        useHTML: true
    },
    xAxis: [
    //0 -
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1
        },
        //1 -
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1,
            reversed: true
        },
        ///2 - for particle group 1
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1
        },
        ///3 - for particle group 2
        {
            min: 0,
            max: 20,
            gridLineColor: 'transparent',
            tickInterval: 1
        }],
    yAxis: [{
        min: -2,
        max: 18,
        gridZIndex: 20,
        title: {
            text: 'Meters',
            x: -12,
            y: -75,
            rotation: 0
        },
        tickPositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        zIndex: 1,
        offset: -15,
        opposite: true,
        tickInterval: 1,
        startOnTick: false,
        endOnTick: false,
        labels: {
            useHTML: true,
            align: 'right',
            formatter: function () {
                const labelPos = this.pos;
                const index = labelPos + countOffset;
                const label = icebergLabels[index];
                let color = '#fff';
                if (labelPos > 7) {
                    color = '#000';
                }
                return `
                <p style="color:${color}">${label}</p>
              `;
            }
        },
        visible: false


    },
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
        enabled: false,
        hideDelay: 0,
        shared: true,
        useHTML: true,
        headerFormat: '',
        positioner: function () {
            //return { x: 130, y: 365 };
            return { x: 53, y: 170 };
        }
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            opacity: 1,
            dataLabels: {
                enabled: false,
                allowOverlap: true
            },
            marker: {
                enabled: false
            },
            point: {
                events: {
                    mouseOver: function () {
                        if (done) {
                            $('.highcharts-subtitle').css({ opacity: 0 });
                        }
                    },
                    mouseOut: function () {
                        if (done) {
                            $('.highcharts-subtitle').css({ opacity: 1 });
                        }
                    }
                }
            },
            states: {
                hover: {
                    enabled: false
                },
                inactive: {
                    enabled: false
                }
            },
            lineColor: 'transparent',
            dragDrop: {
                enabled: false,
                draggableX: true,
                draggableY: true,
                dragMaxX: 20,
                dragMinX: 0,
                dragMaxY: 18,
                dragMinY: 0
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
        //0 -  line
        {
            type: 'line',
            className: 'white-line',
            data: [
                { x: 0, y: -1 },
                { x: 20, y: -1 }
            ],
            zIndex: 23
        },
        //1 - line
        {
            type: 'line',
            className: 'white-line',
            lineWidth: 1,
            data: [
                { x: 0, y: 0 },
                { x: 20, y: 0 }
            ],
            zIndex: 23
        },
        //2 - line
        {
            type: 'line',
            lineWidth: 1,
            className: 'white-line',
            data: [
                { x: 0, y: 1 },
                { x: 20, y: 1 }
            ],
            zIndex: 23

        },
        //3 - line
        {
            type: 'line',
            className: 'white-line',
            lineWidth: 1,
            data: [
                { x: 0, y: 2 },
                { x: 20, y: 2 }
            ],
            zIndex: 23

        },
        //4 - line
        {
            type: 'line',
            className: 'white-line',
            data: [
                { x: 0, y: -1 },
                { x: 20, y: -1 }
            ],
            zIndex: 23,
            yAxis: 1
        },
        //5 - line
        {
            type: 'line',
            className: 'white-line',
            lineWidth: 1,
            data: [
                { x: 0, y: 0 },
                { x: 20, y: 0 }
            ],
            zIndex: 23,
            yAxis: 1
        },
        //6 - line
        {
            type: 'line',
            lineWidth: 1,
            className: 'white-line',
            data: [
                { x: 0, y: 1 },
                { x: 20, y: 1 }
            ],
            zIndex: 23,
            yAxis: 1

        },
        //7 - line
        {
            type: 'line',
            className: 'white-line',
            lineWidth: 1,
            data: [
                { x: 0, y: 2 },
                { x: 20, y: 2 }
            ],
            zIndex: 23,
            yAxis: 1
        },
        // 8 - left wall
        {
            type: 'arearange',
            name: 'left-wall',
            animation: false,
            className: 'wall',
            data: [
                { x: 0, low: -2, high: 18 },
                { x: 0, low: -2, high: 18 }


            ],
            zIndex: 24,
            visible: true
        },
        // 9 - right wall
        {
            type: 'arearange',
            name: 'right-wall',
            animation: false,
            className: 'wall',
            data: [
                { x: 0, low: -2, high: 18 },
                { x: 0, low: -2, high: 18 }


            ],
            xAxis: 1,
            zIndex: 24,
            visible: true
        },
        // 10 - top area
        {
            type: 'arearange',
            name: 'top',
            animation: false,
            className: 'cover',
            data: [
                { x: 0, low: -2, high: -2 },
                { x: 4, low: -2, high: -2 },
                { x: 20, low: -2, high: -2 }
            ],
            zIndex: 22,
            visible: true,
            yAxis: 1
        },
        // 11 - bottom area water
        {
            type: 'arearange',
            name: 'bottom',
            tooltip: {
                pointFormatter: function () {
                    return '';
                }
            },
            animation: false,
            className: 'cover',
            data: [
                { x: 0, low: -2, high: -2 },
                { x: 4, low: -2, high: -2 },
                { x: 20, low: -2, high: -2 }
            ],
            zIndex: 22,
            visible: true

        },
        // 12- particle 1
        {
            type: 'scatter',
            name: 'particle-1',
            animation: false,
            className: 'particle',
            /*  x:7.46,
              y:4.06,*/
            data: [
                {
                    x: 12.26,
                    y: 11.1,
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true,
                        useHTML: true,
                        formatter: function () {
                            return `<div class="particles">
                                <div class="particle" id="particle-1" ></div>
                                <div class="particle" id="particle-2" ></div>
                                <div class="particle" id="particle-3" ></div>
                                <div class="particle" id="particle-4" ></div>
                                <div class="particle" id="particle-5" ></div>
                                <div class="particle" id="particle-6" ></div>
                            </div>`;
                        }
                    }
                }
            ],
            zIndex: 30,
            xAxis: 2,
            visible: true
        },
        //13 iceberg types
        {
            type: 'scatter',
            className: 'iceberg-types',
            xAxis: 2,
            dataLabels: {
                enabled: false,
                useHTML: true,
                formatter: function () {
                    const percentages = [33, 23, 19, 15, 10];
                    const texts = ['Pinnacle', 'Tabular', 'Dry Dock', 'Dome', 'Wedge'];
                    ///top, left, p1 left margin, p2 top margin, p2 left margin
                    let positions = [
                        [-100, -20, 32, -18, 40],
                        [20, -5, -10, -17, 0],
                        [20, -6, -10, -17, 0],
                        [25, 4, -10, -18, -6],
                        [27, -5, 0, -18, 4]
                    ];
                    if (big) {
                        positions = [
                            [-180, 0, 32, -18, 40],
                            [30, -5, -10, -17, -2],
                            [40, -6, -10, -17, -2],
                            [35, 8, -10, -20, -10],
                            [60, 0, 0, -20, 6]
                        ];
                    }


                    const text = texts[this.point.index];
                    const top = positions[this.point.index][0];
                    const left = positions[this.point.index][1];
                    const p1MarginLeft = positions[this.point.index][2];
                    const p2MarginTop = positions[this.point.index][3];
                    const p2MarginLeft = positions[this.point.index][4];
                    const percent = percentages[this.point.index];
                    const htmlString = `
                    <div style="position:absolute;z-index:100;
                        top:${top}px;left:${left}px;
                        width:50px;height:50px">
                            <p class="label-title" style="font-weight:700;
                            margin-left:${p1MarginLeft}px">${text}</p>
                            <p  class="label-percent" 
                            style="margin-top:${p2MarginTop}px;
                            margin-left:${p2MarginLeft}px">${percent}%</p>
                        </div>
                        `;
                    return htmlString;
                }
            },
            tooltip: {
                pointFormatter: function () {
                    const texts = [
                        `<p class="berg-tip"><span>
                            Pinnacle icebergs</span> have a 
                            large central spire or pyramid of one 
                            or more spires dominating the space.</p>`,
                        `<p class="berg-tip">
                            <span>Tabular icebergs</span> are horizontal 
                            and flat-topped 
                            with a length/height ratio of 5:1 or more.</p>`,
                        `<p class="berg-tip">
                            <span>Dry Dock icebergs</span> are 
                            eroded such that large 
                            U shape slot is formed with twin 
                            columns or pinnacles.</p>`,
                        `<p class="berg-tip">
                            <span>Dome icebergs</span> have large, 
                            smooth, rounded tops.</p>`,
                        `<p class="berg-tip">
                            <span>Wedge icebergs</span> are tabular 
                            icebergs that have
                            altered their positions of stability so 
                            that they now appear tilted.</p>`
                    ];
                    return texts[this.index];
                }
            },
            data: [
                {
                    x: 1,
                    y: 6
                },
                {
                    x: 5,
                    y: 12

                },
                {
                    x: 9.5,
                    y: 13

                },
                {
                    x: 13,
                    y: 13

                },
                {
                    x: 16,
                    y: 13

                }
            ],
            zIndex: 150,
            visible: true
        },
        ///14 berg 1 bottom
        {
            type: 'line',
            name: 'berg-depth-1',
            className: 'berg-depth-1',
            tooltip: {
                pointFormatter: function () {
                    if (done) {
                        return `<p class="berg-tip">
                                <span>
                                Pinnacle icebergs</span> have a 
                                large central spire or pyramid of one or more 
                                spires dominating the space.</p>`;
                    }
                }
            },
            xAxis: 2,
            zIndex: 50,
            visible: false,
            data: [
                { x: 0.24, y: 8 },
                { x: 2.88, y: 0.64 },
                { x: 2.44, y: 8 }
            ]
        },
        {}, //15 empty
        //16 berg-2 bottom
        {
            type: 'line',
            name: 'berg-depth-2',
            className: 'berg-depth-2',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            tooltip: {
                pointFormatter: function () {
                    if (done) {
                        return `<p class="berg-tip">
                                <span>Tabular icebergs</span> are 
                                horizontal and flat-topped 
                                with a length/height ratio of 5:1 or more.</p>`;
                    }
                }
            },
            data: [
                {
                    x: 4,
                    y: 8
                },
                {
                    x: 4.3,
                    y: 4.32
                },
                {
                    x: 6,
                    y: 5.3
                },
                {
                    x: 6.72,
                    y: 8
                }
            ]
        },
        {}, //17 - empty
        //18 - berg 3 bottom
        {
            type: 'line',
            name: 'berg-depth-3',
            className: 'berg-depth-3',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            tooltip: {
                pointFormatter: function () {
                    if (done) {
                        return `<p class="berg-tip">
                    <span>Dry Dock icebergs</span> are eroded such that large 
                    U shape slot is formed with twin columns or pinnacles.</p>`;
                    }
                }
            },
            data: [
                {
                    x: 8.3,
                    y: 8
                },
                {
                    x: 8.4,
                    y: 4.4
                },
                {
                    x: 9.3,
                    y: 7
                },
                {
                    x: 10.5,
                    y: 5.8
                },
                {
                    x: 11.24,
                    y: 8
                }
            ]
        },
        {}, //19 empty series
        //20 berg 4 bottom
        {
            type: 'line',
            name: 'berg-depth-4',
            className: 'berg-depth-4',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            tooltip: {
                pointFormatter: function () {
                    return `<p class="berg-tip">
                            <span>Dome icebergs</span> have large, 
                            smooth, rounded tops.</p>`;
                }
            },
            data: [{
                x: 12.5,
                y: 8
            },
            {
                x: 13.8,
                y: 5.3
            },
            {
                x: 14,
                y: 5.2
            },
            {
                x: 14.2,
                y: 5.3
            },
            {
                x: 14.8,
                y: 8
            }
            ]
        },
        {}, //21 empty series
        { //22 berg 5 bottom
            type: 'line',
            name: 'berg-depth-5',
            className: 'berg-depth-5',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            tooltip: {
                pointFormatter: function () {
                    if (done) {
                        return `<p class="berg-tip">
                                <span>Wedge icebergs</span> are tabular 
                                icebergs that have
                                altered their positions of stability so 
                                that they now appear tilted.</p>`;
                    }
                }
            },
            data: [{
                x: 16.12,
                y: 8
            },
            {
                x: 16.32,
                y: 7.5
            },
            {
                x: 17.27,
                y: 8
            }]
        }
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 250
            },
            chartOptions: {
                tooltip: {
                    positioner: function () {
                        //return { x: 130, y: 365 };
                        return { x: 53, y: 170 };
                    }
                },
                subtitle: {
                    y: 210,
                    x: 10
                }
            }
        },
        {
            condition: {
                minWidth: 499
            },
            chartOptions: {

                tooltip: {
                    positioner: function () {
                        return { x: 125, y: 360 };
                    }
                },
                subtitle: {
                    y: 360,
                    x: 30
                }
            }
        }]
    }
};

Highcharts.chart('charts', charts);
