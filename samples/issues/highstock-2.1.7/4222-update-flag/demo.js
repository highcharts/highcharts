$(function () {
    QUnit.test('Update flag', function (assert) {
        var chart = $('#container').highcharts('StockChart', {
            series: [{
                data: [
                     [Date.UTC(2014, 6, 1), 10],
                     [Date.UTC(2014, 7, 1), 10],
                     [Date.UTC(2014, 8, 1), 10],
                     [Date.UTC(2014, 9, 1), 10],
                     [Date.UTC(2014, 10, 1), 10],
                     [Date.UTC(2014, 11, 1), 10],
                     [Date.UTC(2015, 1, 1), 10],
                     [Date.UTC(2015, 3, 1), 13],
                     [Date.UTC(2015, 4, 1), 14],
                     [Date.UTC(2015, 5, 1), 11],
                     [Date.UTC(2015, 6, 1), 5]
                ],
                id: 'dataseries'
            }, {
                type: 'flags',
                data: [{
                    x: Date.UTC(2015, 3, 1),
                    title: 'H',
                    text: 'Name'
                }],
                onSeries: 'dataseries',
                shape: 'circlepin'
            }]
        }).highcharts();

        var flag = {
                x: Date.UTC(2015, 5, 1),
                title: 'Name2',
                text: 'new'
            },
            point = chart.series[1].points[0];

        point.update(flag, true, false);
        assert.strictEqual(
            point.graphic.element.querySelector('text').textContent,
            flag.title,
            'Updated title'
        );

        chart.tooltip.refresh([point]);

        assert.strictEqual(
            chart.tooltip.label.element.lastChild.lastChild.textContent,
            flag.text,
            'Updated text'
        );
    });
});