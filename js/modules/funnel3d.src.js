/**
 * Highcharts funnel3d series module
 *
 * (c) 2010-2019 Highsoft AS
 * Author: Kacper Madej
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/ColumnSeries.js';
import '../parts/SvgRenderer.js';

var charts = H.charts,
    color = H.color,
    error = H.error,
    extend = H.extend,
    seriesType = H.seriesType,
    relativeLength = H.relativeLength,

    // Use H.Renderer instead of H.SVGRenderer for VML support.
    RendererProto = H.Renderer.prototype,

    cuboidPath = RendererProto.cuboidPath,
    funnel3dMethods;

/**
 * The funnel3d series type.
 *
 * Requires `highcharts-3d.js`, `cylinder.js` and `funnel3d.js` module.
 *
 * @constructor seriesTypes.funnel3d
 * @augments seriesTypes.column
 */
seriesType('funnel3d', 'column',
    /**
     * A funnel3d is a 3d version of funnel series type. Funnel charts are
     * a type of chart often used to visualize stages in a sales project,
     * where the top are the initial stages with the most clients.
     *
     * It requires that the `highcharts-3d.js`, `cylinder.js` and
     * `funnel3d.js` module are loaded.
     *
     * @extends      {plotOptions.column}
     * @product      highcharts
     * @sample       {highcharts} highcharts/demo/funnel3d/ Funnel3d
     * @since        7.1.0
     * @excluding    allAreas,boostThreshold,colorAxis,compare,compareBase
     * @optionparent plotOptions.cylinder
     */
    {
        /** @ignore-option */
        center: ['50%', '50%'],

        /**
         * The max width of the series compared to the width of the plot area,
         * or the pixel width if it is a number.
         *
         * @type    {Number|String}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        width: '90%',

        /**
         * The width of the neck, the lower part of the funnel. A number defines
         * pixel width, a percentage string defines a percentage of the plot
         * area width.
         *
         * @type    {Number|String}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        neckWidth: '30%',

        /**
         * The height of the series. If it is a number it defines
         * the pixel height, if it is a percentage string it is the percentage
         * of the plot area height.
         *
         * @type    {Number|String}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @since   3.0
         * @product highcharts
         */
        height: '100%',

        /**
         * The height of the neck, the lower part of the funnel. A number
         * defines pixel width, a percentage string defines a percentage
         * of the plot area height.
         *
         * @type    {Number|String}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        neckHeight: '25%',

        /**
         * A reversed funnel has the widest area down. A reversed funnel with
         * no neck width and neck height is a pyramid.
         *
         * @product highcharts
         */
        reversed: false,

        animation: false,
        colorByPoint: true,
        showInLegend: false,
        tooltip: {
            followPointer: true
        }
    }, {
        // Override default axis options with series required options for axes
        bindAxes: function () {
            H.Series.prototype.bindAxes.apply(this, arguments);

            extend(this.xAxis.options, {
                gridLineWidth: 0,
                lineWidth: 0,
                title: null,
                tickPositions: []
            });
            extend(this.yAxis.options, {
                gridLineWidth: 0,
                title: null,
                labels: {
                    enabled: false
                }
            });
        },

        translate3dShapes: H.noop,

        translate: function () {
            H.Series.prototype.translate.apply(this, arguments);

            var sum = 0,
                series = this,
                chart = series.chart,
                options = series.options,
                reversed = options.reversed,
                ignoreHiddenPoint = options.ignoreHiddenPoint,
                plotWidth = chart.plotWidth,
                plotHeight = chart.plotHeight,
                cumulative = 0, // start at top
                center = options.center,
                centerX = relativeLength(center[0], plotWidth),
                centerY = relativeLength(center[1], plotHeight),
                width = relativeLength(options.width, plotWidth),
                tempWidth,
                getWidthAt,
                height = relativeLength(options.height, plotHeight),
                neckWidth = relativeLength(options.neckWidth, plotWidth),
                neckHeight = relativeLength(options.neckHeight, plotHeight),
                neckY = (centerY - height / 2) + height - neckHeight,
                data = series.data,
                fraction,
                half = options.dataLabels.position === 'left' ? 1 : 0,
                tooltipPos,

                y1,
                y3,
                y5,

                h,
                shapeArgs = {};

            // Return the width at a specific y coordinate
            series.getWidthAt = getWidthAt = function (y) {
                var top = (centerY - height / 2);

                return (y > neckY || height === neckHeight) ?
                    neckWidth :
                    neckWidth + (width - neckWidth) *
                        (1 - (y - top) / (height - neckHeight));
            };
            series.getX = function (y, half, point) {
                return centerX + (half ? -1 : 1) *
                    ((getWidthAt(reversed ? 2 * centerY - y : y) / 2) +
                    point.labelDistance);
            };

            // Expose
            series.center = [centerX, centerY, height];
            series.centerX = centerX;

            /*
             * Individual point coordinate naming:
             *
             * x1,y1 _________________ x2,y1
             *  \                         /
             *   \                       /
             *    \                     /
             *     \                   /
             *      \                 /
             *     x3,y3 _________ x4,y3
             *
             * Additional for the base of the neck:
             *
             *       |               |
             *       |               |
             *       |               |
             *     x3,y5 _________ x4,y5
             */

            // get the total sum
            data.forEach(function (point) {
                if (!ignoreHiddenPoint || point.visible !== false) {
                    sum += point.y;
                }
            });

            data.forEach(function (point) {
                // set start and end positions
                y5 = null;
                fraction = sum ? point.y / sum : 0;
                y1 = centerY - height / 2 + cumulative * height;
                y3 = y1 + fraction * height;
                tempWidth = getWidthAt(y1);
                h = y3 - y1;
                shapeArgs = {
                    x: centerX,
                    y: y1,
                    height: h,
                    width: tempWidth,
                    z: 1,
                    top: {
                        width: tempWidth
                    }
                };
                tempWidth = getWidthAt(y3);
                shapeArgs.bottom = {
                    fraction: fraction,
                    width: tempWidth
                };

                // the entire point is within the neck
                if (y1 >= neckY) {
                    shapeArgs.isCylinder = true;
                } else if (y3 > neckY) {
                    // the base of the neck
                    y5 = y3;
                    tempWidth = getWidthAt(neckY);
                    y3 = neckY;

                    shapeArgs.bottom.width = tempWidth;
                    shapeArgs.middle = {
                        fraction: h ? (neckY - y1) / h : 0,
                        width: tempWidth
                    };
                }

                if (reversed) {
                    shapeArgs.y = y1 = centerY + height / 2 -
                        (cumulative + fraction) * height;

                    if (shapeArgs.middle) {
                        shapeArgs.middle.fraction = h ?
                            1 - shapeArgs.middle.fraction :
                            1;
                    }
                    tempWidth = shapeArgs.width;
                    shapeArgs.width = shapeArgs.bottom.width;
                    shapeArgs.bottom.width = tempWidth;
                }
                point.shapeArgs = extend(point.shapeArgs, shapeArgs);

                // for tooltips and data labels
                point.percentage = fraction * 100;
                point.plotX = centerX;
                point.plotY = (y1 + (y5 || y3)) / 2;

                // Placement of tooltips and data labels in 3D
                tooltipPos = H.perspective([{
                    x: centerX,
                    y: point.plotY,
                    z: 1
                }], chart, true)[0];
                point.tooltipPos = [tooltipPos.x, tooltipPos.y];

                // Slice is a noop on funnel points
                point.slice = H.noop;

                // Mimicking pie data label placement logic
                point.half = half;

                if (!ignoreHiddenPoint || point.visible !== false) {
                    cumulative += fraction;
                }
            });
        }
    }, /** @lends seriesTypes.funnel3d.prototype.pointClass.prototype */ {
        shapeType: 'funnel3d'
    });

