QUnit.test(
    'The title should have correct font-size (#2944)',
    function (assert) {
        var chart;

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
    var chart = Highcharts.chart('container', {
        chart: {
            width: 500,
            borderWidth: 1,
            height: 150
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
        !/\</g.test(ariaValue),
        '"<" should not be included in aria-label#17753'
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
});
