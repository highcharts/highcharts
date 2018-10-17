/**
 * (c) 2009-2018 Highsoft AS
 * Authors: Øystein Moseng, Torstein Hønsi, Jon A. Nygård
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var addEvent = H.addEvent,
    each = H.each,
    objectEach = H.objectEach,
    pick = H.pick,
    filter = H.grep,
    merge = H.merge,
    seriesTypes = H.seriesTypes;


/*
    Add drag/drop support to specific data props for different series types.

    The dragDrop.draggableX/Y user options on series enable/disable all of these
    per direction unless they are specifically set in options using
    dragDrop.{optionName}. If the prop does not specify an optionName here, it
    can only be enabled/disabled by the user with draggableX/Y.

    Supported options for each prop:
        optionName: User option in series.dragDrop that enables/disables
            dragging this prop.
        axis: Can be 'x' or 'y'. Whether this prop is linked to x or y axis.
        move: Whether or not this prop should be updated when moving points.
        resize: Whether or not to draw a drag handle and allow user to drag and
            update this prop by itself.
        beforeResize: Hook to perform tasks before a resize is made. Gets
            the guide box, the new points values, and the point as args.
        resizeSide: Which side of the guide box to resize when dragging the
            handle. Can be "left", "right", "top", "bottom". Chart.inverted is
            handled automatically. Can also be a function, taking the new point
            values as parameter, as well as the point, and returning a string
            with the side.
        propValidate: Function that takes the prop value and the point as
            arguments, and returns true if the prop value is valid, false if
            not. It is used to prevent e.g. resizing "low" above "high".
        handlePositioner: For resizeable props, return 0,0 in SVG plot coords of
            where to place the dragHandle. Gets point as argument. Should return
            object with x and y properties.
        handleFormatter: For resizeable props, return the path of the drag
            handle as an SVG path array. Gets the point as argument. The handle
            is translated according to handlePositioner.
        handleOptions: Options to merge with the default handle options.

        TODO:
        - It makes sense to have support for resizing the size of bubbles and
            e.g variwide columns. This requires us to support dragging along a
            z-axis, somehow computing a relative value from old to new pixel
            size.
        - Moving maps could be useful, although we would have to compute new
            point.path values in order to do it properly (using SVG translate
            is easier, but won't update the data).
*/

// 90deg rotated column handle path, used in multiple series types
var horizHandleFormatter = function (point) {
    var shapeArgs = point.shapeArgs || point.graphic.getBBox(),
        top = shapeArgs.r || 0, // Rounding of bar corners
        bottom = shapeArgs.height - top,
        centerY = shapeArgs.height / 2;
    return [
        // Top wick
        'M', 0, top,
        'L', 0, centerY - 5,
        // Circle
        'A', 1, 1, 0, 0, 0, 0, centerY + 5,
        'A', 1, 1, 0, 0, 0, 0, centerY - 5,
        // Bottom wick
        'M', 0, centerY + 5,
        'L', 0, bottom
    ];
};

// Line series - only draggableX/Y, no drag handles
var lineDragDropProps = seriesTypes.line.prototype.dragDropProps = {
    x: {
        axis: 'x',
        move: true
    },
    y: {
        axis: 'y',
        move: true
    }
};

// Flag series - same as line/scatter
if (seriesTypes.flags) {
    seriesTypes.flags.prototype.dragDropProps = lineDragDropProps;
}

// Column series - x can be moved, y can only be resized. Note extra
// functionality for handling upside down columns (below threshold).
var columnDragDropProps = seriesTypes.column.prototype.dragDropProps = {
    x: {
        axis: 'x',
        move: true
    },
    y: {
        axis: 'y',
        move: false,
        resize: true,
        // Force guideBox start coordinates
        beforeResize: function (guideBox, pointVals, point) {
            // We need to ensure that guideBox always starts at threshold.
            // We flip whether or not we update the top or bottom of the guide
            // box at threshold, but if we drag the mouse fast, the top has not
            // reached threshold before we cross over and update the bottom.
            var threshold = point.series.translatedThreshold,
                y = guideBox.attr('y'),
                height,
                diff;
            if (pointVals.y >= point.series.options.threshold || 0) {
                // Above threshold - always set height to hit the threshold
                height = guideBox.attr('height');
                diff = threshold ? threshold - (y + height) : 0;
                guideBox.attr({
                    height: Math.max(0, Math.round(height + diff))
                });
            } else {
                // Below - always set y to start at threshold
                guideBox.attr({
                    y: Math.round(y + (threshold ? threshold - y : 0))
                });
            }
        },
        // Flip the side of the resize handle if column is below threshold
        resizeSide: function (pointVals, point) {
            return pointVals.y >= (point.series.options.threshold || 0) ?
                'top' : 'bottom';
        },
        // Position handle at bottom if column is below threshold
        handlePositioner: function (point) {
            var bBox = point.shapeArgs || point.graphic.getBBox();
            return {
                x: bBox.x,
                y: point.y >= (point.series.options.threshold || 0) ?
                    bBox.y : bBox.y + bBox.height
            };
        },
        // Horizontal handle
        handleFormatter: function (point) {
            var shapeArgs = point.shapeArgs,
                radius = shapeArgs.r || 0, // Rounding of bar corners
                centerX = shapeArgs.width / 2;
            return [
                // Left wick
                'M', radius, 0,
                'L', centerX - 5, 0,
                // Circle
                'A', 1, 1, 0, 0, 0, centerX + 5, 0,
                'A', 1, 1, 0, 0, 0, centerX - 5, 0,
                // Right wick
                'M', centerX + 5, 0,
                'L', shapeArgs.width - radius, 0
            ];
        }
    }
};

