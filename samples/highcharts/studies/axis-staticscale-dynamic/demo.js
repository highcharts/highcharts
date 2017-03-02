

var chart = Highcharts.chart('container', {

    chart: {
        backgroundColor: '#efe',
        inverted: true
    },

    title: {
        text: 'Dynamic chart with static scale'
    },

    xAxis: {
        staticScale: 24,
        tickInterval: true,
        title: {
            text: 'Depth (m)',
            align: 'high'
        }
    },

    series: [{
        name: 'Readings'
    }]

});

setInterval(function () {

    chart.series[0].addPoint(
        Math.random(),
        true, // redraw
        chart.series[0].points.length > 20 // shift if enough points
    );

}, 1000);
