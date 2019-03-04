/* *
 *
 *  Experimental Timeline Series.
 *  Note: This API is in alpha stage and will be changed before final release.
 *
 *  (c) 2010-2019 Highsoft AS
 *
 *  Author: Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    extend = H.extend,
    defined = H.defined,
    LegendSymbolMixin = H.LegendSymbolMixin,
    TrackerMixin = H.TrackerMixin,
    merge = H.merge,
    pick = H.pick,
    Point = H.Point,
    Series = H.Series,
    undocumentedSeriesType = H.seriesType;

/* *
 * The timeline series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.timeline
 *
 * @augments Highcharts.Series
 */
undocumentedSeriesType('timeline', 'line',

    /* *
     * The timeline series presents given events along a drawn line.
     *
     * @sample highcharts/series-timeline/alternate-labels Timeline series
     *
     * @extends      plotOptions.line
     * @since        7.0.0
     * @product      highcharts
     * @excluding    animationLimit, boostThreshold, connectEnds, connectNulls,
     *               cropThreshold, dashStyle, findNearestPointBy,
     *               getExtremesFromAll, lineWidth, negativeColor,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointStart, softThreshold, stacking, step, threshold,
     *               turboThreshold, zoneAxis, zones
     * @optionparent plotOptions.timeline
     */
    {
        colorByPoint: true,
        stickyTracking: false,
        ignoreHiddenPoint: true,
        legendType: 'point',
        lineWidth: 0,
        tooltip: {
            headerFormat: '<span style="color:{point.color}">● </span>' +
            '<span style="font-weight: bold;">{point.point.date}</span><br/>',
            pointFormat: '{point.description}'
        },
        states: {
            hover: {
                lineWidthPlus: 5,
                halo: {
                    size: 0
                }
            }
        },
        dataLabels: {
            enabled: true,
            allowOverlap: true,
            /* *
             * The width of the line connecting the data label to the point.
             *
             *
             * In styled mode, the connector stroke width is given in the
             * `.highcharts-data-label-connector` class.
             *
             * @type {Number}
             * @default 1
             * @sample {highcharts} highcharts/series-timeline/connector-styles
             *         Custom connector width and color
             */
            connectorWidth: 1,
            /* *
             * The color of the line connecting the data label to the point.
             *
             * In styled mode, the connector stroke is given in the
             * `.highcharts-data-label-connector` class.
             *
             * @type {String}
             * @sample {highcharts} highcharts/series-timeline/connector-styles
             *         Custom connector width and color
             */
            connectorColor: '${palette.neutralColor100}',
            backgroundColor: '${palette.backgroundColor}',
            /** @ignore-option */
            formatter: function () {
                var format;

                if (!this.series.chart.styledMode) {
                    format = '<span style="color:' + this.point.color +
                    '">● </span><span style="font-weight: bold;" > ' +
                    (this.point.date || '') + '</span><br/>' +
                    (this.point.label || '');
                } else {
                    format = '<span>● </span>' +
                    '<span>' + (this.point.date || '') +
                    '</span><br/>' + (this.point.label || '');
                }
                return format;
            },
            borderWidth: 1,
            borderColor: '${palette.neutralColor60}',
            /* *
             * A pixel value defining the distance between the data label
             * and the point. Negative numbers puts the label on top
             * of the point.
             *
             * @type {Number}
             * @default 100
             */
            distance: 100,
            /* *
             * Whether to position data labels alternately. For example, if
             * [distance](#plotOptions.timeline.dataLabels.distance) is set
             * equal to `100`, then the first data label 's distance will be
             * set equal to `100`, the second one equal to `-100`, and so on.
             *
             * @type {Boolean}
             * @default true
             * @sample {highcharts} highcharts/series-timeline/alternate-disabled
             *         Alternate disabled
             */
            alternate: true,
            verticalAlign: 'middle',
            color: '${palette.neutralColor80}'
        },
        marker: {
            enabledThreshold: 0,
            symbol: 'square',
            height: 15
        }
    },
    /* *
     * @lends Highcharts.Series#
     */
    {
        requireSorting: false,
        trackerGroups: ['markerGroup', 'dataLabelsGroup'],
        // Use a simple symbol from LegendSymbolMixin
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        // Use a group of trackers from TrackerMixin
        drawTracker: TrackerMixin.drawTrackerPoint,
        init: function () {
            var series = this;

            Series.prototype.init.apply(series, arguments);

            // Distribute data labels before rendering them. Distribution is
            // based on the 'dataLabels.distance' and 'dataLabels.alternate'
            // property.
            addEvent(series, 'drawDataLabels', function () {

                // Delete the oldTextWidth parameter, in order to force
                // adjusting data label wrapper box width. It's needed only when
                // useHTML is enabled. This prevents the data label text getting
                // out of the box range.
                if (series.options.dataLabels.useHTML) {
                    series.points.forEach(function (p) {
                        if (p.visible && p.dataLabel) {
                            delete p.dataLabel.text.oldTextWidth;
                        }
                    });
                }

                // Distribute data labels basing on defined algorithm.
                series.distributeDL();
            });

            addEvent(series, 'afterDrawDataLabels', function () {
                var seriesOptions = series.options,
                    options = seriesOptions.dataLabels,
                    hasRendered = series.hasRendered || 0,
                    defer = pick(options.defer, !!seriesOptions.animation),
                    connectorsGroup = series.connectorsGroup,
                    dataLabel;

                // Create (or redraw) the group for all connectors.
                connectorsGroup = series.plotGroup(
                    'connectorsGroup',
                    'data-labels-connectors',
                    defer && !hasRendered ? 'hidden' : 'visible',
                    options.zIndex || 5
                );

                // Draw or align connector for each point.
                series.points.forEach(function (point) {
                    dataLabel = point.dataLabel;

                    if (dataLabel) {
                        // Within this wrap method is necessary to save the
                        // current animation params, because the data label
                        // target position (after animation) is needed to align
                        // connectors.
                        dataLabel.animate = function (params) {
                            if (this.targetPosition) {
                                this.targetPosition = params;
                            }
                            return H.SVGElement.prototype.animate.apply(
                                this,
                                arguments
                            );
                        };

                        // Initialize the targetPosition field within data label
                        // object. It's necessary because there is need to know
                        // expected position of specific data label, when
                        // aligning connectors. This field is overrided inside
                        // of SVGElement.animate() wrapped  method.
                        if (!dataLabel.targetPosition) {
                            dataLabel.targetPosition = {};
                        }

                        return !point.connector ?
                            point.drawConnector() :
                            point.alignConnector();
                    }
                });
                // Animate connectors group. It's animated in the same way like
                // dataLabels, and also depends on dataLabels.defer parameter.
                if (defer) {
                    connectorsGroup.attr({
                        opacity: +hasRendered
                    });
                    if (!hasRendered) {
                        addEvent(series, 'afterAnimate', function () {
                            if (series.visible) {
                                connectorsGroup.show(true);
                            }
                            connectorsGroup[
                                seriesOptions.animation ? 'animate' : 'attr'
                            ]({
                                opacity: 1
                            }, {
                                duration: 200
                            });
                        });
                    }
                }
            });
        },
        alignDataLabel: function (point, dataLabel) {
            var series = this,
                isInverted = series.chart.inverted,
                visiblePoints = series.visibilityMap.filter(function (point) {
                    return point;
                }),
                visiblePointsCount = series.visiblePointsCount,
                pointIndex = visiblePoints.indexOf(point),
                isFirstOrLast = !pointIndex ||
                pointIndex === visiblePointsCount - 1,
                dataLabelsOptions = series.options.dataLabels,
                userDLOptions = point.userDLOptions || {},
                // Define multiplier which is used to calculate data label
                // width. If data labels are alternate, they have two times more
                // space to adapt (excepting first and last ones, which has only
                // one and half), than in case of placing all data labels side
                // by side.
                multiplier = dataLabelsOptions.alternate ?
                    (isFirstOrLast ? 1.5 : 2) :
                    1,
                distance,
                availableSpace = Math.floor(
                    series.xAxis.len / visiblePointsCount
                ),
                pad = dataLabel.padding,
                targetDLWidth,
                styles;

            // Adjust data label width to the currently available space.
            if (point.visible) {
                distance = Math.abs(
                    userDLOptions.x || point.options.dataLabels.x
                );
                if (isInverted) {
                    targetDLWidth = (
                        (distance - pad) * 2 - (point.itemHeight / 2)
                    );
                    styles = {
                        width: targetDLWidth,
                        // Apply ellipsis when data label height is exceeded.
                        textOverflow: dataLabel.width / targetDLWidth *
                        dataLabel.height / 2 > availableSpace * multiplier ?
                            'ellipsis' : 'none'
                    };
                } else {
                    styles = {
                        width: userDLOptions.width ||
                        dataLabelsOptions.width ||
                        availableSpace * multiplier - (pad * 2)
                    };
                }
                dataLabel.css(styles);

                if (!series.chart.styledMode) {
                    dataLabel.shadow({});
                }
            }
            Series.prototype.alignDataLabel.apply(series, arguments);
        },
        processData: function () {
            var series = this,
                xMap = [],
                base,
                visiblePoints = 0,
                i;

            series.visibilityMap = series.getVisibilityMap();

            // Calculate currently visible points.
            series.visibilityMap.forEach(function (point) {
                if (point) {
                    visiblePoints++;
                }
            });

            series.visiblePointsCount = visiblePoints;
            base = series.xAxis.options.max / visiblePoints;

            // Generate xData map.
            for (i = 1; i <= visiblePoints; i++) {
                xMap.push(
                    (base * i) - (base / 2)
                );
            }

            // Set all hidden points y values as negatives, in order to move
            // them away from plot area. It is necessary to avoid hiding data
            // labels, when dataLabels.allowOverlap is set to false.
            series.visibilityMap.forEach(function (vis, i) {
                if (!vis) {
                    xMap.splice(i, 0, series.yData[i] === null ? null : -99);
                }
            });

            series.xData = xMap;
            series.yData = xMap.map(function (data) {
                return defined(data) ? 1 : null;
            });

            Series.prototype.processData.call(this, arguments);
        },
        generatePoints: function () {
            var series = this;

            Series.prototype.generatePoints.apply(series);
            series.points.forEach(function (point, i) {
                point.applyOptions({
                    x: series.xData[i]
                });
            });
        },
        getVisibilityMap: function () {
            var series = this,
                map = (series.data.length ?
                    series.data : series.userOptions.data
                ).map(function (point) {
                    return (
                        point &&
                        point.visible !== false &&
                        !point.isNull
                    ) ? point : false;
                });

            return map;
        },
        distributeDL: function () {
            var series = this,
                dataLabelsOptions = series.options.dataLabels,
                options,
                pointDLOptions,
                newOptions = {},
                visibilityIndex = 1,
                distance = dataLabelsOptions.distance;

            series.points.forEach(function (point) {
                if (point.visible && !point.isNull) {
                    options = point.options;
                    pointDLOptions = point.options.dataLabels;

                    if (!series.hasRendered) {
                        point.userDLOptions = merge({}, pointDLOptions);
                    }

                    newOptions[series.chart.inverted ? 'x' : 'y'] =
                    dataLabelsOptions.alternate && visibilityIndex % 2 ?
                        -distance : distance;

                    options.dataLabels = merge(newOptions, point.userDLOptions);
                    visibilityIndex++;
                }
            });
        },
        markerAttribs: function (point, state) {
            var series = this,
                seriesMarkerOptions = series.options.marker,
                seriesStateOptions,
                pointMarkerOptions = point.marker || {},
                symbol = (
                    pointMarkerOptions.symbol || seriesMarkerOptions.symbol
                ),
                pointStateOptions,
                width = pick(
                    pointMarkerOptions.width,
                    seriesMarkerOptions.width,
                    series.xAxis.len / series.visiblePointsCount
                ),
                height = pick(
                    pointMarkerOptions.height,
                    seriesMarkerOptions.height
                ),
                radius = 0,
                attribs;

            // Handle hover and select states
            if (state) {
                seriesStateOptions = seriesMarkerOptions.states[state] || {};
                pointStateOptions = pointMarkerOptions.states &&
                pointMarkerOptions.states[state] || {};

                radius = pick(
                    pointStateOptions.radius,
                    seriesStateOptions.radius,
                    radius + (
                        seriesStateOptions.radiusPlus ||
                    0
                    )
                );
            }

            point.hasImage = symbol && symbol.indexOf('url') === 0;

            attribs = {
                x: Math.floor(point.plotX) - (width / 2) - (radius / 2),
                y: point.plotY - (height / 2) - (radius / 2),
                width: width + radius,
                height: height + radius
            };

            return attribs;

        },
        bindAxes: function () {
            var series = this,
                timelineXAxis = {
                    gridLineWidth: 0,
                    lineWidth: 0,
                    min: 0,
                    dataMin: 0,
                    minPadding: 0,
                    max: 100,
                    dataMax: 100,
                    maxPadding: 0,
                    title: null,
                    tickPositions: []
                },
                timelineYAxis = {
                    gridLineWidth: 0,
                    min: 0.5,
                    dataMin: 0.5,
                    minPadding: 0,
                    max: 1.5,
                    dataMax: 1.5,
                    maxPadding: 0,
                    title: null,
                    labels: {
                        enabled: false
                    }
                };

            Series.prototype.bindAxes.call(series);
            extend(series.xAxis.options, timelineXAxis);
            extend(series.yAxis.options, timelineYAxis);
        }
    },
    /* *
     * @lends Highcharts.Point#
     */
    {
        init: function () {
            var point = Point.prototype.init.apply(this, arguments);

            point.name = pick(point.name, point.date, 'Event');
            point.y = 1;

            return point;
        },
        // The setVisible method is taken from Pie series prototype, in order to
        // prevent importing whole Pie series.
        setVisible: function (vis, redraw) {
            var point = this,
                series = point.series,
                chart = series.chart,
                ignoreHiddenPoint = series.options.ignoreHiddenPoint;

            redraw = pick(redraw, ignoreHiddenPoint);

            if (vis !== point.visible) {

                // If called without an argument, toggle visibility
                point.visible = point.options.visible = vis =
                vis === undefined ? !point.visible : vis;
                // update userOptions.data
                series.options.data[series.data.indexOf(point)] = point.options;

                // Show and hide associated elements. This is performed
                // regardless of redraw or not, because chart.redraw only
                // handles full series.
                ['graphic', 'dataLabel', 'connector'].forEach(
                    function (key) {
                        if (point[key]) {
                            point[key][vis ? 'show' : 'hide'](true);
                        }
                    }
                );

                if (point.legendItem) {
                    chart.legend.colorizeItem(point, vis);
                }

                // #4170, hide halo after hiding point
                if (!vis && point.state === 'hover') {
                    point.setState('');
                }

                // Handle ignore hidden slices
                if (ignoreHiddenPoint) {
                    series.isDirty = true;
                }

                if (redraw) {
                    chart.redraw();
                }
            }
        },
        setState: function () {
            var proceed = Series.prototype.pointClass.prototype.setState;

            // Prevent triggering the setState method on null points.
            if (!this.isNull) {
                proceed.apply(this, arguments);
            }
        },
        getConnectorPath: function () {
            var point = this,
                chart = point.series.chart,
                xAxisLen = point.series.xAxis.len,
                inverted = chart.inverted,
                direction = inverted ? 'x2' : 'y2',
                dl = point.dataLabel,
                targetDLPos = dl.targetPosition,
                coords = {
                    x1: point.plotX,
                    y1: point.plotY,
                    x2: point.plotX,
                    y2: targetDLPos.y || dl.y
                },
                negativeDistance = (
                    coords[direction] < point.series.yAxis.len / 2
                ),
                path;

            // Recalculate coords when the chart is inverted.
            if (inverted) {
                coords = {
                    x1: point.plotY,
                    y1: xAxisLen - point.plotX,
                    x2: targetDLPos.x || dl.x,
                    y2: xAxisLen - point.plotX
                };
            }

            // Subtract data label width or height from expected coordinate so
            // that the connector would start from the appropriate edge.
            if (negativeDistance) {
                coords[direction] += dl[inverted ? 'width' : 'height'];
            }

            path = chart.renderer.crispLine([
                'M',
                coords.x1,
                coords.y1,
                'L',
                coords.x2,
                coords.y2
            ], dl.options.connectorWidth || 1);

            return path;
        },
        drawConnector: function () {
            var point = this,
                series = point.series,
                dlOptions = point.dataLabel.options = merge(
                    {}, series.options.dataLabels,
                    point.options.dataLabels
                );

            point.connector = series.chart.renderer
                .path(point.getConnectorPath())
                .add(series.connectorsGroup);

            if (!series.chart.styledMode) {
                point.connector.attr({
                    stroke: dlOptions.connectorColor,
                    'stroke-width': dlOptions.connectorWidth,
                    opacity: point.dataLabel.opacity
                });
            }
        },
        alignConnector: function () {
            var point = this,
                connector = point.connector,
                bBox = connector.getBBox(),
                isVisible = bBox.y > 0;

            connector[isVisible ? 'animate' : 'attr']({
                d: point.getConnectorPath()
            });
        }
    });

