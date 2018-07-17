
Highcharts.chart('container', {
    chart: {
        type: 'area',
        inverted: true
    },
    title: {
        text: 'Inverted chart, percent stack'
    },
    series: [{
        data: [null, 1, null, null],
        stacking: 'percent'
    }, {
        data: [null, 1, null, null],
        stacking: 'percent'
    }]
});