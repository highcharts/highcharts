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

        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    var point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.renderer.box
            .querySelector('.highcharts-tooltip-box').nodeName,
        'path',
        'A label box should be generated'
    );

});

QUnit.test('Outside tooltip should inherit chart style', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 400,
            style: {
                fontFamily: 'Papyrus'
            }
        },
        tooltip: {
            outside: true
        },
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    var point = chart.series[0].points[0];

    // Set hoverPoint
    point.onMouseOver();

    assert.strictEqual(
        chart.tooltip.renderer.box
            .querySelector('.highcharts-tooltip').parentNode.style.fontFamily,
        'Papyrus',
        'Tooltip container should inherit chart style'
    );
});