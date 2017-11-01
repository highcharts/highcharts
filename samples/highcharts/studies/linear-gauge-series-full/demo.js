/**
 * (c) 2010-2017 Paweł Dalek
 *
 * License: www.highcharts.com/license
 */

'use strict';
//import H from '../parts/Globals.js';
//import '../parts/Utilities.js';
var H = Highcharts;

var each = H.each,
    pick = H.pick,
    isNumber = H.isNumber,
    addEvent = H.addEvent,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    relativeLength = H.relativeLength,
    columnProto = H.seriesTypes.column.prototype;

H.SVGRenderer.prototype.symbols.target = function (x, y, w, h, bh, i, inverted) {
    return inverted ? [
        'M', x, y,
        'L', -w / 2, -h + bh,
        -w / 2, -h,
        x, -h + i,
        w / 2, -h,
        w / 2, -h + bh,
        'Z'
    ] : [
        'M', x, y,
        'L', -h + bh, w / 2,
        -h, w / 2,
        -h + i, y,
        -h, -w / 2,
        -h + bh, -w / 2,
        'Z'
    ];
};

/**
 * The lineargauge series type.
 *
 * @constructor seriesTypes.lineargauge
 * @augments seriesTypes.column
 */
seriesType('lineargauge', 'column',
    /**
     * A lineargauge graph is used for visualizing data on linear scale
     * within the specific range. It uses special pointers (targets).
     * Mentioned range can be defined by setting
     * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
     *
     * @extends {plotOptions.column}
     * @product highcharts
     * @sample {highcharts} highcharts/demo/lineargauge/ Linearguage graph
     * @since 6.0.0
     * @excluding animationLimit,boostThreshold,edgeColor,edgeWidth,
     *            findNearestPointBy,getExtremesFromAll
     * @optionparent plotOptions.lineargauge
     */
    {
        /**
         * Display target on a point or alongside the `yAxis`.
         *
         * @type {Boolean}
         * @since 6.0.0
         * @default true
         * @product highcharts
         */
        onPoint: true,

        /**
         * Whether to display or hide additional columns along with targets.
         *
         * @type {Boolean}
         * @since 6.0.0
         * @default false
         * @product highcharts
         */
        showColumn: false,

        /**
         * Show additional line coming out of the target.
         *
         * @type {Boolean}
         * @since 6.0.0
         * @default false
         * @product highcharts
         */
        showLine: false,

        /**
         * All options related with look and positiong of targets.
         *
         * @type {Object}
         * @since 6.0.0
         * @product highcharts
         */
        targetOptions: {
            /**
             * The length of the base part of the target (similar to [dial.baseLength](#plotOptions.gauge.dial.baseLength)).
             * Can be pixel value or percentage value based on [length](#plotOptions.lineargauge.targetOptions.length).
             *
             * @type {Number|String}
             * @since 6.0.0
             * @default '50%'
             * @product highcharts
             */
            baseLength: '50%',

            /*= if (build.classic) { =*/
            /**
             * The border color of the symbol representing the target. When
             * not set, point's border color is used.
             *
             * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
             *
             * @type {Color}
             * @since 6.0.0
             * @product highcharts
             * @apioption plotOptions.lineargauge.targetOptions.borderColor
             */

            /**
             * The border width of the symbol representing the target. When
             * not set, point's border width is used.
             *
             * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
             *
             * @type {Number}
             * @since 6.0.0
             * @product highcharts
             * @apioption plotOptions.lineargauge.targetOptions.borderWidth
             */

            /**
             * The color of the symbol representing the target. When
             * not set, point's color is used.
             *
             * In styled mode, target color can be set with the `.highcharts-lineargauge-target-symbol` class.
             *
             * @type {Color}
             * @since 6.0.0
             * @product highcharts
             * @apioption plotOptions.lineargauge.targetOptions.color
             */
            /*= } =*/

            /**
             * The indentation on the upper part of the target symbol.
             *
             * Can be pixel value or percentage value based on [length](#plotOptions.lineargauge.targetOptions.length).
             *
             * @type {Number|String}
             * @since 6.0.0
             * @default '20%'
             * @product highcharts
             */
            indent: '20%',

            /*= if (build.classic) { =*/
            /**
             * The color of the additional target line. When
             * not set, point's border color is used.
             *
             * In styled mode, target color can be set with the `.highcharts-lineargauge-target-line` class.
             *
             * @type {Color}
             * @since 6.0.0
             * @product highcharts
             * @apioption plotOptions.lineargauge.targetOptions.lineColor
             */

            /**
             * The width of the additional target line. When
             * not set, point's border width is used.
             *
             * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-line` class.
             *
             * @type {Number}
             * @since 6.0.0
             * @product highcharts
             * @apioption plotOptions.lineargauge.targetOptions.lineWidth
             */
            /*= } =*/

            /**
             * The zIndex of the target line.
             *
             * @type {Number}
             * @since 6.0.0
             * @default 1
             * @product highcharts
             */
            lineZIndex: 1,

            /**
             * The total length of the target.
             * Can be pixel value or percentage value based on column point's width.
             *
             * @type {Number|String}
             * @since 6.0.0
             * @default '50%'
             * @product highcharts
             */
            length: '50%',

            /**
             * The width of the target.
             * Can be pixel value or percentage value based on column point's width.
             *
             * @type {Number|String}
             * @since 6.0.0
             * @default '50%'
             * @product highcharts
             */
            width: '50%',

            /**
             * The zIndex of the target symbol.
             *
             * @type {Number}
             * @since 6.0.0
             * @default 3
             * @product highcharts
             */
            zIndex: 3
        }
    }, {
        /**
         * Function responsible for creating or updating target symbol and target line.
         */
        createUpdateGraphic: function (graphic, path, xPosition, yPosition, beginningAtrr, endAttr) {
            var series = this,
                chart = series.chart,
                seriesOptions = series.options,
                updateGraphic = chart.pointCount < (seriesOptions.animationLimit || 250) ? 'animate' : 'attr';

            if (graphic) {
                graphic[updateGraphic]({
                    d: path,
                    translateX: xPosition,
                    translateY: yPosition
                });
            } else {
                graphic = chart.renderer.path(path)
                    .attr(beginningAtrr)
                    .add();

                graphic[updateGraphic](endAttr, pick(seriesOptions.animation, { duration: 1000 }));
            }

            return graphic;
        },
        /**
         * The target symbol and line is created for each point and added to it. Inverting
         * chart and reversing axes are taken into account in calculating their position on chart.
         * This method is based on column series drawPoints function.
         */
        drawPoints: function () {
            var series = this,
                points = series.points,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                xAxisLength = xAxis.len,
                yAxisLength = yAxis.len,
                yAxisReversed = yAxis.reversed,
                chart = series.chart,
                plotTop = chart.plotTop,
                plotLeft = chart.plotLeft,
                tooltip = chart.tooltip,
                renderer = chart.renderer,
                inverted = chart.inverted,
                seriesOptions = series.options,
                minPointLength = seriesOptions.minPointLength,
                seriesTargetOptions = seriesOptions.targetOptions,
                shape = seriesTypes[series.type].prototype.pointClass.prototype.shape;

            columnProto.drawPoints.apply(series);

            each(points, function (point) {
                var targetSymGraphic = point.targetSymGraphic,
                    targetLinGraphic = point.targetLinGraphic,
                    pointOptions = point.options,
                    pointTargetOptions = pointOptions.targetOptions || {},
                    dataLabel = point.dataLabel,
                    valueX = point.x,
                    valueY = point.y,
                    target = point.target,
                    targetEvents = [],
                    halfPointWidth,
                    dataLabelBox,
                    columnStart,
                    pPlotY,
                    barX,
                    onPoint,
                    showColumn,
                    showLine,
                    baseLength,
                    length,
                    width,
                    indent,
                    symbolPath,
                    linePath,
                    borderWidth,
                    lineWidth,
                    lineZIndex,
                    zIndex,
                    shapeArgs,
                    shapeArgsWidth,
                    beginningAtrr,
                    offsetOnPoint,
                    xAttr,
                    yAttr,
                    xPosition,
                    yPosition,
                    pixelX,
                    pixelY;

                if (isNumber(valueY) && valueY !== null) {
                    halfPointWidth = point.pointWidth / 2;
                    pPlotY = point.plotY;
                    barX = point.barX;

                    pixelX = inverted ? xAxisLength - barX - halfPointWidth + plotTop : barX + halfPointWidth + plotLeft;
                    pixelY = target ? yAxis.toPixels(target, false) : yAxis.toPixels(valueY, false);

                    if (inverted) {
                        // Considering minPointLength when chart is inverted
                        if (minPointLength) {
                            if (!yAxisReversed) {
                                if (pixelY < (minPointLength + plotLeft)) {
                                    pixelY = minPointLength + plotLeft;
                                }
                            } else {
                                if (pPlotY < minPointLength) {
                                    pixelY = yAxisLength - minPointLength + plotLeft;
                                }
                            }
                        }
                    } else {
                        // Considering minPointLength when chart is not inverted
                        if (minPointLength) {
                            if (!yAxisReversed) {
                                if ((yAxisLength - pixelY) < (minPointLength - plotTop)) {
                                    pixelY = yAxisLength - minPointLength + plotTop;
                                }
                            } else {
                                if (pPlotY < minPointLength) {
                                    pixelY = minPointLength + plotTop;
                                }
                            }
                        }
                    }

                    shapeArgs = point.shapeArgs;
                    shapeArgsWidth = shapeArgs.width;

                    // The option which controls whether target should display on series or on axis
                    onPoint = pick(pointOptions.onPoint, seriesOptions.onPoint);

                    // Show/hide additional column
                    showColumn = pick(pointOptions.showColumn, seriesOptions.showColumn);

                    // The option which controls whether target should have an additional line
                    showLine = pick(pointOptions.showLine, seriesOptions.showLine);

                    // Total length of a target
                    length = relativeLength(pick(pointTargetOptions.length, seriesTargetOptions.length), shapeArgsWidth);

                    // Total width of a target
                    width = relativeLength(pick(pointTargetOptions.width, seriesTargetOptions.width), shapeArgsWidth);

                    // Border width of a target
                    borderWidth = pick(pointTargetOptions.borderWidth, seriesTargetOptions.borderWidth);

                    // The zIndex of a target symbol
                    zIndex = pick(pointTargetOptions.zIndex, seriesTargetOptions.zIndex);

                    // Width of a target line
                    lineWidth = pick(pointTargetOptions.lineWidth, seriesTargetOptions.lineWidth, seriesOptions.borderWidth, point.borderWidth, 1);

                    // The zIndex of a target line
                    lineZIndex = pick(pointTargetOptions.lineZIndex, seriesTargetOptions.lineZIndex);

                    // Shape for lineargauge series
                    if (shape === 'target') {
                        // Base length of a target
                        baseLength = relativeLength(pick(pointTargetOptions.baseLength, seriesTargetOptions.baseLength), length);

                        // Vertical indent of a target
                        indent = relativeLength(pick(pointTargetOptions.indent, seriesTargetOptions.indent), length);

                        symbolPath = renderer.symbols[shape](0, 0, width, length, baseLength, indent, inverted);
                        symbolPath = renderer.crispLine(symbolPath, borderWidth || 1);
                    } else if (shape === 'rectangle') { // Shape for bullet series
                        onPoint = true;
                        showLine = false;
                        showColumn = true;

                        symbolPath = renderer.symbols[shape](0, 0, width, length, inverted);
                    }

                    if (inverted) {
                        xPosition = pixelY;
                        yPosition = onPoint ? pixelX : xAxis.top;
                    } else {
                        xPosition = onPoint ? pixelX : xAxis.left;
                        yPosition = pixelY;
                    }
                    columnStart = yAxis.toPixels(series.options.threshold, false);

                    xAttr = {
                        translateX: xPosition
                    };

                    yAttr = {
                        translateY: yPosition
                    };

                    // The beginning coordinates
                    beginningAtrr = {
                        translateX: inverted ? columnStart : xPosition,
                        translateY: inverted ? yPosition : columnStart
                    };

                    beginningAtrr.zIndex = zIndex;

                    // Creating/updating target symbol
                    point.targetSymGraphic = targetSymGraphic = series.createUpdateGraphic(targetSymGraphic, symbolPath, xPosition, yPosition, beginningAtrr, (inverted ? xAttr : yAttr));

                    if (showLine) {
                        offsetOnPoint = xAxisLength - (onPoint ? pixelX - (inverted ? plotTop : plotLeft) : 0);

                        linePath = inverted ? ['M', 0, 0, 'L', 0, offsetOnPoint] : ['M', 0, 0, 'L', offsetOnPoint, 0];
                        // linePath = renderer.crispLine(linePath, lineWidth || 1);

                        beginningAtrr.zIndex = lineZIndex;

                        // Creating/updating target line
                        point.targetLinGraphic = targetLinGraphic = series.createUpdateGraphic(targetLinGraphic, linePath, xPosition, yPosition, beginningAtrr, (inverted ? xAttr : yAttr));
                    }

                    if (!showColumn) {
                        point.graphic.hide();

                        if (!onPoint && dataLabel) {
                            dataLabelBox = dataLabel.getBBox();

                            dataLabel.attr(inverted ? {
                                x: yAxis.toPixels(valueY, true) - dataLabelBox.width / 2,
                                y: 0
                            } : {
                                x: 0,
                                y: yAxis.toPixels(valueY, true) - dataLabelBox.height / 2
                            });
                        }
                    }

                    // Adding event to target symbol for handling tooltip
                    if (tooltip) {
                        targetEvents.push(addEvent(targetSymGraphic.element, 'mouseover', function () {
                            point.setState('hover');

                            if (!onPoint) {
                                tooltip.refresh({
                                    plotX: inverted ? xAxisLength : 0,
                                    plotY: point.shapeArgs.y,
                                    series: point.series,
                                    x: valueX,
                                    y: valueY,
                                    category: point.category,
                                    color: point.color,
                                    colorIndex: point.colorIndex,
                                    name: point.name,
                                    percentage: point.percentage,
                                    total: point.total,
                                    stackTotal: point.stackTotal,
                                    getLabelConfig: point.getLabelConfig,
                                    tooltipFormatter: point.tooltipFormatter
                                });
                            } else {
                                tooltip.refresh(point);
                            }
                        }));

                        targetEvents.push(addEvent(targetSymGraphic.element, 'mouseout', function () {
                            point.setState('normal');
                            tooltip.hide();
                        }));

                        series.targetEvents = targetEvents;
                    }

                    /*= if (build.classic) { =*/
                    // Setting style to target symbol
                    targetSymGraphic.attr({
                        fill: pick(
                            pointTargetOptions.color,
                            seriesTargetOptions.color,
                            pointOptions.color,
                            (series.zones.length && (point.getZone.call({
                                series: series,
                                x: valueX,
                                y: valueY,
                                options: {}
                            }).color || series.color)) || undefined,
                            point.color,
                            series.color
                        ),
                        stroke: pick(
                            pointTargetOptions.borderColor,
                            seriesTargetOptions.borderColor,
                            point.borderColor,
                            seriesOptions.borderColor
                        ),
                        'stroke-width': pick(
                            pointTargetOptions.borderWidth,
                            seriesTargetOptions.borderWidth,
                            point.borderWidth,
                            seriesOptions.borderWidth
                        )
                    });

                    // Setting style to target line, if exists
                    if (showLine) {
                        targetLinGraphic.attr({
                            stroke: pick(
                                pointTargetOptions.lineColor,
                                seriesTargetOptions.lineColor,
                                point.borderColor,
                                seriesOptions.borderColor
                            ),
                            'stroke-width': lineWidth
                        });
                    }
                    /*= } =*/

                    // Add styles
                    if (targetSymGraphic) {
                        targetSymGraphic.addClass(point.getClassName() + ' highcharts-' + series.type + '-target', true);
                    }

                    if (targetLinGraphic) {
                        targetLinGraphic.addClass(point.getClassName() + ' highcharts-lineargauge-target-line', true);
                    }
                } else if (targetSymGraphic) {
                    point.targetSymGraphic = targetSymGraphic.destroy();

                    if (targetLinGraphic) {
                        point.targetLinGraphic = targetLinGraphic.destroy();
                    }
                }
            });
        }
    }, {
        /**
         * Lineargauge shape
         */
        shape: 'target',
        /**
         * Destroys target symbol and line graphics.
         */
        destroy: function () {
            var point = this,
                targetSymGraphic = point.targetSymGraphic,
                targetLinGraphic = point.targetLinGraphic;

            if (targetSymGraphic) {
                targetSymGraphic = targetSymGraphic.destroy();
            }

            if (targetLinGraphic) {
                targetLinGraphic = targetLinGraphic.destroy();
            }

            // Deleting target events
            each(point.series.targetEvents, function (targetEvent) {
                targetEvent();
            });

            columnProto.pointClass.prototype.destroy.apply(point, arguments);
        }
    });

