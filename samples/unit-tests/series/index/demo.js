$(function () {

    QUnit.test('Series index and updating (#5960)', function (assert) {

        var chart;

        function getNames() {
            return chart.series.map(function (s) {
                return s.name;
            }).join(', ');
        }

        chart = Highcharts.chart('container', {
            series: [{
                data: [5, 5, 5]
            }, {
                data: [10, 10, 10]
            }, {
                data: [15, 15, 15]
            }, {
                data: [20, 20, 20]
            }, {
                data: [25, 25, 25]
            }]
        });

        assert.strictEqual(
            getNames(),
            'Series 1, Series 2, Series 3, Series 4, Series 5',
            'Initial order'
        );

        chart.series[1].remove();
        chart.series[1].remove();
        chart.series[1].remove();


        assert.strictEqual(
            getNames(),
            'Series 1, Series 5',
            'Order after remove'
        );

        chart.addSeries({
            data: [25, 25, 25],
            name: "New Series"
        });

        assert.strictEqual(
            getNames(),
            'Series 1, Series 5, New Series',
            'Order after adding'
        );
    });
});