QUnit.test('Soft series update by data module update', function (assert) {
    var csv1 = 'Name,Initial name\nApples,1\nPears,2\nBananas,3';
    var csv2 = 'Name,Updated name\nApples,3\nPears,2\nBananas,1';

    var chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            type: 'pie'
        },
        data: {
            csv: csv1
        }
    });

    var s = chart.series[0];

    assert.strictEqual(s.name, 'Initial name', 'Initial name should be set');

    s.points.forEach(function (p) {
        p.wasThereInitially = true;
    });

    chart.update({
        data: {
            csv: csv2
        }
    });

    assert.strictEqual(s.name, 'Updated name', 'Name should be updated');

    assert.deepEqual(
        s.points.map(function (p) {
            return p.wasThereInitially;
        }),
        [true, true, true],
        'Exisition points should be updated (soft update)'
    );
});

QUnit.test(
    'Soft series and axis update by data module update, datetime axis',
    function (assert) {
        var csv1 =
            'Chart,Apples\n2018-03-13T13:00:00Z,4\n2018-03-13T14:00:00Z,' +
            '2\n2018-03-13T15:00:00Z,1\n2018-03-13T16:00:00Z,' +
            '4\n2018-03-13T17:00:00Z,2';
        var csv2 =
            'Chart,Apples\n2018-03-13T14:00:00Z,2\n2018-03-13T15:00:00Z,' +
            '1\n2018-03-13T16:00:00Z,4\n2018-03-13T17:00:00Z,' +
            '2\n2018-03-13T18:00:00Z,5';

        var chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },

            data: {
                csv: csv1
            }
        });

        var text = document.querySelectorAll(
            '.highcharts-xaxis-labels text'
        )[1];
        var x = text.getBBox().x;

        assert.ok(
            /^[0-9]{1,2}:00$/.test(text.textContent),
            'Initial time should be set - actual time varies with timezone'
        );

        chart.update({
            data: {
                csv: csv2
            }
        });

        assert.strictEqual(
            document.querySelectorAll('.highcharts-xaxis-labels text')[0],
            text,
            'The same label should now have moved to first position'
        );

        assert.ok(
            text.getBBox().x < x,
            'The label should now have moved to the left'
        );
    }
);

QUnit.test(
    'Hard series and axis update by data module update, datetime axis',
    function (assert) {
        const csv1 =
                'Chart,Apples\n2018-03-13T13:00:00Z,4\n2018-03-13T14:00:00Z,' +
                '2\n2018-03-13T15:00:00Z,1\n2018-03-13T16:00:00Z,' +
                '4\n2018-03-13T17:00:00Z,2',
            csv2 =
                'Chart,Apples\n2018-03-13T14:00:00Z,2\n2018-03-13T15:00:00Z,' +
                '1\n2018-03-13T16:00:00Z,4\n2018-03-13T17:00:00Z,' +
                '2\n2018-03-13T18:00:00Z,5',
            csvLinear = 'Chart,Apples\n1,2\n2,1\n3,4\n4,2\n7,5';

        const chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },
            series: [{
                data: [
                    [1, 2],
                    [5, 5]
                ]
            }],
            xAxis: {
                type: 'category'
            },
            data: {}
        });

        chart.update({
            data: {
                csv: csv1
            }
        });
        assert.ok(
            chart.xAxis[0].options.type === 'category' &&
            chart.series[0].points.length === 5,
            'Explicit xAxis type should be respected by data module'
        );

        // Clear the type so that the data module can change it
        chart.update({
            xAxis: [{
                type: void 0
            }]
        });
        chart.update({
            data: {
                csv: csv2
            }
        });

        assert.ok(
            chart.xAxis[0].type === 'datetime',
            'xAxis type=linear should be changed by data module to datetime'
        );
        assert.ok(
            chart.xAxis[0].options.type !== 'datetime',
            'xAxis type should NOT be changed by data module in options'
        );

        chart.update({
            data: {
                csv: csvLinear
            }
        });

        assert.ok(
            chart.xAxis[0].type === 'linear',
            'xAxis type=datetime should be changed by data module to liear'
        );
        assert.ok(
            chart.xAxis[0].options.type !== 'linear',
            'xAxis type should NOT be changed by data module in options'
        );
    }
);