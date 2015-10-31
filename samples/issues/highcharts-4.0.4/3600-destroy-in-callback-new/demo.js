$(function () {
    QUnit.test('Destroy in callback', function (assert) {
        var chart,
            newChart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                animation: false,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }, function () {
            var opts = this.options;
            this.destroy();
            newChart = new Highcharts.Chart(opts);
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