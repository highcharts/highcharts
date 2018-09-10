QUnit.test('Animation x-y', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        document.body.appendChild(div);

        var ren = new Highcharts.Renderer(
            div,
            600,
            400
        );

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
            document.body.removeChild(div);
        }, 2500);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Path animation', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        document.body.appendChild(div);

        var ren = new Highcharts.Renderer(
            div,
            600,
            400
        );

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
            document.body.removeChild(div);
        }, 1500);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Symbol animation', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        document.body.appendChild(div);

        var ren = new Highcharts.Renderer(
            div,
            600,
            400
        );

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
            document.body.removeChild(div);
        }, 2500);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Animation x-y, stopped by .attr()', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        document.body.appendChild(div);

        var ren = new Highcharts.Renderer(
            div,
            600,
            400
        );

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

            document.body.removeChild(div);
        }, 1500);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Animation x-y, stopped by .stop()', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        document.body.appendChild(div);

        var ren = new Highcharts.Renderer(
            div,
            600,
            400
        );

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

            document.body.removeChild(div);
        }, 1500);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Fill and stroke animation', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        document.body.appendChild(div);

        var ren = new Highcharts.Renderer(
            div,
            600,
            400
        );
        var rgbRegex = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/;

        var circ = ren.circle(200, 200, 100)
            .attr({
                fill: 'rgba(255,255,255,1)',
                stroke: 'rgba(255,255,255,1)',
                'stroke-width': '10px'
            })
            .add();

        circ.animate({
            fill: 'rgba(255,0,0,1)',
            stroke: 'rgba(0,0,255,1)'
        }, {
            duration: 1000
        });

        var rect = ren.rect(100, 200, 10, 10)
            .attr({
                fill: '#ff00ff'
            })
            .add();

        rect.animate({
            fill: 'none'
        }, {
            duration: 100
        });

        setTimeout(function () {

            // Fill
            assert.notEqual(
                circ.attr('fill'),
                'rgba(255,255,255,1)',
                'Fill unlike start'
            );
            assert.notEqual(
                circ.attr('fill'),
                'rgba(255,0,0,1)',
                'Fill unlike end'
            );
            assert.ok(
                rgbRegex.test(circ.attr('fill')),
                'Fill is color'
            );

            // Stroke
            assert.notEqual(
                circ.attr('stroke'),
                'rgba(255,255,255,1)',
                'Stroke unlike start'
            );
            assert.notEqual(
                circ.attr('stroke'),
                'rgba(0,0,255,1)',
                'Stroke unlike end'
            );
            assert.ok(
                rgbRegex.test(circ.attr('stroke')),
                'Stroke is color'
            );

            Highcharts.stop(circ);

            // Animating fill to none
            assert.strictEqual(
                rect.element.getAttribute('fill'),
                'none',
                'Animating from color to none (#8659)'
            );

            document.body.removeChild(div);
        }, 500);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Fill and stroke animation for series points (#6776)', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        div.style.width = '600px';
        document.body.appendChild(div);


        var chart = Highcharts.chart(div, {
                chart: {
                    animation: true
                },
                series: [{
                    type: 'column',
                    data: [1, 2],
                    pointPadding: 0,
                    groupPAdding: 0,

                    borderColor: 'rgb(255,0,0)',
                    color: 'rgb(255,255,255)',
                    states: {
                        hover: {
                            borderColor: 'rgb(255,255,255)',
                            color: 'rgb(255,0,0)'
                        }
                    }
                }]
            }),
            point = chart.series[0].points[0].graphic;

        // hover over the point
        chart.series[0].points[0].setState('hover');

        setTimeout(function () {
            assert.notEqual(
                point.attr('fill'),
                'rgb(255,255,255)',
                'Fill unlike start'
            );
            assert.notEqual(
                point.attr('fill'),
                'rgb(255,0,0)',
                'Fill unlike end'
            );
            assert.notEqual(
                point.attr('stroke'),
                'rgb(255,255,255)',
                'Stroke unlike end'
            );
            assert.notEqual(
                point.attr('stroke'),
                'rgb(255,0,0)',
                'Stroke unlike start'
            );

            setTimeout(function () {
                chart.series[0].points[0].setState('');

                setTimeout(function () {
                    assert.notEqual(
                        point.attr('fill'),
                        'rgb(255,255,255)',
                        'Fill unlike end'
                    );
                    assert.notEqual(
                        point.attr('fill'),
                        'rgb(255,0,0)',
                        'Fill unlike start'
                    );
                    assert.notEqual(
                        point.attr('stroke'),
                        'rgb(255,255,255)',
                        'Stroke unlike start'
                    );
                    assert.notEqual(
                        point.attr('stroke'),
                        'rgb(255,0,0)',
                        'Stroke unlike end'
                    );
                }, 250);
            }, 500);
        }, 250);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});


