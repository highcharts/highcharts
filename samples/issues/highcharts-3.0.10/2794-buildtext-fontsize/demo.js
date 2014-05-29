$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
        }]
    }, function (chart) {
        var r = chart.renderer,
            g = r.g().add();

        r.label('Regression caused').add(g);
        r.label('error in <br> wrapped text', 0, 20).add(g);

    });
});