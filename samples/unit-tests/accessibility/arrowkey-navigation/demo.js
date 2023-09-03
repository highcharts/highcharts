QUnit.test('Navigating legend with arrow-keys', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                data: [1]
            }, {
                data: [2]
            }, {
                data: [3]
            }]
        }),
        keyboardNavigation = chart.accessibility.keyboardNavigation,
        eventDispatcher = keyCode => {
            const event = new KeyboardEvent('keydown', { keyCode });
            keyboardNavigation.onKeydown(event);
        };
    keyboardNavigation
        .components
        .legend
        .onKbdArrowKey(
            keyboardNavigation
                .components
                .legend
                .getKeyboardNavigation(),
            39
        );

    console.log(keyboardNavigation.components.legend.highlightedIx);

    eventDispatcher(9);
    eventDispatcher(37);

    assert.strictEqual(
        keyboardNavigation
            .components
            .legend
            .highlightedIx === 2,
        'Last legend item should be highlighted.'
    );

    eventDispatcher(39);

    assert.strictEqual(
        keyboardNavigation
            .components
            .legend
            .highlightedIx === 0,
        'First legend item should be highlighted.'
    );
});