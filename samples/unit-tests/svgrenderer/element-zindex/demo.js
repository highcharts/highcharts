
QUnit.test('Element Z index', function (assert) {

    var renderer,
        circles = [],
        group2;


    renderer = new Highcharts.Renderer(
        $('#container')[0],
        450,
        300
    );

    circles[0] = renderer.circle(200, 200, 60)
        .attr({
            fill: 'green',
            zIndex: 8
        })
        .add();
    circles[1] = renderer.circle(250, 200, 60)
        .attr({
            fill: 'yellow',
            zIndex: 6
        })
        .add();
    circles[2] = renderer.circle(300, 200, 60)
        .attr({
            fill: 'blue',
            zIndex: 4
        })
        .add();
    circles[3] = renderer.circle(350, 200, 60)
        .attr({
            fill: 'red',
            zIndex: 2
        })
        .add();

    group2 = renderer.g().add();

    circles[4] = renderer.circle(200, 100, 60)
        .attr({
            fill: 'pink',
            zIndex: undefined
        })
        .add(group2);
    circles[5] = renderer.circle(250, 100, 60)
        .attr({
            fill: 'black',
            zIndex: -1
        })
        .add(group2);
    circles[6] = renderer.circle(300, 100, 60)
        .attr({
            fill: 'grey',
            zIndex: -2
        })
        .add(group2);
    circles[7] = renderer.circle(350, 100, 60)
        .attr({
            fill: 'orange',
            zIndex: 10
        })
        .add(group2);

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

    assert.strictEqual(
        getIndex(circles[4].element) > getIndex(circles[5].element),
        true,
        'Pink in front of black'
    );

    assert.strictEqual(
        getIndex(circles[5].element) > getIndex(circles[6].element),
        true,
        'Black in front of grey'
    );

    assert.strictEqual(
        getIndex(circles[7].element) > getIndex(circles[4].element),
        true,
        'Orange in front of all'
    );

    assert.strictEqual(
        getIndex(circles[0].element) > getIndex(group2.element),
        true,
        'Green in front of top circles'
    );

    // Remove Z index
    circles[1].attr({
        zIndex: null
    });

    assert.ok(
        getIndex(circles[1].element) < getIndex(circles[2].element),
        'Yellow is behind red'
    );

});