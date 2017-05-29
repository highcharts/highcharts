
function getPoint(i) {
    return {
        name: new Date(Date.now() + i * 1000),
        y: Math.round(Math.random() * 10)
    };
}
var data = [];
var dataPoints = 5;
for (var i = 0; i < dataPoints; i++) {
    data.push(getPoint(i));
}
var chart = Highcharts.chart('container', {

    chart: {
        backgroundColor: '#efe'
    },

    yAxis: {
        staticScale: 24,
        tickInterval: 2
    },

    series: [{
        data: data
    }]

});

function add() {
    chart.series[0].addPoint(getPoint(i++), true, true);
}
$('#add').click(add);
