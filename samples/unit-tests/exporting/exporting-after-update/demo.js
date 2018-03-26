
QUnit.test('#6007 - exporting after chart.update()', function (assert) {

    var chart = Highcharts
        .chart('container', {
            series: [{
                data: [5, 10]
            }]
        });

    var clock = null;

    try {

        clock = lolexInstall();

        var done = assert.async();

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
        }, 1);

        lolexRunAndUninstall(clock);

    } finally {

        lolexUninstall(clock);

    }

});
