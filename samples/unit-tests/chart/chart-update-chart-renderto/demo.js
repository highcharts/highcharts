QUnit.test('Chart update with circular renderTo', assert => {

    const renderTo = document.createElement('div');
    let chart;
    document.getElementById('container').appendChild(renderTo);

    try {
        renderTo.self = renderTo; // Create circular reference

        const options = {
            chart: {
                renderTo: renderTo
            },
            series: [{
                data: [1, 2, 3]
            }]
        };

        chart = Highcharts.chart(options);

        chart.update(options);

        assert.ok(
            true,
            // Issue #10044 caused RangeError: Maximum call stack size exceeded
            'There should be no JS error before this assertion (#10044)'
        );

    } finally {
        chart.destroy();
        document.getElementById('container').removeChild(renderTo);
    }
});