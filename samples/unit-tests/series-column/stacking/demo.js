QUnit.test('Negative stack with just one point should be also calculate (#4979)', function (assert) {

    var chart = $('#container').highcharts({
            chart: {
                type: 'column'
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    stacking: 'percent'
                }
            },
            series: [{
                data: [-10]
            }, {
                data: [10]
            }]
        }).highcharts(),
        oldHeight = chart.series[0].points[0].graphic.getBBox(true).height;

    chart.series[0].addPoint(-10, false);
    chart.series[1].addPoint(10);

    assert.strictEqual(
        oldHeight,
        chart.series[0].points[0].graphic.getBBox(true).height,
        'Correct height for a negative point'
    );
});

QUnit.test('Column outside plot area(#4264)', function (assert) {
    var chart;

    $('#container').highcharts({
        chart: {
            type: 'column',
            zoomType: 'xy'
        },
        title: {
            text: 'Historic World Population by Region'
        },
        subtitle: {
            text: 'Source: Wikipedia.org'
        },
        xAxis: {
            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania', 'a', 'b', 'c'],
            title: {
                text: null
            },
            min: 0
        },
        yAxis: {
            min: -290,
            max: -230,
            title: {
                text: 'Population (millions)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                animation: false
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Year 1800',
            data: [107, -31, 63]
        }, {
            name: 'Year 1900',
            data: [133, -156, 97]
        }, {
            name: 'Year 2008',
            data: [-97, -91, 44]
        }]
    });

    chart = $('#container').highcharts();


    assert.equal(
        chart.series[0].points[0].graphic.attr('y') + chart.series[0].points[0].graphic.attr('height') < 0,
        true,
        'Column is above plot area'
    );

});
// Highchart 3.0.10, Issue #2592
// column with stacking = 'normal' draws only last point in stack
QUnit.test(
    'Single series stacking (#2592)',
    function (assert) {

        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Points in the same X value should be allowed in the same series'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: 'John',
                    data: [
                        [0, 5],
                        [0, 6],
                        [1, 10]
                    ]
                }, {
                    name: 'Jane',
                    data: [
                        [0, 2],
                        [1, 2]
                    ]
                }]
            }),
            data1 = chart.series[0].data,
            data2 = chart.series[1].data;

        for (var i = 0, ie = data1.length; i < ie; ++i) {
            assert.ok(
                data1[i].graphic.element,
                'There should be an SVG element for each data point.'
            );
        }

        for (var j = 0, je = data2.length; j < je; ++j) {
            assert.ok(
                data2[j].graphic.element,
                'There should be an SVG element for each data point.'
            );
        }
    }
);

// Issue #7420
// stacking column graph and threshold: null
QUnit.test(
    'Null threshold (#7420)',
    function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    threshold: null
                }
            },

            series: [{
                data: [1]
            }, {
                data: [2]
            }]
        });

        assert.notEqual(
            chart.series[0].points[0].graphic.element.getBBox().height,
            0,
            'The points should have an extent'
        );

    }
);