/**
 * A `funnel3d` series. If the [type](#series.funnel3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @since     7.0.0
 * @extends   series,plotOptions.funnel3d
 * @excluding allAreas,boostThreshold,colorAxis,compare,compareBase
 * @product   highcharts
 * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
 * @apioption series.funnel3d
 */

/**
 * An array of data points for the series. For the `funnel3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.funnel3d.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         y: 2,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         y: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<number>|*>}
 * @extends   series.funnel3d.data
 * @product   highcharts
 * @apioption series.funnel3d.data
 */

funnel3dMethods = H.merge(RendererProto.elements3d.cuboid, {
    parts: [
        'top', 'bottom',
        'frontUpper', 'backUpper',
        'frontLower', 'backLower',
        'rightUpper', 'rightLower'
    ],
    mainParts: ['top', 'bottom'],
    sideGroups: [
        'upperGroup', 'lowerGroup'
    ],
    pathType: 'funnel3d',

    // override opacity and color setters to control opacity
    opacitySetter: function (opacity) {
        var funnel3d = this,
            parts = funnel3d.parts,
            chart = H.charts[funnel3d.renderer.chartIndex],
            filterId = 'group-opacity-' + opacity + '-' + chart.index;

        // use default for top and bottom
        funnel3d.parts = funnel3d.mainParts;
        funnel3d.singleSetterForParts('opacity', opacity);

        // restore
        funnel3d.parts = parts;

        if (!chart.renderer.filterId) {

            chart.renderer.definition({
                tagName: 'filter',
                id: filterId,

                children: [{
                    tagName: 'feComponentTransfer',
                    children: [{
                        tagName: 'feFuncA',
                        type: 'table',
                        tableValues: '0 ' + opacity
                    }]
                }]
            });
            funnel3d.sideGroups.forEach(function (groupName) {
                funnel3d[groupName].attr({
                    filter: 'url(#' + filterId + ')'
                });
            });

            // styled mode
            if (funnel3d.renderer.styledMode) {
                chart.renderer.definition({
                    tagName: 'style',
                    textContent: '.highcharts-' + filterId +
                        ' {filter:url(#' + filterId + ')}'
                });

                funnel3d.sideGroups.forEach(function (group) {
                    group.addClass('highcharts-' + filterId);
                });
            }
        }

        return funnel3d;
    },

    fillSetter: function (fill) {
        // extract alpha channel to use the opacitySetter
        var fillColor = color(fill),
            alpha = fillColor.rgba[3];

        if (alpha < 1) {
            fillColor.rgba[3] = 1;
            fillColor = fillColor.get('rgb');

            // set opacity through the opacitySetter
            this.attr({
                opacity: alpha
            });
        } else {
            // use default for full opacity or gradients
            fillColor = fill;
        }

        this.singleSetterForParts('fill', null, {
            frontUpper: fillColor,
            backUpper: fillColor,
            rightUpper: fillColor,
            frontLower: fillColor,
            backLower: fillColor,
            rightLower: fillColor,

            // standard color for top and bottom
            top: color(fill).brighten(0.1).get(),
            bottom: color(fill).brighten(-0.1).get()
        });

        // fill for animation getter (#6776)
        this.color = this.fill = fill;

        return this;
    }
});

