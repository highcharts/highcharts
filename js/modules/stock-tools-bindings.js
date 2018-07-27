/**
 * Events generator for Stock tools
 *
 * (c) 2009-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    defined = H.defined,
    doc = H.doc,
    each = H.each,
    extend = H.extend,
    objectEach = H.objectEach,
    PREFIX = 'highcharts-';

/**
 * Update each point after specified index, most of the annotations use this.
 * For example crooked line: logic behind updating each point is the same,
 * only index changes when adding an annotation.
 *
 * Example: updateNthPoint(1) - will generate function that updates all
 * consecutive points except point with index=0.
 *
 * @param {Number} Index from each point should udpated
 *
 * @return {function} Callback to be used in steps array
 */
function updateNthPoint(startIndex) {
    return function (e, annotation) {
        var options = annotation.options.typeOptions,
            x = this.chart.xAxis[0].toValue(e.chartX),
            y = this.chart.yAxis[0].toValue(e.chartY);

        each(options.points, function (point, index) {
            if (index >= startIndex) {
                point.x = x;
                point.y = y;
            }
        });

        annotation.update({
            typeOptions: {
                points: options.points
            }
        });

        annotation.setControlPointsVisibility(true);
    };
}

// TO DO: Consider using getHoverData(), but always kdTree
function attractToPoint(e, chart) {
    var x = chart.xAxis[0].toValue(e.chartX),
        y = chart.yAxis[0].toValue(e.chartY),
        distX = Number.MAX_SAFE_INTEGER, // IE?
        closestPoint;

    each(chart.series, function (series) {
        each(series.points, function (point) {
            if (point && distX > Math.abs(point.x - x)) {
                distX = Math.abs(point.x - x);
                closestPoint = point;
            }
        });
    });

    return {
        x: closestPoint.x,
        y: closestPoint.y,
        below: y < closestPoint.y,
        series: closestPoint.series,
        xAxis: closestPoint.series.xAxis.index || 0,
        yAxis: closestPoint.series.yAxis.index || 0
    };
}

/**
 * Generates function which will add a flag series using modal in GUI.
 * Method uses internally `Toolbar.showForm(options, callback)`.
 *
 * Example: addFlagFromForm('diamondpin') - will generate function that shows
 * modal in GUI.
 *
 * @param {String} Type of flag series, e.g. "squarepin"
 *
 * @return {function} Callback to be used in `start` callback
 */
function addFlagFromForm(type) {
    return function (e) {
        var chart = this.chart,
            point = attractToPoint(e, chart);
        if (this.showForm) {
            this.showForm(
                // Enabled options:
                [{
                    type: 'string',
                    name: 'name',
                    label: 'Name:',
                    value: 'A'
                }, {
                    type: 'string',
                    name: 'title',
                    label: 'Name:',
                    value: 'Flag A'
                }, {
                    type: 'color',
                    name: 'color',
                    value: chart.options.colors[chart.colorCounter]
                }],
                // Callback on submit:
                function (fields) {
                    var pointConfig = {
                        x: point.x,
                        y: point.y
                    };

                    each(fields, function (field) {
                        pointConfig[field.name] = field.value;
                    });

                    chart.addSeries({
                        type: 'flags',
                        onSeries: point.series.id,
                        shape: type,
                        data: [pointConfig]
                    });
                }
            );
        }
    };
}

/*
 * Update size of background (rect) in some annotations: Measure, Simple Rect.
 *
 * @return {function} Callback to be used in steps array
 */
function updateRectSize() {
    return function (e, annotation) {
        var options = annotation.options.typeOptions,
            xStart = this.chart.xAxis[0].toPixels(options.point.x),
            yStart = this.chart.yAxis[0].toPixels(options.point.y),
            x = e.chartX,
            y = e.chartY,
            width = x - xStart,
            height = y - yStart;

        annotation.update({
            typeOptions: {
                background: {
                    width: width + 'px',
                    height: height + 'px'
                }
            }
        });

        annotation.setControlPointsVisibility(true);
    };
}

