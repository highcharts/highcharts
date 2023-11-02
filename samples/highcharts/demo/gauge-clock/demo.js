/**
 * Get the current time
 */
const getNow = () => {
    const now = new Date();

    return {
        date: now,
        hours: now.getHours() + now.getMinutes() / 60,
        minutes: now.getMinutes() * 12 / 60 + now.getSeconds() * 12 / 3600,
        seconds: now.getSeconds() * 12 / 60
    };
};

let now = getNow();

// Create the chart
Highcharts.chart('container', {

    chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '80%'
    },

    credits: {
        enabled: false
    },

    title: {
        text: 'The Highcharts clock'
    },

    pane: {
        background: [{
            // default background
        }, {
            // reflex for supported browsers
            backgroundColor: Highcharts.svg ? {
                radialGradient: {
                    cx: 0.5,
                    cy: -0.4,
                    r: 1.9
                },
                stops: [
                    [0.5, 'rgba(255, 255, 255, 0.2)'],
                    [0.5, 'rgba(200, 200, 200, 0.2)']
                ]
            } : null
        }]
    },

    yAxis: {
        labels: {
            distance: -23,
            style: {
                fontSize: '18px'
            }
        },
        min: 0,
        max: 12,
        lineWidth: 0,
        showFirstLabel: false,

        minorTickInterval: 'auto',
        minorTickWidth: 3,
        minorTickLength: 5,
        minorTickPosition: 'inside',
        minorGridLineWidth: 0,
        minorTickColor: '#666',

        tickInterval: 1,
        tickWidth: 4,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        title: {
            text: 'Powered by<br/>Highcharts',
            style: {
                color: '#BBB',
                fontWeight: 'normal',
                fontSize: '10px',
                lineHeight: '10px'
            },
            y: 10
        }
    },

    tooltip: {
        format: '{series.chart.tooltipText}'
    },

    series: [{
        data: [{
            id: 'hour',
            y: now.hours,
            dial: {
                radius: '60%',
                baseWidth: 4,
                baseLength: '95%',
                rearLength: 0
            }
        }, {
            id: 'minute',
            y: now.minutes,
            dial: {
                baseLength: '95%',
                rearLength: 0
            }
        }, {
            id: 'second',
            y: now.seconds,
            dial: {
                radius: '100%',
                baseWidth: 1,
                rearLength: '20%'
            }
        }],
        animation: false,
        dataLabels: {
            enabled: false
        }
    }]
},

// Move
function (chart) {
    setInterval(function () {

        now = getNow();

        if (chart.axes) { // not destroyed
            const hour = chart.get('hour'),
                minute = chart.get('minute'),
                second = chart.get('second');

            // Cache the tooltip text
            chart.tooltipText = Highcharts.dateFormat('%H:%M:%S', now.date);

            hour.update(now.hours, true, false);
            minute.update(now.minutes, true, false);

            // Move to 59 sec without animation ...
            if (now.seconds === 0) {
                second.update(-0.2, true, false);
            }
            // ... then bounce to next second
            second.update(now.seconds, true, {
                easing: 'easeOutBounce'
            });
        }

    }, 1000);

});

/**
 * Easing function from https://github.com/danro/easing-js/blob/master/easing.js
 */
Math.easeOutBounce = function (pos) {
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
