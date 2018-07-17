(function () {

    // Visualize
    var each = Highcharts.each,
        len = 600,
        ren = new Highcharts.Renderer(
            document.getElementById('container'),
            len,
            300
        ),
        row = 0;

    function visualize(boxes) {
        ren.path(['M', 0, row + 55, 'L', len, row + 55])
        .attr({
            stroke: 'silver',
            'stroke-width': 2
        })
        .add();

        each(boxes, function (box, i) {
            if (box.pos !== undefined) {
                ren.rect(box.pos + 0.5, row + 10.5, box.size - 1, 20)
                .attr({
                    'fill': 'rgba(0, 0, 0, 0.1)',
                    'stroke-width': 1,
                    'stroke': Highcharts.getOptions().colors[i % 10]
                })
                .add();

                ren.path(['M', box.pos + box.size / 2, row + 30, 'L', box.target, row + 55, 'z'])
                .attr({
                    'stroke-width': 1,
                    'stroke': Highcharts.getOptions().colors[i % 10]
                })
                .add();
            }

            ren.circle(box.target, row + 55, 2)
            .attr({
                fill: 'blue'
            })
            .add();
        });

        row += 55;
    }

    function verify(boxes) {
        var pass = true;
        boxes
            .filter(function (box) {
                return typeof box.pos === 'number';
            })
            .reduce(function (prev, box) {
                if (box.pos < 0 || prev.pos + prev.size > box.pos || box.pos + box.size > len) {
                    pass = false;
                }

                return box;
            });
        return pass;
    }

    QUnit.test('Boxes within', function (assert) {

        var boxes = [{
            size: 20,
            target: 10
        }, {
            size: 40,
            target: 30
        }, {
            size: 50,
            target: 110
        }, {
            size: 80,
            target: 300
        }, {
            size: 80,
            target: 300
        }, {
            size: 60,
            target: 580
        }, {
            size: 100,
            target: 580
        }];

        Highcharts.distribute(boxes, len);

        visualize(boxes);

        assert.strictEqual(
            verify(boxes),
            true,
            'Simple boxes'
        );
    });



    QUnit.test('Crowded boxes', function (assert) {

        var boxes = [{
            size: 20,
            target: 10
        }, {
            size: 40,
            target: 30
        }, {
            size: 50,
            target: 110
        }, {
            size: 80,
            target: 200
        }, {
            size: 80,
            target: 300
        }, {
            size: 80,
            target: 310
        }, {
            size: 80,
            target: 320
        }, {
            size: 80,
            target: 300
        }, {
            size: 60,
            target: 480
        }, {
            size: 100,
            target: 580
        }];

        Highcharts.distribute(boxes, len);

        visualize(boxes);

        assert.strictEqual(
            verify(boxes),
            true,
            'Crowded boxes'
        );
    });

    QUnit.test('Equal, unranked boxes', function (assert) {

        var boxes = Highcharts.map(new Array(60), function (val, i) {
            return {
                size: 20,
                target: i * 10
            };
        });

        Highcharts.distribute(boxes, len, 100);

        visualize(boxes);

        assert.strictEqual(
            verify(boxes),
            true,
            'Equal, unranked boxes'
        );
    });
}());

