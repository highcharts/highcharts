
$(function () {
    QUnit.test("Waterfall dataLabels should be rendered below points when threshold is exceeded.", function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'waterfall'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            inside: false
                        }
                    }
                },
                series: [{
                    data: [{
                        y: -5.8
                    }, {
                        y: -5.3
                    }, {
                        y: 40
                    }, {
                        y: -2.7
                    }, {
                        y: -6.9
                    }]
                }]
            }).highcharts(),
            point = chart.series[0].points[0],
            label = point.dataLabel;


        assert.equal(
            label.attr("y") >= point.plotY + point.shapeArgs.height,
            true,
            'Label rendered below the point.'
        );


    });
});