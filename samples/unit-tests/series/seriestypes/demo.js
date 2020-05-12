Object.keys(Highcharts.seriesTypes).forEach(function (type) {

    if (
        // Don't test indicator series (yet), they have more complex setup
        !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&

        // Complains about a missing axis
        type !== 'scatter3d'
    ) {

        QUnit.test(`No errors in the console during initialization with no data for ${type} series.`, assert => {
            const chart = Highcharts.chart('container', {
                chart: {
                    type: type
                }
            });

            assert.ok(
                true,
                'No errors in console when series is not declared.'
            );

            chart.addSeries({
                name: 'Test series'
            });

            assert.ok(
                true,
                'No errors in console after adding empty series.'
            );

            chart.series[0].update({
                data: []
            });

            assert.ok(
                true,
                'No errors in console after updating series with empty data.'
            );
        });
    }
});