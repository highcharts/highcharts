// Purposefully not using lolex for this, as we are loading images.
QUnit.test('Symbol tests', function (assert) {
    var w = 400,
        h = 400,
        done = assert.async(),
        total = 0,
        count = 0,
        symbol1,
        symbol2,
        symbol3,
        label,
        url = location.host.substr(0, 12) === 'localhost:98' ?
            'url(base/test/testimage.png)' : // karma
            'url(testimage.png)'; // utils

    function ifDone() {
        count++;
        if (count === total) {
            done();
        }
    }

    // Add chart to get the onload event after images are loaded.
    Highcharts.chart('container', {
        chart: {
            width: w,
            height: h,
            backgroundColor: 'none',
            events: {
                // set up images related elements
                beforeRender: function () {
                    var ren = this.renderer;

                    // Add a grid so we can see where they symbols are
                    for (var x = 99.5; x < w - 1; x += 100) {
                        ren.path(['M', x, 0, 'L', x, 400])
                            .attr({
                                stroke: 'silver',
                                'stroke-width': 1
                            })
                            .add();
                    }

                    for (var y = 99.5; y < h - 1; y += 100) {
                        ren.path(['M', 0, y, 'L', 400, y])
                            .attr({
                                stroke: 'silver',
                                'stroke-width': 1
                            })
                            .add();
                    }

                    // Basic symbol
                    symbol1 = ren.symbol(url, 100, 100).add();
                    total++;

                    // With explicit size
                    symbol2 = ren
                        .symbol(url.replace(')', '?' + Date.now() + ')'),
                            200, 100, null, null, {
                                width: 20,
                                height: 20
                            })
                        .add();
                    total++;

                    // Label with background
                    label = ren
                        .label('Hello Label', 300, 100, url)
                        .attr({
                            padding: 0,
                            width: 100,
                            height: 30
                        })
                        .add();
                    total++;

                    // Symbol with wrong name #6627
                    symbol3 = ren
                        .symbol('krakow', 100, 200, 10, 10)
                        .attr({
                            fill: 'red'
                        })
                        .add();
                    total++;

                },
                // images are loaded
                load: function () {
                    // Basic symbol
                    assert.strictEqual(
                        symbol1.element.getAttribute('width'),
                        '30',
                        'Width ok'
                    );
                    assert.strictEqual(
                        symbol1.element.getAttribute('transform') &&
                            symbol1.element.getAttribute('transform')
                                .replace(' ', ','), // MSIE
                        'translate(-15,-15)',
                        'Translate ok'
                    );
                    ifDone();

                    // With explicit size
                    assert.strictEqual(
                        symbol2.element.getAttribute('width'),
                        '20',
                        'Width ok'
                    );
                    assert.strictEqual(
                        symbol2.element.getAttribute('transform') &&
                            symbol2.element.getAttribute('transform')
                                .replace(' ', ','), // MSIE
                        'translate(-10,-10)',
                        'Translate ok'
                    );
                    ifDone();

                    // Label with background
                    assert.strictEqual(
                        label.box.element.getAttribute('width'),
                        '30',
                        'Label box width ok'
                    );
                    assert.strictEqual(
                        label.box.element.getAttribute('transform') &&
                        label.box.element.getAttribute('transform')
                            .replace('(35)', '(35,0)'), // MSIE
                        'translate(35,0)',
                        'Label box translate ok, centered in label'
                    );
                    ifDone();

                    // Symbol with wrong name #6627
                    assert.strictEqual(
                        symbol3.symbolName,
                        'circle',
                        'Wrong symbol name defualts to "circle" (#6627)'
                    );
                    ifDone();
                }
            }
        }
    });

});
