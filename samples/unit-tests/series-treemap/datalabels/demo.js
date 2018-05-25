// Highcharts 4.1.1, Issue 3844
// treemap - colorByPoint is not working
QUnit.test('Treemap: useHTML causes that data label is misplaced (#8159)', function(assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                height: 200
            },

            series: [{
                type: 'treemap',
                dataLabels: {
                    useHTML: true,
                    borderWidth: 1,
                    borderColor: 'black'
                },
                layoutAlgorithm: 'stripes',
                data: [{
                    name: 'A',
                    value: 6,
                    colorValue: 1,
                }, {
                    name: 'Bbbbbbbbbbbbb bbbbbbbbbbbbb',
                    value: 6,
                    colorValue: 2
                }, {
                    name: 'Ccccccccccc',
                    value: 4,
                    colorValue: 3
                }]
            }]
        }),
        series = chart.series[0],
        point1dataLabel = series.points[1].dataLabel,
        point2dataLabel = series.points[2].dataLabel;


    assert.notStrictEqual(
        point2dataLabel.visibility,
        'hidden',
        "The second point's data label shouldn't overlap (and hide) the third point's datalabel."
    );

    assert.strictEqual(
        point1dataLabel.getBBox(true).height > point1dataLabel.text.getBBox(true).height,
        true,
        "Data label text (second point) should fit in its box."
    );

});
