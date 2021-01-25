QUnit.test('Test dynamic behaviour of Scrollable PlotArea', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            scrollablePlotArea: {
                minWidth: 2000,
                scrollPositionX: 1
            }
        }
    });

    chart.setTitle({ text: 'New title' });

    assert.equal(
        chart.title.element.parentNode.parentNode.classList.contains(
            'highcharts-fixed'
        ),
        true,
        'Title should be outside the scrollable plot area (#11966)'
    );
});

QUnit.test('Responsive scrollable plot area (#12991)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            scrollablePlotArea: {
                minHeight: 400
            },
            height: 300
        },
        series: [
            {
                data: [1]
            }
        ]
    });

    chart.setSize(null, 500);

    assert.ok(
        document.getElementsByClassName('highcharts-scrolling')[0]
            .clientHeight > 300,
        'The scrollbar should disasppear after increasing the height of the chart (#12991)'
    );
});

QUnit.test(
    'The radial axes like in the gauge series should have the ability to scroll, #14379.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'gauge',
                scrollablePlotArea: {
                    minWidth: 700
                }
            },
            pane: [
                {
                    startAngle: -90,
                    size: '50.0%',
                    center: ['20.0%', '40%'],
                    endAngle: 90
                },
                {
                    startAngle: -90,
                    size: '50.0%',
                    center: ['60.0%', '40%'],
                    endAngle: 90
                }
            ],
            yAxis: [
                {
                    min: 0,
                    max: 200,
                    tickPixelInterval: 50,
                    pane: 0
                },
                {
                    min: 0,
                    max: 200,
                    tickPixelInterval: 50,
                    pane: 1
                }
            ],
            series: [
                {
                    data: [80]
                },
                {
                    data: [90],
                    yAxis: 1
                }
            ]
        });

        assert.notOk(
            chart.yAxis[0].axisGroup.element.parentNode.parentNode.classList
                .contains('highcharts-fixed'),
            'yAxis should not have that class.'
        );
    }
);
