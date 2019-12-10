/* *
 *
 *  (c) 2010-2019 Torstein Honsi
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
        type AxisGridLineInterpolationValue = ('circle'|'polygon');
        type RadialAxisOptions = (RadialAxisXOptions|RadialAxisYOptions);
        type RadialAxisXOptions = XAxisOptions;
        type RadialAxisYOptions = YAxisOptions;
        interface Axis {
            angleRad?: RadialAxis['angleRad'];
            sector?: number;
        }
        interface XAxisOptions {
            angle?: number;
            gridLineInterpolation?: AxisGridLineInterpolationValue;
        }
        interface AxisPlotBandsOptions {
            innerRadius?: (number|string);
            outerRadius?: (number|string);
            shape?: PaneBackgroundShapeValue;
            thickness?: (number|string);
        }
        interface AxisPlotLinesOptions {
            chartX?: number;
            chartY?: number;
            isCrosshair?: boolean;
            point?: Point;
            reverse?: boolean;
        }
        interface Chart {
            inverted?: boolean;
        }
        interface HiddenAxisMixin {
            getOffset: Function;
            setCategories: Function;
            setScale: Function;
            setTitle: Function;
            createLabelCollector: RadialAxisMixin['createLabelCollector'];
            redraw(): void;
            render(): void;
        }
        interface RadialAxis extends Axis {
            angleRad: number;
            autoConnect?: boolean;
            beforeSetTickPositions: RadialAxisMixin['beforeSetTickPositions'];
            center: Array<number>;
            createLabelCollector: RadialAxisMixin['createLabelCollector'];
            defaultRadialGaugeOptions: (
                RadialAxisMixin['defaultRadialGaugeOptions']
            );
            defaultPolarOptions: (
                RadialAxisMixin['defaultRadialGaugeOptions'] |
                RadialAxisMixin['defaultCircularOptions'] |
                RadialAxisMixin['defaultRadialOptions']
            );
            defaultCircularOptions: RadialAxisMixin['defaultCircularOptions'];
            defaultRadialOptions: RadialAxisMixin['defaultRadialOptions'];
            endAngleRad: number;
            getCrosshairPosition: RadialAxisMixin['getCrosshairPosition'];
            getLinePath: RadialAxisMixin['getLinePath'];
            getOffset: RadialAxisMixin['getOffset'];
            getPlotBandPath: RadialAxisMixin['getPlotBandPath'];
            getPlotLinePath: RadialAxisMixin['getPlotLinePath'];
            getPosition: RadialAxisMixin['getPosition'];
            getTitlePosition: RadialAxisMixin['getTitlePosition'];
            isCircular?: boolean;
            labelCollector?: ChartLabelCollectorFunction | boolean;
            max: number;
            min: number;
            minPointOffset: number;
            offset: number;
            options: XAxisOptions & YAxisOptions;
            pane: Pane;
            postTranslate: RadialAxisMixin['postTranslate'];
            setAxisSize: RadialAxisMixin['setAxisSize'];
            setAxisTranslation: RadialAxisMixin['setAxisTranslation'];
            setOptions: RadialAxisMixin['setOptions'];
            startAngleRad: number;
        }
        interface RadialAxisMixin {
            createLabelCollector(
                this: RadialAxis
            ): ChartLabelCollectorFunction | boolean;
            defaultRadialGaugeOptions: RadialAxisOptions;
            defaultCircularOptions: RadialAxisXOptions;
            defaultRadialOptions: RadialAxisYOptions;
            beforeSetTickPositions(this: RadialAxis): void;
            getCrosshairPosition(
                this: RadialAxis,
                options: AxisPlotLinesOptions,
                x1: number,
                y1: number
            ): [(number | undefined), number, number];
            getLinePath(
                this: RadialAxis,
                lineWidth: number,
                radius?: number
            ): SVGPathArray;
            getOffset(this: RadialAxis): void;
            getPlotBandPath(
                this: RadialAxis,
                from: number,
                to: number,
                options: AxisPlotBandsOptions
            ): RadialAxisPath;
            getPlotLinePath(
                this: RadialAxis,
                options: AxisPlotLinesOptions
            ): SVGPathArray;
            getPosition(
                this: RadialAxis,
                value: number,
                length?: number
            ): PositionObject;
            getTitlePosition(this: RadialAxis): PositionObject;
            postTranslate(
                this: RadialAxis,
                angle: number,
                radius: number
            ): PositionObject;
            setAxisSize(this: Highcharts.RadialAxis): void;
            setAxisTranslation(this: RadialAxis): void;
            setOptions(this: RadialAxis, userOptions: RadialAxisOptions): void;
        }
        interface RadialAxisPath extends SVGPathArray {
            xBounds?: Array<number>;
            yBounds?: Array<number>;
        }
        interface RadialTick extends Tick {
            axis: RadialAxis;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    correctFloat,
    defined,
    extend,
    pick,
    pInt,
    relativeLength,
    wrap
} = U;

import '../parts/Axis.js';
import '../parts/Tick.js';
import './Pane.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    merge = H.merge,
    noop = H.noop,
    Tick = H.Tick,

    // @todo Extract this to a new file:
    hiddenAxisMixin: Highcharts.HiddenAxisMixin,
    // @todo Extract this to a new file
    radialAxisMixin: Highcharts.RadialAxisMixin,
    axisProto = Axis.prototype,
    tickProto = Tick.prototype;

// Augmented methods for the x axis in order to hide it completely, used for
// the X axis in gauges
hiddenAxisMixin = {
    getOffset: noop,
    redraw: function (this: Highcharts.Axis): void {
        this.isDirty = false; // prevent setting Y axis dirty
    },
    render: function (this: Highcharts.Axis): void {
        this.isDirty = false; // prevent setting Y axis dirty
    },
    createLabelCollector: function (): boolean {
        return false;
    },
    setScale: noop,
    setCategories: noop,
    setTitle: noop
};

// Augmented methods for the value axis
radialAxisMixin = {

    // The default options extend defaultYAxisOptions
    defaultRadialGaugeOptions: {
        labels: {
            align: 'center',
            x: 0,
            y: null as any // auto
        },
        minorGridLineWidth: 0,
        minorTickInterval: 'auto',
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickWidth: 1,
        tickLength: 10,
        tickPosition: 'inside',
        tickWidth: 2,
        title: {
            rotation: 0
        },
        zIndex: 2 // behind dials, points in the series group
    },

    // Circular axis around the perimeter of a polar chart
    defaultCircularOptions: {
        gridLineWidth: 1, // spokes
        labels: {
            align: null as any, // auto
            distance: 15,
            x: 0,
            y: null as any, // auto
            style: {
                textOverflow: 'none' // wrap lines by default (#7248)
            }
        },
        maxPadding: 0,
        minPadding: 0,
        showLastLabel: false,
        tickLength: 0
    },

    // Radial axis, like a spoke in a polar chart
    defaultRadialOptions: {

        /**
         * In a polar chart, this is the angle of the Y axis in degrees, where
         * 0 is up and 90 is right. The angle determines the position of the
         * axis line and the labels, though the coordinate system is unaffected.
         * Since v8.0.0 this option is also applicable for X axis (inverted
         * polar).
         *
         * @sample {highcharts} highcharts/xaxis/angle/
         *         Custom X axis' angle on inverted polar chart
         * @sample {highcharts} highcharts/yaxis/angle/
         *         Dual axis polar chart
         *
         * @type      {number}
         * @default   0
         * @since     4.2.7
         * @product   highcharts
         * @apioption xAxis.angle
         */

        /**
         * Polar charts only. Whether the grid lines should draw as a polygon
         * with straight lines between categories, or as circles. Can be either
         * `circle` or `polygon`. Since v8.0.0 this option is also applicable
         * for X axis (inverted polar).
         *
         * @sample {highcharts} highcharts/demo/polar-spider/
         *         Polygon grid lines
         * @sample {highcharts} highcharts/xaxis/gridlineinterpolation/
         *         Circle and polygon on inverted polar
         * @sample {highcharts} highcharts/yaxis/gridlineinterpolation/
         *         Circle and polygon
         *
         * @type       {string}
         * @product    highcharts
         * @validvalue ["circle", "polygon"]
         * @apioption  xAxis.gridLineInterpolation
         */
        gridLineInterpolation: 'circle',
        gridLineWidth: 1,
        labels: {
            align: 'right',
            x: -3,
            y: -2
        },
        showLastLabel: false,
        title: {
            x: 4,
            text: null,
            rotation: 90
        }
    },

    /* eslint-disable valid-jsdoc */

    /**
     * Merge and set options.
     * @private
     */
    setOptions: function (
        this: Highcharts.RadialAxis,
        userOptions: Highcharts.RadialAxisOptions
    ): void {

        var options = this.options = merge(
            this.defaultOptions,
            this.defaultPolarOptions,
            userOptions
        );

        // Make sure the plotBands array is instanciated for each Axis
        // (#2649)
        if (!options.plotBands) {
            options.plotBands = [];
        }

        H.fireEvent(this, 'afterSetOptions');

    },

    /**
     * Wrap the getOffset method to return zero offset for title or labels in a
     * radial axis.
     * @private
     */
    getOffset: function (this: Highcharts.RadialAxis): void {
        // Call the Axis prototype method (the method we're in now is on the
        // instance)
        axisProto.getOffset.call(this);

        // Title or label offsets are not counted
        this.chart.axisOffset[this.side] = 0;

    },


    /**
     * Get the path for the axis line. This method is also referenced in the
     * getPlotLinePath method.
     * @private
     */
    getLinePath: function (
        this: Highcharts.RadialAxis,
        lineWidth: number,
        radius?: number
    ): Highcharts.RadialAxisPath {
        var center = this.center,
            end,
            chart = this.chart,
            r = pick(radius, center[2] / 2 - this.offset),
            path: Highcharts.RadialAxisPath;

        if (this.isCircular || typeof radius !== 'undefined') {
            path = this.chart.renderer.symbols.arc(
                this.left + center[0],
                this.top + center[1],
                r,
                r,
                {
                    start: this.startAngleRad,
                    end: this.endAngleRad,
                    open: true,
                    innerR: 0
                }
            );

            // Bounds used to position the plotLine label next to the line
            // (#7117)
            path.xBounds = [this.left + center[0]];
            path.yBounds = [this.top + center[1] - r];

        } else {
            end = this.postTranslate(this.angleRad, r);
            path = [
                'M',
                center[0] + chart.plotLeft,
                center[1] + chart.plotTop,
                'L',
                end.x,
                end.y
            ];
        }
        return path;
    },

    /**
     * Override setAxisTranslation by setting the translation to the
     * difference in rotation. This allows the translate method to return
     * angle for any given value.
     * @private
     */
    setAxisTranslation: function (this: Highcharts.RadialAxis): void {

        // Call uber method
        axisProto.setAxisTranslation.call(this);

        // Set transA and minPixelPadding
        if (this.center) { // it's not defined the first time
            if (this.isCircular) {

                this.transA = (this.endAngleRad - this.startAngleRad) /
                    ((this.max - this.min) || 1);


            } else {
                this.transA = (
                    (this.center[2] / 2) /
                    ((this.max - this.min) || 1)
                );
            }

            if (this.isXAxis) {
                this.minPixelPadding = this.transA * this.minPointOffset;
            } else {
                // This is a workaround for regression #2593, but categories
                // still don't position correctly.
                this.minPixelPadding = 0;
            }
        }
    },

    /**
     * In case of auto connect, add one closestPointRange to the max value
     * right before tickPositions are computed, so that ticks will extend
     * passed the real max.
     * @private
     */
    beforeSetTickPositions: function (this: Highcharts.RadialAxis): void {
        // If autoConnect is true, polygonal grid lines are connected, and
        // one closestPointRange is added to the X axis to prevent the last
        // point from overlapping the first.
        this.autoConnect = (
            this.isCircular &&
            typeof pick(this.userMax, this.options.max) === 'undefined' &&
            correctFloat(this.endAngleRad - this.startAngleRad) ===
            correctFloat(2 * Math.PI)
        );

        // This will lead to add an extra tick to xAxis in order to display a
        // correct range on inverted polar
        if (!this.isCircular && this.chart.inverted) {
            this.max++;
        }

        if (this.autoConnect) {
            this.max += (
                (this.categories && 1) ||
                this.pointRange ||
                this.closestPointRange ||
                0
            ); // #1197, #2260
        }
    },

    /**
     * Override the setAxisSize method to use the arc's circumference as
     * length. This allows tickPixelInterval to apply to pixel lengths along
     * the perimeter.
     * @private
     */
    setAxisSize: function (this: Highcharts.RadialAxis): void {

        axisProto.setAxisSize.call(this);

        if (this.isRadial) {

            // Set the center array
            this.pane.updateCenter(this);

            // The sector is used in Axis.translate to compute the
            // translation of reversed axis points (#2570)
            if (this.isCircular) {
                this.sector = this.endAngleRad - this.startAngleRad;
            }

            // Axis len is used to lay out the ticks
            this.len = this.width = this.height =
                this.center[2] * pick(this.sector, 1) / 2;

        }
    },

    /**
     * Returns the x, y coordinate of a point given by a value and a pixel
     * distance from center
     * @private
     */
    getPosition: function (
        this: Highcharts.RadialAxis,
        value: number,
        length?: number
    ): Highcharts.PositionObject {
        var translatedVal = this.translate(value) as any;

        return this.postTranslate(
            this.isCircular ? translatedVal : this.angleRad, // #2848
            // In case when translatedVal is negative, the 0 value must be
            // used instead, in order to deal with lines and labels that
            // fall out of the visible range near the center of a pane
            pick(this.isCircular ?
                length :
                (translatedVal < 0 ? 0 : translatedVal), this.center[2] / 2
            ) - this.offset
        );
    },

    /**
     * Translate from intermediate plotX (angle), plotY (axis.len - radius)
     * to final chart coordinates.
     * @private
     */
    postTranslate: function (
        this: Highcharts.RadialAxis,
        angle: number,
        radius: number
    ): Highcharts.PositionObject {

        var chart = this.chart,
            center = this.center;

        angle = this.startAngleRad + angle;

        return {
            x: chart.plotLeft + center[0] + Math.cos(angle) * radius,
            y: chart.plotTop + center[1] + Math.sin(angle) * radius
        };

    },

    /**
     * Find the path for plot bands along the radial axis.
     * @private
     */
    getPlotBandPath: function (
        this: Highcharts.RadialAxis,
        from: number,
        to: number,
        options: Highcharts.AxisPlotBandsOptions
    ): Highcharts.RadialAxisPath {
        var center = this.center,
            startAngleRad = this.startAngleRad,
            fullRadius = center[2] / 2,
            radii = [
                pick(options.outerRadius, '100%'),
                options.innerRadius,
                pick(options.thickness, 10)
            ],
            offset = Math.min(this.offset, 0),
            percentRegex = /%$/,
            start,
            end,
            angle,
            xOnPerimeter,
            open,
            isCircular = this.isCircular, // X axis in a polar chart
            ret: Highcharts.RadialAxisPath;

        // Polygonal plot bands
        if (this.options.gridLineInterpolation === 'polygon') {
            ret = this.getPlotLinePath({ value: from }).concat(
                this.getPlotLinePath({ value: to, reverse: true })
            );

        // Circular grid bands
        } else {

            // Keep within bounds
            from = Math.max(from, this.min);
            to = Math.min(to, this.max);

            // Plot bands on Y axis (radial axis) - inner and outer radius
            // depend on to and from
            if (!isCircular) {
                radii[0] = this.translate(from) as any;
                radii[1] = this.translate(to) as any;
            }

            // Convert percentages to pixel values
            radii = radii.map(function (
                radius: (number|string|undefined)
            ): (number|string|undefined) {
                if (percentRegex.test(radius as any)) {
                    radius = (pInt(radius, 10) * fullRadius) / 100;
                }
                return radius;
            });

            // Handle full circle
            if (options.shape === 'circle' || !isCircular) {
                start = -Math.PI / 2;
                end = Math.PI * 1.5;
                open = true;
            } else {
                start = startAngleRad + (this.translate(from) as any);
                end = startAngleRad + (this.translate(to) as any);
            }

            (radii[0] as any) -= offset; // #5283
            (radii[2] as any) -= offset; // #5283

            ret = this.chart.renderer.symbols.arc(
                this.left + center[0],
                this.top + center[1],
                radii[0],
                radii[0],
                {
                    // Math is for reversed yAxis (#3606)
                    start: Math.min(start, end),
                    end: Math.max(start, end),
                    innerR: pick(
                        radii[1],
                        (radii[0] as any) - (radii[2] as any)
                    ),
                    open: open
                }
            );

            // Provide positioning boxes for the label (#6406)
            if (isCircular) {
                angle = (end + start) / 2;
                xOnPerimeter = (
                    this.left +
                    center[0] +
                    (center[2] / 2) * Math.cos(angle)
                );

                ret.xBounds = angle > -Math.PI / 2 && angle < Math.PI / 2 ?
                    // Right hemisphere
                    [xOnPerimeter, this.chart.plotWidth] :
                    // Left hemisphere
                    [0, xOnPerimeter];


                ret.yBounds = [
                    this.top + center[1] + (center[2] / 2) * Math.sin(angle)
                ];
                // Shift up or down to get the label clear of the perimeter
                ret.yBounds[0] += (
                    (angle > -Math.PI && angle < 0) ||
                    (angle > Math.PI)
                ) ? -10 : 10;
            }
        }

        return ret;
    },

    /* *
     * Find the correct end values of crosshair in polar.
     */
    getCrosshairPosition: function (
        this: Highcharts.RadialAxis,
        options: Highcharts.AxisPlotLinesOptions,
        x1: number,
        y1: number
    ): [(number | undefined), number, number] {
        var axis = this,
            value = options.value,
            shapeArgs,
            end,
            x2,
            y2;

        if (axis.isCircular) {
            if (!defined(value)) {
                // When the snap is set to false
                x2 = options.chartX || 0;
                y2 = options.chartY || 0;

                value = axis.translate(
                    Math.atan2(y2 - y1, x2 - x1) - axis.startAngleRad,
                    true
                );
            } else if (options.point) {
                // When the snap is set to true
                shapeArgs = options.point.shapeArgs || {};
                if (shapeArgs.start) {
                    // Find a true value of the point based on the
                    // angle
                    value = axis.translate(
                        (options.point.rectPlotY as any), true);
                }
            }
            end = axis.getPosition(value as any);
            x2 = end.x;
            y2 = end.y;
        } else {
            if (!defined(value)) {
                x2 = options.chartX;
                y2 = options.chartY;
            }

            if (defined(x2) && defined(y2)) {
                // Calculate radius of non-circular axis' crosshair
                value = axis.translate(Math.min(
                    Math.sqrt(
                        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
                    ), axis.len
                ), true);
            }
        }

        return [value, x2 || 0, y2 || 0];
    },

    /* *
     * Find the path for plot lines perpendicular to the radial axis.
     */
    getPlotLinePath: function (
        this: Highcharts.RadialAxis,
        options: Highcharts.AxisPlotLinesOptions
    ): Highcharts.SVGPathArray {
        var axis = this,
            center = axis.center,
            chart = axis.chart,
            inverted = chart.inverted,
            value = options.value,
            reverse = options.reverse,
            end = axis.getPosition(value as any),
            background = axis.pane.options.background ?
                (axis.pane.options.background[0] ||
                    axis.pane.options.background) :
                {},
            innerRadius = background.innerRadius || '0%',
            outerRadius = background.outerRadius || '100%',
            x1 = center[0] + chart.plotLeft,
            y1 = center[1] + chart.plotTop,
            x2 = end.x,
            y2 = end.y,
            a,
            b,
            otherAxis: (Highcharts.RadialAxis|undefined),
            xy,
            tickPositions,
            crossPos,
            ret: Highcharts.SVGPathArray;

        // Crosshair logic
        if (options.isCrosshair) {
            // Find crosshair's position and perform destructuring assignment
            crossPos = this.getCrosshairPosition(options, x1, y1);
            value = crossPos[0];
            x2 = crossPos[1];
            y2 = crossPos[2];
        }

        // Spokes
        if (axis.isCircular) {
            a = (typeof innerRadius === 'string') ?
                relativeLength(innerRadius, 1) : (
                    innerRadius /
                    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
                );

            b = (typeof outerRadius === 'string') ?
                relativeLength(outerRadius, 1) : (
                    outerRadius /
                    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
                );

            ret = [
                'M',
                x1 + a * (x2 - x1),
                y1 - a * (y1 - y2),
                'L',
                x2 - (1 - b) * (x2 - x1),
                y2 + (1 - b) * (y1 - y2)
            ];
            // Concentric circles
        } else {
            // Pick the right values depending if it is grid line or
            // crosshair
            value = axis.translate(value as any);

            // This is required in case when xAxis is non-circular to
            // prevent grid lines (or crosshairs, if enabled) from
            // rendering above the center after they supposed to be
            // displayed below the center point
            if (!options.isCrosshair &&
                (value as any < 0 || value as any > axis.height) && inverted) {
                value = 0;
            }

            if (axis.options.gridLineInterpolation === 'circle') {
                // A value of 0 is in the center, so it won't be
                // visible, but draw it anyway for update and animation
                // (#2366)
                ret = axis.getLinePath(0, value);
                // Concentric polygons
            } else {
                // Find the other axis (a circular one) in the same pane
                chart[inverted ? 'yAxis' : 'xAxis'].forEach(
                    function (a): void {
                        if (a.pane === axis.pane) {
                            otherAxis = a as Highcharts.RadialAxis;
                        }
                    });

                ret = [];
                tickPositions = (otherAxis as any).tickPositions;

                if ((otherAxis as any).autoConnect) {
                    tickPositions =
                        tickPositions.concat([tickPositions[0]]);
                }

                // Reverse the positions for concatenation of polygonal
                // plot bands
                if (reverse) {
                    tickPositions = [].concat(tickPositions).reverse();
                }

                tickPositions.forEach(function (pos: number, i: number): void {
                    xy = (otherAxis as any).getPosition(pos, value);
                    ret.push(i ? 'L' : 'M', xy.x, xy.y);
                });
            }
        }

        return ret;
    },

    /* *
     * Find the position for the axis title, by default inside the gauge
     */
    getTitlePosition: function (
        this: Highcharts.RadialAxis
    ): Highcharts.PositionObject {
        var center = this.center,
            chart = this.chart,
            titleOptions = this.options.title;

        return {
            x: chart.plotLeft + center[0] + ((titleOptions as any).x || 0),
            y: (
                chart.plotTop +
                center[1] -
                (
                    ({
                        high: 0.5,
                        middle: 0.25,
                        low: 0
                    } as Highcharts.Dictionary<number>)[
                        (titleOptions as any).align
                    ] *
                    center[2]
                ) +
                ((titleOptions as any).y || 0)
            )
        };
    },

    /* *
     * Attach and return collecting function for labels in radial axis for
     * anti-collision.
     */
    createLabelCollector: function (
        this: Highcharts.RadialAxis
    ): Highcharts.ChartLabelCollectorFunction {
        var axis = this;

        return function (
            this: null
        ): (Array<(Highcharts.SVGElement|undefined)>|undefined) {

            if (
                axis.isRadial &&
                axis.tickPositions &&
                // undocumented option for now, but working
                (axis.options.labels as any).allowOverlap !== true
            ) {
                return axis.tickPositions
                    .map(function (
                        pos: number
                    ): (Highcharts.SVGElement|undefined) {
                        return axis.ticks[pos] && axis.ticks[pos].label;
                    })
                    .filter(function (
                        label: (Highcharts.SVGElement|undefined)
                    ): boolean {
                        return Boolean(label);
                    });
            }
        };
    }

    /* eslint-enable valid-jsdoc */

};

