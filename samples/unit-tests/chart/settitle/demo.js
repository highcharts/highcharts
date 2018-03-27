QUnit.test('Chart setTitle', function (assert) {

    var chart = Highcharts.chart('container', {
        title: {
            text: 'Head Count Terminations<br> It overlaps chart'
        },
        subtitle: {
            text: 'Source: <br><a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
        },
        legend: {
            verticalAlign: 'top'
        },
        series: [{
            name: 'Year 1800',
            data: [1, 3, 2, 4]
        }]
    });

    var initialPlotHeight = chart.plotHeight;
    var initialLegendY = chart.legend.group.translateY;

    chart.setTitle({
        text: null
    }, {
        text: null
    });

    assert.ok(
        chart.plotHeight > initialPlotHeight,
        'Plot height should change'
    );

    assert.ok(
        chart.legend.group.translateY < initialLegendY,
        'Legend should be moved up (#8014)'
    );


});