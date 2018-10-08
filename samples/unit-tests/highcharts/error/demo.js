QUnit.test('Error 19', function (assert) {

    assert.expect(2);

    var error = Highcharts.error;

    Highcharts.error = function (code) {
        assert.strictEqual(
            code,
            19,
            'Error 19 should be invoked'
        );
    };

    var chart = Highcharts.chart('container', {
        "chart": {
            width: 800
        },
        "xAxis": {
            "labels": {
                "step": 1
            },
            "type": "datetime",
            "categories": ["One"]
        },
        "series": [{
            "data": [172, 175, 170, 185, 241, 341, 152, 198, 213, 225, 210, 224,
                316, 197, 300, 299, 353, 206, 210, 210, 210, 213, 210, 207, 257,
                210, 280, 239, 252, 229, 222, 216, 205, 240, 210, 216, 210, 210,
                222, 239, 200, 175, 186, 185, 175, 175, 181, 178, 180, 209, 170,
                180, 175, 175, 176, 175, 175, 175, 175, 175, 175, 180, 175, 225,
                222, 210, 210, 210, 240, 210, 210, 120],
            "pointStart": 1493596800000,
            "pointInterval": 604800000
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        2,
        'The axis should revert to only two tick positions'
    );

    Highcharts.error = error;


});