/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * One position in relation to an axis.
 *
 * @typedef Highcharts.PointerAxisCoordinateObject
 *
 * @property {Highcharts.Axis} axis
 *           Related axis.
 *
 * @property {number} value
 *           Axis value.
 */

/**
 * Positions in terms of axis values.
 *
 * @typedef Highcharts.PointerAxisCoordinatesObject
 *
 * @property {Array<Highcharts.PointerAxisCoordinateObject>} xAxis
 *           Positions on the x-axis.
 *
 * @property {Array<Highcharts.PointerAxisCoordinateObject>} yAxis
 *           Positions on the y-axis.
 */

/**
 * Pointer coordinates.
 *
 * @typedef Highcharts.PointerCoordinatesObject
 *
 * @property {number} chartX
 *
 * @property {number} chartY
 */

/**
 * A native browser mouse or touch event, extended with position information
 * relative to the {@link Chart.container}.
 *
 * @typedef {global.PointerEvent} Highcharts.PointerEventObject
 *
 * @property {number} chartX
 *           The X coordinate of the pointer interaction relative to the
 *           chart.
 *
 * @property {number} chartY
 *           The Y coordinate of the pointer interaction relative to the
 *           chart.
 */

/**
 * Axis-specific data of a selection.
 *
 * @typedef Highcharts.SelectDataObject
 *
 * @property {Highcharts.Axis} axis
 *
 * @property {number} min
 *
 * @property {number} max
 */

/**
 * Object for select events.
 *
 * @typedef Highcharts.SelectEventObject
 *
 * @property {global.Event} originalEvent
 *
 * @property {Array<Highcharts.SelectDataObject>} xAxis
 *
 * @property {Array<Highcharts.SelectDataObject>} yAxis
 */

'use strict';

import Highcharts from './Globals.js';
import './Utilities.js';
import './Tooltip.js';
import './Color.js';

var H = Highcharts,
    addEvent = H.addEvent,
    attr = H.attr,
    charts = H.charts,
    color = H.color,
    css = H.css,
    defined = H.defined,
    each = H.each,
    extend = H.extend,
    find = H.find,
    fireEvent = H.fireEvent,
    isNumber = H.isNumber,
    isObject = H.isObject,
    offset = H.offset,
    pick = H.pick,
    splat = H.splat,
    Tooltip = H.Tooltip;

/**
 * The mouse and touch tracker object. Each {@link Chart} item has one
 * assosiated Pointer item that can be accessed from the  {@link Chart.pointer}
 * property.
 *
 * @class
 * @name Highcharts.Pointer
 *
 * @param {Highcharts.Chart} chart
 *        The Chart instance.
 *
 * @param {Highcharts.Options} options
 *        The root options object. The pointer uses options from the chart and
 *        tooltip structures.
 */
Highcharts.Pointer = function (chart, options) {
    this.init(chart, options);
};

