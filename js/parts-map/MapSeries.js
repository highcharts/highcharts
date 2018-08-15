/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Color.js';
import '../parts/Options.js';
import '../parts/Legend.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/ScatterSeries.js';
var colorPointMixin = H.colorPointMixin,
    colorSeriesMixin = H.colorSeriesMixin,
    each = H.each,
    extend = H.extend,
    isNumber = H.isNumber,
    LegendSymbolMixin = H.LegendSymbolMixin,
    map = H.map,
    merge = H.merge,
    noop = H.noop,
    pick = H.pick,
    isArray = H.isArray,
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    splat = H.splat;

/**
 * The map series is used for basic choropleth maps, where each map area has a
 * color based on its value.
 *
 * @sample maps/demo/base/ Choropleth map
 * @extends plotOptions.scatter
 * @excluding marker
 * @product highmaps
 * @optionparent plotOptions.map
 */
seriesType('map', 'scatter', {

    /**
     * Define the z index of the series.
     *
     * @type {Number}
     * @product highmaps
     * @apioption plotOptions.series.zIndex
     */

    /**
     * Whether all areas of the map defined in `mapData` should be rendered.
     * If `true`, areas which don't correspond to a data point, are rendered
     * as `null` points. If `false`, those areas are skipped.
     *
     * @type {Boolean}
     * @sample {highmaps} maps/plotoptions/series-allareas-false/
     *         All areas set to false
     * @default true
     * @product highmaps
     * @apioption plotOptions.series.allAreas
     */
    allAreas: true,

    animation: false, // makes the complex shapes slow

    /*= if (build.classic) { =*/
    /**
     * The color to apply to null points.
     *
     * In styled mode, the null point fill is set in the
     * `.highcharts-null-point` class.
     *
     * @type {Color}
     * @sample {highmaps} maps/demo/all-areas-as-null/ Null color
     * @default #f7f7f7
     * @product highmaps
     */
    nullColor: '${palette.neutralColor3}',

    /**
     * The border color of the map areas.
     *
     * In styled mode, the border stroke is given in the `.highcharts-point`
     * class.
     *
     * @type {Color}
     * @sample {highmaps} maps/plotoptions/series-border/ Borders demo
     * @default #cccccc
     * @product highmaps highcharts
     * @apioption plotOptions.series.borderColor
     */
    borderColor: '${palette.neutralColor20}',

    /**
     * The border width of each map area.
     *
     * In styled mode, the border stroke width is given in the
     * `.highcharts-point` class.
     *
     * @sample    {highmaps} maps/plotoptions/series-border/ Borders demo
     * @product   highmaps highcharts
     * @apioption plotOptions.series.borderWidth
     */
    borderWidth: 1,
    /*= } =*/

    /**
     * Whether to allow pointer interaction like tooltips and mouse events
     * on null points.
     *
     * @type {Boolean}
     * @default false
     * @since 4.2.7
     * @product highmaps
     * @apioption plotOptions.map.nullInteraction
     */

    /**
     * Set this option to `false` to prevent a series from connecting to
     * the global color axis. This will cause the series to have its own
     * legend item.
     *
     * @type {Boolean}
     * @default undefined
     * @product highmaps
     * @apioption plotOptions.series.colorAxis
     */

    /**
     * @ignore-option
     */
    marker: null,

    stickyTracking: false,

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
     * When joinBy is `null`, the map items are joined by their position
     * in the array, which performs much better in maps with many data points.
     * This is the recommended option if you are printing more than a thousand
     * data points and have a backend that can preprocess the data into
     * a parallel array of the mapData.
     *
     * @type {String|Array<String>}
     * @sample {highmaps} maps/plotoptions/series-border/ Joined by "code"
     * @sample {highmaps} maps/demo/geojson/ GeoJSON joined by an array
     * @sample {highmaps} maps/series/joinby-null/ Simple data joined by null
     * @product highmaps
     * @apioption plotOptions.series.joinBy
     */
    joinBy: 'hc-key',

    dataLabels: {
        formatter: function () { // #2945
            return this.point.value;
        },
        inside: true, // for the color
        verticalAlign: 'middle',
        crop: false,
        overflow: false,
        padding: 0
    },

    /**
     * @ignore
     */
    turboThreshold: 0,

    tooltip: {
        followPointer: true,
        pointFormat: '{point.name}: {point.value}<br/>'
    },

    states: {

        /**
         * Overrides for the normal state.
         *
         * @type {Object}
         * @product highmaps
         * @apioption plotOptions.series.states.normal
         */
        normal: {

            /**
             * Animation options for the fill color when returning from hover
             * state to normal state. The animation adds some latency in order
             * to reduce the effect of flickering when hovering in and out of
             * for example an uneven coastline.
             *
             * @type {Object|Boolean}
             * @sample {highmaps}
             *         maps/plotoptions/series-states-animation-false/
             *         No animation of fill color
             * @default true
             * @product highmaps
             * @apioption plotOptions.series.states.normal.animation
             */
            animation: true
        },

        hover: {

            halo: null,

            /**
             * The color of the shape in this state
             *
             * @type {Color}
             * @sample {highmaps} maps/plotoptions/series-states-hover/
             *         Hover options
             * @product highmaps
             * @apioption plotOptions.series.states.hover.color
             */

            /**
             * The border color of the point in this state.
             *
             * @type {Color}
             * @product highmaps
             * @apioption plotOptions.series.states.hover.borderColor
             */

            /**
             * The border width of the point in this state
             *
             * @type {Number}
             * @product highmaps
             * @apioption plotOptions.series.states.hover.borderWidth
             */

            /**
             * The relative brightness of the point when hovered, relative to
             * the normal point color.
             *
             * @type {Number}
             * @default 0.2
             * @product highmaps
             * @apioption plotOptions.series.states.hover.brightness
             */
            brightness: 0.2

        },

        /*= if (build.classic) { =*/
        select: {
            color: '${palette.neutralColor20}'
        }
        /*= } =*/
    }

// Prototype members
}, merge(colorSeriesMixin, {
    type: 'map',
    getExtremesFromAll: true,
    useMapGeometry: true, // get axis extremes from paths, not values
    forceDL: true,
    searchPoint: noop,
    // When tooltip is not shared, this series (and derivatives) requires direct
    // touch/hover. KD-tree does not apply.
    directTouch: true,
    // X axis and Y axis must have same translation slope
    preserveAspectRatio: true,
    pointArrayMap: ['value'],
    /**
     * Get the bounding box of all paths in the map combined.
     */
    getBox: function (paths) {
        var MAX_VALUE = Number.MAX_VALUE,
            maxX = -MAX_VALUE,
            minX = MAX_VALUE,
            maxY = -MAX_VALUE,
            minY = MAX_VALUE,
            minRange = MAX_VALUE,
            xAxis = this.xAxis,
            yAxis = this.yAxis,
            hasBox;

        // Find the bounding box
        each(paths || [], function (point) {

            if (point.path) {
                if (typeof point.path === 'string') {
                    point.path = H.splitPath(point.path);
                }

                var path = point.path || [],
                    i = path.length,
                    even = false, // while loop reads from the end
                    pointMaxX = -MAX_VALUE,
                    pointMinX = MAX_VALUE,
                    pointMaxY = -MAX_VALUE,
                    pointMinY = MAX_VALUE,
                    properties = point.properties;

                // The first time a map point is used, analyze its box
                if (!point._foundBox) {
                    while (i--) {
                        if (isNumber(path[i])) {
                            if (even) { // even = x
                                pointMaxX = Math.max(pointMaxX, path[i]);
                                pointMinX = Math.min(pointMinX, path[i]);
                            } else { // odd = Y
                                pointMaxY = Math.max(pointMaxY, path[i]);
                                pointMinY = Math.min(pointMinY, path[i]);
                            }
                            even = !even;
                        }
                    }
                    // Cache point bounding box for use to position data labels,
                    // bubbles etc
                    point._midX = pointMinX + (pointMaxX - pointMinX) * pick(
                        point.middleX,
                        properties && properties['hc-middle-x'],
                        0.5
                    );
                    point._midY = pointMinY + (pointMaxY - pointMinY) * pick(
                        point.middleY,
                        properties && properties['hc-middle-y'],
                        0.5
                    );
                    point._maxX = pointMaxX;
                    point._minX = pointMinX;
                    point._maxY = pointMaxY;
                    point._minY = pointMinY;
                    point.labelrank = pick(
                        point.labelrank,
                        (pointMaxX - pointMinX) * (pointMaxY - pointMinY)
                    );
                    point._foundBox = true;
                }

                maxX = Math.max(maxX, point._maxX);
                minX = Math.min(minX, point._minX);
                maxY = Math.max(maxY, point._maxY);
                minY = Math.min(minY, point._minY);
                minRange = Math.min(
                    point._maxX - point._minX,
                    point._maxY - point._minY, minRange
                );
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
            if (xAxis && xAxis.options.minRange === undefined) {
                xAxis.minRange = Math.min(
                    5 * minRange,
                    (this.maxX - this.minX) / 5,
                    xAxis.minRange || MAX_VALUE
                );
            }
            if (yAxis && yAxis.options.minRange === undefined) {
                yAxis.minRange = Math.min(
                    5 * minRange,
                    (this.maxY - this.minY) / 5,
                    yAxis.minRange || MAX_VALUE
                );
            }
        }
    },

    getExtremes: function () {
        // Get the actual value extremes for colors
        Series.prototype.getExtremes.call(this, this.valueData);

        // Recalculate box on updated data
        if (this.chart.hasRendered && this.isDirtyData) {
            this.getBox(this.options.data);
        }

        this.valueMin = this.dataMin;
        this.valueMax = this.dataMax;

        // Extremes for the mock Y axis
        this.dataMin = this.minY;
        this.dataMax = this.maxY;
    },

    /**
     * Translate the path so that it automatically fits into the plot area box
     * @param {Object} path
     */
    translatePath: function (path) {

        var series = this,
            even = false, // while loop reads from the end
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            xMin = xAxis.min,
            xTransA = xAxis.transA,
            xMinPixelPadding = xAxis.minPixelPadding,
            yMin = yAxis.min,
            yTransA = yAxis.transA,
            yMinPixelPadding = yAxis.minPixelPadding,
            i,
            ret = []; // Preserve the original

        // Do the translation
        if (path) {
            i = path.length;
            while (i--) {
                if (isNumber(path[i])) {
                    ret[i] = even ?
                        (path[i] - xMin) * xTransA + xMinPixelPadding :
                        (path[i] - yMin) * yTransA + yMinPixelPadding;
                    even = !even;
                } else {
                    ret[i] = path[i];
                }
            }
        }

        return ret;
    },

    /**
     * Extend setData to join in mapData. If the allAreas option is true, all
     * areas from the mapData are used, and those that don't correspond to a
     * data value are given null values.
     */
    setData: function (data, redraw, animation, updatePoints) {
        var options = this.options,
            chartOptions = this.chart.options.chart,
            globalMapData = chartOptions && chartOptions.map,
            mapData = options.mapData,
            joinBy = options.joinBy,
            joinByNull = joinBy === null,
            pointArrayMap = options.keys || this.pointArrayMap,
            dataUsed = [],
            mapMap = {},
            mapPoint,
            mapTransforms = this.chart.mapTransforms,
            props,
            i;

        // Collect mapData from chart options if not defined on series
        if (!mapData && globalMapData) {
            mapData = typeof globalMapData === 'string' ?
                H.maps[globalMapData] :
                globalMapData;
        }

        if (joinByNull) {
            joinBy = '_i';
        }
        joinBy = this.joinBy = splat(joinBy);
        if (!joinBy[1]) {
            joinBy[1] = joinBy[0];
        }

        // Pick up numeric values, add index
        // Convert Array point definitions to objects using pointArrayMap
        if (data) {
            each(data, function (val, i) {
                var ix = 0;
                if (isNumber(val)) {
                    data[i] = {
                        value: val
                    };
                } else if (isArray(val)) {
                    data[i] = {};
                    // Automatically copy first item to hc-key if there is an
                    // extra leading string
                    if (
                        !options.keys &&
                        val.length > pointArrayMap.length &&
                        typeof val[0] === 'string'
                    ) {
                        data[i]['hc-key'] = val[0];
                        ++ix;
                    }
                    // Run through pointArrayMap and what's left of the point
                    // data array in parallel, copying over the values
                    for (var j = 0; j < pointArrayMap.length; ++j, ++ix) {
                        if (pointArrayMap[j] && val[ix] !== undefined) {
                            if (pointArrayMap[j].indexOf('.') > 0) {
                                H.Point.prototype.setNestedProperty(
                                    data[i], val[ix], pointArrayMap[j]
                                );
                            } else {
                                data[i][pointArrayMap[j]] = val[ix];
                            }
                        }
                    }
                }
                if (joinByNull) {
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
            H.objectEach(mapTransforms, function (transform) {
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
                each(data, function (point) {
                    if (mapMap[point[joinBy[1]]]) {
                        dataUsed.push(mapMap[point[joinBy[1]]]);
                    }
                });
            }

            if (options.allAreas) {
                this.getBox(mapData);
                data = data || [];

                // Registered the point codes that actually hold data
                if (joinBy[1]) {
                    each(data, function (point) {
                        dataUsed.push(point[joinBy[1]]);
                    });
                }

                // Add those map points that don't correspond to data, which
                // will be drawn as null points
                dataUsed = '|' + map(dataUsed, function (point) {
                    return point && point[joinBy[0]];
                }).join('|') + '|'; // Faster than array.indexOf

                each(mapData, function (mapPoint) {
                    if (
                        !joinBy[0] ||
                        dataUsed.indexOf('|' + mapPoint[joinBy[0]] + '|') === -1
                    ) {
                        data.push(merge(mapPoint, { value: null }));
                        // #5050 - adding all areas causes the update
                        // optimization of setData to kick in, even though the
                        // point order has changed
                        updatePoints = false;
                    }
                });
            } else {
                this.getBox(dataUsed); // Issue #4784
            }
        }
        Series.prototype.setData.call(
            this,
            data,
            redraw,
            animation,
            updatePoints
        );
    },


    /**
     * No graph for the map series
     */
    drawGraph: noop,

    /**
     * We need the points' bounding boxes in order to draw the data labels, so
     * we skip it now and call it from drawPoints instead.
     */
    drawDataLabels: noop,

    /**
     * Allow a quick redraw by just translating the area group. Used for zooming
     * and panning in capable browsers.
     */
    doFullTranslate: function () {
        return (
            this.isDirtyData ||
            this.chart.isResizing ||
            this.chart.renderer.isVML ||
            !this.baseTrans
        );
    },

    /**
     * Add the path option for data points. Find the max value for color
     * calculation.
     */
    translate: function () {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            doFullTranslate = series.doFullTranslate();

        series.generatePoints();

        each(series.data, function (point) {

            // Record the middle point (loosely based on centroid), determined
            // by the middleX and middleY options.
            point.plotX = xAxis.toPixels(point._midX, true);
            point.plotY = yAxis.toPixels(point._midY, true);

            if (doFullTranslate) {

                point.shapeType = 'path';
                point.shapeArgs = {
                    d: series.translatePath(point.path)
                };
            }
        });

        series.translateColors();
    },

    /**
     * Get presentational attributes. In the maps series this runs in both
     * styled and non-styled mode, because colors hold data when a colorAxis
     * is used.
     */
    pointAttribs: function (point, state) {
        var attr;
        /*= if (build.classic) { =*/
        attr = seriesTypes.column.prototype.pointAttribs.call(
            this, point, state
        );
        /*= } else { =*/
        attr = this.colorAttribs(point);
        /*= } =*/

        // Set the stroke-width on the group element and let all point graphics
        // inherit. That way we don't have to iterate over all points to update
        // the stroke-width on zooming.
        attr['stroke-width'] = pick(
            point.options[
                (
                    this.pointAttrToOptions &&
                    this.pointAttrToOptions['stroke-width']
                ) || 'borderWidth'
            ],
            'inherit'
        );

        return attr;
    },

    /**
     * Use the drawPoints method of column, that is able to handle simple
     * shapeArgs. Extend it by assigning the tooltip position.
     */
    drawPoints: function () {
        var series = this,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            group = series.group,
            chart = series.chart,
            renderer = chart.renderer,
            scaleX,
            scaleY,
            translateX,
            translateY,
            baseTrans = this.baseTrans,
            transformGroup,
            startTranslateX,
            startTranslateY,
            startScaleX,
            startScaleY;

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

            // Individual point actions. TODO: Check unstyled.
            /*= if (build.classic) { =*/
            if (chart.hasRendered) {
                each(series.points, function (point) {

                    // Restore state color on update/redraw (#3529)
                    if (point.shapeArgs) {
                        point.shapeArgs.fill = series.pointAttribs(
                            point,
                            point.state
                        ).fill;
                    }
                });
            }
            /*= } =*/

            // Draw them in transformGroup
            series.group = series.transformGroup;
            seriesTypes.column.prototype.drawPoints.apply(series);
            series.group = group; // Reset

            // Add class names
            each(series.points, function (point) {
                if (point.graphic) {
                    if (point.name) {
                        point.graphic.addClass(
                            'highcharts-name-' +
                            point.name.replace(/ /g, '-').toLowerCase()
                        );
                    }
                    if (point.properties && point.properties['hc-key']) {
                        point.graphic.addClass(
                            'highcharts-key-' +
                            point.properties['hc-key'].toLowerCase()
                        );
                    }

                    /*= if (!build.classic) { =*/
                    point.graphic.css(
                        series.pointAttribs(point, point.selected && 'select')
                    );
                    /*= } =*/
                }
            });

            // Set the base for later scale-zooming. The originX and originY
            // properties are the axis values in the plot area's upper left
            // corner.
            this.baseTrans = {
                originX: xAxis.min - xAxis.minPixelPadding / xAxis.transA,
                originY: (
                    yAxis.min -
                    yAxis.minPixelPadding / yAxis.transA +
                    (yAxis.reversed ? 0 : yAxis.len / yAxis.transA)
                ),
                transAX: xAxis.transA,
                transAY: yAxis.transA
            };

            // Reset transformation in case we're doing a full translate (#3789)
            this.transformGroup.animate({
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1
            });

        // Just update the scale and transform for better performance
        } else {
            scaleX = xAxis.transA / baseTrans.transAX;
            scaleY = yAxis.transA / baseTrans.transAY;
            translateX = xAxis.toPixels(baseTrans.originX, true);
            translateY = yAxis.toPixels(baseTrans.originY, true);

            // Handle rounding errors in normal view (#3789)
            if (
                scaleX > 0.99 &&
                scaleX < 1.01 &&
                scaleY > 0.99 &&
                scaleY < 1.01
            ) {
                scaleX = 1;
                scaleY = 1;
                translateX = Math.round(translateX);
                translateY = Math.round(translateY);
            }

            // Animate or move to the new zoom level. In order to prevent
            // flickering as the different transform components are set out of
            // sync (#5991), we run a fake animator attribute and set scale and
            // translation synchronously in the same step.
            // A possible improvement to the API would be to handle this in the
            // renderer or animation engine itself, to ensure that when we are
            // animating multiple properties, we make sure that each step for
            // each property is performed in the same step. Also, for symbols
            // and for transform properties, it should induce a single
            // updateTransform and symbolAttr call.
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
                                translateX: startTranslateX +
                                    (translateX - startTranslateX) * fx.pos,
                                translateY: startTranslateY +
                                    (translateY - startTranslateY) * fx.pos,
                                scaleX: startScaleX +
                                    (scaleX - startScaleX) * fx.pos,
                                scaleY: startScaleY +
                                    (scaleY - startScaleY) * fx.pos
                            });

                        }
                    });

            // When dragging, animation is off.
            } else {
                transformGroup.attr({
                    translateX: translateX,
                    translateY: translateY,
                    scaleX: scaleX,
                    scaleY: scaleY
                });
            }

        }

        // Set the stroke-width directly on the group element so the children
        // inherit it. We need to use setAttribute directly, because the
        // stroke-widthSetter method expects a stroke color also to be set.
        group.element.setAttribute(
            'stroke-width',
            (
                series.options[
                    (
                        series.pointAttrToOptions &&
                        series.pointAttrToOptions['stroke-width']
                    ) || 'borderWidth'
                ] ||
                1 // Styled mode
            ) / (scaleX || 1)
        );

        this.drawMapDataLabels();


    },

    /**
     * Draw the data labels. Special for maps is the time that the data labels
     * are drawn (after points), and the clipping of the dataLabelsGroup.
     */
    drawMapDataLabels: function () {

        Series.prototype.drawDataLabels.call(this);
        if (this.dataLabelsGroup) {
            this.dataLabelsGroup.clip(this.chart.clipRect);
        }
    },

    /**
     * Override render to throw in an async call in IE8. Otherwise it chokes on
     * the US counties demo.
     */
    render: function () {
        var series = this,
            render = Series.prototype.render;

        // Give IE8 some time to breathe.
        if (series.chart.renderer.isVML && series.data.length > 3000) {
            setTimeout(function () {
                render.call(series);
            });
        } else {
            render.call(series);
        }
    },

    /**
     * The initial animation for the map series. By default, animation is
     * disabled. Animation of map shapes is not at all supported in VML
     * browsers.
     */
    animate: function (init) {
        var chart = this.chart,
            animation = this.options.animation,
            group = this.group,
            xAxis = this.xAxis,
            yAxis = this.yAxis,
            left = xAxis.pos,
            top = yAxis.pos;

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
                    scaleX: 0.001, // #1499
                    scaleY: 0.001
                });

            // Run the animation
            } else {
                group.animate({
                    translateX: left,
                    translateY: top,
                    scaleX: 1,
                    scaleY: 1
                }, animation);

                // Delete this function to allow it only once
                this.animate = null;
            }
        }
    },

    /**
     * Animate in the new series from the clicked point in the old series.
     * Depends on the drilldown.js module
     */
    animateDrilldown: function (init) {
        var toBox = this.chart.plotBox,
            level = this.chart.drilldownLevels[
                this.chart.drilldownLevels.length - 1
            ],
            fromBox = level.bBox,
            animationOptions = this.chart.options.drilldown.animation,
            scale;

        if (!init) {

            scale = Math.min(
                fromBox.width / toBox.width,
                fromBox.height / toBox.height
            );
            level.shapeArgs = {
                scaleX: scale,
                scaleY: scale,
                translateX: fromBox.x,
                translateY: fromBox.y
            };

            each(this.points, function (point) {
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

            this.animate = null;
        }

    },

    drawLegendSymbol: LegendSymbolMixin.drawRectangle,

    /**
     * When drilling up, pull out the individual point graphics from the lower
     * series and animate them into the origin point in the upper series.
     */
    animateDrillupFrom: function (level) {
        seriesTypes.column.prototype.animateDrillupFrom.call(this, level);
    },


    /**
     * When drilling up, keep the upper series invisible until the lower series
     * has moved into place
     */
    animateDrillupTo: function (init) {
        seriesTypes.column.prototype.animateDrillupTo.call(this, init);
    }

// Point class
}), extend({
    /**
     * Extend the Point object to split paths
     */
    applyOptions: function (options, x) {

        var point = Point.prototype.applyOptions.call(this, options, x),
            series = this.series,
            joinBy = series.joinBy,
            mapPoint;

        if (series.mapData) {
            mapPoint = point[joinBy[1]] !== undefined &&
                series.mapMap[point[joinBy[1]]];
            if (mapPoint) {
                // This applies only to bubbles
                if (series.xyFromShape) {
                    point.x = mapPoint._midX;
                    point.y = mapPoint._midY;
                }
                extend(point, mapPoint); // copy over properties
            } else {
                point.value = point.value || null;
            }
        }

        return point;
    },

    /**
     * Stop the fade-out
     */
    onMouseOver: function (e) {
        H.clearTimeout(this.colorInterval);
        if (this.value !== null || this.series.options.nullInteraction) {
            Point.prototype.onMouseOver.call(this, e);
        } else { // #3401 Tooltip doesn't hide when hovering over null points
            this.series.onMouseOut(e);
        }
    },

    /**
     * Highmaps only. Zoom in on the point using the global animation.
     *
     * @function #zoomTo
     * @memberof Point
     * @sample maps/members/point-zoomto/
     *         Zoom to points from butons
     */
    zoomTo: function () {
        var point = this,
            series = point.series;

        series.xAxis.setExtremes(
            point._minX,
            point._maxX,
            false
        );
        series.yAxis.setExtremes(
            point._minY,
            point._maxY,
            false
        );
        series.chart.redraw();
    }
}, colorPointMixin));

