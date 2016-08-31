$(function () {

    // Delete IE > 8 functions
    delete Array.prototype.map;

    QUnit.test('Highcharts', function (assert) {

        var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.ok(
            typeof chart === 'object',
            'Chart is created'
        );

    });

    QUnit.test('Highstock', function (assert) {

        var chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }]
        });

        assert.ok(
            typeof chart === 'object',
            'Chart is created'
        );

    });

    QUnit.test('Highmaps', function (assert) {

        var chart = Highcharts.mapChart('container', {
            series: [{
                mapData: Highcharts.maps['countries/bn/bn-all']
            }]
        });

        assert.ok(
            typeof chart === 'object',
            'Chart is created'
        );

    });

});