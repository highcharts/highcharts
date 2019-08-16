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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DumbbellStateOptionsObject extends SeriesStatesOptions {
            hover: DumbbellStatesHoverOptions;
        }
        interface DumbbellStatesHoverOptions extends SeriesStatesHoverOptions {
            connectorWidthPlus: number;
        }
        interface DumbbellPointOptions extends AreaRangePointOptions {
            connectorColor?: ColorType;
            connectorWidth?: number;
            dashStyle?: string;
            startColor?: ColorType;
        }
        interface DumbbellSeriesOptions extends AreaRangeSeriesOptions {
            states: DumbbellStateOptionsObject;
            connectorColor?: ColorString;
            connectorWidth: number;
            groupPadding: number;
            pointPadding: number;
            startColor?: ColorType;
        }
        interface SeriesTypesDictionary {
            dumbbell: typeof AreaRangeSeries;
        }
        class DumbbellPoint extends AreaRangePoint {
            public series: DumbbellSeries;
            public options: DumbbellPointOptions;
            public connector: SVGElement;
            public pointWidth: number;
        }
        class DumbbellSeries extends AreaRangeSeries {
            public data: Array<DumbbellPoint>;
            public options: DumbbellSeriesOptions;
            public points: Array<DumbbellPoint>;
            public trackerGroups: Array<string>;
            public crispCol: ColumnSeries['crispCol'];
            public translatePoint: AreaRangeSeries['translate'];
            public setShapeArgs: ColumnRangeSeries['translate'];
            public seriesDrawPoints: AreaRangeSeries['drawPoints'];
            public drawTracker: TrackerMixin['drawTrackerPoint'];
            public drawGraph: any;
            public toYData: any;
            public alignDataLabel: any;
            public crispConnector(points: SVGPathArray): SVGPathArray;
            public getConnectorAttribs(point: DumbbellPoint): SVGAttributes;
            public drawConnector(point: DumbbellPoint): void;
            public getColumnMetrics(): ColumnMetricsObject;
            public translate(): void;
            public drawPoints(): void;
            public markerAttribs(): SVGAttributes;
            public pointAttribs(
                point: DumbbellPoint,
                state: string
            ): SVGAttributes;
        }
    }
}

