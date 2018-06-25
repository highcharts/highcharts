
QUnit.test('Stacked box plot', function (assert) {

    $('#container').highcharts({
        "chart": {
            "type": "boxplot"
        },
        "plotOptions": {
            "series": {
                "stacking": "normal"
            }
        },
        "series": [{
            "name": "Box plot",
            "data": [
                [1, 2, 3, 4, 5]
            ]
        }]
    });

    assert.equal(
        $('#container').highcharts().series[0].type,
        'boxplot',
        'Successful boxplot'
    );

});