/* eslint-disable no-invalid-this */

// Actions before axis init.
addEvent(Axis as any, 'init', function (
    this: Highcharts.RadialAxis,
    e: { userOptions: Highcharts.RadialAxisOptions }
): void {
    var chart = this.chart,
        inverted = chart.inverted,
        angular = chart.angular,
        polar = chart.polar,
        isX = this.isXAxis,
        coll = this.coll,
        isHidden = angular && isX,
        isCircular: (boolean|undefined),
        chartOptions = chart.options,
        paneIndex = e.userOptions.pane || 0,
        pane = (this as Highcharts.Axis).pane =
            chart.pane && chart.pane[paneIndex];

    // Prevent changes for colorAxis
    if (coll === 'colorAxis') {
        this.isRadial = false;
        return;
    }

    // Before prototype.init
    if (angular) {
        extend(this, isHidden ? hiddenAxisMixin : radialAxisMixin);
        isCircular = !isX;
        if (isCircular) {
            this.defaultPolarOptions = this.defaultRadialGaugeOptions;
        }

    } else if (polar) {
        extend(this, radialAxisMixin);

        // Check which axis is circular
        isCircular = this.horiz;

        this.defaultPolarOptions = isCircular ?
            this.defaultCircularOptions :
            merge(coll === 'xAxis' ?
                this.defaultOptions : this.defaultYAxisOptions,
            this.defaultRadialOptions
            );

        // Apply the stack labels for yAxis in case of inverted chart
        if (inverted && coll === 'yAxis') {
            this.defaultPolarOptions.stackLabels =
                this.defaultYAxisOptions.stackLabels;
        }
    }

    // Disable certain features on angular and polar axes
    if (angular || polar) {
        this.isRadial = true;
        (chartOptions.chart as any).zoomType = null as any;

        if (!this.labelCollector) {
            this.labelCollector = this.createLabelCollector();
        }
        if (this.labelCollector) {
            // Prevent overlapping axis labels (#9761)
            chart.labelCollectors.push(
                this.labelCollector as Highcharts.ChartLabelCollectorFunction
            );
        }
    } else {
        this.isRadial = false;
    }

    // A pointer back to this axis to borrow geometry
    if (pane && isCircular) {
        pane.axis = this;
    }

    this.isCircular = isCircular;

});