// Bullet graph, x/y same as column, but also allow target to be dragged.
if (seriesTypes.bullet) {
    seriesTypes.bullet.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        y: columnDragDropProps.y,
        target: {
            /**
             * Allow target value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.bullet.dragDrop.draggableTarget
             */
            optionName: 'draggableTarget',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (point) {
                var bBox = point.targetGraphic.getBBox();
                return {
                    x: point.barX,
                    y: bBox.y + bBox.height / 2
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter
        }
    };
}

// Columnrange series - move x, resize or move low/high
if (seriesTypes.columnrange) {
    seriesTypes.columnrange.prototype.dragDropProps = {
        x: {
            axis: 'x',
            move: true
        },
        low: {
            /**
             * Allow low value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.columnrange.dragDrop.draggableLow
             */
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (point) {
                var bBox = point.shapeArgs || point.graphic.getBBox();
                return {
                    x: bBox.x,
                    y: bBox.y + bBox.height
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.high;
            }
        },
        high: {
            /**
             * Allow high value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.columnrange.dragDrop.draggableHigh
             */
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (point) {
                var bBox = point.shapeArgs || point.graphic.getBBox();
                return {
                    x: bBox.x,
                    y: bBox.y
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val >= point.low;
            }
        }
    };
}

// Boxplot series - move x, resize or move low/q1/q3/high
if (seriesTypes.boxplot) {
    seriesTypes.boxplot.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        low: {
            /**
             * Allow low value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.boxplot.dragDrop.draggableLow
             */
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.lowPlot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.q1;
            }
        },
        q1: {
            /**
             * Allow Q1 value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.boxplot.dragDrop.draggableQ1
             */
            optionName: 'draggableQ1',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.q1Plot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.median && val >= point.low;
            }
        },
        median: {
            // Median can not be dragged individually, just move the whole
            // point for this.
            axis: 'y',
            move: true
        },
        q3: {
            /**
             * Allow Q3 value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.boxplot.dragDrop.draggableQ3
             */
            optionName: 'draggableQ3',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.q3Plot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.high && val >= point.median;
            }
        },
        /**
         * Allow high value to be dragged individually. Requires
         * `draggable-points` module.
         *
         * @type {boolean}
         * @default  true
         * @apioption plotOptions.boxplot.dragDrop.draggableHigh
         */
        high: {
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.highPlot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val >= point.q3;
            }
        }
    };
}


// OHLC series - move x, resize or move open/high/low/close
if (seriesTypes.ohlc) {
    seriesTypes.ohlc.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        low: {
            /**
             * Allow low value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.ohlc.dragDrop.draggableLow
             */
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.plotLow
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.open && val <= point.close;
            }
        },
        high: {
            /**
             * Allow high value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.ohlc.dragDrop.draggableHigh
             */
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.plotHigh
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val >= point.open && val >= point.close;
            }
        },
        open: {
            /**
             * Allow open value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.ohlc.dragDrop.draggableOpen
             */
            optionName: 'draggableOpen',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: function (point) {
                return point.open >= point.close ? 'top' : 'bottom';
            },
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.plotOpen
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.high && val >= point.low;
            }
        },
        close: {
            /**
             * Allow close value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.ohlc.dragDrop.draggableClose
             */
            optionName: 'draggableClose',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: function (point) {
                return point.open >= point.close ? 'bottom' : 'top';
            },
            handlePositioner: function (point) {
                return {
                    x: point.shapeArgs.x,
                    y: point.plotClose
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (val, point) {
                return val <= point.high && val >= point.low;
            }
        }
    };
}

// Arearange series - move x, resize or move low/high
if (seriesTypes.arearange) {
    var columnrangeDragDropProps = seriesTypes.columnrange
            .prototype.dragDropProps,
        // Use a circle covering the marker as drag handle
        arearangeHandleFormatter = function (point) {
            var radius = point.graphic ?
                    point.graphic.getBBox().width / 2 + 1 :
                    4;
            return [
                'M', 0 - radius, 0,
                'a', radius, radius, 0, 1, 0, radius * 2, 0,
                'a', radius, radius, 0, 1, 0, radius * -2, 0
            ];
        };
    seriesTypes.arearange.prototype.dragDropProps = {
        x: columnrangeDragDropProps.x,
        low: {
            /**
             * Allow low value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.arearange.dragDrop.draggableLow
             */
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (point) {
                var bBox = point.lowerGraphic && point.lowerGraphic.getBBox();
                return bBox ? {
                    x: bBox.x + bBox.width / 2,
                    y: bBox.y + bBox.height / 2
                } : { x: -999, y: -999 };
            },
            handleFormatter: arearangeHandleFormatter,
            propValidate: columnrangeDragDropProps.low.propValidate
        },
        high: {
            /**
             * Allow high value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.arearange.dragDrop.draggableHigh
             */
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (point) {
                var bBox = point.upperGraphic && point.upperGraphic.getBBox();
                return bBox ? {
                    x: bBox.x + bBox.width / 2,
                    y: bBox.y + bBox.height / 2
                } : { x: -999, y: -999 };
            },
            handleFormatter: arearangeHandleFormatter,
            propValidate: columnrangeDragDropProps.high.propValidate
        }
    };
}

// Waterfall - mostly as column, but don't show drag handles for sum points
if (seriesTypes.waterfall) {
    seriesTypes.waterfall.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        y: merge(columnDragDropProps.y, {
            handleFormatter: function (point) {
                return point.isSum || point.isIntermediateSum ? null :
                    columnDragDropProps.y.handleFormatter(point);
            }
        })
    };
}

// Xrange - resize/move x/x2, and move y
if (seriesTypes.xrange) {
    // Handle positioner logic is the same for x and x2 apart from the
    // x value. shapeArgs does not take yAxis reversed etc into account, so we
    // use axis.toPixels to handle positioning.
    var xrangeHandlePositioner = function (point, xProp) {
            var series = point.series,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                inverted = series.chart.inverted,
                // Using toPixels handles axis.reversed, but doesn't take
                // chart.inverted into account.
                newX = xAxis.toPixels(point[xProp], true),
                newY = yAxis.toPixels(point.y, true);

            // Handle chart inverted
            if (inverted) {
                newX = xAxis.len - newX;
                newY = yAxis.len - newY -
                    point.shapeArgs.height / 2;
            } else {
                newY -= point.shapeArgs.height / 2;
            }

            return {
                x: Math.round(newX),
                y: Math.round(newY)
            };
        },
        xrangeDragDropProps = seriesTypes.xrange.prototype.dragDropProps = {
            y: {
                axis: 'y',
                move: true
            },
            x: {
                /**
                 * Allow x value to be dragged individually. Requires
                 * `draggable-points` module.
                 *
                 * @type {boolean}
                 * @default  true
                 * @apioption plotOptions.xrange.dragDrop.draggableX1
                 */
                optionName: 'draggableX1',
                axis: 'x',
                move: true,
                resize: true,
                resizeSide: 'left',
                handlePositioner: function (point) {
                    return xrangeHandlePositioner(point, 'x');
                },
                handleFormatter: horizHandleFormatter,
                propValidate: function (val, point) {
                    return val <= point.x2;
                }
            },
            x2: {
                /**
                 * Allow x2 value to be dragged individually. Requires
                 * `draggable-points` module.
                 *
                 * @type {boolean}
                 * @default  true
                 * @apioption plotOptions.xrange.dragDrop.draggableX2
                 */
                optionName: 'draggableX2',
                axis: 'x',
                move: true,
                resize: true,
                resizeSide: 'right',
                handlePositioner: function (point) {
                    return xrangeHandlePositioner(point, 'x2');
                },
                handleFormatter: horizHandleFormatter,
                propValidate: function (val, point) {
                    return val >= point.x;
                }
            }
        };
}