var stockToolsBindings = {
    // Simple annotations:
    'circle-annotation': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                annotation;

            annotation = this.chart.addAnnotation({
                shapes: [{
                    type: 'circle',
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: x,
                        y: y
                    },
                    r: 5,
                    controlPoints: [{
                        positioner: function (target) {
                            var xy = H.Annotation.MockPoint.pointToPixels(
                                    target.points[0]
                                );

                            return {
                                x: xy.x - this.graphic.width / 2,
                                y: xy.y - this.graphic.height / 2 -
                                    target.options.r
                            };
                        },
                        events: {
                            // TRANSFORM RADIUS ACCORDING TO Y TRANSLATION
                            drag: function (e, target) {

                                target.setRadius(
                                    Math.max(
                                        target.options.r -
                                            this.mouseMoveToTranslation(e).y,
                                        5
                                    )
                                );

                                target.redraw(false);
                            }
                        }
                    }]
                }]
            });

            annotation.setControlPointsVisibility(true);

            return annotation;
        },
        steps: [
            function (e, annotation) {
                var point = annotation.options.shapes[0].point,
                    x = this.chart.xAxis[0].toPixels(point.x),
                    y = this.chart.yAxis[0].toPixels(point.y),
                    distance = Math.max(
                        Math.sqrt(
                            Math.pow(x - e.chartX, 2) +
                            Math.pow(y - e.chartY, 2)
                        ),
                        5
                    );

                // TO DO: Is update broken?
                annotation.options.shapes[0].r = distance;
                annotation.update({});
            }
        ]
    },
    'rectangle-annotation': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    type: 'measure',
                    typeOptions: {
                        point: {
                            x: x,
                            y: y,
                            xAxis: 0,
                            yAxis: 0
                        },
                        background: {
                            width: 0,
                            height: 0
                        },
                        crosshairX: {
                            enabled: false
                        },
                        crosshairY: {
                            enabled: false
                        },
                        label: {
                            enabled: false
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        steps: [
            updateRectSize()
        ]
    },
    'label-annotation': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                annotation;

            annotation = this.chart.addAnnotation({
                labels: [{
                    point: {
                        x: x,
                        y: y,
                        xAxis: 0,
                        yAxis: 0
                    },
                    format: '{y:.2f}',
                    controlPoints: [{
                        symbol: 'triangle-down',
                        positioner: function (target) {
                            if (!target.graphic.placed) {
                                return {
                                    x: 0,
                                    y: -9e7
                                };
                            }

                            var xy = H.Annotation.MockPoint
                                .pointToPixels(
                                    target.points[0]
                                );

                            return {
                                x: xy.x - this.graphic.width / 2,
                                y: xy.y - this.graphic.height / 2
                            };
                        },

                        // TRANSLATE POINT/ANCHOR
                        events: {
                            drag: function (e, target) {
                                var xy = this.mouseMoveToTranslation(e);

                                target.translatePoint(xy.x, xy.y);
                                target.redraw(false);
                            }
                        }
                    }, {
                        symbol: 'square',
                        positioner: function (target) {
                            if (!target.graphic.placed) {
                                return {
                                    x: 0,
                                    y: -9e7
                                };
                            }

                            return {
                                x: target.graphic.alignAttr.x -
                                    this.graphic.width / 2,
                                y: target.graphic.alignAttr.y -
                                    this.graphic.height / 2
                            };
                        },

                        // TRANSLATE POSITION WITHOUT CHANGING THE ANCHOR
                        events: {
                            drag: function (e, target) {
                                var xy = this.mouseMoveToTranslation(e);

                                target.translate(xy.x, xy.y);
                                target.redraw(false);
                            }
                        }
                    }],
                    overflow: 'none',
                    crop: true
                }]
            });

            annotation.setControlPointsVisibility(true);
        }
    },
    // Line type annotations:
    'segment': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'crooked-line',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'arrow-segment': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'crooked-line',
                typeOptions: {
                    line: {
                        markerEnd: 'arrow'
                    },
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'ray': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'infinity-line',
                typeOptions: {
                    type: 'ray',
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'arrow-ray': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'infinity-line',
                typeOptions: {
                    type: 'ray',
                    line: {
                        markerEnd: 'arrow'
                    },
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'infinity-line': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'infinity-line',
                typeOptions: {
                    type: 'line',
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'arrow-infinity-line': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'infinity-line',
                typeOptions: {
                    type: 'line',
                    line: {
                        markerEnd: 'arrow'
                    },
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'horizontal-line': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                annotation = this.chart.addAnnotation({
                    type: 'infinity-line',
                    typeOptions: {
                        type: 'horizontal-line',
                        points: [{
                            x: x,
                            y: y
                        }]
                    }
                });

            annotation.setControlPointsVisibility(true);
        }
    },
    'vertical-line': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                annotation = this.chart.addAnnotation({
                    type: 'infinity-line',
                    typeOptions: {
                        type: 'vertical-line',
                        points: [{
                            x: x,
                            y: y
                        }]
                    }
                });

            annotation.setControlPointsVisibility(true);
        }
    },
    // Crooked Line type annotations:
    'crooked3': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'crooked-line',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1),
            updateNthPoint(2)
        ]
    },
    'crooked5': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'crooked-line',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1),
            updateNthPoint(2),
            updateNthPoint(3),
            updateNthPoint(4)
        ]
    },
    'elliott3': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'elliott-wave',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1),
            updateNthPoint(2)
        ]
    },
    'elliott5': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'elliott-wave',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1),
            updateNthPoint(2),
            updateNthPoint(3),
            updateNthPoint(4)
        ]
    },
    'measureX': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    type: 'measure',
                    typeOptions: {
                        selectType: 'x',
                        point: {
                            x: x,
                            y: y,
                            xAxis: 0,
                            yAxis: 0
                        },
                        background: {
                            width: 0,
                            height: 0
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        steps: [
            updateRectSize()
        ]
    },
    'measureY': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    type: 'measure',
                    typeOptions: {
                        selectType: 'y',
                        point: {
                            x: x,
                            y: y,
                            xAxis: 0,
                            yAxis: 0
                        },
                        background: {
                            width: 0,
                            height: 0
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        steps: [
            updateRectSize()
        ]
    },
    'measureXY': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    type: 'measure',
                    typeOptions: {
                        selectType: 'xy',
                        point: {
                            x: x,
                            y: y,
                            xAxis: 0,
                            yAxis: 0
                        },
                        background: {
                            width: 0,
                            height: 0
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        steps: [
            updateRectSize()
        ]
    },
    // Advanced type annotations:
    'fibonacci': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);
            return this.chart.addAnnotation({
                type: 'fibonacci',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'parallel-channel': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'tunnel',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                }
            });
        },
        steps: [
            updateNthPoint(1)
        ]
    },
    'pitchfork': {
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                type: 'pitchfork',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y,
                        controlPoint: {
                            style: {
                                fill: 'red'
                            }
                        }
                    }, {
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }],
                    innerBackground: {
                        fill: 'rgba(100, 170, 255, 0.8)'
                    }
                },
                shapeOptions: {
                    strokeWidth: 2
                }
            });
        },
        steps: [
            updateNthPoint(1),
            updateNthPoint(2)
        ]
    },
    // Labels with arrow and auto increments
    'vertical-counter': {
        start: function (e) {
            var closestPoint = attractToPoint(e, this.chart),
                annotation;

            if (!defined(this.verticalCounter)) {
                this.verticalCounter = 0;
            }

            annotation = this.chart.addAnnotation({
                type: 'vertical-line',
                typeOptions: {
                    point: {
                        x: closestPoint.x,
                        y: closestPoint.y,
                        xAxis: closestPoint.xAxis,
                        yAxis: closestPoint.yAxis
                    },
                    label: {
                        offset: closestPoint.below ? 40 : -40,
                        text: this.verticalCounter.toString()
                    }
                }
            });

            annotation.setControlPointsVisibility(true);

            this.verticalCounter++;
        }
    },
    'vertical-label': {
        start: function (e) {
            var closestPoint = attractToPoint(e, this.chart),
                annotation = this.chart.addAnnotation({
                    type: 'vertical-line',
                    typeOptions: {
                        point: {
                            x: closestPoint.x,
                            y: closestPoint.y,
                            xAxis: closestPoint.xAxis,
                            yAxis: closestPoint.yAxis
                        },
                        label: {
                            offset: closestPoint.below ? 40 : -40
                        }
                    }
                });

            annotation.setControlPointsVisibility(true);
        }
    },
    'vertical-arrow': {
        start: function (e) {
            var closestPoint = attractToPoint(e, this.chart),
                annotation = this.chart.addAnnotation({
                    type: 'vertical-line',
                    typeOptions: {
                        point: {
                            x: closestPoint.x,
                            y: closestPoint.y,
                            xAxis: closestPoint.xAxis,
                            yAxis: closestPoint.yAxis
                        },
                        label: {
                            offset: closestPoint.below ? 40 : -40,
                            format: ' '
                        },
                        connector: {
                            fill: 'none',
                            stroke: closestPoint.below ? 'red' : 'green'
                        }
                    }
                });

            annotation.setControlPointsVisibility(true);
        }
    },
    'vertical-double-arrow': {

    },
    // Flag types:
    'flag-circlepin': {
        start: addFlagFromForm('circlepin')
    },
    'flag-diamondpin': {
        start: addFlagFromForm('diamondpin')
    },
    'flag-squarepin': {
        start: addFlagFromForm('squarepin')
    },
    'flag-simplepin': {
        start: addFlagFromForm('simplepin')
    },
    // Other tools:
    'zoom-x': {
        init: function () {
            this.chart.update({
                chart: {
                    zoomType: 'xy'
                }
            });
        }
    },
    'zoom-y': {
        init: function () {
            this.chart.update({
                chart: {
                    zoomType: 'y'
                }
            });
        }
    },
    'zoom-xy': {
        init: function () {
            this.chart.update({
                chart: {
                    zoomType: 'x'
                }
            });
        }
    },
    'series-type-line': {
        init: function () {
            this.chart.series[0].update({
                type: 'line'
            });
        }
    },
    'series-type-ohlc': {
        init: function () {
            this.chart.series[0].update({
                type: 'ohlc'
            });
        }
    },
    'series-type-candlestick': {
        init: function () {
            this.chart.series[0].update({
                type: 'candlestick'
            });
        }
    },
    'full-screen': {
        start: function () {

        }
    },
    'current-price-indicator': {
        init: function () {
            var series = this.chart.series[0],
                options = series.options,
                lastVisiblePrice = options.lastVisiblePrice &&
                                options.lastVisiblePrice.enabled,
                lastPrice = options.lastPrice && options.lastPrice.enabled;

            series.update({
                // line
                lastPrice: {
                    enabled: !lastPrice,
                    color: 'red'
                },
                // label
                lastVisiblePrice: {
                    enabled: !lastVisiblePrice,
                    label: {
                        enabled: true
                    }
                }
            });
        }
    },
    'indicators': {
        init: function () {
            var chart = this.chart;
            if (this.showIndicatorsForm) {
                this.showIndicatorsForm(
                    // Callback on submit:
                    function (fields) {
                        var seriesConfig = {
                            params: {}
                        };

                        each(fields, function (field) {
                            if (field.match('params')) {
                                // Params e.g. "params.period"
                                seriesConfig.params[
                                    field.name.replace('params', '')
                                ] = field.value;
                            } else {
                                // General series options, e.g. color
                                seriesConfig[field.name] = field.value;
                            }
                        });

                        chart.addSeries(seriesConfig);
                    }
                );
            }
        }
    },
    'toggle-annotations': {
        init: function () {
            this.toggledAnnotations = !this.toggledAnnotations;

            each(this.chart.annotations || [], function (annotation) {
                annotation.setVisibility(!this.toggledAnnotations);
            }, this);
        }
    },
    'save-chart': {
        start: function () {
            // TO DO:
            // Save in localhost, note it should save:
            // - annotations
            // - indicators
            // - toolbar button states (e.g. price indicator)
            // - all flag series
        }
    }
};

