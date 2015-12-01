
$(function () {
    QUnit.test("Null points should not have data labels", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'pie'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f} %'
                    }
                }
            },
            series: [{
                name: "Brands",
                data: [{
                    name: "Microsoft Internet Explorer",
                    //y: 56.33,
                    y: null
                }, {
                    name: "Chrome",
                    y: 24.03
                }, {
                    name: "Firefox",
                    y: 10.38
                }, {
                    name: "Safari",
                    y: 4.77
                }, {
                    name: "Opera",
                    y: 0.91
                }, {
                    name: "Proprietary or Undetectable",
                    y: 0.2
                }]
            }]
        }).highcharts();


        assert.strictEqual(
            typeof chart.series[0].points[0].dataLabel,
            'undefined',
            "No Data label for null point"
        );
        assert.strictEqual(
            typeof chart.series[0].points[1].dataLabel,
            'object',
            'Second point has data label'
        );
    });
});