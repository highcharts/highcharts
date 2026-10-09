QUnit.test('Chart margin from CSS expression (#23989)', function (assert) {
    // Variable on :root, resolved via calc() and var() expressions.
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--hc-test-margin', '40px');

    const rootChart = Highcharts.chart(document.createElement('div'), {
        chart: {
            marginLeft: 'calc(var(--hc-test-margin) * 2)',
            spacingRight: 'var(--hc-test-margin)',
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
    assert.strictEqual(
        rootChart.spacing[1],
        40,
        'spacingRight as a CSS var() expression resolves to pixels'
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

    // Recreating a chart in the same element clears renderTo.innerHTML,
    // which detaches the cached length probe (#23989)
    const recreatedChart = Highcharts.chart(scopedContainer, {
        chart: {
            marginLeft: 'var(--hc-scoped-margin)',
            width: 400,
            height: 300
        },
        series: [{ data: [1, 2, 3] }]
    });

    assert.strictEqual(
        recreatedChart.plotLeft,
        30,
        'CSS expression still resolves after chart re-creation in the ' +
        'same element'
    );

    recreatedChart.destroy();

    assert.strictEqual(
        scopedContainer.querySelector('.highcharts-length-probe'),
        null,
        'Chart destroy removes the length probe from the render target'
    );

    document.body.removeChild(scopedContainer);
});