/**
 * A `lineargauge` series. If the [type](#series.lineargauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * lineargauge](#plotOptions.lineargauge).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.lineargauge
 * @excluding dataParser,dataURL
 * @product highcharts
 * @apioption series.lineargauge
 */

/**
 * Display individual target on a point or alongside the `yAxis`.
 *
 * @type {Boolean}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.onPoint
 */

/**
 * Whether to display or hide individual additional column along with the target.
 *
 * @type {Boolean}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.showColumn
 */

/**
 * Show individual additional line coming out of the target.
 *
 * @type {Boolean}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.showLine
 */

/**
 * Individual length of the base part of the target (similar to [dial.baseLength](#plotOptions.gauge.dial.baseLength)).
 * Can be pixel value or percentage value based on [length](#plotOptions.lineargauge.targetOptions.length).
 *
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.baseLength
 */

/*= if (build.classic) { =*/
/**
 * Individual border color of the symbol representing the target. When
 * not set, point's border color is used.
 *
 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
 *
 * @type {Color}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.borderColor
 */

/**
 * Individual border width of the symbol representing the target. When
 * not set, point's border width is used.
 *
 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-symbol` class.
 *
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.borderWidth
 */

/**
 * Individual color of the symbol representing the target. When
 * not set, point's color is used.
 *
 * In styled mode, target color can be set with the `.highcharts-lineargauge-target-symbol` class.
 *
 * @type {Color}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.color
 */