extend(H.Toolbar.prototype, {
    // Private properties added by bindings:

    // Holder for current step, used on mouse move to update bound object
    // mouseMoveEvent: function () {}

    // Next event in `step` array to be called on chart's click
    // nextEvent: function () {}

    // Index if the `step` array for the current event
    // stepIndex: 0

    // Flag to determine if current binding has steps
    // steps: true|false

    // Bindings holder for all events
    // selectedButton: {}

    // Holder for user options, returned from `start` event, and passed on to
    // `step`'s' and `end`.
    // currentUserDetails: {}

    /*
     * Hook for click on a button, method selcts/unselects buttons,
     * then calls `bindings.init` callback.
     *
     * @param {HTMLDOMElement} [button] Clicked button
     * @param {Object} [events] Events passed down from bindings (`init`,
     * `start`, `step`, `end`)
     * @param {Event} [clickEvent] Browser's click event
     *
     * @private
     */
    bindingsButtonClick: function (button, events, clickEvent) {
        var toolbar = this;

        // We have two objects with the same class,
        // so need to trigger one event (main button)
        clickEvent.stopPropagation();

        toolbar.selectedButton = events;

        // Unslect other active buttons
        toolbar.unselectAllButtons(button);

        // Set active class on the current button
        toolbar.selectButton(button);

        // Call "init" event, for example to open modal window
        if (events.init) {
            events.init.call(toolbar);
        }
    },
    /*
     * Hook for click on a chart, first click on a chart calls `start` event,
     * then on all subsequent clicks iterates over `steps` array.
     * When finished, calls `end` event.
     *
     * @param {Chart} Chart that click was performed on
     * @param {Event} Browser's click event
     *
     * @private
     */
    bindingsChartClick: function (chart, clickEvent) {
        var toolbar = this,
            selectedButton = toolbar.selectedButton;

        if (!selectedButton || !selectedButton.start) {
            return;
        }

        if (!toolbar.nextEvent) {
            // Call init method:
            toolbar.currentUserDetails = selectedButton.start.call(
                toolbar,
                clickEvent
            );

            // If steps exists (e.g. Annotations), bind them:
            if (selectedButton.steps) {
                toolbar.stepIndex = 0;
                toolbar.steps = true;
                toolbar.mouseMoveEvent = toolbar.nextEvent =
                    selectedButton.steps[toolbar.stepIndex];
            } else {
                toolbar.steps = false;
                toolbar.selectedButton = null;
                // First click is also the last one:
                if (selectedButton.end) {
                    selectedButton.end.call(
                        toolbar,
                        clickEvent,
                        toolbar.currentUserDetails
                    );
                }
            }
        } else {

            toolbar.nextEvent.call(
                toolbar,
                clickEvent,
                toolbar.currentUserDetails
            );

            if (toolbar.steps) {

                toolbar.stepIndex++;

                if (selectedButton.steps[toolbar.stepIndex]) {
                    // If we have more steps, bind them one by one:
                    toolbar.mouseMoveEvent = toolbar.nextEvent =
                        selectedButton.steps[toolbar.stepIndex];
                } else {

                    // That was the last step, call end():
                    if (selectedButton.end) {
                        selectedButton.end.call(
                            toolbar,
                            clickEvent,
                            toolbar.currentUserDetails
                        );
                    }
                    toolbar.nextEvent = false;
                    toolbar.mouseMoveEvent = false;
                    toolbar.selectedButton = null;
                    // toolbar.deselectButton();
                }
            }
        }
    },
    /*
     * Hook for mouse move on a chart's container. It calls current setp.
     *
     * @param {HTMLDOMElement} Chart's container
     * @param {Event} Browser's click event
     *
     * @private
     */
    bindingsContainerMouseMove: function (container, moveEvent) {
        if (this.mouseMoveEvent) {
            this.mouseMoveEvent.call(
                this,
                moveEvent,
                this.currentUserDetails
            );
        }
    }
});

addEvent(H.Toolbar, 'afterInit', function () {
    var toolbar = this;

    objectEach(
        toolbar.chart.options.stockTools.bindings,
        function (events, className) {
            var element = doc.getElementsByClassName(PREFIX + className)[0];
            if (element) {
                addEvent(
                    element,
                    'click',
                    function (e) {
                        toolbar.bindingsButtonClick(this, events, e);
                    }
                );
            }
        }
    );
});

addEvent(H.Chart, 'load', function () {
    var chart = this,
        toolbar = chart.stockToolbar;

    if (toolbar) {
        addEvent(chart, 'click', function (e) {
            toolbar.bindingsChartClick(this, e);
        });
        addEvent(chart.container, 'mousemove', function (e) {
            toolbar.bindingsContainerMouseMove(this, e);
        });
    }
});

H.setOptions({
    stockTools: {
        bindings: stockToolsBindings
    }
});
