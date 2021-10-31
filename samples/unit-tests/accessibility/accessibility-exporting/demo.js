QUnit.test('Exporting button and menu HTML/ARIA markup', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        exportProxy =
            chart.accessibility.components.chartMenu.exportButtonProxy;

    assert.ok(
        exportProxy.buttonElement.getAttribute('aria-label'),
        'There is aria label on the exporting button'
    );

    assert.strictEqual(
        exportProxy.buttonElement.getAttribute('aria-expanded'),
        'false',
        'Exporting button should have aria-expanded on it'
    );

    exportProxy.click();

    assert.strictEqual(
        exportProxy.buttonElement.getAttribute('aria-expanded'),
        'true',
        'Exporting button should update aria-expanded on click'
    );

    const innerMenu = chart.exportContextMenu.firstChild;

    assert.strictEqual(
        innerMenu.tagName.toLowerCase(),
        'ul',
        'Context menu should be a <ul> element'
    );

    assert.strictEqual(
        innerMenu.getAttribute('role'),
        'list',
        'Context menu needs a role="list" attribute for webkit accessibility'
    );

    assert.ok(
        innerMenu.getAttribute('aria-label'),
        'Context menu should have aria-label'
    );
});
