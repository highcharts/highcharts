document.addEventListener('DOMContentLoaded', function () {

    Highcharts.chart('container', {

        chart: {
            type: 'item'
        },

        title: {
            text: 'Highcharts item chart'
        },

        subtitle: {
            text: 'Parliament visualization'
        },

        legend: {
            labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
        },

        series: [{
            name: 'Representatives',
            keys: ['name', 'y', 'color', 'label'],
            data: [
                ['The Left', 69, '#BE3075', 'DIE LINKE'],
                ['Social Democratic Party', 153, '#EB001F', 'SPD'],
                ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
                ['Free Democratic Party', 80, '#FFED00', 'FDP'],
                ['Christian Democratic Union', 200, '#000000', 'CDU'],
                ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
                ['Alternative for Germany', 94, '#009EE0', 'AfD']
            ],
            dataLabels: {
                enabled: true,
                format: '{point.label}'
            },

            // Circular options
            center: ['50%', '88%'],
            size: '170%',
            startAngle: -100,
            endAngle: 100
        }]

    });
});

document.getElementById('gb').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        data: [
            ['Conservative', 318],
            ['Labour', 262],
            ['Scottish National Party', 35],
            ['Liberal Democrat', 12],
            ['Democratic Unionist Party', 10],
            ['Sinn Fein', 7],
            ['Plaid Cymru', 4],
            ['Green Party', 1],
            ['Others', 1]
        ],

        dataLabels: {
            enabled: false
        }
    });
});

document.getElementById('de').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        data: [
            ['The Left', 69, '#BE3075', 'DIE LINKE'],
            ['Social Democratic Party', 153, '#EB001F', 'SPD'],
            ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
            ['Free Democratic Party', 80, '#FFED00', 'FDP'],
            ['Christian Democratic Union', 200, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
            ['Alternative for Germany', 94, '#009EE0', 'AfD']
        ],

        dataLabels: {
            enabled: true
        }
    });
});

document.getElementById('no').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        data: [
            ['Rødt', 1, '#851914', 'R'],
            ['Sosialistisk Venstreparti', 11, '#B0185B', 'SV'],
            ['Arbeiderpartiet', 49, '#C6191D', 'AP'],
            ['Senterpartiet', 19, '#5CA92E', 'SP'],
            ['Miljøpartiet De Grønne', 1, '#024B26', 'MDG'],
            ['Kristelig Folkeparti', 8, '#F9B234', 'KrF'],
            ['Venstre', 8, '#036766', 'V'],
            ['Høyre', 45, '#4677BA', 'H'],
            ['Fremskrittspartiet', 27, '#262955', 'FrP']
        ],
        dataLabels: {
            enabled: true
        }
    });
});

document.getElementById('parliament').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
    });
});

document.getElementById('rectangle').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        startAngle: null,
        endAngle: null
    });
});

document.getElementById('circle').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        center: ['50%', '50%'],
        size: '100%',
        startAngle: 0,
        endAngle: 360
    });
});

document.getElementById('rows').addEventListener('change', function () {
    Highcharts.charts[0].series[0].update({
        rows: Number(this.value)
    });
});

document.getElementById('innersize').addEventListener('change', function () {
    Highcharts.charts[0].series[0].update({
        innerSize: this.value + '%'
    });
});

/**
 * This is a study for an item series without axes, where point values signify
 * the number of items. Items are laid out in a sequence within the plot area.
 */