addEvent(Axis as any, 'afterInit', function (
    this: Highcharts.RadialAxis
): void {

    var chart = this.chart,
        options = this.options,
        isHidden = chart.angular && this.isXAxis,
        pane = this.pane,
        paneOptions = pane && pane.options;

    if (!isHidden && pane && (chart.angular || chart.polar)) {

        // Start and end angle options are
        // given in degrees relative to top, while internal computations are
        // in radians relative to right (like SVG).

        // Y axis in polar charts
        this.angleRad = (options.angle || 0) * Math.PI / 180;
        // Gauges
        this.startAngleRad =
            ((paneOptions.startAngle as any) - 90) * Math.PI / 180;
        this.endAngleRad = (pick(
            paneOptions.endAngle, (paneOptions.startAngle as any) + 360
        ) - 90) * Math.PI / 180; // Gauges
        this.offset = options.offset || 0;

    }

});

// Wrap auto label align to avoid setting axis-wide rotation on radial axes
// (#4920)
addEvent(Axis as any, 'autoLabelAlign', function (
    this: Highcharts.RadialAxis,
    e: (Event & { align?: string })
): void {
    if (this.isRadial) {
        e.align = void 0;
        e.preventDefault();
    }
});

// Remove label collector function on axis remove/update
addEvent(Axis as any, 'destroy', function (
    this: Highcharts.RadialAxis
): void {
    if (this.chart && this.chart.labelCollectors) {
        var index = this.chart.labelCollectors.indexOf(
            this.labelCollector as Highcharts.ChartLabelCollectorFunction
        );

        if (index >= 0) {
            this.chart.labelCollectors.splice(index, 1);
        }
    }
});

