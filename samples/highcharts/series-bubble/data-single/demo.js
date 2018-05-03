// Highcharts 3.0.10, Issue #2662
// Bubble chart gets truncated when x and y values are close to integral
Highcharts.chart('container', {
    chart: {
        type: 'bubble'
    },
    title: {
        text: 'Highcharts Bubbles'
    },
    series: [{
        data: [[2.3, 3.1, 1]]
    }]
});
