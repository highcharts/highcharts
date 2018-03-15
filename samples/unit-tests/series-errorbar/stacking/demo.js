
// Highcharts 4.1.3, Issue #3890:
// cannot use errorbar combined graph on stacked column graph
QUnit.test('Stacked error bar (#3890)', function (assert) {

    $('#container').highcharts({
        "chart": {
            "type": "column"
        },
        "plotOptions": {
            "series": {
                "stacking": "normal"
            }
        },
        "series": [{
            "name": "Column",
            "data": [2]
        }, {
            "name": "Error bar",
            "type": "errorbar",
            "data": [
                [1, 3]
            ]
        }]
    });

    assert.equal(
        $('#container').highcharts().series[1].type,
        'errorbar',
        'Successful error bar'
    );

});
