/* *
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Tick.js';
import './Pane.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    extend = H.extend,
    merge = H.merge,
    noop = H.noop,
    pick = H.pick,
    pInt = H.pInt,
    Tick = H.Tick,
    wrap = H.wrap,
    correctFloat = H.correctFloat,


    hiddenAxisMixin, // @todo Extract this to a new file
    radialAxisMixin, // @todo Extract this to a new file
    axisProto = Axis.prototype,
    tickProto = Tick.prototype;

// Augmented methods for the x axis in order to hide it completely, used for
// the X axis in gauges
hiddenAxisMixin = {
    getOffset: noop,
    redraw: function () {
        this.isDirty = false; // prevent setting Y axis dirty
    },
    render: function () {
        this.isDirty = false; // prevent setting Y axis dirty
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
            y: null // auto
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
    defaultRadialXOptions: {
        gridLineWidth: 1, // spokes
        labels: {
            align: null, // auto
            distance: 15,
            x: 0,
            y: null, // auto
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
    defaultRadialYOptions: {
        gridLineInterpolation: 'circle',
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

    // Merge and set options
    setOptions: function (userOptions) {

        var options = this.options = merge(
            this.defaultOptions,
            this.defaultRadialOptions,
            userOptions
        );

        // Make sure the plotBands array is instanciated for each Axis
        // (#2649)
        if (!options.plotBands) {
            options.plotBands = [];
        }

        H.fireEvent(this, 'afterSetOptions');

    },

    // Wrap the getOffset method to return zero offset for title or labels
    // in a radial axis
    getOffset: function () {
        // Call the Axis prototype method (the method we're in now is on the
        // instance)
        axisProto.getOffset.call(this);

        // Title or label offsets are not counted
        this.chart.axisOffset[this.side] = 0;

    },


    // Get the path for the axis line. This method is also referenced in the
    // getPlotLinePath method.
    getLinePath: function (lineWidth, radius) {
        var center = this.center,
            end,
            chart = this.chart,
            r = pick(radius, center[2] / 2 - this.offset),
            path;

        if (this.isCircular || radius !== undefined) {
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

    /* *
        * Override setAxisTranslation by setting the translation to the
        * difference in rotation. This allows the translate method to return
        * angle for any given value.
        */
    setAxisTranslation: function () {

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

    /* *
        * In case of auto connect, add one closestPointRange to the max value
        * right before tickPositions are computed, so that ticks will extend
        * passed the real max.
        */
    beforeSetTickPositions: function () {
        // If autoConnect is true, polygonal grid lines are connected, and
        // one closestPointRange is added to the X axis to prevent the last
        // point from overlapping the first.
        this.autoConnect = (
            this.isCircular &&
            pick(this.userMax, this.options.max) === undefined &&
            correctFloat(this.endAngleRad - this.startAngleRad) ===
            correctFloat(2 * Math.PI)
        );

        if (this.autoConnect) {
            this.max += (
                (this.categories && 1) ||
                this.pointRange ||
                this.closestPointRange ||
                0
            ); // #1197, #2260
        }
    },

    /* *
        * Override the setAxisSize method to use the arc's circumference as
        * length. This allows tickPixelInterval to apply to pixel lengths along
        * the perimeter
        */
    setAxisSize: function () {

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

    /* *
        * Returns the x, y coordinate of a point given by a value and a pixel
        * distance from center
        */
    getPosition: function (value, length) {
        return this.postTranslate(
            this.isCircular ?
                this.translate(value) :
                this.angleRad, // #2848
            pick(
                this.isCircular ? length : this.translate(value),
                this.center[2] / 2
            ) - this.offset
        );
    },

    /* *
        * Translate from intermediate plotX (angle), plotY (axis.len - radius)
        * to final chart coordinates.
        */
    postTranslate: function (angle, radius) {

        var chart = this.chart,
            center = this.center;

        angle = this.startAngleRad + angle;

        return {
            x: chart.plotLeft + center[0] + Math.cos(angle) * radius,
            y: chart.plotTop + center[1] + Math.sin(angle) * radius
        };

    },

    /* *
        * Find the path for plot bands along the radial axis
        */
    getPlotBandPath: function (from, to, options) {
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
            ret;

        // Polygonal plot bands
        if (this.options.gridLineInterpolation === 'polygon') {
            ret = this.getPlotLinePath(from).concat(
                this.getPlotLinePath(to, true)
            );

        // Circular grid bands
        } else {

            // Keep within bounds
            from = Math.max(from, this.min);
            to = Math.min(to, this.max);

            // Plot bands on Y axis (radial axis) - inner and outer radius
            // depend on to and from
            if (!isCircular) {
                radii[0] = this.translate(from);
                radii[1] = this.translate(to);
            }

            // Convert percentages to pixel values
            radii = radii.map(function (radius) {
                if (percentRegex.test(radius)) {
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
                start = startAngleRad + this.translate(from);
                end = startAngleRad + this.translate(to);
            }

            radii[0] -= offset; // #5283
            radii[2] -= offset; // #5283

            ret = this.chart.renderer.symbols.arc(
                this.left + center[0],
                this.top + center[1],
                radii[0],
                radii[0],
                {
                    // Math is for reversed yAxis (#3606)
                    start: Math.min(start, end),
                    end: Math.max(start, end),
                    innerR: pick(radii[1], radii[0] - radii[2]),
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
        * Find the path for plot lines perpendicular to the radial axis.
        */
    getPlotLinePath: function (value, reverse) {
        var axis = this,
            center = axis.center,
            chart = axis.chart,
            end = axis.getPosition(value),
            xAxis,
            xy,
            tickPositions,
            ret;

        // Spokes
        if (axis.isCircular) {
            ret = [
                'M',
                center[0] + chart.plotLeft,
                center[1] + chart.plotTop,
                'L',
                end.x,
                end.y
            ];

        // Concentric circles
        } else if (axis.options.gridLineInterpolation === 'circle') {
            value = axis.translate(value);

            // a value of 0 is in the center, so it won't be visible,
            // but draw it anyway for update and animation (#2366)
            ret = axis.getLinePath(0, value);
        // Concentric polygons
        } else {
            // Find the X axis in the same pane
            chart.xAxis.forEach(function (a) {
                if (a.pane === axis.pane) {
                    xAxis = a;
                }
            });
            ret = [];
            value = axis.translate(value);
            tickPositions = xAxis.tickPositions;
            if (xAxis.autoConnect) {
                tickPositions = tickPositions.concat([tickPositions[0]]);
            }
            // Reverse the positions for concatenation of polygonal plot
            // bands
            if (reverse) {
                tickPositions = [].concat(tickPositions).reverse();
            }

            tickPositions.forEach(function (pos, i) {
                xy = xAxis.getPosition(pos, value);
                ret.push(i ? 'L' : 'M', xy.x, xy.y);
            });

        }
        return ret;
    },

    /* *
        * Find the position for the axis title, by default inside the gauge
        */
    getTitlePosition: function () {
        var center = this.center,
            chart = this.chart,
            titleOptions = this.options.title;

        return {
            x: chart.plotLeft + center[0] + (titleOptions.x || 0),
            y: (
                chart.plotTop +
                center[1] -
                (
                    {
                        high: 0.5,
                        middle: 0.25,
                        low: 0
                    }[titleOptions.align] * center[2]
                ) +
                (titleOptions.y || 0)
            )
        };
    }

};

// Actions before axis init.
addEvent(Axis, 'init', function (e) {
    var axis = this,
        chart = this.chart,
        angular = chart.angular,
        polar = chart.polar,
        isX = this.isXAxis,
        isHidden = angular && isX,
        isCircular,
        chartOptions = chart.options,
        paneIndex = e.userOptions.pane || 0,
        pane = this.pane = chart.pane && chart.pane[paneIndex];

    // Before prototype.init
    if (angular) {
        extend(this, isHidden ? hiddenAxisMixin : radialAxisMixin);
        isCircular = !isX;
        if (isCircular) {
            this.defaultRadialOptions = this.defaultRadialGaugeOptions;
        }

    } else if (polar) {
        extend(this, radialAxisMixin);
        isCircular = isX;
        this.defaultRadialOptions = isX ?
            this.defaultRadialXOptions :
            merge(this.defaultYAxisOptions, this.defaultRadialYOptions);

    }

    // Disable certain features on angular and polar axes
    if (angular || polar) {
        this.isRadial = true;
        chart.inverted = false;
        chartOptions.chart.zoomType = null;

        // Prevent overlapping axis labels (#9761)
        chart.labelCollectors.push(function () {
            if (
                axis.isRadial &&
                axis.tickPositions &&
                // undocumented option for now, but working
                axis.options.labels.allowOverlap !== true
            ) {
                return axis.tickPositions
                    .map(function (pos) {
                        return axis.ticks[pos] && axis.ticks[pos].label;
                    })
                    .filter(function (label) {
                        return Boolean(label);
                    });
            }
        });
    } else {
        this.isRadial = false;
    }

    // A pointer back to this axis to borrow geometry
    if (pane && isCircular) {
        pane.axis = this;
    }

    this.isCircular = isCircular;

});

addEvent(Axis, 'afterInit', function () {

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
        this.startAngleRad = (paneOptions.startAngle - 90) * Math.PI / 180;
        this.endAngleRad = (
            pick(paneOptions.endAngle, paneOptions.startAngle + 360) - 90
        ) * Math.PI / 180; // Gauges
        this.offset = options.offset || 0;

    }

});

// Wrap auto label align to avoid setting axis-wide rotation on radial axes
// (#4920)
addEvent(Axis, 'autoLabelAlign', function (e) {
    if (this.isRadial) {
        e.align = undefined;
        e.preventDefault();
    }
});

// Add special cases within the Tick class' methods for radial axes.
addEvent(Tick, 'afterGetPosition', function (e) {
    if (this.axis.getPosition) {
        extend(e.pos, this.axis.getPosition(this.pos));
    }
});

// Find the center position of the label based on the distance option.
addEvent(Tick, 'afterGetLabelPosition', function (e) {
    var axis = this.axis,
        label = this.label,
        labelOptions = axis.options.labels,
        optionsY = labelOptions.y,
        ret,
        centerSlot = 20, // 20 degrees to each side at the top and bottom
        align = labelOptions.align,
        angle = (
            (axis.translate(this.pos) + axis.startAngleRad + Math.PI / 2) /
            Math.PI * 180
        ) % 360;

    if (axis.isRadial) { // Both X and Y axes in a polar chart
        ret = axis.getPosition(this.pos, (axis.center[2] / 2) +
            pick(labelOptions.distance, -25));

        // Automatically rotated
        if (labelOptions.rotation === 'auto') {
            label.attr({
                rotation: angle
            });

        // Vertically centered
        } else if (optionsY === null) {
            optionsY = (
                axis.chart.renderer
                    .fontMetrics(label.styles && label.styles.fontSize).b -
                label.getBBox().height / 2
            );
        }

        // Automatic alignment
        if (align === null) {
            if (axis.isCircular) { // Y axis
                if (
                    this.label.getBBox().width >
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

        e.pos.x = ret.x + labelOptions.x;
        e.pos.y = ret.y + optionsY;

    }
});

// Wrap the getMarkPath function to return the path of the radial marker
wrap(tickProto, 'getMarkPath', function (
    proceed,
    x,
    y,
    tickLength,
    tickWidth,
    horiz,
    renderer
) {
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
