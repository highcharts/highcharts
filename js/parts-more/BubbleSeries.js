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
 * @typedef {"area"|"width"} Highcharts.BubbleSizeByValue
 */
import U from '../parts/Utilities.js';
var arrayMax = U.arrayMax, arrayMin = U.arrayMin, extend = U.extend, isNumber = U.isNumber, pick = U.pick, pInt = U.pInt;
import '../parts/Axis.js';
import '../parts/Color.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/ScatterSeries.js';
import './BubbleLegend.js';
var Axis = H.Axis, color = H.color, noop = H.noop, Point = H.Point, Series = H.Series, seriesType = H.seriesType, seriesTypes = H.seriesTypes;
/**
 * A bubble series is a three dimensional series type where each point renders
 * an X, Y and Z value. Each points is drawn as a bubble where the position
 * along the X and Y axes mark the X and Y values, and the size of the bubble
 * relates to the Z value.
 *
 * @sample {highcharts} highcharts/demo/bubble/
 *         Bubble chart
 *
 * @extends      plotOptions.scatter
 * @product      highcharts highstock
 * @requires     highcharts-more
 * @optionparent plotOptions.bubble
 */
seriesType('bubble', 'scatter', {
    dataLabels: {
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        formatter: function () {
            return this.point.z;
        },
        /** @ignore-option */
        inside: true,
        /** @ignore-option */
        verticalAlign: 'middle'
    },
    /**
     * If there are more points in the series than the `animationLimit`, the
     * animation won't run. Animation affects overall performance and doesn't
     * work well with heavy data series.
     *
     * @since 6.1.0
     */
    animationLimit: 250,
    /**
     * Whether to display negative sized bubbles. The threshold is given
     * by the [zThreshold](#plotOptions.bubble.zThreshold) option, and negative
     * bubbles can be visualized by setting
     * [negativeColor](#plotOptions.bubble.negativeColor).
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-negative/
     *         Negative bubbles
     *
     * @type      {boolean}
     * @default   true
     * @since     3.0
     * @apioption plotOptions.bubble.displayNegative
     */
    /**
     * @extends   plotOptions.series.marker
     * @excluding enabled, enabledThreshold, height, radius, width
     */
    marker: {
        lineColor: null,
        lineWidth: 1,
        /**
         * The fill opacity of the bubble markers.
         */
        fillOpacity: 0.5,
        /**
         * In bubble charts, the radius is overridden and determined based on
         * the point's data value.
         *
         * @ignore-option
         */
        radius: null,
        states: {
            hover: {
                radiusPlus: 0
            }
        },
        /**
         * A predefined shape or symbol for the marker. Possible values are
         * "circle", "square", "diamond", "triangle" and "triangle-down".
         *
         * Additionally, the URL to a graphic can be given on the form
         * `url(graphic.png)`. Note that for the image to be applied to exported
         * charts, its URL needs to be accessible by the export server.
         *
         * Custom callbacks for symbol path generation can also be added to
         * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
         * used by its method name, as shown in the demo.
         *
         * @sample     {highcharts} highcharts/plotoptions/bubble-symbol/
         *             Bubble chart with various symbols
         * @sample     {highcharts} highcharts/plotoptions/series-marker-symbol/
         *             General chart with predefined, graphic and custom markers
         *
         * @type  {Highcharts.SymbolKeyValue|string}
         * @since 5.0.11
         */
        symbol: 'circle'
    },
    /**
     * Minimum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the `z` value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-size/
     *         Bubble size
     *
     * @type    {number|string}
     * @since   3.0
     * @product highcharts highstock
     */
    minSize: 8,
    /**
     * Maximum bubble size. Bubbles will automatically size between the
     * `minSize` and `maxSize` to reflect the `z` value of each bubble.
     * Can be either pixels (when no unit is given), or a percentage of
     * the smallest one of the plot width and height.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-size/
     *         Bubble size
     *
     * @type    {number|string}
     * @since   3.0
     * @product highcharts highstock
     */
    maxSize: '20%',
    /**
     * When a point's Z value is below the
     * [zThreshold](#plotOptions.bubble.zThreshold) setting, this color is used.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-negative/
     *         Negative bubbles
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.bubble.negativeColor
     */
    /**
     * Whether the bubble's value should be represented by the area or the
     * width of the bubble. The default, `area`, corresponds best to the
     * human perception of the size of each bubble.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-sizeby/
     *         Comparison of area and size
     *
     * @type       {Highcharts.BubbleSizeByValue}
     * @default    area
     * @since      3.0.7
     * @apioption  plotOptions.bubble.sizeBy
     */
    /**
     * When this is true, the absolute value of z determines the size of
     * the bubble. This means that with the default `zThreshold` of 0, a
     * bubble of value -1 will have the same size as a bubble of value 1,
     * while a bubble of value 0 will have a smaller size according to
     * `minSize`.
     *
     * @sample    {highcharts} highcharts/plotoptions/bubble-sizebyabsolutevalue/
     *            Size by absolute value, various thresholds
     *
     * @type      {boolean}
     * @default   false
     * @since     4.1.9
     * @product   highcharts
     * @apioption plotOptions.bubble.sizeByAbsoluteValue
     */
    /**
     * When this is true, the series will not cause the Y axis to cross
     * the zero plane (or [threshold](#plotOptions.series.threshold) option)
     * unless the data actually crosses the plane.
     *
     * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
     * 3 will make the Y axis show negative values according to the `minPadding`
     * option. If `softThreshold` is `true`, the Y axis starts at 0.
     *
     * @since   4.1.9
     * @product highcharts
     */
    softThreshold: false,
    states: {
        hover: {
            halo: {
                size: 5
            }
        }
    },
    tooltip: {
        pointFormat: '({point.x}, {point.y}), Size: {point.z}'
    },
    turboThreshold: 0,
    /**
     * The minimum for the Z value range. Defaults to the highest Z value
     * in the data.
     *
     * @see [zMin](#plotOptions.bubble.zMin)
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-zmin-zmax/
     *         Z has a possible range of 0-100
     *
     * @type      {number}
     * @since     4.0.3
     * @product   highcharts
     * @apioption plotOptions.bubble.zMax
     */
    /**
     * @default   z
     * @apioption plotOptions.bubble.colorKey
     */
    /**
     * The minimum for the Z value range. Defaults to the lowest Z value
     * in the data.
     *
     * @see [zMax](#plotOptions.bubble.zMax)
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-zmin-zmax/
     *         Z has a possible range of 0-100
     *
     * @type      {number}
     * @since     4.0.3
     * @product   highcharts
     * @apioption plotOptions.bubble.zMin
     */
    /**
     * When [displayNegative](#plotOptions.bubble.displayNegative) is `false`,
     * bubbles with lower Z values are skipped. When `displayNegative`
     * is `true` and a [negativeColor](#plotOptions.bubble.negativeColor)
     * is given, points with lower Z is colored.
     *
     * @sample {highcharts} highcharts/plotoptions/bubble-negative/
     *         Negative bubbles
     *
     * @since   3.0
     * @product highcharts
     */
    zThreshold: 0,
    zoneAxis: 'z'
    // Prototype members
}, {
    pointArrayMap: ['y', 'z'],
    parallelArrays: ['x', 'y', 'z'],
    trackerGroups: ['group', 'dataLabelsGroup'],
    specialGroup: 'group',
    bubblePadding: true,
    zoneAxis: 'z',
    directTouch: true,
    isBubble: true,
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    pointAttribs: function (point, state) {
        var markerOptions = this.options.marker, fillOpacity = markerOptions.fillOpacity, attr = Series.prototype.pointAttribs.call(this, point, state);
        if (fillOpacity !== 1) {
            attr.fill = color(attr.fill)
                .setOpacity(fillOpacity)
                .get('rgba');
        }
        return attr;
    },
    /**
     * Get the radius for each point based on the minSize, maxSize and each
     * point's Z value. This must be done prior to Series.translate because
     * the axis needs to add padding in accordance with the point sizes.
     * @private
     */
    getRadii: function (zMin, zMax, series) {
        var len, i, zData = this.zData, yData = this.yData, minSize = series.minPxSize, maxSize = series.maxPxSize, radii = [], value;
        // Set the shape type and arguments to be picked up in drawPoints
        for (i = 0, len = zData.length; i < len; i++) {
            value = zData[i];
            // Separate method to get individual radius for bubbleLegend
            radii.push(this.getRadius(zMin, zMax, minSize, maxSize, value, yData[i]));
        }
        this.radii = radii;
    },
    /**
     * Get the individual radius for one point.
     * @private
     */
    getRadius: function (zMin, zMax, minSize, maxSize, value, yValue) {
        var options = this.options, sizeByArea = options.sizeBy !== 'width', zThreshold = options.zThreshold, zRange = zMax - zMin, pos = 0.5;
        // #8608 - bubble should be visible when z is undefined
        if (yValue === null || value === null) {
            return null;
        }
        if (isNumber(value)) {
            // When sizing by threshold, the absolute value of z determines
            // the size of the bubble.
            if (options.sizeByAbsoluteValue) {
                value = Math.abs(value - zThreshold);
                zMax = zRange = Math.max(zMax - zThreshold, Math.abs(zMin - zThreshold));
                zMin = 0;
            }
            // Issue #4419 - if value is less than zMin, push a radius that's
            // always smaller than the minimum size
            if (value < zMin) {
                return minSize / 2 - 1;
            }
            // Relative size, a number between 0 and 1
            if (zRange > 0) {
                pos = (value - zMin) / zRange;
            }
        }
        if (sizeByArea && pos >= 0) {
            pos = Math.sqrt(pos);
        }
        return Math.ceil(minSize + pos * (maxSize - minSize)) / 2;
    },
    /**
     * Perform animation on the bubbles
     * @private
     */
    animate: function (init) {
        if (!init &&
            this.points.length < this.options.animationLimit // #8099
        ) {
            this.points.forEach(function (point) {
                var graphic = point.graphic, animationTarget;
                if (graphic && graphic.width) { // URL symbols don't have width
                    animationTarget = {
                        x: graphic.x,
                        y: graphic.y,
                        width: graphic.width,
                        height: graphic.height
                    };
                    // Start values
                    graphic.attr({
                        x: point.plotX,
                        y: point.plotY,
                        width: 1,
                        height: 1
                    });
                    // Run animation
                    graphic.animate(animationTarget, this.options.animation);
                }
            }, this);
            // delete this function to allow it only once
            this.animate = null;
        }
    },
    /**
     * Define hasData function for non-cartesian series.
     * Returns true if the series has points at all.
     * @private
     */
    hasData: function () {
        return !!this.processedXData.length; // != 0
    },
    /**
     * Extend the base translate method to handle bubble size
     * @private
     */
    translate: function () {
        var i, data = this.data, point, radius, radii = this.radii;
        // Run the parent method
        seriesTypes.scatter.prototype.translate.call(this);
        // Set the shape type and arguments to be picked up in drawPoints
        i = data.length;
        while (i--) {
            point = data[i];
            radius = radii ? radii[i] : 0; // #1737
            if (isNumber(radius) && radius >= this.minPxSize / 2) {
                // Shape arguments
                point.marker = extend(point.marker, {
                    radius: radius,
                    width: 2 * radius,
                    height: 2 * radius
                });
                // Alignment box for the data label
                point.dlBox = {
                    x: point.plotX - radius,
                    y: point.plotY - radius,
                    width: 2 * radius,
                    height: 2 * radius
                };
            }
            else { // below zThreshold
                // #1691
                point.shapeArgs = point.plotY = point.dlBox = undefined;
            }
        }
    },
    alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
    buildKDTree: noop,
    applyZones: noop
    // Point class
}, {
    /**
     * @private
     */
    haloPath: function (size) {
        return Point.prototype.haloPath.call(this, 
        // #6067
        size === 0 ? 0 : (this.marker ? this.marker.radius || 0 : 0) + size);
    },
    ttBelow: false
});
// Add logic to pad each axis with the amount of pixels necessary to avoid the
// bubbles to overflow.
Axis.prototype.beforePadding = function () {
    var axis = this, axisLength = this.len, chart = this.chart, pxMin = 0, pxMax = axisLength, isXAxis = this.isXAxis, dataKey = isXAxis ? 'xData' : 'yData', min = this.min, extremes = {}, smallestSize = Math.min(chart.plotWidth, chart.plotHeight), zMin = Number.MAX_VALUE, zMax = -Number.MAX_VALUE, range = this.max - min, transA = axisLength / range, activeSeries = [];
    // Handle padding on the second pass, or on redraw
    this.series.forEach(function (series) {
        var seriesOptions = series.options, zData;
        if (series.bubblePadding &&
            (series.visible || !chart.options.chart.ignoreHiddenSeries)) {
            // Correction for #1673
            axis.allowZoomOutside = true;
            // Cache it
            activeSeries.push(series);
            if (isXAxis) { // because X axis is evaluated first
                // For each series, translate the size extremes to pixel values
                ['minSize', 'maxSize'].forEach(function (prop) {
                    var length = seriesOptions[prop], isPercent = /%$/.test(length);
                    length = pInt(length);
                    extremes[prop] = isPercent ?
                        smallestSize * length / 100 :
                        length;
                });
                series.minPxSize = extremes.minSize;
                // Prioritize min size if conflict to make sure bubbles are
                // always visible. #5873
                series.maxPxSize = Math.max(extremes.maxSize, extremes.minSize);
                // Find the min and max Z
                zData = series.zData.filter(isNumber);
                if (zData.length) { // #1735
                    zMin = pick(seriesOptions.zMin, Math.min(zMin, Math.max(arrayMin(zData), seriesOptions.displayNegative === false ?
                        seriesOptions.zThreshold :
                        -Number.MAX_VALUE)));
                    zMax = pick(seriesOptions.zMax, Math.max(zMax, arrayMax(zData)));
                }
            }
        }
    });
    activeSeries.forEach(function (series) {
        var data = series[dataKey], i = data.length, radius;
        if (isXAxis) {
            series.getRadii(zMin, zMax, series);
        }
        if (range > 0) {
            while (i--) {
                if (isNumber(data[i]) &&
                    axis.dataMin <= data[i] &&
                    data[i] <= axis.dataMax) {
                    radius = series.radii ? series.radii[i] : 0;
                    pxMin = Math.min(((data[i] - min) * transA) - radius, pxMin);
                    pxMax = Math.max(((data[i] - min) * transA) + radius, pxMax);
                }
            }
        }
    });
    // Apply the padding to the min and max properties
    if (activeSeries.length && range > 0 && !this.isLog) {
        pxMax -= axisLength;
        transA *= (axisLength +
            Math.max(0, pxMin) - // #8901
            Math.min(pxMax, axisLength)) / axisLength;
        [
            ['min', 'userMin', pxMin],
            ['max', 'userMax', pxMax]
        ].forEach(function (keys) {
            if (pick(axis.options[keys[0]], axis[keys[1]]) === undefined) {
                axis[keys[0]] += keys[2] / transA;
            }
        });
    }
    /* eslint-enable valid-jsdoc */
};
/**
 * A `bubble` series. If the [type](#series.bubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.bubble
 * @excluding dataParser, dataURL, stack
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @apioption series.bubble
 */
/**
 * An array of data points for the series. For the `bubble` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,y,z`. If the first value is a string, it is applied as the name of
 *    the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 1, 2],
 *        [1, 5, 5],
 *        [2, 0, 2]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.bubble.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 1,
 *        z: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 5,
 *        z: 4,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.line.data
 * @product   highcharts
 * @apioption series.bubble.data
 */
/**
 * @extends     series.line.data.marker
 * @excluding   enabledThreshold, height, radius, width
 * @product     highcharts
 * @apioption   series.bubble.data.marker
 */
/**
 * The size value for each bubble. The bubbles' diameters are computed
 * based on the `z`, and controlled by series options like `minSize`,
 * `maxSize`, `sizeBy`, `zMin` and `zMax`.
 *
 * @type      {number|null}
 * @product   highcharts
 * @apioption series.bubble.data.z
 */
/**
 * @excluding enabled, enabledThreshold, height, radius, width
 * @apioption series.bubble.marker
 */
''; // adds doclets above to transpiled file
