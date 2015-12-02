$(function () {

    /**
     * Proof of concept for a Highcharts item chart
     *
     * TODO:
     * - Stacking
     * - Check update, remove etc.
     * - Custom icons like persons, carts etc. Either as images, font icons or Highcharts symbols.
     */
    (function (H) {
        var seriesTypes = H.seriesTypes,
            extendClass = H.extendClass,
            each = H.each,
            stop = H.stop;

        seriesTypes.item = extendClass(seriesTypes.column, {
            drawPoints: function () {
                var series = this,
                    graphics,
                    renderer = series.chart.renderer;

                each(this.points, function (point) {
                    var i,
                        attr,
                        graphics,
                        pointAttr;

                    point.graphics = graphics = point.graphics || {};
                    pointAttr = point.pointAttr[point.selected ? 'selected' : ''] || series.pointAttr[''];
                    delete pointAttr.r;

                    if (point.y !== null) {

                        if (!point.graphic) {
                            point.graphic = renderer.g().add(series.group);
                        }

                        for (i = 1; i <= point.y; i++) {
                            attr = {
                                x: point.plotX,
                                y: series.yAxis.toPixels(i, true),
                                r: Math.min(-series.pointXOffset, (series.yAxis.transA / 2) * (1 - (series.options.itemPadding || 0.2)))
                            };
                            if (graphics[i]) {
                                stop(graphics[i]);
                                graphics[i].attr(attr);
                            } else {
                                graphics[i] = renderer.circle(attr)
                                    .attr(pointAttr)
                                    .add(point.graphic);
                            }
                        }
                    }
                });

            }
        });

    }(Highcharts));


    $('#container').highcharts({

        chart: {
            type: 'item'
        },

        title: {
            text: 'Highcharts item chart'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        legend: {
            enabled: false
        },

        yAxis: {
            gridLineWidth: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            }
        },

        series: [{
            name: 'Items bought',
            data: [5, 3, 4]
        }]

    });
});