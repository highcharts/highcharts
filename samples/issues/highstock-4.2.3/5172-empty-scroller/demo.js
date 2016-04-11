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
            chart.container.querySelector('.highcharts-navigator rect'),
            null,
            'Navigator not created due to missing data'
        );
    });
});