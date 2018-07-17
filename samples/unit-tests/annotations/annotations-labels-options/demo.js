
QUnit.test('Setting graphic attributes for a label', function (assert) {
    var expected = {
            text: 'Max',
            backgroundColor: 'blue',
            borderColor: 'black',
            borderRadius: 1,
            borderWidth: 2,
            padding: 10,
            shape: 'callout',
            style: {
                fontSize: '20px'
            }
        },

        chart = Highcharts.chart('container', {
            series: [{
                data: [{ y: 29.9, id: 'max' }]
            }],

            annotations: [{
                labels: [Highcharts.merge(expected, { point: 'max' })]
            }]
        }),

        label = chart.annotations[0].labels[0],

        actual = {
            text: label.text.textStr,
            backgroundColor: label.box.attr('fill'),
            borderColor: label.box.stroke,
            borderRadius: label.box.r,
            borderWidth: label.box['stroke-width'],
            padding: label.padding,
            shape: label.box.symbolName,
            style: {
                fontSize: label.text.styles.fontSize
            }
        };

    assert.deepEqual(actual, expected);
});