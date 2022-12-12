QUnit.test('Data labels, useHTML and defer (#5075)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                type: 'column',
                animation: true,
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    defer: true
                },
                data: [1000, 2000, 3000]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].dataLabelsGroup.div.nodeName,
        'DIV',
        'The data labels group has a HTML counterpart'
    );
    assert.strictEqual(
        chart.series[0].dataLabelsGroup.div.style.opacity,
        '0',
        'And that div is hidden'
    );
});
QUnit.test(
    '#7287: Correct class for the last dataLable when useHTML',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [
                    {
                        type: 'bar',
                        data: [3, 2, 1],
                        dataLabels: {
                            enabled: true,
                            useHTML: true
                        }
                    }
                ]
            }),
            point = chart.series[0].points[2];

        assert.strictEqual(
            /highcharts-data-labels/.test(
                point.dataLabel.element.getAttribute('class')
            ),
            false,
            'Single dataLabel doesn\'t have "highcharts-data-labels" class.'
        );
    }
);

QUnit.test(
    '#6794: "cursor: pointer" works when useHTML is enabled.',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [
                    {
                        type: 'bar',
                        data: [1],
                        dataLabels: {
                            enabled: true,
                            useHTML: true,
                            style: {
                                cursor: 'pointer'
                            }
                        }
                    }
                ]
            }),
            point = chart.series[0].points[0];

        assert.strictEqual(
            window.getComputedStyle(point.dataLabel.div.children[0])
                .getPropertyValue('cursor'),
            'pointer',
            'Data label\'s \'cursor\' attribute equals to \'pointer\''
        );
    }
);

QUnit.test('#10527: useHTML and textPath', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    textPath: {
                        enabled: true
                    }
                },
                data: [1, 3, 2]
            }
        ]
    });

    chart.series[0].hide();
    chart.series[0].show();

    assert.ok('No errors when enabling useHTML and textPath options together.');
});

QUnit.test('#10765: rotated dataLabels support useHTML', function (assert) {
    Highcharts.chart('container', {
        series: [
            {
                dataLabels: {
                    enabled: true,
                    rotation: 10,
                    useHTML: true,
                    formatter: function () {
                        return '<span class=\'myLabel\'>205.00</span>';
                    }
                },
                data: [1, 3, 2]
            }
        ]
    });
    const label = document.querySelector('.myLabel');

    assert.strictEqual(
        label.nodeName,
        'SPAN',
        'Created dataLabel should be rendered as HTML element, not SVG (#10765).'
    );
});
