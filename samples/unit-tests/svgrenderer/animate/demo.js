QUnit.test('Animation x-y', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container1'),
        600,
        400
    );
    var done = assert.async();

    var circ = ren.circle(10, 10, 3)
        .attr({
            fill: 'red'
        })
        .add();

    circ.animate({
        x: 300,
        y: 300
    }, {
        duration: 2000
    });

    setTimeout(function () {
        circ.animate({
            y: 10
        });
    }, 1000);

    setTimeout(function () {
        assert.strictEqual(
            circ.attr('x'),
            300,
            'X went to first destination'
        );
        assert.strictEqual(
            circ.attr('y'),
            10,
            'Y interrupted by second destination'
        );
        done();
    }, 2500);
});

QUnit.test('Path animation', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container2'),
        600,
        400
    );
    var done = assert.async();

    var path = ren.path(['M', 10, 30, 'L', 10, 100])
        .attr({
            'stroke-width': 2,
            'stroke': 'blue'
        })
        .add();

    path.animate({
        d: ['M', 300, 330, 'L', 300, 400]
    }, {
        duration: 2000
    });

    setTimeout(function () {
        path.animate({
            d: ['M', 300, 30, 'L', 300, 400]
        }, {
            duration: 100
        });
    }, 1100);

    setTimeout(function () {
        assert.strictEqual(
            path.attr('d'),
            'M 300 30 L 300 400',
            'First animation aborted by shorter second animation'
        );
        done();
    }, 1500);

});

QUnit.test('Symbol animation', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container3'),
        600,
        400
    );
    var done = assert.async();

    var symbol = ren.symbol('diamond', 30, 20, 5, 5)
        .attr({
            fill: 'green'
        })
        .add();

    symbol.animate({
        x: 330,
        y: 330
    }, {
        duration: 2000
    });

    setTimeout(function () {
        symbol.animate({
            width: 100,
            height: 100
        });
    }, 1000);

    setTimeout(function () {
        assert.strictEqual(
            symbol.attr('x'),
            330,
            'Final X'
        );
        assert.strictEqual(
            symbol.attr('y'),
            330,
            'Final Y'
        );
        assert.strictEqual(
            symbol.attr('width'),
            100,
            'Final width'
        );
        assert.strictEqual(
            symbol.attr('height'),
            100,
            'Final height'
        );
        done();
    }, 2500);

});

QUnit.test('Animation x-y, stopped by .attr()', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container4'),
        600,
        400
    );
    var done = assert.async();

    var circ = ren.circle(10, 10, 3)
        .attr({
            fill: 'red'
        })
        .add();

    circ.animate({
        x: 300,
        y: 300
    }, {
        duration: 1000
    });

    setTimeout(function () {
        circ.attr({
            y: 10
        });
    }, 100);

    setTimeout(function () {
        assert.strictEqual(
            circ.attr('x'),
            300,
            'X went to destination'
        );
        assert.strictEqual(
            circ.attr('y'),
            10,
            'Y interrupted by attr'
        );
        done();
    }, 1500);
});

QUnit.test('Animation x-y, stopped by .stop()', function (assert) {
    var ren = new Highcharts.Renderer(
        document.getElementById('container5'),
        600,
        400
    );
    var done = assert.async();

    var circ = ren.circle(10, 10, 3)
        .attr({
            fill: 'red'
        })
        .add();

    circ.animate({
        x: 300,
        y: 300
    }, {
        duration: 1000
    });

    setTimeout(function () {
        Highcharts.stop(circ, 'y');
    }, 100);

    setTimeout(function () {
        assert.strictEqual(
            circ.attr('x'),
            300,
            'X went to destination'
        );
        assert.notEqual(
            circ.attr('y'),
            300,
            'Y stopped'
        );
        done();
    }, 1500);
});