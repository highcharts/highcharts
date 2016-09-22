$(function () {
    QUnit.test('Input focus of previously hidden chart', function (assert) {
        Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [
              [1241136000000, 18.18],
              [1241395200000, 18.87],
              [1241481600000, 18.96],
              [1241568000000, 18.93],
              [1241654400000, 18.44],
              [1241740800000, 18.46],
              [1242000000000, 18.51],
              [1242086400000, 17.77],
              [1242172800000, 17.07]
                ]
            }]
        });
        $('#container').show();
        assert.strictEqual(
            !!$('#container').highcharts().renderTo.getElementsByTagName('input').length,
            true,
            'Chart has input fields'
        );
    });
});