// Gantt - same as xrange, but with aliases
if (seriesTypes.gantt) {
    seriesTypes.gantt.prototype.dragDropProps = {
        y: xrangeDragDropProps.y,
        start: merge(xrangeDragDropProps.x, {
            /**
             * Allow start value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.gantt.dragDrop.draggableStart
             */
            optionName: 'draggableStart',

            // Do not allow individual drag handles for milestones
            validateIndividualDrag: function (point) {
                return !point.milestone;
            }
        }),
        end: merge(xrangeDragDropProps.x2, {
            /**
             * Allow end value to be dragged individually. Requires
             * `draggable-points` module.
             *
             * @type {boolean}
             * @default  true
             * @apioption plotOptions.gantt.dragDrop.draggableEnd
             */
            optionName: 'draggableEnd',

            // Do not allow individual drag handles for milestones
            validateIndividualDrag: function (point) {
                return !point.milestone;
            }
        })
    };
}

// Don't support certain series types
each(
    ['gauge', 'pie', 'sunburst', 'wordcloud', 'sankey', 'histogram', 'pareto',
        'vector', 'windbarb', 'treemap', 'bellcurve', 'sma', 'map', 'mapline'],
    function (type) {
        if (seriesTypes[type]) {
            seriesTypes[type].prototype.dragDropProps = null;
        }
    }
);

/**
 * The draggable-points module allows points to be moved around or modified
 * in the chart. In addition to the options mentioned under the `dragDrop`
 * API structure, the module fires three events,
 * [point.dragStart](series.line.point.events.dragStart),
 * [point.drag](series.line.point.events.drag) and
 * [point.drop](series.line.point.events.drop).
 *
 * It requires the `modules/draggable-points.js` file to be loaded.
 *
 * @type {object}
 * @since 6.2.0
 *
 * @sample  highcharts/dragdrop/resize-column Draggable column and line series
 *
 * @sample  highcharts/dragdrop/drag-bubble Draggable bubbles
 *
 * @sample  highcharts/dragdrop/drag-xrang Draggable X range series
 *
 * @apioption plotOptions.series.dragDrop
 */

/**
 * The amount of pixels to drag the pointer before it counts as a drag
 * operation. This prevents drag/drop to fire when just clicking or selecting
 * points.
 *
 * @type {number}
 * @default 2
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragSensitivity
 */
var defaultDragSensitivity = 2;

/**
 * Style options for the guide box. The guide box has one state by default,
 * the "default" state.
 *
 * @type {object}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox
 */
var defaultGuideBoxOptions = {
    /**
     * Style options for the guide box default state.
     *
     * @type {object}
     * @since 6.2.0
     * @apioption plotOptions.series.dragDrop.guideBox.default
     */
    default: {
        /**
         * CSS class name of the guide box in this state. Defaults to
         * `highcharts-drag-box-default`.
         *
         * @type {String}
         * @since 6.2.0
         * @apioption plotOptions.series.dragDrop.guideBox.default.className
         */
        className: 'highcharts-drag-box-default',

        /**
         * Width of the line around the guide box.
         *
         * @type {number}
         * @default 1
         * @since 6.2.0
         * @apioption plotOptions.series.dragDrop.guideBox.default.lineWidth
         */
        lineWidth: 1,

        /**
         * Color of the border around the guide box.
         *
         * @type {Color}
         * @since 6.2.0
         * @default #888
         * @apioption plotOptions.series.dragDrop.guideBox.default.lineColor
         */
        lineColor: '#888',

        /**
         * Guide box fill color.
         *
         * @type {Color}
         * @since 6.2.0
         * @default rgba(0, 0, 0, 0.1)
         * @apioption plotOptions.series.dragDrop.guideBox.default.color
         */
        color: 'rgba(0, 0, 0, 0.1)',

        /**
         * Guide box cursor.
         *
         * @type {string}
         * @default move
         * @since 6.2.0
         * @apioption plotOptions.series.dragDrop.guideBox.default.cursor
         */
        cursor: 'move',

        /**
         * Guide box zIndex.
         *
         * @type {number}
         * @since 6.2.0
         * @default 900
         * @apioption plotOptions.series.dragDrop.guideBox.default.zIndex
         */
        zIndex: 900
    }
};


/**
 * Options for the drag handles.
 *
 * @type {Object}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle
 */
var defaultDragHandleOptions = {

    /**
     * Function to define the SVG path to use for the drag handles. Takes
     * the point as argument. Should return an SVG path in array format. The
     * SVG path is automatically positioned on the point.
     *
     * @type {Function}
     * @since 6.2.0
     * @apioption plotOptions.series.dragDrop.dragHandle.pathFormatter
     */
    // pathFormatter: null,

    /**
     * The mouse cursor to use for the drag handles. By default this is
     * intelligently switching between `ew-resize` and `ns-resize` depending
     * on the direction the point is being dragged.
     *
     * @type {String}
     * @since 6.2.0
     * @apioption plotOptions.series.dragDrop.dragHandle.cursor
     */
    // cursor: null,

    /**
     * The class name of the drag handles. Defaults to `highcharts-drag-handle`.
     *
     * @type {String}
     * @since 6.2.0
     * @apioption plotOptions.series.dragDrop.dragHandle.className
     */
    className: 'highcharts-drag-handle',

    /**
     * The fill color of the drag handles.
     *
     * @type {Color}
     * @since 6.2.0
     * @default #fff
     * @apioption plotOptions.series.dragDrop.dragHandle.color
     */
    color: '#fff',

    /**
     * The line color of the drag handles.
     *
     * @type {Color}
     * @since 6.2.0
     * @default rgba(0, 0, 0, 0.6)
     * @apioption plotOptions.series.dragDrop.dragHandle.lineColor
     */
    lineColor: 'rgba(0, 0, 0, 0.6)',

    /**
     * The line width for the drag handles.
     *
     * @type {number}
     * @default 2
     * @since 6.2.0
     * @apioption plotOptions.series.dragDrop.dragHandle.lineWidth
     */
    lineWidth: 1,

    /**
     * The z index for the drag handles.
     *
     * @type {number}
     * @since 6.2.0
     * @default 901
     * @apioption plotOptions.series.dragDrop.dragHandle.zIndex
     */
    zIndex: 901
};

/**
 * Set the minimum X value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMinX
 */

/**
 * Set the maximum X value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMaxX
 */

/**
 * Set the minimum Y value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMinY
 */

/**
 * Set the maximum Y value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMaxY
 */

/**
 * The X precision value to drag to for this series. Set to 0 to disable. By
 * default this is disabled, except for category axes, where the default is 1.
 *
 * @type {number}
 * @default 0
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragPrecisionX
 */

/**
 * The Y precision value to drag to for this series. Set to 0 to disable. By
 * default this is disabled, except for category axes, where the default is 1.
 *
 * @type {number}
 * @default 0
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragPrecisionY
 */

