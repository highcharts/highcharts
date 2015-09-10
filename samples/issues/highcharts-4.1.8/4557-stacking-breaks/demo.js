$(function () {
    QUnit.test("Stacking and broken axis cause error.", function (assert) {
        
        $('#container').highcharts({
            xAxis:{
                breaks: [{
                    from: 5,
                    to: 15,
                    breakSize: 1
                }]
            },
            series: [{
                stacking: "normal",
                data: (function () {
                    var data = [],
                        i;
                    for (i = 0; i < 20; i = i + 1) {
                        data.push(i);
                    }
                    return data;
                }())
            }]
        });

        var chart = $('#container').highcharts(),
            UNDEFINED;

        assert.strictEqual(
            chart.series[0].points[0].graphic !== UNDEFINED,
            true,
            "Ok, no errors."
        );
    });
});