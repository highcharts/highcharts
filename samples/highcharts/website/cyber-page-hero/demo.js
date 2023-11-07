// Set the date you're counting down to
const countDownDate = new Date('2023-11-20T09:00:00').getTime();

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@e6ac32f5e1364993a9ae3322bebb9598ac147d02/samples/graphics/cyber-monday/';


/* shared gauge options */
const gaugeOptions = {

    chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        plotBackgroundColor: 'transparent',
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
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
    plotOptions: {
        solidgauge: {
            animation: false,
            innerRadius: '96%',
            dataLabels: {
                useHTML: true,
                style: {
                    textOutline: 'none'
                }
            }
        }
    },
    tooltip: {
        enabled: false
    },
    pane: {
        startAngle: 0,
        endAngle: 360,
        center: ['50%', '50%'],
        size: '100%'
    },
    yAxis: {
        tickPosition: 'inside',
        tickColor: 'transparent',
        reversed: true,
        tickLength: 3,
        tickWidth: 8,
        minorTickInterval: null,
        labels: {
            enabled: false
        },
        lineWidth: 0
    },
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 79
                },
                chartOptions: {
                    chart: {
                        margin: 4
                    },
                    caption: {
                        y: -10
                    },
                    pane: {
                        background: {
                            backgroundColor: '#000'
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: -28
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 80
                },
                chartOptions: {
                    chart: {
                        margin: 4
                    },
                    caption: {
                        y: -8
                    },
                    pane: {
                        background: {
                            backgroundColor: '#000'
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: -26
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 110
                },
                chartOptions: {
                    chart: {
                        margin: 4
                    },
                    caption: {
                        y: -3
                    },
                    pane: {
                        background: {
                            backgroundColor: '#000'
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: -32
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 120
                },
                chartOptions: {
                    chart: {
                        margin: 5
                    },
                    caption: {
                        y: -6
                    },
                    pane: {
                        background: {
                            backgroundColor: '#000'
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: -35
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 122
                },
                chartOptions: {
                    chart: {
                        margin: 5
                    },
                    caption: {
                        y: -6
                    },
                    pane: {
                        background: {
                            backgroundColor: '#000'
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: -45
                            }
                        }
                    }
                }
            }
        ]
    }

};

// countdown
function updateCountdown(type) {
    const now = new Date().getTime();

    // Set the date you're counting down to

    // Calculate the difference between now and the countdown date
    const distance = countDownDate - now;


    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the results
    // document.getElementById('days').textContent = days;
    // document.getElementById('hours').textContent = hours;
    // document.getElementById('minutes').textContent = minutes;
    // document.getElementById('seconds').textContent = seconds;

    // If the countdown is over, display some text
    if (distance < 0) {
        // clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = 'EVENT HAS STARTED!';
    }

    switch (type) {
    case 'seconds':
        return seconds;
    case 'minutes':
        return minutes;
    case 'hours':
        return hours;
    case 'days':
        return days;
    default:
        console.log('no time');
    }
}

// dataLabel html
function generateLabel(type) {

    const time = updateCountdown(type);

    const labelHTML = `
        <div class="time">
            <div>${time}</div>
        </div>
        `;
    // <p>${type}</p>
    return labelHTML;
}

function generateCaption(type) {
    return {
        text: type,
        align: 'center'
    };
}


function lightParticles() {

    [].forEach.call(document.querySelectorAll('.highcharts-series-7 image'), function (element) {
        element.style.opacity = '0.7';
        element.style.filter = 'saturate(2)';
        element.style.transition = '500ms';
    });
    setTimeout(function () {
        [].forEach.call(document.querySelectorAll('.highcharts-series-7 image'), function (element) {
            element.style.opacity = '0.3';
            element.style.filter = 'saturate(0.5)';
            element.style.transition = '500ms';
        });
    }, 200);

    setTimeout(function () {
        [].forEach.call(document.querySelectorAll('.highcharts-series-7 image'), function (element) {
            element.style.opacity = '0.7';
            element.style.filter = 'saturate(2)';
            element.style.transition = '500ms';
        });
    }, 600);

}

/* gauges */

Highcharts.chart('seconds', Highcharts.merge(gaugeOptions, {
    chart: {
        events: {
            load: function () {
                const chart = this;

                chart.series[1].points[0].update({
                    y: updateCountdown('seconds')
                });
                setInterval(() => {

                    chart.series[1].points[0].update({
                        y: updateCountdown('seconds')
                    }, false);

                    chart.series[1].update({
                        dataLabels: {
                            format: generateLabel('seconds')
                        }
                    }, false);

                    chart.redraw();
                }, 1000);
            }
        }
    },
    caption: generateCaption('seconds'),
    // the value axis
    yAxis: {
        min: 0,
        max: 60,
        tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        lineWidth: 0
    },
    series: [
        {
            name: 'Seconds base',
            data: [60],
            dataLabels: {
                enabled: false
            },
            dial: {
                backgroundColor: 'transparent'
            },
            pivot: {
                backgroundColor: 'transparent'
            }
        },
        {
            name: 'Seconds',
            data: [60 - updateCountdown('seconds')],
            dataLabels: {
                useHTML: true,
                format: generateLabel('seconds')
            },
            dial: {
                backgroundColor: 'transparent'
            },
            pivot: {
                backgroundColor: 'transparent'
            }

        }]

}));

Highcharts.chart('minutes', Highcharts.merge(gaugeOptions, {
    chart: {
        events: {
            load: function () {
                const chart = this;

                setInterval(() => {

                    chart.series[1].points[0].update({
                        y: updateCountdown('minutes')
                    }, false);

                    chart.series[1].update({
                        dataLabels: {
                            format: generateLabel('minutes')
                        }
                    }, false);

                    chart.redraw();
                }, 1000);

            }
        }
    },
    caption: generateCaption('minutes'),
    // the value axis
    yAxis: {
        min: 0,
        max: 60,
        tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        lineWidth: 0
    },
    tooltip: {
        enabled: false
    },
    series: [{
        name: 'Minutes base',
        data: [60],
        dataLabels: {
            enabled: false
        },
        dial: {
            backgroundColor: 'transparent'
        },
        pivot: {
            backgroundColor: 'transparent'
        }
    },
    {
        name: 'Minutes',
        data: [60 - updateCountdown('minutes')],
        tooltip: {
            valueSuffix: ' km/h'
        },
        dataLabels: {
            useHTML: true,
            format: generateLabel('minutes')
        },
        dial: {
            backgroundColor: 'transparent'
        },
        pivot: {
            backgroundColor: 'transparent'
        }
    }]
}));

Highcharts.chart('hours', Highcharts.merge(gaugeOptions, {
    chart: {
        events: {
            load: function () {
                const chart = this;

                setInterval(() => {

                    chart.series[1].points[0].update({
                        y: updateCountdown('hours')
                    }, false);

                    chart.series[1].update({
                        dataLabels: {
                            format: generateLabel('hours')
                        }
                    }, false);

                    chart.redraw();
                }, 1000);

            }
        }
    },
    caption: generateCaption('hours'),
    // the value axis
    yAxis: {
        min: 0,
        max: 24,
        tickWidth: 20,
        tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        lineWidth: 0
    },
    series: [{
        name: 'Hours base',
        data: [24],
        dataLabels: {
            enabled: false
        },
        dial: {
            backgroundColor: 'transparent'
        },
        pivot: {
            backgroundColor: 'transparent'
        }

    },
    {
        name: 'Hours',
        data: [24 - updateCountdown('hours')],
        dataLabels: {
            useHTML: true,
            format: generateLabel('hours')
        },
        dial: {
            backgroundColor: 'transparent'
        },
        pivot: {
            backgroundColor: 'transparent'
        }

    }]

}));

Highcharts.chart('days', Highcharts.merge(gaugeOptions, {
    chart: {
        events: {
            load: function () {
                const chart = this;

                setInterval(() => {

                    chart.series[1].points[0].update({
                        y: updateCountdown('days')
                    }, false);

                    chart.series[1].update({
                        dataLabels: {
                            format: generateLabel('days')
                        }
                    }, false);

                    chart.redraw();
                }, 1000);

            }
        }
    },
    caption: generateCaption('days'),
    yAxis: {
        min: 0,
        max: 59,
        tickPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        lineWidth: 0
    },
    series: [{
        name: 'Days base',
        data: [12],
        dataLabels: {
            enabled: false
        },
        dial: {
            backgroundColor: 'transparent'
        },
        pivot: {
            backgroundColor: 'transparent'
        }

    },
    {
        name: 'Days',
        data: [12 - updateCountdown('days')],
        dataLabels: {
            useHTML: true,
            format: generateLabel('days')
        },
        dial: {
            backgroundColor: 'transparent'
        },
        pivot: {
            backgroundColor: 'transparent'
        }

    }]

}));


/* Background animation */
let streaks;

function lightStreaks(num) {
    setTimeout(() => {
        streaks.series[num].update({
            opacity: 0.4
        });
        streaks.yAxis[num].setExtremes(0, 10, false);
    }, 100);
    setTimeout(() => {
        streaks.yAxis[num].setExtremes(-2000, 5, false);
        streaks.series[num].update({
            opacity: 0.4
        });
    }, 200);
    setTimeout(() => {
        streaks.series[num].update({
            opacity: 0
        });
    }, 400);
}

let streaksInterval = '';

Highcharts.chart('container', {
    chart: {
        backgroundColor: 'transparent',
        type: 'columnrange',
        inverted: true,
        animation: {
            easing: 'easeOutQuint',
            duration: 300
        },
        spacingLeft: 0,
        spacingRight: 0,
        margin: 0,
        spacing: [0, 0, 0, 0],
        events: {
            load: function () {
                const chart = this;
                streaks = chart;

                setTimeout(() => {
                    lightStreaks(1);
                    lightStreaks(6);
                }, 100);
                setTimeout(() => {
                    lightStreaks(2);
                    lightStreaks(4);
                }, 500);
                setTimeout(() => {
                    lightStreaks(3);
                    lightStreaks(5);
                }, 900);

                streaksInterval = setInterval(function () {
                    setTimeout(() => {
                        lightStreaks(1);
                        lightStreaks(6);
                    }, 100);
                    setTimeout(() => {
                        lightStreaks(2);
                        lightStreaks(4);
                    }, 500);
                    setTimeout(() => {
                        lightStreaks(3);
                        lightStreaks(5);
                    }, 900);
                }, 3000);


                // setTimeout(() => {

                // }, 1700);
                // setTimeout(() => {
                //     lightStreaks(6);
                // }, 2100);
            },
            redraw: function () {
                lightParticles();
            }
        }
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
    title: {
        text: null
    },
    plotOptions: {
        columnrange: {
            animation: false,
            enableMouseTracking: false,
            pointWidth: 10,
            borderRadius: '10px',
            color: '#8087E8',
            opacity: 0.4,
            borderWidth: 0
        }
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec'],
        gridLineColor: 'transparent'
    },
    {
        min: 0,
        max: 20,
        tickInterval: 1
    }],
    yAxis: [
        // 0
        {
            min: 0,
            max: 20,
            tickInterval: 1,
            startOnTick: false,
            gridLineColor: 'transparent'
        },
        // 1
        {
            min: 21,
            max: 1000,
            gridLineColor: 'transparent',
            visible: false
        },
        // 2
        {
            min: 21,
            max: 1000,
            gridLineColor: 'transparent',
            visible: false
        },
        // 3
        {
            min: 21,
            max: 1000,
            gridLineColor: 'transparent',
            visible: false
        },
        // 4
        {
            min: 21,
            max: 1000,
            gridLineColor: 'transparent',
            visible: false
        },
        // 5
        {
            min: 21,
            max: 1000,
            gridLineColor: 'transparent',
            visible: false
        },
        // 6
        {
            min: 21,
            max: 1000,
            gridLineColor: 'transparent',
            visible: false
        }
    ],
    series: [{
        borderWidth: 0,
        opacity: 0.2,
        data: [
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20],
            [0, 20]
        ]
    },
    {
        yAxis: 1,
        data: [
            [0, 0],
            [-100, 5]
        ]
    },
    {
        yAxis: 2,
        data: [
            [0, 0],
            [0, 0],
            [0, 0],
            [-100, 5]
        ]
    },
    {
        yAxis: 3,
        data: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [-100, 5]
        ]
    },
    {
        yAxis: 4,
        data: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [-100, 5]
        ]
    },
    {
        yAxis: 5,
        data: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [-100, 5]
        ]
    },
    {
        yAxis: 6,
        data: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [-100, 5],
            [0, 0]
        ]
    },
    {
        type: 'scatter',
        animation: false,
        enableMouseTracking: false,
        className: 'particles',
        color: 'transparent',
        xAxis: 1,
        yAxis: 0,
        data: [
            {
                x: 4,
                y: 1,
                marker: {
                    symbol: 'url(' + imgPath + 'p2-outline.svg)',
                    width: 38,
                    height: 30
                }
            },

            {
                x: 15,
                y: 3,
                marker: {
                    symbol: 'url(' + imgPath + 'p6-outline.svg)',
                    width: 58,
                    height: 45
                }
            },


            {
                x: 2,
                y: 6,
                marker: {
                    symbol: 'url(' + imgPath + 'p5-outline.svg)',
                    width: 42,
                    height: 60
                }
            },

            {
                x: 2,
                y: 12,
                marker: {
                    symbol: 'url(' + imgPath + 'p4-outline.svg)',
                    width: 27,
                    height: 50
                }
            },
            {
                x: 16,
                y: 16,
                marker: {
                    symbol: 'url(' + imgPath + 'p6b-outline.svg)',
                    width: 71,
                    height: 61
                }
            },
            {
                x: 5,
                y: 17,
                marker: {
                    symbol: 'url(' + imgPath + 'p1-outline.svg)',
                    width: 79,
                    height: 58
                }
            }
        ]
    }
    ]
});

function stopStreaks() {
    clearInterval(streaksInterval);
}

document.getElementById('stop').addEventListener('click', function () {
    stopStreaks();
});

/* html version of countdown */
// document.addEventListener('DOMContentLoaded', function () {
//     let countdownInterval = '';

//     function updateCountdown() {
//         const now = new Date().getTime();
//         // Calculate the difference between now and the countdown date
//         const distance = countDownDate - now;

//         // Time calculations for days, hours, minutes and seconds
//         const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//         const hours = Math.floor(
//             (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor(
// (distance % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//         // Display the results
//         document.getElementById('days2').textContent = days;
//         document.getElementById('hours2').textContent = hours;
//         document.getElementById('minutes2').textContent = minutes;
//         document.getElementById('seconds2').textContent = seconds;

//         // If the countdown is over, display some text
//         if (distance < 0) {
//             clearInterval(countdownInterval);
//             document.getElementById('countdown2').innerHTML = 'EVENT HAS STARTED!';
//         }
//     }
//     countdownInterval = setInterval(updateCountdown, 1000);

// });
