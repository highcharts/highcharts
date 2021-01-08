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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import ColorMapMixin from '../../Mixins/ColorMapSeries.js';
var colorMapSeriesMixin = ColorMapMixin.colorMapSeriesMixin;
import H from '../../Core/Globals.js';
var noop = H.noop;
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import mapModule from '../../Maps/Map.js';
var maps = mapModule.maps, splitPath = mapModule.splitPath;
import MapPoint from './MapPoint.js';
import palette from '../../Core/Color/Palette.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var 
// indirect dependency to keep product size low
_a = SeriesRegistry.seriesTypes, ColumnSeries = _a.column, ScatterSeries = _a.scatter;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, fireEvent = U.fireEvent, getNestedProperty = U.getNestedProperty, isArray = U.isArray, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach, pick = U.pick, splat = U.splat;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.map
 *
 * @augments Highcharts.Series
 */
var MapSeries = /** @class */ (function (_super) {
    __extends(MapSeries, _super);
    function MapSeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.baseTrans = void 0;
        _this.chart = void 0;
        _this.data = void 0;
        _this.group = void 0;
        _this.joinBy = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.transformGroup = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * The initial animation for the map series. By default, animation is
     * disabled. Animation of map shapes is not at all supported in VML
     * browsers.
     * @private
     */
    MapSeries.prototype.animate = function (init) {
        var chart = this.chart, animation = this.options.animation, group = this.group, xAxis = this.xAxis, yAxis = this.yAxis, left = xAxis.pos, top = yAxis.pos;
        if (chart.renderer.isSVG) {
            if (animation === true) {
                animation = {
                    duration: 1000
                };
            }
            // Initialize the animation
            if (init) {
                // Scale down the group and place it in the center
                group.attr({
                    translateX: left + xAxis.len / 2,
                    translateY: top + yAxis.len / 2,
                    scaleX: 0.001,
                    scaleY: 0.001
                });
                // Run the animation
            }
            else {
                group.animate({
                    translateX: left,
                    translateY: top,
                    scaleX: 1,
                    scaleY: 1
                }, animation);
            }
        }
    };
    /**
     * Animate in the new series from the clicked point in the old series.
     * Depends on the drilldown.js module
     * @private
     */
    MapSeries.prototype.animateDrilldown = function (init) {
        var toBox = this.chart.plotBox, level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1], fromBox = level.bBox, animationOptions = this.chart.options.drilldown.animation, scale;
        if (!init) {
            scale = Math.min(fromBox.width / toBox.width, fromBox.height / toBox.height);
            level.shapeArgs = {
                scaleX: scale,
                scaleY: scale,
                translateX: fromBox.x,
                translateY: fromBox.y
            };
            this.points.forEach(function (point) {
                if (point.graphic) {
                    point.graphic
                        .attr(level.shapeArgs)
                        .animate({
                        scaleX: 1,
                        scaleY: 1,
                        translateX: 0,
                        translateY: 0
                    }, animationOptions);
                }
            });
        }
    };
    /**
     * When drilling up, pull out the individual point graphics from the lower
     * series and animate them into the origin point in the upper series.
     * @private
     */
    MapSeries.prototype.animateDrillupFrom = function (level) {
        ColumnSeries.prototype.animateDrillupFrom.call(this, level);
    };
    /**
     * When drilling up, keep the upper series invisible until the lower series
     * has moved into place.
     * @private
     */
    MapSeries.prototype.animateDrillupTo = function (init) {
        ColumnSeries.prototype.animateDrillupTo.call(this, init);
    };
    /**
     * Allow a quick redraw by just translating the area group. Used for zooming
     * and panning in capable browsers.
     * @private
     */
    MapSeries.prototype.doFullTranslate = function () {
        return (this.isDirtyData ||
            this.chart.isResizing ||
            this.chart.renderer.isVML ||
            !this.baseTrans);
    };
    /**
     * Draw the data labels. Special for maps is the time that the data labels
     * are drawn (after points), and the clipping of the dataLabelsGroup.
     * @private
     */
    MapSeries.prototype.drawMapDataLabels = function () {
        Series.prototype.drawDataLabels.call(this);
        if (this.dataLabelsGroup) {
            this.dataLabelsGroup.clip(this.chart.clipRect);
        }
    };
    /**
     * Use the drawPoints method of column, that is able to handle simple
     * shapeArgs. Extend it by assigning the tooltip position.
     * @private
     */
    MapSeries.prototype.drawPoints = function () {
        var series = this, xAxis = series.xAxis, yAxis = series.yAxis, group = series.group, chart = series.chart, renderer = chart.renderer, scaleX, scaleY, translateX, translateY, baseTrans = this.baseTrans, transformGroup, startTranslateX, startTranslateY, startScaleX, startScaleY;
        // Set a group that handles transform during zooming and panning in
        // order to preserve clipping on series.group
        if (!series.transformGroup) {
            series.transformGroup = renderer.g()
                .attr({
                scaleX: 1,
                scaleY: 1
            })
                .add(group);
            series.transformGroup.survive = true;
        }
        // Draw the shapes again
        if (series.doFullTranslate()) {
            // Individual point actions.
            if (chart.hasRendered && !chart.styledMode) {
                series.points.forEach(function (point) {
                    // Restore state color on update/redraw (#3529)
                    if (point.shapeArgs) {
                        point.shapeArgs.fill = series.pointAttribs(point, point.state).fill;
                    }
                });
            }
            // Draw them in transformGroup
            series.group = series.transformGroup;
            ColumnSeries.prototype.drawPoints.apply(series);
            series.group = group; // Reset
            // Add class names
            series.points.forEach(function (point) {
                if (point.graphic) {
                    var className = '';
                    if (point.name) {
                        className +=
                            'highcharts-name-' +
                                point.name.replace(/ /g, '-').toLowerCase();
                    }
                    if (point.properties &&
                        point.properties['hc-key']) {
                        className +=
                            ' highcharts-key-' +
                                point.properties['hc-key'].toLowerCase();
                    }
                    if (className) {
                        point.graphic.addClass(className);
                    }
                    // In styled mode, apply point colors by CSS
                    if (chart.styledMode) {
                        point.graphic.css(series.pointAttribs(point, point.selected && 'select' || void 0));
                    }
                }
            });
            // Set the base for later scale-zooming. The originX and originY
            // properties are the axis values in the plot area's upper left
            // corner.
            this.baseTrans = {
                originX: (xAxis.min -
                    xAxis.minPixelPadding / xAxis.transA),
                originY: (yAxis.min -
                    yAxis.minPixelPadding / yAxis.transA +
                    (yAxis.reversed ? 0 : yAxis.len / yAxis.transA)),
                transAX: xAxis.transA,
                transAY: yAxis.transA
            };
            // Reset transformation in case we're doing a full translate
            // (#3789)
            this.transformGroup.animate({
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1
            });
            // Just update the scale and transform for better performance
        }
        else {
            scaleX = xAxis.transA / baseTrans.transAX;
            scaleY = yAxis.transA / baseTrans.transAY;
            translateX = xAxis.toPixels(baseTrans.originX, true);
            translateY = yAxis.toPixels(baseTrans.originY, true);
            // Handle rounding errors in normal view (#3789)
            if (scaleX > 0.99 &&
                scaleX < 1.01 &&
                scaleY > 0.99 &&
                scaleY < 1.01) {
                scaleX = 1;
                scaleY = 1;
                translateX = Math.round(translateX);
                translateY = Math.round(translateY);
            }
            /* Animate or move to the new zoom level. In order to prevent
                flickering as the different transform components are set out
                of sync (#5991), we run a fake animator attribute and set
                scale and translation synchronously in the same step.

                A possible improvement to the API would be to handle this in
                the renderer or animation engine itself, to ensure that when
                we are animating multiple properties, we make sure that each
                step for each property is performed in the same step. Also,
                for symbols and for transform properties, it should induce a
                single updateTransform and symbolAttr call. */
            transformGroup = this.transformGroup;
            if (chart.renderer.globalAnimation) {
                startTranslateX = transformGroup.attr('translateX');
                startTranslateY = transformGroup.attr('translateY');
                startScaleX = transformGroup.attr('scaleX');
                startScaleY = transformGroup.attr('scaleY');
                transformGroup
                    .attr({ animator: 0 })
                    .animate({
                    animator: 1
                }, {
                    step: function (now, fx) {
                        transformGroup.attr({
                            translateX: (startTranslateX +
                                (translateX - startTranslateX) * fx.pos),
                            translateY: (startTranslateY +
                                (translateY - startTranslateY) * fx.pos),
                            scaleX: (startScaleX +
                                (scaleX - startScaleX) *
                                    fx.pos),
                            scaleY: (startScaleY +
                                (scaleY - startScaleY) * fx.pos)
                        });
                    }
                });
                // When dragging, animation is off.
            }
            else {
                transformGroup.attr({
                    translateX: translateX,
                    translateY: translateY,
                    scaleX: scaleX,
                    scaleY: scaleY
                });
            }
        }
        /* Set the stroke-width directly on the group element so the
            children inherit it. We need to use setAttribute directly,
            because the stroke-widthSetter method expects a stroke color also
            to be set. */
        if (!chart.styledMode) {
            group.element.setAttribute('stroke-width', (pick(series.options[(series.pointAttrToOptions &&
                series.pointAttrToOptions['stroke-width']) || 'borderWidth'], 1 // Styled mode
            ) / (scaleX || 1)));
        }
        this.drawMapDataLabels();
    };
    /**
     * Get the bounding box of all paths in the map combined.
     * @private
     */
    MapSeries.prototype.getBox = function (paths) {
        var MAX_VALUE = Number.MAX_VALUE, maxX = -MAX_VALUE, minX = MAX_VALUE, maxY = -MAX_VALUE, minY = MAX_VALUE, minRange = MAX_VALUE, xAxis = this.xAxis, yAxis = this.yAxis, hasBox;
        // Find the bounding box
        (paths || []).forEach(function (point) {
            if (point.path) {
                if (typeof point.path === 'string') {
                    point.path = splitPath(point.path);
                    // Legacy one-dimensional array
                }
                else if (point.path[0] === 'M') {
                    point.path = SVGRenderer.prototype.pathToSegments(point.path);
                }
                var path = point.path || [], pointMaxX = -MAX_VALUE, pointMinX = MAX_VALUE, pointMaxY = -MAX_VALUE, pointMinY = MAX_VALUE, properties = point.properties;
                // The first time a map point is used, analyze its box
                if (!point._foundBox) {
                    path.forEach(function (seg) {
                        var x = seg[seg.length - 2];
                        var y = seg[seg.length - 1];
                        if (typeof x === 'number' && typeof y === 'number') {
                            pointMinX = Math.min(pointMinX, x);
                            pointMaxX = Math.max(pointMaxX, x);
                            pointMinY = Math.min(pointMinY, y);
                            pointMaxY = Math.max(pointMaxY, y);
                        }
                    });
                    // Cache point bounding box for use to position data
                    // labels, bubbles etc
                    point._midX = (pointMinX + (pointMaxX - pointMinX) * pick(point.middleX, properties &&
                        properties['hc-middle-x'], 0.5));
                    point._midY = (pointMinY + (pointMaxY - pointMinY) * pick(point.middleY, properties &&
                        properties['hc-middle-y'], 0.5));
                    point._maxX = pointMaxX;
                    point._minX = pointMinX;
                    point._maxY = pointMaxY;
                    point._minY = pointMinY;
                    point.labelrank = pick(point.labelrank, (pointMaxX - pointMinX) * (pointMaxY - pointMinY));
                    point._foundBox = true;
                }
                maxX = Math.max(maxX, point._maxX);
                minX = Math.min(minX, point._minX);
                maxY = Math.max(maxY, point._maxY);
                minY = Math.min(minY, point._minY);
                minRange = Math.min(point._maxX - point._minX, point._maxY - point._minY, minRange);
                hasBox = true;
            }
        });
        // Set the box for the whole series
        if (hasBox) {
            this.minY = Math.min(minY, pick(this.minY, MAX_VALUE));
            this.maxY = Math.max(maxY, pick(this.maxY, -MAX_VALUE));
            this.minX = Math.min(minX, pick(this.minX, MAX_VALUE));
            this.maxX = Math.max(maxX, pick(this.maxX, -MAX_VALUE));
            // If no minRange option is set, set the default minimum zooming
            // range to 5 times the size of the smallest element
            if (xAxis && typeof xAxis.options.minRange === 'undefined') {
                xAxis.minRange = Math.min(5 * minRange, (this.maxX - this.minX) / 5, xAxis.minRange || MAX_VALUE);
            }
            if (yAxis && typeof yAxis.options.minRange === 'undefined') {
                yAxis.minRange = Math.min(5 * minRange, (this.maxY - this.minY) / 5, yAxis.minRange || MAX_VALUE);
            }
        }
    };
    MapSeries.prototype.getExtremes = function () {
        // Get the actual value extremes for colors
        var _a = Series.prototype.getExtremes
            .call(this, this.valueData), dataMin = _a.dataMin, dataMax = _a.dataMax;
        // Recalculate box on updated data
        if (this.chart.hasRendered && this.isDirtyData) {
            this.getBox(this.options.data);
        }
        if (isNumber(dataMin)) {
            this.valueMin = dataMin;
        }
        if (isNumber(dataMax)) {
            this.valueMax = dataMax;
        }
        // Extremes for the mock Y axis
        return { dataMin: this.minY, dataMax: this.maxY };
    };
    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    MapSeries.prototype.hasData = function () {
        return !!this.processedXData.length; // != 0
    };
    /**
     * Get presentational attributes. In the maps series this runs in both
     * styled and non-styled mode, because colors hold data when a colorAxis is
     * used.
     * @private
     */
    MapSeries.prototype.pointAttribs = function (point, state) {
        var attr = point.series.chart.styledMode ?
            this.colorAttribs(point) :
            ColumnSeries.prototype.pointAttribs.call(this, point, state);
        // Set the stroke-width on the group element and let all point
        // graphics inherit. That way we don't have to iterate over all
        // points to update the stroke-width on zooming.
        attr['stroke-width'] = pick(point.options[(this.pointAttrToOptions &&
            this.pointAttrToOptions['stroke-width']) || 'borderWidth'], 'inherit');
        return attr;
    };
    /**
     * Override render to throw in an async call in IE8. Otherwise it chokes on
     * the US counties demo.
     * @private
     */
    MapSeries.prototype.render = function () {
        var series = this, render = Series.prototype.render;
        // Give IE8 some time to breathe.
        if (series.chart.renderer.isVML && series.data.length > 3000) {
            setTimeout(function () {
                render.call(series);
            });
        }
        else {
            render.call(series);
        }
    };
    /**
     * Extend setData to join in mapData. If the allAreas option is true, all
     * areas from the mapData are used, and those that don't correspond to a
     * data value are given null values.
     * @private
     */
    MapSeries.prototype.setData = function (data, redraw, animation, updatePoints) {
        var options = this.options, chartOptions = this.chart.options.chart, globalMapData = chartOptions && chartOptions.map, mapData = options.mapData, joinBy = this.joinBy, pointArrayMap = options.keys || this.pointArrayMap, dataUsed = [], mapMap = {}, mapPoint, mapTransforms = this.chart.mapTransforms, props, i;
        // Collect mapData from chart options if not defined on series
        if (!mapData && globalMapData) {
            mapData = typeof globalMapData === 'string' ?
                maps[globalMapData] :
                globalMapData;
        }
        // Pick up numeric values, add index
        // Convert Array point definitions to objects using pointArrayMap
        if (data) {
            data.forEach(function (val, i) {
                var ix = 0;
                if (isNumber(val)) {
                    data[i] = {
                        value: val
                    };
                }
                else if (isArray(val)) {
                    data[i] = {};
                    // Automatically copy first item to hc-key if there is
                    // an extra leading string
                    if (!options.keys &&
                        val.length > pointArrayMap.length &&
                        typeof val[0] === 'string') {
                        data[i]['hc-key'] = val[0];
                        ++ix;
                    }
                    // Run through pointArrayMap and what's left of the
                    // point data array in parallel, copying over the values
                    for (var j = 0; j < pointArrayMap.length; ++j, ++ix) {
                        if (pointArrayMap[j] &&
                            typeof val[ix] !== 'undefined') {
                            if (pointArrayMap[j].indexOf('.') > 0) {
                                MapPoint.prototype.setNestedProperty(data[i], val[ix], pointArrayMap[j]);
                            }
                            else {
                                data[i][pointArrayMap[j]] =
                                    val[ix];
                            }
                        }
                    }
                }
                if (joinBy && joinBy[0] === '_i') {
                    data[i]._i = i;
                }
            });
        }
        this.getBox(data);
        // Pick up transform definitions for chart
        this.chart.mapTransforms = mapTransforms =
            chartOptions && chartOptions.mapTransforms ||
                mapData && mapData['hc-transform'] ||
                mapTransforms;
        // Cache cos/sin of transform rotation angle
        if (mapTransforms) {
            objectEach(mapTransforms, function (transform) {
                if (transform.rotation) {
                    transform.cosAngle = Math.cos(transform.rotation);
                    transform.sinAngle = Math.sin(transform.rotation);
                }
            });
        }
        if (mapData) {
            if (mapData.type === 'FeatureCollection') {
                this.mapTitle = mapData.title;
                mapData = H.geojson(mapData, this.type, this);
            }
            this.mapData = mapData;
            this.mapMap = {};
            for (i = 0; i < mapData.length; i++) {
                mapPoint = mapData[i];
                props = mapPoint.properties;
                mapPoint._i = i;
                // Copy the property over to root for faster access
                if (joinBy[0] && props && props[joinBy[0]]) {
                    mapPoint[joinBy[0]] = props[joinBy[0]];
                }
                mapMap[mapPoint[joinBy[0]]] = mapPoint;
            }
            this.mapMap = mapMap;
            // Registered the point codes that actually hold data
            if (data && joinBy[1]) {
                var joinKey_1 = joinBy[1];
                data.forEach(function (pointOptions) {
                    var mapKey = getNestedProperty(joinKey_1, pointOptions);
                    if (mapMap[mapKey]) {
                        dataUsed.push(mapMap[mapKey]);
                    }
                });
            }
            if (options.allAreas) {
                this.getBox(mapData);
                data = data || [];
                // Registered the point codes that actually hold data
                if (joinBy[1]) {
                    var joinKey_2 = joinBy[1];
                    data.forEach(function (pointOptions) {
                        dataUsed.push(getNestedProperty(joinKey_2, pointOptions));
                    });
                }
                // Add those map points that don't correspond to data, which
                // will be drawn as null points
                dataUsed = ('|' + dataUsed.map(function (point) {
                    return point && point[joinBy[0]];
                }).join('|') + '|'); // Faster than array.indexOf
                mapData.forEach(function (mapPoint) {
                    if (!joinBy[0] ||
                        dataUsed.indexOf('|' + mapPoint[joinBy[0]] + '|') === -1) {
                        data.push(merge(mapPoint, { value: null }));
                        // #5050 - adding all areas causes the update
                        // optimization of setData to kick in, even though
                        // the point order has changed
                        updatePoints = false;
                    }
                });
            }
            else {
                this.getBox(dataUsed); // Issue #4784
            }
        }
        Series.prototype.setData.call(this, data, redraw, animation, updatePoints);
    };
    /**
     * Extend setOptions by picking up the joinBy option and applying it to a
     * series property.
     * @private
     */
    MapSeries.prototype.setOptions = function (itemOptions) {
        var options = Series.prototype.setOptions.call(this, itemOptions), joinBy = options.joinBy, joinByNull = joinBy === null;
        if (joinByNull) {
            joinBy = '_i';
        }
        joinBy = this.joinBy = splat(joinBy);
        if (!joinBy[1]) {
            joinBy[1] = joinBy[0];
        }
        return options;
    };
    /**
     * Add the path option for data points. Find the max value for color
     * calculation.
     * @private
     */
    MapSeries.prototype.translate = function () {
        var series = this, xAxis = series.xAxis, yAxis = series.yAxis, doFullTranslate = series.doFullTranslate();
        series.generatePoints();
        series.data.forEach(function (point) {
            // Record the middle point (loosely based on centroid),
            // determined by the middleX and middleY options.
            if (isNumber(point._midX) && isNumber(point._midY)) {
                point.plotX = xAxis.toPixels(point._midX, true);
                point.plotY = yAxis.toPixels(point._midY, true);
            }
            if (doFullTranslate) {
                point.shapeType = 'path';
                point.shapeArgs = {
                    d: series.translatePath(point.path)
                };
            }
        });
        fireEvent(series, 'afterTranslate');
    };
    /**
     * Translate the path, so it automatically fits into the plot area box.
     * @private
     */
    MapSeries.prototype.translatePath = function (path) {
        var series = this, xAxis = series.xAxis, yAxis = series.yAxis, xMin = xAxis.min, xTransA = xAxis.transA, xMinPixelPadding = xAxis.minPixelPadding, yMin = yAxis.min, yTransA = yAxis.transA, yMinPixelPadding = yAxis.minPixelPadding, ret = []; // Preserve the original
        // Do the translation
        if (path) {
            path.forEach(function (seg) {
                if (seg[0] === 'M') {
                    ret.push([
                        'M',
                        (seg[1] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[2] - (yMin || 0)) * yTransA + yMinPixelPadding
                    ]);
                }
                else if (seg[0] === 'L') {
                    ret.push([
                        'L',
                        (seg[1] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[2] - (yMin || 0)) * yTransA + yMinPixelPadding
                    ]);
                }
                else if (seg[0] === 'C') {
                    ret.push([
                        'C',
                        (seg[1] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[2] - (yMin || 0)) * yTransA + yMinPixelPadding,
                        (seg[3] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[4] - (yMin || 0)) * yTransA + yMinPixelPadding,
                        (seg[5] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[6] - (yMin || 0)) * yTransA + yMinPixelPadding
                    ]);
                }
                else if (seg[0] === 'Q') {
                    ret.push([
                        'Q',
                        (seg[1] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[2] - (yMin || 0)) * yTransA + yMinPixelPadding,
                        (seg[3] - (xMin || 0)) * xTransA + xMinPixelPadding,
                        (seg[4] - (yMin || 0)) * yTransA + yMinPixelPadding
                    ]);
                }
                else if (seg[0] === 'Z') {
                    ret.push(['Z']);
                }
            });
        }
        return ret;
    };
    /**
     * The map series is used for basic choropleth maps, where each map area has
     * a color based on its value.
     *
     * @sample maps/demo/all-maps/
     *         Choropleth map
     *
     * @extends      plotOptions.scatter
     * @excluding    marker, cluster
     * @product      highmaps
     * @optionparent plotOptions.map
     */
    MapSeries.defaultOptions = merge(ScatterSeries.defaultOptions, {
        animation: false,
        dataLabels: {
            crop: false,
            formatter: function () {
                return this.point.value;
            },
            inside: true,
            overflow: false,
            padding: 0,
            verticalAlign: 'middle'
        },
        /**
         * @ignore-option
         *
         * @private
         */
        marker: null,
        /**
         * The color to apply to null points.
         *
         * In styled mode, the null point fill is set in the
         * `.highcharts-null-point` class.
         *
         * @sample maps/demo/all-areas-as-null/
         *         Null color
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         *
         * @private
         */
        nullColor: palette.neutralColor3,
        /**
         * Whether to allow pointer interaction like tooltips and mouse events
         * on null points.
         *
         * @type      {boolean}
         * @since     4.2.7
         * @apioption plotOptions.map.nullInteraction
         *
         * @private
         */
        stickyTracking: false,
        tooltip: {
            followPointer: true,
            pointFormat: '{point.name}: {point.value}<br/>'
        },
        /**
         * @ignore-option
         *
         * @private
         */
        turboThreshold: 0,
        /**
         * Whether all areas of the map defined in `mapData` should be rendered.
         * If `true`, areas which don't correspond to a data point, are rendered
         * as `null` points. If `false`, those areas are skipped.
         *
         * @sample maps/plotoptions/series-allareas-false/
         *         All areas set to false
         *
         * @type      {boolean}
         * @default   true
         * @product   highmaps
         * @apioption plotOptions.series.allAreas
         *
         * @private
         */
        allAreas: true,
        /**
         * The border color of the map areas.
         *
         * In styled mode, the border stroke is given in the `.highcharts-point`
         * class.
         *
         * @sample {highmaps} maps/plotoptions/series-border/
         *         Borders demo
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   #cccccc
         * @product   highmaps
         * @apioption plotOptions.series.borderColor
         *
         * @private
         */
        borderColor: palette.neutralColor20,
        /**
         * The border width of each map area.
         *
         * In styled mode, the border stroke width is given in the
         * `.highcharts-point` class.
         *
         * @sample maps/plotoptions/series-border/
         *         Borders demo
         *
         * @type      {number}
         * @default   1
         * @product   highmaps
         * @apioption plotOptions.series.borderWidth
         *
         * @private
         */
        borderWidth: 1,
        /**
         * @type      {string}
         * @default   value
         * @apioption plotOptions.map.colorKey
         */
        /**
         * What property to join the `mapData` to the value data. For example,
         * if joinBy is "code", the mapData items with a specific code is merged
         * into the data with the same code. For maps loaded from GeoJSON, the
         * keys may be held in each point's `properties` object.
         *
         * The joinBy option can also be an array of two values, where the first
         * points to a key in the `mapData`, and the second points to another
         * key in the `data`.
         *
         * When joinBy is `null`, the map items are joined by their position in
         * the array, which performs much better in maps with many data points.
         * This is the recommended option if you are printing more than a
         * thousand data points and have a backend that can preprocess the data
         * into a parallel array of the mapData.
         *
         * @sample maps/plotoptions/series-border/
         *         Joined by "code"
         * @sample maps/demo/geojson/
         *         GeoJSON joined by an array
         * @sample maps/series/joinby-null/
         *         Simple data joined by null
         *
         * @type      {string|Array<string>}
         * @default   hc-key
         * @product   highmaps
         * @apioption plotOptions.series.joinBy
         *
         * @private
         */
        joinBy: 'hc-key',
        /**
         * Define the z index of the series.
         *
         * @type      {number}
         * @product   highmaps
         * @apioption plotOptions.series.zIndex
         */
        /**
         * @apioption plotOptions.series.states
         *
         * @private
         */
        states: {
            /**
             * @apioption plotOptions.series.states.hover
             */
            hover: {
                /** @ignore-option */
                halo: null,
                /**
                 * The color of the shape in this state.
                 *
                 * @sample maps/plotoptions/series-states-hover/
                 *         Hover options
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.hover.color
                 */
                /**
                 * The border color of the point in this state.
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.hover.borderColor
                 */
                /**
                 * The border width of the point in this state
                 *
                 * @type      {number}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.hover.borderWidth
                 */
                /**
                 * The relative brightness of the point when hovered, relative
                 * to the normal point color.
                 *
                 * @type      {number}
                 * @product   highmaps
                 * @default   0.2
                 * @apioption plotOptions.series.states.hover.brightness
                 */
                brightness: 0.2
            },
            /**
             * @apioption plotOptions.series.states.normal
             */
            normal: {
                /**
                 * @productdesc {highmaps}
                 * The animation adds some latency in order to reduce the effect
                 * of flickering when hovering in and out of for example an
                 * uneven coastline.
                 *
                 * @sample {highmaps} maps/plotoptions/series-states-animation-false/
                 *         No animation of fill color
                 *
                 * @apioption plotOptions.series.states.normal.animation
                 */
                animation: true
            },
            /**
             * @apioption plotOptions.series.states.select
             */
            select: {
                /**
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @default   ${palette.neutralColor20}
                 * @product   highmaps
                 * @apioption plotOptions.series.states.select.color
                 */
                color: palette.neutralColor20
            },
            inactive: {
                opacity: 1
            }
        }
    });
    return MapSeries;
}(ScatterSeries));
extend(MapSeries.prototype, {
    type: 'map',
    axisTypes: colorMapSeriesMixin.axisTypes,
    colorAttribs: colorMapSeriesMixin.colorAttribs,
    colorKey: colorMapSeriesMixin.colorKey,
    // When tooltip is not shared, this series (and derivatives) requires
    // direct touch/hover. KD-tree does not apply.
    directTouch: true,
    // We need the points' bounding boxes in order to draw the data labels,
    // so we skip it now and call it from drawPoints instead.
    drawDataLabels: noop,
    // No graph for the map series
    drawGraph: noop,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    forceDL: true,
    getExtremesFromAll: true,
    getSymbol: colorMapSeriesMixin.getSymbol,
    parallelArrays: colorMapSeriesMixin.parallelArrays,
    pointArrayMap: colorMapSeriesMixin.pointArrayMap,
    pointClass: MapPoint,
    // X axis and Y axis must have same translation slope
    preserveAspectRatio: true,
    searchPoint: noop,
    trackerGroups: colorMapSeriesMixin.trackerGroups,
    // Get axis extremes from paths, not values
    useMapGeometry: true
});
SeriesRegistry.registerSeriesType('map', MapSeries);
/* *
 *
 *  Default Export
 *
 * */
