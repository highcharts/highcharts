$(function () {
    QUnit.test("X axis label rotation ignored step", function (assert) {
        var chart = $('#container').highcharts({

            xAxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                labels: {
                    step: 1,
                    rotation: 1, // try to set to '0'
                    staggerLines: 1
                }
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.xAxis[0].tickPositions.length,
            60,
            'No ticks are skipped'
        );

    });


    QUnit.test("Auto label alignment is still working when step is set", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                marginBottom: 80
            },
            xAxis: {
                categories: ['Loooooong', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: {
                    step: 1,
                    rotation: -90
                }
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.xAxis[0].labelAlign,
            'right',
            'Rigth aligned'
        );

    });

});