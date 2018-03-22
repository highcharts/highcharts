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