/**
 * Enable dragging in the X dimension.
 *
 * @type {boolean}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.draggableX
 */

/**
 * Enable dragging in the Y dimension. Note that this is not supported for
 * TreeGrid axes (the default axis type in Gantt charts).
 *
 * @type {boolean}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.draggableY
 */

/**
 * Group the points by a property. Points with the same property value will be
 * grouped together when moving.
 *
 * @type {String}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.groupBy
 */

/**
 * Update points as they are dragged. If false, a guide box is drawn to
 * illustrate the new point size.
 *
 * @type {boolean}
 * @default true
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.liveRedraw
 */

/**
 * Set a key to hold when dragging to zoom the chart. Requires the
 * draggable-points module. This is useful to avoid zooming while moving points.
 * Should be set different than [chart.panKey](#chart.panKey).
 *
 * @type {String}
 * @validvalue ["alt", "ctrl", "meta", "shift"]
 * @since 6.2.0
 * @apioption chart.zoomKey
 */

/**
 * Callback that fires when starting to drag a point. The mouse event object is
 * passed in as an argument. See [drag and drop options](series.line.dragDrop).
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.point.events.dragStart
 */

/**
 * Callback that fires while dragging a point. The mouse event is passed in as
 * parameter. The original data can be accessed from `e.origin`, and the new
 * point values can be accessed from `e.newPoints`. If there is only a single
 * point being updated, it can be accessed from `e.newPoint` for simplicity. To
 * stop the default drag action, return `false`. See
 * [drag and drop options](series.line.dragDrop).
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.point.events.drag
 */

/**
 * Callback that fires when the point is dropped. The mouse event is passed in
 * as parameter. The original data can be accessed from `e.origin`, and the new
 * point values can be accessed from `e.newPoints`. If there is only a single
 * point being updated, it can be accessed from `e.newPoint` for simplicity. To
 * stop the default drop action, return `false`. See
 * [drag and drop options](series.line.dragDrop).
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.point.events.drop
 */

/**
 * Point specific options for the draggable-points module. Overrides options on
 * `series.dragDrop`.
 *
 * Requires the draggable-points module.
 *
 * @extends plotOptions.series.dragDrop
 * @since 6.2.0
 * @apioption series.line.data.dragDrop
 */


/**
 * Utility function to test if a series is using drag/drop, looking at its
 * options.
 *
 * @private
 * @param {Highcharts.Series} series
 *        The series to test.
 *
 * @return {boolean}
 *        True if the series is using drag/drop.
 */
function isSeriesDraggable(series) {
    var props = ['draggableX', 'draggableY'],
        i;

    // Add optionNames from dragDropProps to the array of props to check for
    objectEach(series.dragDropProps, function (val) {
        if (val.optionName) {
            props.push(val.optionName);
        }
    });

    // Loop over all options we have that could enable dragDrop for this
    // series. If any of them are truthy, this series is draggable.
    i = props.length;
    while (i--) {
        if (series.options.dragDrop[props[i]]) {
            return true;
        }
    }
}


/**
 * Utility function to test if a chart should have drag/drop enabled, looking
 * at its options.
 *
 * @private
 * @param {Highcharts.Chart} chart
 *        The chart to test.
 *
 * @return {boolean}
 *        True if the chart is drag/droppable.
 */
function isChartDraggable(chart) {
    var i = chart.series.length;
    if (chart.hasCartesianSeries && !chart.polar) {
        while (i--) {
            if (
                chart.series[i].options.dragDrop &&
                isSeriesDraggable(chart.series[i])
            ) {
                return true;
            }
        }
    }
}


/**
 * Utility function to test if a point is movable (any of its props can be
 * dragged by a move, not just individually).
 *
 * @private
 * @param {Highcharts.Point} point
 *        The point to test.
 *
 * @return {boolean}
 *        True if the point is movable.
 */
function isPointMovable(point) {
    var series = point.series,
        seriesDragDropOptions = series.options.dragDrop,
        pointDragDropOptions = point.options && point.options.dragDrop,
        updateProps = series.dragDropProps,
        hasMovableX,
        hasMovableY;

    objectEach(updateProps, function (p) {
        if (p.axis === 'x' && p.move) {
            hasMovableX = true;
        } else if (p.axis === 'y' && p.move) {
            hasMovableY = true;
        }
    });

    // We can only move the point if draggableX/Y is set, even if all the
    // individual prop options are set.
    return (
            seriesDragDropOptions.draggableX && hasMovableX ||
            seriesDragDropOptions.draggableY && hasMovableY
        ) &&
        !(
            pointDragDropOptions &&
            pointDragDropOptions.draggableX === false &&
            pointDragDropOptions.draggableY === false
        ) &&
        series.yAxis &&
        series.xAxis;
}


/**
 * In mousemove events, check that we have dragged mouse further than the
 * dragSensitivity before we call mouseMove handler.
 *
 * @private
 * @param {global.Event} e
 *        Mouse move event to test.
 *
 * @param {Highcharts.Chart} chart
 *        Chart that has started dragging.
 *
 * @param {number} sensitivity
 *        Pixel sensitivity to test against.
 *
 * @return {boolean}
 *        True if the event is moved past sensitivity relative to the chart's
 *          drag origin.
 */
function hasDraggedPastSensitivity(e, chart, sensitivity) {
    var orig = chart.dragDropData.origin,
        oldX = orig.pageX,
        oldY = orig.pageY,
        newX = e.pageX,
        newY = e.pageY,
        distance = Math.sqrt(
            (newX - oldX) * (newX - oldX) +
            (newY - oldY) * (newY - oldY)
        );
    return distance > sensitivity;
}


/**
 * Get a snapshot of points, mouse position, and guide box dimensions
 *
 * @private
 * @param {global.Event} e
 *        Mouse event with mouse position to snapshot.
 *
 * @param {Array<Highcharts.Point>} points
 *        Points to take snapshot of. We store the value of the data properties
 *          defined in each series' dragDropProps.
 *
 * @param {Highcharts.SVGElement} [guideBox]
 *        The guide box to take snapshot of.
 *
 * @return {object}
 *        Snapshot object. Point properties are placed in a hashmap with IDs as
 *          keys.
 */
function getPositionSnapshot(e, points, guideBox) {
    var res = {
        pageX: e.pageX,
        pageY: e.pageY,
        guideBox: guideBox && {
            x: guideBox.attr('x'),
            y: guideBox.attr('y'),
            width: guideBox.attr('width'),
            height: guideBox.attr('height')
        },
        points: {}
    };

    // Loop over the points and add their props
    each(points, function (point) {
        var pointProps = {};
        // Add all of the props defined in the series' dragDropProps to the
        // snapshot
        objectEach(point.series.dragDropProps, function (val, key) {
            pointProps[key] = point[key];
        });
        pointProps.point = point; // Store reference to point
        res.points[point.id] = pointProps;
    });

    return res;
}