var pick = H.pick,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    seriesProto = H.Series.prototype,
    areaRangeProto = seriesTypes.arearange.prototype,
    columnRangeProto = seriesTypes.columnrange.prototype,
    colProto = seriesTypes.column.prototype;
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
seriesType<Highcharts.DumbbellSeriesOptions>('dumbbell', 'arearange', {
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
    crispConnector: function (
        this: Highcharts.SVGRenderer,
        points: Highcharts.SVGPathArray
    ): Highcharts.SVGPathArray {
        if (points[1] === points[4]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            points[1] = points[4] = Math.floor(points[1] as any) - 0.5;
        }
        if (points[2] === points[5]) {
            points[2] = points[5] = Math.floor(points[2] as any) + 0.5;
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
    getConnectorAttribs: function (
        this: Highcharts.DumbbellSeries,
        point: Highcharts.DumbbellPoint
    ): Highcharts.SVGAttributes {
        var series = this,
            chart = series.chart,
            pointOptions = point.options,
            seriesOptions = series.options,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            connectorWidth = pick(
                pointOptions.connectorWidth,
                seriesOptions.connectorWidth
            ),
            connectorColor = pick(
                pointOptions.connectorColor,
                seriesOptions.connectorColor,
                point.zone ? point.zone.color : undefined,
                point.color
            ),
            connectorWidthPlus = seriesOptions.states.hover.connectorWidthPlus,
            dashStyle = pick(pointOptions.dashStyle, seriesOptions.dashStyle),
            pointTop = pick(point.plotLow, point.plotY),
            pxThreshold = yAxis.toPixels(seriesOptions.threshold || 0, true),
            pointHeight = chart.inverted ?
                yAxis.len - pxThreshold : pxThreshold,
            pointBottom = pick(point.plotHigh, pointHeight),
            attribs: Highcharts.SVGAttributes;

        if (point.state) {
            connectorWidth = connectorWidth + connectorWidthPlus;
        }

        if ((pointTop as any) < 0) {
            pointTop = 0;
        } else if ((pointTop as any) >= yAxis.len) {
            pointTop = yAxis.len;
        }

        if (pointBottom < 0) {
            pointBottom = 0;
        } else if (pointBottom >= yAxis.len) {
            pointBottom = yAxis.len;
        }

        if (point.plotX < 0 || point.plotX > xAxis.len) {
            connectorWidth = 0;
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
    drawConnector: function (
        this: Highcharts.DumbbellSeries,
        point: Highcharts.DumbbellPoint
    ): void {
        var series = this,
            animationLimit = pick(series.options.animationLimit, 250),
            verb = series.chart.pointCount < animationLimit ?
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
    getColumnMetrics: function (
        this: Highcharts.DumbbellSeries
    ): Highcharts.ColumnMetricsObject {
        var metrics = colProto.getColumnMetrics.apply(this, arguments as any);

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
    translate: function (
        this: Highcharts.DumbbellSeries
    ): void {
        // calculate shapeargs
        this.setShapeArgs.apply(this);

        // calculate point low / high values
        this.translatePoint.apply(this, arguments as any);

        // correct x position
        this.points.forEach(function (point): void {
            var shapeArgs = point.shapeArgs,
                pointWidth = point.pointWidth;

            point.plotX = (shapeArgs as any).x;
            (shapeArgs as any).x = point.plotX - pointWidth / 2;
            (point.tooltipPos as any) = null;
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
    drawPoints: function (
        this: Highcharts.DumbbellSeries
    ): void {
        var series = this,
            chart = series.chart,
            pointLength = series.points.length,
            seriesStartColor = series.options.startColor,
            i = 0,
            color,
            point,
            zoneColor;

        this.seriesDrawPoints.apply(series, arguments as any);

        // draw connectors and color upper markers
        while (i < pointLength) {
            point = series.points[i];

            series.drawConnector(point);

            if (point.upperGraphic) {
                (point.upperGraphic.element as any).point = point;
            }
            (point.connector.element as any).point = point;

            if (point.lowerGraphic) {
                zoneColor = point.zone && point.zone.color;
                color = pick(
                    point.options.startColor,
                    seriesStartColor,
                    point.options.color,
                    zoneColor,
                    point.color,
                    series.color
                );
                if (!chart.styledMode) {
                    point.lowerGraphic.attr({
                        fill: color
                    });
                }
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
    markerAttribs: function (
        this: Highcharts.DumbbellSeries
    ): Highcharts.SVGAttributes {
        var ret = areaRangeProto.markerAttribs.apply(this, arguments as any);

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
    pointAttribs: function (
        this: Highcharts.DumbbellSeries,
        point: Highcharts.DumbbellPoint,
        state: string
    ): Highcharts.SVGAttributes {
        var pointAttribs;

        pointAttribs = seriesProto.pointAttribs.apply(this, arguments as any);
        if (state === 'hover') {
            delete pointAttribs.fill;
        }

        return pointAttribs;
    }
}, {
    pointSetState: areaRangeProto.pointClass.prototype.setState,
    /**
     * Set the point's state extended by have influence on the connector
     * (between low and high value).
     *
     * @private
     * @param {Highcharts.Point} this The point to inspect.
     *
     * @return {void}
     */
    setState: function (
        this: Highcharts.DumbbellPoint
    ): void {
        var point = this,
            series = point.series,
            chart = series.chart,
            seriesStartColor = series.options.startColor,
            pointOptions = point.options,
            pointStartColor = pointOptions.startColor,
            zoneColor = point.zone && point.zone.color,
            color = pick(
                pointStartColor,
                seriesStartColor,
                pointOptions.color,
                zoneColor,
                point.color,
                series.color
            ),
            verb = 'attr';

        this.pointSetState.apply(this, arguments);

        if (!this.state) {
            verb = 'animate';
            if (point.lowerGraphic && point.upperGraphic) {
                if (!chart.styledMode) {
                    point.lowerGraphic.attr({
                        fill: color
                    });
                }
            }
        }

        point.connector[verb](series.getConnectorAttribs(point));
    }
});
