/* global circ, rect */
QUnit.test('Element to front', function (assert) {

    function getIndex(element) {
        var i = 0,
            nodes = element.parentNode.childNodes;
        while (i < nodes.length) {
            if (nodes[i] === element) {
                return i;
            }
            i++;
        }
    }
    assert.strictEqual(
        typeof getIndex(circ.element),
        'number',
        'Circle is there'
    );

    assert.strictEqual(
        typeof getIndex(rect.element),
        'number',
        'Rect is there'
    );

    assert.strictEqual(
        getIndex(circ.element) > getIndex(rect.element),
        true,
        'Circle is above rect'
    );

    rect.toFront();

    assert.strictEqual(
        getIndex(circ.element) < getIndex(rect.element),
        true,
        'Rect is above circle'
    );

    circ.toFront();

    assert.strictEqual(
        getIndex(circ.element) > getIndex(rect.element),
        true,
        'Circle is above rect'
    );

});