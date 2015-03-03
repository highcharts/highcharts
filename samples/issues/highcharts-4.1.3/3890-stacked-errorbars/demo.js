$(function () {

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
                    [1,2,3,4,5]
                ],
            }]
        });

        assert.equal(
            $('#container').highcharts().series[0].type,    
            'boxplot',
            'Successful boxplot'
        );
    });

    QUnit.test('Stacked error bar', function (assert) {

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
                ],
            }]
        });

        assert.equal(
            $('#container').highcharts().series[1].type,    
            'errorbar',
            'Successful error bar'
        );
    });

});