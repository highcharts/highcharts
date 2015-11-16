$(function () {
    QUnit.test('Zoom buttons aligned to plotBox.', function (assert) {
        var chart = $('#container').highcharts('Map', {
            chart: {
                plotBorderWidth: 1
            },
            mapNavigation: {
                buttonOptions: {
                    alignTo: 'plotBox'
                },
                enabled: true
            }
        }).highcharts();

        assert.strictEqual(
            chart.renderer.alignedObjects[2].y,
            chart.plotTop,
            'Zoom buttons aligned to plotBox'
        );
    });
});