import Highcharts from '/base/js/masters/highcharts.src.js';
import Series from '/base/js/Core/Series/Series.js';

QUnit.skip('Series.getTableFromSeriesData', function (assert) {

    const series1Data = [
            1,
            [1, 2],
            {
                x: 2,
                y: 3
            }
        ],
        table1 = Series.getTableFromSeriesData(series1Data),
        table1Columns = table1.getColumns(['x', 'y']),
        series2Data = Series.getSeriesDataFromTable(table1, ['x', 'y']);

    assert.strictEqual(
        Object.keys(table1Columns).length,
        2,
        'DataTable should contain two columns.'
    );
    assert.deepEqual(
        table1Columns,
        {
            x: [0, 1, 2],
            y: [1, 2, 3]
        },
        'DataTable should contain x and y values in order.'
    );
    assert.deepEqual(
        series2Data,
        [{
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 2
        }, {
            x: 2,
            y: 3
        }],
        'SeriesOptions should contain three points.'
    );

});

QUnit.skip('Series.syncTable', function (assert) {

    const done = assert.async(5),
        chart = new Highcharts.Chart(document.createElement('div'), {
            series: [{
                name: 'Test',
                data: [1, 2, 3]
            }]
        }),
        series = chart.series[0],
        table = series.table;

    test1();

    function test1() {
        assert.strictEqual(
            table.getRowCount(),
            series.data.length,
            'Number of series points should be equal to number of table rows. (#1)'
        );
        done();
        test2();
    }

    function test2() {
        table.setRows([{ y: 4 }]);
        window.setTimeout(function () {
            assert.strictEqual(
                series.data.length,
                table.getRowCount(),
                'Number of series points should be equal to number of table rows. (#2)'
            );
            assert.deepEqual(
                series.options.data,
                [1, 2, 3, 4],
                'Series data points should have equal data structure. (#2)'
            );
            done();
            test3();
        }, 10);
    }

    function test3() {
        table.setRows([[1, 5]], 1);
        window.setTimeout(function () {
            assert.deepEqual(
                series.options.data,
                [1, 5, 3, 4],
                'Series data points should have changed accordingly. (#3)'
            );
            done();
            test4();
        }, 10);
    }

    function test4() {
        table.deleteRows(2);
        window.setTimeout(function () {
            assert.strictEqual(
                series.data.length,
                table.getRowCount(),
                'Number of series points should be equal to number of table rows. (#4)'
            );
            assert.deepEqual(
                series.options.data,
                [1, 5, 4],
                'Series data points should be changed at expected index. (#4)'
            );
            done();
            test5();
        }, 10);
    }

    function test5() {
        table.setColumn('y', [3, 2, 1]);
        window.setTimeout(function () {
            assert.deepEqual(
                series.options.data,
                [3, 2, 1],
                'Series data points should be replaced. (#5)'
            );
            done();
        }, 10);
    }

});