export default MapSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A map data object containing a `path` definition and optionally additional
 * properties to join in the data as per the `joinBy` option.
 *
 * @sample maps/demo/category-map/
 *         Map data and joinBy
 *
 * @type      {Array<Highcharts.SeriesMapDataOptions>|*}
 * @product   highmaps
 * @apioption series.mapData
 */
/**
 * A `map` series. If the [type](#series.map.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.map
 * @excluding dataParser, dataURL, marker
 * @product   highmaps
 * @apioption series.map
 */
/**
 * An array of data points for the series. For the `map` series type, points can
 * be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `value` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `[hc-key, value]`. Example:
 *    ```js
 *        data: [
 *            ['us-ny', 0],
 *            ['us-mi', 5],
 *            ['us-tx', 3],
 *            ['us-ak', 5]
 *        ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.map.turboThreshold),
 *    this option is not available.
 *    ```js
 *        data: [{
 *            value: 6,
 *            name: "Point2",
 *            color: "#00FF00"
 *        }, {
 *            value: 6,
 *            name: "Point1",
 *            color: "#FF00FF"
 *        }]
 *    ```
 *
 * @type      {Array<number|Array<string,(number|null)>|null|*>}
 * @product   highmaps
 * @apioption series.map.data
 */
/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highmaps
 * @apioption series.map.data.color
 */