/*= } =*/

/**
 * Individual indentation on the upper part of the target symbol.
 *
 * Can be pixel value or percentage value based on [length](#plotOptions.lineargauge.targetOptions.length).
 *
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.indent
 */

/*= if (build.classic) { =*/
/**
 * Individual color of the additional target line. When
 * not set, point's border color is used.
 *
 * In styled mode, target color can be set with the `.highcharts-lineargauge-target-line` class.
 *
 * @type {Color}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.lineColor
 */

/**
 * Individual width of the additional target line. When
 * not set, point's border width is used.
 *
 * In styled mode, target border color can be set with the `.highcharts-lineargauge-target-line` class.
 *
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.lineWidth
 */
/*= } =*/

/**
 * The zIndex of individual target line.
 *
 * @type {Number}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.lineZIndex
 */

/**
 * Individual total length of the target.
 * Can be pixel value or percentage value based on column point's width.
 *
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.length
 */

/**
 * Individual width of the target.
 * Can be pixel value or percentage value based on column point's width.
 *
 * @type {Number|String}
 * @since 6.0.0
 * @product highcharts
 * @apioption series.lineargauge.data.targetOptions.width
 */

 /**
  * The zIndex of the target symbol.
  *
  * @type {Number}
  * @since 6.0.0
  * @product highcharts
  * @apioption series.lineargauge.data.targetOptions.zIndex
  */

