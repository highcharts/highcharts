/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  Author: Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './../parts/Globals.js';
import U from './../parts/Utilities.js';
/* eslint-disable no-invalid-this */
import './../parts/Series.js';
import './../parts/Axis.js';
import './../parts/SvgRenderer.js';
var Series = H.Series, Point = H.Point, SvgRenderer = H.SVGRenderer, addEvent = H.addEvent, merge = H.merge, defined = U.defined, isArray = U.isArray, isObject = U.isObject, isNumber = U.isNumber, isFunction = H.isFunction, relativeLength = H.relativeLength, extend = H.extend, error = H.error, baseGeneratePoints = Series.prototype.generatePoints, clusterDefaultOptions;
/**
 * Options for marker clusters, the concept of sampling the data
 * values into larger blocks in order to ease readability and
 * increase performance of the JavaScript charts.
 *
 * Note: marker clusters are not working with the boost module.
 *
 * The marker clusters feature requires the marker-clusters.js
 * file to be loaded, found in the modules directory of the download
 * package, or online at [code.highcharts.com/modules/marker-clusters.js
 * ](code.highcharts.com/modules/marker-clusters.js).
 *
 * @sample maps/marker-clusters/basic
 *         Maps marker clusters
 * @sample highcharts/marker-clusters/basic
 *         Scatter marker clusters
 *
 * @product      highcharts highmaps
 * @optionparent plotOptions.scatter.marker.cluster
 * @optionparent plotOptions.mappoint.marker.cluster
 */
