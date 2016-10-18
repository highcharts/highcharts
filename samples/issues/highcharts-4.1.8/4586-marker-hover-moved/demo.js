$(function () {
    QUnit.test("Marker should not move after hover", function (assert) {
        var chart = $('#container').highcharts({
            plotOptions: {
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },

            series: [
                {
                    lineWidth: 0,
                    marker: {
                        symbol: 'circle',
                        radius: 47,
                        lineWidth: 2,
                        lineColor: 'green',
                        fillColor: 'rgba(0,0,0,0)'
                    },
                    data: [
                        {
                            x: 3.2,
                            y: 5.3
                        },
                        {
                            x: 6.1,
                            y: 6.4
                        },
                        {
                            x: 9.0,
                            y: 7.0
                        },
                        {
                            x: 11.9,
                            y: 8.1
                        },
                        {
                            x: 14.7,
                            y: 9.7
                        }
                    ]
                }
            ]
        }).highcharts();

        var markerX = chart.series[0].points[1].graphic.attr('x');

        chart.series[0].points[1].onMouseOver();
        chart.series[0].points[1].onMouseOut();
        assert.strictEqual(
            chart.series[0].points[1].graphic.attr('x'),
            markerX,
            'Correct position'
        );

    });

});