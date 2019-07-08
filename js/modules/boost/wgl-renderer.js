/**
 *
 * Copyright (c) 2019-2019 Highsoft AS
 *
 * Boost module: stripped-down renderer for higher performance
 *
 * License: highcharts.com/license
 *
 */

'use strict';

import GLShader from './wgl-shader.js';
import GLVertexBuffer from './wgl-vbuffer.js';

import H from '../../parts/Globals.js';

import U from '../../parts/Utilities.js';
var isNumber = U.isNumber;

import '../../parts/Color.js';

var win = H.win,
    doc = win.document,
    merge = H.merge,
    objEach = H.objEach,
    some = H.some,
    Color = H.Color,
    pick = H.pick;

/**
 * Main renderer. Used to render series.
 *
 * Notes to self:
 * - May be able to build a point map by rendering to a separate canvas and
 *   encoding values in the color data.
 * - Need to figure out a way to transform the data quicker
 *
 * @private
 * @function GLRenderer
 *
 * @param {Function} postRenderCallback
 *
 * @return {*}
 */
function GLRenderer(postRenderCallback) {
    var // Shader
        shader = false,
        // Vertex buffers - keyed on shader attribute name
        vbuffer = false,
        // Opengl context
        gl = false,
        // Width of our viewport in pixels
        width = 0,
        // Height of our viewport in pixels
        height = 0,
        // The data to render - array of coordinates
        data = false,
        // The marker data
        markerData = false,
        // Exports
        exports = {},
        // Is it inited?
        isInited = false,
        // The series stack
        series = [],

        // Texture handles
        textureHandles = {},

        // Things to draw as "rectangles" (i.e lines)
        asBar = {
            'column': true,
            'columnrange': true,
            'bar': true,
            'area': true,
            'arearange': true
        },
        asCircle = {
            'scatter': true,
            'bubble': true
        },
        // Render settings
        settings = {
            pointSize: 1,
            lineWidth: 1,
            fillColor: '#AA00AA',
            useAlpha: true,
            usePreallocated: false,
            useGPUTranslations: false,
            debug: {
                timeRendering: false,
                timeSeriesProcessing: false,
                timeSetup: false,
                timeBufferCopy: false,
                timeKDTree: false,
                showSkipSummary: false
            }
        };

    // /////////////////////////////////////////////////////////////////////////

    function setOptions(options) {
        merge(true, settings, options);
    }

    function seriesPointCount(series) {
        var isStacked,
            xData,
            s;

        if (series.isSeriesBoosting) {
            isStacked = !!series.options.stacking;
            xData = (
                series.xData ||
                series.options.xData ||
                series.processedXData
            );
            s = (isStacked ? series.data : (xData || series.options.data))
                .length;

            if (series.type === 'treemap') {
                s *= 12;
            } else if (series.type === 'heatmap') {
                s *= 6;
            } else if (asBar[series.type]) {
                s *= 2;
            }

            return s;
        }

        return 0;
    }

    /* Allocate a float buffer to fit all series */
    function allocateBuffer(chart) {
        var s = 0;

        if (!settings.usePreallocated) {
            return;
        }

        chart.series.forEach(function (series) {
            if (series.isSeriesBoosting) {
                s += seriesPointCount(series);
            }
        });

        vbuffer.allocate(s);
    }

    function allocateBufferForSingleSeries(series) {
        var s = 0;

        if (!settings.usePreallocated) {
            return;
        }

        if (series.isSeriesBoosting) {
            s = seriesPointCount(series);
        }

        vbuffer.allocate(s);
    }

    /**
     * Returns an orthographic perspective matrix
     * @private
     * @param {number} width - the width of the viewport in pixels
     * @param {number} height - the height of the viewport in pixels
     */
    function orthoMatrix(width, height) {
        var near = 0,
            far = 1;

        return [
            2 / width, 0, 0, 0,
            0, -(2 / height), 0, 0,
            0, 0, -2 / (far - near), 0,
            -1, 1, -(far + near) / (far - near), 1
        ];
    }

    /**
     * Clear the depth and color buffer
     * @private
     */
    function clear() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Get the WebGL context
     * @private
     * @returns {WebGLContext} - the context
     */
    function getGL() {
        return gl;
    }

    /**
     * Push data for a single series
     * This calculates additional vertices and transforms the data to be
     * aligned correctly in memory
     * @private
     */
    function pushSeriesData(series, inst) {
        var isRange = series.pointArrayMap &&
                        series.pointArrayMap.join(',') === 'low,high',
            chart = series.chart,
            options = series.options,
            isStacked = !!options.stacking,
            rawData = options.data,
            xExtremes = series.xAxis.getExtremes(),
            xMin = xExtremes.min,
            xMax = xExtremes.max,
            yExtremes = series.yAxis.getExtremes(),
            yMin = yExtremes.min,
            yMax = yExtremes.max,
            xData = series.xData || options.xData || series.processedXData,
            yData = series.yData || options.yData || series.processedYData,
            zData = series.zData || options.zData || series.processedZData,
            yAxis = series.yAxis,
            xAxis = series.xAxis,
            // plotHeight = series.chart.plotHeight,
            plotWidth = series.chart.plotWidth,
            useRaw = !xData || xData.length === 0,
            // threshold = options.threshold,
            // yBottom = chart.yAxis[0].getThreshold(threshold),
            // hasThreshold = isNumber(threshold),
            // colorByPoint = series.options.colorByPoint,
            // This is required for color by point, so make sure this is
            // uncommented if enabling that
            // colorIndex = 0,
            // Required for color axis support
            // caxis,
            connectNulls = options.connectNulls,
            // For some reason eslint doesn't pick up that this is actually used
            maxVal, // eslint-disable-line no-unused-vars
            points = series.points || false,
            lastX = false,
            lastY = false,
            minVal,
            color,
            scolor,
            sdata = isStacked ? series.data : (xData || rawData),
            closestLeft = { x: Number.MAX_VALUE, y: 0 },
            closestRight = { x: -Number.MAX_VALUE, y: 0 },

            skipped = 0,
            hadPoints = false,

            cullXThreshold = 1,
            cullYThreshold = 1,

            // The following are used in the builder while loop
            x,
            y,
            d,
            z,
            i = -1,
            px = false,
            nx = false,
            // This is in fact used.
            low, // eslint-disable-line no-unused-vars
            chartDestroyed = typeof chart.index === 'undefined',
            nextInside = false,
            prevInside = false,
            pcolor = false,
            drawAsBar = asBar[series.type],
            isXInside = false,
            isYInside = true,
            firstPoint = true,
            zones = options.zones || false,
            zoneDefColor = false,
            threshold = options.threshold,
            gapSize = false;

        if (options.boostData && options.boostData.length > 0) {
            return;
        }

        if (options.gapSize) {
            gapSize = options.gapUnit !== 'value' ?
                options.gapSize * series.closestPointRange : options.gapSize;
        }

        if (zones) {
            some(zones, function (zone) {
                if (typeof zone.value === 'undefined') {
                    zoneDefColor = H.Color(zone.color); // eslint-disable-line new-cap
                    return true;
                }
            });

            if (!zoneDefColor) {
                zoneDefColor = (series.pointAttribs &&
                                series.pointAttribs().fill) || series.color;
                zoneDefColor = H.Color(zoneDefColor); // eslint-disable-line new-cap
            }
        }

        if (chart.inverted) {
            // plotHeight = series.chart.plotWidth;
            plotWidth = series.chart.plotHeight;
        }

        series.closestPointRangePx = Number.MAX_VALUE;

        // Push color to color buffer - need to do this per. vertex
        function pushColor(color) {
            if (color) {
                inst.colorData.push(color[0]);
                inst.colorData.push(color[1]);
                inst.colorData.push(color[2]);
                inst.colorData.push(color[3]);
            }
        }

        // Push a vertice to the data buffer
        function vertice(x, y, checkTreshold, pointSize, color) {
            pushColor(color);
            if (settings.usePreallocated) {
                vbuffer.push(x, y, checkTreshold ? 1 : 0, pointSize || 1);
            } else {
                data.push(x);
                data.push(y);
                data.push(checkTreshold ? 1 : 0);
                data.push(pointSize || 1);
            }
        }

        function closeSegment() {
            if (inst.segments.length) {
                inst.segments[inst.segments.length - 1].to = data.length;
            }
        }

        // Create a new segment for the current set
        function beginSegment() {
            // Insert a segment on the series.
            // A segment is just a start indice.
            // When adding a segment, if one exists from before, it should
            // set the previous segment's end

            if (inst.segments.length &&
                inst.segments[inst.segments.length - 1].from === data.length
            ) {
                return;
            }

            closeSegment();

            inst.segments.push({
                from: data.length
            });

        }

        // Push a rectangle to the data buffer
        function pushRect(x, y, w, h, color) {
            pushColor(color);
            vertice(x + w, y);
            pushColor(color);
            vertice(x, y);
            pushColor(color);
            vertice(x, y + h);

            pushColor(color);
            vertice(x, y + h);
            pushColor(color);
            vertice(x + w, y + h);
            pushColor(color);
            vertice(x + w, y);
        }

        // Create the first segment
        beginSegment();

        // Special case for point shapes
        if (points && points.length > 0) {

            // If we're doing points, we assume that the points are already
            // translated, so we skip the shader translation.
            inst.skipTranslation = true;
            // Force triangle draw mode
            inst.drawMode = 'triangles';

            // We don't have a z component in the shader, so we need to sort.
            if (points[0].node && points[0].node.levelDynamic) {
                points.sort(function (a, b) {
                    if (a.node) {
                        if (a.node.levelDynamic > b.node.levelDynamic) {
                            return 1;
                        }
                        if (a.node.levelDynamic < b.node.levelDynamic) {
                            return -1;
                        }
                    }
                    return 0;
                });
            }

            points.forEach(function (point) {
                var plotY = point.plotY,
                    shapeArgs,
                    swidth,
                    pointAttr;

                if (
                    typeof plotY !== 'undefined' &&
                    !isNaN(plotY) &&
                    point.y !== null
                ) {
                    shapeArgs = point.shapeArgs;

                    pointAttr = chart.styledMode ?
                        point.series.colorAttribs(point) :
                        pointAttr = point.series.pointAttribs(point);

                    swidth = pointAttr['stroke-width'] || 0;

                    // Handle point colors
                    color = H.color(pointAttr.fill).rgba;
                    color[0] /= 255.0;
                    color[1] /= 255.0;
                    color[2] /= 255.0;

                    // So there are two ways of doing this. Either we can
                    // create a rectangle of two triangles, or we can do a
                    // point and use point size. Latter is faster, but
                    // only supports squares. So we're doing triangles.
                    // We could also use one color per. vertice to get
                    // better color interpolation.

                    // If there's stroking, we do an additional rect
                    if (series.type === 'treemap') {
                        swidth = swidth || 1;
                        scolor = H.color(pointAttr.stroke).rgba;

                        scolor[0] /= 255.0;
                        scolor[1] /= 255.0;
                        scolor[2] /= 255.0;

                        pushRect(
                            shapeArgs.x,
                            shapeArgs.y,
                            shapeArgs.width,
                            shapeArgs.height,
                            scolor
                        );

                        swidth /= 2;
                    }
                    // } else {
                    //     swidth = 0;
                    // }

                    // Fixes issues with inverted heatmaps (see #6981)
                    // The root cause is that the coordinate system is flipped.
                    // In other words, instead of [0,0] being top-left, it's
                    // bottom-right. This causes a vertical and horizontal flip
                    // in the resulting image, making it rotated 180 degrees.
                    if (series.type === 'heatmap' && chart.inverted) {
                        shapeArgs.x = xAxis.len - shapeArgs.x;
                        shapeArgs.y = yAxis.len - shapeArgs.y;
                        shapeArgs.width = -shapeArgs.width;
                        shapeArgs.height = -shapeArgs.height;
                    }

                    pushRect(
                        shapeArgs.x + swidth,
                        shapeArgs.y + swidth,
                        shapeArgs.width - (swidth * 2),
                        shapeArgs.height - (swidth * 2),
                        color
                    );
                }
            });

            closeSegment();

            return;
        }

        // Extract color axis
        // (chart.axes || []).forEach(function (a) {
        //     if (H.ColorAxis && a instanceof H.ColorAxis) {
        //         caxis = a;
        //     }
        // });

        while (i < sdata.length - 1) {
            d = sdata[++i];

            // px = x = y = z = nx = low = false;
            // chartDestroyed = typeof chart.index === 'undefined';
            // nextInside = prevInside = pcolor = isXInside = isYInside = false;
            // drawAsBar = asBar[series.type];

            if (chartDestroyed) {
                break;
            }

            // Uncomment this to enable color by point.
            // This currently left disabled as the charts look really ugly
            // when enabled and there's a lot of points.
            // Leaving in for the future (tm).
            // if (colorByPoint) {
            //     colorIndex = ++colorIndex %
            //         series.chart.options.colors.length;
            //     pcolor = toRGBAFast(series.chart.options.colors[colorIndex]);
            //     pcolor[0] /= 255.0;
            //     pcolor[1] /= 255.0;
            //     pcolor[2] /= 255.0;
            // }

            if (useRaw) {
                x = d[0];
                y = d[1];

                if (sdata[i + 1]) {
                    nx = sdata[i + 1][0];
                }

                if (sdata[i - 1]) {
                    px = sdata[i - 1][0];
                }

                if (d.length >= 3) {
                    z = d[2];

                    if (d[2] > inst.zMax) {
                        inst.zMax = d[2];
                    }

                    if (d[2] < inst.zMin) {
                        inst.zMin = d[2];
                    }
                }

            } else {
                x = d;
                y = yData[i];

                if (sdata[i + 1]) {
                    nx = sdata[i + 1];
                }

                if (sdata[i - 1]) {
                    px = sdata[i - 1];
                }

                if (zData && zData.length) {
                    z = zData[i];

                    if (zData[i] > inst.zMax) {
                        inst.zMax = zData[i];
                    }

                    if (zData[i] < inst.zMin) {
                        inst.zMin = zData[i];
                    }
                }
            }

            if (!connectNulls && (x === null || y === null)) {
                beginSegment();
                continue;
            }

            if (nx && nx >= xMin && nx <= xMax) {
                nextInside = true;
            }

            if (px && px >= xMin && px <= xMax) {
                prevInside = true;
            }

            if (isRange) {
                if (useRaw) {
                    y = d.slice(1, 3);
                }

                low = y[0];
                y = y[1];

            } else if (isStacked) {
                x = d.x;
                y = d.stackY;
                low = y - d.y;
            }

            if (yMin !== null &&
                typeof yMin !== 'undefined' &&
                yMax !== null &&
                typeof yMax !== 'undefined'
            ) {
                isYInside = y >= yMin && y <= yMax;
            }

            if (x > xMax && closestRight.x < xMax) {
                closestRight.x = x;
                closestRight.y = y;
            }

            if (x < xMin && closestLeft.x > xMin) {
                closestLeft.x = x;
                closestLeft.y = y;
            }

            if (y === null && connectNulls) {
                continue;
            }

            // Cull points outside the extremes
            if (y === null || (!isYInside && !nextInside && !prevInside)) {
                beginSegment();
                continue;
            }

            // The first point before and first after extremes should be
            // rendered (#9962)
            if (
                (nx >= xMin || x >= xMin) &&
                (px <= xMax || x <= xMax)
            ) {
                isXInside = true;
            }

            if (!isXInside && !nextInside && !prevInside) {
                continue;
            }

            if (gapSize && x - px > gapSize) {
                beginSegment();
            }

            // Note: Boost requires that zones are sorted!
            if (zones) {
                pcolor = zoneDefColor.rgba;
                some(zones, function (zone, i) { // eslint-disable-line no-loop-func
                    var last = zones[i - 1];

                    if (typeof zone.value !== 'undefined' && y <= zone.value) {
                        if (!last || y >= last.value) {
                            pcolor = H.color(zone.color).rgba;

                        }

                        return true;
                    }
                });

                pcolor[0] /= 255.0;
                pcolor[1] /= 255.0;
                pcolor[2] /= 255.0;

            }

            // Skip translations - temporary floating point fix
            if (!settings.useGPUTranslations) {
                inst.skipTranslation = true;
                x = xAxis.toPixels(x, true);
                y = yAxis.toPixels(y, true);

                // Make sure we're not drawing outside of the chart area.
                // See #6594. Update: this is no longer required as far as I
                // can tell. Leaving in for git blame in case there are edge
                // cases I've not found. Having this in breaks #10246.

                // if (y > plotHeight) {
                // y = plotHeight;
                // }

                if (x > plotWidth) {
                    // If this is  rendered as a point, just skip drawing it
                    // entirely, as we're not dependandt on lineTo'ing to it.
                    // See #8197
                    if (inst.drawMode === 'points') {
                        continue;
                    }

                    // Having this here will clamp markers and make the angle
                    // of the last line wrong. See 9166.
                    // x = plotWidth;

                }

            }

            if (drawAsBar) {

                maxVal = y;
                minVal = low;

                if (low === false || typeof low === 'undefined') {
                    if (y < 0) {
                        minVal = y;
                    } else {
                        minVal = 0;
                    }
                }

                if (!isRange && !isStacked) {
                    minVal = Math.max(
                        threshold === null ? yMin : threshold, // #5268
                        yMin
                    ); // #8731
                }
                if (!settings.useGPUTranslations) {
                    minVal = yAxis.toPixels(minVal, true);
                }

                // Need to add an extra point here
                vertice(x, minVal, 0, 0, pcolor);
            }

            // No markers on out of bounds things.
            // Out of bound things are shown if and only if the next
            // or previous point is inside the rect.
            if (inst.hasMarkers && isXInside) {
                // x = H.correctFloat(
                //     Math.min(Math.max(-1e5, xAxis.translate(
                //         x,
                //         0,
                //         0,
                //         0,
                //         1,
                //         0.5,
                //         false
                //     )), 1e5)
                // );

                if (lastX !== false) {
                    series.closestPointRangePx = Math.min(
                        series.closestPointRangePx,
                        Math.abs(x - lastX)
                    );
                }
            }

            // If the last _drawn_ point is closer to this point than the
            // threshold, skip it. Shaves off 20-100ms in processing.

            if (!settings.useGPUTranslations &&
                !settings.usePreallocated &&
                (lastX && Math.abs(x - lastX) < cullXThreshold) &&
                (lastY && Math.abs(y - lastY) < cullYThreshold)
            ) {
                if (settings.debug.showSkipSummary) {
                    ++skipped;
                }

                continue;
            }

            // Do step line if enabled.
            // Draws an additional point at the old Y at the new X.
            // See #6976.

            if (options.step && !firstPoint) {
                vertice(
                    x,
                    lastY,
                    0,
                    2,
                    pcolor
                );
            }

            vertice(
                x,
                y,
                0,
                series.type === 'bubble' ? (z || 1) : 2,
                pcolor
            );

            // Uncomment this to support color axis.
            // if (caxis) {
            //     color = H.color(caxis.toColor(y)).rgba;

            //     inst.colorData.push(color[0] / 255.0);
            //     inst.colorData.push(color[1] / 255.0);
            //     inst.colorData.push(color[2] / 255.0);
            //     inst.colorData.push(color[3]);
            // }

            lastX = x;
            lastY = y;

            hadPoints = true;
            firstPoint = false;
        }

        if (settings.debug.showSkipSummary) {
            console.log('skipped points:', skipped); // eslint-disable-line no-console
        }

        function pushSupplementPoint(point, atStart) {
            if (!settings.useGPUTranslations) {
                inst.skipTranslation = true;
                point.x = xAxis.toPixels(point.x, true);
                point.y = yAxis.toPixels(point.y, true);
            }

            // We should only do this for lines, and we should ignore markers
            // since there's no point here that would have a marker.

            if (atStart) {
                data = [point.x, point.y, 0, 2].concat(data);
                return;
            }

            vertice(
                point.x,
                point.y,
                0,
                2
            );
        }

        if (
            !hadPoints &&
            connectNulls !== false &&
            series.drawMode === 'line_strip'
        ) {
            if (closestLeft.x < Number.MAX_VALUE) {
                // We actually need to push this *before* the complete buffer.
                pushSupplementPoint(closestLeft, true);
            }

            if (closestRight.x > -Number.MAX_VALUE) {
                pushSupplementPoint(closestRight);
            }
        }

        closeSegment();
    }

    /**
     * Push a series to the renderer
     * If we render the series immediatly, we don't have to loop later
     * @private
     * @param s {Highchart.Series} - the series to push
     */
    function pushSeries(s) {
        if (series.length > 0) {
            // series[series.length - 1].to = data.length;
            if (series[series.length - 1].hasMarkers) {
                series[series.length - 1].markerTo = markerData.length;
            }
        }

        if (settings.debug.timeSeriesProcessing) {
            console.time('building ' + s.type + ' series'); // eslint-disable-line no-console
        }

        series.push({
            segments: [],
            // from: data.length,
            markerFrom: markerData.length,
            // Push RGBA values to this array to use per. point coloring.
            // It should be 0-padded, so each component should be pushed in
            // succession.
            colorData: [],
            series: s,
            zMin: Number.MAX_VALUE,
            zMax: -Number.MAX_VALUE,
            hasMarkers: s.options.marker ?
                s.options.marker.enabled !== false :
                false,
            showMarkers: true,
            drawMode: ({
                'area': 'lines',
                'arearange': 'lines',
                'areaspline': 'line_strip',
                'column': 'lines',
                'columnrange': 'lines',
                'bar': 'lines',
                'line': 'line_strip',
                'scatter': 'points',
                'heatmap': 'triangles',
                'treemap': 'triangles',
                'bubble': 'points'
            })[s.type] || 'line_strip'
        });

        // Add the series data to our buffer(s)
        pushSeriesData(s, series[series.length - 1]);

        if (settings.debug.timeSeriesProcessing) {
            console.timeEnd('building ' + s.type + ' series'); // eslint-disable-line no-console
        }
    }

    /**
     * Flush the renderer.
     * This removes pushed series and vertices.
     * Should be called after clearing and before rendering
     * @private
     */
    function flush() {
        series = [];
        exports.data = data = [];
        markerData = [];

        if (vbuffer) {
            vbuffer.destroy();
        }
    }

    /**
     * Pass x-axis to shader
     * @private
     * @param axis {Highcharts.Axis} - the x-axis
     */
    function setXAxis(axis) {
        if (!shader) {
            return;
        }

        shader.setUniform('xAxisTrans', axis.transA);
        shader.setUniform('xAxisMin', axis.min);
        shader.setUniform('xAxisMinPad', axis.minPixelPadding);
        shader.setUniform('xAxisPointRange', axis.pointRange);
        shader.setUniform('xAxisLen', axis.len);
        shader.setUniform('xAxisPos', axis.pos);
        shader.setUniform('xAxisCVSCoord', !axis.horiz);
        shader.setUniform('xAxisIsLog', axis.isLog);
        shader.setUniform('xAxisReversed', !!axis.reversed);
    }

    /**
     * Pass y-axis to shader
     * @private
     * @param axis {Highcharts.Axis} - the y-axis
     */
    function setYAxis(axis) {
        if (!shader) {
            return;
        }

        shader.setUniform('yAxisTrans', axis.transA);
        shader.setUniform('yAxisMin', axis.min);
        shader.setUniform('yAxisMinPad', axis.minPixelPadding);
        shader.setUniform('yAxisPointRange', axis.pointRange);
        shader.setUniform('yAxisLen', axis.len);
        shader.setUniform('yAxisPos', axis.pos);
        shader.setUniform('yAxisCVSCoord', !axis.horiz);
        shader.setUniform('yAxisIsLog', axis.isLog);
        shader.setUniform('yAxisReversed', !!axis.reversed);
    }

    /**
     * Set the translation threshold
     * @private
     * @param has {boolean} - has threshold flag
     * @param translation {Float} - the threshold
     */
    function setThreshold(has, translation) {
        shader.setUniform('hasThreshold', has);
        shader.setUniform('translatedThreshold', translation);
    }

    /**
     * Render the data
     * This renders all pushed series.
     * @private
     */
    function render(chart) {

        if (chart) {
            if (!chart.chartHeight || !chart.chartWidth) {
                // chart.setChartSize();
            }

            width = chart.chartWidth || 800;
            height = chart.chartHeight || 400;
        } else {
            return false;
        }

        if (!gl || !width || !height || !shader) {
            return false;
        }

        if (settings.debug.timeRendering) {
            console.time('gl rendering'); // eslint-disable-line no-console
        }

        gl.canvas.width = width;
        gl.canvas.height = height;

        shader.bind();

        gl.viewport(0, 0, width, height);
        shader.setPMatrix(orthoMatrix(width, height));

        if (settings.lineWidth > 1 && !H.isMS) {
            gl.lineWidth(settings.lineWidth);
        }

        vbuffer.build(exports.data, 'aVertexPosition', 4);
        vbuffer.bind();

        shader.setInverted(chart.inverted);

        // Render the series
        series.forEach(function (s, si) {
            var options = s.series.options,
                shapeOptions = options.marker,
                sindex,
                lineWidth = typeof options.lineWidth !== 'undefined' ?
                    options.lineWidth :
                    1,
                threshold = options.threshold,
                hasThreshold = isNumber(threshold),
                yBottom = s.series.yAxis.getThreshold(threshold),
                translatedThreshold = yBottom,
                cbuffer,
                showMarkers = pick(
                    options.marker ? options.marker.enabled : null,
                    s.series.xAxis.isRadial ? true : null,
                    s.series.closestPointRangePx >
                        2 * ((
                            options.marker ?
                                options.marker.radius :
                                10
                        ) || 10)
                ),
                fillColor,
                shapeTexture = textureHandles[
                    (shapeOptions && shapeOptions.symbol) || s.series.symbol
                ] || textureHandles.circle,
                color;

            if (
                s.segments.length === 0 ||
                (s.segmentslength && s.segments[0].from === s.segments[0].to)
            ) {
                return;
            }

            if (shapeTexture.isReady) {
                gl.bindTexture(gl.TEXTURE_2D, shapeTexture.handle);
                shader.setTexture(shapeTexture.handle);
            }

            if (chart.styledMode) {
                fillColor = (
                    s.series.markerGroup &&
                    s.series.markerGroup.getStyle('fill')
                );

            } else {
                fillColor =
                    (s.series.pointAttribs && s.series.pointAttribs().fill) ||
                    s.series.color;

                if (options.colorByPoint) {
                    fillColor = s.series.chart.options.colors[si];
                }
            }

            if (s.series.fillOpacity && options.fillOpacity) {
                fillColor = new Color(fillColor).setOpacity(
                    pick(options.fillOpacity, 1.0)
                ).get();
            }

            color = H.color(fillColor).rgba;

            if (!settings.useAlpha) {
                color[3] = 1.0;
            }

            // This is very much temporary
            if (s.drawMode === 'lines' && settings.useAlpha && color[3] < 1) {
                color[3] /= 10;
            }

            // Blending
            if (options.boostBlending === 'add') {
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                gl.blendEquation(gl.FUNC_ADD);

            } else if (options.boostBlending === 'mult' ||
                options.boostBlending === 'multiply'
            ) {
                gl.blendFunc(gl.DST_COLOR, gl.ZERO);

            } else if (options.boostBlending === 'darken') {
                gl.blendFunc(gl.ONE, gl.ONE);
                gl.blendEquation(gl.FUNC_MIN);

            } else {
                // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                // gl.blendEquation(gl.FUNC_ADD);
                gl.blendFuncSeparate(
                    gl.SRC_ALPHA,
                    gl.ONE_MINUS_SRC_ALPHA,
                    gl.ONE,
                    gl.ONE_MINUS_SRC_ALPHA
                );
            }

            shader.reset();

            // If there are entries in the colorData buffer, build and bind it.
            if (s.colorData.length > 0) {
                shader.setUniform('hasColor', 1.0);
                cbuffer = GLVertexBuffer(gl, shader); // eslint-disable-line new-cap
                cbuffer.build(s.colorData, 'aColor', 4);
                cbuffer.bind();
            }

            // Set series specific uniforms
            shader.setColor(color);
            setXAxis(s.series.xAxis);
            setYAxis(s.series.yAxis);
            setThreshold(hasThreshold, translatedThreshold);

            if (s.drawMode === 'points') {
                if (options.marker && options.marker.radius) {
                    shader.setPointSize(options.marker.radius * 2.0);
                } else {
                    shader.setPointSize(1);
                }
            }

            // If set to true, the toPixels translations in the shader
            // is skipped, i.e it's assumed that the value is a pixel coord.
            shader.setSkipTranslation(s.skipTranslation);

            if (s.series.type === 'bubble') {
                shader.setBubbleUniforms(s.series, s.zMin, s.zMax);
            }

            shader.setDrawAsCircle(
                asCircle[s.series.type] || false
            );

            // Do the actual rendering
            // If the line width is < 0, skip rendering of the lines. See #7833.
            if (lineWidth > 0 || s.drawMode !== 'line_strip') {
                for (sindex = 0; sindex < s.segments.length; sindex++) {
                    // if (s.segments[sindex].from < s.segments[sindex].to) {
                    vbuffer.render(
                        s.segments[sindex].from,
                        s.segments[sindex].to,
                        s.drawMode
                    );
                    // }
                }
            }

            if (s.hasMarkers && showMarkers) {
                if (options.marker && options.marker.radius) {
                    shader.setPointSize(options.marker.radius * 2.0);
                } else {
                    shader.setPointSize(10);
                }
                shader.setDrawAsCircle(true);
                for (sindex = 0; sindex < s.segments.length; sindex++) {
                    // if (s.segments[sindex].from < s.segments[sindex].to) {
                    vbuffer.render(
                        s.segments[sindex].from,
                        s.segments[sindex].to,
                        'POINTS'
                    );
                    // }
                }
            }
        });

        if (settings.debug.timeRendering) {
            console.timeEnd('gl rendering'); // eslint-disable-line no-console
        }

        if (postRenderCallback) {
            postRenderCallback();
        }

        flush();
    }

    /**
     * Render the data when ready
     * @private
     */
    function renderWhenReady(chart) {
        clear();

        if (chart.renderer.forExport) {
            return render(chart);
        }

        if (isInited) {
            render(chart);
        } else {
            setTimeout(function () {
                renderWhenReady(chart);
            }, 1);
        }
    }

    /**
     * Set the viewport size in pixels
     * Creates an orthographic perspective matrix and applies it.
     * @private
     * @param w {Integer} - the width of the viewport
     * @param h {Integer} - the height of the viewport
     */
    function setSize(w, h) {
        // Skip if there's no change, or if we have no valid shader
        if ((width === w && height === h) || !shader) {
            return;
        }

        width = w;
        height = h;

        shader.bind();
        shader.setPMatrix(orthoMatrix(width, height));
    }

    /**
     * Init OpenGL
     * @private
     * @param canvas {HTMLCanvas} - the canvas to render to
     */
    function init(canvas, noFlush) {
        var i = 0,
            contexts = [
                'webgl',
                'experimental-webgl',
                'moz-webgl',
                'webkit-3d'
            ];

        isInited = false;

        if (!canvas) {
            return false;
        }

        if (settings.debug.timeSetup) {
            console.time('gl setup'); // eslint-disable-line no-console
        }

        for (; i < contexts.length; i++) {
            gl = canvas.getContext(contexts[i], {
            //    premultipliedAlpha: false
            });
            if (gl) {
                break;
            }
        }

        if (gl) {
            if (!noFlush) {
                flush();
            }
        } else {
            return false;
        }

        gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST);
        // gl.depthMask(gl.FALSE);
        gl.depthFunc(gl.LESS);

        shader = GLShader(gl); // eslint-disable-line new-cap

        if (!shader) {
            // We need to abort, there's no shader context
            return false;
        }

        vbuffer = GLVertexBuffer(gl, shader); // eslint-disable-line new-cap

        function createTexture(name, fn) {
            var props = {
                    isReady: false,
                    texture: doc.createElement('canvas'),
                    handle: gl.createTexture()
                },
                ctx = props.texture.getContext('2d');

            textureHandles[name] = props;

            props.texture.width = 512;
            props.texture.height = 512;

            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
            ctx.fillStyle = '#FFF';

            fn(ctx);

            try {

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, props.handle);
                // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    props.texture
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_S,
                    gl.CLAMP_TO_EDGE
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_T,
                    gl.CLAMP_TO_EDGE
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR
                );

                // gl.generateMipmap(gl.TEXTURE_2D);

                gl.bindTexture(gl.TEXTURE_2D, null);

                props.isReady = true;
            } catch (e) {}
        }

        // Circle shape
        createTexture('circle', function (ctx) {
            ctx.beginPath();
            ctx.arc(256, 256, 256, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });

        // Square shape
        createTexture('square', function (ctx) {
            ctx.fillRect(0, 0, 512, 512);
        });

        // Diamond shape
        createTexture('diamond', function (ctx) {
            ctx.beginPath();
            ctx.moveTo(256, 0);
            ctx.lineTo(512, 256);
            ctx.lineTo(256, 512);
            ctx.lineTo(0, 256);
            ctx.lineTo(256, 0);
            ctx.fill();
        });

        // Triangle shape
        createTexture('triangle', function (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 512);
            ctx.lineTo(256, 0);
            ctx.lineTo(512, 512);
            ctx.lineTo(0, 512);
            ctx.fill();
        });

        // Triangle shape (rotated)
        createTexture('triangle-down', function (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(256, 512);
            ctx.lineTo(512, 0);
            ctx.lineTo(0, 0);
            ctx.fill();
        });

        isInited = true;

        if (settings.debug.timeSetup) {
            console.timeEnd('gl setup'); // eslint-disable-line no-console
        }

        return true;
    }

    /**
     * Check if we have a valid OGL context
     * @private
     * @returns {Boolean} - true if the context is valid
     */
    function valid() {
        return gl !== false;
    }

    /**
     * Check if the renderer has been initialized
     * @private
     * @returns {Boolean} - true if it has, false if not
     */
    function inited() {
        return isInited;
    }

    function destroy() {
        flush();
        vbuffer.destroy();
        shader.destroy();
        if (gl) {

            objEach(textureHandles, function (key) {
                if (textureHandles[key].handle) {
                    gl.deleteTexture(textureHandles[key].handle);
                }
            });

            gl.canvas.width = 1;
            gl.canvas.height = 1;
        }
    }

    // /////////////////////////////////////////////////////////////////////////
    exports = {
        allocateBufferForSingleSeries: allocateBufferForSingleSeries,
        pushSeries: pushSeries,
        setSize: setSize,
        inited: inited,
        setThreshold: setThreshold,
        init: init,
        render: renderWhenReady,
        settings: settings,
        valid: valid,
        clear: clear,
        flush: flush,
        setXAxis: setXAxis,
        setYAxis: setYAxis,
        data: data,
        gl: getGL,
        allocateBuffer: allocateBuffer,
        destroy: destroy,
        setOptions: setOptions
    };

    return exports;
}

export default GLRenderer;
