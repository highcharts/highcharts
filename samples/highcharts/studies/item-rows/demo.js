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
            endAngle: undefined,
            innerSize: '40%',
            itemPadding: 0.1,
            layout: 'vertical',
            marker: merge(
                H.defaultOptions.plotOptions.line.marker,
                {
                    radius: null
                }
            ),
            rows: undefined,
            showInLegend: true,
            startAngle: undefined
        },
        // Prototype members
        {
            translate: function () {
                if (!this.slots) {
                    this.slots = [];
                }
                if (
                    H.isNumber(this.options.startAngle) &&
                    H.isNumber(this.options.endAngle)
                ) {
                    H.seriesTypes.pie.prototype.translate.call(this);
                    this.slots = this.getSlots();
                } else {
                    this.generatePoints();
                }
            },

            // Get the semi-circular slots
            getSlots: function () {
                var [centerX, centerY, diameter, innerSize] = this.center,
                    row,
                    slots = this.slots,
                    x,
                    y,
                    rowRadius,
                    rowLength,
                    colCount,
                    increment,
                    angle,
                    col,
                    itemSize = 0,
                    rowCount,
                    fullAngle = this.endAngleRad - this.startAngleRad,
                    itemCount = Number.MAX_VALUE,
                    finalItemCount,
                    rows,
                    testRows = [];

                // Increase the itemSize until we find the best fit
                while (itemCount > this.total) {

                    finalItemCount = itemCount;

                    // Reset
                    slots.length = 0;
                    itemCount = 0;

                    // Now rows is the last successful run
                    rows = testRows.slice(0);
                    testRows.length = 0;

                    itemSize++;
                    rowCount = Math.floor((diameter - innerSize) / itemSize / 2);
                    for (row = rowCount; row >= 0; row--) {
                        rowRadius = (innerSize + (row / rowCount) *
                            (diameter - innerSize)) / 2;
                        rowLength = fullAngle * rowRadius;
                        colCount = Math.ceil(rowLength / itemSize);
                        testRows.push({ rowRadius, rowLength, colCount });

                        itemCount += colCount + 1;
                    }
                }

                var overshoot = finalItemCount - this.total;
                function removeCol(row) {
                    if (overshoot > 0) {
                        row.colCount--;
                        overshoot--;
                    }
                }
                while (overshoot) {
                    rows.forEach(removeCol);
                }

                rows.forEach(function (row) {
                    var rowRadius = row.rowRadius,
                        colCount = row.colCount;
                    increment = colCount ? fullAngle / colCount : 0;
                    for (col = 0; col <= colCount; col += 1) {
                        angle = this.startAngleRad + col * increment;
                        x = centerX + Math.cos(angle) * rowRadius;
                        y = centerY + Math.sin(angle) * rowRadius;
                        slots.push({ x, y, angle });
                    }
                }, this);

                // Sort by angle
                slots.sort(function (a, b) {
                    return a.angle - b.angle;
                });

                this.itemSize = itemSize;
                return slots;

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
                    itemSize = this.itemSize || Math.min(cellWidth, cellHeight);

                /*
                this.slots.forEach(slot => {
                    this.chart.renderer.circle(slot.x, slot.y, 6)
                        .attr({
                            fill: 'silver'
                        })
                        .add(this.group);
                });
                */

                this.points.forEach(function (point) {
                    var attr,
                        graphics,
                        pointAttr,
                        pointMarkerOptions = point.marker || {},
                        symbol = (
                            pointMarkerOptions.symbol ||
                            seriesMarkerOptions.symbol
                        ),
                        r = Highcharts.pick(
                            pointMarkerOptions.radius,
                            seriesMarkerOptions.radius
                        ),
                        size = H.defined(r) ? 2 * r : itemSize,
                        padding = size * options.itemPadding,
                        x,
                        y,
                        width,
                        height;

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

                            // Semi-circle
                            if (series.center) {

                                // Fill up the slots from left to right
                                var slot = series.slots.shift();
                                x = slot.x - itemSize / 2;
                                y = slot.y - itemSize / 2;

                            } else if (options.layout === 'horizontal') {
                                x = cellWidth * (i % cols);
                                y = cellHeight * Math.floor(i / cols);
                            } else {
                                x = cellWidth * Math.floor(i / rows);
                                y = cellHeight * (i % rows);
                            }

                            x += padding;
                            y += padding;
                            width = Math.round(size - 2 * padding);
                            height = width;

                            if (series.options.crisp) {
                                x = Math.round(x) - crisp;
                                y = Math.round(y) + crisp;
                            }
                            attr = { x, y, width, height, r };


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
        keys: ['name', 'y', 'color'],
        data: [
            ['Rødt', 1, '#851914'],
            ['Sosialistisk Venstreparti', 11, '#B0185B'],
            ['Arbeiderpartiet', 49, '#C6191D'],
            ['Senterpartiet', 19, '#5CA92E'],
            ['Miljøpartiet De Grønne', 1, '#024B26'],
            ['Kristelig Folkeparti', 8, '#F9B234'],
            ['Venstre', 8, '#036766'],
            ['Høyre', 45, '#4677BA'],
            ['Fremskrittspartiet', 27, '#262955']
        ],
        // Circular options
        center: ['50%', '88%'],
        size: '180%',
        startAngle: -100,
        endAngle: 100
    }]

});
