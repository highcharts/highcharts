QUnit.test('Credits', function (assert) {
    const chart = Highcharts.chart('container', {
        credits: {
            enabled: false
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.notOk(
        chart.renderTo.querySelector('.hc-a11y-group-credits'),
        'There is no credits element when starting'
    );

    chart.update({
        credits: {
            enabled: true,
            text: 'My custom credits',
            href: ''
        }
    });

    const group = chart.renderTo.querySelector('.hc-a11y-group-credits'),
        proxy = group.querySelector('.hc-a11y-credits');
    assert.strictEqual(
        proxy.tagName,
        'P',
        'After update we have a paragraph element for credits'
    );
    assert.strictEqual(
        proxy.textContent,
        'My custom credits',
        'The text is set correctly'
    );

    chart.update({
        credits: {
            href: 'https://www.google.com/'
        }
    });

    const aContainer = chart.renderTo.querySelector(
            '.hc-a11y-group-credits .hc-a11y-touchable-container'
        ),
        aProxy = aContainer.firstChild;
    assert.strictEqual(
        aProxy.tagName,
        'A',
        'After update we have an anchor element for credits'
    );
    assert.strictEqual(
        aProxy.href,
        'https://www.google.com/',
        'Href is correct'
    );
    const targetBBox = chart.credits.element.getBoundingClientRect(),
        aContainerBBox = aContainer.getBoundingClientRect();
    ['top', 'left', 'width', 'height'].forEach(function (prop) {
        assert.strictEqual(
            Math.round(aContainerBBox[prop]),
            Math.round(targetBBox[prop]),
            `The touchable container has ${prop} set correctly`
        );
    });

    chart.update({
        a11y: {
            order: []
        }
    });

    assert.notOk(
        chart.renderTo.querySelector('.hc-a11y-group-credits'),
        'There is no credits element after disabling it in a11y order'
    );
});
