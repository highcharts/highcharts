// Create some data
var data = [];
for (var i = 0; i < 1000; ++i) {
    data.push([
        i / 100,
        Math.sin(i / 200) * 6 + Math.random() - 0.5
    ]);
}
// Some less dense data
data = data.concat([
    [11, 0],
    [11.5, null],
    [13, 2],
    [16, 3],
    [17, -1],
    [18, -5],
    [19, 1]
]);
var chart = Highcharts.chart('container', {
    title: {
        text: 'Drag slider to sonify'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: data
    }]
});
document.getElementById('slider').oninput = function () {
    chart.sonification.playSegment(this.value);
};
