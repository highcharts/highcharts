/**
 * Note: These test mostly exists to confirm that the test environment injects
 * CSS correctly
 */

QUnit.test('CSS variables should be set', function (assert) {
    const container = document.querySelector('#container');
    container.classList.add('highcharts-light');

    Highcharts.chart(
        container,
        {
            chart: {
                styledMode: true,
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3]
            }]
        }
    );

    container.querySelector('.highcharts-background').style.transition = 'none';

    assert.ok(
        container.classList.contains('highcharts-light'),
        'The initial class name'
    );

    assert.strictEqual(
        getComputedStyle(
            container.querySelector('.highcharts-background')
        ).getPropertyValue('fill'),
        'rgb(255, 255, 255)',
        'The --highcharts-background-color should be set'
    );

    container.classList.remove('highcharts-light');
    container.classList.add('highcharts-dark');

    assert.ok(
        container.classList.contains('highcharts-dark'),
        'The class name should be swapped'
    );

    assert.strictEqual(
        getComputedStyle(
            container.querySelector('.highcharts-background')
        ).getPropertyValue('fill'),
        'rgb(20, 20, 20)',
        'The --highcharts-background-color should be swapped'
    );

    container.classList.remove('highcharts-dark');

});

// Skipped due to implementing variable-driven palette in v13
QUnit.skip(
    'CSS variables should be not be set when styled mode is false',
    function (assert) {
        const container = document.querySelector('#container');
        container.classList.add('highcharts-light');

        Highcharts.chart(
            container,
            {
                chart: {
                    styledMode: false,
                    type: 'bar'
                },
                series: [{
                    data: [1, 2, 3]
                }]
            }
        );

        const styles = getComputedStyle(container);
        assert.ok(container.classList.contains('highcharts-light'));

        assert.strictEqual(
            styles.getPropertyValue('--highcharts-background-color'),
            ''
        );
        container.classList.remove('highcharts-light');
    });

QUnit.test('Styled HTML text color and size (#25323)', function (assert) {
    const container = document.getElementById('container'),
        originalClass = container.className,
        style = document.createElement('style'),
        nested = '<div>Outer<div>Inner</div></div>',
        chart = Highcharts.chart(container, {
            chart: {
                styledMode: true
            },
            tooltip: {
                useHTML: true,
                format: 'Tooltip'
            },
            legend: {
                useHTML: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        format: 'Label'
                    }
                }
            },
            series: [{
                name: 'Series',
                data: [1, 2]
            }]
        });

    style.textContent = '.highcharts-container { color: rgb(255, 0, 255); }' +
        '.highcharts-legend-item * { transition: none !important; }' +
        '.highcharts-tooltip .custom-html-text { color: rgb(0, 128, 0); }';
    document.head.appendChild(style);

    function checkText(element, ratio, useHTML, message) {
        const computed = getComputedStyle(element),
            baseSize = parseFloat(getComputedStyle(chart.container).fontSize);

        assert.strictEqual(
            computed[useHTML ? 'color' : 'fill'],
            getComputedStyle(chart.yAxis[0].labelGroup.element).fill,
            message + ': neutral text color'
        );
        assert.close(
            parseFloat(computed.fontSize),
            baseSize * ratio,
            0.01,
            message + ': relative font size'
        );
        if (useHTML) {
            assert.strictEqual(
                element.parentNode.nodeName,
                'foreignObject',
                message + ': renderer-owned HTML root'
            );
            element.querySelectorAll('div').forEach(div => {
                assert.strictEqual(
                    getComputedStyle(div).color,
                    computed.color,
                    message + ': nested div inherits text color'
                );
                assert.strictEqual(
                    getComputedStyle(div).fontSize,
                    computed.fontSize,
                    message + ': nested div inherits size once'
                );
            });
        }
    }

    try {
        ['highcharts-light', 'highcharts-dark'].forEach(mode => {
            container.classList.remove('highcharts-light', 'highcharts-dark');
            container.classList.add(mode);
            [16, 20].forEach(fontSize => {
                chart.container.style.fontSize = fontSize + 'px';
                [true, false].forEach(useHTML => {
                    chart.update({
                        tooltip: { useHTML, format: 'Tooltip' },
                        legend: { useHTML },
                        plotOptions: {
                            series: {
                                dataLabels: { useHTML, format: 'Label' }
                            }
                        },
                        series: [{ name: 'Series' }]
                    });
                    chart.tooltip.refresh(chart.series[0].points[0]);
                    const series = chart.series[0],
                        message = mode + ', ' + fontSize + ', HTML=' + useHTML;

                    checkText(
                        chart.tooltip.label.text.element,
                        0.8, useHTML, message + ': tooltip'
                    );
                    checkText(
                        series.legendItem.label.element,
                        0.8, useHTML, message + ': legend'
                    );
                    checkText(
                        series.points[0].dataLabel.text.element,
                        0.7, useHTML, message + ': data label'
                    );

                    if (useHTML) {
                        chart.update({
                            tooltip: {
                                format: nested +
                                    '<span class="highcharts-header">Header' +
                                    '</span><span style="color: red">' +
                                    'Custom</span>'
                            },
                            plotOptions: {
                                series: { dataLabels: { format: nested } }
                            },
                            series: [{ name: nested }]
                        });
                        chart.tooltip.refresh(series.points[0]);
                        const text = chart.tooltip.label.text.element,
                            legend = chart.series[0].legendItem.label.element;

                        checkText(
                            text, 0.8, true, message + ': nested tooltip'
                        );
                        checkText(
                            legend, 0.8, true, message + ': nested legend'
                        );
                        checkText(
                            chart.series[0].points[0].dataLabel.text.element,
                            0.7, true, message + ': nested data label'
                        );
                        assert.close(
                            parseFloat(getComputedStyle(
                                text.querySelector('.highcharts-header')
                            ).fontSize),
                            fontSize * 0.8 * 0.8,
                            0.01,
                            'Tooltip header reduction applies once'
                        );
                        text.classList.add('custom-html-text');
                        assert.strictEqual(
                            getComputedStyle(text).color,
                            'rgb(0, 128, 0)',
                            'Author CSS can override HTML text color'
                        );
                        assert.strictEqual(
                            getComputedStyle(text.lastChild).color,
                            'rgb(255, 0, 0)',
                            'Nested inline color is respected'
                        );

                        chart.series[0].hide();
                        assert.strictEqual(
                            getComputedStyle(legend).color,
                            getComputedStyle(chart.yAxis[0].axisTitle.element)
                                .fill,
                            'Hidden HTML legend uses neutral-color-60'
                        );
                        assert.ok(
                            getComputedStyle(legend).textDecorationLine
                                .includes('line-through'),
                            'Hidden HTML legend has a line through it'
                        );
                        chart.series[0].show();
                        checkText(legend, 0.8, true, 'Restored HTML legend');
                    }
                });
            });
        });
    } finally {
        chart.destroy();
        container.className = originalClass;
        style.remove();
    }
});

