QUnit.test('AMD loading of the Highcharts package', function (assert) {

    const done = assert.async();

    require(
        ['highcharts'],
        function (Highcharts) {
            assert.ok(typeof Highcharts === 'object' && Highcharts !== null);
            done();
        }
    );

});