/**
 * Get a list of points that are grouped with this point. If only one point is
 * in the group, that point is returned by itself in an array.
 *
 * @private
 * @param {Highcharts.Point} point
 *        Point to find group from.
 *
 * @return {Array<Highcharts.Point>}
 *        Array of points in this group.
 */
function getGroupedPoints(point) {
    var series = point.series,
        groupKey = series.options.dragDrop.groupBy;
    return point.options[groupKey] ?
        // If we have a grouping option, filter the points by that
        filter(series.points, function (comparePoint) {
            return comparePoint.options[groupKey] === point.options[groupKey];
        }) :
        // Otherwise return the point by itself only
        [point];
}


/**
 * Resize a rect element on one side. The element is modified.
 *
 * @private
 * @param {Highcharts.SVGElement} rect
 *      Rect element to resize.
 *
 * @param {string} updateSide
 *      Which side of the rect to update. Can be `left`, `right`, `top` or
 *      `bottom`.
 *
 * @param {object} update
 *      Object with x and y properties, detailing how much to resize each
 *      dimension.
 *
 * @return {Highcharts.SVGElement}
 *      The modified rect.
 */
function resizeRect(rect, updateSide, update) {
    var resizeAttrs;
    switch (updateSide) {
        case 'left':
            resizeAttrs = {
                x: rect.attr('x') + update.x,
                width: Math.max(1, rect.attr('width') - update.x)
            };
            break;
        case 'right':
            resizeAttrs = {
                width: Math.max(1, rect.attr('width') + update.x)
            };
            break;
        case 'top':
            resizeAttrs = {
                y: rect.attr('y') + update.y,
                height: Math.max(1, rect.attr('height') - update.y)
            };
            break;
        case 'bottom':
            resizeAttrs = {
                height: Math.max(1, rect.attr('height') + update.y)
            };
            break;
        default:
    }
    rect.attr(resizeAttrs);
}


/**
 * Flip a side property, used with resizeRect. If input side is "left", return
 * "right" etc.
 *
 * @private
 * @param {string} side
 *      Side prop to flip. Can be `left`, `right`, `top` or `bottom`.
 *
 * @return {string}
 *      The flipped side.
 */
function flipResizeSide(side) {
    return {
        left: 'right',
        right: 'left',
        top: 'bottom',
        bottom: 'top'
    }[side];
}


/**
 * Prepare chart.dragDropData with origin info, and show the guide box.
 *
 * @private
 * @param {global.Event} e
 *      Mouse event with original mouse position.
 *
 * @param {Highcharts.Point} point
 *      The point the dragging started on.
 */
function initDragDrop(e, point) {
    var groupedPoints = getGroupedPoints(point),
        series = point.series,
        chart = series.chart,
        guideBox;

    // If liveRedraw is disabled, show the guide box with the default state
    if (!pick(
        series.options.dragDrop && series.options.dragDrop.liveRedraw,
        true
    )) {
        chart.dragGuideBox = guideBox = series.getGuideBox(groupedPoints);
        chart.setGuideBoxState('default', series.options.dragDrop.guideBox)
            .add(series.group);
    }

    // Store some data on the chart to pick up later
    chart.dragDropData = {
        origin: getPositionSnapshot(e, groupedPoints, guideBox),
        point: point,
        groupedPoints: groupedPoints
    };

    // Set drag state
    chart.isDragging = true;
}


/**
 * Calculate new point options from points being dragged.
 *
 * @private
 * @param {object} dragDropData
 *      A chart's dragDropData with drag/drop origin information, and info on
 *      which points are being dragged.
 *
 * @param {global.Event} newPos
 *      Event with the new position of the mouse (pageX/Y properties).
 *
 * @return {Array<object>}
 *      Hashmap with point.id mapped to an object with the original point
 *      reference, as well as the new data values.
 */
function getNewPoints(dragDropData, newPos) {
    var point = dragDropData.point,
        series = point.series,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        updateProps = {},
        resizeProp = dragDropData.updateProp,
        hashmap = {};

    // Go through the data props that can be updated on this series and find out
    // which ones we want to update.
    objectEach(point.series.dragDropProps, function (val, key) {
        // If we are resizing, skip if this key is not the correct one or it
        // is not resizable.
        if (
            resizeProp && (
                resizeProp !== key ||
                !val.resize ||
                val.optionName && options[val.optionName] === false
            )
        ) {
            return;
        }

        // If we are resizing, we now know it is good. If we are moving, check
        // that moving along this axis is enabled, and the prop is movable.
        // If this prop is enabled, add it to be updated.
        if (
            resizeProp || (
                val.move &&
                (
                    val.axis === 'x' && options.draggableX ||
                    val.axis === 'y' && options.draggableY
                )
            )
        ) {
            updateProps[key] = val;
        }
    });

    // Go through the points to be updated and get new options for each of them
    each(
        resizeProp ? // If resizing, only update the point we are resizing
        [point] :
        dragDropData.groupedPoints,
    function (p) {
        hashmap[p.id] = {
            point: p,
            newValues: p.getDropValues(dragDropData.origin, newPos, updateProps)
        };
    });
    return hashmap;
}


/**
 * Update the points in a chart from dragDropData.newPoints.
 *
 * @private
 * @param {Highcharts.Chart} chart
 *      A chart with dragDropData.newPoints.
 *
 * @param {boolean} [animate=true]
 *      Animate updating points?
 */
function updatePoints(chart, animate) {
    var newPoints = chart.dragDropData.newPoints,
        animOptions = animate === false ? false : merge({
            duration: 400 // 400 is the default in H.animate
        }, chart.options.animation);

    chart.isDragDropAnimating = true;

    // Update the points
    objectEach(newPoints, function (newPoint) {
        newPoint.point.update(newPoint.newValues, false);
    });

    chart.redraw(animOptions);

    // Clear the isAnimating flag after animation duration is complete.
    // The complete handler for animation seems to have bugs at this time, so
    // we have to use a timeout instead.
    setTimeout(function () {
        delete chart.isDragDropAnimating;
        if (chart.hoverPoint && !chart.dragHandles) {
            chart.hoverPoint.showDragHandles();
        }
    }, animOptions.duration);
}


/**
 * Resize the guide box according to point options and a difference in mouse
 * positions. Handles reversed axes.
 *
 * @private
 * @param {Highcharts.Point} point
 *      The point that is being resized.
 *
 * @param {number} dX
 *      Difference in X position.
 *
 * @param {number} dY
 *      Difference in Y position.
 */
