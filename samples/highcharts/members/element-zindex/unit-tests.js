/* global circles */
QUnit.test('Element Z index', function (assert) {

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
        typeof getIndex(circles[1].element),
        'number',
        'Yellow is there'
    );
    assert.strictEqual(
        typeof getIndex(circles[2].element),
        'number',
        'Blue is there'
    );
    assert.strictEqual(
        getIndex(circles[1].element) > getIndex(circles[2].element),
        true,
        'Yellow in front of blue'
    );

    circles[1].attr({
        zIndex: 3
    });

    assert.strictEqual(
        getIndex(circles[1].element) < getIndex(circles[2].element),
        true,
        'Yellow behind blue'
    );

    // ... and back again
    circles[1].attr({
        zIndex: 6
    });

    assert.strictEqual(
        getIndex(circles[1].element) > getIndex(circles[2].element),
        true,
        'Yellow in front of blue'
    );

});