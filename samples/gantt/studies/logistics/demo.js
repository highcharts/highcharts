
// Logistics module start ---------------
// This module adds heat indicators, idle time, and earliest possible return
// indicators.

(function (Highcharts) {
    var draw = (function () {
        var isFn = function (x) {
            return typeof x === 'function';
        };

        /**
         * draw - Handles the drawing of a point.
         * TODO: add type checking.
         *
         * @param  {object} params Parameters.
         * @return {undefined} Returns undefined.
         */
        var draw = function draw(params) {
            var point = this,
                graphic = point.graphic,
                animate = params.animate,
                attr = params.attr,
                onComplete = params.onComplete,
                css = params.css,
                group = params.group,
                renderer = params.renderer,
                shape = params.shapeArgs,
                type = params.shapeType;

            if (point.shouldDraw()) {
                if (!graphic) {
                    point.graphic = graphic = renderer[type](shape).add(group);
                }
                graphic.css(css).attr(attr)
                    .animate(animate, undefined, onComplete);
            } else if (graphic) {
                graphic.animate(animate, undefined, function () {
                    point.graphic = graphic = graphic.destroy();
                    if (isFn(onComplete)) {
                        onComplete();
                    }
                });
            }
            if (graphic) {
                graphic.addClass(point.getClassName(), true);
            }
        };
        return draw;
    }());

    var renderHeatIndicators = (function (Highcharts, draw) {

        var each = Highcharts.each,
            extend = Highcharts.extend,
            isFunction = function (x) {
                return typeof x === 'function';
            },
            isNumber = Highcharts.isNumber,
            merge = Highcharts.merge,
            reduce = Highcharts.reduce,
            objectEach = Highcharts.objectEach;

        var defaultOptions = {
            color: {
                linearGradient: {
                    x1: 0,
                    x2: 1,
                    y1: 0,
                    y2: 0
                },
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [0.8, 'rgb(255, 0, 0)']
                ]
            }
        };

        var HeatIndicator = function (params) {
            var indicator = this;
            indicator.init(params);
            return indicator;
        };

        HeatIndicator.prototype = {
            destroy: function () {
                var indicator = this;

                if (indicator.graphic) {
                    indicator.graphic = indicator.graphic.destroy();
                }

                objectEach(indicator, function (val, key) {
                    indicator[key] = null;
                    delete indicator[key];
                });

                return undefined;
            },
            draw: draw,
            getClassName: function () {
                return 'highcharts-heat-indicator';
            },
            init: function (params) {
                var indicator = this;

                // Set properties on the indicator.
                extend(indicator, {
                    group: params.group,
                    metrics: params.metrics,
                    renderer: params.renderer,
                    xAxis: params.xAxis,
                    yAxis: params.yAxis
                });

                indicator.options = merge(defaultOptions, params.options);

                // Return a reference to the indicator.
                return indicator;
            },
            render: function () {
                var indicator = this,
                    metrics = indicator.metrics,
                    xAxis = indicator.xAxis,
                    yAxis = indicator.yAxis,
                    options = indicator.options,
                    start = isNumber(indicator.start) ?
                        indicator.start : xAxis.min,
                    end = isNumber(indicator.end) ?
                        indicator.end : xAxis.max,
                    x1 = xAxis.translate(start, 0, 0, 0, 1),
                    x2 = xAxis.translate(end, 0, 0, 0, 1),
                    plotY = yAxis.translate(indicator.y, 0, 1, 0, 1),
                    y1 = plotY,
                    y2 = plotY + metrics.width / 2,
                    animate = {},
                    attr = {
                        fill: options.color
                    };

                // Animate only the width if the graphic is new.
                if (!indicator.graphic) {
                    extend(attr, {
                        x: x1,
                        y: y1,
                        width: 0,
                        height: y2 - y1
                    });
                    animate.width = x2 - x1;
                } else {
                    extend(animate, {
                        x: x1,
                        y: y1,
                        width: x2 - x1,
                        height: y2 - y1
                    });
                }

                // Draw or destroy the graphic
                indicator.draw({
                    animate: animate,
                    attr: attr,
                    css: undefined,
                    group: indicator.group,
                    renderer: indicator.renderer,
                    shapeArgs: undefined,
                    shapeType: 'rect'
                });
            },
            shouldDraw: function () {
                var indicator = this,
                    options = indicator.options || {},
                    filter = options.filter,
                    start = indicator.start,
                    end = indicator.end,
                    y = indicator.y;

                return (
                    options.enabled === true &&
                    isNumber(start) &&
                    isNumber(end) &&
                    isNumber(y) &&
                    start < end &&
                    (isFunction(filter) ? filter(indicator) : true)
                );
            },
            update: function (params) {
                var indicator = this;
                extend(indicator, params);
                this.render();
            }
        };

        var calculateSeriesIdleTime = function (series) {
            var points = series.points
                .slice() // Make a copy before sorting.
                .sort(function (a, b) {
                    return b.start - a.start;
                }),
                xAxis = series.xAxis,
                min = xAxis.min,
                firstPoint = points[points.length - 1].start,
                totalIdle = firstPoint > min ? firstPoint - min : 0,
                max = xAxis.max;

            reduce(points, function (next, current) {
                var start = current.end,
                    end = next ? next.start : max,
                    idle = (start < end) ? end - start : 0,
                    visibleIdle = Math.min(end, max) - Math.max(start, min);
                visibleIdle = visibleIdle > 0 ? visibleIdle : 0;
                current.idle = idle;
                totalIdle += visibleIdle;
                return current;
            }, undefined);
            series.idle = totalIdle;
        };

        var renderHeatIndicators = function (series) {
            var options = series.options && series.options.heatIndicator || {};

            // TODO Several modules are dependent upon this, it should be added
            // as a dependency somehow.
            calculateSeriesIdleTime(series);

            each(series.points, function (point) {
                // Get existing indicator from point, or create a new one.
                var heatIndicator = point.heatIndicator || new HeatIndicator({
                    group: series.group,
                    metrics: series.columnMetrics,
                    xAxis: series.xAxis,
                    yAxis: series.yAxis,
                    options: options,
                    renderer: series.chart.renderer
                });

                // Update the indicator. Rerenders the graphic with new values.
                heatIndicator.update({
                    y: point.y,
                    start: point.end,
                    end: point.end + point.idle
                });

                // Set the resulting indicator on the point.
                point.heatIndicator = heatIndicator;
            });
        };

        return renderHeatIndicators;
    }(Highcharts, draw));

    var renderEPRIndicators = (function (Highcharts, draw) {

        var each = Highcharts.each,
            objectEach = Highcharts.objectEach,
            extend = Highcharts.extend,
            isNumber = Highcharts.isNumber,
            merge = Highcharts.merge;

        var defaultOptions = {
            color: 'rgb(255, 0, 0)',
            lineWidth: 1,
            dashstyle: 'dash'
        };

        var EPRIndicator = function (params) {
            var indicator = this;
            indicator.init(params);
            return indicator;
        };

        EPRIndicator.prototype = {
            destroy: function () {
                var indicator = this;

                if (indicator.graphic) {
                    indicator.graphic = indicator.graphic.destroy();
                }

                objectEach(indicator, function (val, key) {
                    indicator[key] = null;
                    delete indicator[key];
                });

                return undefined;
            },
            draw: draw,
            getClassName: function () {
                return 'highcharts-eap-indicator';
            },
            init: function (params) {
                var indicator = this;

                // Set properties on the indicator.
                extend(indicator, {
                    group: params.group,
                    metrics: params.metrics,
                    renderer: params.renderer,
                    xAxis: params.xAxis,
                    yAxis: params.yAxis
                });

                indicator.options = merge(defaultOptions, params.options);

                // Return a reference to the indicator.
                return indicator;
            },
            render: function () {
                var indicator = this,
                    renderer = indicator.renderer,
                    metrics = indicator.metrics,
                    options = indicator.options,
                    lineWidth = options.lineWidth,
                    plotX = indicator.xAxis.translate(indicator.x, 0, 0, 0, 1),
                    plotY = indicator.yAxis.translate(indicator.y, 0, 1, 0, 1),
                    x1 = plotX,
                    x2 = plotX,
                    y1 = plotY - metrics.width / 2,
                    y2 = plotY + metrics.width / 2,
                    path = renderer.crispLine(
                        ['M', x1, y1, 'L', x2, y2], lineWidth
                    ),
                    attr = {
                        stroke: options.color,
                        'stroke-width': lineWidth,
                        dashstyle: options.dashstyle
                    },
                    animate = {};

                // Animate if the graphic is not new.
                if (!indicator.graphic) {
                    attr.d = path;
                } else {
                    animate.d = path;
                }

                // Draw or destroy the graphic
                indicator.draw({
                    animate: animate,
                    attr: attr,
                    css: undefined,
                    group: indicator.group,
                    renderer: indicator.renderer,
                    shapeArgs: undefined,
                    shapeType: 'path'
                });
            },
            shouldDraw: function () {
                var indicator = this,
                    x = indicator.x,
                    y = indicator.y;

                return (
                    indicator.enabled === true && isNumber(x) && isNumber(y)
                );
            },
            update: function (params) {
                var indicator = this;
                extend(indicator, params);
                this.render();
            }
        };

        var renderEPRIndicators = function (series) {
            each(series.points, function (point) {
                var options = point.options && point.options.indicator || {},
                    // point.options.indicator is copied to point.indicator, so
                    // we use point.indicatorObj instead.
                    indicator = point.indicatorObj || new EPRIndicator({
                        group: series.group,
                        metrics: series.columnMetrics,
                        xAxis: series.xAxis,
                        yAxis: series.yAxis,
                        renderer: series.chart.renderer
                    });
                indicator.update({
                    enabled: options.enabled,
                    x: options.x ? point.start + options.x : point.start,
                    y: point.y
                });

                point.indicatorObj = indicator;
            });
        };

        return renderEPRIndicators;
    }(Highcharts, draw));

    (function (Highcharts, renderHeatIndicators, renderEPRIndicators) {
        var Series = Highcharts.Series;
        // Add heat indicator functionality to Highcharts Series.
        Highcharts.addEvent(Series, 'afterRender', function () {
            var series = this;
            renderEPRIndicators(series);
            renderHeatIndicators(series);
        });
    }(Highcharts, renderHeatIndicators, renderEPRIndicators));

}(Highcharts));

