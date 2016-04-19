QUnit.test('getClosest', function (assert) {
    var chart;
    Highcharts.Axis.prototype.getClosest = function getClosest() {
        var xValues = this.series.reduce(function (result, arr) {
                return result.concat(arr.xData);
            }, []),
            ret;
        xValues.sort();
        ret = xValues.reduce(function (lt, curr, i, arr) {
            var prev = arr[i - 1],
                sum = curr - prev;
            return ((lt === 0 || sum === 0) ?  Math.max(lt, sum) : Math.min(lt, sum));
        });
        return ret;
    };

    chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        xAxis: {
            categories: ['A', 'B', 'C', 'D', 'E']
        },
        series: [{
            name: 'John',
            data: [[0, 5], [3, 4]]
        }, {
            name: 'Jane',
            data: [[1, 2], [4, 2]]
        }, {
            name: 'Jeane',
            data: [[2, 2], [5, 2]]
        }, {
            name: 'Joe',
            data: [[0, 3], [3, 4]]
        }]
    });
    assert.strictEqual(
        chart.xAxis[0].getClosest(),
        1,
        'Axis.getClosest considers x values across multiple series'
    );
});
