$(function () {
    QUnit.test('Check tooltip for flags with useHTML: true (#6303).', function (assert) {
        assert.expect(4); // 2 per flag
        var done = assert.async(4);

        var chart = Highcharts.chart('container', {
                chart: {
                    width: 500,
                    height: 400
                },
                series: [{
                    data: [1, 2, 3],
                    id: 's1'
                }, {
                    useHTML: true,
                    type: 'flags',
                    onSeries: 's1',
                    data: [{
                        x: 1,
                        title: 'XXXXXXXXXXXXXXXX'
                    }],
                    width: 20,
                    height: 120
                }, {
                    useHTML: true,
                    type: 'flags',
                    data: [{
                        x: 1,
                        title: 'XXXXXXXXXXXXXXXX'
                    }],
                    width: 20,
                    height: 120
                }],
                tooltip: {
                    formatter: function() {
                        console.log(this);
                        assert.ok( true, "Tooltip displayed for flag" );
                        done();
                        return 'OK';
                    }
                }
            });

        // Instanciate
        var controller = TestController(chart);

        controller.trigger('mouseover', 290, 200); // flag (on series) - SVG
        controller.trigger('mouseover', 290, 330); // flag (on axis) - SVG
        controller.trigger('mouseover', 250, 170); // flag (on series) - HTML
        controller.trigger('mouseover', 250, 300); // flag (on axis) - HTML
    });
});
