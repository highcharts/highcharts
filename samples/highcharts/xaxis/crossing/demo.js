// Create an array with data from y = 1 / x
const data = [];
for (let x = -6; x < 6; x += 0.01) {
    // Note: Push y = null for x = 0
    data.push([
        x, Math.round(x * 100) ? 1 / x : null
    ]);
}

Highcharts.chart('container', {

    chart: {
        height: '100%'
    },

    title: {
        text: 'Axes crossing at 0'
    },

    xAxis: {
        min: -6,
        max: 6,
        gridLineWidth: 1,
        crossing: 0
    },

    yAxis: {
        min: -6,
        max: 6,
        crossing: 0,
        lineWidth: 1,
        title: {
            text: null
        }
    },

    tooltip: {
        headerFormat: '',
        pointFormat: 'x = {point.x:.2f}<br>y = {point.y:.2f}'
    },

    series: [{
        data,
        name: 'Function plot'
    }]

});