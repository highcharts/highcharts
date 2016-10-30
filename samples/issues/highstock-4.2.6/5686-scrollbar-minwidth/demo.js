$(function () {
    QUnit.test('Scrollbar bar should always be between buttons, on the track.', function (assert) {
        var minWidth = 40,
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                yAxis: {
                    max: 5,
                    scrollbar: {
                        enabled: true,
                        minWidth: minWidth
                    }
                },
                series: [{
                    data: [0, 1000]
                }]
            }),
            scrollbar = chart.yAxis[0].scrollbar;

        assert.strictEqual(
        minWidth + scrollbar.scrollbarGroup.translateY <= scrollbar.scrollbarButtons[1].translateY,
        true,
        'Correct scrollbar bar position.'
        );
    });
});