/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](
 * #plotOptions.series.dataLabels).
 *
 * @sample maps/series/data-datalabels/
 *         Disable data labels for individual areas
 *
 * @type      {Highcharts.DataLabelsOptions}
 * @product   highmaps
 * @apioption series.map.data.dataLabels
 */
/**
 * The `id` of a series in the [drilldown.series](#drilldown.series)
 * array to use for a drilldown for this point.
 *
 * @sample maps/demo/map-drilldown/
 *         Basic drilldown
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.drilldown
 */
/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 *
 * @sample maps/series/data-id/
 *         Highlight a point by id
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.id
 */
/**
 * When data labels are laid out on a map, Highmaps runs a simplified
 * algorithm to detect collision. When two labels collide, the one with
 * the lowest rank is hidden. By default the rank is computed from the
 * area.
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.map.data.labelrank
 */
/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleX can be defined
 * there.
 *
 * @type      {number}
 * @default   0.5
 * @product   highmaps
 * @apioption series.map.data.middleX
 */
/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleY can be defined
 * there.
 *
 * @type      {number}
 * @default   0.5
 * @product   highmaps
 * @apioption series.map.data.middleY
 */
/**
 * The name of the point as shown in the legend, tooltip, dataLabel
 * etc.
 *
 * @sample maps/series/data-datalabels/
 *         Point names
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.name
 */
/**
 * For map and mapline series types, the SVG path for the shape. For
 * compatibily with old IE, not all SVG path definitions are supported,
 * but M, L and C operators are safe.
 *
 * To achieve a better separation between the structure and the data,
 * it is recommended to use `mapData` to define that paths instead
 * of defining them on the data points themselves.
 *
 * @sample maps/series/data-path/
 *         Paths defined in data
 *
 * @type      {string}
 * @product   highmaps
 * @apioption series.map.data.path
 */
/**
 * The numeric value of the data point.
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.map.data.value
 */
/**
 * Individual point events
 *
 * @extends   plotOptions.series.point.events
 * @product   highmaps
 * @apioption series.map.data.events
 */
''; // adds doclets above to the transpiled file
