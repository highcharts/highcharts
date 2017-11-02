
QUnit.test(
    'Navigator series\' should keep its position in series array, ' +
    'even after series.update()',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
                series: [{
                    data: [1, 2, 3],
                    id: '1'
                }, {
                    data: [1, 2, 3],
                    id: '2'
                }, {
                    data: [1, 2, 3],
                    id: '3'
                }]
            }),
            initialIndexes = chart.series.map(function (s) {
                return s.options.id;
            }),
            afterUpdateIndexes;


        Highcharts.each(chart.series, function (s, i) {
            s.update({
                name: 'Name ' + i
            }, false);
        });
        chart.redraw();

        afterUpdateIndexes = chart.series.map(function (s) {
            return s.options.id;
        });

        assert.deepEqual(
            initialIndexes,
            afterUpdateIndexes,
            'Correct zIndexes after update'
        );
    }
);


QUnit.test(
    'Updating types, new type lost after second update (#2322)',
    function (assert) {
        var data = [
            [0, 1, 2, 3, 4]
        ];

        var chart = Highcharts.chart('container', {
            series: [{
                type: 'candlestick',
                data: [
                    [0, 4.11, 4.12, 4.50, 4.07]
                ]
            }]
        });

        assert.strictEqual(
            chart.series[0].pointArrayMap.toString(),
            'open,high,low,close',
            'OHLC point array map'
        );

        // Update type and data at the same time
        chart.series[0].update({
            data: data,
            type: 'line'
        }, true);

        assert.strictEqual(
            chart.series[0].pointArrayMap,
            undefined,
            'No point array map on base Series'
        );

        // Repeat: Update type and data at the same time
        chart.series[0].update({
            data: data,
            type: 'line'
        }, true);

        assert.strictEqual(
            chart.series[0].pointArrayMap,
            undefined,
            'No point array map on base Series'
        );

    }
);

QUnit.test('Updating and mouse interaction', function (assert) {

    assert.expect(0);
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'column'
        },
        series: [{
            data: [[0, 10], [1, 19], [2, 8], [3, 24], [4, 67]],
            events: {
                mouseOver: function () {
                    this.update({ dataLabels: { enabled: true } });
                },
                mouseOut: function () {
                    this.update({ dataLabels: { enabled: false } });
                }
            }
        }]
    });

    chart.series[0].points[0].onMouseOver();
});

QUnit.test(
    'Udating color index, class name should change',
    function (assert) {
        var chart = Highcharts.chart('container', {

            title: {
                text: 'Color index'
            },

            series: [{
                type: 'area',
                data: [1, 3, 2, 4]
            }]

        });
        var s = chart.series[0];

        assert.notEqual(
            s.group.element.getAttribute('class').indexOf('highcharts-color-0'),
            -1,
            'Correct class'
        );

        s.update({ colorIndex: 5 });

        assert.strictEqual(
            s.group.element.getAttribute('class').indexOf('highcharts-color-0'),
            -1,
            'Original color class gone'
        );

        assert.notEqual(
            s.group.element.getAttribute('class').indexOf('highcharts-color-5'),
            -1,
            'New color class added'
        );

    }
);

QUnit.test(
    'Series.update and setData',
    function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: 'area'
            },

            plotOptions: {
                area: {
                    stacking: true
                }
            },

            series: [{
                data: [1, 2, 3, 4, null, null]
            }, {
                data: [1, 2, 3, 4, null, null]
            }]

        });

        chart.series[0].points[0].kilroyWasHere = true;

        chart.series[0].update({
            data: [4, 3, 2, 1, null, null]
        });

        assert.strictEqual(
            chart.series[0].points[0].kilroyWasHere,
            true,
            'Original point item is preserved'
        );

        chart.series[0].setData([1, 2, 3, 4, 5, null], false);
        chart.series[1].setData([1, 2, 3, 4, 5, null], false);
        chart.redraw();

        assert.strictEqual(
            chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
            0,
            'Graph is continuous (#7326)'
        );

    }
);

QUnit.test(
    'Navigator series\' do not allow linkeTo (#6734).',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 1],
                id: '1'
            }, {
                data: [1, 3, 1],
                id: '2',
                linkedTo: '1',
                showInNavigator: true
            }]
        });

        assert.deepEqual(
            chart.series[2].options.linkedTo,
            null,
            'No linkedTo for navigator series'
        );
        assert.deepEqual(
            chart.series[3].options.linkedTo,
            null,
            'No linkedTo in navigator series based on series with linkedTo'
        );

        chart.series[0].update({
            type: 'spline'
        });

        assert.deepEqual(
            chart.series[2].options.linkedTo,
            null,
            'No linkedTo for navigator series'
        );
        assert.deepEqual(
            chart.series[3].options.linkedTo,
            null,
            'No linkedTo in navigator series based on series with linkedTo'
        );
    }
);