// Add special cases within the Tick class' methods for radial axes.
addEvent(Tick as any, 'afterGetPosition', function (
    this: Highcharts.RadialTick,
    e: (Event & { pos: Highcharts.PositionObject })
): void {
    if (this.axis.getPosition) {
        extend(e.pos, this.axis.getPosition(this.pos));
    }
});

// Find the center position of the label based on the distance option.
addEvent(Tick as any, 'afterGetLabelPosition', function (
    this: Highcharts.RadialTick,
    e: (Event & { pos: Highcharts.Dictionary<number> })
): void {
    var axis = this.axis,
        label = this.label as Highcharts.SVGElement,
        labelBBox = (label as any).getBBox(),
        labelOptions = axis.options.labels,
        optionsY = (labelOptions as any).y,
        ret,
        centerSlot = 20, // 20 degrees to each side at the top and bottom
        align = (labelOptions as any).align,
        angle = (
            (
                (axis.translate(this.pos) as any) + axis.startAngleRad +
                Math.PI / 2
            ) / Math.PI * 180
        ) % 360,
        correctAngle = Math.round(angle),
        labelDir = 'end', // Direction of the label 'start' or 'end'
        reducedAngle1 = correctAngle < 0 ?
            correctAngle + 360 : correctAngle,
        reducedAngle2 = reducedAngle1,
        translateY = 0,
        translateX = 0,
        labelYPosCorrection =
            (labelOptions as any).y === null ? -labelBBox.height * 0.3 : 0;

    if (axis.isRadial) { // Both X and Y axes in a polar chart
        ret = axis.getPosition(
            this.pos,
            (axis.center[2] / 2) +
                relativeLength(
                    pick((labelOptions as any).distance, -25),
                    axis.center[2] / 2,
                    -axis.center[2] / 2
                )
        );

        // Automatically rotated
        if ((labelOptions as any).rotation === 'auto') {
            label.attr({
                rotation: angle
            });

        // Vertically centered
        } else if (optionsY === null) {
            optionsY = (
                axis.chart.renderer
                    .fontMetrics(label.styles && label.styles.fontSize).b -
                    labelBBox.height / 2
            );
        }

        // Automatic alignment
        if (align === null) {
            if (axis.isCircular) { // Y axis
                if (
                    labelBBox.width >
                    axis.len * axis.tickInterval / (axis.max - axis.min)
                ) { // #3506
                    centerSlot = 0;
                }
                if (angle > centerSlot && angle < 180 - centerSlot) {
                    align = 'left'; // right hemisphere
                } else if (
                    angle > 180 + centerSlot &&
                    angle < 360 - centerSlot
                ) {
                    align = 'right'; // left hemisphere
                } else {
                    align = 'center'; // top or bottom
                }
            } else {
                align = 'center';
            }
            label.attr({
                align: align
            });
        }

        // Auto alignment for solid-gauges with two labels (#10635)
        if (
            align === 'auto' &&
            axis.tickPositions.length === 2 &&
            axis.isCircular
        ) {
            // Angles reduced to 0 - 90 or 180 - 270
            if (reducedAngle1 > 90 && reducedAngle1 < 180) {
                reducedAngle1 = 180 - reducedAngle1;
            } else if (reducedAngle1 > 270 && reducedAngle1 <= 360) {
                reducedAngle1 = 540 - reducedAngle1;
            }

            // Angles reduced to 0 - 180
            if (reducedAngle2 > 180 && reducedAngle2 <= 360) {
                reducedAngle2 = 360 - reducedAngle2;
            }

            if (
                (axis.pane.options.startAngle === correctAngle) ||
                (axis.pane.options.startAngle === correctAngle + 360) ||
                (axis.pane.options.startAngle === correctAngle - 360)
            ) {
                labelDir = 'start';
            }

            if (
                (correctAngle >= -90 && correctAngle <= 90) ||
                (correctAngle >= -360 && correctAngle <= -270) ||
                (correctAngle >= 270 && correctAngle <= 360)
            ) {
                align = (labelDir === 'start') ? 'right' : 'left';
            } else {
                align = (labelDir === 'start') ? 'left' : 'right';
            }

            // For angles beetwen (90 + n * 180) +- 20
            if (reducedAngle2 > 70 && reducedAngle2 < 110) {
                align = 'center';
            }

            // auto Y translation
            if (
                reducedAngle1 < 15 ||
                (reducedAngle1 >= 180 && reducedAngle1 < 195)
            ) {
                translateY = labelBBox.height * 0.3;
            } else if (reducedAngle1 >= 15 && reducedAngle1 <= 35) {
                translateY = labelDir === 'start' ?
                    0 : labelBBox.height * 0.75;
            } else if (reducedAngle1 >= 195 && reducedAngle1 <= 215) {
                translateY = labelDir === 'start' ?
                    labelBBox.height * 0.75 : 0;
            } else if (reducedAngle1 > 35 && reducedAngle1 <= 90) {
                translateY = labelDir === 'start' ?
                    -labelBBox.height * 0.25 : labelBBox.height;
            } else if (reducedAngle1 > 215 && reducedAngle1 <= 270) {
                translateY = labelDir === 'start' ?
                    labelBBox.height : -labelBBox.height * 0.25;
            }

            // auto X translation
            if (reducedAngle2 < 15) {
                translateX = labelDir === 'start' ?
                    -labelBBox.height * 0.15 : labelBBox.height * 0.15;
            } else if (reducedAngle2 > 165 && reducedAngle2 <= 180) {
                translateX = labelDir === 'start' ?
                    labelBBox.height * 0.15 : -labelBBox.height * 0.15;
            }

            label.attr({ align: align });
            label.translate(translateX, translateY + labelYPosCorrection);
        }

        e.pos.x = ret.x + (labelOptions as any).x;
        e.pos.y = ret.y + optionsY;

    }
});

// Wrap the getMarkPath function to return the path of the radial marker
wrap(tickProto, 'getMarkPath', function (
    this: Highcharts.RadialTick,
    proceed: Function,
    x: number,
    y: number,
    tickLength: number,
    tickWidth: number,
    horiz: boolean,
    renderer: Highcharts.Renderer
): Highcharts.SVGPathArray {
    var axis = this.axis,
        endPoint,
        ret;

    if (axis.isRadial) {
        endPoint = axis.getPosition(
            this.pos,
            axis.center[2] / 2 + tickLength
        );
        ret = [
            'M',
            x,
            y,
            'L',
            endPoint.x,
            endPoint.y
        ];
    } else {
        ret = proceed.call(
            this,
            x,
            y,
            tickLength,
            tickWidth,
            horiz,
            renderer
        );
    }
    return ret;
});
