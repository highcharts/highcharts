(function () {

    function createChart(options) {
        for (var i = 0, series = []; i <= 50; ++i) {
            series.push({
                data: [i]
            });
        }

        return Highcharts.chart('container', Highcharts.merge({
            boost: {
                enabled: false
            },
            chart: {
                height: 300
            },
            series: series,
            legend: {
                layout: 'horizontal',
                width: 200,
                itemWidth: 100
            }
        }, options));
    }

    QUnit.test('Legend fills height when floating', function (assert) {
        var chart = createChart({
            legend: {
                floating: true,
                align: 'left',
                verticalAlign: 'top'
            }
        });

        assert.ok(chart.legend.legendHeight > 150, 'Legend is full height');
    });

    QUnit.test('Legend does not fill height when on top or bottom', function (assert) {
        var chart = createChart({
            legend: {
                floating: false,
                align: 'left',
                verticalAlign: 'top'
            }
        });

        assert.ok(chart.legend.legendHeight < 150, 'Legend is less than full height');

        chart = createChart({
            legend: {
                floating: false,
                align: 'middle',
                verticalAlign: 'bottom'
            }
        });

        assert.ok(chart.legend.legendHeight < 150, 'Legend is less than full height');
    });

    QUnit.test('Legend fills height when on the side', function (assert) {
        var chart = createChart({
            legend: {
                floating: false,
                align: 'left',
                verticalAlign: 'middle'
            }
        });

        assert.ok(chart.legend.legendHeight > 150, 'Legend is full height');

        chart = createChart({
            legend: {
                floating: false,
                align: 'right',
                verticalAlign: 'middle'
            }
        });

        assert.ok(chart.legend.legendHeight > 150, 'Legend is full height');
    });
}());