Highcharts.Pointer.prototype = {
    /**
     * Initialize the Pointer.
     *
     * @private
     * @function Highcharts.Pointer#init
     *
     * @param {Highcharts.Chart} chart
     *        The Chart instance.
     *
     * @param {Highcharts.Options} options
     *        The root options object. The pointer uses options from the chart
     *        and tooltip structures.
     */
    init: function (chart, options) {

        // Store references
        this.options = options;
        this.chart = chart;

        // Do we need to handle click on a touch device?
        this.runChartClick =
            options.chart.events && !!options.chart.events.click;

        this.pinchDown = [];
        this.lastValidTouch = {};

        if (Tooltip) {
            /**
             * Tooltip object for points of series.
             *
             * @name Highcharts.Chart#tooltip
             * @type {Highcharts.Tooltip}
             */
            chart.tooltip = new Tooltip(chart, options.tooltip);
            this.followTouchMove = pick(options.tooltip.followTouchMove, true);
        }

        this.setDOMEvents();
    },

    /**
     * Resolve the zoomType option, this is reset on all touch start and mouse
     * down events.
     *
     * @private
     * @function Highcharts.Pointer#zoomOption
     *
     * @param {global.Event} e
     *        Event object.
     */
    zoomOption: function (e) {
        var chart = this.chart,
            options = chart.options.chart,
            zoomType = options.zoomType || '',
            inverted = chart.inverted,
            zoomX,
            zoomY;

        // Look for the pinchType option
        if (/touch/.test(e.type)) {
            zoomType = pick(options.pinchType, zoomType);
        }

        this.zoomX = zoomX = /x/.test(zoomType);
        this.zoomY = zoomY = /y/.test(zoomType);
        this.zoomHor = (zoomX && !inverted) || (zoomY && inverted);
        this.zoomVert = (zoomY && !inverted) || (zoomX && inverted);
        this.hasZoom = zoomX || zoomY;
    },

    /**
     * Takes a browser event object and extends it with custom Highcharts
     * properties `chartX` and `chartY` in order to work on the internal
     * coordinate system.
     *
     * @function Highcharts.Pointer#normalize
     *
     * @param {global.Event} e
     *        Event object in standard browsers.
     *
     * @return {Highcharts.PointerEventObject}
     *         A browser event with extended properties `chartX` and `chartY`.
     */
    normalize: function (e, chartPosition) {
        var ePos;

        // iOS (#2757)
        ePos = e.touches ?
            (e.touches.length ? e.touches.item(0) : e.changedTouches[0]) :
            e;

        // Get mouse position
        if (!chartPosition) {
            this.chartPosition = chartPosition = offset(this.chart.container);
        }

        return extend(e, {
            chartX: Math.round(ePos.pageX - chartPosition.left),
            chartY: Math.round(ePos.pageY - chartPosition.top)
        });
    },

    /**
     * Get the click position in terms of axis values.
     *
     * @function Highcharts.Pointer#getCoordinates
     *
     * @param {Highcharts.PointerEventObject} e
     *        Pointer event, extended with `chartX` and `chartY` properties.
     *
     * @return {Highcharts.PointerAxisCoordinatesObject}
     */
    getCoordinates: function (e) {

        var coordinates = {
            xAxis: [],
            yAxis: []
        };

        each(this.chart.axes, function (axis) {
            coordinates[axis.isXAxis ? 'xAxis' : 'yAxis'].push({
                axis: axis,
                value: axis.toValue(e[axis.horiz ? 'chartX' : 'chartY'])
            });
        });

        return coordinates;
    },

    /**
     * Finds the closest point to a set of coordinates, using the k-d-tree
     * algorithm.
     *
     * @function Highcharts.Pointer#findNearestKDPoints
     *
     * @param {Array<Highcharts.Series>} series
     *        All the series to search in.
     *
     * @param {boolean} shared
     *        Whether it is a shared tooltip or not.
     *
     * @param {Highcharts.PointerCoordinatesObject} coordinates
     *        Chart coordinates of the pointer.
     *
     * @return {Point|undefined}
     *         The point closest to given coordinates.
     */
    findNearestKDPoint: function (series, shared, coordinates) {
        var closest,
            sort = function (p1, p2) {
                var isCloserX = p1.distX - p2.distX,
                    isCloser = p1.dist - p2.dist,
                    isAbove =
                        (p2.series.group && p2.series.group.zIndex) -
                        (p1.series.group && p1.series.group.zIndex),
                    result;

                // We have two points which are not in the same place on xAxis
                // and shared tooltip:
                if (isCloserX !== 0 && shared) { // #5721
                    result = isCloserX;
                // Points are not exactly in the same place on x/yAxis:
                } else if (isCloser !== 0) {
                    result = isCloser;
                // The same xAxis and yAxis position, sort by z-index:
                } else if (isAbove !== 0) {
                    result = isAbove;
                // The same zIndex, sort by array index:
                } else {
                    result = p1.series.index > p2.series.index ? -1 : 1;
                }
                return result;
            };
        each(series, function (s) {
            var noSharedTooltip = s.noSharedTooltip && shared,
                compareX = (
                    !noSharedTooltip &&
                    s.options.findNearestPointBy.indexOf('y') < 0
                ),
                point = s.searchPoint(
                    coordinates,
                    compareX
                );
            if (
                // Check that we actually found a point on the series.
                isObject(point, true) &&
                // Use the new point if it is closer.
                (!isObject(closest, true) || (sort(closest, point) > 0))
            ) {
                closest = point;
            }
        });
        return closest;
    },

    /**
     * @private
     * @function Highcharts.Pointer#getPointFromEvent
     *
     * @param {global.Event} e
     *
     * @return {Highcharts.Point|undefined}
     */
    getPointFromEvent: function (e) {
        var target = e.target,
            point;

        while (target && !point) {
            point = target.point;
            target = target.parentNode;
        }
        return point;
    },

    /**
     * @private
     * @function Highcharts.Pointer#getChartCoordinatesFromPoint
     *
     * @param {Highcharts.Point} point
     *
     * @param {boolean} inverted
     *
     * @return {Highcharts.PointerCoordinatesObject}
     */
    getChartCoordinatesFromPoint: function (point, inverted) {
        var series = point.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            plotX = pick(point.clientX, point.plotX),
            shapeArgs = point.shapeArgs;

        if (xAxis && yAxis) {
            return inverted ? {
                chartX: xAxis.len + xAxis.pos - plotX,
                chartY: yAxis.len + yAxis.pos - point.plotY
            } : {
                chartX: plotX + xAxis.pos,
                chartY: point.plotY + yAxis.pos
            };
        } else if (shapeArgs && shapeArgs.x && shapeArgs.y) {
            // E.g. pies do not have axes
            return {
                chartX: shapeArgs.x,
                chartY: shapeArgs.y
            };
        }
    },

    /**
     * Calculates what is the current hovered point/points and series.
     *
     * @private
     * @function Highcharts.Pointer#getHoverData
     *
     * @param {Highcharts.Point|undefined} existingHoverPoint
     *        The point currrently beeing hovered.
     *
     * @param {Highcharts.Series|undefined} existingHoverSeries
     *        The series currently beeing hovered.
     *
     * @param {Array<Highcharts.Series>} series
     *        All the series in the chart.
     *
     * @param {boolean} isDirectTouch
     *        Is the pointer directly hovering the point.
     *
     * @param {boolean} shared
     *        Whether it is a shared tooltip or not.
     *
     * @param {Highcharts.PointerCoordinatesObject} coordinates
     *        Chart coordinates of the pointer.
     *
     * @return {*}
     *         Object containing resulting hover data: hoverPoint, hoverSeries,
     *         and hoverPoints.
     */
    getHoverData: function (
        existingHoverPoint,
        existingHoverSeries,
        series,
        isDirectTouch,
        shared,
        coordinates,
        params
    ) {
        var hoverPoint,
            hoverPoints = [],
            hoverSeries = existingHoverSeries,
            isBoosting = params && params.isBoosting,
            useExisting = !!(isDirectTouch && existingHoverPoint),
            notSticky = hoverSeries && !hoverSeries.stickyTracking,
            filter = function (s) {
                return (
                    s.visible &&
                    !(!shared && s.directTouch) && // #3821
                    pick(s.options.enableMouseTracking, true)
                );
            },
            // Which series to look in for the hover point
            searchSeries = notSticky ?
                // Only search on hovered series if it has stickyTracking false
                [hoverSeries] :
                // Filter what series to look in.
                H.grep(series, function (s) {
                    return filter(s) && s.stickyTracking;
                });

        // Use existing hovered point or find the one closest to coordinates.
        hoverPoint = useExisting ?
            existingHoverPoint :
            this.findNearestKDPoint(searchSeries, shared, coordinates);

        // Assign hover series
        hoverSeries = hoverPoint && hoverPoint.series;

        // If we have a hoverPoint, assign hoverPoints.
        if (hoverPoint) {
            // When tooltip is shared, it displays more than one point
            if (shared && !hoverSeries.noSharedTooltip) {
                searchSeries = H.grep(series, function (s) {
                    return filter(s) && !s.noSharedTooltip;
                });

                // Get all points with the same x value as the hoverPoint
                each(searchSeries, function (s) {
                    var point = find(s.points, function (p) {
                        return p.x === hoverPoint.x && !p.isNull;
                    });
                    if (isObject(point)) {
                        /*
                        * Boost returns a minimal point. Convert it to a usable
                        * point for tooltip and states.
                        */
                        if (isBoosting) {
                            point = s.getPoint(point);
                        }
                        hoverPoints.push(point);
                    }
                });
            } else {
                hoverPoints.push(hoverPoint);
            }
        }
        return {
            hoverPoint: hoverPoint,
            hoverSeries: hoverSeries,
            hoverPoints: hoverPoints
        };
    },

    /**
     * With line type charts with a single tracker, get the point closest to the
     * mouse. Run Point.onMouseOver and display tooltip for the point or points.
     *
     * @private
     * @function Highcharts.Pointer#runPointActions
     *
     * @param {global.Event} e
     *
     * @param {Highcharts.Point} p
     *
     * @fires Highcharts.Point#event:mouseOut
     * @fires Highcharts.Point#event:mouseOver
     */
    runPointActions: function (e, p) {
        var pointer = this,
            chart = pointer.chart,
            series = chart.series,
            tooltip = chart.tooltip && chart.tooltip.options.enabled ?
                chart.tooltip :
                undefined,
            shared = tooltip ? tooltip.shared : false,
            hoverPoint = p || chart.hoverPoint,
            hoverSeries = hoverPoint && hoverPoint.series || chart.hoverSeries,
            // onMouseOver or already hovering a series with directTouch
            isDirectTouch = e.type !== 'touchmove' && (
                !!p || (
                    (hoverSeries && hoverSeries.directTouch) &&
                    pointer.isDirectTouch
                )
            ),
            hoverData = this.getHoverData(
                hoverPoint,
                hoverSeries,
                series,
                isDirectTouch,
                shared,
                e,
                { isBoosting: chart.isBoosting }
            ),
            useSharedTooltip,
            followPointer,
            anchor,
            points;

        // Update variables from hoverData.
        hoverPoint = hoverData.hoverPoint;
        points = hoverData.hoverPoints;
        hoverSeries = hoverData.hoverSeries;
        followPointer = hoverSeries && hoverSeries.tooltipOptions.followPointer;
        useSharedTooltip = (
            shared &&
            hoverSeries &&
            !hoverSeries.noSharedTooltip
        );

        // Refresh tooltip for kdpoint if new hover point or tooltip was hidden
        // #3926, #4200
        if (
            hoverPoint &&
            // !(hoverSeries && hoverSeries.directTouch) &&
            (hoverPoint !== chart.hoverPoint || (tooltip && tooltip.isHidden))
        ) {
            each(chart.hoverPoints || [], function (p) {
                if (H.inArray(p, points) === -1) {
                    p.setState();
                }
            });
            // Do mouseover on all points (#3919, #3985, #4410, #5622)
            each(points || [], function (p) {
                p.setState('hover');
            });
            // set normal state to previous series
            if (chart.hoverSeries !== hoverSeries) {
                hoverSeries.onMouseOver();
            }

            // If tracking is on series in stead of on each point,
            // fire mouseOver on hover point. // #4448
            if (chart.hoverPoint) {
                chart.hoverPoint.firePointEvent('mouseOut');
            }

            // Hover point may have been destroyed in the event handlers (#7127)
            if (!hoverPoint.series) {
                return;
            }

            hoverPoint.firePointEvent('mouseOver');
            chart.hoverPoints = points;
            chart.hoverPoint = hoverPoint;
            // Draw tooltip if necessary
            if (tooltip) {
                tooltip.refresh(useSharedTooltip ? points : hoverPoint, e);
            }
        // Update positions (regardless of kdpoint or hoverPoint)
        } else if (followPointer && tooltip && !tooltip.isHidden) {
            anchor = tooltip.getAnchor([{}], e);
            tooltip.updatePosition({ plotX: anchor[0], plotY: anchor[1] });
        }

        // Start the event listener to pick up the tooltip and crosshairs
        if (!pointer.unDocMouseMove) {
            pointer.unDocMouseMove = addEvent(
                chart.container.ownerDocument,
                'mousemove',
                function (e) {
                    var chart = charts[H.hoverChartIndex];
                    if (chart) {
                        chart.pointer.onDocumentMouseMove(e);
                    }
                }
            );
        }

        // Issues related to crosshair #4927, #5269 #5066, #5658
        each(chart.axes, function drawAxisCrosshair(axis) {
            var snap = pick(axis.crosshair.snap, true),
                point = !snap ?
                    undefined :
                    H.find(points, function (p) {
                        return p.series[axis.coll] === axis;
                    });

            // Axis has snapping crosshairs, and one of the hover points belongs
            // to axis. Always call drawCrosshair when it is not snap.
            if (point || !snap) {
                axis.drawCrosshair(e, point);
            // Axis has snapping crosshairs, but no hover point belongs to axis
            } else {
                axis.hideCrosshair();
            }
        });
    },

    /**
     * Reset the tracking by hiding the tooltip, the hover series state and the
     * hover point
     *
     * @function Highcharts.Pointer#reset
     *
     * @param {boolean} allowMove
     *        Instead of destroying the tooltip altogether, allow moving it if
     *        possible.
     *
     * @param {number} delay
     */
    reset: function (allowMove, delay) {
        var pointer = this,
            chart = pointer.chart,
            hoverSeries = chart.hoverSeries,
            hoverPoint = chart.hoverPoint,
            hoverPoints = chart.hoverPoints,
            tooltip = chart.tooltip,
            tooltipPoints = tooltip && tooltip.shared ?
                hoverPoints :
                hoverPoint;

        // Check if the points have moved outside the plot area (#1003, #4736,
        // #5101)
        if (allowMove && tooltipPoints) {
            each(splat(tooltipPoints), function (point) {
                if (point.series.isCartesian && point.plotX === undefined) {
                    allowMove = false;
                }
            });
        }

        // Just move the tooltip, #349
        if (allowMove) {
            if (tooltip && tooltipPoints) {
                tooltip.refresh(tooltipPoints);
                if (tooltip.shared && hoverPoints) { // #8284
                    each(hoverPoints, function (point) {
                        point.setState(point.state, true);
                        if (point.series.isCartesian) {
                            if (point.series.xAxis.crosshair) {
                                point.series.xAxis.drawCrosshair(null, point);
                            }
                            if (point.series.yAxis.crosshair) {
                                point.series.yAxis.drawCrosshair(null, point);
                            }
                        }
                    });
                } else if (hoverPoint) { // #2500
                    hoverPoint.setState(hoverPoint.state, true);
                    each(chart.axes, function (axis) {
                        if (axis.crosshair) {
                            axis.drawCrosshair(null, hoverPoint);
                        }
                    });
                }
            }

        // Full reset
        } else {

            if (hoverPoint) {
                hoverPoint.onMouseOut();
            }

            if (hoverPoints) {
                each(hoverPoints, function (point) {
                    point.setState();
                });
            }

            if (hoverSeries) {
                hoverSeries.onMouseOut();
            }

            if (tooltip) {
                tooltip.hide(delay);
            }

            if (pointer.unDocMouseMove) {
                pointer.unDocMouseMove = pointer.unDocMouseMove();
            }

            // Remove crosshairs
            each(chart.axes, function (axis) {
                axis.hideCrosshair();
            });

            pointer.hoverX = chart.hoverPoints = chart.hoverPoint = null;
        }
    },

    /**
     * Scale series groups to a certain scale and translation.
     *
     * @private
     * @function Highcharts.Pointer#scaleGroups
     *
     * @param {Highcharts.SeriesPlotBoxObject} attribs
     *
     * @param {boolean} clip
     */
    scaleGroups: function (attribs, clip) {

        var chart = this.chart,
            seriesAttribs;

        // Scale each series
        each(chart.series, function (series) {
            seriesAttribs = attribs || series.getPlotBox(); // #1701
            if (series.xAxis && series.xAxis.zoomEnabled && series.group) {
                series.group.attr(seriesAttribs);
                if (series.markerGroup) {
                    series.markerGroup.attr(seriesAttribs);
                    series.markerGroup.clip(clip ? chart.clipRect : null);
                }
                if (series.dataLabelsGroup) {
                    series.dataLabelsGroup.attr(seriesAttribs);
                }
            }
        });

        // Clip
        chart.clipRect.attr(clip || chart.clipBox);
    },

    /**
     * Start a drag operation.
     *
     * @private
     * @function Highcharts.Pointer#dragStart
     *
     * @param {Highcharts.PointerEventObject} e
     */
    dragStart: function (e) {
        var chart = this.chart;

        // Record the start position
        chart.mouseIsDown = e.type;
        chart.cancelClick = false;
        chart.mouseDownX = this.mouseDownX = e.chartX;
        chart.mouseDownY = this.mouseDownY = e.chartY;
    },

    /**
     * Perform a drag operation in response to a mousemove event while the mouse
     * is down.
     *
     * @private
     * @function Highcharts.Pointer#drag
     *
     * @param {Highcharts.PointerEventObject} e
     */
    drag: function (e) {

        var chart = this.chart,
            chartOptions = chart.options.chart,
            chartX = e.chartX,
            chartY = e.chartY,
            zoomHor = this.zoomHor,
            zoomVert = this.zoomVert,
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            clickedInside,
            size,
            selectionMarker = this.selectionMarker,
            mouseDownX = this.mouseDownX,
            mouseDownY = this.mouseDownY,
            panKey = chartOptions.panKey && e[chartOptions.panKey + 'Key'];

        // If the device supports both touch and mouse (like IE11), and we are
        // touch-dragging inside the plot area, don't handle the mouse event.
        // #4339.
        if (selectionMarker && selectionMarker.touch) {
            return;
        }

        // If the mouse is outside the plot area, adjust to cooordinates
        // inside to prevent the selection marker from going outside
        if (chartX < plotLeft) {
            chartX = plotLeft;
        } else if (chartX > plotLeft + plotWidth) {
            chartX = plotLeft + plotWidth;
        }

        if (chartY < plotTop) {
            chartY = plotTop;
        } else if (chartY > plotTop + plotHeight) {
            chartY = plotTop + plotHeight;
        }

        // determine if the mouse has moved more than 10px
        this.hasDragged = Math.sqrt(
            Math.pow(mouseDownX - chartX, 2) +
            Math.pow(mouseDownY - chartY, 2)
        );

        if (this.hasDragged > 10) {
            clickedInside = chart.isInsidePlot(
                mouseDownX - plotLeft,
                mouseDownY - plotTop
            );

            // make a selection
            if (
                chart.hasCartesianSeries &&
                (this.zoomX || this.zoomY) &&
                clickedInside &&
                !panKey
            ) {
                if (!selectionMarker) {
                    this.selectionMarker = selectionMarker =
                        chart.renderer.rect(
                            plotLeft,
                            plotTop,
                            zoomHor ? 1 : plotWidth,
                            zoomVert ? 1 : plotHeight,
                            0
                        )
                        .attr({
                            /*= if (build.classic) { =*/
                            fill: (
                                chartOptions.selectionMarkerFill ||
                                color('${palette.highlightColor80}')
                                    .setOpacity(0.25).get()
                            ),
                            /*= } =*/
                            'class': 'highcharts-selection-marker',
                            'zIndex': 7
                        })
                        .add();
                }
            }

            // adjust the width of the selection marker
            if (selectionMarker && zoomHor) {
                size = chartX - mouseDownX;
                selectionMarker.attr({
                    width: Math.abs(size),
                    x: (size > 0 ? 0 : size) + mouseDownX
                });
            }
            // adjust the height of the selection marker
            if (selectionMarker && zoomVert) {
                size = chartY - mouseDownY;
                selectionMarker.attr({
                    height: Math.abs(size),
                    y: (size > 0 ? 0 : size) + mouseDownY
                });
            }

            // panning
            if (clickedInside && !selectionMarker && chartOptions.panning) {
                chart.pan(e, chartOptions.panning);
            }
        }
    },

    /**
     * On mouse up or touch end across the entire document, drop the selection.
     *
     * @private
     * @function Highcharts.Pointer#drop
     *
     * @param {global.Event} e
     */
    drop: function (e) {
        var pointer = this,
            chart = this.chart,
            hasPinched = this.hasPinched;

        if (this.selectionMarker) {
            var selectionData = {
                    originalEvent: e, // #4890
                    xAxis: [],
                    yAxis: []
                },
                selectionBox = this.selectionMarker,
                selectionLeft = selectionBox.attr ?
                    selectionBox.attr('x') :
                    selectionBox.x,
                selectionTop = selectionBox.attr ?
                    selectionBox.attr('y') :
                    selectionBox.y,
                selectionWidth = selectionBox.attr ?
                    selectionBox.attr('width') :
                    selectionBox.width,
                selectionHeight = selectionBox.attr ?
                    selectionBox.attr('height') :
                    selectionBox.height,
                runZoom;

            // a selection has been made
            if (this.hasDragged || hasPinched) {

                // record each axis' min and max
                each(chart.axes, function (axis) {
                    if (
                        axis.zoomEnabled &&
                        defined(axis.min) &&
                        (
                            hasPinched ||
                            pointer[{
                                xAxis: 'zoomX',
                                yAxis: 'zoomY'
                            }[axis.coll]]
                        )
                    ) { // #859, #3569
                        var horiz = axis.horiz,
                            minPixelPadding = e.type === 'touchend' ?
                                axis.minPixelPadding :
                                0, // #1207, #3075
                            selectionMin = axis.toValue(
                                (horiz ? selectionLeft : selectionTop) +
                                minPixelPadding
                            ),
                            selectionMax = axis.toValue(
                                (
                                    horiz ?
                                        selectionLeft + selectionWidth :
                                        selectionTop + selectionHeight
                                ) - minPixelPadding
                                );

                        selectionData[axis.coll].push({
                            axis: axis,
                            // Min/max for reversed axes
                            min: Math.min(selectionMin, selectionMax),
                            max: Math.max(selectionMin, selectionMax)
                        });
                        runZoom = true;
                    }
                });
                if (runZoom) {
                    fireEvent(
                        chart,
                        'selection',
                        selectionData,
                        function (args) {
                            chart.zoom(
                                extend(
                                    args,
                                    hasPinched ? { animation: false } : null
                                )
                            );
                        }
                    );
                }

            }

            if (isNumber(chart.index)) {
                this.selectionMarker = this.selectionMarker.destroy();
            }

            // Reset scaling preview
            if (hasPinched) {
                this.scaleGroups();
            }
        }

        // Reset all. Check isNumber because it may be destroyed on mouse up
        // (#877)
        if (chart && isNumber(chart.index)) {
            css(chart.container, { cursor: chart._cursor });
            chart.cancelClick = this.hasDragged > 10; // #370
            chart.mouseIsDown = this.hasDragged = this.hasPinched = false;
            this.pinchDown = [];
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onContainerMouseDown
     *
     * @param {global.Event} e
     */
    onContainerMouseDown: function (e) {
        // Normalize before the 'if' for the legacy IE (#7850)
        e = this.normalize(e);

        if (e.button !== 2) {

            this.zoomOption(e);

            // issue #295, dragging not always working in Firefox
            if (e.preventDefault) {
                e.preventDefault();
            }

            this.dragStart(e);
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onDocumentMouseUp
     *
     * @param {global.Event} e
     */
    onDocumentMouseUp: function (e) {
        if (charts[H.hoverChartIndex]) {
            charts[H.hoverChartIndex].pointer.drop(e);
        }
    },

    /**
     * Special handler for mouse move that will hide the tooltip when the mouse
     * leaves the plotarea. Issue #149 workaround. The mouseleave event does not
     * always fire.
     *
     * @private
     * @function Highcharts.Pointer#onDocumentMouseMove
     *
     * @param {Highcharts.PointerEventObject} e
     */
    onDocumentMouseMove: function (e) {
        var chart = this.chart,
            chartPosition = this.chartPosition;

        e = this.normalize(e, chartPosition);

        // If we're outside, hide the tooltip
        if (
            chartPosition &&
            !this.inClass(e.target, 'highcharts-tracker') &&
            !chart.isInsidePlot(
                e.chartX - chart.plotLeft,
                e.chartY - chart.plotTop
            )
        ) {
            this.reset();
        }
    },

    /**
     * When mouse leaves the container, hide the tooltip.
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseLeave
     *
     * @param {global.Event} e
     */
    onContainerMouseLeave: function (e) {
        var chart = charts[H.hoverChartIndex];
        // #4886, MS Touch end fires mouseleave but with no related target
        if (chart && (e.relatedTarget || e.toElement)) {
            chart.pointer.reset();
            // Also reset the chart position, used in #149 fix
            chart.pointer.chartPosition = null;
        }
    },

    /**
     * The mousemove, touchmove and touchstart event handler
     *
     * @private
     * @function Highcharts.Pointer#onContainerMouseMove
     *
     * @param {Highcharts.PointerEventObject} e
     */
    onContainerMouseMove: function (e) {

        var chart = this.chart;

        if (
            !defined(H.hoverChartIndex) ||
            !charts[H.hoverChartIndex] ||
            !charts[H.hoverChartIndex].mouseIsDown
        ) {
            H.hoverChartIndex = chart.index;
        }

        e = this.normalize(e);
        e.returnValue = false; // #2251, #3224

        if (chart.mouseIsDown === 'mousedown') {
            this.drag(e);
        }

        // Show the tooltip and run mouse over events (#977)
        if (
            (
                this.inClass(e.target, 'highcharts-tracker') ||
                chart.isInsidePlot(
                    e.chartX - chart.plotLeft,
                    e.chartY - chart.plotTop
                )
            ) &&
            !chart.openMenu
        ) {
            this.runPointActions(e);
        }
    },

    /**
     * Utility to detect whether an element has, or has a parent with, a
     * specificclass name. Used on detection of tracker objects and on deciding
     * whether hovering the tooltip should cause the active series to mouse out.
     *
     * @function Highcharts.Pointer#inClass
     *
     * @param {Highcharts.SVGDOMElement|Highcharts.HTMLDOMElement} element
     *        The element to investigate.
     *
     * @param {string} className
     *        The class name to look for.
     *
     * @return {boolean}
     *         True if either the element or one of its parents has the given
     *         class name.
     */
    inClass: function (element, className) {
        var elemClassName;
        while (element) {
            elemClassName = attr(element, 'class');
            if (elemClassName) {
                if (elemClassName.indexOf(className) !== -1) {
                    return true;
                }
                if (elemClassName.indexOf('highcharts-container') !== -1) {
                    return false;
                }
            }
            element = element.parentNode;
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onTrackerMouseOut
     *
     * @param {global.Event} e
     */
    onTrackerMouseOut: function (e) {
        var series = this.chart.hoverSeries,
            relatedTarget = e.relatedTarget || e.toElement;

        this.isDirectTouch = false;

        if (
            series &&
            relatedTarget &&
            !series.stickyTracking &&
            !this.inClass(relatedTarget, 'highcharts-tooltip') &&
            (
                !this.inClass(
                    relatedTarget,
                    'highcharts-series-' + series.index
                ) || // #2499, #4465
                !this.inClass(relatedTarget, 'highcharts-tracker') // #5553
            )
        ) {
            series.onMouseOut();
        }
    },

    /**
     * @private
     * @function Highcharts.Pointer#onContainerClick
     *
     * @param {Highcharts.PointerEventObject} e
     */
    onContainerClick: function (e) {
        var chart = this.chart,
            hoverPoint = chart.hoverPoint,
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop;

        e = this.normalize(e);

        if (!chart.cancelClick) {

            // On tracker click, fire the series and point events. #783, #1583
            if (hoverPoint && this.inClass(e.target, 'highcharts-tracker')) {

                // the series click event
                fireEvent(hoverPoint.series, 'click', extend(e, {
                    point: hoverPoint
                }));

                // the point click event
                if (chart.hoverPoint) { // it may be destroyed (#1844)
                    hoverPoint.firePointEvent('click', e);
                }

            // When clicking outside a tracker, fire a chart event
            } else {
                extend(e, this.getCoordinates(e));

                // fire a click event in the chart
                if (
                    chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)
                ) {
                    fireEvent(chart, 'click', e);
                }
            }


        }
    },

    /**
     * Set the JS DOM events on the container and document. This method should
     * contain a one-to-one assignment between methods and their handlers. Any
     * advanced logic should be moved to the handler reflecting the event's
     * name.
     *
     * @private
     * @function Highcharts.Pointer#setDOMEvents
     */
    setDOMEvents: function () {

        var pointer = this,
            container = pointer.chart.container,
            ownerDoc = container.ownerDocument;

        container.onmousedown = function (e) {
            pointer.onContainerMouseDown(e);
        };
        container.onmousemove = function (e) {
            pointer.onContainerMouseMove(e);
        };
        container.onclick = function (e) {
            pointer.onContainerClick(e);
        };
        this.unbindContainerMouseLeave = addEvent(
            container,
            'mouseleave',
            pointer.onContainerMouseLeave
        );
        if (!H.unbindDocumentMouseUp) {
            H.unbindDocumentMouseUp = addEvent(
                ownerDoc,
                'mouseup',
                pointer.onDocumentMouseUp
            );
        }
        if (H.hasTouch) {
            container.ontouchstart = function (e) {
                pointer.onContainerTouchStart(e);
            };
            container.ontouchmove = function (e) {
                pointer.onContainerTouchMove(e);
            };
            if (!H.unbindDocumentTouchEnd) {
                H.unbindDocumentTouchEnd = addEvent(
                    ownerDoc,
                    'touchend',
                    pointer.onDocumentTouchEnd
                );
            }
        }

    },

    /**
     * Destroys the Pointer object and disconnects DOM events.
     *
     * @function Highcharts.Pointer#destroy
     */
    destroy: function () {
        var pointer = this;

        if (pointer.unDocMouseMove) {
            pointer.unDocMouseMove();
        }

        this.unbindContainerMouseLeave();

        if (!H.chartCount) {
            if (H.unbindDocumentMouseUp) {
                H.unbindDocumentMouseUp = H.unbindDocumentMouseUp();
            }
            if (H.unbindDocumentTouchEnd) {
                H.unbindDocumentTouchEnd = H.unbindDocumentTouchEnd();
            }
        }

        // memory and CPU leak
        clearInterval(pointer.tooltipTimeout);

        H.objectEach(pointer, function (val, prop) {
            pointer[prop] = null;
        });
    }
};
