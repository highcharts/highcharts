/**
 * Easing function from https://github.com/danro/easing-js/blob/master/easing.js
 */
var easeOutBounce = function (pos) {
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

Math.easeOutBounce = easeOutBounce;



Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    xAxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 111],
        animation: {
            duration: 2000,
            // Uses Math.easeOutBounce
            easing: 'easeOutBounce'
        }
    }, {
        data: [29.9, 71.5, 106.4, 129.2, 111],
        animation: {
            duration: 1500,
            // Uses simple function
            easing: easeOutBounce
        }
    }]
});