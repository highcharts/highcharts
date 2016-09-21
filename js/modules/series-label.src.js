/**
 * EXPERIMENTAL Highcharts module to place labels next to a series in a natural position.
 *
 * TODO:
 * - add column support (box collision detection, boxesToAvoid logic)
 * - other series types, area etc.
 * - avoid data labels, when data labels above, show series label below.
 * - add more options (connector, format, formatter)
 * 
 * http://jsfiddle.net/highcharts/L2u9rpwr/
 * http://jsfiddle.net/highcharts/y5A37/
 * http://jsfiddle.net/highcharts/264Nm/
 * http://jsfiddle.net/highcharts/y5A37/
 */
/* eslint indent: [2, 4] */
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function (H) {

    var labelDistance = 3,
        wrap = H.wrap,
        each = H.each,
        extend = H.extend,
        isNumber = H.isNumber,
        Series = H.Series,
        SVGRenderer = H.SVGRenderer,
        Chart = H.Chart;

    H.setOptions({
        plotOptions: {
            series: {
                label: {
                    enabled: true,
                    // Allow labels to be placed distant to the graph if necessary, and
                    // draw a connector line to the graph
                    connectorAllowed: true,
                    connectorNeighbourDistance: 24, // If the label is closer than this to a neighbour graph, draw a connector
                    styles: {
                        fontWeight: 'bold'
                    }
                    // boxesToAvoid: []
                }
            }
        }
    });

    /**
     * Counter-clockwise, part of the fast line intersection logic
     */
    function ccw(x1, y1, x2, y2, x3, y3) {
        var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));
        return cw > 0 ? true : cw < 0 ? false : true;
    }

    /**
     * Detect if two lines intersect
     */
    function intersectLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
            ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
    }

    /**
     * Detect if a box intersects with a line
     */
    function boxIntersectLine(x, y, w, h, x1, y1, x2, y2) {
        return (
            intersectLine(x, y, x + w, y,         x1, y1, x2, y2) || // top of label
            intersectLine(x + w, y, x + w, y + h, x1, y1, x2, y2) || // right of label
            intersectLine(x, y + h, x + w, y + h, x1, y1, x2, y2) || // bottom of label
            intersectLine(x, y, x, y + h,         x1, y1, x2, y2)    // left of label
        );
    }

    /**
     * General symbol definition for labels with connector
     */
    SVGRenderer.prototype.symbols.connector = function (x, y, w, h, options) {
        var anchorX = options && options.anchorX,
            anchorY = options && options.anchorY,
            path,
            yOffset,
            lateral = w / 2;

        if (isNumber(anchorX) && isNumber(anchorY)) {

            path = ['M', anchorX, anchorY];
            
            // Prefer 45 deg connectors
            yOffset = y - anchorY;
            if (yOffset < 0) {
                yOffset = -h - yOffset;
            }
            if (yOffset < w) {
                lateral = anchorX < x + (w / 2) ? yOffset : w - yOffset;
            }
            
            // Anchor below label
            if (anchorY > y + h) {
                path.push('L', x + lateral, y + h);

            // Anchor above label
            } else if (anchorY < y) {
                path.push('L', x + lateral, y);

            // Anchor left of label
            } else if (anchorX < x) {
                path.push('L', x, y + h / 2);
            
            // Anchor right of label
            } else if (anchorX > x + w) {
                path.push('L', x + w, y + h / 2);
            }
        }
        return path || [];
    };

    /**
     * Points to avoid. In addition to actual data points, the label should avoid
     * interpolated positions.
     */
    Series.prototype.getPointsOnGraph = function () {
        var distance = 16,
            points = this.points,
            point,
            last,
            interpolated = [],
            i,
            deltaX,
            deltaY,
            delta,
            len,
            n,
            j,
            d,
            graph = this.graph || this.area,
            node = graph.element,
            inverted = this.chart.inverted,
            paneLeft = inverted ? this.yAxis.pos : this.xAxis.pos,
            paneTop = inverted ? this.xAxis.pos : this.yAxis.pos;

        // For splines, get the point at length (possible caveat: peaks are not correctly detected)
        if (this.getPointSpline && node.getPointAtLength) {
            // If it is animating towards a path definition, use that briefly, and reset
            if (graph.toD) {
                d = graph.attr('d');
                graph.attr({ d: graph.toD });
            }
            len = node.getTotalLength();
            for (i = 0; i < len; i += distance) {
                point = node.getPointAtLength(i);
                interpolated.push({
                    chartX: paneLeft + point.x,
                    chartY: paneTop + point.y,
                    plotX: point.x,
                    plotY: point.y
                });
            }
            if (d) {
                graph.attr({ d: d });
            }
            // Last point
            point = points[points.length - 1];
            point.chartX = paneLeft + point.plotX;
            point.chartY = paneTop + point.plotY;
            interpolated.push(point);

        // Interpolate
        } else {
            len = points.length;
            for (i = 0; i < len; i += 1) {

                point = points[i];
                last = points[i - 1];

                // Absolute coordinates so we can compare different panes
                point.chartX = paneLeft + point.plotX;
                point.chartY = paneTop + point.plotY;

                // Add interpolated points
                if (i > 0) {
                    deltaX = Math.abs(point.chartX - last.chartX);
                    deltaY = Math.abs(point.chartY - last.chartY);
                    delta = Math.max(deltaX, deltaY);
                    if (delta > distance) {

                        n = Math.ceil(delta / distance);

                        for (j = 1; j < n; j += 1) {
                            interpolated.push({
                                chartX: last.chartX + (point.chartX - last.chartX) * (j / n),
                                chartY: last.chartY + (point.chartY - last.chartY) * (j / n),
                                plotX: last.plotX + (point.plotX - last.plotX) * (j / n),
                                plotY: last.plotY + (point.plotY - last.plotY) * (j / n)
                            });
                        }
                    }
                }

                // Add the real point in order to find positive and negative peaks
                if (isNumber(point.plotY)) {
                    interpolated.push(point);
                }
            }
        }
        return interpolated;
    };

    /**
     * Check whether a proposed label position is clear of other elements
     */
    Series.prototype.checkClearPoint = function (x, y, bBox, checkDistance) {
        var distToOthersSquared = Number.MAX_VALUE, // distance to other graphs
            distToPointSquared = Number.MAX_VALUE,
            dist,
            connectorPoint,
            connectorEnabled = this.options.label.connectorAllowed,

            chart = this.chart,
            series,
            points,
            leastDistance = 16,
            withinRange,
            i,
            j;

        function intersectRect(r1, r2) {
            return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
        }

        /**
         * Get the weight in order to determine the ideal position. Larger distance to
         * other series gives more weight. Smaller distance to the actual point (connector points only)
         * gives more weight.
         */
        function getWeight(distToOthersSquared, distToPointSquared) {
            return distToOthersSquared - distToPointSquared;
        }

        // First check for collision with existing labels
        for (i = 0; i < chart.boxesToAvoid.length; i += 1) {
            if (intersectRect(chart.boxesToAvoid[i], {
                left: x,
                right: x + bBox.width,
                top: y,
                bottom: y + bBox.height
            })) {
                return false;
            }
        }

        // For each position, check if the lines around the label intersect with any of the 
        // graphs
        for (i = 0; i < chart.series.length; i += 1) {
            series = chart.series[i];
            points = series.interpolatedPoints;
            if (series.visible && points) {
                for (j = 1; j < points.length; j += 1) {
                    // If any of the box sides intersect with the line, return
                    if (boxIntersectLine(
                            x,
                            y,
                            bBox.width,
                            bBox.height,
                            points[j - 1].chartX,
                            points[j - 1].chartY,
                            points[j].chartX,
                            points[j].chartY
                        )) {
                        return false;
                    }

                    // But if it is too far away (a padded box doesn't intersect), also return
                    if (this === series && !withinRange && checkDistance) {
                        withinRange = boxIntersectLine(
                            x - leastDistance,
                            y - leastDistance,
                            bBox.width + 2 * leastDistance,
                            bBox.height + 2 * leastDistance,
                            points[j - 1].chartX,
                            points[j - 1].chartY,
                            points[j].chartX,
                            points[j].chartY
                        );
                    }

                    // Find the squared distance from the center of the label
                    if (this !== series) {
                        distToOthersSquared = Math.min(
                            distToOthersSquared,
                            Math.pow(x + bBox.width / 2 - points[j].chartX, 2) + Math.pow(y + bBox.height / 2 - points[j].chartY, 2),
                            Math.pow(x - points[j].chartX, 2) + Math.pow(y - points[j].chartY, 2),
                            Math.pow(x + bBox.width - points[j].chartX, 2) + Math.pow(y - points[j].chartY, 2),
                            Math.pow(x + bBox.width - points[j].chartX, 2) + Math.pow(y + bBox.height - points[j].chartY, 2),
                            Math.pow(x - points[j].chartX, 2) + Math.pow(y + bBox.height - points[j].chartY, 2)
                        );
                    }
                }

                // Do we need a connector? 
                if (connectorEnabled && this === series && ((checkDistance && !withinRange) || 
                        distToOthersSquared < Math.pow(this.options.label.connectorNeighbourDistance, 2))) {
                    for (j = 1; j < points.length; j += 1) {
                        dist = Math.min(
                            Math.pow(x + bBox.width / 2 - points[j].chartX, 2) + Math.pow(y + bBox.height / 2 - points[j].chartY, 2),
                            Math.pow(x - points[j].chartX, 2) + Math.pow(y - points[j].chartY, 2),
                            Math.pow(x + bBox.width - points[j].chartX, 2) + Math.pow(y - points[j].chartY, 2),
                            Math.pow(x + bBox.width - points[j].chartX, 2) + Math.pow(y + bBox.height - points[j].chartY, 2),
                            Math.pow(x - points[j].chartX, 2) + Math.pow(y + bBox.height - points[j].chartY, 2)
                        );
                        if (dist < distToPointSquared) {
                            distToPointSquared = dist;
                            connectorPoint = points[j];
                        }
                    }
                    withinRange = true;
                }
            }
        }

        return !checkDistance || withinRange ? {
            x: x,
            y: y,
            weight: getWeight(distToOthersSquared, connectorPoint ? distToPointSquared : 0),
            connectorPoint: connectorPoint
        } : false;

    };


    /**
     * The main initiator method that runs on chart level after initiation and redraw. It runs in 
     * a timeout to prevent locking, and loops over all series, taking all series and labels into
     * account when placing the labels.
     */
    function drawLabels(proceed) {

        var chart = this;

        proceed.call(chart);

        clearTimeout(chart.seriesLabelTimer);

        chart.seriesLabelTimer = setTimeout(function () {

            chart.boxesToAvoid = [];

            // Build the interpolated points
            each(chart.series, function (series) {
                var options = series.options.label;
                if (options.enabled && series.visible && (series.graph || series.area)) {
                    series.interpolatedPoints = series.getPointsOnGraph();

                    each(options.boxesToAvoid || [], function (box) {
                        chart.boxesToAvoid.push(box);
                    });
                }
            });

            each(chart.series, function (series) {
                var bBox,
                    x,
                    y,
                    results = [],
                    clearPoint,
                    i,
                    best,
                    inverted = chart.inverted,
                    paneLeft = inverted ? series.yAxis.pos : series.xAxis.pos,
                    paneTop = inverted ? series.xAxis.pos : series.yAxis.pos,
                    paneWidth = chart.inverted ? series.yAxis.len : series.xAxis.len,
                    paneHeight = chart.inverted ? series.xAxis.len : series.yAxis.len,
                    points = series.interpolatedPoints;

                function insidePane(x, y, bBox) {
                    return x > paneLeft && x <= paneLeft + paneWidth - bBox.width && 
                        y >= paneTop && y <= paneTop + paneHeight - bBox.height;
                }

                if (series.visible && points) {

                    if (!series.labelBySeries) {
                        series.labelBySeries = chart.renderer.label(series.name, 0, -9999, 'connector')
                            .css(extend({
                                color: series.color
                            }, series.options.label.styles))
                            .attr({
                                padding: 0,
                                opacity: 0,
                                stroke: series.color,
                                'stroke-width': 1
                            })
                            .add(series.group)
                            .animate({ opacity: 1 }, { duration: 200 });
                    }

                    bBox = series.labelBySeries.getBBox();
                    bBox.width = Math.round(bBox.width);

                    // Ideal positions are centered above or below a point on right side of chart
                    for (i = points.length - 1; i > 0; i -= 1) {

                        // Right - up
                        x = points[i].chartX + labelDistance;
                        y = points[i].chartY - bBox.height - labelDistance;
                        if (insidePane(x, y, bBox)) {
                            best = series.checkClearPoint(
                                x,
                                y,
                                bBox
                            );
                        }
                        if (best) {
                            results.push(best);
                        }

                        // Right - down
                        x = points[i].chartX + labelDistance;
                        y = points[i].chartY + labelDistance;
                        if (insidePane(x, y, bBox)) {
                            best = series.checkClearPoint(
                                x,
                                y,
                                bBox
                            );
                        }
                        if (best) {
                            results.push(best);
                        }

                        // Left - down
                        x = points[i].chartX - bBox.width - labelDistance;
                        y = points[i].chartY + labelDistance;
                        if (insidePane(x, y, bBox)) {
                            best = series.checkClearPoint(
                                x,
                                y,
                                bBox
                            );
                        }
                        if (best) {
                            results.push(best);
                        }

                        // Left - up
                        x = points[i].chartX - bBox.width - labelDistance;
                        y = points[i].chartY - bBox.height - labelDistance;
                        if (insidePane(x, y, bBox)) {
                            best = series.checkClearPoint(
                                x,
                                y,
                                bBox
                            );
                        }
                        if (best) {
                            results.push(best);
                        }

                    }

                    // Brute force, try all positions on the chart in a 16x16 grid
                    if (!results.length) {
                        for (x = paneLeft + paneWidth - bBox.width; x >= paneLeft; x -= 16) {
                            for (y = paneTop; y < paneTop + paneHeight - bBox.height; y += 16) {
                                clearPoint = series.checkClearPoint(x, y, bBox, true);
                                if (clearPoint) {
                                    results.push(clearPoint);
                                }
                            }
                        }
                    }

                    if (results.length) {

                        results.sort(function (a, b) {
                            return b.weight - a.weight;
                        });
                        
                        best = results[0];

                        chart.boxesToAvoid.push({
                            left: best.x,
                            right: best.x + bBox.width,
                            top: best.y,
                            bottom: best.y + bBox.height
                        });

                        // Move it if needed
                        if (Math.round(best.x) !== Math.round(series.labelBySeries.x) || Math.round(best.y) !== Math.round(series.labelBySeries.y)) {
                            series.labelBySeries
                                .attr({
                                    x: best.x - paneLeft,
                                    y: best.y - paneTop,
                                    anchorX: best.connectorPoint && best.connectorPoint.plotX,
                                    anchorY: best.connectorPoint && best.connectorPoint.plotY,
                                    opacity: 0
                                })
                                .animate({ opacity: 1 });
                        }

                    } else if (series.labelBySeries) {
                        series.labelBySeries = series.labelBySeries.destroy();
                    }
                }
            });
        }, 350);

    }
    wrap(Chart.prototype, 'render', drawLabels);
    wrap(Chart.prototype, 'redraw', drawLabels);

}));
