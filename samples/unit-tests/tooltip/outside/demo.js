QUnit.test('Outside tooltip and styledMode (#11783)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            styledMode: true,
            width: 200,
            height: 200
        },

        tooltip: {
            outside: true
        },

        series: [
            {
                data: [1, 3, 2, 4]
            }
        ]
    });

    var point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.renderer.box.querySelector('.highcharts-tooltip-box')
            .nodeName,
        'path',
        'A label box should be generated'
    );
});

QUnit.test('Outside tooltip styling', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 400,
            style: {
                fontFamily: 'Papyrus',
                zIndex: 1334
            }
        },
        tooltip: {
            outside: true
        },
        series: [
            {
                data: [1, 3, 2, 4]
            }
        ]
    });

    var point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.renderer.box.querySelector('.highcharts-tooltip')
            .parentNode.style.fontFamily,
        'Papyrus',
        'Tooltip container should inherit chart style'
    );

    assert.strictEqual(
        chart.tooltip.container.style.zIndex,
        '1337',
        '#11494: Tooltip container zIndex should be based on chart.style.zIndex'
    );

    chart.tooltip.update({
        style: {
            zIndex: 1881
        }
    });
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.container.style.zIndex,
        '1881',
        '#11494: Setting tooltip.style.zIndex should also work'
    );
});

QUnit.test('Tooltip visibility after the scrollablePlotArea change, #17352.',
    assert => {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'spline',
                scrollablePlotArea: {
                    minHeight: 200
                }
            },
            series: [{
                data: [0, 1, 2, 3, 4]
            }]
        });

        document.getElementById('container').style.height = "190px";
        chart.reflow();

        document.getElementById('container').style.height = "400px";
        chart.reflow();

        chart.tooltip.refresh(chart.series[0].points[0]);

        assert.notOk(
            chart.tooltip.isHidden,
            `After updating the scrollablePlotArea, the tooltip should be still
            visible.`
        );
    }
);
