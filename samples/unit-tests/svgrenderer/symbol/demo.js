
QUnit.test('Symbol tests', function (assert) {
    var w = 400,
        h = 400,
        done = assert.async(),
        total = 0,
        count = 0;

    var ren = new Highcharts.Renderer(
        document.getElementById('container'),
        w,
        h
    );

    var url = 'url(testimage.png)';

    function ifDone() {
        count++;
        if (count === total) {
            done();
        }
    }

    // Add a grid so we can see where they symbols are
    for (var x = 99.5; x < w - 1; x += 100) {
        ren.path(['M', x, 0, 'L', x, 400])
            .attr({
                'stroke': 'silver',
                'stroke-width': 1
            })
            .add();
    }

    for (var y = 99.5; y < h - 1; y += 100) {
        ren.path(['M', 0, y, 'L', 400, y])
            .attr({
                'stroke': 'silver',
                'stroke-width': 1
            })
            .add();
    }


    // Basic symbol
    var symbol1 = ren.symbol(url, 100, 100)
        .add();

    total++;
    setTimeout(function () {
        assert.strictEqual(
            symbol1.element.getAttribute('width'),
            '30',
            'Width ok'
        );
        assert.strictEqual(
            symbol1.element.getAttribute('transform'),
            'translate(-15,-15)',
            'Translate ok'
        );
        ifDone();
    }, 100);


    // With explicit size
    var symbol2 = ren
        .symbol(url, 200, 100, null, null, {
            width: 20,
            height: 20
        })
        .add();

    total++;
    setTimeout(function () {
        assert.strictEqual(
            symbol2.element.getAttribute('width'),
            '20',
            'Width ok'
        );
        assert.strictEqual(
            symbol2.element.getAttribute('transform'),
            'translate(-10,-10)',
            'Translate ok'
        );
        ifDone();
    }, 100);

    // Label with background
    var label = ren
        .label('Hello Label', 300, 100, url)
        .attr({
            padding: 0,
            width: 100,
            height: 30
        })
        .add();

    total++;
    setTimeout(function () {
        assert.strictEqual(
            label.box.element.getAttribute('width'),
            '30',
            'Label box width ok'
        );
        assert.strictEqual(
            label.box.element.getAttribute('transform'),
            'translate(35,0)',
            'Label box translate ok, centered in label'
        );
        ifDone();
        console.log(Highcharts.symbolSizes);
    }, 100);

});
