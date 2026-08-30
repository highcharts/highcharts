QUnit.test('Heading auto detection works as expected', function (assert) {
    document.getElementById('container').innerHTML =  `
        <div>
            <div>
                <h2>
                    <div id="1">Should be h3</div>
                </h2>
            </div>
            <div>
                <h4></h4>
                <div>
                    <div id="2">Should be h5</div>
                    <div>
                        <h5></h5>
                        <div id="3">Should be h6</div>
                    </div>
                </div>
                <h3></h3>
            </div>
            <h1>
            </h1>
            <div>
                <div id="4">Should be h2</div>
            </div>
        </div>  
    `;

    const getHeading = Highcharts.A11yHTMLUtilities.getHeadingTagNameForElement;
    const getEl = e => document.getElementById(e);

    assert.strictEqual(
        getHeading(document.body), 'h6',
        'document.body should not have a heading and give h6 by default.'
    );
    assert.strictEqual(
        getHeading(getEl('1')), 'h3',
        'Nested inside h2 should give h3.'
    );
    assert.strictEqual(
        getHeading(getEl('2')), 'h5',
        'Parent previous sibling h4 should give h5.'
    );
    assert.strictEqual(
        getHeading(getEl('3')), 'h6',
        'Previous sibling h5 should give h6.'
    );
    assert.strictEqual(
        getHeading(getEl('4')), 'h2',
        'Parent previous sibling h1 should give h2.'
    );
});

QUnit.test('Axis range descriptions preserve zero data bounds', assert => {
    const getRangeDescription =
        Highcharts.A11yChartUtilities.getAxisRangeDescription;
    let chart = Highcharts.chart('container', {
        xAxis: {
            categories: ['A', 'B', 'C']
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        getRangeDescription(chart.xAxis[0]),
        'Data range: 3 categories.',
        'Category ranges should include a zero-based first category'
    );

    chart = Highcharts.chart('container', {
        series: [{
            data: [[0, 1], [10, 2]]
        }]
    });
    assert.strictEqual(
        getRangeDescription(chart.xAxis[0]),
        'Data ranges from 0 to 10.',
        'Numeric ranges should start at the zero data minimum'
    );

    chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime'
        },
        series: [{
            data: [[0, 1], [24 * 60 * 60 * 1000, 2]]
        }]
    });
    assert.strictEqual(
        getRangeDescription(chart.xAxis[0]),
        'Data range: 24 hours.',
        'Time ranges should start at the zero timestamp'
    );
});
