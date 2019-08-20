/* *
 *
 *  (c) 2010-2019 Sebastian Bochan, Rafal Sebestjanski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
var pick = H.pick, seriesType = H.seriesType, seriesTypes = H.seriesTypes, seriesProto = H.Series.prototype, areaRangeProto = seriesTypes.arearange.prototype, columnRangeProto = seriesTypes.columnrange.prototype, colProto = seriesTypes.column.prototype, areaRangePointProto = areaRangeProto.pointClass.prototype;
/**
 * The dumbbell series is a carteseian series with higher and lower values for
 * each point along an X axis, connected with a line between the values.
 * Requires `highcharts-more.js` and `modules/dumbbell.js`.
 *
 * @sample {highcharts} highcharts/demo/dumbbell/
 *         Dumbbell chart
 * @sample {highstock} stock/demo/dumbbell/
 *         Dumbbell chart
 * @sample {highcharts} highcharts/css/dumbbell/
 *         Styled mode
 *
 * @extends      plotOptions.arearange
 * @product      highcharts highstock
 * @excluding    fillColor, fillOpacity, lineWidth, stack, stacking,
 *               stickyTracking, trackByArea
 * @since        7.1.3
 * @optionparent plotOptions.dumbbell
 */
seriesType('dumbbell', 'arearange', {
    /** @ignore-option */
    trackByArea: false,
    /** @ignore-option */
    fillColor: 'none',
    /** @ignore-option */
    lineWidth: 0,
    pointRange: 1,
    /**
     * Pixel width of the line that connects dumbbell point's values.
     *
     * @type      {number}
     * @since     7.1.3
     * @product   highcharts highstock
     * @apioption plotOptions.dumbbell.connectorWidth
     * @default   1
     */
    connectorWidth: 1,
    /** @ignore-option */
    stickyTracking: false,
    groupPadding: 0.2,
    pointPadding: 0.1,
    /**
     * Color of the start markers in dumbbell graph.
     *
     * @type      {string}
     * @since     7.1.3
     * @product   highcharts highstock
     * @apioption plotOptions.dumbbell.startColor
     * @default   #90ed7d
     */
    startColor: '#90ed7d',
    /**
     * Color of the line that connects dumbbell point's values.
     * By default it is a series' color.
     *
     * @type      {string}
     * @product   highcharts highstock
     * @since     7.1.3
     * @apioption plotOptions.dumbbell.connectorColor
     */
    states: {
        hover: {
            /** @ignore-option */
            lineWidthPlus: 0,
            /**
             * The additional connector line width for a hovered point.
             *
             * @type  {number}
             * @since 7.1.3
             * @product   highcharts highstock
             * @apioption plotOptions.dumbbell.states.hover.connectorWidthPlus
             */
            connectorWidthPlus: 1,
            /** @ignore-option */
            halo: false
        }
    }
}, {
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    drawTracker: H.TrackerMixin.drawTrackerPoint,
    drawGraph: H.noop,
    toYData: areaRangeProto.toYData,
    /**
     * Correct line position by Math.floor instead of round.
     * As a result the line is aligned in the same way as marker
     *
     * @private
     *
     * @function Highcharts.seriesTypes.dumbbell#crispConnector
     *
     * @param {Highcharts.SVGRenderer} this
     *        Highcharts Renderer.
     * @param {Highcharts.SVGPathArray} points
     *        The original points on the format `['M', 0, 0, 'L', 100, 0]`.
     *
     * @return {Highcharts.SVGPathArray}
     *         The original points array, but modified to render crisply.
     *
     *
     */
    crispConnector: function (points) {
        if (points[1] === points[4]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            points[1] = points[4] = Math.floor(points[1]) - 0.5;
        }
        if (points[2] === points[5]) {
            points[2] = points[5] = Math.floor(points[2]) + 0.5;
        }
        return points;
    },
    crispCol: colProto.crispCol,
    /**
     * Get connector line path and styles that connects dumbbell point's low and
     * high values.
     * @private
     *
     * @param {Highcharts.Series} this The series of points.
     * @param {Highcharts.Point} point The point to inspect.
     *
     * @return {Highcharts.SVGAttributes} attribs The path and styles.
     */
    getConnectorAttribs: function (point) {
        var series = this, chart = series.chart, pointOptions = point.options, seriesOptions = series.options, xAxis = series.xAxis, yAxis = series.yAxis, connectorWidth = pick(pointOptions.connectorWidth, seriesOptions.connectorWidth), connectorColor = pick(pointOptions.connectorColor, seriesOptions.connectorColor, pointOptions.color, point.zone ? point.zone.color : undefined, point.color), connectorWidthPlus = seriesOptions.states.hover.connectorWidthPlus, dashStyle = pick(pointOptions.dashStyle, seriesOptions.dashStyle), pointTop = pick(point.plotLow, point.plotY), pxThreshold = yAxis.toPixels(seriesOptions.threshold || 0, true), pointHeight = chart.inverted ?
            yAxis.len - pxThreshold : pxThreshold, pointBottom = pick(point.plotHigh, pointHeight), attribs;
        if (point.state) {
            connectorWidth = connectorWidth + connectorWidthPlus;
        }
        if (pointTop < 0) {
            pointTop = 0;
        }
        else if (pointTop >= yAxis.len) {
            pointTop = yAxis.len;
        }
        if (pointBottom < 0) {
            pointBottom = 0;
        }
        else if (pointBottom >= yAxis.len) {
            pointBottom = yAxis.len;
        }
        if (point.plotX < 0 || point.plotX > xAxis.len) {
            connectorWidth = 0;
        }
        // Connector should reflect upper marker's zone color
        if (point.upperGraphic) {
            point.origProps = {
                y: point.y,
                zone: point.zone
            };
            point.y = point.high;
            point.zone = point.zone ? point.getZone() : undefined;
            connectorColor = pick(pointOptions.connectorColor, seriesOptions.connectorColor, pointOptions.color, point.zone ? point.zone.color : undefined, point.color);
            H.extend(point, point.origProps);
            delete point.origProps;
        }
        attribs = {
            d: series.crispConnector([
                'M',
                point.plotX,
                pointTop,
                'L',
                point.plotX,
                pointBottom
            ])
        };
        if (!chart.styledMode) {
            attribs.stroke = connectorColor;
            attribs['stroke-width'] = connectorWidth;
            if (dashStyle) {
                attribs.dashstyle = dashStyle;
            }
        }
        return attribs;
    },
    /**
     * Draw connector line that connects dumbbell point's low and high values.
     * @private
     *
     * @param {Highcharts.Series} this The series of points.
     * @param {Highcharts.Point} point The point to inspect.
     *
     * @return {void}
     */
    drawConnector: function (point) {
        var series = this, animationLimit = pick(series.options.animationLimit, 250), verb = series.chart.pointCount < animationLimit ?
            'animate' : 'attr';
        if (!point.connector) {
            point.connector = series.chart.renderer.path()
                .addClass('highcharts-lollipop-stem')
                .attr({
                zIndex: -1
            })
                .add(series.markerGroup);
        }
        point.connector[verb](this.getConnectorAttribs(point));
    },
    /**
     * Return the width and x offset of the dumbbell adjusted for grouping,
     * groupPadding, pointPadding, pointWidth etc.
     *
     * @private
     *
     * @function Highcharts.seriesTypes.column#getColumnMetrics
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {Highcharts.ColumnMetricsObject} metrics shapeArgs
     *
     */
    getColumnMetrics: function () {
        var metrics = colProto.getColumnMetrics.apply(this, arguments);
        metrics.offset = metrics.offset + metrics.width / 2;
        return metrics;
    },
    translatePoint: areaRangeProto.translate,
    setShapeArgs: columnRangeProto.translate,
    /**
     * Translate each point to the plot area coordinate system and find
     * shape positions
     *
     * @private
     *
     * @function Highcharts.seriesTypes.dumbbell#translate
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {void}
     */
    translate: function () {
        // calculate shapeargs
        this.setShapeArgs.apply(this);
        // calculate point low / high values
        this.translatePoint.apply(this, arguments);
        // correct x position
        this.points.forEach(function (point) {
            var shapeArgs = point.shapeArgs, pointWidth = point.pointWidth;
            point.plotX = shapeArgs.x;
            shapeArgs.x = point.plotX - pointWidth / 2;
            point.tooltipPos = null;
        });
    },
    seriesDrawPoints: areaRangeProto.drawPoints,
    /**
     * Extend the arearange series' drawPoints method by applying a connector
     * and coloring markers.
     * @private
     *
     * @function Highcharts.Series#drawPoints
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {void}
     */
    drawPoints: function () {
        var series = this, chart = series.chart, pointLength = series.points.length, seriesStartColor = series.startColor = series.options.startColor, i = 0, lowerGraphicColor, point, zoneColor;
        this.seriesDrawPoints.apply(series, arguments);
        // draw connectors and color upper markers
        while (i < pointLength) {
            point = series.points[i];
            series.drawConnector(point);
            if (point.upperGraphic) {
                point.upperGraphic.element.point = point;
                point.upperGraphic.addClass('highcharts-lollipop-high');
            }
            point.connector.element.point = point;
            if (point.lowerGraphic) {
                zoneColor = point.zone && point.zone.color;
                lowerGraphicColor = pick(point.options.startColor, seriesStartColor, point.options.color, zoneColor, point.color, series.color);
                if (!chart.styledMode) {
                    point.lowerGraphic.attr({
                        fill: lowerGraphicColor
                    });
                }
                point.lowerGraphic.addClass('highcharts-lollipop-low');
            }
            i++;
        }
    },
    /**
     * Get non-presentational attributes for a point. Used internally for
     * both styled mode and classic. Set correct position in link with connector
     * line.
     *
     * @see Series#pointAttribs
     *
     * @function Highcharts.Series#markerAttribs
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {Highcharts.SVGAttributes}
     *         A hash containing those attributes that are not settable from
     *         CSS.
     */
    markerAttribs: function () {
        var ret = areaRangeProto.markerAttribs.apply(this, arguments);
        ret.x = Math.floor(ret.x);
        ret.y = Math.floor(ret.y);
        return ret;
    },
    /**
     * Get presentational attributes
     *
     * @private
     * @function Highcharts.seriesTypes.column#pointAttribs
     *
     * @param {Highcharts.Series} this The series of points.
     * @param {Highcharts.Point} point The point to inspect.
     * @param {string} state current state of point (normal, hover, select)
     *
     * @return {Highcharts.SVGAttributes} pointAttribs SVGAttributes
     */
    pointAttribs: function (point, state) {
        var pointAttribs;
        pointAttribs = seriesProto.pointAttribs.apply(this, arguments);
        if (state === 'hover') {
            delete pointAttribs.fill;
        }
        return pointAttribs;
    }
}, {
    // seriesTypes doesn't inherit from arearange point proto so put below
    // methods rigidly.
    destroyElements: areaRangePointProto.destroyElements,
    isValid: areaRangePointProto.isValid,
    pointSetState: areaRangePointProto.setState,
    /**
     * Set the point's state extended by have influence on the connector
     * (between low and high value).
     *
     * @private
     * @param {Highcharts.Point} this The point to inspect.
     *
     * @return {void}
     */
    setState: function () {
        var point = this, series = point.series, chart = series.chart, seriesStartColor = series.options.startColor, pointOptions = point.options, pointStartColor = pointOptions.startColor, zoneColor = point.zone && point.zone.color, lowerGraphicColor = pick(pointStartColor, seriesStartColor, pointOptions.color, zoneColor, point.color, series.color), verb = 'attr', upperGraphicColor;
        this.pointSetState.apply(this, arguments);
        if (!this.state) {
            verb = 'animate';
            if (point.lowerGraphic && !chart.styledMode) {
                point.lowerGraphic.attr({
                    fill: lowerGraphicColor
                });
                if (point.upperGraphic) {
                    point.origProps = {
                        y: point.y,
                        zone: point.zone
                    };
                    point.y = point.high;
                    point.zone = point.zone ? point.getZone() : undefined;
                    upperGraphicColor = pick(point.marker ? point.marker.fillColor : undefined, pointOptions.color, point.zone ? point.zone.color : undefined, point.color);
                    point.upperGraphic.attr({
                        fill: upperGraphicColor
                    });
                    H.extend(point, point.origProps);
                    delete point.origProps;
                }
            }
        }
        point.connector[verb](series.getConnectorAttribs(point));
    }
});
