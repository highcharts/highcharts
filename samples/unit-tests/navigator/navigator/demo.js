QUnit.test(
    'Width and height',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            legend: {
                enabled: true
            },
            yAxis: {
                labels: {
                    align: 'left'
                }
            },
            navigator: {
                height: 100
            },
            series: [{
                data: [1, 2, 3],
                id: '1'
            }]
        });

        chart.series[0].hide();

        assert.deepEqual(
            chart.scroller.size,
            chart.scroller.xAxis.len,
            'Correct width (#6022)'
        );

        assert.strictEqual(
            chart.series[1].clipBox.height,
            100,
            'Navigator series has correct clipping rect height (#5904)'
        );
    }
);

QUnit.test(
    'Reversed xAxis with navigator should allow zooming.',
    function (assert) {

        var chart = new Highcharts.StockChart({
                chart: {
                    renderTo: 'container'
                },
                series: [{
                    data: [
                        [10, 20],
                        [15, 22]
                    ]
                }],
                navigator: {
                    xAxis: {
                        reversed: true
                    }
                },
                xAxis: {
                    minRange: 1
                }
            }),
            offset = $('#container').offset(),
            navigator = chart.scroller,
            done = assert.async();


        navigator.handlesMousedown({
            pageX: offset.left + 578,
            pageY: offset.top + 400 - 30
        }, 0);

        navigator.mouseMoveHandler({
            pageX: offset.left + 309,
            pageY: offset.top + 400 - 30,
            DOMType: 'mousemove'
        });

        setTimeout(function () {
            navigator.hasDragged = true;
            navigator.mouseUpHandler({
                pageX: offset.left + 308,
                pageY: offset.top + 400 - 30,
                DOMType: 'mouseup'
            });
            assert.strictEqual(
            chart.series[0].points !== null,
            true,
            'Navigator works.'
          );
            done();
        }, 0);
    }
);

QUnit.test(
    'Scrollbar without navigator (#5709).',
    function (assert) {
        var done = assert.async();

        $('#container').highcharts('StockChart', {
            chart: {
                zoomType: 'xy'
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: true,
                showFull: true
            }
        }, function (chart) {
            setTimeout(function () {
                chart.addSeries({
                    data: [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1]
                });
                assert.strictEqual(
                    chart.scroller.scrollbar.group.translateY >= 0,
                    true,
                    'Correct position for a scrollbar'
                );
                done();
            }, 1);
        });
    }
);

QUnit.test('Missing points using navigator (#5699)', function (assert) {
    var container = $('#container'),
        chart = container.highcharts('StockChart', {
            chart: {
                width: 600,
                height: 400
            }
        }).highcharts(),
        offset = container.offset(),
        navigator = chart.scroller,
        done = assert.async();

    chart.addSeries({
        type: 'column',
        name: 'USD to EUR',
        data: usdeur
    });

    navigator.handlesMousedown({
        pageX: offset.left + 578,
        pageY: offset.top + 400 - 30
    }, 0);

    navigator.mouseMoveHandler({
        pageX: offset.left + 309,
        pageY: offset.top + 400 - 30,
        DOMType: 'mousemove'
    });

    setTimeout(function () {
        navigator.hasDragged = true;
        navigator.mouseUpHandler({
            pageX: offset.left + 308,
            pageY: offset.top + 400 - 30,
            DOMType: 'mouseup'
        });
        assert.strictEqual(
            chart.series[0].points !== null,
            true,
            'Points exist.'
        );
        done();
    }, 0);
});

QUnit.test('#3961 - Zone zAxis shouldn\'t cause errors in Navigator series.', function (assert) {
    var chart = $('#container').highcharts('StockChart', {
        series: [{
            type: 'bubble',
            data: [
                [0, 10, 20],
                [1, 10, 20]
            ]
        }]
    }).highcharts();

    assert.strictEqual(
        chart.scroller.handles.length !== 0, // handles are not rendered when we get error in zones
        true,
        'No errors in zones for bubble series.'
    );
});