QUnit.test('Shared, split and outside HTML tooltip text (#25323)', assert => {
    const container = document.getElementById('container'),
        originalClass = container.className,
        originalBodyClass = document.body.className;

    ['highcharts-light', 'highcharts-dark'].forEach(mode => {
        [false, true].forEach(outside => {
            [false, true].forEach(split => {
                container.classList.remove(
                    'highcharts-light', 'highcharts-dark'
                );
                container.classList.add(mode);
                document.body.classList.remove(
                    'highcharts-light', 'highcharts-dark'
                );
                document.body.classList.add(mode);
                const chart = Highcharts.chart(container, {
                    chart: {
                        styledMode: true
                    },
                    tooltip: {
                        useHTML: true,
                        shared: true,
                        split,
                        outside,
                        headerFormat: 'Header',
                        pointFormat: 'Point'
                    },
                    series: [{ data: [1, 2] }, { data: [2, 3] }]
                });

                try {
                    chart.tooltip.refresh(chart.series.map(s => s.points[0]));
                    const root = outside ?
                            chart.tooltip.container : chart.container,
                        labels = root.querySelectorAll(
                            '.highcharts-tooltip foreignObject > div'
                        ),
                        baseSize = parseFloat(getComputedStyle(root).fontSize);

                    root.style.color = 'rgb(255, 0, 255)';
                    assert.strictEqual(
                        labels.length, split ? 3 : 1,
                        'Every tooltip label has an HTML root'
                    );
                    labels.forEach(label => {
                        assert.strictEqual(
                            getComputedStyle(label).color,
                            getComputedStyle(chart.yAxis[0].labelGroup.element)
                                .fill,
                            mode + ': tooltip text uses neutral-color-80'
                        );
                        assert.close(
                            parseFloat(getComputedStyle(label).fontSize),
                            baseSize * 0.8,
                            0.01,
                            'Tooltip font size is reduced once'
                        );
                    });
                    if (outside) {
                        assert.ok(
                            root.classList.contains(mode),
                            'Outside tooltip inherits the theme class'
                        );
                    }
                    chart.tooltip.update({ formatter: () => '' });
                    chart.tooltip.refresh(chart.series.map(s => s.points[0]));
                } finally {
                    chart.destroy();
                    container.className = originalClass;
                    document.body.className = originalBodyClass;
                }
            });
        });
    });
});
