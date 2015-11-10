$(function () {
    QUnit.test('PointBreak with different thresholds', function (assert) {
        var breaks = [{
            from: -40000,
            to: -20000
        }, {
            from: 20000,
            to: 40000
        }];

        var chart = $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Point break for positives and negatives, respecting treshold'
            },
            yAxis: {
                tickInterval: 5000,
                breaks: breaks,
                events: {
                    pointBreak: function (e) {
                        var point = e.point,
                            brk = e.brk,
                            shapeArgs = point.shapeArgs,
                            x = shapeArgs.x,
                            y = this.toPixels(brk.from, true),
                            w = shapeArgs.width,
                            key = ['brk', brk.from, brk.to],
                            path = ['M', x, y, 'L', x + w * 0.25, y + 4, 'L', x + w * 0.75, y - 4, 'L', x + w, y];

                        if (!point[key]) {
                            point[key] = this.chart.renderer.path(path)
                                .attr({
                                    'stroke-width': 3,
                                    stroke: "red"
                                }).add(point.graphic.parentGroup);
                        } else {
                            point[key].attr({
                                d: path
                            });
                        }
                    }
                }
            },
            series: [{
                name: 'Threshold 0',
                // threshold: 0, // default
                data: [10000, 50000, -10000, -70000]
            }, {
                name: 'Threshold 100k',
                threshold: 100000,
                data: [10000, 50000, -10000, -70000]
            }, {
                name: 'Threshold -100k',
                threshold: -100000,
                data: [10000, 50000, -10000, -70000]
            }, {
                name: 'Threshold null',
                threshold: null,
                data: [10000, 50000, -10000, -70000]
            }]
        }).highcharts();

        var series = chart.series;
        // Zero breaks:
        assert.strictEqual(
            !(series[0].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[0].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has zero breaks"
        );
        assert.strictEqual(
            !(series[0].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[0].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has zero breaks"
        );
        assert.strictEqual(
            !(series[1].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[1].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has zero breaks"
        );
        assert.strictEqual(
            !(series[2].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[2].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has zero breaks"
        );
        assert.strictEqual(
            !(series[3].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[3].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has zero breaks"
        );

        // Exactly one break:
        assert.strictEqual(
            !(series[0].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            (series[0].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (top) break"
        );
        assert.strictEqual(
            (series[0].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[0].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (bottom) break"
        );
        assert.strictEqual(
            !(series[1].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            (series[1].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (top) break"
        );
        assert.strictEqual(
            !(series[1].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            (series[1].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (top) break"
        );
        assert.strictEqual(
            (series[2].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[2].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (bottom) break"
        );
        assert.strictEqual(
            (series[2].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[2].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (bottom) break"
        );
        assert.strictEqual(
            (series[3].points[0][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[3].points[0][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (bottom) break"
        );
        assert.strictEqual(
            (series[3].points[2][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            !(series[3].points[2][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has exactly one (bottom) break"
        );
        // Two or more breaks:
        assert.strictEqual(
            (series[1].points[3][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            (series[1].points[3][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has two breaks"
        );
        assert.strictEqual(
            (series[2].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            (series[2].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has two breaks"
        );
        assert.strictEqual(
            (series[3].points[1][['brk', breaks[0].from, breaks[0].to]] instanceof Highcharts.SVGElement) &&
            (series[3].points[1][['brk', breaks[1].from, breaks[1].to]] instanceof
                Highcharts.SVGElement),
            true,
            "Has two breaks"
        );
    });
});