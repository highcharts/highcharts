QUnit.test(
    'Flags should get fill color from point options in a first place (#5978).',
    function (assert) {
        var color = "#ff0000",
            chart = Highcharts.stockChart('container', {
                series: [{
                    data: [10, 20, 30]
                }, {
                    type: 'flags',
                    data: [{
                        x: 1,
                        title: 'F',
                        text: "FlagText",
                        fillColor: color,
                        color: "#0000ff"
                    }]
                }]
            });

        assert.strictEqual(
            chart.series[1].points[0].graphic.box.attr('fill'),
            color,
            'Correct color for a fill'
        );
    }
);