clusterDefaultOptions = {
    /**
     * Whether to enable the marker-clusters module.
     *
     * @sample maps/marker-clusters/basic
     *         Maps marker clusters
     * @sample highcharts/marker-clusters/basic
     *         Scatter marker clusters
     *
     * @type      {boolean}
     * @default   false
     */
    enabled: false,
    /**
     * When set to `false` prevent cluster overlapping - this option
     * works only when `layoutAlgorithm.type = "grid"`.
     *
     * @sample highcharts/marker-clusters/grid
     *         Prevent overlapping
     *
     * @type      {boolean}
     * @default   true
     */
    allowOverlap: true,
    /**
     * Zoom the plot area to the cluster points range when cluster is clicked.
     *
     * @type      {boolean}
     * @default   true
     */
    zoomOnClick: true,
    /**
     * The minimum amount of points to be combined into a cluster.
     *
     * @sample highcharts/marker-clusters/basic
     *         At least three points in the cluster
     *
     * @type      {number}
     * @default   2
     */
    minimumClusterSize: 2,
    /**
     * Options for layout algorithm. Inside there
     * are options to change the type of the algorithm, gridSize,
     * distance or iterations.
     */
    layoutAlgorithm: {
        /**
         * Type of the algorithm used to combine points into a cluster.
         * There are two available algorithms:
         *
         * 1) `kmeans` - made based on K-Means clustering technique. In the
         * first step, points are divided using the grid method (distance
         * property is a grid size) to find the initial amount of clusters.
         * Next, each point is classified by computing the distance between
         * each cluster center and that point. When the closest cluster]
         * distance is lower than distance property set by a user the point
         * is added to this cluster otherwise is classified as `noise`. The
         * algorithm is repeated until each cluster center not change its
         * previous position more than one pixel. This technique is more
         * accurate but also more time consuming than the `grid` algorithm.
         *
         * 2) `grid` - grid-based clustering technique. Points are assigned to
         * a grid element depending on their position on the plot area.
         * Points inside the grid item are combined into a cluster.
         * The grid item size can be controlled by `gridSize` property.
         *
         *
         * The custom clustering algorithm can be added by assigning a callback
         * function as the type property. This function takes an array of
         * processedXData, processedYData and layoutAlgorithm options as
         * arguments and should return an object with grouped data.
         *
         * The algorithm should return an object like that:
         * <pre>{
         *  clusterId1: [{
         *      x: 573,
         *      y: 285,
         *      index: 1 // point index in the data array
         *  }, {
         *      x: 521,
         *      y: 197,
         *      index: 2
         *  }],
         *  clusterId2: [{
         *      ...
         *  }]
         *  ...
         * }</pre>
         *
         * `clusterId` (example above - unique id of a cluster or noise)
         * is an array of points belonging to a cluster. If the
         * array has only one point or fewer points than set in
         * `cluster.minimumClusterSize` it won't be combined into a cluster.
         *
         * @sample highcharts/marker-clusters/grid
         *         Grid algorithm
         * @sample highcharts/marker-clusters/kmeans
         *         K-Means algorithm
         * @sample maps/marker-clusters/custom-alg
         *         Custom algorithm
         *
         * @type {string|Function}
         * @see [cluster.minimumClusterSize](#plotOptions.scatter.marker.cluster.minimumClusterSize)
         *
         */
        type: 'kmeans',
        /**
         * When `type` is set to the `grid`,
         * `gridSize` is a size of a grid item element either as a number
         * defining pixels, or a percentage defining a percentage
         * of the plot area width.
         *
         * @type    {number|string}
         */
        /* eslint-disable max-len */
        gridSize: 40,
        /**
         * When `type` is set to `kmeans`,
         * `iterations` are the number of iterations that this algorithm will be
         * repeated to find clusters positions.
         *
         * @type    {number}
         * @optionparent plotOptions.scatter.marker.cluster.layoutAlgorithm.iterations
         * @optionparent plotOptions.mappoint.marker.cluster.layoutAlgorithm.iterations
         */
        /* eslint-enable max-len */
        /**
         * When `type` is set to `kmeans`,
         * `distance` is a maximum distance between point and cluster center
         * so that this point will be inside the cluster. The distance
         * is either a number defining pixels or a percentage
         * defining a percentage of the plot area width.
         *
         * @type    {number|string}
         */
        distance: 30
    },
    style: {
        /**
         * A predefined shape or symbol for the cluster marker. Other
         * possible values are "circle", "square", "diamond", "triangle"
         * and "triangle-down".
         *
         * Additionally, the URL to a graphic can be given on this form:
         * "url(graphic.png)". Note that for the image to be applied to
         * exported charts, its URL needs to be accessible by the export
         * server.
         *
         * Custom callbacks for symbol path generation can also be added to
         * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
         * used by its method name, as shown in the demo.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         *
         * @type      {string}
         */
        symbol: 'cluster',
        /**
         * The radius of the cluster marker.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-radius/
         *         Bigger markers
         *
         * @type      {number}
         */
        radius: 15,
        /**
         * The width of the cluster marker's outline.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         2px blue marker
         */
        lineWidth: 0,
        /**
         * The fill color of the cluster marker. When `undefined`, the series'
         * or point's color is used.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         White fill
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @optionparent plotOptions.scatter.marker.cluster.style.fillColor
         * @optionparent plotOptions.mappoint.marker.cluster.style.fillColor
         */
        /**
         * The color of the cluster marker's outline. When `undefined`, the
         * series' or point's color is used.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
         *         Inherit from series color (undefined)
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        lineColor: '${palette.backgroundColor}'
    },
    /**
     * An array defining zones within marker clusters.
     *
     * In styled mode, the color zones are styled with the
     * `.highcharts-cluster-zone-{n}` class, or custom
     * classed from the `className`
     * option.
     *
     * @sample highcharts/marker-clusters/basic
     *         Marker clusters zones
     * @sample maps/marker-clusters/custom-alg
     *         Zones on maps
     *
     * @type      {Array<ClusterZonesOptions>}
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones
     * @optionparent plotOptions.mappoint.marker.cluster.zones
     */
    /**
     * Styled mode only. A custom class name for the zone.
     *
     * @sample highcharts/css/color-zones/
     *         Zones styled by class name
     *
     * @type      {string}
     * @optionparent plotOptions.scatter.marker.cluster.zones.className
     * @optionparent plotOptions.mappoint.marker.cluster.zones.className
     */
    /**
     * Styles for the cluster zone.
     *
     * @see [StyleOptions](#plotOptions.scatter.marker.cluster.style)
     * @extends   plotOptions.scatter.marker.cluster.style
     * @type      {StyleOptions}
     *
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones.style
     * @optionparent plotOptions.mappoint.marker.cluster.zones.style
     */
    /**
     * The value where the zone starts.
     *
     * @type      {number}
     *
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones.from
     * @optionparent plotOptions.mappoint.marker.cluster.zones.from
     */
    /**
     * The value where the zone ends.
     *
     * @type      {number}
     *
     * @product   highcharts highmaps
     * @optionparent plotOptions.scatter.marker.cluster.zones.to
     * @optionparent plotOptions.mappoint.marker.cluster.zones.to
     */
    /**
     * The fill color of the cluster marker in hover state. When
     * `undefined`, the series' or point's fillColor for normal
     * state is used.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @optionparent plotOptions.scatter.marker.cluster.states.hover.fillColor
     * @optionparent plotOptions.mappoint.marker.cluster.states.hover.fillColor
     *
     */
    /**
     * Options for the cluster data labels.
     * @extends   plotOptions.series.dataLabels
     * @type    {Highcharts.DataLabelsOptionsObject}
     */
    dataLabels: {
        enabled: true,
        format: '{point.clusteredDataLen}',
        verticalAlign: 'middle',
        align: 'center'
    }
};
extend(H.defaultOptions.plotOptions, {
    series: {
        marker: {
            cluster: clusterDefaultOptions
        },
        tooltip: {
            clusterFormat: '<span>Clustered points: ' +
                '{point.clusteredDataLen}</span><br/>'
        }
    }
});
// Cluster symbol.
SvgRenderer.prototype.symbols.cluster = function (x, y, width, height) {
    var w = width / 2, h = height / 2, outerWidth = 1, space = 1, inner, outer1, outer2;
    inner = this.arc(x + w, y + h, w - space * 4, h - space * 4, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        open: false
    });
    outer1 = this.arc(x + w, y + h, w - space * 3, h - space * 3, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        innerR: w - outerWidth * 2,
        open: false
    });
    outer2 = this.arc(x + w, y + h, w - space, h - space, {
        start: Math.PI * 0.5,
        end: Math.PI * 2.5,
        innerR: w,
        open: false
    });
    return outer2.concat(outer1, inner);
};
Series.prototype.computeViewOffset = function (axis) {
    if (defined(axis.min) && defined(axis.dataMin)) {
        return axis.dataMin < axis.min ?
            Math.abs(axis.toPixels(axis.min) - axis.toPixels(axis.dataMin)) :
            0;
    }
    return 0;
};
Series.prototype.clusterAlgorithms = {
    grid: function (processedXData, processedYData, options) {
        var series = this, chart = series.chart, xAxis = series.xAxis, yAxis = series.yAxis, gridSize = options.processedGridSize, grid = {}, offsetX = series.computeViewOffset(xAxis), offsetY = series.computeViewOffset(yAxis), x, y, gridX, gridY, key, i;
        for (i = 0; i < processedXData.length; i++) {
            x = xAxis.toPixels(processedXData[i]) + offsetX - chart.plotLeft;
            y = yAxis.toPixels(processedYData[i]) + offsetY - chart.plotTop;
            gridX = Math.floor(x / gridSize);
            gridY = Math.floor(y / gridSize);
            key = gridY + '-' + gridX;
            if (!grid[key]) {
                grid[key] = [];
            }
            grid[key].push({
                index: i,
                x: processedXData[i],
                y: processedYData[i]
            });
        }
        return grid;
    },
    kmeans: function (processedXData, processedYData, options) {
        var series = this, xAxis = series.xAxis, yAxis = series.yAxis, clusters = [], noise = [], grid = {}, group = {}, pointMaxDistance = options.processedDistance, iterations = options.iterations, 
        // Max pixel difference beetwen new and old cluster position.
        maxClusterShift = 1, currentIteration = 0, repeat = true, pointX = 0, pointY = 0, tempPos, pointClusterDistance = [], distance, key, i, j;
        options.processedGridSize = options.processedDistance;
        // Use grid method to get groupedData object.
        grid = series.clusterAlgorithms.grid.call(series, processedXData, processedYData, options);
        // Find clusters amount and its start positions
        // based on grid grouped data.
        for (key in grid) {
            if (grid[key].length > 1) {
                tempPos = series.computeClusterPosition(grid[key]);
                clusters.push({
                    posX: tempPos.x,
                    posY: tempPos.y,
                    oldX: 0,
                    oldY: 0,
                    startPointsLen: grid[key].length,
                    points: []
                });
            }
        }
        // Start kmeans iteration process.
        while (repeat) {
            clusters.map(function (c) {
                c.points.length = 0;
                return c;
            });
            noise.length = 0;
            for (i = 0; i < processedXData.length; i++) {
                pointClusterDistance.length = 0;
                pointX = processedXData[i];
                pointY = processedYData[i];
                for (j = 0; j < clusters.length; j++) {
                    distance = Math.sqrt(Math.pow(xAxis.toPixels(pointX) -
                        xAxis.toPixels(clusters[j].posX), 2) +
                        Math.pow(yAxis.toPixels(pointY) -
                            yAxis.toPixels(clusters[j].posY), 2));
                    pointClusterDistance.push({
                        clusterIndex: j,
                        distance: distance
                    });
                }
                pointClusterDistance.sort(function (a, b) { return a.distance - b.distance; });
                if (pointClusterDistance.length &&
                    pointClusterDistance[0].distance < pointMaxDistance) {
                    clusters[pointClusterDistance[0].clusterIndex].points.push({
                        x: pointX,
                        y: pointY,
                        index: i
                    });
                }
                else {
                    noise.push({
                        x: pointX,
                        y: pointY,
                        index: i
                    });
                }
            }
            // Compute a new clusters position and check if it
            // is different than the old one.
            repeat = false;
            for (j = 0; j < clusters.length; j++) {
                tempPos = series.computeClusterPosition(clusters[j].points);
                clusters[j].oldX = clusters[j].posX;
                clusters[j].oldY = clusters[j].posY;
                clusters[j].posX = tempPos.x;
                clusters[j].posY = tempPos.y;
                // Repeat the algorithm if at least one cluster
                // is shifted more than maxClusterShift property.
                if (clusters[j].posX > clusters[j].oldX + maxClusterShift ||
                    clusters[j].posX < clusters[j].oldX - maxClusterShift ||
                    clusters[j].posY > clusters[j].oldY + maxClusterShift ||
                    clusters[j].posY < clusters[j].oldY - maxClusterShift) {
                    repeat = true;
                }
            }
            // If iterations property is set repeat the algorithm
            // specified amount of times.
            if (iterations && currentIteration >= iterations - 1) {
                repeat = false;
            }
            else if (iterations) {
                repeat = true;
            }
            currentIteration++;
        }
        clusters.forEach(function (cluster, i) {
            group['cluster' + i] = cluster.points;
        });
        noise.forEach(function (noise, i) {
            group['noise' + i] = [noise];
        });
        return group;
    }
};
Series.prototype.computeClusterPosition = function (points) {
    var pointsLen = points.length, sumX = 0, sumY = 0, i;
    for (i = 0; i < pointsLen; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
    }
    return {
        x: sumX / pointsLen,
        y: sumY / pointsLen
    };
};
Series.prototype.preventClusterColisions = function (props) {
    var series = this, chart = series.chart, xAxis = series.xAxis, yAxis = series.yAxis, gridX = +props.key.split('-')[1], gridY = +props.key.split('-')[0], gridSize = props.gridSize, groupedData = props.groupedData, zoneOptions = series.options.marker.cluster.zones, defaultRadius = props.defaultRadius, clusterRadius = props.clusterRadius, offsetX = series.computeViewOffset(xAxis), offsetY = series.computeViewOffset(yAxis), gridXPx = gridX * gridSize, gridYPx = gridY * gridSize, xPixel = xAxis.toPixels(props.x) - chart.plotLeft, yPixel = yAxis.toPixels(props.y) - chart.plotTop, gridsToCheckCollision = [], pointsLen = 0, radius = 0, nextXPixel, nextYPixel, signX, signY, cornerGridX, cornerGridY, i, itemX, itemY, nextClusterPos, maxDist, x, y;
    if (xPixel >= 0 &&
        xPixel <= xAxis.len &&
        yPixel >= 0 &&
        yPixel <= yAxis.len) {
        xPixel += offsetX;
        yPixel += offsetY;
        for (i = 1; i < 5; i++) {
            signX = i % 2 === 1 ? -1 : 1;
            signY = i < 3 ? -1 : 1;
            cornerGridX = Math.floor((xPixel + signX * clusterRadius) / gridSize);
            cornerGridY = Math.floor((yPixel + signY * clusterRadius) / gridSize);
            if (cornerGridX !== gridX || cornerGridY !== gridY) {
                gridsToCheckCollision.push(cornerGridY + '-' + cornerGridX);
            }
        }
        gridsToCheckCollision.forEach(function (item) {
            if (groupedData[item]) {
                // Cluster or noise position is already computed.
                if (!groupedData[item].posX) {
                    nextClusterPos = series.computeClusterPosition(groupedData[item]);
                    groupedData[item].posX = nextClusterPos.x;
                    groupedData[item].posY = nextClusterPos.y;
                }
                nextXPixel = xAxis.toPixels(groupedData[item].posX) -
                    chart.plotLeft + offsetX;
                nextYPixel = yAxis.toPixels(groupedData[item].posY) -
                    chart.plotTop + offsetY;
                itemX = +item.split('-')[1];
                itemY = +item.split('-')[0];
                if (zoneOptions) {
                    pointsLen = groupedData[item].length;
                    for (i = 0; i < zoneOptions.length; i++) {
                        if (pointsLen >= zoneOptions[i].from &&
                            pointsLen <= zoneOptions[i].to) {
                            radius = zoneOptions[i].style.radius ||
                                series.options.marker
                                    .cluster.style.radius;
                        }
                    }
                }
                if (groupedData[item].length > 1) {
                    radius = radius !== 0 ? radius :
                        series.options.marker.cluster.style.radius;
                }
                else {
                    radius = defaultRadius;
                }
                maxDist = clusterRadius + radius;
                radius = 0;
                if (itemX !== gridX &&
                    Math.abs(xPixel - nextXPixel) < maxDist) {
                    xPixel = itemX - gridX < 0 ? gridXPx + clusterRadius :
                        gridXPx + gridSize - clusterRadius;
                }
                if (itemY !== gridY &&
                    Math.abs(yPixel - nextYPixel) < maxDist) {
                    yPixel = itemY - gridY < 0 ? gridYPx + clusterRadius :
                        gridYPx + gridSize - clusterRadius;
                }
            }
        });
        x = xAxis.toValue(xPixel + chart.plotLeft - offsetX);
        y = yAxis.toValue(yPixel + chart.plotTop - offsetY);
        groupedData[props.key].posX = x;
        groupedData[props.key].posY = y;
        return {
            x: x,
            y: y
        };
    }
    return {
        x: props.x,
        y: props.y
    };
};
Series.prototype.isValidSplittedDataObject = function (groupedData) {
    var key, result = false, dataObj, i;
    if (!isObject(groupedData)) {
        return false;
    }
    for (key in groupedData) {
        if (Object.prototype.hasOwnProperty.call(groupedData, key)) {
            result = true;
            if (!isArray(groupedData[key]) || !groupedData[key].length) {
                return false;
            }
            for (i = 0; i < groupedData[key].length; i++) {
                dataObj = groupedData[key][i];
                if (!isObject(dataObj) || (!dataObj.x || !dataObj.y)) {
                    return false;
                }
            }
        }
    }
    return result;
};
Series.prototype.getClusteredData = function (groupedData, options) {
    var series = this, minimumClusterSize = options.minimumClusterSize > 2 ?
        options.minimumClusterSize : 2, groupedXData = [], groupedYData = [], clusters = [], // Container for clusters.
    noise = [], // Container for points not belonging to any cluster.
    groupMap = [], index = 0, point, pointOptions, points, pointsLen, clusterPos, clusterTempPos, zoneOptions, clusterZone, clusterZoneClassName, i, k;
    // Check if groupedData is valid when user uses a custom algorithm.
    if (isFunction(options.layoutAlgorithm.type)) {
        if (!series.isValidSplittedDataObject(groupedData)) {
            error('Highcharts marker-clusters module: ' +
                'The custom algorithm result is not valid!', false, series.chart);
            return false;
        }
    }
    for (k in groupedData) {
        if (groupedData[k].length >= minimumClusterSize) {
            points = groupedData[k];
            pointsLen = points.length;
            // Get zone options for cluster.
            if (options.zones) {
                for (i = 0; i < options.zones.length; i++) {
                    if (pointsLen >= options.zones[i].from &&
                        pointsLen <= options.zones[i].to) {
                        clusterZone = options.zones[i];
                        zoneOptions = options.zones[i].style;
                        clusterZoneClassName = options.zones[i].className;
                    }
                }
            }
            clusterTempPos = series.computeClusterPosition(points);
            if (options.layoutAlgorithm.type === 'grid' &&
                !options.allowOverlap) {
                clusterPos = series.preventClusterColisions.call(this, {
                    x: clusterTempPos.x,
                    y: clusterTempPos.y,
                    key: k,
                    groupedData: groupedData,
                    gridSize: options.layoutAlgorithm.processedGridSize,
                    defaultRadius: series.options.marker.radius +
                        series.options.marker.lineWidth,
                    clusterRadius: (zoneOptions && zoneOptions.radius) ?
                        zoneOptions.radius : options.style.radius
                });
            }
            else {
                clusterPos = {
                    x: clusterTempPos.x,
                    y: clusterTempPos.y
                };
            }
            clusters.push({
                x: clusterPos.x,
                y: clusterPos.y,
                id: k,
                index: index,
                data: points,
                clusterZone: clusterZone,
                clusterZoneClassName: clusterZoneClassName
            });
            groupedXData.push(clusterPos.x);
            groupedYData.push(clusterPos.y);
            groupMap.push({
                options: {
                    formatPrefix: 'cluster',
                    dataLabels: options.dataLabels,
                    marker: merge(options.style, {
                        states: options.states
                    }, zoneOptions || {})
                }
            });
            // Save cluster data points options.
            if (series.options.data && series.options.data.length) {
                for (i = 0; i < pointsLen; i++) {
                    points[i].options =
                        series.options.data[points[i].index];
                }
            }
            index++;
            zoneOptions = null;
        }
        else {
            for (i = 0; i < groupedData[k].length; i++) {
                // Points not belonging to any cluster.
                point = groupedData[k][i];
                pointOptions = {};
                groupedXData.push(point.x);
                groupedYData.push(point.y);
                noise.push({
                    x: point.x,
                    y: point.y,
                    id: k,
                    index: index,
                    data: groupedData[k]
                });
                pointOptions = merge(series.options.data[point.index], { x: point.x, y: point.y });
                groupMap.push({
                    options: pointOptions
                });
                index++;
            }
        }
    }
    return {
        clusters: clusters,
        noise: noise,
        groupedXData: groupedXData,
        groupedYData: groupedYData,
        groupMap: groupMap
    };
};
// Destroy clustered data points.
Series.prototype.destroyClusteredData = function () {
    var clusteredSeriesData = this.clusteredSeriesData;
    // Clear previous groups.
    (clusteredSeriesData || []).forEach(function (point, i) {
        if (point) {
            clusteredSeriesData[i] =
                point.destroy ? point.destroy() : null;
        }
    });
    this.clusteredSeriesData = null;
};
// Override the generatePoints method by adding a reference to grouped data.
Series.prototype.generatePoints = function () {
    var series = this, chart = series.chart, marker = series.options.marker, type, algorithm, clusteredData, groupedData, options, point;
    if (marker && marker.cluster && marker.cluster.enabled) {
        type = marker.cluster.layoutAlgorithm.type;
        if (isFunction(type)) {
            algorithm = type;
        }
        else {
            algorithm = series.clusterAlgorithms[type] ?
                series.clusterAlgorithms[type] : series.clusterAlgorithms.grid;
        }
        options = marker.cluster.layoutAlgorithm;
        // Get processed algorithm properties.
        options.processedGridSize = isNumber(options.gridSize) ?
            options.gridSize :
            relativeLength(options.gridSize, 1) * chart.plotWidth;
        options.processedDistance = isNumber(options.distance) ?
            options.distance :
            relativeLength(options.distance, 1) * chart.plotWidth;
        groupedData = algorithm.call(this, series.processedXData, series.processedYData, options);
        clusteredData = series.getClusteredData.call(this, groupedData, marker.cluster);
        if (clusteredData) {
            series.processedXData =
                clusteredData.groupedXData;
            series.processedYData =
                clusteredData.groupedYData;
            series.hasGroupedData = true;
            series.clusters =
                clusteredData;
            series.groupMap =
                clusteredData.groupMap;
        }
        baseGeneratePoints.apply(this);
        if (clusteredData) {
            // Mark cluster points. Safe point reference in the cluster object.
            series.clusters.clusters.forEach(function (cluster) {
                point = series.points[cluster.index];
                point.isCluster = true;
                point.clusteredData = cluster.data;
                point.clusteredDataLen = cluster.data.length;
                cluster.point = point;
            });
            // Safe point reference in the noise object.
            series.clusters.noise.forEach(function (noise) {
                noise.point = series.points[noise.index];
            });
            // Record grouped data in order to let it be destroyed the next time
            // processData runs.
            this.destroyClusteredData();
            this.clusteredSeriesData = this.hasGroupedData ? this.points : null;
        }
    }
    else {
        baseGeneratePoints.apply(this);
    }
};
// Override point prototype to throw a warning when trying to update
// clustered point.
addEvent(Point, 'update', function () {
    if (this.dataGroup) {
        error('Highcharts marker-clusters module: ' +
            'Running `Point.update` when a point is clustered' +
            ' is not supported.', false, this.series.chart);
        return false;
    }
});
// Destroy grouped data on series destroy.
addEvent(Series, 'destroy', Series.prototype.destroyClusteredData);
// Add class for clusters.
addEvent(Series, 'afterRender', function () {
    var series = this;
    if (series.clusters && series.clusters.clusters) {
        series.clusters.clusters.forEach(function (cluster) {
            if (cluster.point && cluster.point.graphic) {
                cluster.point.graphic.addClass('highcharts-cluster-point');
                if (defined(cluster.clusterZone)) {
                    cluster.point.graphic.addClass(cluster.clusterZoneClassName ||
                        'highcharts-cluster-zone-' + cluster.clusterZone);
                }
            }
        });
    }
});
// Cluster zoom on click.
addEvent(H.Point, 'click', function (e) {
    var point = e.point || e.target, series = point.series, xAxis = point.series.xAxis, yAxis = point.series.yAxis, chart = point.series.chart, zoomOnClick, offsetX, offsetY, sortedDataX, sortedDataY, minX, minY, maxX, maxY, temp;
    if (point && point.isCluster) {
        zoomOnClick = series.options.marker.cluster.zoomOnClick;
        if (zoomOnClick) {
            sortedDataX = point.clusteredData.map(function (data) { return data.x; }).sort(function (a, b) { return a - b; });
            sortedDataY = point.clusteredData.map(function (data) { return data.y; }).sort(function (a, b) { return a - b; });
            minX = sortedDataX[0];
            maxX = sortedDataX[sortedDataX.length - 1];
            minY = sortedDataY[0];
            maxY = sortedDataY[sortedDataY.length - 1];
            offsetX = Math.abs((maxX - minX) * 0.1);
            offsetY = Math.abs((maxY - minY) * 0.1);
            chart.pointer.zoomX = true;
            chart.pointer.zoomY = true;
            // Swap when minus values.
            if (minX > maxX) {
                temp = maxX;
                maxX = minX;
                minX = temp;
            }
            if (minY > maxY) {
                temp = maxY;
                maxY = minY;
                minY = temp;
            }
            chart.zoom({
                xAxis: [{
                        axis: xAxis,
                        min: minX - offsetX,
                        max: maxX + offsetX
                    }],
                yAxis: [{
                        axis: yAxis,
                        min: minY - offsetY,
                        max: maxY + offsetY
                    }]
            });
        }
    }
});
