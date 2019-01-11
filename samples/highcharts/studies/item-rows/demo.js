/**
 * This is a study for an item series without axes, where point values signify
 * the number of items. Items are laid out in a sequence within the plot area.
 */
(function (H) {
    var extend = H.extend,
        merge = H.merge;
    Highcharts.seriesType(
        'item',
        // Inherits pie as the most tested non-cartesian series with individual
        // point legend, tooltips etc. Only downside is we need to re-enable
        // marker options.
        'pie',
        // Options
        {
            marker: merge(
                H.defaultOptions.plotOptions.line.marker,
                {
                    radius: null
                }
            ),
            rows: undefined,
            showInLegend: true
        },
        // Prototype members
        {
            translate: function () {
                this.generatePoints();
            },

            getRows: function () {
                var rows = this.options.rows,
                    cols,
                    ratio;

                // Get the row count that gives the most square cells
                if (!rows) {
                    ratio = this.chart.plotWidth / this.chart.plotHeight;
                    rows = Math.sqrt(this.total);

                    if (ratio > 1) {
                        rows = Math.ceil(rows);
                        while (rows > 0) {
                            cols = this.total / rows;
                            if (cols / rows > ratio) {
                                break;
                            }
                            rows--;
                        }
                    } else {
                        rows = Math.floor(rows);
                        while (rows < this.total) {
                            cols = this.total / rows;
                            if (cols / rows < ratio) {
                                break;
                            }
                            rows++;
                        }
                    }
                }
                return rows;
            },

            drawPoints: function () {
                var series = this,
                    options = this.options,
                    renderer = series.chart.renderer,
                    seriesMarkerOptions = options.marker,
                    borderWidth = this.borderWidth,
                    crisp = borderWidth % 2 ? 0.5 : 1,
                    i = 0,
                    rows = this.getRows(),
                    cols = Math.ceil(this.total / rows),
                    cellWidth = this.chart.plotWidth / cols,
                    cellHeight = this.chart.plotHeight / rows,
                    commonSize = Math.min(cellWidth, cellHeight);

                this.points.forEach(function (point) {
                    var attr,
                        graphics,
                        pointAttr,
                        pointMarkerOptions = point.marker || {},
                        symbol = (
                            pointMarkerOptions.symbol ||
                            seriesMarkerOptions.symbol
                        ),
                        radius = Highcharts.pick(
                            pointMarkerOptions.radius,
                            seriesMarkerOptions.radius
                        ),
                        size = H.defined(radius) ? 2 * radius : commonSize,
                        x,
                        y;

                    point.graphics = graphics = point.graphics || {};
                    pointAttr = point.pointAttr ?
                        (
                            point.pointAttr[point.selected ? 'selected' : ''] ||
                            series.pointAttr['']
                        ) :
                        series.pointAttribs(point, point.selected && 'select');
                    delete pointAttr.r;

                    if (series.chart.styledMode) {
                        delete pointAttr.stroke;
                        delete pointAttr['stroke-width'];
                    }

                    if (point.y !== null) {

                        if (!point.graphic) {
                            point.graphic = renderer.g('point').add(series.group);
                        }

                        for (var val = 0; val < point.y; val++) {

                            x = cellWidth * (i % cols);
                            y = cellHeight * Math.floor(i / cols);

                            if (series.options.crisp) {
                                x = Math.round(x) - crisp;
                                y = Math.round(y) + crisp;
                            }
                            attr = {
                                x: x,
                                y: y,
                                width: Math.round(size),
                                height: Math.round(size),
                                r: radius
                            };


                            if (graphics[val]) {
                                graphics[val].animate(attr);
                            } else {
                                graphics[val] = renderer.symbol(symbol)
                                    .attr(extend(attr, pointAttr))
                                    .add(point.graphic);
                            }
                            graphics[val].isActive = true;


                            i++;
                        }
                    }
                    H.objectEach(graphics, function (graphic, key) {
                        if (!graphic.isActive) {
                            graphic.destroy();
                            delete graphic[key];
                        } else {
                            graphic.isActive = false;
                        }
                    });
                });
            },
            drawDataLabels: H.noop,
            animate: H.noop
        },
        // Point class
        {
            haloPath: function () {
                return 'M 0 0';
            }
        }
    );
}(Highcharts));

Highcharts.chart('container', {

    chart: {
        type: 'item',
        plotBorderWidth: 1
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'Norwegian Parliament 2018'
    },

    series: [{
        name: 'Representatives',
        data: [
            ['Arbeiderpartiet', 49],
            ['Høyre', 45],
            ['Fremskrittspartiet', 27],
            ['Senterpartiet', 19],
            ['Sosialistisk Venstreparti', 11],
            ['Kristelig Folkeparti', 8],
            ['Venstre', 8],
            ['Miljøpartiet De Grønne', 1],
            ['Rødt', 1]
        ]
    }]

});
