/*
QUnit.test('Chart destroy', function (assert) {

    var chart = Highcharts
        .chart('container', {
            chart: {
                height: 300
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

    assert.strictEqual(
        typeof chart.series,
        'object',
        'Properties available'
    );

    chart.destroy();

    assert.strictEqual(
        chart.series,
        undefined,
        'Properties deleted'
    );

    assert.strictEqual(
        document.getElementById('container').innerHTML,
        '',
        'Container emptied'
    );

});
*/

QUnit.test('Destroy in own callback', function (assert) {

    var done = assert.async();

    Highcharts.chart('container', {
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    }, function () {

        assert.strictEqual(
            typeof this.series,
            'object',
            'Properties available'
        );

        this.destroy();

        /*assert.strictEqual(
            this.series,
            undefined,
            'Properties deleted'
        );

        assert.strictEqual(
            document.getElementById('container').innerHTML,
            '',
            'Container emptied'
        );*/

        done();

    });

});

// Highcharts 4.0.4, Issue #3600: No-data-to-display module broken with chart creation in callback
QUnit.test('Destroy in own callback and recreate (#3600)', function (assert) {

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