RendererProto.elements3d.funnel3d = funnel3dMethods;

RendererProto.funnel3d = function (shapeArgs) {
    var renderer = this,
        funnel3d = renderer.element3d('funnel3d', shapeArgs);

    // create groups for sides for oppacity setter
    funnel3d.upperGroup = renderer.g('funnel3d-upper-group').attr({
        zIndex: funnel3d.frontUpper.zIndex
    }).add(funnel3d);

    [
        funnel3d.frontUpper,
        funnel3d.backUpper,
        funnel3d.rightUpper
    ].forEach(function (upperElem) {
        upperElem.add(funnel3d.upperGroup);
    });

    funnel3d.lowerGroup = renderer.g('funnel3d-lower-group').attr({
        zIndex: funnel3d.frontLower.zIndex
    }).add(funnel3d);

    [
        funnel3d.frontLower,
        funnel3d.backLower,
        funnel3d.rightLower
    ].forEach(function (lowerElem) {
        lowerElem.add(funnel3d.lowerGroup);
    });

    return funnel3d;
};

/**
 * Generates paths and zIndexes.
 */
RendererProto.funnel3dPath = function (shapeArgs) {
    // Check getCylinderEnd for better error message if
    // the cylinder module is missing
    if (!this.getCylinderEnd) {
        error(
            'A required Highcharts module is missing: cylinder.js',
            true,
            charts[this.chartIndex]
        );
    }

    var renderer = this,
        chart = charts[renderer.chartIndex],

        // adjust angles for visible edges
        // based on alpha, selected through visual tests
        alphaCorrection = shapeArgs.alphaCorrection = 90 -
            Math.abs((chart.options.chart.options3d.alpha % 180) - 90),

        // set zIndexes of parts based on cubiod logic, for consistency
        cuboidData = cuboidPath.call(renderer, H.merge(shapeArgs, {
            depth: shapeArgs.width,
            width: (shapeArgs.width + shapeArgs.bottom.width) / 2
        })),
        isTopFirst = cuboidData.isTop,
        isFrontFirst = !cuboidData.isFront,
        hasMiddle = !!shapeArgs.middle,

        top = renderer.getCylinderEnd(
            chart,
            H.merge(shapeArgs, {
                x: shapeArgs.x - shapeArgs.width / 2,
                z: shapeArgs.z - shapeArgs.width / 2,
                alphaCorrection: alphaCorrection
            })
        ),
        bottomWidth = shapeArgs.bottom.width,
        bottomArgs = H.merge(shapeArgs, {
            width: bottomWidth,
            x: shapeArgs.x - bottomWidth / 2,
            z: shapeArgs.z - bottomWidth / 2,
            alphaCorrection: alphaCorrection
        }),
        bottom = renderer.getCylinderEnd(chart, bottomArgs, true),

        middleWidth = bottomWidth,
        middleTopArgs = bottomArgs,
        middleTop = bottom,
        middleBottom = bottom,
        ret,

        // masking for cylinders or a missing part of a side shape
        useAlphaCorrection;

    if (hasMiddle) {
        middleWidth = shapeArgs.middle.width;
        middleTopArgs = H.merge(shapeArgs, {
            y: shapeArgs.y + shapeArgs.middle.fraction * shapeArgs.height,
            width: middleWidth,
            x: shapeArgs.x - middleWidth / 2,
            z: shapeArgs.z - middleWidth / 2
        });
        middleTop = renderer.getCylinderEnd(chart, middleTopArgs, false);

        middleBottom = renderer.getCylinderEnd(
            chart,
            middleTopArgs,
            false
        );
    }

    ret = {
        top: top,
        bottom: bottom,
        frontUpper: renderer.getCylinderFront(top, middleTop),
        zIndexes: {
            group: cuboidData.zIndexes.group,
            top: isTopFirst !== 0 ? 0 : 3,
            bottom: isTopFirst !== 1 ? 0 : 3,
            frontUpper: isFrontFirst ? 2 : 1,
            backUpper: isFrontFirst ? 1 : 2,
            rightUpper: isFrontFirst ? 2 : 1
        }
    };

    ret.backUpper = renderer.getCylinderBack(top, middleTop);
    useAlphaCorrection = (Math.min(middleWidth, shapeArgs.width) /
        Math.max(middleWidth, shapeArgs.width)) !== 1;

    ret.rightUpper = renderer.getCylinderFront(
        renderer.getCylinderEnd(
            chart,
            H.merge(shapeArgs, {
                x: shapeArgs.x - shapeArgs.width / 2,
                z: shapeArgs.z - shapeArgs.width / 2,
                alphaCorrection: useAlphaCorrection ? -alphaCorrection : 0
            }),
            false
        ),
        renderer.getCylinderEnd(
            chart,
            H.merge(middleTopArgs, {
                alphaCorrection: useAlphaCorrection ? -alphaCorrection : 0
            }),
            !hasMiddle
        )
    );

    if (hasMiddle) {
        useAlphaCorrection = (Math.min(middleWidth, bottomWidth) /
            Math.max(middleWidth, bottomWidth)) !== 1;

        H.merge(true, ret, {
            frontLower: renderer.getCylinderFront(middleBottom, bottom),
            backLower: renderer.getCylinderBack(middleBottom, bottom),
            rightLower: renderer.getCylinderFront(
                renderer.getCylinderEnd(
                    chart,
                    H.merge(bottomArgs, {
                        alphaCorrection: useAlphaCorrection ?
                            -alphaCorrection : 0
                    }),
                    true
                ),
                renderer.getCylinderEnd(
                    chart,
                    H.merge(middleTopArgs, {
                        alphaCorrection: useAlphaCorrection ?
                            -alphaCorrection : 0
                    }),
                    false
                )
            ),
            zIndexes: {
                frontLower: isFrontFirst ? 2 : 1,
                backLower: isFrontFirst ? 1 : 2,
                rightLower: isFrontFirst ? 1 : 2
            }
        });
    }

    return ret;
};
