$(function () {
    var iterator = 0,
        type;
    function update(e) {
        var series = this.chart ? this.chart.series[0] : this.series[0];
        iterator++;
        type = e.type;
        series.update({});
    }

    QUnit.test('AfterSetExtremes should not be called after updating series without changes.', function (assert) {
        var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    events: {
                        load: update
                    }
                },
                xAxis: {
                    events: {
                        afterSetExtremes: update
                    }
                },
                series: [{
                    data: [5, 15]
                }]
            });

        assert.strictEqual(
            iterator === 1 && type !== 'afterSetExtremes',
            true,
            'No after afterSetExtremes callback calls.'
        );
    });
});
