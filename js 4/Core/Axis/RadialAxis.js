/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import AxisDefaults from './AxisDefaults.js';
import D from '../DefaultOptions.js';
var defaultOptions = D.defaultOptions;
import H from '../Globals.js';
var noop = H.noop;
import U from '../Utilities.js';
var addEvent = U.addEvent, correctFloat = U.correctFloat, defined = U.defined, extend = U.extend, fireEvent = U.fireEvent, merge = U.merge, pick = U.pick, relativeLength = U.relativeLength, wrap = U.wrap;
/* *
 *
 *  Composition
 *
 * */
var RadialAxis;
(function (RadialAxis) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    var composedClasses = [];
    /**
     * Circular axis around the perimeter of a polar chart.
     * @private
     */
    var defaultCircularOptions = {
        gridLineWidth: 1,
        labels: {
            align: void 0,
            distance: 15,
            x: 0,
            y: void 0,
            style: {
                textOverflow: 'none' // wrap lines by default (#7248)
            }
        },
        maxPadding: 0,
        minPadding: 0,
        showLastLabel: false,
        tickLength: 0
    };
    /**
     * The default options extend defaultYAxisOptions.
     * @private
     */
    var defaultRadialGaugeOptions = {
        labels: {
            align: 'center',
            x: 0,
            y: void 0 // auto
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
    };
    /**
     * Radial axis, like a spoke in a polar chart.
     * @private
     */
    var defaultRadialOptions = {
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
    };
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * In case of auto connect, add one closestPointRange to the max value
     * right before tickPositions are computed, so that ticks will extend
     * passed the real max.
     * @private
     */
    function beforeSetTickPositions() {
        // If autoConnect is true, polygonal grid lines are connected, and
        // one closestPointRange is added to the X axis to prevent the last
        // point from overlapping the first.
        this.autoConnect = (this.isCircular &&
            typeof pick(this.userMax, this.options.max) === 'undefined' &&
            correctFloat(this.endAngleRad - this.startAngleRad) ===
                correctFloat(2 * Math.PI));
        // This will lead to add an extra tick to xAxis in order to display
        // a correct range on inverted polar
        if (!this.isCircular && this.chart.inverted) {
            this.max++;
        }
        if (this.autoConnect) {
            this.max += ((this.categories && 1) ||
                this.pointRange ||
                this.closestPointRange ||
                0); // #1197, #2260
        }
    }
    /**
     * Augments methods for the value axis.
     *
     * @private
     *
     * @param {Highcharts.Axis} AxisClass
     * Axis class to extend.
     *
     * @param {Highcharts.Tick} TickClass
     * Tick class to use.
     *
     * @return {Highcharts.Axis}
     * Axis composition.
     */
    function compose(AxisClass, TickClass) {
        if (composedClasses.indexOf(AxisClass) === -1) {
            composedClasses.push(AxisClass);
            addEvent(AxisClass, 'afterInit', onAxisAfterInit);
            addEvent(AxisClass, 'autoLabelAlign', onAxisAutoLabelAlign);
            addEvent(AxisClass, 'destroy', onAxisDestroy);
            addEvent(AxisClass, 'init', onAxisInit);
            addEvent(AxisClass, 'initialAxisTranslation', onAxisInitialAxisTranslation);
        }
        if (composedClasses.indexOf(TickClass) === -1) {
            composedClasses.push(TickClass);
            addEvent(TickClass, 'afterGetLabelPosition', onTickAfterGetLabelPosition);
            addEvent(TickClass, 'afterGetPosition', onTickAfterGetPosition);
            wrap(TickClass.prototype, 'getMarkPath', wrapTickGetMarkPath);
        }
        return AxisClass;
    }
    RadialAxis.compose = compose;
    /**
     * Attach and return collecting function for labels in radial axis for
     * anti-collision.
     *
     * @private
     */
    function createLabelCollector() {
        var _this = this;
        return function () {
            if (_this.isRadial &&
                _this.tickPositions &&
                // undocumented option for now, but working
                _this.options.labels &&
                _this.options.labels.allowOverlap !== true) {
                return _this.tickPositions
                    .map(function (pos) {
                    return _this.ticks[pos] && _this.ticks[pos].label;
                })
                    .filter(function (label) {
                    return Boolean(label);
                });
            }
        };
    }
    /**
     * Creates an empty collector function.
     * @private
     */
    function createLabelCollectorHidden() {
        return noop;
    }
    /**
     * Find the correct end values of crosshair in polar.
     * @private
     */
    function getCrosshairPosition(options, x1, y1) {
        var center = this.pane.center;
        var value = options.value, shapeArgs, end, x2, y2;
        if (this.isCircular) {
            if (!defined(value)) {
                // When the snap is set to false
                x2 = options.chartX || 0;
                y2 = options.chartY || 0;
                value = this.translate(Math.atan2(y2 - y1, x2 - x1) - this.startAngleRad, true);
            }
            else if (options.point) {
                // When the snap is set to true
                shapeArgs = options.point.shapeArgs || {};
                if (shapeArgs.start) {
                    // Find a true value of the point based on the
                    // angle
                    value = this.chart.inverted ?
                        this.translate(options.point.rectPlotY, true) :
                        options.point.x;
                }
            }
            end = this.getPosition(value);
            x2 = end.x;
            y2 = end.y;
        }
        else {
            if (!defined(value)) {
                x2 = options.chartX;
                y2 = options.chartY;
            }
            if (defined(x2) && defined(y2)) {
                // Calculate radius of non-circular axis' crosshair
                y1 = center[1] + this.chart.plotTop;
                value = this.translate(Math.min(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), center[2] / 2) - center[3] / 2, true);
            }
        }
        return [value, x2 || 0, y2 || 0];
    }
    /**
     * Get the path for the axis line. This method is also referenced in the
     * getPlotLinePath method.
     *
     * @private
     * @param {number} _lineWidth
     * Line width is not used.
     * @param {number} [radius]
     * Radius of radial path.
     * @param {number} [innerRadius]
     * Inner radius of radial path.
     */
    function getLinePath(_lineWidth, radius, innerRadius) {
        var center = this.pane.center, chart = this.chart, left = this.left || 0, top = this.top || 0;
        var end, r = pick(radius, center[2] / 2 - this.offset), path;
        if (typeof innerRadius === 'undefined') {
            innerRadius = this.horiz ? 0 : this.center && -this.center[3] / 2;
        }
        // In case when innerSize of pane is set, it must be included
        if (innerRadius) {
            r += innerRadius;
        }
        if (this.isCircular || typeof radius !== 'undefined') {
            path = this.chart.renderer.symbols.arc(left + center[0], top + center[1], r, r, {
                start: this.startAngleRad,
                end: this.endAngleRad,
                open: true,
                innerR: 0
            });
            // Bounds used to position the plotLine label next to the line
            // (#7117)
            path.xBounds = [left + center[0]];
            path.yBounds = [top + center[1] - r];
        }
        else {
            end = this.postTranslate(this.angleRad, r);
            path = [
                [
                    'M',
                    this.center[0] + chart.plotLeft,
                    this.center[1] + chart.plotTop
                ],
                ['L', end.x, end.y]
            ];
        }
        return path;
    }
    /**
     * Wrap the getOffset method to return zero offset for title or labels
     * in a radial axis.
     */
    function getOffset() {
        var axisProto = this.constructor.prototype;
        // Call the Axis prototype method (the method we're in now is on the
        // instance)
        axisProto.getOffset.call(this);
        // Title or label offsets are not counted
        this.chart.axisOffset[this.side] = 0;
    }
    /**
     * Find the path for plot bands along the radial axis.
     *
     * @private
     */
    function getPlotBandPath(from, to, options) {
        var chart = this.chart, radiusToPixels = function (radius) {
            if (typeof radius === 'string') {
                var r = parseInt(radius, 10);
                if (percentRegex.test(radius)) {
                    r = (r * fullRadius) / 100;
                }
                return r;
            }
            return radius;
        }, center = this.center, startAngleRad = this.startAngleRad, fullRadius = center[2] / 2, offset = Math.min(this.offset, 0), left = this.left || 0, top = this.top || 0, percentRegex = /%$/, isCircular = this.isCircular; // X axis in a polar chart
        var start, end, angle, xOnPerimeter, open, path, outerRadius = pick(radiusToPixels(options.outerRadius), fullRadius), innerRadius = radiusToPixels(options.innerRadius), thickness = pick(radiusToPixels(options.thickness), 10);
        // Polygonal plot bands
        if (this.options.gridLineInterpolation === 'polygon') {
            path = this.getPlotLinePath({ value: from }).concat(this.getPlotLinePath({ value: to, reverse: true }));
            // Circular grid bands
        }
        else {
            // Keep within bounds
            from = Math.max(from, this.min);
            to = Math.min(to, this.max);
            var transFrom = this.translate(from), transTo = this.translate(to);
            // Plot bands on Y axis (radial axis) - inner and outer
            // radius depend on to and from
            if (!isCircular) {
                outerRadius = transFrom || 0;
                innerRadius = transTo || 0;
            }
            // Handle full circle
            if (options.shape === 'circle' || !isCircular) {
                start = -Math.PI / 2;
                end = Math.PI * 1.5;
                open = true;
            }
            else {
                start = startAngleRad + (transFrom || 0);
                end = startAngleRad + (transTo || 0);
            }
            outerRadius -= offset; // #5283
            thickness -= offset; // #5283
            path = chart.renderer.symbols.arc(left + center[0], top + center[1], outerRadius, outerRadius, {
                // Math is for reversed yAxis (#3606)
                start: Math.min(start, end),
                end: Math.max(start, end),
                innerR: pick(innerRadius, outerRadius - thickness),
                open: open
            });
            // Provide positioning boxes for the label (#6406)
            if (isCircular) {
                angle = (end + start) / 2;
                xOnPerimeter = (left +
                    center[0] +
                    (center[2] / 2) * Math.cos(angle));
                path.xBounds = angle > -Math.PI / 2 && angle < Math.PI / 2 ?
                    // Right hemisphere
                    [xOnPerimeter, chart.plotWidth] :
                    // Left hemisphere
                    [0, xOnPerimeter];
                path.yBounds = [
                    top + center[1] + (center[2] / 2) * Math.sin(angle)
                ];
                // Shift up or down to get the label clear of the perimeter
                path.yBounds[0] += ((angle > -Math.PI && angle < 0) ||
                    (angle > Math.PI)) ? -10 : 10;
            }
        }
        return path;
    }
    /**
     * Find the path for plot lines perpendicular to the radial axis.
     */
    function getPlotLinePath(options) {
        var _this = this;
        var center = this.pane.center, chart = this.chart, inverted = chart.inverted, reverse = options.reverse, background = this.pane.options.background ?
            (this.pane.options.background[0] ||
                this.pane.options.background) :
            {}, innerRadius = background.innerRadius || '0%', outerRadius = background.outerRadius || '100%', x1 = center[0] + chart.plotLeft, y1 = center[1] + chart.plotTop, height = this.height, isCrosshair = options.isCrosshair, paneInnerR = center[3] / 2;
        var value = options.value, innerRatio, distance, a, b, otherAxis, xy, tickPositions, crossPos, path;
        var end = this.getPosition(value);
        var x2 = end.x, y2 = end.y;
        // Crosshair logic
        if (isCrosshair) {
            // Find crosshair's position and perform destructuring
            // assignment
            crossPos = this.getCrosshairPosition(options, x1, y1);
            value = crossPos[0];
            x2 = crossPos[1];
            y2 = crossPos[2];
        }
        // Spokes
        if (this.isCircular) {
            distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            a = (typeof innerRadius === 'string') ?
                relativeLength(innerRadius, 1) :
                (innerRadius / distance);
            b = (typeof outerRadius === 'string') ?
                relativeLength(outerRadius, 1) :
                (outerRadius / distance);
            // To ensure that gridlines won't be displayed in area
            // defined by innerSize in case of custom radiuses of pane's
            // background
            if (center && paneInnerR) {
                innerRatio = paneInnerR / distance;
                if (a < innerRatio) {
                    a = innerRatio;
                }
                if (b < innerRatio) {
                    b = innerRatio;
                }
            }
            path = [
                ['M', x1 + a * (x2 - x1), y1 - a * (y1 - y2)],
                ['L', x2 - (1 - b) * (x2 - x1), y2 + (1 - b) * (y1 - y2)]
            ];
            // Concentric circles
        }
        else {
            // Pick the right values depending if it is grid line or
            // crosshair
            value = this.translate(value);
            // This is required in case when xAxis is non-circular to
            // prevent grid lines (or crosshairs, if enabled) from
            // rendering above the center after they supposed to be
            // displayed below the center point
            if (value) {
                if (value < 0 || value > height) {
                    value = 0;
                }
            }
            if (this.options.gridLineInterpolation === 'circle') {
                // A value of 0 is in the center, so it won't be
                // visible, but draw it anyway for update and animation
                // (#2366)
                path = this.getLinePath(0, value, paneInnerR);
                // Concentric polygons
            }
            else {
                path = [];
                // Find the other axis (a circular one) in the same pane
                chart[inverted ? 'yAxis' : 'xAxis'].forEach(function (a) {
                    if (a.pane === _this.pane) {
                        otherAxis = a;
                    }
                });
                if (otherAxis) {
                    tickPositions = otherAxis.tickPositions;
                    if (otherAxis.autoConnect) {
                        tickPositions =
                            tickPositions.concat([tickPositions[0]]);
                    }
                    // Reverse the positions for concatenation of polygonal
                    // plot bands
                    if (reverse) {
                        tickPositions = tickPositions.slice().reverse();
                    }
                    if (value) {
                        value += paneInnerR;
                    }
                    for (var i = 0; i < tickPositions.length; i++) {
                        xy = otherAxis.getPosition(tickPositions[i], value);
                        path.push(i ? ['L', xy.x, xy.y] : ['M', xy.x, xy.y]);
                    }
                }
            }
        }
        return path;
    }
    /**
     * Returns the x, y coordinate of a point given by a value and a pixel
     * distance from center.
     *
     * @private
     * @param {number} value
     * Point value.
     * @param {number} [length]
     * Distance from center.
     */
    function getPosition(value, length) {
        var translatedVal = this.translate(value);
        return this.postTranslate(this.isCircular ? translatedVal : this.angleRad, // #2848
        // In case when translatedVal is negative, the 0 value must be
        // used instead, in order to deal with lines and labels that
        // fall out of the visible range near the center of a pane
        pick(this.isCircular ?
            length :
            (translatedVal < 0 ? 0 : translatedVal), this.center[2] / 2) - this.offset);
    }
    /**
     * Find the position for the axis title, by default inside the gauge.
     */
    function getTitlePosition() {
        var center = this.center, chart = this.chart, titleOptions = this.options.title;
        return {
            x: chart.plotLeft + center[0] + (titleOptions.x || 0),
            y: (chart.plotTop +
                center[1] -
                ({
                    high: 0.5,
                    middle: 0.25,
                    low: 0
                }[titleOptions.align] *
                    center[2]) +
                (titleOptions.y || 0))
        };
    }
    /**
     * Modify radial axis.
     * @private
     *
     * @param {Highcharts.Axis} radialAxis
     * Radial axis to modify.
     */
    function modify(axis) {
        axis.beforeSetTickPositions = beforeSetTickPositions;
        axis.createLabelCollector = createLabelCollector;
        axis.getCrosshairPosition = getCrosshairPosition;
        axis.getLinePath = getLinePath;
        axis.getOffset = getOffset;
        axis.getPlotBandPath = getPlotBandPath;
        axis.getPlotLinePath = getPlotLinePath;
        axis.getPosition = getPosition;
        axis.getTitlePosition = getTitlePosition;
        axis.postTranslate = postTranslate;
        axis.setAxisSize = setAxisSize;
        axis.setAxisTranslation = setAxisTranslation;
        axis.setOptions = setOptions;
    }
    /**
     * Modify radial axis as hidden.
     * @private
     *
     * @param {Highcharts.Axis} radialAxis
     * Radial axis to modify.
     */
    function modifyAsHidden(radialAxis) {
        radialAxis.isHidden = true;
        radialAxis.createLabelCollector = createLabelCollectorHidden;
        radialAxis.getOffset = noop;
        radialAxis.redraw = renderHidden;
        radialAxis.render = renderHidden;
        radialAxis.setScale = noop;
        radialAxis.setCategories = noop;
        radialAxis.setTitle = noop;
    }
    /**
     * Finalize modification of axis instance with radial logic.
     */
    function onAxisAfterInit() {
        var chart = this.chart, options = this.options, isHidden = chart.angular && this.isXAxis, pane = this.pane, paneOptions = pane && pane.options;
        if (!isHidden && pane && (chart.angular || chart.polar)) {
            // Start and end angle options are given in degrees relative to
            // top, while internal computations are in radians relative to
            // right (like SVG).
            // Y axis in polar charts
            this.angleRad = (options.angle || 0) * Math.PI / 180;
            // Gauges
            this.startAngleRad =
                (paneOptions.startAngle - 90) * Math.PI / 180;
            this.endAngleRad = (pick(paneOptions.endAngle, paneOptions.startAngle + 360) - 90) * Math.PI / 180; // Gauges
            this.offset = options.offset || 0;
        }
    }
    /**
     * Wrap auto label align to avoid setting axis-wide rotation on radial axes.
     * (#4920)
     */
    function onAxisAutoLabelAlign(e) {
        if (this.isRadial) {
            e.align = void 0;
            e.preventDefault();
        }
    }
    /**
     * Remove label collector function on axis remove/update.
     */
    function onAxisDestroy() {
        if (this.chart &&
            this.chart.labelCollectors) {
            var index = (this.labelCollector ?
                this.chart.labelCollectors.indexOf(this.labelCollector) :
                -1);
            if (index >= 0) {
                this.chart.labelCollectors.splice(index, 1);
            }
        }
    }
    /**
     * Modify axis instance with radial logic before common axis init.
     */
    function onAxisInit(e) {
        var chart = this.chart, inverted = chart.inverted, angular = chart.angular, polar = chart.polar, isX = this.isXAxis, coll = this.coll, isHidden = angular && isX, chartOptions = chart.options, paneIndex = e.userOptions.pane || 0, pane = this.pane = chart.pane && chart.pane[paneIndex];
        var isCircular;
        // Prevent changes for colorAxis
        if (coll === 'colorAxis') {
            this.isRadial = false;
            return;
        }
        // Before prototype.init
        if (angular) {
            if (isHidden) {
                modifyAsHidden(this);
            }
            else {
                modify(this);
            }
            isCircular = !isX;
            if (isCircular) {
                this.defaultPolarOptions = defaultRadialGaugeOptions;
            }
        }
        else if (polar) {
            modify(this);
            // Check which axis is circular
            isCircular = this.horiz;
            this.defaultPolarOptions = isCircular ?
                defaultCircularOptions :
                merge(coll === 'xAxis' ?
                    AxisDefaults.defaultXAxisOptions :
                    AxisDefaults.defaultYAxisOptions, defaultRadialOptions);
            // Apply the stack labels for yAxis in case of inverted chart
            if (inverted && coll === 'yAxis') {
                this.defaultPolarOptions.stackLabels = AxisDefaults
                    .defaultYAxisOptions.stackLabels;
                this.defaultPolarOptions.reversedStacks = true;
            }
        }
        // Disable certain features on angular and polar axes
        if (angular || polar) {
            this.isRadial = true;
            chartOptions.chart.zoomType = null;
            if (!this.labelCollector) {
                this.labelCollector = this.createLabelCollector();
            }
            if (this.labelCollector) {
                // Prevent overlapping axis labels (#9761)
                chart.labelCollectors.push(this.labelCollector);
            }
        }
        else {
            this.isRadial = false;
        }
        // A pointer back to this axis to borrow geometry
        if (pane && isCircular) {
            pane.axis = this;
        }
        this.isCircular = isCircular;
    }
    /**
     * Prepare axis translation.
     */
    function onAxisInitialAxisTranslation() {
        if (this.isRadial) {
            this.beforeSetTickPositions();
        }
    }
    /**
     * Find the center position of the label based on the distance option.
     */
    function onTickAfterGetLabelPosition(e) {
        var label = this.label;
        if (!label) {
            return;
        }
        var axis = this.axis, labelBBox = label.getBBox(), labelOptions = axis.options.labels, angle = ((axis.translate(this.pos) + axis.startAngleRad +
            Math.PI / 2) / Math.PI * 180) % 360, correctAngle = Math.round(angle), labelYPosCorrection = !defined(labelOptions.y) ? -labelBBox.height * 0.3 : 0;
        var optionsY = labelOptions.y, ret, centerSlot = 20, // 20 degrees to each side at the top and bottom
        align = labelOptions.align, labelDir = 'end', // Direction of the label 'start' or 'end'
        reducedAngle1 = correctAngle < 0 ?
            correctAngle + 360 : correctAngle, reducedAngle2 = reducedAngle1, translateY = 0, translateX = 0;
        if (axis.isRadial) { // Both X and Y axes in a polar chart
            ret = axis.getPosition(this.pos, (axis.center[2] / 2) +
                relativeLength(pick(labelOptions.distance, -25), axis.center[2] / 2, -axis.center[2] / 2));
            // Automatically rotated
            if (labelOptions.rotation === 'auto') {
                label.attr({
                    rotation: angle
                });
                // Vertically centered
            }
            else if (!defined(optionsY)) {
                optionsY = (axis.chart.renderer
                    .fontMetrics(label.styles && label.styles.fontSize).b -
                    labelBBox.height / 2);
            }
            // Automatic alignment
            if (!defined(align)) {
                if (axis.isCircular) { // Y axis
                    if (labelBBox.width >
                        axis.len * axis.tickInterval / (axis.max - axis.min)) { // #3506
                        centerSlot = 0;
                    }
                    if (angle > centerSlot && angle < 180 - centerSlot) {
                        align = 'left'; // right hemisphere
                    }
                    else if (angle > 180 + centerSlot &&
                        angle < 360 - centerSlot) {
                        align = 'right'; // left hemisphere
                    }
                    else {
                        align = 'center'; // top or bottom
                    }
                }
                else {
                    align = 'center';
                }
                label.attr({
                    align: align
                });
            }
            // Auto alignment for solid-gauges with two labels (#10635)
            if (align === 'auto' &&
                axis.tickPositions.length === 2 &&
                axis.isCircular) {
                // Angles reduced to 0 - 90 or 180 - 270
                if (reducedAngle1 > 90 && reducedAngle1 < 180) {
                    reducedAngle1 = 180 - reducedAngle1;
                }
                else if (reducedAngle1 > 270 && reducedAngle1 <= 360) {
                    reducedAngle1 = 540 - reducedAngle1;
                }
                // Angles reduced to 0 - 180
                if (reducedAngle2 > 180 && reducedAngle2 <= 360) {
                    reducedAngle2 = 360 - reducedAngle2;
                }
                if ((axis.pane.options.startAngle === correctAngle) ||
                    (axis.pane.options.startAngle === correctAngle + 360) ||
                    (axis.pane.options.startAngle === correctAngle - 360)) {
                    labelDir = 'start';
                }
                if ((correctAngle >= -90 && correctAngle <= 90) ||
                    (correctAngle >= -360 && correctAngle <= -270) ||
                    (correctAngle >= 270 && correctAngle <= 360)) {
                    align = (labelDir === 'start') ? 'right' : 'left';
                }
                else {
                    align = (labelDir === 'start') ? 'left' : 'right';
                }
                // For angles beetwen (90 + n * 180) +- 20
                if (reducedAngle2 > 70 && reducedAngle2 < 110) {
                    align = 'center';
                }
                // auto Y translation
                if (reducedAngle1 < 15 ||
                    (reducedAngle1 >= 180 && reducedAngle1 < 195)) {
                    translateY = labelBBox.height * 0.3;
                }
                else if (reducedAngle1 >= 15 && reducedAngle1 <= 35) {
                    translateY = labelDir === 'start' ?
                        0 : labelBBox.height * 0.75;
                }
                else if (reducedAngle1 >= 195 && reducedAngle1 <= 215) {
                    translateY = labelDir === 'start' ?
                        labelBBox.height * 0.75 : 0;
                }
                else if (reducedAngle1 > 35 && reducedAngle1 <= 90) {
                    translateY = labelDir === 'start' ?
                        -labelBBox.height * 0.25 : labelBBox.height;
                }
                else if (reducedAngle1 > 215 && reducedAngle1 <= 270) {
                    translateY = labelDir === 'start' ?
                        labelBBox.height : -labelBBox.height * 0.25;
                }
                // auto X translation
                if (reducedAngle2 < 15) {
                    translateX = labelDir === 'start' ?
                        -labelBBox.height * 0.15 : labelBBox.height * 0.15;
                }
                else if (reducedAngle2 > 165 && reducedAngle2 <= 180) {
                    translateX = labelDir === 'start' ?
                        labelBBox.height * 0.15 : -labelBBox.height * 0.15;
                }
                label.attr({ align: align });
                label.translate(translateX, translateY + labelYPosCorrection);
            }
            e.pos.x = ret.x + (labelOptions.x || 0);
            e.pos.y = ret.y + (optionsY || 0);
        }
    }
    /**
     * Add special cases within the Tick class' methods for radial axes.
     */
    function onTickAfterGetPosition(e) {
        if (this.axis.getPosition) {
            extend(e.pos, this.axis.getPosition(this.pos));
        }
    }
    /**
     * Translate from intermediate plotX (angle), plotY (axis.len - radius)
     * to final chart coordinates.
     *
     * @private
     * @param {number} angle
     * Translation angle.
     * @param {number} radius
     * Translation radius.
     */
    function postTranslate(angle, radius) {
        var chart = this.chart, center = this.center;
        angle = this.startAngleRad + angle;
        return {
            x: chart.plotLeft + center[0] + Math.cos(angle) * radius,
            y: chart.plotTop + center[1] + Math.sin(angle) * radius
        };
    }
    /**
     * Prevent setting Y axis dirty.
     */
    function renderHidden() {
        this.isDirty = false;
    }
    /**
     * Override the setAxisSize method to use the arc's circumference as
     * length. This allows tickPixelInterval to apply to pixel lengths along
     * the perimeter.
     * @private
     */
    function setAxisSize() {
        var axisProto = this.constructor.prototype;
        var center, start;
        axisProto.setAxisSize.call(this);
        if (this.isRadial) {
            // Set the center array
            this.pane.updateCenter(this);
            // In case when the innerSize is set in a polar chart, the axis'
            // center cannot be a reference to pane's center
            center = this.center = this.pane.center.slice();
            // The sector is used in Axis.translate to compute the
            // translation of reversed axis points (#2570)
            if (this.isCircular) {
                this.sector = this.endAngleRad - this.startAngleRad;
            }
            else {
                // When the pane's startAngle or the axis' angle is set then
                // new x and y values for vertical axis' center must be
                // calulated
                start = this.postTranslate(this.angleRad, center[3] / 2);
                center[0] = start.x - this.chart.plotLeft;
                center[1] = start.y - this.chart.plotTop;
            }
            // Axis len is used to lay out the ticks
            this.len = this.width = this.height =
                (center[2] - center[3]) * pick(this.sector, 1) / 2;
        }
    }
    /**
     * Override setAxisTranslation by setting the translation to the
     * difference in rotation. This allows the translate method to return
     * angle for any given value.
     *
     * @private
     */
    function setAxisTranslation() {
        var axisProto = this.constructor.prototype;
        // Call uber method
        axisProto.setAxisTranslation.call(this);
        // Set transA and minPixelPadding
        if (this.center) { // it's not defined the first time
            if (this.isCircular) {
                this.transA = (this.endAngleRad - this.startAngleRad) /
                    ((this.max - this.min) || 1);
            }
            else {
                // The transA here is the length of the axis, so in case
                // of inner radius, the length must be decreased by it
                this.transA = ((this.center[2] - this.center[3]) / 2) /
                    ((this.max - this.min) || 1);
            }
            if (this.isXAxis) {
                this.minPixelPadding = this.transA * this.minPointOffset;
            }
            else {
                // This is a workaround for regression #2593, but categories
                // still don't position correctly.
                this.minPixelPadding = 0;
            }
        }
    }
    /**
     * Merge and set options.
     */
    function setOptions(userOptions) {
        var options = this.options = merge(this.constructor.defaultOptions, this.defaultPolarOptions, defaultOptions[this.coll], // #16112
        userOptions);
        // Make sure the plotBands array is instanciated for each Axis
        // (#2649)
        if (!options.plotBands) {
            options.plotBands = [];
        }
        fireEvent(this, 'afterSetOptions');
    }
    /**
     * Wrap the getMarkPath function to return the path of the radial marker.
     */
    function wrapTickGetMarkPath(proceed, x, y, tickLength, tickWidth, horiz, renderer) {
        var axis = this.axis;
        var endPoint, ret;
        if (axis.isRadial) {
            endPoint = axis.getPosition(this.pos, axis.center[2] / 2 + tickLength);
            ret = [
                'M',
                x,
                y,
                'L',
                endPoint.x,
                endPoint.y
            ];
        }
        else {
            ret = proceed.call(this, x, y, tickLength, tickWidth, horiz, renderer);
        }
        return ret;
    }
    /* eslint-enable valid-jsdoc */
})(RadialAxis || (RadialAxis = {}));
/* *
 *
 *  Default Export
 *
 * */
export default RadialAxis;
