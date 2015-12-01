QUnit.test('Element.on', function (assert) {
    var rect = document.querySelector('#container rect'),
        done = assert.async();

    assert.strictEqual(
        rect.getAttribute('width'),
        '100',
        'Starting at 100 width'
    );

    // Start transforming
    rect.onclick();

    assert.strictEqual(
        rect.getAttribute('width'),
        '100',
        'Starting at 100 width'
    );

    setTimeout(function () {
        var width = parseInt(rect.getAttribute('width'), 10);
        assert.strictEqual(
            width > 100 && width < 200,
            true,
            '300 ms: animating'
        );
    }, 300);

    setTimeout(function () {
        var width = parseInt(rect.getAttribute('width'), 10);
        assert.strictEqual(
            width,
            200,
            '600 ms: landed'
        );
        done();
    }, 600);
});