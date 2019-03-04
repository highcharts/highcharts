// Highcharts 4.1.1, Issue 3844
// treemap - colorByPoint is not working
QUnit.test('Treemap: useHTML causes that data label is misplaced (#8159)', function (assert) {
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
                    colorValue: 1
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


QUnit.test("Treemap: data label exceeds point's boundaries (#8160)", function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 300
            },
            series: [{
                type: 'treemap',
                layoutAlgorithm: 'stripes',
                dataLabels: {
                    useHTML: false
                },
                data: [{
                    name: 'Aaa Aaa Aaa Aaa Aaa Aaa Aaa Aaa',
                    value: 6,
                    colorValue: 1
                }, {
                    name: 'B',
                    value: 6,
                    colorValue: 2
                }, {
                    name: 'Ccccccccccccccccccccccccc cccccccc',
                    value: 4,
                    colorValue: 3
                }, {
                    name: 'D',
                    value: 3,
                    colorValue: 4
                }, {
                    name: 'E',
                    value: 2,
                    colorValue: 5
                }, {
                    name: 'F',
                    value: 2,
                    colorValue: 6
                }, {
                    name: 'Gggggg',
                    value: 1,
                    colorValue: 7
                }]
            }]
        }),
        series = chart.series[0],
        points = series.points,
        isLabelsWidthCorrect = true,
        dataLabel,
        width,
        i;


    for (i = 0; i < points.length; i++) {
        dataLabel = points[i].dataLabel;
        width = dataLabel.options.style.width;
        if (dataLabel.text.getBBox(true).width > width) {
            isLabelsWidthCorrect = false;
            break;
        }
    }

    assert.strictEqual(
        isLabelsWidthCorrect,
        true,
        "Data label(s) text shouldn't be wider than its box (useHTML: false)."
    );

    series.update({
        dataLabels: {
            useHTML: true
        }
    });
    isLabelsWidthCorrect = true;
    points = series.points; // update the reference

    for (i = 0; i < points.length; i++) {
        dataLabel = points[i].dataLabel;
        width = dataLabel.options.style.width;
        if (dataLabel.text.element.scrollWidth > width) {
            isLabelsWidthCorrect = false;
            break;
        }
    }

    assert.strictEqual(
        isLabelsWidthCorrect,
        true,
        "Data label(s) text shouldn't be wider than its box (useHTML: true)."
    );


});

