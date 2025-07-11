QUnit.test('Scrollable plot area', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            scrollablePlotArea: {
                minWidth: 700,
                scrollPositionX: 1
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.ok(true, 'placeholder');

    chart.renderTo.querySelectorAll(':scope > :not(.hc-a11y-proxy-section)')
        .forEach(el => assert.strictEqual(
            el.getAttribute('aria-hidden'), 'true',
            'All elements except the proxy sections should be hidden: ' +
            el.className
        ));

    const menuButtonBbox = chart.renderTo.querySelector('.hc-a11y-group-menu')
            .firstChild.getBoundingClientRect(),
        actualButtonBbox = chart.scrollablePlotArea?.fixedDiv.querySelector(
            '.highcharts-contextbutton'
        ).getBoundingClientRect();

    ['top', 'left', 'width', 'height'].forEach(function (prop) {
        assert.strictEqual(
            Math.round(menuButtonBbox[prop]),
            Math.round(actualButtonBbox[prop]),
            `Menu's touchable container has ${prop} position correct`
        );
    });
});
