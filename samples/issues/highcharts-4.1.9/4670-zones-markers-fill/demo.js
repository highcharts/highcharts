$(function () {
    QUnit.test('Point markers fills should be taken from zones on hover.', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                data: [-6, -1, 4, 9, 14, 19, 14, 14, 9, 4, -1],
                zones: [{
                    value: -5,
                    color: 'orange'
                }, {
                    value: 0,
                    color: 'red'
                }, {
                    value: 20,
                    color: 'green'
                }]
            }, {
                    // set on series level: state.hover
                marker: {
                    states: {
                        hover: {
                            fillColor: 'yellow'
                        }
                    }
                },
                data: [-10, -5, 0, {
                    y: 5,
                        // set on point level: state.hover
                    marker: {
                        states: {
                            hover: {
                                fillColor: 'black'
                            }
                        }
                    }
                },
                    10, 15, 10, 10, 5, 0, -5],
                zones: [{
                    value: -5,
                    color: 'orange'
                }, {
                    value: 0,
                    color: 'red'
                }, {
                    value: 20,
                    color: 'green'
                }]
            }]
        }).highcharts();

        chart.series[0].points[3].setState('hover');
        chart.series[1].points[3].setState('hover');
        chart.series[1].points[5].setState('hover');

        assert.strictEqual(
            chart.series[0].points[3].graphic.attr("fill"),
            "green",
            'Proper color for a marker - inherited from zones.'
        );

        assert.strictEqual(
            chart.series[1].points[3].graphic.attr("fill"),
            "black",
            'Proper color for a marker - point.states.hover.'
        );

        assert.strictEqual(
            chart.series[1].points[5].graphic.attr("fill"),
            "yellow",
            'Proper color for a marker - point.states.hover.'
        );
    });
});