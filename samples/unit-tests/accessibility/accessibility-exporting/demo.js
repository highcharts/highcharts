QUnit.test('Exporting button and menu HTML/ARIA markup', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }]
        }),
        exportProxy = chart.accessibility.components.chartMenu
            .exportButtonProxy;

    assert.ok(
        exportProxy.innerElement.getAttribute('aria-label'),
        'There is aria label on the exporting button'
    );

    assert.strictEqual(
        exportProxy.innerElement.getAttribute('aria-expanded'),
        'false',
        'Exporting button should have aria-expanded on it'
    );

    exportProxy.click();

    assert.strictEqual(
        exportProxy.innerElement.getAttribute('aria-expanded'),
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


QUnit.test('Exported chart should not contain HTML elements from a11y module', function (assert) {
    var chart = Highcharts.chart('container', {
            title: {
                text: 'Title < title'
            },
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }],
            legend: {
                enabled: true
            }
        }),
        svg = chart.getSVGForExport(),
        hasHTMLElements = svg.match(
            /<(div|p|h[1-7]|button|a|li|ul|ol|table|input|select)(\s[^>]+)?>/gu
        ),
        hasTitleChanged = svg.match(/\bTitle\b(?:\s&lt;\s)\btitle\b/g);

    assert.strictEqual(hasHTMLElements, null, 'Should not have any HTML elements in the SVG');

    assert.strictEqual(
        hasTitleChanged[0],
        'Title &lt; title',
        'Title should replace `<` to `&lt;` for exporting, (#17753, #19002)'
    );
});