// ---- Logistics module end


var today = +Date.now(),
    minutes = 60 * 1000,
    hours = 60 * minutes,
    days = 24 * hours,
    dateFormat = function (date) {
        var format = '%e. %b';
        return Highcharts.dateFormat(format, date);
    };

var information = {
    events: {
        loading: {
            color: '#395627',
            tooltipFormatter: function (point) {
                return [
                    '<b>Loading</b><br/>',
                    'Start: ' + dateFormat(point.start) + '<br/>',
                    'End: ' + dateFormat(point.end) + '<br/>'
                ].join('');
            }
        },
        voyage: {
            color: '#558139',
            tooltipFormatter: function (point) {
                var indicator = point.indicator;
                return [
                    '<b>Voyage</b><br/>',
                    'Start: (' + point.startLocation + ') ' +
                        dateFormat(point.start) + '<br/>',
                    'End: (' + point.endLocation + ') ' +
                        dateFormat(point.end) + '<br/>',
                    indicator ? 'EPR: ' + dateFormat(indicator.x) : ''
                ].join('');
            }
        },
        unloading: {
            color: '#aad091',
            tooltipFormatter: function (point) {
                return [
                    '<b>Unloading</b><br/>',
                    'Start: ' + dateFormat(point.start) + '<br/>',
                    'End: ' + dateFormat(point.end) + '<br/>'
                ].join('');
            }
        }
    },
    vessels: [{
        name: 'Vessel 1',
        utilized: 95,
        idle: 10,
        trips: [{
            name: 'Contract 1',
            start: today + days,
            voyages: [{
                duration: 21 * days,
                startLocation: 'USGLS',
                endLocation: 'BEZEE',
                loadDuration: 1 * days + 2 * hours + 45 * minutes,
                unloadDuration: 1 * days + 2 * hours + 45 * minutes
            }, {
                duration: 11 * days,
                startLocation: 'BEZEE',
                endLocation: 'USCP6',
                loadDuration: 0,
                unloadDuration: 0,
                color: '#c6dfb6'
            }]
        }, {
            name: 'Contract 5',
            start: today + 50 * days,
            voyages: [{
                duration: 7 * days,
                startLocation: 'USGLS',
                endLocation: 'BEZEE',
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 1 * days + 2 * hours + 45 * minutes
            }, {
                duration: 7 * days,
                startLocation: 'BEZEE',
                endLocation: 'USCP6',
                loadDuration: 0,
                unloadDuration: 1 * days + 4 * hours,
                color: '#c6dfb6'
            }, {
                duration: 19 * days,
                startLocation: 'USCP6',
                endLocation: 'NOVIS',
                loadDuration: 0,
                unloadDuration: 0
            }]
        }]
    }, {
        name: 'Vessel 2',
        utilized: 75,
        idle: 23,
        trips: [{
            name: 'Contract 2',
            start: today - 5 * days,
            voyages: [{
                duration: 13 * days,
                startLocation: 'USGLS',
                endLocation: 'BEZEE',
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 2 * days + 2 * hours + 45 * minutes
            }, {
                duration: 8 * days,
                startLocation: 'BEZEE',
                endLocation: 'USCP6',
                loadDuration: 0,
                unloadDuration: 0,
                color: '#c6dfb6'
            }],
            earliestPossibleReturn: (today - 5 * days) + 20 * days
        }, {
            name: 'Contract 3',
            start: today + 23 * days,
            voyages: [{
                duration: 5 * days,
                startLocation: 'USGLS',
                endLocation: 'BEZEE',
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 2 * days + 2 * hours + 45 * minutes
            }, {
                duration: 14 * days,
                startLocation: 'BEZEE',
                endLocation: 'USCP6',
                loadDuration: 0,
                unloadDuration: 0,
                color: '#c6dfb6'
            }]
        }, {
            name: 'Contract 4',
            start: today + 60 * days,
            voyages: [{
                duration: 11 * days,
                startLocation: 'USGLS',
                endLocation: 'BEZEE',
                loadDuration: 2 * days + 2 * hours + 45 * minutes,
                unloadDuration: 2 * days + 2 * hours + 45 * minutes
            }, {
                duration: 6 * days,
                startLocation: 'BEZEE',
                endLocation: 'USCP6',
                loadDuration: 0,
                unloadDuration: 0,
                color: '#c6dfb6'
            }]
        }]
    }]
};
var find = Highcharts.find;

