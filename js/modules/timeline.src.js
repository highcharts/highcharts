/**
 * @license  @product.name@ JS v@product.version@ (@product.date@)
 * Timeline series
 *
 * (c) 2010-2018 Highsoft AS
 * Author: Daniel Studencki
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    each = H.each,
    extend = H.extend,
    merge = H.merge,
    pick = H.pick,
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    SVGElement = H.SVGElement,
    wrap = H.wrap;

/**
 * Utils
 */

// Utility to check, whether the SVGElement is visible
extend(SVGElement.prototype, {
    isVisible: function () {
        return this.visibility !== 'hidden' ? true : false;
    }
});

// Within this wrap method is necessary to save the current animation params,
// because the data label target position (after animation) is needed to align
// connectors.
wrap(H.SVGElement.prototype, 'animate', function (proceed, params) {
    if (this.targetPosition) {
        this.targetPosition = params;
    }
    return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});

/**
 * Timeline Series definition.
 */

seriesType('timeline', 'line', {
    showInLegend: false,
    colorByPoint: true,
    stickyTracking: false,
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
        backgroundColor: '#fff',
        format: '<span style="color:{point.color}">● </span>' +
            '<span style="font-weight: bold;>{point.date}</span><br/>' +
            '{point.label}',
        borderWidth: 1,
        borderColor: 'gray',
        distance: 100,
        alternate: true,
        verticalAlign: 'middle',
        color: '#000'
    },
    marker: {
        enabledThreshold: 0,
        symbol: 'square',
        radius: 10,
        height: 15
    }
}, {
    alignDataLabel: function () {
        var series = this,
            xAxis = series.xAxis,
            xAxisLen = xAxis.len,
            points = series.points,
            point = arguments[0],
            pointIndex = points.indexOf(point),
            isFirstOrLast = !pointIndex || pointIndex === points.length - 1,
            dataLabelsOptions = series.options.dataLabels,
            alternate = dataLabelsOptions.alternate,
            multiplier = alternate ?
            (isFirstOrLast ? 1.5 : 2) :
            1,
            dataLabel = arguments[1],
            padding = dataLabel.padding,
            dataLabelWidth = dataLabelsOptions.width || (Math.floor(
                xAxisLen / points.length
            ) * multiplier - (padding * 2));

        // Adjust data label width to the currently available value.
        dataLabel.css({
            width: dataLabelWidth
        });
        Series.prototype.alignDataLabel.apply(series, arguments);
    },
    getMappedXData: function () {
        var series = this,
            xMap = [],
            pointsLen = series.xData.length,
            max = series.xAxis.options.max,
            base = max / pointsLen;

        for (var i = 1; i <= pointsLen; i++) {
            xMap.push(
                (base * i) - (base / 2)
            );
        }

        return xMap;
    },
    distributeDL: function (hasRendered) {
        var series = this,
            chart = this.chart,
            points = series.points,
            dataLabelsOptions = series.options.dataLabels,
            options,
            pointDLOptions,
            newOptions = {},
            index,
            isInverted = chart.inverted,
            offset,
            distance = dataLabelsOptions.distance,
            alternate = dataLabelsOptions.alternate;

        each(points, function (point) {
            options = point.options;
            index = points.indexOf(point);
            pointDLOptions = point.options.dataLabels;

            if (!hasRendered) {
                point.userDataLabelOptions = merge({}, pointDLOptions);
            }

            if (alternate) {
                offset = index % 2 ? -distance : distance;
                if (isInverted) {
                    offset = -offset;
                }
            }

            newOptions[isInverted ? 'x' : 'y'] = offset || distance;

            options.dataLabels = merge(newOptions, point.userDataLabelOptions);
        });
    },
    markerAttribs: function (point, state) {
        var series = this,
            points = series.points,
            xAxis = series.xAxis,
            xAxisLen = xAxis.len,
            seriesMarkerOptions = series.options.marker,
            seriesStateOptions,
            pointMarkerOptions = point.marker || {},
            symbol = pointMarkerOptions.symbol || seriesMarkerOptions.symbol,
            pointStateOptions,
            width = pick(
                pointMarkerOptions.width,
                seriesMarkerOptions.width,
                xAxisLen / points.length
            ),
            height = pick(
                pointMarkerOptions.height,
                seriesMarkerOptions.height
            ),
            radius = 0,
            attribs;

        // Handle hover and select states
        if (state) {
            seriesStateOptions = seriesMarkerOptions.states[state];
            pointStateOptions = pointMarkerOptions.states &&
                pointMarkerOptions.states[state];

            radius = pick(
                pointStateOptions && pointStateOptions.radius,
                seriesStateOptions && seriesStateOptions.radius,
                radius + (
                    seriesStateOptions && seriesStateOptions.radiusPlus ||
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
        var timelineXAxis = {
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
        Series.prototype.bindAxes.call(this);
        extend(this.xAxis.options, timelineXAxis);
        extend(this.yAxis.options, timelineYAxis);
    },
    translate: function () {
        var series = this,
            points = series.points,
            xMap;

        if (points) {
            xMap = series.mappedXData = this.getMappedXData();

            each(points, function (point, i) {
                point.applyOptions({
                    x: xMap[i]
                });
            });
        }
        Series.prototype.translate.call(this);
    }
}, {
    init: function () {
        var args = arguments,
            point = Point.prototype.init.apply(this, args),
            xMap = args[0].mappedXData;

        point.applyOptions({
            x: xMap[args[2]],
            y: 1
        });

        return point;
    },
    getConnectorPath: function () {
        var point = this,
            chart = this.series.chart,
            xAxisLen = point.series.xAxis.len,
            yAxisLen = point.series.yAxis.len,
            inverted = chart.inverted,
            dl = point.dataLabel,
            targetDLPos = dl.targetPosition,
            coords = {
                x1: inverted ? point.plotY : point.plotX,
                y1: inverted ? xAxisLen - point.plotX : point.plotY,
                x2: inverted ? targetDLPos.x || dl.x : point.plotX,
                y2: inverted ? xAxisLen - point.plotX : targetDLPos.y || dl.y
            },
            negativeDistance = coords[inverted ? 'x2' : 'y2'] < yAxisLen / 2,
            path;

        // Subtract data label width or height from expected coordinate so that
        // the connector would start from the appropriate edge.
        if (negativeDistance) {
            coords[inverted ? 'x2' : 'y2'] += dl[inverted ? 'width' : 'height'];
        }

        path = [
            'M',
            coords.x1,
            coords.y1,
            'L',
            coords.x2,
            coords.y2
        ];

        return path;
    },
    drawConnector: function () {
        var point = this,
            series = point.series,
            chart = series.chart,
            connectorsGroup = series.dataLabelsConnectorsGroup,
            renderer = chart.renderer,
            options = {
                stroke: '#000',
                'stroke-width': 1,
                opacity: point.dataLabel.opacity
            },
            path = point.getConnectorPath();

        point.connector = renderer.path(path)
            .attr(options)
            .add(connectorsGroup);
    },
    alignConnector: function () {
        var point = this,
            connector = point.connector,
            path = point.getConnectorPath();

        connector.attr({
            d: path
        });
    }
});

addEvent(H.Chart, 'afterHideOverlappingLabels', function () {
    var series = this.series;

    each(series, function (series) {
        each(series.points, function (point) {
            if (
                point.dataLabel &&
                point.dataLabel.targetPosition &&
                point.connector
            ) {
                point.connector.attr({
                    opacity: point.dataLabel.targetPosition.opacity ||
                        point.dataLabel.newOpacity
                });
            }
        });
    });
});

addEvent(H.seriesTypes.timeline, 'render', function () {
    var series = this.series || [],
        isDLVisible;

    each(series, function (s) {
        each(s.points, function (point) {
            isDLVisible = point.dataLabel.isVisible();
            point.connector[!isDLVisible ? 'hide' : 'show']();
        });
    });
});

addEvent(H.seriesTypes.timeline, 'afterInit', function () {
    var series = this;

    series.mappedXData = this.getMappedXData();
});

addEvent(H.seriesTypes.timeline, 'beforeDrawDataLabels', function () {
    var series = this,
        hasRendered = series.hasRendered;

    // Distribute data labels basing on defined algorithm.
    series.distributeDL(hasRendered);
});

addEvent(H.seriesTypes.timeline, 'afterDrawDataLabels', function () {
    var series = this,
        points = series.points,
        seriesOptions = series.options,
        options = seriesOptions.dataLabels,
        hasRendered = series.hasRendered || 0,
        defer = pick(options.defer, !!seriesOptions.animation),
        connectorsGroup = series.dataLabelsConnectorsGroup;

    connectorsGroup = series.plotGroup(
        'dataLabelsConnectorsGroup',
        'data-labels-connectors',
        defer && !hasRendered ? 'hidden' : 'visible',
        options.zIndex || 5
    );

    // Draw or align connector for each point.
    each(points, function (point) {

        // Initiate the targetPosition field within data label object. It's
        // necessary because there is need to know expected position of specific
        // data label, when aligning connectors. This field is overrided inside
        // of SVGElement.animate() wrapped method.
        if (!point.dataLabel.targetPosition) {
            point.dataLabel.targetPosition = {};
        }

        return !point.connector ?
            point.drawConnector() :
            point.alignConnector();
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
