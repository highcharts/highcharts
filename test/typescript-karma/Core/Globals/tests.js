QUnit.test('AMD loading of the global Highcharts namespace', function (assert) {

    const done = assert.async();

    require(['highcharts/highcharts'], function (Highcharts) {
        assert.ok(typeof Highcharts === 'object' && Highcharts !== null);
        done();
    });

});
