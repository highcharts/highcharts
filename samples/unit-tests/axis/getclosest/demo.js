QUnit.test('getClosest ignores invisible series', function (assert) {
    var data1 = [];
    var data2 = [];

    for (var i = 0; i < 1478736000; i += 864000) {
        data1.push([i, 100]);
        data2.push([i, 100]);
    }

    var chart = Highcharts.stockChart('container', {

        boost: {
            enabled: false
        },

        xAxis: {
            type: 'datetime'
        },

        plotOptions: {
            column: {
                stacking: 'normal',
                dataGrouping: {
                    groupPixelWidth: 100
                }
            }
        },

        series: [{
            type: 'column',
            data: data1,
            visible: false
        }, {
            type: 'column',
            data: data2
        }]
    });

    assert.strictEqual(chart.xAxis[0].getClosest(), 86400000);
});