var getPoint = function (params) {
    var start = params.start,
        tripName = params.tripName,
        type = params.type,
        vessel = params.vessel,
        duration = params.duration,
        voyage = params.voyage,
        indicator,
        earliestPossibleReturn = params.epr,
        end = start + duration;

    indicator = (
        (
            Highcharts.isNumber(earliestPossibleReturn) &&
            start < earliestPossibleReturn &&
            earliestPossibleReturn < end
        ) ?
        {
            enabled: true,
            x: earliestPossibleReturn - start
        } :
        undefined
    );

    return {
        start: start,
        end: end,
        color: voyage && voyage.color || information.events[type].color,
        vessel: vessel.name,
        indicator: indicator,
        y: params.y,
        type: type,
        startLocation: voyage && voyage.startLocation,
        endLocation: voyage && voyage.endLocation,
        name: tripName,
        trip: tripName,
        enableResize: type === 'voyage'
    };
};

var getGroupFromTrip = function (trip, vessel, y) {
    return trip.voyages.reduce(function (group, voyage) {
        var points = [];

        if (voyage.loadDuration) {
            points.push(getPoint({
                start: group.end,
                duration: voyage.loadDuration,
                tripName: trip.name,
                type: 'loading',
                vessel: vessel,
                y: y
            }));
            group.end += voyage.loadDuration;
        }

        points.push(getPoint({
            start: group.end,
            duration: voyage.duration,
            voyage: voyage,
            epr: trip.earliestPossibleReturn,
            tripName: trip.name,
            type: 'voyage',
            vessel: vessel,
            y: y
        }));
        group.end += voyage.duration;

        if (voyage.unloadDuration) {
            points.push(getPoint({
                start: group.end,
                duration: voyage.unloadDuration,
                tripName: trip.name,
                type: 'unloading',
                vessel: vessel,
                y: y
            }));
            group.end += voyage.unloadDuration;
        }

        // Add the points
        group.points = group.points.concat(points);
        return group;
    }, {
        end: trip.start, // Previous point end
        points: []
    });
};