////////////////////////////////////////////////////////////////////////////////

// Common options options for all the gauges
var commonOptions = {
    chart: {
        inverted: true,
        type: 'lineargauge',
        marginLeft: 20,
        plotBorderWidth: 0.5
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: true
    },
    legend: {
        enabled: false
    },
    xAxis: {
        tickWidth: 0,
        lineWidth: 0,
        labels: {
            enabled: false
        }
    },
    yAxis: {
        min: 0,
        max: 100,
        tickInterval: 10,
        tickLength: 10,
        tickWidth: 1,
        minorGridLineWidth: 0,
        minorTickInterval: 'auto',
        minorTickLength: 5,
        minorTickWidth: 1,
        title: {
            text: ''
        }
    },
    plotOptions: {
        series: {
            pointPadding: 0,
            borderWidth: 1,
            borderColor: '#FFFFFF',
            color: '#000000',
            targetOptions: {
                length: '150%',
                width: '100%',
                baseLength: '0%',
                indent: '20%',
                lineWidth: 1,
                lineZIndex: 1
            },
            dataLabels: {
                enabled: true
            }
        }
    }
};

Highcharts.chart('container1', Highcharts.merge(commonOptions, {
    title: {
        text: 'Target on axis, with line enabled, column disabled'
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#666'
        }, {
            from: 20,
            to: 70,
            color: '#999'
        }, {
            from: 70,
            to: 100,
            color: '#bbb'
        }]
    },
    series: [{
        onPoint: false,
        showColumn: false,
        showLine: true,
        data: [85]
    }]
}));

Highcharts.chart('container2', Highcharts.merge(commonOptions, {
    title: {
        text: 'Target on point, with line disabled, column disabled'
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#666'
        }, {
            from: 20,
            to: 70,
            color: '#999'
        }, {
            from: 70,
            to: 100,
            color: '#bbb'
        }]
    },
    series: [{
        onPoint: true,
        showColumn: false,
        showLine: false,
        data: [36]
    }]
}));

Highcharts.chart('container3', Highcharts.merge(commonOptions, {
    title: {
        text: 'Target on point, with line disabled, column enabled'
    },
    yAxis: {
        plotBands: [{
            from: 0,
            to: 20,
            color: '#666'
        }, {
            from: 20,
            to: 70,
            color: '#999'
        }, {
            from: 70,
            to: 100,
            color: '#bbb'
        }]
    },
    series: [{
        onPoint: true,
        showColumn: true,
        showLine: false,
        data: [73]
    }]
}));