(function (H) {
    var extend = H.extend,
        merge = H.merge,
        piePoint = H.seriesTypes.pie.prototype.pointClass.prototype;
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
            // Overrides innerSize
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
                    testRows,
                    rowsOption = this.options.rows,
                    // How many rows (arcs) should be used
                    rowFraction = (diameter - innerSize) / diameter;

                // Increase the itemSize until we find the best fit
                while (itemCount > this.total) {

                    finalItemCount = itemCount;

                    // Reset
                    slots.length = 0;
                    itemCount = 0;

                    // Now rows is the last successful run
                    rows = testRows;
                    testRows = [];

                    itemSize++;

                    // Total number of rows (arcs) from the center to the
                    // perimeter
                    rowCount = diameter / itemSize / 2;

                    if (rowsOption) {
                        innerSize = ((rowCount - rowsOption) / rowCount) * diameter;

                        if (innerSize >= 0) {
                            rowCount = rowsOption;

                        // If innerSize is negative, we are trying to set too
                        // many rows in the rows option, so fall back to
                        // treating it as innerSize 0
                        } else {
                            innerSize = 0;
                            rowFraction = 1;
                        }


                    } else {
                        rowCount = Math.floor(rowCount * rowFraction);
                    }

                    for (row = rowCount; row > 0; row--) {
                        rowRadius = (innerSize + (row / rowCount) *
                            (diameter - innerSize - itemSize)) / 2;
                        rowLength = fullAngle * rowRadius;
                        colCount = Math.ceil(rowLength / itemSize);
                        testRows.push({ rowRadius, rowLength, colCount });

                        itemCount += colCount + 1;
                    }
                }

                if (!rows) {
                    return;
                }

                // We now have more slots than we have total items. Loop over
                // the rows and remove the last slot until the count is correct.
                // For each iteration we sort the last slot by the angle, and
                // remove those with the highest angles.
                var overshoot = finalItemCount - this.total;
                function cutOffRow(item) {
                    if (overshoot > 0) {
                        item.row.colCount--;
                        overshoot--;
                    }
                }
                while (overshoot > 0) {
                    rows
                        // Return a simplified representation of the angle of
                        // the last slot within each row.
                        .map(function (row) {
                            return {
                                angle: row.colCount / row.rowLength,
                                row: row
                            };
                        })
                        // Sort by the angles...
                        .sort(function (a, b) {
                            return b.angle - a.angle;
                        })
                        // ...so that we can ignore the items with the lowest
                        // angles...
                        .slice(
                            0,
                            Math.min(overshoot, Math.ceil(rows.length / 2))
                        )
                        // ...and remove the ones with the highest angles
                        .forEach(cutOffRow);
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
                //*/

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

                    if (!point.isNull && point.visible) {

                        if (!point.graphic) {
                            point.graphic = renderer.g('point')
                                .add(series.group);
                        }

                        for (var val = 0; val < point.y; val++) {

                            // Semi-circle
                            if (series.center && series.slots) {

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
                            delete graphics[key];
                        } else {
                            graphic.isActive = false;
                        }
                    });
                });
            },
            drawDataLabels: function () {
                if (this.center && this.slots) {
                    H.seriesTypes.pie.prototype.drawDataLabels.call(this);

                // else, it's just a dot chart with no natural place to put the
                // data labels
                } else {
                    this.points.forEach(function (point) {
                        if (point.dataLabel) {
                            point.dataLabel = point.dataLabel.destroy();
                        }
                    });
                }
            },

            // Fade in the whole chart
            animate: function (init) {
                if (init) {
                    this.group.attr({
                        opacity: 0
                    });
                } else {
                    this.group.animate({
                        opacity: 1
                    }, this.options.animation);
                    this.animate = null;
                }
            }
        },
        // Point class
        {
            setState: function (state) {
                // Make this data stand out by setting the opacity of the others
                this.series.points.forEach(function (otherPoint) {
                    if (otherPoint !== this) {
                        otherPoint.graphic.animate(
                            { opacity: state === 'hover' ? 0.1 : 1 },
                            this.series.options.states[state || 'normal'].animation
                        );
                    }
                }, this);
            },
            connectorShapes: piePoint.connectorShapes,
            getConnectorPath: piePoint.getConnectorPath,
            setVisible: piePoint.setVisible
        }
    );

}(Highcharts));