var getSeriesFromInformation = function (info) {
    var vessels = info.vessels;
    return vessels.map(function (vessel, i) {
        var data = vessel.trips.reduce(function (result, trip) {
            var group = getGroupFromTrip(trip, vessel, i);
            return result.concat(group.points);
        }, []);

        // One series per vessel
        return {
            name: vessel.name,
            data: data,
            id: i
        };
    });
};

var getCategoryFromIdleTime = function (utilized, idle) {
    var thresholds = {
            25: 'bad',
            50: 'ok',
            75: 'good',
            100: 'great'
        },
        threshold = find(Object.keys(thresholds), function (threshold) {
            return utilized < +threshold;
        }),
        className = thresholds[threshold];
    return [
        '<span class="info-span ' + className + '">',
        '    <span class="utilized">' + utilized + '%</span><br/>',
        '    <span>t: ' + idle + ' days</span>',
        '</span>'
    ].join('\n');
};

var leftLabelFormat = function () {
    if (this.point.type === 'voyage') {
        return this.point.startLocation;
    }
};

var centerLabelFormat = function () {
    if (this.point.type === 'voyage') {
        return ' ' + this.point.name + ' ';
    }
};

var rightLabelFormat = function () {
    if (this.point.type === 'voyage') {
        return this.point.endLocation;
    }
};