// Hide/show connector related with a specific data label, after overlapping
// detected.
addEvent(H.Chart, 'afterHideOverlappingLabels', function () {
    var series = this.series,
        dataLabel,
        connector;

    series.forEach(function (series) {
        if (series.points) {
            series.points.forEach(function (point) {
                dataLabel = point.dataLabel;
                connector = point.connector;

                if (
                    dataLabel &&
                    dataLabel.targetPosition &&
                    connector
                ) {
                    connector.attr({
                        opacity: dataLabel.targetPosition.opacity ||
                            dataLabel.newOpacity
                    });
                }
            });
        }
    });
});

/* *
 * The `timeline` series. If the [type](#series.timeline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.timeline
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, findNearestPointBy,
 *            getExtremesFromAll, lineWidth, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointStart,
 *            softThreshold, stacking, stack, step, threshold, turboThreshold,
 *            zoneAxis, zones
 * @product   highcharts
 * @apioption series.timeline
 */

/* *
 * An array of data points for the series. For the `timeline` series type,
 * points can be given with three general parameters, `date`, `label`,
 * and `description`:
 *
 * Example:
 *
 * ```js
 * series: [{
 *    type: 'timeline',
 *    data: [{
 *        date: 'Jan 2018',
 *        label: 'Some event label',
 *        description: 'Description to show in tooltip'
 *    }]
 * }]
 * ```
 *
 * @sample {highcharts} highcharts/series-timeline/alternate-labels
 *         Alternate labels
 *
 * @type      {Array<*>}
 * @extends   series.line.data
 * @excluding marker, x, y
 * @product   highcharts
 * @apioption series.timeline.data
 */

/* *
 * The date of event.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.date
 */

/* *
 * The label of event.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.label
 */

/* *
 * The description of event. This description will be shown in tooltip.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.description
 */
