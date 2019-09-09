QUnit.test('Caption as initial option', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 3, 2, 4]
        }],
        caption: {
            text: 'The quick brown fox jumps over the lazy dog'
        }
    });

    assert.strictEqual(
        chart.caption.element.textContent,
        'The quick brown fox jumps over the lazy dog',
        'The caption text should be applied'
    );
});

QUnit.test('Caption and chart.update lifecycle', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        typeof chart.caption.update,
        'function',
        'The caption property should exist with an update function'
    );

    assert.strictEqual(
        chart.caption.element.textContent,
        '',
        'An empty text element should be added for the caption'
    );


    chart.update({
        caption: {
            text: 'The quick brown fox jumps over the lazy dog'
        }
    });
    assert.strictEqual(
        chart.caption.element.textContent,
        'The quick brown fox jumps over the lazy dog',
        'The caption text should be applied'
    );


    chart.update({
        caption: {
            text: 'The quick brown fox'
        }
    });
    assert.strictEqual(
        chart.caption.element.textContent,
        'The quick brown fox',
        'The caption text should be updated'
    );

    chart.update({
        caption: {
            text: undefined
        }
    });

    assert.strictEqual(
        chart.caption.element.textContent,
        '',
        'The caption should be removed'
    );

    chart.caption.update({
        text: 'Hello cap!',
        style: {
            color: 'green',
            fontSize: '30px'
        }
    });

    assert.strictEqual(
        chart.caption.element.textContent,
        'Hello cap!',
        'The caption should be updated through its own update function'
    );

    assert.notEqual(
        chart.caption.element.getAttribute('style').indexOf('green'),
        -1,
        'The style should be applied'
    );
});