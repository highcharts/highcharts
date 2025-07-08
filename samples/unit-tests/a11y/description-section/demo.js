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
    Highcharts.AST.bypassHTMLFiltering = true;
    const chart = Highcharts.chart('container', {
        title: {
            useHTML: true,
            text: '<span class="custom-title">Custom title: ' +
                '<a href="//www.google.com">Google</a></span>'
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.ok(chart, 'Placeholder');

    Highcharts.AST.bypassHTMLFiltering = false;
});