var gridColumnFormatterSeriesName = function () {
    var chart = this.chart,
        series = chart.get(this.value);
    return series.name;
};

var gridColumnFormatterSeriesIdle = function () {
    var chart = this.chart,
        series = chart.get(this.value),
        xAxis = series.xAxis,
        total = xAxis.max - xAxis.min,
        idle = series.idle || 0,
        used = total - idle,
        percentage = Math.round((100 / total) * used),
        idleDays = Math.round(idle / days);
    return getCategoryFromIdleTime(percentage, idleDays);
};

var tooltipFormatter = function () {
    var point = this.point,
        trip = point.trip,
        series = point.series,
        formatter = information.events[point.type].tooltipFormatter;
    return '<b>' + trip + ' - ' + series.name + '</b><br/>' + formatter(point);
};

var xAxisMin = today - (10 * days),
    xAxisMax = xAxisMin + 90 * days;

Highcharts.ganttChart('container', {
    plotOptions: {
        series: {
            dragDrop: {
                draggableX: true,
                draggableY: true,
                enableResize: true,
                groupBy: 'trip'
            },
            heatIndicator: {
                enabled: true,
                filter: function (indicator) {
                    var start = indicator.start,
                        end = indicator.end,
                        idleTime = end - start;
                    return idleTime > (10 * days);
                }
            },
            stickyTracking: true,
            cursor: 'move',
            borderRadius: 0,
            borderWidth: 0,
            pointPadding: 0,
            dataLabels: [{
                enabled: true,
                labelrank: 1,
                formatter: leftLabelFormat,
                align: 'left',
                style: {
                    fontSize: '8px'
                }
            }, {
                enabled: true,
                labelrank: 2,
                formatter: centerLabelFormat,
                align: 'center',
                borderWidth: 1,
                padding: 3,
                style: {
                    fontSize: '10px'
                }
            }, {
                enabled: true,
                labelrank: 1,
                formatter: rightLabelFormat,
                align: 'right',
                style: {
                    fontSize: '8px'
                }
            }],
            point: {
                events: {
                    drop: function (e) {
                        // We want to move a point to a new series on drop,
                        // since we have one series per y value.
                        var newSeries = this.series.chart.get(e.newY);
                        if (
                            newSeries &&
                            e.newX !== undefined &&
                            e.newY !== undefined
                        ) {
                            this.series = newSeries;
                        }
                    }
                }
            }
        }
    },
    legend: {
        enabled: false
    },
    rangeSelector: {
        enabled: true,
        selected: 1
    },
    scrollbar: {
        enabled: true
    },
    series: getSeriesFromInformation(information),
    tooltip: {
        formatter: tooltipFormatter
    },
    xAxis: [{
        type: 'datetime',
        currentDateIndicator: true,
        grid: false,
        labels: {
            format: undefined
        },
        min: xAxisMin,
        max: xAxisMax,
        tickInterval: undefined
    }],
    yAxis: [{
        type: 'grid',
        maxPadding: 0,
        staticScale: 100,
        labels: {
            useHTML: true
        },
        grid: {
            enabled: true,
            columns: [{
                labels: {
                    formatter: gridColumnFormatterSeriesName
                }
            }, {
                labels: {
                    formatter: gridColumnFormatterSeriesIdle
                }
            }]
        }
    }]
});