function resizeGuideBox(point, dX, dY) {
    var series = point.series,
        chart = series.chart,
        dragDropData = chart.dragDropData,
        resizeSide,
        newPoint,
        resizeProp = series.dragDropProps[dragDropData.updateProp];

    // dragDropProp.resizeSide holds info on which side to resize.
    newPoint = dragDropData.newPoints[point.id].newValues;
    resizeSide = typeof resizeProp.resizeSide === 'function' ?
        resizeProp.resizeSide(newPoint, point) : resizeProp.resizeSide;

    // Call resize hook if it is defined
    if (resizeProp.beforeResize) {
        resizeProp.beforeResize(chart.dragGuideBox, newPoint, point);
    }

    // Do the resize
    resizeRect(
        chart.dragGuideBox,
        resizeProp.axis === 'x' && series.xAxis.reversed ||
        resizeProp.axis === 'y' && series.yAxis.reversed ?
            flipResizeSide(resizeSide) : resizeSide,
        {
            x: resizeProp.axis === 'x' ?
                dX - (dragDropData.origin.prevdX || 0) : 0,
            y: resizeProp.axis === 'y' ?
                dY - (dragDropData.origin.prevdY || 0) : 0
        }
    );
}


/**
 * Default mouse move handler while dragging. Handles updating points or guide
 * box.
 *
 * @private
 * @param {global.Event} e
 *      The mouse move event.
 *
 * @param {Highcharts.Point} point
 *      The point that is dragged.
 */
function dragMove(e, point) {
    var series = point.series,
        chart = series.chart,
        data = chart.dragDropData,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        draggableX = options.draggableX,
        draggableY = options.draggableY,
        origin = data.origin,
        dX = e.pageX - origin.pageX,
        dY = e.pageY - origin.pageY,
        oldDx = dX,
        updateProp = data.updateProp;

    // Handle inverted
    if (chart.inverted) {
        dX = -dY;
        dY = -oldDx;
    }

    // If we have liveRedraw enabled, update the points immediately. Otherwise
    // update the guideBox.
    if (pick(options.liveRedraw, true)) {
        updatePoints(chart, false);

        // Update drag handles
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }
        point.showDragHandles();

    } else {
        // No live redraw, update guide box
        if (updateProp) {
            // We are resizing, so resize the guide box
            resizeGuideBox(point, dX, dY);
        } else {
            // We are moving, so move the guide box
            chart.dragGuideBox.translate(
                draggableX ? dX : 0, draggableY ? dY : 0
            );
        }
    }

    // Update stored previous dX/Y
    origin.prevdX = dX;
    origin.prevdY = dY;
}


/**
 * Set the state of the guide box.
 *
 * @private
 * @param {string} state
 *      The state to set the guide box to.
 *
 * @param {object} options
 *      Additional overall guideBox options to consider.
 *
 * @return {Highcharts.SVGElement}
 *      The modified guide box.
 */
H.Chart.prototype.setGuideBoxState = function (state, options) {
    var guideBox = this.dragGuideBox,
        guideBoxOptions = merge(defaultGuideBoxOptions, options),
        stateOptions = merge(guideBoxOptions.default, guideBoxOptions[state]);
    return guideBox.attr({
        className: stateOptions.className,
        stroke: stateOptions.lineColor,
        strokeWidth: stateOptions.lineWidth,
        fill: stateOptions.color,
        cursor: stateOptions.cursor,
        zIndex: stateOptions.zIndex
    });
};


/**
 * Get updated point values when dragging a point.
 *
 * @private
 * @param {object} origin Mouse position (pageX/Y) and point props at current
 *  data values. Point props should be organized per point.id in a hashmap.
 *
 * @param {global.Event} newPos New mouse position (pageX/Y).
 *
 * @param {object} updateProps Point props to modify. Map of prop objects where
 *  each key refers to the prop, and the value is an object with an axis
 *  property. Example:
 *  {
 *      x: {
 *          axis: 'x'
 *      },
 *      x2: {
 *          axis: 'x'
 *      }
 *  }
 *
 * @returns {object}
 *  An object with updated data values.
 */
H.Point.prototype.getDropValues = function (origin, newPos, updateProps) {
    var point = this,
        series = point.series,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        yAxis = series.yAxis,
        xAxis = series.xAxis,
        dX = newPos.pageX - origin.pageX,
        dY = newPos.pageY - origin.pageY,
        oldX = pick(origin.x, point.x),
        oldY = pick(origin.y, point.y),
        dXValue = xAxis.toValue(
            xAxis.toPixels(oldX, true) +
            (xAxis.horiz ? dX : dY),
            true
        ) - oldX,
        dYValue = yAxis.toValue(
            yAxis.toPixels(oldY, true) +
            (yAxis.horiz ? dX : dY),
            true
        ) - oldY,
        result = {},
        updateSingleProp,
        pointOrigin = origin.points[point.id];

    // Find out if we only have one prop to update
    for (var key in updateProps) {
        if (updateProps.hasOwnProperty(key)) {
            if (updateSingleProp !== undefined) {
                updateSingleProp = false;
                break;
            }
            updateSingleProp = true;
        }
    }

    // Utility function to apply precision and limit a value within the
    // draggable range
    function limitToRange(val, direction) {
        var defaultPrecision = series[direction.toLowerCase() + 'Axis']
                .categories ? 1 : 0,
            precision = pick(
                options['dragPrecision' + direction], defaultPrecision
            ),
            min = pick(options['dragMin' + direction], -Infinity),
            max = pick(options['dragMax' + direction], Infinity),
            res = val;
        if (precision) {
            res = Math.round(res / precision) * precision;
        }
        return Math.max(min, Math.min(max, res));
    }

    // Assign new value to property. Adds dX/YValue to the old value, limiting
    // it within min/max ranges.
    objectEach(updateProps, function (val, key) {
        var oldVal = pointOrigin[key],
            newVal = limitToRange(
                oldVal + (val.axis === 'x' ? dXValue : dYValue),
                val.axis.toUpperCase()
            );
        // If we are updating a single prop, and it has a validation function
        // for the prop, run it. If it fails, don't update the value.
        if (
            !(
                updateSingleProp &&
                val.propValidate &&
                !val.propValidate(newVal, point)
            ) &&
            oldVal !== undefined
        ) {
            result[key] = newVal;
        }
    });

    return result;
};


/**
 * Returns an SVGElement to use as the guide box for a set of points.
 *
 * @private
 * @param {Array<Highcharts.Point>} points
 *      The state to set the guide box to.
 *
 * @return {Highcharts.SVGElement}
 *      An SVG element for the guide box, not added to DOM.
 */
H.Series.prototype.getGuideBox = function (points) {
    var chart = this.chart,
        minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity,
        changed;

    // Find bounding box of all points
    each(points, function (point) {
        var bBox = point.graphic && point.graphic.getBBox() || point.shapeArgs;
        if (bBox && (bBox.width || bBox.height || bBox.x || bBox.y)) {
            changed = true;
            minX = Math.min(bBox.x, minX);
            maxX = Math.max(bBox.x + bBox.width, maxX);
            minY = Math.min(bBox.y, minY);
            maxY = Math.max(bBox.y + bBox.height, maxY);
        }
    });

    return changed ? chart.renderer.rect(
        minX,
        minY,
        maxX - minX,
        maxY - minY
    ) : chart.renderer.g();
};


