QUnit.test('#6007 - exporting after chart.update()', function (assert) {
    var done = assert.async(),
        chart = Highcharts.chart('container', {
            series: [{
                data: [5, 10]
            }]
        }),
        exportingButton,
        offset;

    setTimeout(function () {
        chart.exportSVGElements[0].element.onclick();

        chart.update({
            exporting: {
                chartOptions: {
                    title: {
                        text: 'test'
                    }
                }
            }
        });

        chart.exportSVGElements[0].element.onclick();

        assert.strictEqual(
            document.getElementsByClassName('highcharts-contextmenu').length,
            1,
            'Menu opened without errors - exists in DOM'
        );
        done();
    });
});