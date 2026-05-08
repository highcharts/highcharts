QUnit.test('Ellipsis should be reset after zoom (#4678)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            zoomType: 'x',
            animation: false,
            width: 600
        },

        xAxis: {
            categories: [
                'Jan Jan Jan ',
                'Feb Feb Feb ',
                'Mar Mar Mar Mar Mar Mar Mar Mar Mar Mar Mar Mar ',
                'Apr Apr Apr Apr Apr Apr Apr Apr Apr Apr Apr Apr ',
                'May May May May May May May May May May May May ',
                'Jun Jun Jun Jun Jun Jun Jun Jun Jun Jun Jun Jun ',
                'Jul Jul Jul Jul Jul Jul Jul Jul Jul Jul Jul Jul ',
                'Aug Aug Aug Aug Aug Aug Aug Aug Aug Aug Aug Aug ',
                'Sep Sep Sep Sep Sep Sep Sep Sep Sep Sep Sep Sep ',
                'Oct Oct Oct Oct Oct Oct Oct Oct Oct Oct Oct Oct ',
                'Nov Nov Nov Nov Nov Nov Nov Nov Nov Nov Nov Nov ',
                'Dec Dec Dec Dec Dec Dec Dec Dec Dec Dec Dec Dec '
            ],
            labels: {
                style: {
                    fontFamily: 'monospace'
                }
            }
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ]
            }
        ]
    });

    assert.strictEqual(
        typeof chart.xAxis[0].ticks[0].label.getBBox().height,
        'number',
        'Sanity check'
    );
    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.getBBox().height,
        chart.xAxis[0].ticks[11].label.getBBox().height,
        'Same height labels'
    );

    // Zoom in
    chart.xAxis[0].setExtremes(0, 5);
    assert.strictEqual(
        chart.xAxis[0].ticks[11],
        undefined,
        'Last tick is gone'
    );

    // Zoom out
    chart.xAxis[0].setExtremes();
    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.getBBox().height,
        chart.xAxis[0].ticks[11].label.getBBox().height,
        'Same height labels'
    );
});

QUnit.test(
    '#5034: No ellipsis for multiline labels where there is room',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'bar',
                width: 450
            },
            xAxis: {
                categories: [
                    'Cat1',
                    'Cat2 bla bla bla bla bla bla bla bla bla bla',
                    'Cat3 bla bla bla bla bla bla bla'
                ]
            },
            series: [
                {
                    data: [1, 2, 3]
                }
            ]
        });

        assert.ok(
            chart.xAxis[0].ticks[1].label.getBBox().height >
                chart.xAxis[0].ticks[0].label.getBBox().height,
            'Second label is multiple lines'
        );

        assert.strictEqual(
            chart.xAxis[0].ticks[1].label.getBBox().height,
            chart.xAxis[0].ticks[2].label.getBBox().height,
            'Third label is same as second'
        );

        // #22961
        chart.update({
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category',
                labels: {
                    useHTML: true,
                    style: {
                        whiteSpace: 'nowrap'
                    },
                    format: '<span style="font-weight: 700">FOO: </span>foo ' +
                    '{value}<br/><span style="font-weight: 700">BAR: </span>' +
                    'foo_bar_1<br/><span style="font-weight: 700">' +
                    'FOO_FOO_BAR: </span>foo_foo_bar_1'
                }
            },
            series: [{
                data: [
                    { name: 'A', y: 27 },
                    { name: 'B', y: 24 },
                    { name: 'C', y: 25 },
                    { name: 'D', y: 24 }
                ]
            }]
        });

        const label = chart.xAxis[0].ticks[0].label;

        label.css({
            width: '100px',
            lineClamp: 1
        });

        const clampedHeight = label.element.offsetHeight;

        chart.setSize(900, false);

        const unwrappedHeight = label.element.offsetHeight;

        assert.ok(
            unwrappedHeight > clampedHeight,
            '#22961: The label bounding box height should increase ' +
            'significantly when the line-clamp is disabled.'
        );
    }
);
