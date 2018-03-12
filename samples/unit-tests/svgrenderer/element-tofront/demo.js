
QUnit.test('Element to front', function (assert) {

    var renderer,
        rect,
        circ;


    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    rect = renderer.rect(100, 100, 100, 100, 5)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'yellow'
        })
        .add();

    circ = renderer.circle(200, 200, 50)
        .attr({
            'stroke-width': 2,
            stroke: 'red',
            fill: 'green'
        })
        .add();

    rect.on('click', function () {
        rect.toFront();
    });

    circ.on('click', function () {
        circ.toFront();
    });

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