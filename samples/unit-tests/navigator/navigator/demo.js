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
