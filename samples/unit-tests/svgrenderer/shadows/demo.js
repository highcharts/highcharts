QUnit.test('Series shadows', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    shadow: {
                        color: 'red',
                        width: 10,
                        offsetX: 40,
                        offsetY: -20,
                        opacity: 0.05
                    },
                    data: [29, 71, 106, 129, 144]
                }
            ]
        }),
        attributes = [
            'stroke="blue"',
            'stroke-opacity="0.2"',
            'transform="translate(0, 20)'
        ],
        defaultAttributes = [
            'stroke="#000000"',
            'stroke-opacity="0.15"',
            'transform="translate(1, 1)'
        ];

    chart.series[0].update({
        shadow: {
            width: 20,
            offsetY: 20,
            color: 'blue',
            opacity: 0.2,
            offsetX: 0
        }
    });

    function checkAttributes(shadows, attributes) {
        var res = true,
            outerHTML = shadows[shadows.length - 1].outerHTML;

        attributes.forEach(function (attr) {
            if (outerHTML.indexOf(attr) === -1) {
                res = false;
            }
        });

        return res;
    }

    assert.ok(
        checkAttributes(chart.series[0].graph.shadows, attributes),
        'Shadows should be updated (#12091).'
    );

    assert.strictEqual(
        chart.series[0].graph.shadows.length,
        20,
        'Shadows amount should be correct (#12091).'
    );

    chart.series[0].update({
        shadow: true
    });

    assert.ok(
        checkAttributes(chart.series[0].graph.shadows, defaultAttributes),
        'Shadows should be updated when old options defined as object and new as boolean (#12091).'
    );

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [
            {
                shadow: true,
                data: [29, 71, 106, 129, 144]
            }
        ]
    });

    attributes = [
        'stroke="red"',
        'stroke-opacity="0.3"',
        'transform="translate(10, 5)'
    ];

    chart.series[0].update({
        shadow: {
            width: 20,
            offsetY: 10,
            color: 'red',
            opacity: 0.3,
            offsetX: 5
        }
    });

    assert.ok(
        checkAttributes(chart.series[0].graph.shadows, attributes),
        'Shadows should be updated when old options defined as boolean and new as object (#12091).'
    );

    chart.update({
        chart: {
            inverted: false,
            type: 'pie'
        },
        series: [{
            shadow: true
        }]
    });

    chart.series[0].update();

    assert.ok(
        checkAttributes(
            [chart.series[0].shadowGroup.element],
            defaultAttributes
        ),
        'Shadow group should not be hidden after series update (#17288).'
    );
});
