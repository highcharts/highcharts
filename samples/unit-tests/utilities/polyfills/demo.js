
QUnit.test('Highcharts', function (assert) {

    var map = Array.prototype.map;
    delete Array.prototype.map;

    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.ok(
        typeof chart === 'object',
        'Chart is created'
    );

    Array.prototype.map = map; // eslint-disable-line no-extend-native
});

QUnit.test('Highstock', function (assert) {

    var map = Array.prototype.map;
    delete Array.prototype.map;

    var chart = Highcharts.stockChart('container', {
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.ok(
        typeof chart === 'object',
        'Chart is created'
    );

    Array.prototype.map = map; // eslint-disable-line no-extend-native

});

QUnit.test('Highmaps', function (assert) {

    var map = Array.prototype.map;
    delete Array.prototype.map;

    var chart = Highcharts.mapChart('container', {
        series: [{
            mapData: Highcharts.maps['countries/bn/bn-all']
        }]
    });

    assert.ok(
        typeof chart === 'object',
        'Chart is created'
    );

    Array.prototype.map = map; // eslint-disable-line no-extend-native

});
