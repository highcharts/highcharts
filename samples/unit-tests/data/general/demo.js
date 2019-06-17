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