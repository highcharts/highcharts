QUnit.test('Proxies positioned with vertical page scroll', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2]
            }]
        }),
        headingbBox = chart.renderTo
            .querySelector('.hc-a11y-group-description')
            .firstChild.getBoundingClientRect(),
        titleBBox = chart.title.element.getBoundingClientRect();

    ['left', 'top', 'width', 'height'].forEach(prop =>
        assert.strictEqual(
            Math.round(headingbBox[prop]), Math.round(titleBBox[prop]),
            `Heading ${prop} is aligned with chart title`
        ));
});
