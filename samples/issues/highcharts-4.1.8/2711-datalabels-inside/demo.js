$(function () {
    QUnit.test("Datalabel inside on columnrange", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'columnrange',
                inverted: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        inside: true
                    }
                }
            },
            series: [{
                data: [
                    [-9.7, 9.4],
                    [-2.7, 10.4],
                    [-2.7, 9.4]
                ]
            }]
        }).highcharts();


        assert.strictEqual(
            chart.series[0].data[0].dataLabel.x < chart.series[0].data[0].dataLabelUpper.x ,
            true,
            'Correct positions'
        );



    });

});