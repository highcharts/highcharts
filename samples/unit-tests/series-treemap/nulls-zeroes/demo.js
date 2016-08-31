QUnit.test('Zeroes and nulls', function (assert) {

    assert.expect(0);

    Highcharts.chart('container', {
        series: [{
            layoutAlgorithm: 'strip',
            borderWidth: 2,
            borderColor: "#2e3338",
            type: "treemap",
            data: [{
                name: "Plop",
                value: 10
            }, {
                name: "Pouet",
                value: 0
            }, {
                name: "Null",
                value: null
            }],
            levels: [{
                level: 1,
                borderColor: "#2e3338",
                borderWidth: 6,
                layoutAlgorithm: 'strip'
            }]
        }]
    });
});
