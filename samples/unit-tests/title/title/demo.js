QUnit.test(
    'The title should have correct font-size (#2944)',
    function (assert) {
        let chart;

        chart = $('#container')
            .highcharts('StockChart', {
                title: {
                    text: 'AAPL Stock Price'
                },
                series: [
                    {
                        data: [1, 2, 3]
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            chart.title.styles.fontSize,
            '1em',
            'Font size should be Stock specific default'
        );

        Highcharts.setOptions({
            title: {
                style: {
                    fontSize: '8px'
                }
            }
        });

        chart = $('#container')
            .highcharts('StockChart', {
                title: {
                    text: 'AAPL Stock Price'
                },
                series: [
                    {
                        data: [1, 2, 3]
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            chart.title.styles.fontSize,
            '8px',
            'Font size is 8px'
        );
        delete Highcharts.defaultOptions.title.style;

        chart = $('#container')
            .highcharts('StockChart', {
                title: {
                    text: 'AAPL Stock Price',
                    style: {
                        fontSize: '30px'
                    }
                },
                series: [
                    {
                        data: [1, 2, 3]
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            chart.title.styles.fontSize,
            '30px',
            'Font size is 30px'
        );

        // Reset
        delete Highcharts.defaultOptions.title.style;
    }
);

QUnit.test('Title alignment', function (assert) {
    let redraws = 0;
    var chart = Highcharts.chart('container', {
        chart: {
            width: 500,
            borderWidth: 1,
            height: 150,
            events: {
                redraw: () => redraws++
            }
        },
        exporting: {
            enabled: false
        },
        title: {
            useHTML: true,
            align: 'right',
            text: `Here is a title that helps show the issue, < it is pretty
                long`
        }
    });

    assert.ok(
        chart.title.element.offsetLeft + chart.title.element.offsetWidth <
            chart.chartWidth,
        'The title should not spill out of the chart area (#7787)'
    );

    const ariaValue = document.getElementById('container')
        .getAttribute('aria-label');

    assert.ok(
        /\</g.test(ariaValue),
        '"<" can be included in aria-label if not for export (#17753, #19002)'
    );

    chart.update({
        title: {
            align: 'center',
            useHTML: false
        }
    });

    assert.strictEqual(
        chart.title.element.querySelectorAll('tspan').length,
        1,
        'The text should contain one break'
    );

    redraws = 0;
    assert.strictEqual(
        redraws,
        0,
        'Reset redraws for initial render'
    );

    chart.update({
        chart: {
            style: {
                fontSize: '0.5rem'
            }
        }
    });
    assert.strictEqual(
        chart.title.element.querySelectorAll('tspan').length,
        0,
        'The text should reflow and contain no breaks'
    );

    assert.strictEqual(
        redraws,
        1,
        'There should be only one redraw call for changing generic font size'
    );

    redraws = 0;
    chart.update({
        title: {
            style: {
                fontSize: '30px'
            }
        },
        subtitle: {
            text: 'New title',
            style: {
                fontSize: '30px'
            }
        }
    });

    assert.strictEqual(
        redraws,
        1,
        'There should be only one redraw call for changing title font size'
    );

});
