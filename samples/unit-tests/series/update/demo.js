
QUnit.test(
    'Navigator series\' should keep it\'s position in series array, ' +
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
    'Series.update with only data should redirect to setData',
    function (assert) {
        var chart = Highcharts.chart('container', {

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                    216.4, 194.1, 95.6, 54.4],
                type: 'column'
            }]

        });

        chart.series[0].points[0].kilroyWasHere = true;

        chart.series[0].update({
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                216.4, 194.1, 95.6, 54.4].slice(0).reverse()
        });

        assert.strictEqual(
            chart.series[0].points[0].kilroyWasHere,
            true,
            'Original point item is preserved'
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
