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

const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@32a8c3ea661ebe4bb3d5e1c62dc3dd1bc77451a9/samples/graphics/';

function showElements(elements) {
    [].forEach.call(
        elements,
        function (element) {
            element.style.opacity = 1;
        }
    );
}

function changeAngles(series, start, end) {
    series.update({
        startAngle: start,
        endAngle: end
    }, false);
}

function moveParticle(particle, x, y, duration) {

    [].forEach.call(
        particle,
        function (element) {
            element.style.opacity = 1;
            element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            element.style.transition = 'transform ' + duration;

        }
    );

}


const chart = {
    chart: {
        animation: {
            easing: 'linear',
            duration: 1000
        },
        margin: 0,
        spacing: 0,
        styledMode: true,
        events: {
            load: function () {
                const chart = this;
                const outerWedgeS = chart.series[27];
                const midWedgeS = chart.series[28];
                const topWedgeS = chart.series[29];
                const leftSideS = chart.series[20];
                const rightSideS = chart.series[21];
                const bigPieS = chart.series[22];
                const midPieS = chart.series[23];

                const outerWedgeDom = document.querySelectorAll('.outerwedge');
                const midWedgeDom = document.querySelectorAll('.midwedge');
                const topWedgeDom = document.querySelectorAll('.topwedge');
                const bigPieDom = document.querySelectorAll('.bigpie');
                const midPieDom = document.querySelectorAll('.midpie');
                const innerPieDom = document.querySelectorAll('.innerpie');
                const particle1 = document.querySelectorAll('.particle-1');
                const particle2 = document.querySelectorAll('.particle-2');
                const particle3 = document.querySelectorAll('.particle-3');
                const particle4 = document.querySelectorAll('.particle-4');
                const particle5 = document.querySelectorAll('.particle-5');
                const particle6 = document.querySelectorAll('.particle-6');


                // close in the sides
                leftSideS.data[1].update({
                    x: 10, low: 8, high: 8
                });
                rightSideS.data[1].update({
                    x: 10, low: 8, high: 8
                });

                // move the lines
                chart.yAxis[2].setExtremes(-8, 12);
                chart.yAxis[1].setExtremes(5, 25);

                // show top wedge
                setTimeout(function () {
                    showElements(topWedgeDom);
                }, 300);

                // show mid wedge
                setTimeout(function () {
                    showElements(midWedgeDom);
                }, 500);

                // show outer wedge
                setTimeout(function () {
                    showElements(outerWedgeDom);
                }, 700);

                // show bottom pies
                setTimeout(function () {
                    showElements(bigPieDom);
                    showElements(midPieDom);
                    showElements(innerPieDom);
                }, 1000);

                // set the wedge in motion
                setTimeout(function () {
                    changeAngles(outerWedgeS, 305, 390);
                    changeAngles(midWedgeS, 305, 390);
                    changeAngles(topWedgeS, 305, 390);
                    chart.redraw();
                }, 1200);

                setTimeout(function () {
                    rightSideS.update({
                        zIndex: 20
                    }, false);
                    chart.redraw();
                }, 1580);

                // moves the background pies
                // hide right wall
                setTimeout(function () {
                    changeAngles(bigPieS, -45, 316);
                    changeAngles(midPieS, -45, 316);
                }, 1590);

                // redraw
                setTimeout(function () {
                    chart.redraw();
                }, 1600);

                // particles
                setTimeout(function () {
                    moveParticle(particle1, 1200, -300, '4s');
                }, 1800);

                setTimeout(function () {
                    moveParticle(particle2, 1100, -100, '6s');
                    moveParticle(particle3, 1100, -50, '4s');
                }, 1900);

                setTimeout(function () {
                    moveParticle(particle4, 1000, -100, '6s');
                    moveParticle(particle5, 1600, -50, '2s');
                }, 2000);

                setTimeout(function () {
                    moveParticle(particle6, 1200, -400, '5s');
                }, 2100);
                // end particles

                // hide left wall
                setTimeout(function () {
                    leftSideS.update({
                        zIndex: 20
                    });
                }, 2200);

                // move wedge to final position
                setTimeout(function () {
                    changeAngles(outerWedgeS, 330, 410);
                    changeAngles(midWedgeS, 330, 410);
                    changeAngles(topWedgeS, 330, 410);
                    chart.redraw();
                }, 3220);


            }
        }
    },
    title: {
        text: ''
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            animation: false,
            marker: {
                enabled: false
            },
            dataLabels: {
                enabled: false
            },
            enableMouseTracking: false
        },
        scatter: {
            dragDrop: {
                draggableX: true,
                draggableY: true
            }
        }
    },
    xAxis: [
        // 0
        {
            min: 0,
            max: 20,
            visible: false,
            tickPositions: [0, 1, 2, 3, 4, 5, 6, 7,
                8, 9, 10, 11, 12, 13, 14,
                15, 16, 17, 18, 19, 20]
        },
        // 1
        {
            min: 0,
            max: 20,
            reversed: true,
            visible: false,
            tickPositions: [0, 1, 2, 3, 4, 5, 6, 7,
                8, 9, 10, 11, 12, 13, 14,
                15, 16, 17, 18, 19, 20]
        },
        // 2
        {
            min: 0,
            max: 20,
            visible: false,
            tickPositions: [0, 1, 2, 3, 4, 5, 6, 7,
                8, 9, 10, 11, 12, 13, 14,
                15, 16, 17, 18, 19, 20]
        }
    ],
    yAxis: [
        {
            min: -2,
            max: 18,
            gridZIndex: 1,
            gridLineColor: 'transparent',
            tickInterval: 1,
            startOnTick: false,
            endOnTick: false
        },
        // 1
        {
            min: -2,
            max: 18,
            gridZIndex: 1,
            gridLineColor: 'transparent',
            tickInterval: 1,
            startOnTick: false,
            endOnTick: false
        },
        // 2
        {
            min: -2,
            max: 18,
            gridZIndex: 1,
            gridLineColor: 'transparent',
            tickInterval: 1,
            startOnTick: false,
            endOnTick: false
        }
    ],
    series: [
        // 0 - 19 - lines
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: -1 }, { x: 20, y: -1 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 0 }, { x: 20, y: 0 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 1 }, { x: 20, y: 1 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 2 }, { x: 20, y: 2 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 3 }, { x: 20, y: 3 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 4 }, { x: 20, y: 4 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 5 }, { x: 20, y: 5 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 6 }, { x: 20, y: 6 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 7 }, { x: 20, y: 7 }]
        },
        {
            type: 'line',
            yAxis: 1,
            className: 'line',
            data: [{ x: 0, y: 8 }, { x: 20, y: 8 }]
        },

        // split
        // 10
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 9 }, { x: 20, y: 9 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 10 }, { x: 20, y: 10 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 11 }, { x: 20, y: 11 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 12 }, { x: 20, y: 12 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 13 }, { x: 20, y: 13 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 14 }, { x: 20, y: 14 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 15 }, { x: 20, y: 15 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 16 }, { x: 20, y: 16 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 17 }, { x: 20, y: 17 }]
        },
        {
            type: 'line',
            yAxis: 2,
            className: 'line',
            data: [{ x: 0, y: 18 }, { x: 20, y: 18 }]
        },


        // 20 - left side
        {
            type: 'arearange',
            className: 'cover',
            data: [
                { x: 0, low: -2, high: 18 },
                { x: 0,  low: 8, high: 8  }
            ],
            zIndex: 30

        },
        // 21 - right side
        {
            type: 'arearange',
            xAxis: 1,
            className: 'cover',
            data: [
                { x: 0, low: -2, high: 18 },
                { x: 0,  low: 8, high: 8  }
            ],
            zIndex: 30

        },
        // 22 - outer pie
        {
            type: 'pie',
            className: 'bigpie',
            data: [100],
            size: '55%',
            startAngle: -45,
            endAngle: 135,
            zIndex: 27
        },
        // 23 - middle pie
        {
            type: 'pie',
            className: 'midpie',
            data: [100],
            size: '30%',
            startAngle: -45,
            endAngle: 135,
            zIndex: 28
        },
        // 24 - little pie
        {
            type: 'pie',
            className: 'innerpie',
            data: [100],
            size: '10%',
            zIndex: 49
        },
        // 25 - arearange line cover
        {
            type: 'arearange',
            className: 'linecover',
            data: [
                { x: 0, low: 8, high: 8 },
                { x: 20,  low: 8, high: 8  }
            ],
            zIndex: 20

        },
        // 26 - white dot pie
        {
            type: 'pie',
            className: 'dot',
            data: [100],
            size: 4,
            zIndex: 84,
            visible: false
        },

        // 27 - outer purple wedge
        {
            type: 'pie',
            startAngle: -45,
            endAngle: 45,
            className: 'outerwedge',
            data: [100],
            size: '60%',
            zIndex: 80
        },
        // 28 - mid wedge
        {
            type: 'pie',
            startAngle: -45,
            endAngle: 45,
            className: 'midwedge',
            data: [100],
            size: '30%',
            zIndex: 81
        },
        // 29 - top wedge
        {
            type: 'pie',
            startAngle: -45,
            endAngle: 45,
            className: 'topwedge',
            data: [100],
            size: '10%',
            zIndex: 82
        },
        // 30 - particle 1
        {
            type: 'scatter',
            name: 'particle-1',
            animation: true,
            className: 'particle-1',
            data: [
                {
                    x: 10.96,
                    y: 8.28,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p1.svg)',
                        width: 39,
                        height: 57

                    }
                }
            ],
            zIndex: 130,
            visible: true
        },
        // 31 - particle 2
        {
            type: 'scatter',
            name: 'particle-2',
            animation: false,
            className: 'particle-2',
            data: [
                {
                    x: 10.2,
                    y: 9,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p2.svg)',
                        width: 22,
                        height: 41

                    }
                }
            ],
            zIndex: 130,
            visible: true
        },
        // 32 - particle 3
        {
            type: 'scatter',
            name: 'particle-3',
            animation: false,
            className: 'particle-3',
            data: [
                {
                    x: 10.6,
                    y: 8,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p3.svg)',
                        width: 23,
                        height: 34

                    }
                }
            ],
            zIndex: 30,
            visible: true
        },
        // 33 - particle 4
        {
            type: 'scatter',
            name: 'particle-4',
            animation: false,
            className: 'particle-4',
            data: [
                {
                    x: 10,
                    y: 8,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p4.svg)',
                        width: 27,
                        height: 18

                    }
                }
            ],
            zIndex: 30,
            visible: TextTrackCue
        },
        // 34 - particle 5
        {
            type: 'scatter',
            name: 'particle-5',
            animation: false,
            className: 'particle-5',
            data: [
                {
                    x: 10.56,
                    y: 8,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p5.svg)',
                        width: 34,
                        height: 50

                    }
                }
            ],
            zIndex: 30,
            visible: true
        },
        // 35 - particle 6
        {
            type: 'scatter',
            name: 'particle-6',
            animation: false,
            className: 'particle-6',
            data: [
                {
                    x: 10,
                    y: 8.1,
                    marker: {
                        enabled: true,
                        symbol: 'url(' + imgPath + 'p6.svg)',
                        width: 45,
                        height: 44

                    }
                }
            ],
            zIndex: 30,
            visible: true
        }]
};

Highcharts.chart('charts', chart);
