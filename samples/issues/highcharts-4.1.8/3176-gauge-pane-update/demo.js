
$(function () {
    QUnit.test("Pane backgrounds, plot bands and chart updating", function (assert) {
        var chart, options;

        function getOptions() {

            return {

                chart: {
                    type: 'gauge'
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(255, 255, 255, 0.5)'],
                                [1, 'rgba(96, 96, 96, 0.5)']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(255, 255, 255, 0.5)'],
                                [1, 'rgba(96, 96, 96, 0.5)']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: 'rgba(192, 192, 192, 0.5)',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // the value axis
                yAxis: [{
                    min: 0,
                    max: 200

                }],

                series: [{
                    data: [80]
                }]

            };
        }

        chart = $('#container').highcharts(getOptions()).highcharts();

        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands.length,
            4,
            "No bands, four backgrounds initially"
        );

        // Run update
        chart.yAxis[0].update({
            min:0,
            max:400
        });

        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands.length,
            4,
            "No bands, four backgrounds after update"
        );


        // Add an initial plot band
        options = getOptions();
        options.yAxis[0].plotBands = [{
            from: 0,
            to: 80,
            color: 'green'
        }];
        chart = $('#container').highcharts(options).highcharts();

        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands.length,
            5,
            "One band, four backgrounds initially"
        );

        // Run update
        chart.yAxis[0].update({
            min:0,
            max:400
        });

        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands.length,
            5,
            "One band, four backgrounds after update"
        );
    });
});