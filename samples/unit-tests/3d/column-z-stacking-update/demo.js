
QUnit.test('Updating 3D columns with z stacking #4743', function (assert) {
    var point0,
        point1,
        point0Z,
        point1Z,
        point0ZUpd,
        point1ZUpd,
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 80,
                    depth: 300,
                    viewDistance: 5
                }
            },
            plotOptions: {
                column: {
                    grouping: false,
                    groupZPadding: 10,
                    pointPadding: 0.2,
                    depth: 40
                }
            },
            series: [{
                showInLegend: true,
                data: [{
                    x: 5,
                    y: 5
                }]
            }, {
                showInLegend: true,
                data: [{
                    x: 5,
                    y: 5
                }]
            }]
        });
    point0 = chart.series[0].data[0];
    point1 = chart.series[1].data[0];
    point0Z = point0.shapeArgs.z;
    point1Z = point1.shapeArgs.z;


    Highcharts.each(chart.series, function (s) {
        s.update({
            showInLegend: false
        }, false);
    });
    chart.redraw();



    Highcharts.each(chart.series, function (s) {
        s.update({
            showInLegend: true
        }, false);
    });
    chart.redraw();

    point0 = chart.series[0].data[0];
    point1 = chart.series[1].data[0];
    point0ZUpd = point0.shapeArgs.z;
    point1ZUpd = point1.shapeArgs.z;


    assert.strictEqual(
        (point0Z === point0ZUpd && point1Z === point1ZUpd),
        true,
        'Updating 3D columns works with z stacking'
    );
});
