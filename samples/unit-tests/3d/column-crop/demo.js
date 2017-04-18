$(function () {

    QUnit.test('3D columns crop outside plotArea', function (assert) {
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
                        beta: 0,
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
                xAxis: {
                    min: 0,
                    max: 5
                },
                yAxis: {
                    min: 2,
                    max: 5
                },
                series: [{
                    showInLegend: true,
                    data: [{
                        x: 5,
                        y: 5
                    }, {
                        x: 5,
                        y: 10
                    }, {
                        x: 7,
                        y: 10
                    }]
                }]
            });

        shapeArgs0 = chart.series[0].data[0].shapeArgs;
        shapeArgs1 = chart.series[0].data[1].shapeArgs;

        assert.strictEqual(
            (
                shapeArgs0.x === shapeArgs1.x &&
                shapeArgs0.y === shapeArgs1.y &&
                shapeArgs0.height === shapeArgs1.height &&
                shapeArgs0.width === shapeArgs1.width
            ),
            true,
            'Columns are cropped outside plotArea'
        );
    });
});