/**
 * On point mouse out. Hide drag handles, depending on state.
 *
 * @private
 * @param {Highcharts.Point} point
 *      The point mousing out of.
 */
function mouseOut(point) {
    var chart = point.series && point.series.chart;
    if (
        chart &&
        chart.dragHandles &&
        !(
            chart.dragDropData &&
            (
                chart.dragDropData.isDragging ||
                chart.dragDropData.isHoveringHandle === point.id
            )
        )
    ) {
        chart.hideDragHandles();
    }
}


/**
 * Mouseout on resize handle. Handle states, and possibly run mouseOut on point.
 *
 * @private
 * @param {Highcharts.Point} point
 *      The point mousing out of.
 */
function onResizeHandleMouseOut(point) {
    var chart = point.series.chart;
    if (
        chart.dragDropData &&
        point.id === chart.dragDropData.isHoveringHandle
    ) {
        delete chart.dragDropData.isHoveringHandle;
    }
    if (!chart.hoverPoint) {
        mouseOut(point);
    }
}


/**
 * Mousedown on resize handle. Init a drag if the conditions are right.
 *
 * @private
 * @param {global.Event} e
 *      The mousedown event.
 *
 * @param {Highcharts.Point} point
 *      The point mousing down on.
 *
 * @param {string} updateProp
 *      The data property this resize handle is attached to for this point.
 */
function onResizeHandleMouseDown(e, point, updateProp) {
    var chart = point.series.chart;

    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    // Prevent zooming
    chart.mouseIsDown = false;

    initDragDrop(e, point);
    chart.dragDropData.isDragging = true;
    chart.dragDropData.updateProp = e.updateProp = updateProp;
    point.firePointEvent('dragStart', e);

    // Prevent default to avoid point click for dragging too
    e.stopPropagation();
    e.preventDefault();
}


/**
 * Render drag handles on a point - depending on which handles are enabled - and
 * attach events to them.
 * @private
 */
H.Point.prototype.showDragHandles = function () {
    var point = this,
        series = point.series,
        chart = series.chart,
        renderer = chart.renderer,
        options = merge(series.options.dragDrop, point.options.dragDrop);

    // Go through each updateProp and see if we are supposed to create a handle
    // for it.
    objectEach(series.dragDropProps, function (val, key) {
        var handleOptions = merge(
                defaultDragHandleOptions,
                val.handleOptions,
                options.dragHandle
            ),
            handleAttrs = {
                className: handleOptions.className,
                'stroke-width': handleOptions.lineWidth,
                fill: handleOptions.color,
                stroke: handleOptions.lineColor
            },
            pathFormatter = handleOptions.pathFormatter || val.handleFormatter,
            positioner = val.handlePositioner,
            pos,
            handle,
            path,
            // Run validation function on whether or not we allow individual
            // updating of this prop.
            validate = val.validateIndividualDrag ?
                val.validateIndividualDrag(point) : true;
        if (
            val.resize &&
            validate &&
            val.resizeSide &&
            pathFormatter &&
            (
                options['draggable' + val.axis.toUpperCase()] ||
                options[val.optionName]
            ) &&
            options[val.optionName] !== false
        ) {

            // Create group if it doesn't exist
            if (!chart.dragHandles) {
                chart.dragHandles = {
                    group: renderer.g('drag-drop-handles')
                        .add(series.markerGroup || series.group)
                };
            }

            // Find position and path of handle
            pos = positioner(point);
            path = pathFormatter(point);
            if (!path || pos.x < 0 || pos.y < 0) {
                return;
            }

            // If cursor is not set explicitly, use axis direction
            handleAttrs.cursor = handleOptions.cursor ||
                (val.axis === 'x') !== !!chart.inverted ?
                    'ew-resize' : 'ns-resize';

            // Create and add the handle element
            chart.dragHandles[
                typeof val.resizeSide === 'function' ?
                    val.resizeSide(point.options, point) : val.resizeSide
            ] = handle = renderer
                .path(path)
                .translate(pos.x, pos.y)
                .attr(handleAttrs)
                .add(chart.dragHandles.group);

            // Add events
            addEvent(handle.element, 'mousedown', function (e) {
                onResizeHandleMouseDown(e, point, key);
            });
            addEvent(chart.dragHandles.group.element, 'mouseover', function () {
                chart.dragDropData = chart.dragDropData || {};
                chart.dragDropData.isHoveringHandle = point.id;
            });
            addEvent(chart.dragHandles.group.element, 'mouseout', function () {
                onResizeHandleMouseOut(point);
            });
        }
    });
};


/**
 * Remove the chart's drag handles if they exist.
 * @private
 */
H.Chart.prototype.hideDragHandles = function () {
    var chart = this;
    if (chart.dragHandles) {
        objectEach(chart.dragHandles, function (val, key) {
            if (key !== 'group' && val.destroy) {
                val.destroy();
            }
        });
        if (chart.dragHandles.group && chart.dragHandles.group.destroy) {
            chart.dragHandles.group.destroy();
        }
        delete chart.dragHandles;
    }
};


/**
 * Utility function to count the number of props in an object.
 *
 * @private
 * @param {object} object
 *      The object to count.
 *
 * @return {number}
 *      Number of own properties on the object.
 */
function countProps(object) {
    var count = 0;
    for (var p in object) {
        if (object.hasOwnProperty(p)) {
            count++;
        }
    }
    return count;
}


/**
 * Utility function to get the value of the first prop of an object. (Note that
 * the order of keys in an object is usually not guaranteed.)
 *
 * @private
 * @param {object} object
 *      The object to count.
 *
 * @return {*}
 *      Value of the first prop in the object.
 */
function getFirstProp(object) {
    for (var p in object) {
        if (object.hasOwnProperty(p)) {
            return object[p];
        }
    }
}


/**
 * Mouseover on a point. Show drag handles if the conditions are right.
 *
 * @private
 * @param {Highcharts.Point} point
 *      The point mousing over.
 */
function mouseOver(point) {
    var series = point.series,
        chart = series && series.chart;
    if (
        chart &&
        !(chart.dragDropData && chart.dragDropData.isDragging) &&
        !chart.isDragDropAnimating &&
        series.options.dragDrop &&
        !(
            chart.options &&
            chart.options.chart &&
            chart.options.chart.options3d
        )
    ) {
        // Hide the handles if they exist on another point already
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }
        point.showDragHandles();
    }
}


