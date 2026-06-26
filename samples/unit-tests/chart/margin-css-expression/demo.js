QUnit.test('Chart margin from CSS expression (#23989)', function (assert) {
    // Variable on :root, resolved via calc()
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--hc-test-margin', '40px');

    const rootChart = Highcharts.chart(document.createElement('div'), {
        chart: {
            marginLeft: 'calc(var(--hc-test-margin) * 2)',
            width: 400,
            height: 300
        },
        series: [{ data: [1, 2, 3] }]
    });

    assert.strictEqual(
        rootChart.plotLeft,
        80,
        'marginLeft as a CSS calc() expression resolves to pixels'
    );

    rootChart.destroy();
    rootStyle.removeProperty('--hc-test-margin');

    // Variable scoped to chart.container
    const scopedContainer = document.createElement('div');
    scopedContainer.style.setProperty('--hc-scoped-margin', '30px');
    document.body.appendChild(scopedContainer);

    const scopedChart = Highcharts.chart(scopedContainer, {
        chart: {
            marginLeft: 'var(--hc-scoped-margin)',
            width: 400,
            height: 300
        },
        series: [{ data: [1, 2, 3] }]
    });

    assert.strictEqual(
        scopedChart.plotLeft,
        30,
        'CSS variable defined on chart.container is resolved against ' +
        'that scope, not just :root'
    );

    scopedChart.destroy();
    document.body.removeChild(scopedContainer);
});
