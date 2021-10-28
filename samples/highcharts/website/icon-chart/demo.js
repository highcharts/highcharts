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

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const countOffset = 2;
const  icebergLabels = [180, 160, 140, 120, 100, 80, 60, 40, 20,
    10, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180];


let done = false;

const charts = {
    chart: {
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
                const particles = document.getElementsByClassName('particles')[0];
                const cover = document.getElementsByClassName('cover')[0];
                const title = document.getElementsByClassName('highcharts-title')[0];
                const background = document.getElementsByClassName('highcharts-background')[0];
                const plotBackground = document.getElementsByClassName('highcharts-plot-background')[0];

                ///if reduced motion, hide the particles while they rotate
                if (reduced) {
                    particles.style.transition = 'none';
                    particles.style.opacity = 0;
                }
                ///attach individual 'berg' classes to each berg
                [].forEach.call(
                    document.querySelectorAll('.berg-depth'),
                    function (b, i) {
                        b.classList.add('berg-depth-' + i + '');
                    }
                );

                setTimeout(function () {
                    ///fade out the grid lines
                    [].forEach.call(
                        document.querySelectorAll('.highcharts-grid'),
                        g => g.classList.add('fade-out')
                    );
                    ///if reduced motion, keep the particles hidden
                    if (reduced) {
                        particles.style.opacity = 0;
                    }
                }, 200);

                setTimeout(function () {
                    ///if reduced motion, keep the particles hidden
                    if (reduced) {
                        particles.style.opacity = 0;
                    }
                    ///add rotate to the particles div
                    particles.classList.add('rotate');

                    ///add rotate classes to each individual particle
                    [].forEach.call(
                        document.querySelectorAll('.particle'),
                        p => p.classList.add('rotate')
                    );
                    ///update the left and right areas
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
                    ///update the top and bottom areas
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
                    ///if reduced motion, now show the particles
                    if (reduced) {
                        particles.style.opacity = 1;
                    }
                }, 1000);

                setTimeout(function () {
                    ///if reduced motion, hide the particles
                    if (reduced) {
                        particles.style.opacity = 0;
                    }
                    ///hides the lines, left and right areas, top area
                    for (let ii = 0; ii < 11; ++ii) {
                        chart.series[ii].hide();
                    }

                    ///updates the bottom area
                    chart.series[11].update({
                        data: [
                            { x: 0, low: -2, high: 8 },

                            { x: 20, low: -2, high: 8 }
                        ],
                        zIndex: 40
                    });
                    ///show y axis
                    chart.yAxis[0].update({
                        visible: true
                    });

                    ///make all the y axis lines invisible
                    [].forEach.call(
                        document.querySelectorAll('.highcharts-grid-line'),
                        function (g) {
                            g.style.stroke = 'transparent';
                        }
                    );

                    ///update the chart and plot background
                    cover.style.fill =  '#30426B';
                    background.style.fill = '#f0f0f0';
                    plotBackground.style.transition = 'fill 2s';
                    plotBackground.style.fill = '#f0f0f0';

                    ///add the iceberg class to each particle
                    [].forEach.call(
                        document.querySelectorAll('.particle'),
                        p => p.classList.add('iceberg')
                    );

                }, 5000);
                setTimeout(function () {

                    [].forEach.call(
                        document.querySelectorAll('.berg-label'),
                        function (l) {
                            l.style.stroke = 'transparent';
                        }
                    );

                    //add the clip class to each particle
                    ///clips off their bottoms
                    [].forEach.call(
                        document.querySelectorAll('.particle'),
                        p => p.classList.add('clip')
                    );
                    //show the iceberg series
                    for (let hh = 14; hh <= 22; ++hh) {
                        if (hh % 2 === 0) {
                            chart.series[hh].update({
                                visible: true
                            });
                        }
                    }
                    ///if reduced motion, show the particles
                    ///after they've transitioned into place
                    if (reduced) {
                        particles.style.transition = 'opacity 1s';
                        particles.style.opacity = 1;
                    }
                    particles.style.transition = 'opacity 300ms';
                    particles.style.opacity = 0;

                    ///icebergs' opacity
                    [].forEach.call(
                        document.querySelectorAll('#charts .berg-depth'),
                        function (elem) {
                            elem.style.opacity = 1;
                            elem.style.visibility = 'visible';
                        }
                    );

                    ///style the labels
                    [].forEach.call(
                        document.querySelectorAll('#charts .berg-label'),
                        function (elem) {
                            elem.style.opacity = 1;
                        }
                    );

                    ///for use in redraw function
                    done = true;


                }, 8500);

                setTimeout(function () {

                    ///show the title
                    title.style.opacity = 1;
                }, 9000);
                setTimeout(function () {
                    [].forEach.call(
                        document.querySelectorAll('#charts .iceberg-types'),
                        function (elem) {
                            elem.style.color = '#000';
                        }
                    );
                    //turn on tooltip
                    chart.update({
                        tooltip: {
                            enabled: true
                        }
                    });
                    particles.style.visiblity = 'hidden';


                }, 10000);
            },
            redraw: function () {
                const particles = document.getElementsByClassName('particles')[0];

                particles.style.visiblity = 'hidden';
                ///ensures that the added styles for the bergs stays in place
                [].forEach.call(
                    document.querySelectorAll('.berg-depth'),
                    function (b, i) {
                        b.classList.add('berg-depth-' + i + '');
                    }
                );
                const subtitle = document.querySelector('#charts .highcharts-subtitle .iceberg-subtitle');
                ///toggles the subtitle
                if (!done) {
                    subtitle.style.opacity = 0;
                } else {
                    subtitle.style.transition = "opacity 1s";
                    subtitle.style.opacity = 1;


                }

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
        y: 0

    },
    subtitle: {
        text: '<p class="iceberg-subtitle">Above-water characterization and distribution of icebergs in "Iceberg Alley," Newfoundland, Canada</p>',
        useHTML: true,
        floating: true
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
        tickPositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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
            return { x: 53, y: 1170 };
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
                            const subtitle = document.querySelector('#charts .highcharts-subtitle .iceberg-subtitle');
                            subtitle.style.transition = 'none';
                            subtitle.style.opacity = 0;
                        }
                    },
                    mouseOut: function () {
                        if (done) {
                            const subtitle = document.querySelector('#charts .highcharts-subtitle .iceberg-subtitle');
                            subtitle.style.transition = 'none';
                            subtitle.style.opacity = 1;
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
            }
        },
        pie: {
            animation: false
        },
        line: {

            animation: false,
            marker: {
                enabled: false,
                symbol: 'circle'

            },
            tooltip: {
                pointFormatter: function () {
                    return '';
                }
            }
        },
        arearange: {
            tooltip: {
                pointFormatter: function () {
                    return '';
                }
            }
        },
        scatter: {
            marker: {
                enabled: false
            },
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
                { x: 0.1, low: -2, high: 18 }


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
                { x: 0.1, low: -2, high: 18 }


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
        // 12- particles
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
            tooltip: {
                pointFormatter: function () {
                    return '';
                }
            },
            zIndex: 30,
            xAxis: 2,
            visible: true
        },
        //13 iceberg types
        {
            type: 'scatter',
            className: 'iceberg-typesX',
            xAxis: 2,
            marker: {
                enabled: false,
                radius: 1
            },
            // tooltip: {
            //     pointFormatter: function () {
            //         const texts = [
            //             `<p class="berg-tip"><span>
            //                 Pinnacle icebergs</span> have a
            //                 large central spire or pyramid of one
            //                 or more spires dominating the space.</p>`,
            //             `<p class="berg-tip">
            //                 <span>Tabular icebergs</span> are horizontal
            //                 and flat-topped
            //                 with a length/height ratio of 5:1 or more.</p>`,
            //             `<p class="berg-tip">
            //                 <span>Dry Dock icebergs</span> are
            //                 eroded such that large
            //                 U shape slot is formed with twin
            //                 columns or pinnacles.</p>`,
            //             `<p class="berg-tip">
            //                 <span>Dome icebergs</span> have large,
            //                 smooth, rounded tops.</p>`,
            //             `<p class="berg-tip">
            //                 <span>Wedge icebergs</span> are tabular
            //                 icebergs that have
            //                 altered their positions of stability so
            //                 that they now appear tilted.</p>`
            //         ];
            //         return texts[this.index];
            //     }
            // },
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
            visible: false
        },
        ///14 berg 1 bottom
        {
            type: 'line',
            name: 'berg-depth-1',
            className: 'berg-depth',
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
            marker: {
                enabled: false
            },
            data: [
                { x: 0.24, y: 8 },
                { x: 2.44, y: 0.64 },
                { x: 2.45, y: 8 }
            ]
        },
        ///15 berg 1 top
        {
            type: 'line',
            name: 'berg-depth-1-top',
            className: 'berg-depth',
            yAxis: 1,
            xAxis: 2,
            zIndex: 50,
            visible: true,
            marker: {
                enabled: false
            },
            data: [
                { x: 0.24, y: 8 },
                {
                    x: 2.44,
                    y: 0.64,
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        x: 25,
                        y: 50,
                        formatter: function () {
                            const htmlString =
                            `<div class="berg-label">
                                <p class="label-title" 
                                style="font-weight:700;">Pinnacle</p>
                                <p  class="label-percent">33%</p>
                            </div>`;
                            return htmlString;
                        }
                    }
                },
                { x: 2.45, y: 8 }
            ]
        },
        //16 berg-2 bottom
        {
            type: 'line',
            name: 'berg-depth-2',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            marker: {
                enabled: false
            },
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
        ///17 berg-2 top
        {
            type: 'line',
            name: 'berg-depth-2',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            yAxis: 1,
            visible: true,
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 4,
                    y: 8
                },
                {
                    x: 4.3,
                    y: 4.32,
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        x: 35,
                        y: 10,
                        formatter: function () {
                            const htmlString =
                            `<div class="berg-label">
                                <p class="label-title" 
                                style="font-weight:700;">Tabular</p>
                                <p  class="label-percent">23%</p>
                            </div>`;
                            return htmlString;
                        }
                    }
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
        //18 - berg 3 bottom
        {
            type: 'line',
            name: 'berg-depth-3',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            visible: false,

            marker: {
                enabled: false
            },
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
        //19 - berg 3 top
        {
            type: 'line',
            name: 'berg-depth-3',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            yAxis: 1,
            visible: true,
            marker: {
                enabled: false
            },
            data: [
                {
                    x: 8.3,
                    y: 8
                },
                {
                    x: 8.4,
                    y: 4.4,
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        x: 35,
                        y: 15,
                        formatter: function () {
                            const htmlString =
                            `<div class="berg-label">
                                <p class="label-title" 
                                style="font-weight:700;">Dry Dock</p>
                                <p  class="label-percent">19%</p>
                            </div>`;
                            return htmlString;
                        }
                    }
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
        //20 berg 4 bottom
        {
            type: 'line',
            name: 'berg-depth-4',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            marker: {
                enabled: false
            },
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
        //21 berg 4 top
        {
            type: 'line',
            name: 'berg-depth-4',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            yAxis: 1,
            visible: true,
            marker: {
                enabled: false
            },
            data: [{
                x: 12.5,
                y: 8
            },
            {
                x: 13.8,
                y: 5.3,
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    x: 5,
                    y: 0,
                    formatter: function () {
                        const htmlString =
                        `<div class="berg-label">
                            <p class="label-title" 
                            style="font-weight:700;">Dome</p>
                            <p  class="label-percent">15%</p>
                        </div>`;
                        return htmlString;
                    }
                }
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
        { //22 berg 5 bottom
            type: 'line',
            name: 'berg-depth-5',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            visible: false,
            marker: {
                enabled: false
            },
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
        },
        { //23 berg 5 top
            type: 'line',
            name: 'berg-depth-5',
            className: 'berg-depth',
            zIndex: 50,
            xAxis: 2,
            yAxis: 1,
            visible: true,
            marker: {
                enabled: false
            },
            data: [{
                x: 16.12,
                y: 8
            },
            {
                x: 16.32,
                y: 7.5,
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    x: 5,
                    y: -5,
                    formatter: function () {
                        const htmlString =
                        `<div class="berg-label">
                            <p class="label-title" 
                            style="font-weight:700;">Wedge</p>
                            <p  class="label-percent">10%</p>
                        </div>`;
                        return htmlString;
                    }
                }
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
                        return { x: 50, y: 155 };
                    }
                },
                subtitle: {
                    y: 200,
                    x: 0
                }
            }
        },
        {
            condition: {
                minWidth: 251,
                maxWidth: 300 ///up to 300
            },
            chartOptions: {
                tooltip: {
                    positioner: function () {
                        return { x: 50, y: 200 };
                    }
                },
                subtitle: {
                    y: 240,
                    x: 0
                }
            }
        },
        {
            condition: {
                minWidth: 301,
                maxWidth: 499
            },
            chartOptions: {
                tooltip: {
                    positioner: function () {
                        //return { x: 130, y: 365 };
                        return { x: 70, y: 265 };
                    }
                },
                subtitle: {
                    y: 280,
                    x: 20
                }
            }
        },
        {
            condition: {
                minWidth: 500
            },
            chartOptions: {
                tooltip: {
                    positioner: function () {
                        return { x: 105, y: 360 };
                    }
                },
                subtitle: {
                    y: 360,
                    x: 10
                }
            }
        }
        ]
    }
};

Highcharts.chart('charts', charts);
