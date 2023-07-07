QUnit.test(
    'Parsing dates with timezone information (#10322)',
    function (assert) {
        var data = new Highcharts.Data({}),
            samples = [
                '2018-03-13T17:00:00+00:00',
                '2018-03-13T20:00:00+03:00',
                '2018-03-13T17:00:00GMT',
                '2018-03-13T07:00:00GMT-1000',
                '2018-03-13T08:00:00GMT-09:00',
                '2018-03-13T17:00:00UTC',
                '2018-03-13T18:30:00UTC+0130',
                '2018-03-13T17:30:00UTC+00:30',
                '2018-03-13T17:00:00Z'
            ],
            previousSample;

        samples
            .map(sample => data.parseDate(sample))
            .map(sample => (new Date(sample)).toUTCString())
            .forEach((sample, index) => {
                if (previousSample) {
                    assert.strictEqual(
                        sample,
                        previousSample,
                        'Parsed dates should be the same. (Index: ' + index + ')'
                    );
                }
                previousSample = sample;
            });
    }
);

QUnit.test(
    'Data module with decimapPoint and negative numbers (#4749, #19017)',
    function (assert) {
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
            <td>3 123</td>
            <td>-3 123</td>
        </tr>
    </tbody>
</table>`;
        var chart = $('#container')
            .highcharts({
                data: {
                    table: 'datatable',
                    decimalPoint: ','
                },
                chart: {
                    type: 'column'
                }
            })
            .highcharts();

        assert.equal(
            chart.series[0].points
                .map(function (point) {
                    return point.y;
                })
                .join(','),
            '-3.4,-1.2,5.1,-1.1,3123',
            'Series 1 correct data'
        );
        assert.equal(
            chart.series[1].points
                .map(function (point) {
                    return point.y;
                })
                .join(','),
            '-4.24,-1.5,11.1,-1.1,-3123',
            'Series 2 correct data'
        );
    }
);

QUnit.test('Empty data config', function (assert) {
    var chart = Highcharts.chart('container', {
        data: {}
    });

    assert.strictEqual(chart.series.length, 0, 'Series array should exist');
});

QUnit.test('Combination charts and column mapping', function (assert) {
    let csv = [
            'X values,First,Second,Third,Fourth,Fifth,Sixth',
            'Oak,10,9,11,20,19,21',
            'Pine,11,10,12,21,20,22',
            'Birch,12,11,13,22,21,23'
        ].join('\n'),
        chart = Highcharts.chart('container', {
            data: {
                csv: csv
            },
            series: [
                {
                    type: 'pie'
                }
            ]
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
        series: [
            {
                type: 'column'
            },
            {
                type: 'errorbar'
            },
            {
                type: 'line'
            },
            {
                type: 'errorbar'
            }
        ]
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
            seriesMapping: [
                {
                    from: 0,
                    to: 1,
                    weight: 2
                },
                {
                    from: 3,
                    to: 4
                }
            ]
        },
        series: [
            {
                type: 'sankey'
            },
            {
                type: 'networkgraph'
            }
        ]
    });

    assert.deepEqual(
        chart.series.map(function (s) {
            return s.data.length;
        }),
        [3, 3],
        'Non-cartesian series should pick columns without X-column (#10984)'
    );

    csv = [
        '"A";"A";"B";"B"',
        '"Germany";767.1;"Ukraine";249.1',
        '"Croatia";20.7;"Poland";298.1',
        '"Belgium";97.2;;'
    ].join('\n');

    chart = Highcharts.chart('container', {
        series: [{
            type: 'packedbubble',
            data: []
        }, {
            type: 'packedbubble',
            data: []
        }],
        data: {
            csv: csv,
            seriesMapping: [{
                name: 0,
                value: 1
            },
            {
                name: 2,
                value: 3
            }
            ]
        }
    });

    assert.deepEqual(
        chart.series.map(function (s) {
            return s.name;
        }),
        ['A', 'B'],
        `Name should be mapped correctly from CSV for packed bubble series,
        which is non-cartesian (#19143).`
    );
});

QUnit.test('Data config on updates and setOptions', function (assert) {
    Highcharts.setOptions({
        data: {
            endRow: 2
        }
    });

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

    assert.strictEqual(
        chart.series.length,
        2,
        'Global data options should be merged with the chart options (#16568).'
    );

    // Clear the default options for other tests
    delete Highcharts.defaultOptions.data;
});

QUnit.test(
    'Data module - empty point should be parsed to null (#12566).',
    function (assert) {
        const table = document.createElement('table');
        document.body.appendChild(table);
        table.id = 'secondTable';
        table.innerHTML = `
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
            </tr>
            <tr>
                <th>Pears</th>
                <td>-1,2</td>
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
        </tbody>`;

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },

            data: {
                table: 'secondTable',
                decimalPoint: ','
            }
        });

        assert.strictEqual(
            chart.data.columns[2][0],
            null,
            'Empty point should be parsed to null instead of undefined.'
        );

        document.body.removeChild(table);
    }
);


QUnit.test('Updating with firstRowAsNames', function (assert) {
    const chart = Highcharts.chart('container', {
            data: {
                columns: [['A', 1, 2, 3, 4, 5, 6], ['B', 2, 4, 8, 3, 6, 6]]
            }
        }),
        numPoints = chart.series[0].points.length;

    chart.update({
        data: {
            googleSpreadsheetKey: 'placeholder'
        }
    });

    assert.strictEqual(
        chart.series[0].points.length,
        numPoints,
        'Updating data options should not remove data rows.'
    );
});


QUnit.test('Update column names', function (assert) {
    const chart = Highcharts.chart('container', {
        data: {
            columns: [['A', 1, 2, 3, 4, 5, 6], ['B', 2, 4, 8, 3, 6, 6]]
        }
    });

    chart.update({
        data: {
            columns: [['C', 1, 2, 3, 4, 5, 6], ['D', 2, 4, 8, 3, 6, 6]]
        }
    });

    assert.strictEqual(
        chart.series[0].name,
        'D',
        'Should be able to update series name.'
    );
});


QUnit.test('Updating with firstRowAsNames and dataGrouping', function (assert) {
    const chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true
                }
            }
        },
        data: {
            columns: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 4]]
        }
    });

    chart.update({
        data: {
            dataRefreshRate: 90
        }
    });

    assert.strictEqual(
        chart.options.data.dataRefreshRate,
        90,
        'Should be able to update data options despite using columns and having data grouping options.'
    );
});