/**
 * An array of objects containing a `path` definition and optionally
 * a code or property to join in the data as per the `joinBy` option.
 *
 * @type {Array<Object>}
 * @sample {highmaps} maps/demo/category-map/ Map data and joinBy
 * @product highmaps
 * @apioption series.mapData
 */

/**
 * A `map` series. If the [type](#series.map.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @extends series,plotOptions.map
 * @excluding dataParser,dataURL,marker
 * @product highmaps
 * @apioption series.map
 */

/**
 * An array of data points for the series. For the `map` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `value` options. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `[hc-key, value]`. Example:
 *
 *  ```js
 *     data: [
 *         ['us-ny', 0],
 *         ['us-mi', 5],
 *         ['us-tx', 3],
 *         ['us-ak', 5]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.map.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         value: 6,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         value: 6,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type {Array<Object>}
 * @product highmaps
 * @apioption series.map.data
 */

/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 *
 * @type {Color}
 * @default undefined
 * @product highmaps
 * @apioption series.map.data.color
 */

/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](
 * #plotOptions.series.dataLabels).
 *
 * @type {Object}
 * @sample  {highmaps} maps/series/data-datalabels/
 *          Disable data labels for individual areas
 * @product highmaps
 * @apioption series.map.data.dataLabels
 */

/**
 * The `id` of a series in the [drilldown.series](#drilldown.series)
 * array to use for a drilldown for this point.
 *
 * @type {String}
 * @sample {highmaps} maps/demo/map-drilldown/ Basic drilldown
 * @product highmaps
 * @apioption series.map.data.drilldown
 */

/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 *
 * @type {String}
 * @sample {highmaps} maps/series/data-id/ Highlight a point by id
 * @product highmaps
 * @apioption series.map.data.id
 */

/**
 * When data labels are laid out on a map, Highmaps runs a simplified
 * algorithm to detect collision. When two labels collide, the one with
 * the lowest rank is hidden. By default the rank is computed from the
 * area.
 *
 * @type {Number}
 * @product highmaps
 * @apioption series.map.data.labelrank
 */

 /**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleX can be defined
 * there.
 *
 * @type {Number}
 * @default 0.5
 * @product highmaps
 * @apioption series.map.data.middleX
 */

/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleY can be defined
 * there.
 *
 * @type {Number}
 * @default 0.5
 * @product highmaps
 * @apioption series.map.data.middleY
 */

/**
 * The name of the point as shown in the legend, tooltip, dataLabel
 * etc.
 *
 * @type {String}
 * @sample {highmaps} maps/series/data-datalabels/ Point names
 * @product highmaps
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
 * @type {String}
 * @sample {highmaps} maps/series/data-path/ Paths defined in data
 * @product highmaps
 * @apioption series.map.data.path
 */

/**
 * The numeric value of the data point.
 *
 * @type {Number}
 * @product highmaps
 * @apioption series.map.data.value
 */


/**
 * Individual point events
 *
 * @extends plotOptions.series.point.events
 * @product highmaps
 * @apioption series.map.data.events
 */
