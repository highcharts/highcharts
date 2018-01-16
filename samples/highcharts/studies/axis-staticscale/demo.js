
function getPoint(i) {
    return {
        name: Date.UTC(2018, 0, 1) + i * 1000,
        y: Math.random()
    };
}
var data = [];
var dataPoints = 20;
for (var i = 0; i < dataPoints; i++) {
    data.push(getPoint(i));
}
var chart = Highcharts.chart('container', {

    chart: {
        backgroundColor: '#efe'
    },

    xAxis: {
        staticScale: 24,
        minRange: 1,
        categories: true
    },

    series: [{
        data: data,
        type: 'bar'
    }]

});

$('#add').click(function () {
    chart.series[0].addPoint(getPoint(i++));
});
$('#remove').click(function () {
    chart.series[0].removePoint(0);
});
