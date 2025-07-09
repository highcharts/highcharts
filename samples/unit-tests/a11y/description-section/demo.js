QUnit.test('Section elements', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }]
    });

    const el = chart.renderTo.querySelector('.hc-group-description');
    assert.ok(el, 'Has description section');

    const heading = el.firstChild;
    assert.strictEqual(
        heading.firstChild.tagName, 'H6', 'Has H6 as first child'
    );

    const headingbBox = heading.getBoundingClientRect(),
        titleBBox = chart.title.element.getBoundingClientRect(),
        compare = ['left', 'top', 'width', 'height'];
    compare.forEach(prop => {
        assert.strictEqual(
            Math.round(headingbBox[prop]), Math.round(titleBBox[prop]),
            `Heading ${prop} is aligned with chart title`
        );
    });

    assert.strictEqual(
        heading, el.lastChild, 'Heading is only child of section'
    );

    const linkedDesc = document.createElement('p');
    linkedDesc.className = 'highcharts-description';
    linkedDesc.textContent = 'This is a linked description';
    chart.renderTo.parentNode.insertBefore(
        linkedDesc, chart.renderTo.nextSibling
    );

    // Force a11y update to pick up the linked description
    chart.update({});

    assert.strictEqual(
        chart.renderTo.querySelector(
            '.hc-group-description .hc-author-description'
        ).textContent,
        'This is a linked description',
        'Linked description is added to the description section'
    );

    chart.update({
        a11y: {
            chartDescriptionSection: {
                chartSubtitleFormat: 'Custom subtitle'
            }
        }
    });

    const subtitleEl = chart.renderTo.querySelector(
        '.hc-group-description .hc-subtitle'
    );
    assert.strictEqual(
        subtitleEl.textContent,
        'Custom subtitle',
        'Subtitle is updated in description section'
    );
    assert.ok(
        subtitleEl.classList.contains('hc-a11y-sr-only'),
        'Subtitle is visually hidden, not touchable'
    );

    chart.update({
        a11y: {
            chartDescriptionSection: {
                chartSubtitleFormat: '{chartSubtitle}'
            }
        },
        subtitle: {
            text: 'This is an <b>HTML</b> subtitle',
            useHTML: true
        }
    });

    assert.strictEqual(
        chart.renderTo.querySelector('.hc-subtitle').innerHTML,
        'This is an <b>HTML</b> subtitle',
        'useHTML subtitle is updated in description section'
    );
});


QUnit.test('Interactive elements', function (assert) {
    const chart = Highcharts.chart('container', {
            title: {
                useHTML: true,
                text: '<span class="custom-title">Custom title: ' +
                    '<button>click me</button></span>'
            },
            series: [{
                data: [1, 2, 3]
            }]
        }),
        el = chart.title.element.querySelector('button'),
        bBox = el.getBoundingClientRect(),
        chartBBox = chart.container.getBoundingClientRect(),
        x = bBox.left - chartBBox.left + bBox.width / 2,
        y = bBox.top - chartBBox.top + bBox.height / 2,
        test = new TestController(chart);

    let clicked = false;
    el.onclick = () => (clicked = true);
    test.click(x, y);
    assert.ok(clicked, 'Able to click the button in the title');

    const proxyUnderCursor = test.elementFromPoint(x, y);
    assert.strictEqual(
        proxyUnderCursor.className,
        'hc-a11y-touchable-container',
        'Element under cursor is the proxy element'
    );

    // Hack the internal state to force showing focus visually
    chart.a11y.showFocus = true;
    proxyUnderCursor.querySelector('button').focus();

    chart.update({
        a11y: {
            chartDescriptionSection: {
                positionOnChart: false
            }
        }
    });

    const elUnderCursor = test.elementFromPoint(x, y);
    assert.strictEqual(
        elUnderCursor, el,
        'Element under cursor is now the actual button'
    );

    const rect = chart.renderer.rect(10, 10, 100, 100)
        .attr({ fill: 'red' }).add();

    chart.a11y.showFocus = true;
    chart.a11y.setFocusIndicator(rect.element);

    const focusBBox = chart.a11y.focusIndicator.getBoundingClientRect(),
        rectBBox = rect.element.getBoundingClientRect();

    ['left', 'right', 'top', 'bottom'].forEach((prop, i) =>
        assert.strictEqual(
            Math.round(focusBBox[prop]) + (i % 2 ? -4 : 4),
            Math.round(rectBBox[prop]),
            `Focus indicator ${prop} is correct`
        ));
});
