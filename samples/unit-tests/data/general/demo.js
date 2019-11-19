QUnit.test("Data module with decimapPoint and negative numbers (#4749)", function (assert) {
    document.body.innerHTML += `<table id="datatable">
    <thead>
        <tr>
            <th></th>
            <th>Jane</th>
            <th>John</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Apples</th>
            <td>-3,4</td>
            <td>-4,24</td>
        </tr>
        <tr>
            <th>Pears</th>
            <td>-1,2</td>
            <td>-1,5</td>
        </tr>
        <tr>
            <th>Plums</th>
            <td>5,1</td>
            <td>11,1</td>
        </tr>
        <tr>
            <th>Bananas</th>
            <td>-1,1</td>
            <td>-1,1</td>
        </tr>
        <tr>
            <th>Oranges</th>
            <td>-3,12</td>
            <td>-2,9</td>
        </tr>
    </tbody>
</table>`;
    var chart = $("#container").highcharts({
        data: {
            table: 'datatable',
            decimalPoint: ','
        },
        chart: {
            type: 'column'
        }
    }).highcharts();

    assert.equal(
        chart.series[0].points.map(function (point) {
            return point.y;
        }).join(','),
        '-3.4,-1.2,5.1,-1.1,-3.12',
        'Series 1 correct data'
    );
    assert.equal(
        chart.series[1].points.map(function (point) {
            return point.y;
        }).join(','),
        '-4.24,-1.5,11.1,-1.1,-2.9',
        'Series 2 correct data'
    );
});

QUnit.test('Empty data config', function (assert) {

    var chart = Highcharts.chart('container', {
        data: {}
    });

    assert.strictEqual(
        chart.series.length,
        0,
        'Series array should exist'
    );
});

QUnit.test('Combination charts and column mapping', function (assert) {

    var csv = [
        'X values,First,Second,Third,Fourth,Fifth,Sixth',
        'Oak,10,9,11,20,19,21',
        'Pine,11,10,12,21,20,22',
        'Birch,12,11,13,22,21,23'
    ].join('\n');

    var chart = Highcharts.chart('container', {
        data: {
            csv: csv
        },
        series: [{
            type: 'pie'
        }]
    });

    assert.deepEqual(
        chart.series.map(function (s) {
            return s.type;
        }),
        ['pie', 'line', 'line', 'line', 'line', 'line'],
        'First series should be pie'
    );

    chart = Highcharts.chart('container', {
        data: {
            csv: csv
        },
        series: [{
            type: 'column'
        }, {
            type: 'errorbar'
        }, {
            type: 'line'
        }, {
            type: 'errorbar'
        }]
    });

    assert.deepEqual(
        chart.series.map(function (s) {
            return s.type;
        }),
        ['column', 'errorbar', 'line', 'errorbar'],
        'Alternating series types should eat different numbers of columns (#8438)'
    );

    chart = Highcharts.chart('container', {
        data: {
            csv: [
                'From,To,Weight,From,To',
                'A,B,1,A,B',
                'A,C,1,A,C',
                'A,D,1,B,C'
            ].join('\n'),
            seriesMapping: [{
                from: 0,
                to: 1,
                weight: 2
            }, {
                from: 3,
                to: 4
            }]
        },
        series: [{
            type: 'sankey'
        }, {
            type: 'networkgraph'
        }]
    });

    assert.deepEqual(
        chart.series.map(function (s) {
            return s.data.length;
        }),
        [3, 3],
        'Non-cartesian series should pick columns without X-column (#10984)'
    );
});

QUnit.test('Data config on updates', function (assert) {
    var chart = Highcharts.chart('container', {
            data: {
                csv: [
                    'X values,First,Second,Third,Fourth,Fifth,Sixth',
                    'Oak,10,9,11,20,19,21',
                    'Pine,11,10,12,21,20,22',
                    'Birch,12,11,13,22,21,23'
                ].join('\n'),
                switchRowsAndColumns: true
            }
        }),
        oldDataLength = chart.series.length;

    chart.update({
        data: {
            switchRowsAndColumns: false
        }
    });

    assert.strictEqual(
        chart.series.length,
        6,
        'switchRowsAndColumns should change number of series (#11095).'
    );

    chart.update({
        data: {
            switchRowsAndColumns: true
        }
    });

    assert.strictEqual(
        chart.series.length,
        oldDataLength,
        'Switching back switchRowsAndColumns should restore number of series (#11095).'
    );
});