QUnit.test('Fill and stroke animation for series points in 3D (#6776)', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var div = document.createElement('div');
        div.style.width = '600px';
        document.body.appendChild(div);


        var chart = Highcharts.chart(div, {
                chart: {
                    animation: true,
                    options3d: {
                        enabled: true
                    }
                },
                series: [{
                    type: 'column',
                    data: [1, 2],
                    pointPadding: 0,
                    groupPAdding: 0,

                    borderColor: 'rgb(255,0,0)',
                    color: 'rgb(255,255,255)',
                    states: {
                        hover: {
                            borderColor: 'rgb(255,255,255)',
                            color: 'rgb(255,0,0)'
                        }
                    }
                }]
            }),
            point = chart.series[0].points[0].graphic;

        // hover over the point
        chart.series[0].points[0].setState('hover');

        setTimeout(function () {
            assert.notEqual(
                point.attr('fill'),
                'rgb(255,255,255)',
                'Fill unlike start'
            );
            assert.notEqual(
                point.attr('fill'),
                'rgb(255,0,0)',
                'Fill unlike end'
            );

        }, 250);

        setTimeout(function () {
            //controller.triggerEvent('mouseover', 450, 250);
            chart.series[0].points[0].setState('');

        }, 750);

        setTimeout(function () {
            assert.notEqual(
                point.attr('fill'),
                'rgb(255,255,255)',
                'Fill unlike end'
            );
            assert.notEqual(
                point.attr('fill'),
                'rgb(255,0,0)',
                'Fill unlike start'
            );
        }, 1000);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('3D arc animation (#7097)', function (assert) {

    // Hijack animation
    var clock = TestUtilities.lolexInstall();

    try {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            640,
            480
        );

        var arc = ren.arc3d({
            x: 100,
            y: 100,
            r: 100,
            innerR: 0,
            start: 0,
            end: 1,
            depth: 25,
            alpha: 45,
            beta: 10
        })
        .attr({
            fill: '#f00ff0'
        })
        .add();

        arc.animate({
            end: 5
        }, {
            duration: 200
        });

        arc.endSetter = function (value, key, elem) {
            this[key] = value;
            this._defaultSetter(value, key, elem);
        };

        setTimeout(function () {

            arc.animate({
                fill: '#0ff00f'
            }, {
                duration: 100
            });
        }, 100);

        setTimeout(function () {
            assert.strictEqual(
                arc.end,
                5,
                'End should continue to run after second animation'
            );
            assert.strictEqual(
                Highcharts.Color(arc.top.attr('fill')).get(),
                'rgb(15,240,15)',
                'Fill from second animation should apply'
            );
        }, 250);

        // Reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Complete callback', function (assert) {

    var clock = TestUtilities.lolexInstall();

    try {

        var ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        );

        var circle = ren.circle(10, 100, 10)
            .attr({
                fill: 'blue'
            })
            .add()
            .animate({
                x: 500
            }, {
                complete: function () {
                    circle.animate(
                        { y: 300 },
                        { duration: 50 }
                    );

                    assert.strictEqual(
                        this,
                        circle,
                        'The SVGElement should be the context of complete'
                    );
                },
                duration: 50
            });

        setTimeout(function () {
            assert.strictEqual(
                circle.element.getAttribute('cy'),
                '300',
                'Chained animation has run (#7363)'
            );


            circle.animate({
                y: 300
            }, {
                complete: function () {
                    assert.strictEqual(
                        this,
                        circle,
                        'The SVGElement should be the context of complete when ' +
                            'skipping animation to equal values (#7146)'
                    );
                }
            });
        }, 150);

        // Run and reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});

QUnit.test('Animation and text alignment', function (assert) {

    function setTextAndAlign(btn, box) {
        btn.attr({
            text: 'Longer text'
        }).align(null, false, box);
    }

    var clock = TestUtilities.lolexInstall();

    try {

        var btn,
            ren = new Highcharts.Renderer(
            document.getElementById('container'),
            400,
            400
        );

        var box = {
            x: 10,
            y: 10,
            width: 300,
            height: 380
        };

        ren.rect(box)
            .attr({
                'stroke': 'silver',
                'stroke-width': 1
            })
            .add();

        btn = ren.button('Click me')
            .attr({
                align: 'right'
            })
            .add()
            .align({
                align: 'right',
                x: 0,
                y: 0
            }, false, box);

        var initialRight = btn.translateX + btn.getBBox().width;
        setTextAndAlign(btn, box);

        assert.close(
            btn.translateX + btn.getBBox().width,
            initialRight,
            1,
            'The button should still be right aligned (#7898)'
        );


        // Run and reset animation
        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});
