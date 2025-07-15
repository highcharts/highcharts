QUnit.test('Titles', function (assert) {
    const chart = Highcharts.chart('container', {
        title: {
            text: null
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartTitle,
        'Chart',
        'Default chart title is picked up from lang options'
    );

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartSubtitle,
        '',
        'No subtitle'
    );

    const a11yInstance = chart.a11y;
    chart.update({
        title: {
            text: 'My chart<br>with special chars'
        }
    });

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartTitle,
        'My chart<br>with special chars',
        'Title matches chart'
    );

    assert.notStrictEqual(
        a11yInstance,
        chart.a11y,
        'A11y module was re-initialized on chart update'
    );

    chart.update({
        a11y: {
            chartDescriptionSection: {
                chartTitleFormat: '{chartTitle} hello'
            }
        }
    });

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.chartTitle,
        'My chart<br>with special chars hello',
        'Title format is applied'
    );

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.headingLevel,
        'h6',
        'Uses default h6 when no heading tag is set'
    );

    chart.update({
        a11y: {
            chartDescriptionSection: {
                chartTitleFormat: '<h1>{chartTitle}</h1>'
            }
        }
    });

    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.headingLevel,
        'h1',
        'Parses h1 from chartTitleFormat when heading tag is set'
    );

    chart.update({
        a11y: {
            headingLevel: 'h3'
        }
    });
    assert.strictEqual(
        chart.a11y.chartDescriptionInfo.headingLevel,
        'h3',
        'Using a11y.headingLevel overrides chartTitleFormat heading level'
    );
});
