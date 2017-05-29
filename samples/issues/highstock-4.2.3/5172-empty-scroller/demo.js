$(function () {
    QUnit.test('Empty scroller with Axis min set', function (assert) {
        var chart = Highcharts.chart('container', {
            "xAxis": {
                "min": 0
            },
            "series": [{
                "id": "navigator",
                "name": null,
                "data": []
            }, {
                "id": "my_data",
                "name": null,
                "data": []
            }],
            "navigator": {
                "enabled": true,
                "series": {
                    "id": "navigator"
                },
                "xAxis": {
                    "min": 0
                }
            }
        });

        assert.strictEqual(
            chart.navigator.navigatorGroup.attr('visibility'),
            'hidden',
            'Navigator hidden due to missing data'
        );
    });
});