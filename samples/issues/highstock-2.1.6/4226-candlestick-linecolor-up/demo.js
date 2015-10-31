$(function () {

    QUnit.test('Line color on up point', function (assert) {

        var data = [
            [3, 4.5, 6, 3, 5.5],
            [4, 5.5, 6, 0.5, 1],
            {
                x : 5,
                open: 1,
                high: 3,
                low: 0.5,
                close: 2,
                lineColor: "#FF0000"
            },
            {
                x : 6,
                open: 2,
                high: 2,
                low: 0.5,
                close: 1.5,
                lineColor: "#FF0000"
            }
        ];
        $('#container').highcharts('StockChart', {
            rangeSelector: {
                selected: 1
            },

            series: [{
                lineColor: 'black',
                type: 'candlestick',
                name: 'test',
                data: data
            }]
        });

        var chart = $('#container').highcharts(),
            points = chart.series[0].points;


        assert.equal(
            points[0].graphic.element.getAttribute('stroke'),
            'black',
            'Regular up'
        );
        assert.equal(
            points[1].graphic.element.getAttribute('stroke'),
            'black',
            'Regular down'
        );

        assert.equal(
            points[2].graphic.element.getAttribute('stroke').toLowerCase(),
            '#ff0000',
            'Individual up'
        );
        assert.equal(
            points[3].graphic.element.getAttribute('stroke').toLowerCase(),
            '#ff0000',
            'Individual down'
        );
    });
});