/**
 * On container mouse move. Handle drag sensitivity and fire drag event.
 *
 * @private
 * @param {global.Event} e
 *      The mouse move event.
 *
 * @param {Highcharts.Chart} chart
 *      The chart we are moving across.
 */
function mouseMove(e, chart) {
    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    var dragDropData = chart.dragDropData,
        point,
        seriesDragDropOpts,
        newPoints,
        numNewPoints = 0,
        newPoint;

    if (dragDropData && dragDropData.isDragging) {
        point = dragDropData.point;
        seriesDragDropOpts = point.series.options.dragDrop;

        // No tooltip for dragging
        e.preventDefault();

        // Update sensitivity test if not passed yet
        if (!dragDropData.draggedPastSensitivity) {
            dragDropData.draggedPastSensitivity = hasDraggedPastSensitivity(
                e, chart, pick(
                    point.options.dragDrop &&
                        point.options.dragDrop.dragSensitivity,
                    seriesDragDropOpts &&
                        seriesDragDropOpts.dragSensitivity,
                    defaultDragSensitivity
                )
            );
        }

        // If we have dragged past dragSensitivity, run the mousemove handler
        // for dragging
        if (dragDropData.draggedPastSensitivity) {
            // Find the new point values from the moving
            dragDropData.newPoints = getNewPoints(dragDropData, e);

            // If we are only dragging one point, add it to the event
            newPoints = dragDropData.newPoints;
            numNewPoints = countProps(newPoints);
            newPoint = numNewPoints === 1 ?
                getFirstProp(newPoints) :
                null;

            // Run the handler
            point.firePointEvent('drag', {
                origin: dragDropData.origin,
                newPoints: dragDropData.newPoints,
                newPoint: newPoint && newPoint.newValues,
                newPointId: newPoint && newPoint.point.id,
                numNewPoints: numNewPoints,
                pageX: e.pageX,
                pageY: e.pageY
            }, function () {
                dragMove(e, point);
            });
        }
    }
}


/**
 * On container mouse up. Fire drop event and reset state.
 *
 * @private
 * @param {global.Event} e
 *      The mouse up event.
 *
 * @param {Highcharts.Chart} chart
 *      The chart we were dragging in.
 */
function mouseUp(e, chart) {
    var dragDropData = chart.dragDropData;
    if (
        dragDropData &&
        dragDropData.isDragging &&
        dragDropData.draggedPastSensitivity
    ) {
        var point = dragDropData.point,
            newPoints = dragDropData.newPoints,
            numNewPoints = countProps(newPoints),
            newPoint = numNewPoints === 1 ?
                getFirstProp(newPoints) :
                null;

        // Hide the drag handles
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }

        // Prevent default action
        e.preventDefault();
        chart.cancelClick = true;

        // Fire the event, with a default handler that updates the points
        point.firePointEvent('drop', {
            origin: dragDropData.origin,
            pageX: e.pageX,
            pageY: e.pageY,
            newPoints: newPoints,
            numNewPoints: numNewPoints,
            newPoint: newPoint && newPoint.newValues,
            newPointId: newPoint && newPoint.point.id
        }, function () {
            updatePoints(chart);
        });
    }

    // Reset
    delete chart.dragDropData;

    // Clean up the drag guide box if it exists. This is always added on
    // drag start, even if user is overriding events.
    if (chart.dragGuideBox) {
        chart.dragGuideBox.destroy();
        delete chart.dragGuideBox;
    }
}


/**
 * On container mouse down. Init dragdrop if conditions are right.
 *
 * @private
 * @param {global.Event} e
 *      The mouse down event.
 *
 * @param {Highcharts.Chart} chart
 *      The chart we are clicking.
 */
function mouseDown(e, chart) {
    var dragPoint = chart.hoverPoint;

    // Reset cancel click
    chart.cancelClick = false;

    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    // Prevent zooming
    chart.mouseIsDown = false;

    // If we somehow get a mousedown event while we are dragging, cancel
    if (chart.dragDropData && chart.dragDropData.isDragging) {
        mouseUp(e, chart);
        return;
    }

    // If this point is movable, start dragging it
    if (dragPoint && isPointMovable(dragPoint)) {
        initDragDrop(e, dragPoint);
        chart.dragDropData.isDragging = true;
        dragPoint.firePointEvent('dragStart', e);
    }
}


// Point hover event. We use a short timeout due to issues with coordinating
// point mouseover/out events on dragHandles and points. Particularly arearange
// series are finicky since the markers are not individual points. This logic
// should preferably be improved in the future. Notice that the mouseOut event
// below must have a shorter timeout to ensure event order.
addEvent(H.Point, 'mouseOver', function () {
    var point = this;
    setTimeout(function () {
        mouseOver(point);
    }, 12);
});


// Point mouseleave event. See above function for explanation of the timeout.
addEvent(H.Point, 'mouseOut', function () {
    var point = this;
    setTimeout(function () {
        mouseOut(point);
    }, 10);
});


/**
 * Check whether the zoomKey or panKey is pressed.
 *
 * @private
 * @param {global.Event} e
 *      A mouse event.
 *
 * @return {boolean}
 *      True if the zoom or pan keys are pressed. False otherwise.
 */
H.Chart.prototype.zoomOrPanKeyPressed = function (e) {
    // Check whether the panKey and zoomKey are set in chart.userOptions
    var chartOptions = this.userOptions.chart || {},
        panKey = chartOptions.panKey && chartOptions.panKey + 'Key',
        zoomKey = chartOptions.zoomKey && chartOptions.zoomKey + 'Key';
    return (e[zoomKey] || e[panKey]);
};


// Add events to document and chart after chart has been created
H.Chart.prototype.callbacks.push(function (chart) {
    var container = chart.container,
        doc = H.doc;

    // Only enable if we have a draggable chart
    if (isChartDraggable(chart)) {
        addEvent(container, 'mousemove', function (e) {
            mouseMove(e, chart);
        });
        addEvent(container, 'touchmove', function (e) {
            mouseMove(e, chart);
        });
        addEvent(container, 'mousedown', function (e) {
            mouseDown(e, chart);
        });
        addEvent(container, 'touchstart', function (e) {
            mouseDown(e, chart);
        });
        addEvent(container, 'mouseleave', function (e) {
            mouseUp(e, chart);
        });
        chart.unbindDragDropMouseUp = addEvent(doc, 'mouseup', function (e) {
            mouseUp(e, chart);
        });
        chart.unbindDragDropTouchEnd = addEvent(doc, 'touchend', function (e) {
            mouseUp(e, chart);
        });

        // Add cleanup to make sure we don't pollute document
        addEvent(chart, 'destroy', function () {
            if (chart.unbindDragDropMouseUp) {
                chart.unbindDragDropMouseUp();
            }
            if (chart.unbindDragDropTouchEnd) {
                chart.unbindDragDropTouchEnd();
            }
        });
    }
});
