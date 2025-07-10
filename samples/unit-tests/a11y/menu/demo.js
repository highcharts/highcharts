QUnit.test('Menu', function (assert) {
    const chart = Highcharts.chart('container', {
        exporting: {
            enabled: false
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.notOk(
        chart.renderTo.querySelector('.hc-a11y-group-menu'),
        'There is no menu group without exporting enabled'
    );

    chart.update({
        lang: {
            contextButtonTitle: 'My button title'
        },
        exporting: {
            enabled: true
        }
    });

    const menuGroup = chart.renderTo.querySelector('.hc-a11y-group-menu');
    assert.ok(
        menuGroup,
        'There is a menu group & button after enabling exporting'
    );

    assert.strictEqual(
        menuGroup.querySelector('.hc-a11y-menu-button').textContent,
        'My button title',
        'Menu button has correct text from lang options'
    );

    chart.update({
        exporting: {
            buttons: {
                contextButton: {
                    text: 'Custom text'
                }
            }
        }
    });

    const menuButton = chart.renderTo.querySelector('.hc-a11y-menu-button');
    assert.strictEqual(
        menuButton.textContent,
        'Custom text',
        'Menu button has correct text from exporting options'
    );

    assert.strictEqual(
        menuButton.getAttribute('aria-expanded'),
        'false',
        'Menu button has aria-expanded="false" when closed'
    );

    // Simulate opening the menu
    const test = new TestController(chart),
        bBox = chart.renderTo
            .querySelector('.hc-a11y-group-menu .hc-a11y-touchable-container')
            .getBoundingClientRect(),
        chartBBox = chart.container.getBoundingClientRect();
    test.click(
        bBox.x - chartBBox.x + bBox.width / 2,
        bBox.y - chartBBox.y + bBox.height / 2
    );

    assert.strictEqual(
        menuButton.getAttribute('aria-expanded'),
        'true',
        'Menu button has aria-expanded="true" when opened'
    );

    test.click(0, 0); // Click outside to close the menu

    assert.strictEqual(
        menuButton.getAttribute('aria-expanded'),
        'false',
        'Menu button has aria-expanded="false" when closed again'
    );
});
