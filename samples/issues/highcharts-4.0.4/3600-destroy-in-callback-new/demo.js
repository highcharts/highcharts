$(function () {
    QUnit.test('Destroy in callback', function (assert) {
        var newChart;
        Highcharts.chart('container', {
            chart: {
                test: false
            },
            series: [{
                animation: false,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }, function () {
            var opts = this.options;
            delete opts.chart.test; // run as normal
            this.destroy();
            newChart = Highcharts.chart('container', opts);
            newChart.setTitle({
                text: 'New chart title'
            });
        });

        assert.equal(
            newChart.options.title.text,
            'New chart title',
            'New chart generated'
        );

    });

});