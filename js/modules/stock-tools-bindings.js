/**
 *
 *  Events generator for Stock tools
 *
 *  (c) 2009-2018 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 * */

/**
 * A config object for bindings in Stock Tools module.
 *
 * @interface Highcharts.StockToolsBindingsObject
 *//**
 * ClassName of the element for a binding.
 * @name Highcharts.StockToolsBindingsObject#className
 * @type {string|undefined}
 *//**
 * Last event to be fired after last step event.
 * @name Highcharts.StockToolsBindingsObject#end
 * @type {Function|undefined}
 *//**
 * Initial event, fired on a button click.
 * @name Highcharts.StockToolsBindingsObject#init
 * @type {Function|undefined}
 *//**
 * Event fired on first click on a chart.
 * @name Highcharts.StockToolsBindingsObject#start
 * @type {Function|undefined}
 *//**
 * Last event to be fired after last step event. Array of step events to be
 * called sequentially after each user click.
 * @name Highcharts.StockToolsBindingsObject#steps
 * @type {Array<Function>|undefined}
 */

'use strict';

import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    correctFloat = H.correctFloat,
    defined = H.defined,
    doc = H.doc,
    extend = H.extend,
    fireEvent = H.fireEvent,
    isNumber = H.isNumber,
    isArray = H.isArray,
    isObject = H.isObject,
    objectEach = H.objectEach,
    pick = H.pick,
    PREFIX = 'highcharts-';

/**
 * @private
 * @interface bindingsUtils
 */
var bindingsUtils = {
    /**
     * Get field type according to value
     *
     * @private
     * @function bindingsUtils.getFieldType
     *
     * @param {*} value
     *        Atomic type (one of: string, number, boolean)
     *
     * @return {string}
     *         Field type (one of: text, number, checkbox)
     */
    getFieldType: function getType(value) {
        return {
            string: 'text',
            number: 'number',
            boolean: 'checkbox'
        }[typeof value];
    },
    /**
     * Shorthand to check if given yAxis comes from navigator.
     *
     * @private
     * @function bindingsUtils.isNotNavigatorYAxis
     *
     * @param {Highcharts.Axis} axis
     *        Axis
     *
     * @return {boolean}
     */
    isNotNavigatorYAxis: function (axis) {
        return axis.userOptions.className !== PREFIX + 'navigator-yaxis';
    },
    /**
     * Update each point after specified index, most of the annotations use
     * this. For example crooked line: logic behind updating each point is the
     * same, only index changes when adding an annotation.
     *
     * Example: Toolbar.utils.updateNthPoint(1) - will generate function that
     * updates all consecutive points except point with index=0.
     *
     * @private
     * @function bindingsUtils.updateNthPoint
     *
     * @param {number} startIndex
     *        Index from each point should udpated
     *
     * @return {Function}
     *         Callback to be used in steps array
     */
    updateNthPoint: function (startIndex) {
        return function (e, annotation) {
            var options = annotation.options.typeOptions,
                x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            options.points.forEach(function (point, index) {
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
        };
    },
    /**
     * Update height for an annotation. Height is calculated as a difference
     * between last point in `typeOptions` and current position. It's a value,
     * not pixels height.
     *
     * @private
     * @function bindingsUtils.updateHeight
     *
     * @param {global.Event} e
     *        normalized browser event
     *
     * @param {Highcharts.Annotation} annotation
     *        Annotation to be updated
     */
    updateHeight: function (e, annotation) {
        annotation.update({
            typeOptions: {
                height: this.chart.yAxis[0].toValue(e.chartY) -
                    annotation.options.typeOptions.points[1].y
            }
        });
    },
    // @todo
    // Consider using getHoverData(), but always kdTree (columns?)
    attractToPoint: function (e, chart) {
        var x = chart.xAxis[0].toValue(e.chartX),
            y = chart.yAxis[0].toValue(e.chartY),
            distX = Number.MAX_SAFE_INTEGER, // IE?
            closestPoint;

        chart.series.forEach(function (series) {
            series.points.forEach(function (point) {
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
    },
    /**
     * Generates function which will add a flag series using modal in GUI.
     * Method fires an event "showPopup" with config:
     * `{type, options, callback}`.
     *
     * Example: Toolbar.utils.addFlagFromForm('url(...)') - will generate
     * function that shows modal in GUI.
     *
     * @private
     * @function bindingsUtils.addFlagFromForm
     *
     * @param {string} type
     *        Type of flag series, e.g. "squarepin"
     *
     * @return {Function}
     *         Callback to be used in `start` callback
     */
    addFlagFromForm: function (type) {
        return function (e) {
            var toolbar = this,
                chart = toolbar.chart,
                getFieldType = toolbar.utils.getFieldType,
                point = bindingsUtils.attractToPoint(e, chart),
                pointConfig = {
                    x: point.x,
                    y: point.y
                },
                seriesOptions = {
                    type: 'flags',
                    onSeries: point.series.id,
                    shape: type,
                    data: [pointConfig],
                    point: {
                        events: {
                            click: function () {
                                var point = this,
                                    options = point.options;

                                fireEvent(
                                    toolbar,
                                    'showPopup',
                                    {
                                        point: point,
                                        formType: 'annotation-toolbar',
                                        options: {
                                            langKey: 'flags',
                                            type: 'flags',
                                            title: [
                                                options.title,
                                                getFieldType(
                                                    options.title
                                                )
                                            ],
                                            name: [
                                                options.name,
                                                getFieldType(
                                                    options.name
                                                )
                                            ]
                                        },
                                        onSubmit: function (updated) {
                                            point.update(
                                                toolbar.fieldsToOptions(
                                                    updated.fields,
                                                    {}
                                                )
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    }
                };

            if (!toolbar.guiEnabled) {
                chart.addSeries(seriesOptions);
            }

            fireEvent(
                toolbar,
                'showPopup',
                {
                    formType: 'flag',
                    // Enabled options:
                    options: {
                        langKey: 'flags',
                        type: 'flags',
                        title: ['A', getFieldType('A')],
                        name: ['Flag A', getFieldType('Flag A')]
                    },
                    // Callback on submit:
                    onSubmit: function (data) {
                        toolbar.fieldsToOptions(
                            data.fields,
                            seriesOptions.data[0]
                        );
                        chart.addSeries(seriesOptions);
                    }
                }
            );
        };
    },
    manageIndicators: function (data) {
        var toolbar = this,
            chart = toolbar.chart,
            seriesConfig = {
                linkedTo: data.linkedTo,
                type: data.type
            },
            indicatorsWithVolume = [
                'ad',
                'cmf',
                'mfi',
                'vbp',
                'vwap'
            ],
            indicatorsWithAxes = [
                'ad',
                'atr',
                'cci',
                'cmf',
                'macd',
                'mfi',
                'roc',
                'rsi',
                'vwap'
            ],
            yAxis,
            series;

        if (data.actionType === 'edit') {
            toolbar.fieldsToOptions(data.fields, seriesConfig);
            series = chart.get(data.seriesId);

            if (series) {
                series.update(seriesConfig, false);
            }
        } else if (data.actionType === 'remove') {
            series = chart.get(data.seriesId);
            if (series) {
                yAxis = series.yAxis;

                if (series.linkedSeries) {
                    series.linkedSeries.forEach(function (linkedSeries) {
                        linkedSeries.remove(false);
                    });
                }

                series.remove(false);

                if (indicatorsWithAxes.indexOf(series.type) >= 0) {
                    yAxis.remove(false);
                    toolbar.resizeYAxes();
                }
            }
        } else {
            seriesConfig.id = H.uniqueKey();
            toolbar.fieldsToOptions(data.fields, seriesConfig);

            if (indicatorsWithAxes.indexOf(data.type) >= 0) {
                yAxis = chart.addAxis({
                    id: H.uniqueKey(),
                    offset: 0,
                    opposite: true,
                    title: {
                        text: ''
                    },
                    tickPixelInterval: 40,
                    showLastLabel: false,
                    labels: {
                        align: 'left',
                        y: -2
                    }
                }, false, false);
                seriesConfig.yAxis = yAxis.options.id;
                toolbar.resizeYAxes();
            }

            if (indicatorsWithVolume.indexOf(data.type) >= 0) {
                seriesConfig.params.volumeSeriesID = chart.series.filter(
                    function (series) {
                        return series.options.type === 'column';
                    }
                )[0].options.id;
            }

            chart.addSeries(seriesConfig, false);
        }

        fireEvent(
            toolbar,
            'deselectButton',
            {
                button: toolbar.selectedButtonElement
            }
        );

        chart.redraw();
    }
};

/**
 * Update size of background (rect) in some annotations: Measure, Simple Rect.
 *
 * @private
 * @function updateRectSize
 *
 * @param {global.Event} event
 *        Normalized browser event
 *
 * @param {Highcharts.Annotation} annotation
 *        Annotation to be updated
 */
function updateRectSize(event, annotation) {
    var options = annotation.options.typeOptions,
        xStart = this.chart.xAxis[0].toPixels(options.point.x),
        yStart = this.chart.yAxis[0].toPixels(options.point.y),
        x = event.chartX,
        y = event.chartY,
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
}

/**
 * Bindings defintions for buttons in Stock Tools GUI. Each binding implements
 * simple event-driven interface:
 *
 * - `className`: classname used to bind event to
 *
 * - `init`: initial event, fired on button click
 *
 * - `start`: fired on first click on a chart
 *
 * - `steps`: array of sequential events fired one after another on each
 *   of users clicks
 *
 * - `end`: last event to be called after last step event
 *
 * Name of the each binding is a part of `highcharts-NAME` classname used to
 * generate build-in GUI. For example HTML button with
 * `highcharts-circle-annotation` will bind automatically
 * `bindings.circle-annotation` events.
 *
 * @type         {Highcharts.Dictionary<Highcharts.StockToolsBindingsObject>|*}
 * @since        7.0.0
 * @product      highstock
 * @optionparent stockTools.bindings
 */
var stockToolsBindings = {
    /**
     * A circle annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-circle-annotation", "start": function() {}, "steps": [function() {}]}
     */
    circleAnnotation: {
        /** @ignore */
        className: 'highcharts-circle-annotation',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                annotation;

            annotation = this.chart.addAnnotation({
                langKey: 'circle',
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
                                ),
                                r = target.options.r;

                            return {
                                x: xy.x + r * Math.cos(Math.PI / 4) -
                                    this.graphic.width / 2,
                                y: xy.y + r * Math.sin(Math.PI / 4) -
                                    this.graphic.height / 2
                            };
                        },
                        events: {
                            // TRANSFORM RADIUS ACCORDING TO Y TRANSLATION
                            drag: function (e, target) {

                                target.setRadius(
                                    Math.max(
                                        target.options.r +
                                            this.mouseMoveToTranslation(e).y /
                                            Math.sin(Math.PI / 4),
                                        5
                                    )
                                );

                                target.redraw(false);
                            }
                        }
                    }]
                }]
            });

            return annotation;
        },
        /** @ignore */
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
                // annotation.options.shapes[0].r = distance;
                annotation.update({
                    shapes: [{
                        r: distance
                    }]
                });
            }
        ]
    },
    /**
     * A rectangle annotation bindings. Includes `start` and one event in
     * `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-rectangle-annotation", "start": function() {}, "steps": [function() {}]}
     */
    rectangleAnnotation: {
        /** @ignore */
        className: 'highcharts-rectangle-annotation',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    langKey: 'rectangle',
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
                            height: 0,
                            strokeWidth: 0,
                            stroke: '#ffffff'
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
        /** @ignore */
        steps: [
            updateRectSize
        ]
    },
    /**
     * A label annotation bindings. Includes `start` event only.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-label-annotation", "start": function() {}, "steps": [function() {}]}
     */
    labelAnnotation: {
        /** @ignore */
        className: 'highcharts-label-annotation',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            this.chart.addAnnotation({
                langKey: 'label',
                labelOptions: {
                    format: '{y:.2f}'
                },
                labels: [{
                    point: {
                        x: x,
                        y: y,
                        xAxis: 0,
                        yAxis: 0
                    },
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
        }
    },

    // Line type annotations:
    /**
     * A segment annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-segment", "start": function() {}, "steps": [function() {}]}
     */
    segment: {
        /** @ignore */
        className: 'highcharts-segment',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'segment',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A segment with an arrow annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-arrow-segment", "start": function() {}, "steps": [function() {}]}
     */
    arrowSegment: {
        /** @ignore */
        className: 'highcharts-arrow-segment',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'arrowSegment',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-ray", "start": function() {}, "steps": [function() {}]}
     */
    ray: {
        /** @ignore */
        className: 'highcharts-ray',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'ray',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray with an arrow annotation bindings. Includes `start` and one event
     * in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-arrow-ray", "start": function() {}, "steps": [function() {}]}
     */
    arrowRay: {
        /** @ignore */
        className: 'highcharts-arrow-ray',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'arrowRay',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line annotation. Includes `start` and one event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-infinity-line", "start": function() {}, "steps": [function() {}]}
     */
    infinityLine: {
        /** @ignore */
        className: 'highcharts-infinity-line',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'infinityLine',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line with arrow annotation. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-arrow-infinity-line", "start": function() {}, "steps": [function() {}]}
     */
    arrowInfinityLine: {
        /** @ignore */
        className: 'highcharts-arrow-infinity-line',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'arrowInfinityLine',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A horizontal line annotation. Includes `start` event.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-horizontal-line", "start": function() {}}
     */
    horizontalLine: {
        /** @ignore */
        className: 'highcharts-horizontal-line',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            this.chart.addAnnotation({
                langKey: 'horizontalLine',
                type: 'infinity-line',
                typeOptions: {
                    type: 'horizontal-line',
                    points: [{
                        x: x,
                        y: y
                    }]
                }
            });
        }
    },
    /**
     * A vertical line annotation. Includes `start` event.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-vertical-line", "start": function() {}}
     */
    verticalLine: {
        /** @ignore */
        className: 'highcharts-vertical-line',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            this.chart.addAnnotation({
                langKey: 'verticalLine',
                type: 'infinity-line',
                typeOptions: {
                    type: 'vertical-line',
                    points: [{
                        x: x,
                        y: y
                    }]
                }
            });
        }
    },
    /**
     * Crooked line (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points in crooked line) array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}]}
     */
    // Crooked Line type annotations:
    crooked3: {
        /** @ignore */
        className: 'highcharts-crooked3',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'crookedLine',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    /**
     * Crooked line (five points) annotation bindings. Includes `start` and four
     * events in `steps` (for all consequent points in crooked line) array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}]}
     */
    crooked5: {
        /** @ignore */
        className: 'highcharts-crooked5',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'crookedLine',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4)
        ]
    },
    /**
     * Elliott wave (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points) array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}]}
     */
    elliott3: {
        /** @ignore */
        className: 'highcharts-elliott3',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'elliottWave',
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
                },
                labelOptions: {
                    style: {
                        color: '#666666'
                    }
                }
            });
        },
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    /**
     * Elliott wave (five points) annotation bindings. Includes `start` and four
     * event in `steps` (for all consequent points in Elliott wave) array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}]}
     */
    elliott5: {
        /** @ignore */
        className: 'highcharts-elliott5',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'elliottWave',
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
                },
                labelOptions: {
                    style: {
                        color: '#666666'
                    }
                }
            });
        },
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4)
        ]
    },
    /**
     * A measure (x-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-measure-x", "start": function() {}, "steps": [function() {}]}
     */
    measureX: {
        /** @ignore */
        className: 'highcharts-measure-x',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    langKey: 'measure',
                    type: 'measure',
                    typeOptions: {
                        selectType: 'x',
                        point: {
                            x: x,
                            y: y,
                            xAxis: 0,
                            yAxis: 0
                        },
                        crosshairX: {
                            strokeWidth: 1,
                            stroke: '#000000'
                        },
                        crosshairY: {
                            enabled: false,
                            strokeWidth: 0,
                            stroke: '#000000'
                        },
                        background: {
                            width: 0,
                            height: 0,
                            strokeWidth: 0,
                            stroke: '#ffffff'
                        }
                    },
                    labelOptions: {
                        style: {
                            color: '#666666'
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        /** @ignore */
        steps: [
            updateRectSize
        ]
    },
    /**
     * A measure (y-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-measure-y", "start": function() {}, "steps": [function() {}]}
     */
    measureY: {
        /** @ignore */
        className: 'highcharts-measure-y',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    langKey: 'measure',
                    type: 'measure',
                    typeOptions: {
                        selectType: 'y',
                        point: {
                            x: x,
                            y: y,
                            xAxis: 0,
                            yAxis: 0
                        },
                        crosshairX: {
                            enabled: false,
                            strokeWidth: 0,
                            stroke: '#000000'
                        },
                        crosshairY: {
                            strokeWidth: 1,
                            stroke: '#000000'
                        },
                        background: {
                            width: 0,
                            height: 0,
                            strokeWidth: 0,
                            stroke: '#ffffff'
                        }
                    },
                    labelOptions: {
                        style: {
                            color: '#666666'
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        /** @ignore */
        steps: [
            updateRectSize
        ]
    },
    /**
     * A measure (xy-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-measure-xy", "start": function() {}, "steps": [function() {}]}
     */
    measureXY: {
        /** @ignore */
        className: 'highcharts-measure-xy',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY),
                options = {
                    langKey: 'measure',
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
                            height: 0,
                            strokeWidth: 0,
                            stroke: '#000000'
                        },
                        crosshairX: {
                            strokeWidth: 1,
                            stroke: '#000000'
                        },
                        crosshairY: {
                            strokeWidth: 1,
                            stroke: '#000000'
                        }
                    },
                    labelOptions: {
                        style: {
                            color: '#666666'
                        }
                    }
                };

            return this.chart.addAnnotation(options);
        },
        /** @ignore */
        steps: [
            updateRectSize
        ]
    },
    // Advanced type annotations:
    /**
     * A fibonacci annotation bindings. Includes `start` and two events in
     * `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-fibonacci", "start": function() {}, "steps": [function() {}, function() {}]}
     */
    fibonacci: {
        /** @ignore */
        className: 'highcharts-fibonacci',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);
            return this.chart.addAnnotation({
                langKey: 'fibonacci',
                type: 'fibonacci',
                typeOptions: {
                    points: [{
                        x: x,
                        y: y
                    }, {
                        x: x,
                        y: y
                    }]
                },
                labelOptions: {
                    style: {
                        color: '#666666'
                    }
                }
            });
        },
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * A parallel channel (tunnel) annotation bindings. Includes `start` and
     * two events in `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-parallel-channel", "start": function() {}, "steps": [function() {}, function() {}]}
     */
    parallelChannel: {
        /** @ignore */
        className: 'highcharts-parallel-channel',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'parallelChannel',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * An Andrew's pitchfork annotation bindings. Includes `start` and two
     * events in `steps` array (sets second and third control points).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-pitchfork", "start": function() {}, "steps": [function() {}, function() {}]}
     */
    pitchfork: {
        /** @ignore */
        className: 'highcharts-pitchfork',
        /** @ignore */
        start: function (e) {
            var x = this.chart.xAxis[0].toValue(e.chartX),
                y = this.chart.yAxis[0].toValue(e.chartY);

            return this.chart.addAnnotation({
                langKey: 'pitchfork',
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
        /** @ignore */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    // Labels with arrow and auto increments
    /**
     * A vertical counter annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with a numeric annotation -
     * incrementing counter on each add.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-vertical-counter", "start": function() {}}
     */
    verticalCounter: {
        /** @ignore */
        className: 'highcharts-vertical-counter',
        /** @ignore */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                annotation;

            if (!defined(this.verticalCounter)) {
                this.verticalCounter = 0;
            }

            annotation = this.chart.addAnnotation({
                langKey: 'verticalCounter',
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
                },
                labelOptions: {
                    style: {
                        color: '#666666',
                        fontSize: '11px'
                    }
                },
                shapeOptions: {
                    stroke: 'rgba(0, 0, 0, 0.75)',
                    strokeWidth: 1
                }
            });

            this.verticalCounter++;

            annotation.options.events.click.call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow and a label with
     * value.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-vertical-label", "start": function() {}}
     */
    verticalLabel: {
        /** @ignore */
        className: 'highcharts-vertical-label',
        /** @ignore */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                annotation;

            annotation = this.chart.addAnnotation({
                langKey: 'verticalLabel',
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
                },
                labelOptions: {
                    style: {
                        color: '#666666',
                        fontSize: '11px'
                    }
                },
                shapeOptions: {
                    stroke: 'rgba(0, 0, 0, 0.75)',
                    strokeWidth: 1
                }
            });

            annotation.options.events.click.call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow. Green arrow when
     * pointing from above, red when pointing from below the point.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-vertical-arrow", "start": function() {}}
     */
    verticalArrow: {
        /** @ignore */
        className: 'highcharts-vertical-arrow',
        /** @ignore */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                annotation;

            annotation = this.chart.addAnnotation({
                langKey: 'verticalArrow',
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
                },
                shapeOptions: {
                    stroke: 'rgba(0, 0, 0, 0.75)',
                    strokeWidth: 1
                }
            });

            annotation.options.events.click.call(annotation, {});
        }
    },
    // Flag types:
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'circlepin'` shape.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-flag-circlepin", "start": function() {}}
     */
    flagCirclepin: {
        /** @ignore */
        className: 'highcharts-flag-circlepin',
        /** @ignore */
        start: bindingsUtils
            .addFlagFromForm('circlepin')
    },
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'diamondpin'` shape.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-flag-diamondpin", "start": function() {}}
     */
    flagDiamondpin: {
        /** @ignore */
        className: 'highcharts-flag-diamondpin',
        /** @ignore */
        start: bindingsUtils
            .addFlagFromForm('flag')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag with
     * `'squarepin'` shape.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-flag-squarepin", "start": function() {}}
     */
    flagSquarepin: {
        /** @ignore */
        className: 'highcharts-flag-squarepin',
        /** @ignore */
        start: bindingsUtils
            .addFlagFromForm('squarepin')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag without pin
     * shape.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-flag-simplepin", "start": function() {}}
     */
    flagSimplepin: {
        /** @ignore */
        className: 'highcharts-flag-simplepin',
        /** @ignore */
        start: bindingsUtils
            .addFlagFromForm('nopin')
    },
    // Other tools:
    /**
     * Enables zooming in xAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-zoom-x", "init": function() {}}
     */
    zoomX: {
        /** @ignore */
        className: 'highcharts-zoom-x',
        /** @ignore */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'x'
                }
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Enables zooming in yAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-zoom-y", "init": function() {}}
     */
    zoomY: {
        /** @ignore */
        className: 'highcharts-highcharts-zoom-y',
        /** @ignore */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'y'
                }
            });
            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Enables zooming in xAxis and yAxis on a chart. Includes `start` event
     * which changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-zoom-xy", "init": function() {}}
     */
    zoomXY: {
        /** @ignore */
        className: 'highcharts-zoom-xy',
        /** @ignore */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'xy'
                }
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'line'` type.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-series-type-line", "init": function() {}}
     */
    seriesTypeLine: {
        /** @ignore */
        className: 'highcharts-series-type-line',
        /** @ignore */
        init: function (button) {
            this.chart.series[0].update({
                type: 'line'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'ohlc'` type.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-series-type-ohlc", "init": function() {}}
     */
    seriesTypeOhlc: {
        /** @ignore */
        className: 'highcharts-series-type-ohlc',
        /** @ignore */
        init: function (button) {
            this.chart.series[0].update({
                type: 'ohlc'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'candlestick'` type.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-series-type-candlestick", "init": function() {}}
     */
    seriesTypeCandlestick: {
        /** @ignore */
        className: 'highcharts-series-type-candlestick',
        /** @ignore */
        init: function (button) {
            this.chart.series[0].update({
                type: 'candlestick'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Displays chart in fullscreen.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-full-screen", "init": function() {}}
     */
    fullScreen: {
        /** @ignore */
        className: 'highcharts-full-screen',
        /** @ignore */
        init: function (button) {
            var chart = this.chart;

            chart.fullScreen = new H.FullScreen(chart.container);

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Hides/shows two price indicators:
     * - last price in the dataset
     * - last price in the selected range
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-current-price-indicator", "init": function() {}}
     */
    currentPriceIndicator: {
        /** @ignore */
        className: 'highcharts-current-price-indicator',
        /** @ignore */
        init: function (button) {
            var series = this.chart.series[0],
                options = series.options,
                lastVisiblePrice = options.lastVisiblePrice &&
                                options.lastVisiblePrice.enabled,
                lastPrice = options.lastPrice && options.lastPrice.enabled;

            if (this.guiEnabled) {
                if (lastPrice) {
                    button.firstChild.style['background-image'] =
                        'url("https://code.highcharts.com/gfx/stock-icons/current-price-show.svg")';
                } else {
                    button.firstChild.style['background-image'] =
                        'url("https://code.highcharts.com/gfx/stock-icons/current-price-hide.svg")';
                }
            }

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

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Indicators bindings. Includes `init` event to show a popup.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-indicators", "init": function() {}}
     */
    indicators: {
        /** @ignore */
        className: 'highcharts-indicators',
        /** @ignore */
        init: function () {
            var toolbar = this;

            fireEvent(
                toolbar,
                'showPopup',
                {
                    formType: 'indicators',
                    options: {},
                    // Callback on submit:
                    onSubmit: function (data) {
                        toolbar.utils.manageIndicators.call(toolbar, data);
                    }
                }
            );
        }
    },
    /**
     * Hides/shows all annotations on a chart.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-toggle-annotations", "init": function() {}}
     */
    toggleAnnotations: {
        /** @ignore */
        className: 'highcharts-toggle-annotations',
        /** @ignore */
        init: function (button) {
            this.toggledAnnotations = !this.toggledAnnotations;

            (this.chart.annotations || []).forEach(function (annotation) {
                annotation.setVisibility(!this.toggledAnnotations);
            }, this);

            if (this.guiEnabled) {
                if (this.toggledAnnotations) {
                    button.firstChild.style['background-image'] =
                        'url("https://code.highcharts.com/gfx/stock-icons/annotations-hidden.svg")';
                } else {
                    button.firstChild.style['background-image'] =
                        'url("https://code.highcharts.com/gfx/stock-icons/annotations-visible.svg")';
                }
            }

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Save a chart in localStorage under `highcharts-chart` key.
     * Stored items:
     * - annotations
     * - indicators (with yAxes)
     * - flags
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @default {"className": "highcharts-save-chart", "init": function() {}}
     */
    saveChart: {
        /** @ignore */
        className: 'highcharts-save-chart',
        /** @ignore */
        init: function (button) {
            var toolbar = this,
                chart = toolbar.chart,
                annotations = [],
                indicators = [],
                flags = [],
                yAxes = [];

            chart.annotations.forEach(function (annotation, index) {
                annotations[index] = annotation.userOptions;
            });

            chart.series.forEach(function (series) {
                if (series instanceof H.seriesTypes.sma) {
                    indicators.push(series.userOptions);
                } else if (series.type === 'flags') {
                    flags.push(series.userOptions);
                }
            });

            chart.yAxis.forEach(function (yAxis) {
                if (toolbar.utils.isNotNavigatorYAxis(yAxis)) {
                    yAxes.push(yAxis.options);
                }
            });

            H.win.localStorage.setItem(
                PREFIX + 'chart',
                JSON.stringify({
                    annotations: annotations,
                    indicators: indicators,
                    flags: flags,
                    yAxes: yAxes
                })
            );

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    }
};

// Define which options from annotations should show up in edit box:
H.Toolbar.annotationsEditable = {
    // `typeOptions` are always available
    // Nested and shared options:
    nestedOptions: {
        labelOptions: ['style', 'format', 'backgroundColor'],
        labels: ['style'],
        label: ['style'],
        style: ['fontSize', 'color'],
        background: ['fill', 'strokeWidth', 'stroke'],
        innerBackground: ['fill', 'strokeWidth', 'stroke'],
        outerBackground: ['fill', 'strokeWidth', 'stroke'],
        shapeOptions: ['fill', 'strokeWidth', 'stroke'],
        shapes: ['fill', 'strokeWidth', 'stroke'],
        line: ['strokeWidth', 'stroke'],
        backgroundColors: [true],
        connector: ['fill', 'strokeWidth', 'stroke'],
        crosshairX: ['strokeWidth', 'stroke'],
        crosshairY: ['strokeWidth', 'stroke']
    },
    // Simple shapes:
    circle: ['shapes'],
    'vertical-line': [],
    label: ['labelOptions'],
    // Measure
    measure: ['background', 'crosshairY', 'crosshairX'],
    // Others:
    fibonacci: [],
    tunnel: ['background', 'line', 'height'],
    pitchfork: ['innerBackground', 'outerBackground'],
    // Crooked lines, elliots, arrows etc:
    'crooked-line': []
};

// Define non editable fields per annotation, for example Rectangle inherits
// options from Measure, but crosshairs are not available
H.Toolbar.annotationsNonEditable = {
    rectangle: ['crosshairX', 'crosshairY', 'label']
};

extend(H.Toolbar.prototype, {
    // Private properties added by bindings:

    // Active (selected) annotation that is editted through popup/forms
    // activeAnnotation: Annotation

    // Holder for current step, used on mouse move to update bound object
    // mouseMoveEvent: function () {}

    // Next event in `step` array to be called on chart's click
    // nextEvent: function () {}

    // Index in the `step` array of the current event
    // stepIndex: 0

    // Flag to determine if current binding has steps
    // steps: true|false

    // Bindings holder for all events
    // selectedButton: {}

    // Holder for user options, returned from `start` event, and passed on to
    // `step`'s' and `end`.
    // currentUserDetails: {}

    /**
     * Hook for click on a button, method selcts/unselects buttons,
     * then calls `bindings.init` callback.
     *
     * @private
     * @function Highcharts.Toolbar#bindingsButtonClick
     *
     * @param {Highcharts.HTMLDOMElement} [button]
     *        Clicked button
     *
     * @param {object} [events]
     *        Events passed down from bindings (`init`, `start`, `step`, `end`)
     *
     * @param {global.Event} [clickEvent]
     *        Browser's click event
     */
    bindingsButtonClick: function (button, events, clickEvent) {
        var toolbar = this;

        if (toolbar.selectedButtonElement) {
            fireEvent(
                toolbar,
                'deselectButton',
                { button: toolbar.selectedButtonElement }
            );

            if (toolbar.nextEvent) {
                // Remove in-progress annotations adders:
                if (
                    toolbar.currentUserDetails &&
                    toolbar.currentUserDetails.coll === 'annotations'
                ) {
                    toolbar.chart.removeAnnotation(toolbar.currentUserDetails);
                }
                toolbar.mouseMoveEvent = toolbar.nextEvent = false;
            }
        }

        toolbar.selectedButton = events;
        toolbar.selectedButtonElement = button;

        fireEvent(toolbar, 'selectButton', { button: button });

        // Call "init" event, for example to open modal window
        if (events.init) {
            events.init.call(toolbar, button, clickEvent);
        }

        if (events.start || events.steps) {
            toolbar.chart.renderer.boxWrapper.addClass(PREFIX + 'draw-mode');
        }
    },
    /**
     * Hook for click on a chart, first click on a chart calls `start` event,
     * then on all subsequent clicks iterate over `steps` array.
     * When finished, calls `end` event.
     *
     * @private
     * @function Highcharts.Toolbar#bindingsChartClick
     *
     * @param {Highcharts.Chart} chart
     *        Chart that click was performed on.
     *
     * @param {global.Event} clickEvent
     *        Browser's click event.
     */
    bindingsChartClick: function (chart, clickEvent) {
        var toolbar = this,
            selectedButton = toolbar.selectedButton,
            svgContainer = toolbar.chart.renderer.boxWrapper;

        if (
            toolbar.activeAnnotation &&
            !clickEvent.activeAnnotation &&
            // Element could be removed in the child action, e.g. button
            clickEvent.target.parentNode &&
            // TO DO: Polyfill for IE11?
            !clickEvent.target.closest('.' + PREFIX + 'popup')
        ) {
            fireEvent(toolbar, 'closePopup');
            toolbar.deselectAnnotation();
        }

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

                fireEvent(
                    toolbar,
                    'deselectButton',
                    { button: toolbar.selectedButtonElement }
                );
                svgContainer.removeClass(PREFIX + 'draw-mode');
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
                    fireEvent(
                        toolbar,
                        'deselectButton',
                        { button: toolbar.selectedButtonElement }
                    );
                    svgContainer.removeClass(PREFIX + 'draw-mode');
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
                }
            }
        }
    },
    /**
     * Hook for mouse move on a chart's container. It calls current step.
     *
     * @private
     * @function Highcharts.Toolbar#bindingsContainerMouseMove
     *
     * @param {Highcharts.HTMLDOMElement} container
     *        Chart's container.
     *
     * @param {global.Event} moveEvent
     *        Browser's move event.
     */
    bindingsContainerMouseMove: function (container, moveEvent) {
        if (this.mouseMoveEvent) {
            this.mouseMoveEvent.call(
                this,
                moveEvent,
                this.currentUserDetails
            );
        }
    },
    /**
     * Translate fields (e.g. `params.period` or `marker.styles.color`) to
     * Highcharts options object (e.g. `{ params: { period } }`).
     *
     * @private
     * @function Highcharts.Toolbar#fieldsToOptions
     *
     * @param {object} fields
     *        Fields from popup form.
     *
     * @param {object} config
     *        Default config to be modified.
     *
     * @return {object}
     *         Modified config
     */
    fieldsToOptions: function (fields, config) {
        objectEach(fields, function (value, field) {
            var parsedValue = parseFloat(value),
                path = field.split('.'),
                parent = config,
                pathLength = path.length - 1;

            // If it's a number (not "forma" options), parse it:
            if (
                isNumber(parsedValue) &&
                !value.match(/px/g) &&
                !field.match(/format/g)
            ) {
                value = parsedValue;
            }

            // Remove empty strings or values like 0
            if (value !== '') {
                path.forEach(function (name, index) {
                    var nextName = pick(path[index + 1], '');

                    if (pathLength === index) {
                        // Last index, put value:
                        parent[name] = value;
                    } else if (!parent[name]) {
                        // Create middle property:
                        parent[name] = nextName.match(/\d/g) ? [] : {};
                        parent = parent[name];
                    } else {
                        // Jump into next property
                        parent = parent[name];
                    }
                });
            }
        });
        return config;
    },
    /**
     * Shorthand method to deselect an annotation.
     *
     * @function Highcharts.Toolbar#deselectAnnotation
     */
    deselectAnnotation: function () {
        if (this.activeAnnotation) {
            this.activeAnnotation.setControlPointsVisibility(false);
            this.activeAnnotation = false;

        }
    },
    /**
     * Get current positions for all yAxes. If new axis does not have position,
     * returned is default height and last available top place.
     *
     * @private
     * @function Highcharts.Toolbar#getYAxisPositions
     *
     * @param {Array<Highcharts.Axis>} yAxes
     *        Array of yAxes available in the chart.
     *
     * @param {number} plotHeight
     *        Available height in the chart.
     *
     * @param {number} defaultHeight
     *        Default height in percents.
     *
     * @return {Array}
     *         An array of calculated positions in percentages.
     *         Format: `{top: Number, height: Number}`
     */
    getYAxisPositions: function (yAxes, plotHeight, defaultHeight) {
        var positions,
            allAxesHeight = 0;

        function isPercentage(prop) {
            return defined(prop) && !isNumber(prop) && prop.match('%');
        }

        positions = yAxes.map(function (yAxis) {
            var height = isPercentage(yAxis.options.height) ?
                        parseFloat(yAxis.options.height) / 100 :
                        yAxis.height / plotHeight,
                top = isPercentage(yAxis.options.top) ?
                        parseFloat(yAxis.options.top) / 100 :
                        correctFloat(
                            yAxis.top - yAxis.chart.plotTop
                        ) / plotHeight;

            // New yAxis does not contain "height" info yet
            if (!isNumber(height)) {
                height = defaultHeight / 100;
            }

            allAxesHeight = correctFloat(allAxesHeight + height);

            return {
                height: height * 100,
                top: top * 100
            };
        });

        positions.allAxesHeight = allAxesHeight;

        return positions;
    },

    /**
     * Get current resize options for each yAxis. Note that each resize is
     * linked to the next axis, except the last one which shouldn't affect
     * axes in the navigator. Because indicator can be removed with it's yAxis
     * in the middle of yAxis array, we need to bind closest yAxes back.
     *
     * @private
     * @function Highcharts.Toolbar#getYAxisResizers
     *
     * @param {Array<Highcharts.Axis>} yAxes
     *        Array of yAxes available in the chart
     *
     * @return {Array<object>}
     *         An array of resizer options.
     *         Format: `{enabled: Boolean, controlledAxis: { next: [String]}}`
     */
    getYAxisResizers: function (yAxes) {
        var resizers = [];

        yAxes.forEach(function (yAxis, index) {
            var nextYAxis = yAxes[index + 1];

            // We have next axis, bind them:
            if (nextYAxis) {
                resizers[index] = {
                    enabled: true,
                    controlledAxis: {
                        next: [
                            pick(
                                nextYAxis.options.id,
                                nextYAxis.options.index
                            )
                        ]
                    }
                };
            } else {
                // Remove binding:
                resizers[index] = {
                    enabled: false
                };
            }
        });

        return resizers;
    },
    /**
     * Resize all yAxes (except navigator) to fit the plotting height. Method
     * checks if new axis is added, then shrinks other main axis up to 5 panes.
     * If added is more thatn 5 panes, it rescales all other axes to fit new
     * yAxis.
     *
     * If axis is removed, and we have more than 5 panes, rescales all other
     * axes. If chart has less than 5 panes, first pane receives all extra
     * space.
     *
     * @private
     * @function Highcharts.Toolbar#resizeYAxes
     *
     * @param {number} defaultHeight
     *        Default height for yAxis
     */
    resizeYAxes: function (defaultHeight) {
        defaultHeight = defaultHeight || 20; // in %, but as a number
        var chart = this.chart,
            // Only non-navigator axes
            yAxes = chart.yAxis.filter(this.utils.isNotNavigatorYAxis),
            plotHeight = chart.plotHeight,
            allAxesLength = yAxes.length,
            // Gather current heights (in %)
            positions = this.getYAxisPositions(
                yAxes,
                plotHeight,
                defaultHeight
            ),
            resizers = this.getYAxisResizers(yAxes),
            allAxesHeight = positions.allAxesHeight,
            changedSpace = defaultHeight;

        // More than 100%
        if (allAxesHeight > 1) {
            // Simple case, add new panes up to 5
            if (allAxesLength < 6) {
                // Added axis, decrease first pane's height:
                positions[0].height = correctFloat(
                    positions[0].height - changedSpace
                );
                // And update all other "top" positions:
                positions = this.recalculateYAxisPositions(
                    positions,
                    changedSpace
                );
            } else {
                // We have more panes, rescale all others to gain some space,
                // This is new height for upcoming yAxis:
                defaultHeight = 100 / allAxesLength;
                // This is how much we need to take from each other yAxis:
                changedSpace = defaultHeight / (allAxesLength - 1);

                // Now update all positions:
                positions = this.recalculateYAxisPositions(
                    positions,
                    changedSpace,
                    true,
                    -1
                );
            }
            // Set last position manually:
            positions[allAxesLength - 1] = {
                top: correctFloat(100 - defaultHeight),
                height: defaultHeight
            };

        } else {
            // Less than 100%
            changedSpace = correctFloat(1 - allAxesHeight) * 100;
            // Simple case, return first pane it's space:
            if (allAxesLength < 5) {
                positions[0].height = correctFloat(
                    positions[0].height + changedSpace
                );

                positions = this.recalculateYAxisPositions(
                    positions,
                    changedSpace
                );
            } else {
                // There were more panes, return to each pane a bit of space:
                changedSpace /= allAxesLength;
                // Removed axis, add extra space to the first pane:
                // And update all other positions:
                positions = this.recalculateYAxisPositions(
                    positions,
                    changedSpace,
                    true,
                    1
                );
            }
        }

        positions.forEach(function (position, index) {
            // if (index === 0) debugger;
            yAxes[index].update({
                height: position.height + '%',
                top: position.top + '%',
                resize: resizers[index]
            }, false);
        });
    },
    /**
     * Utility to modify calculated positions according to the remaining/needed
     * space. Later, these positions are used in `yAxis.update({ top, height })`
     *
     * @private
     * @function Highcharts.Toolbar#recalculateYAxisPositions
     *
     * @param {Array<object>} positions
     *        Default positions of all yAxes.
     *
     * @param {number} changedSpace
     *        How much space should be added or removed.
     * @param {number} adder
     *        `-1` or `1`, to determine whether we should add or remove space.
     *
     * @param {boolean} modifyHeight
     *        Update only `top` or both `top` and `height`.
     *
     * @return {Array<object>}
     *         Modified positions,
     */
    recalculateYAxisPositions: function (
        positions,
        changedSpace,
        modifyHeight,
        adder
    ) {
        positions.forEach(function (position, index) {
            var prevPosition = positions[index - 1];

            position.top = !prevPosition ? 0 :
                correctFloat(prevPosition.height + prevPosition.top);

            if (modifyHeight) {
                position.height = correctFloat(
                    position.height + adder * changedSpace
                );
            }
        });

        return positions;
    },
    /**
     * Generates API config for popup in the same format as options for
     * Annotation object.
     *
     * @function Highcharts.Toolbar#annotationToFields
     *
     * @param {Highcharts.Annotation} annotation
     *        Annotations object
     *
     * @return {object}
     *         Annotation options to be displayed in popup box
     */
    annotationToFields: function (annotation) {
        var options = annotation.options,
            editables = H.Toolbar.annotationsEditable,
            nestedEditables = editables.nestedOptions,
            getFieldType = this.utils.getFieldType,
            type = pick(
                options.type,
                options.shapes && options.shapes[0] &&
                    options.shapes[0].type,
                options.labels && options.labels[0] &&
                    options.labels[0].itemType,
                'label'
            ),
            nonEditables = H.Toolbar
                .annotationsNonEditable[options.langKey] || [],
            visualOptions = {
                langKey: options.langKey,
                type: type
            };

        /**
         * Nested options traversing. Method goes down to the options and copies
         * allowed options (with values) to new object, which is last parameter:
         * "parent".
         *
         * @private
         * @function Highcharts.Toolbar#annotationToFields.traverse
         *
         * @param {*} option
         *        Atomic type or object/array
         *
         * @param {string} key
         *        Option name, for example "visible" or "x", "y"
         *
         * @param {object} allowed
         *        Editables from H.Toolbar.annotationsEditable
         *
         * @param {object} parent
         *        Where new options will be assigned
         */
        function traverse(option, key, parentEditables, parent) {
            var nextParent;

            if (
                parentEditables &&
                nonEditables.indexOf(key) === -1 &&
                (
                    (
                        parentEditables.indexOf &&
                        parentEditables.indexOf(key)
                    ) >= 0 ||
                    parentEditables[key] || // nested array
                    parentEditables === true // simple array
                )
            ) {
                // Roots:
                if (isArray(option)) {
                    parent[key] = [];

                    option.forEach(function (arrayOption, i) {
                        if (!isObject(arrayOption)) {
                            // Simple arrays, e.g. [String, Number, Boolean]
                            traverse(
                                arrayOption,
                                0,
                                nestedEditables[key],
                                parent[key]
                            );
                        } else {
                            // Advanced arrays, e.g. [Object, Object]
                            parent[key][i] = {};
                            objectEach(
                                arrayOption,
                                function (nestedOption, nestedKey) {
                                    traverse(
                                        nestedOption,
                                        nestedKey,
                                        nestedEditables[key],
                                        parent[key][i]
                                    );
                                }
                            );
                        }
                    });
                } else if (isObject(option)) {
                    nextParent = {};
                    if (isArray(parent)) {
                        parent.push(nextParent);
                        nextParent[key] = {};
                        nextParent = nextParent[key];
                    } else {
                        parent[key] = nextParent;
                    }
                    objectEach(option, function (nestedOption, nestedKey) {
                        traverse(
                            nestedOption,
                            nestedKey,
                            key === 0 ? parentEditables : nestedEditables[key],
                            nextParent
                        );
                    });
                } else {
                    // Leaf:
                    if (key === 'format') {
                        parent[key] = [
                            H.format(
                                option,
                                annotation.labels[0].points[0]
                            ).toString(),
                            'text'
                        ];
                    } else if (isArray(parent)) {
                        parent.push([option, getFieldType(option)]);
                    } else {
                        parent[key] = [option, getFieldType(option)];
                    }
                }
            }
        }

        objectEach(options, function (option, key) {
            if (key === 'typeOptions') {
                visualOptions[key] = {};
                objectEach(options[key], function (typeOption, typeKey) {
                    traverse(
                        typeOption,
                        typeKey,
                        nestedEditables,
                        visualOptions[key],
                        true
                    );
                });
            } else {
                traverse(option, key, editables[type], visualOptions);
            }
        });

        return visualOptions;
    },

    /**
     * Get all class names for all parents in the element. Iterates until finds
     * main container.
     *
     * @function Highcharts.Toolbar#getClickedClassNames
     *
     * @param {Highcharts.HTMLDOMElement}
     *        Container that event is bound to.
     *
     * @param {global.Event} event
     *        Browser's event.
     *
     * @return {Array<string>}
     *         Array of class names with corresponding elements
     */
    getClickedClassNames: function (container, event) {
        var element = event.target,
            classNames = [],
            elemClassName;

        while (element) {
            elemClassName = H.attr(element, 'class');
            if (elemClassName) {
                classNames = classNames.concat(
                    elemClassName.split(' ').map(
                        function (name) { // eslint-disable-line no-loop-func
                            return [
                                name,
                                element
                            ];
                        }
                    )
                );
            }
            element = element.parentNode;

            if (element === container) {
                return classNames;
            }
        }

        return classNames;

    },
    /**
     * Get events bound to a button. It's a custom event delegation to find all
     * events connected to the element.
     *
     * @function Highcharts.Toolbar#getButtonEvents
     *
     * @param {Highcharts.HTMLDOMElement}
     *        Container that event is bound to.
     *
     * @param {global.Event} event
     *        Browser's event.
     *
     * @return {object}
     *         Oject with events (init, start, steps, and end)
     */
    getButtonEvents: function (container, event) {
        var toolbar = this,
            classNames = this.getClickedClassNames(container, event),
            bindings;


        classNames.forEach(function (className) {
            if (toolbar.boundClassNames[className[0]] && !bindings) {
                bindings = {
                    events: toolbar.boundClassNames[className[0]],
                    button: className[1]
                };
            }
        });

        return bindings;
    },
    /**
     * General utils for bindings
     *
     * @private
     * @name Highcharts.Toolbar#utils
     * @type {bindingsUtils}
     */
    utils: bindingsUtils
});

addEvent(H.Toolbar, 'afterInit', function () {
    var toolbar = this,
        options = toolbar.chart.options.stockTools,
        toolbarContainer = doc.getElementsByClassName(
            options.gui.toolbarClassName
        );

    // Shorthand object for getting events for buttons:
    toolbar.boundClassNames = {};

    objectEach(options.bindings, function (value) {
        toolbar.boundClassNames[value.className] = value;
    });

    // Handle multiple containers with the same class names:
    [].forEach.call(toolbarContainer, function (subContainer) {
        toolbar.eventsToUnbind.push(
            addEvent(
                subContainer,
                'click',
                function (event) {
                    var bindings = toolbar.getButtonEvents(
                        toolbarContainer,
                        event
                    );

                    if (bindings) {
                        toolbar.bindingsButtonClick(
                            bindings.button,
                            bindings.events,
                            event
                        );
                    }
                }
            )
        );
    });

    objectEach(options.events || {}, function (callback, eventName) {
        toolbar.eventsToUnbind.push(
            addEvent(
                toolbar,
                eventName,
                callback
            )
        );
    });
});

addEvent(H.Chart, 'load', function () {
    var chart = this,
        toolbar = chart.stockToolbar;

    if (toolbar) {
        toolbar.eventsToUnbind.push(
            addEvent(chart.container, 'click', function (e) {
                if (
                    !chart.cancelClick &&
                    chart.isInsidePlot(
                        e.chartX - chart.plotLeft,
                        e.chartY - chart.plotTop
                    )
                ) {
                    toolbar.bindingsChartClick(this, e);
                }
            })
        );
        toolbar.eventsToUnbind.push(
            addEvent(chart.container, 'mousemove', function (e) {
                toolbar.bindingsContainerMouseMove(this, e);
            })
        );
    }
});

addEvent(H.Toolbar, 'deselectButton', function () {
    this.selectedButtonElement = null;
});

// Show edit-annotation form:
function selectableAnnotation(annotationType) {
    var originalClick = annotationType.prototype.defaultOptions.events &&
            annotationType.prototype.defaultOptions.events.click;

    function selectAndshowPopup(event) {
        var annotation = this,
            toolbar = annotation.chart.stockToolbar,
            prevAnnotation = toolbar.activeAnnotation;

        if (originalClick) {
            originalClick.click.call(annotation, event);
        }

        if (prevAnnotation !== annotation) {
            // Select current:
            toolbar.deselectAnnotation();

            toolbar.activeAnnotation = annotation;
            annotation.setControlPointsVisibility(true);

            fireEvent(
                toolbar,
                'showPopup',
                {
                    annotation: annotation,
                    formType: 'annotation-toolbar',
                    options: toolbar.annotationToFields(annotation),
                    onSubmit: function (data) {

                        var config = {},
                            typeOptions;

                        if (data.actionType === 'remove') {
                            toolbar.activeAnnotation = false;
                            toolbar.chart.removeAnnotation(annotation);
                        } else {
                            toolbar.fieldsToOptions(data.fields, config);
                            toolbar.deselectAnnotation();

                            typeOptions = config.typeOptions;

                            if (annotation.options.type === 'measure') {
                                // Manually disable crooshars according to
                                // stroke width of the shape:
                                typeOptions.crosshairY.enabled =
                                    typeOptions.crosshairY.strokeWidth !== 0;
                                typeOptions.crosshairX.enabled =
                                    typeOptions.crosshairX.strokeWidth !== 0;
                            }

                            annotation.update(config);
                        }
                    }
                }
            );
        } else {
            // Deselect current:
            toolbar.deselectAnnotation();
            fireEvent(toolbar, 'closePopup');
        }
        // Let bubble event to chart.click:
        event.activeAnnotation = true;
    }

    H.merge(
        true,
        annotationType.prototype.defaultOptions.events,
        {
            click: selectAndshowPopup
        }
    );
}

if (H.Annotation) {
    // Basic shapes:
    selectableAnnotation(H.Annotation);

    // Advanced annotations:
    H.objectEach(H.Annotation.types, function (annotationType) {
        selectableAnnotation(annotationType);
    });
}

H.setOptions({
    stockTools: {
        bindings: stockToolsBindings,

        /**
         * A `showPopup` event. Fired when selecting for example an annotation.
         *
         * @type      {Function}
         * @apioption stockTools.events.showPopup
         */

        /**
         * A `hidePopop` event. Fired when Popup should be hidden, for exampole
         * when clicking on an annotation again.
         *
         * @type      {Function}
         * @apioption stockTools.events.hidePopup
         */

        /**
         * Event fired on a button click.
         *
         * @type      {Function}
         * @apioption stockTools.events.selectButton
         */

        /**
         * Event fired when button state should change, for example after
         * adding an annotation.
         *
         * @type      {Function}
         * @apioption stockTools.events.deselectButton
         */

        /**
         * Events to communicate between Stock Tools and custom GUI.
         *
         * @since        7.0.0
         * @product      highstock
         * @optionparent stockTools.events
         */
        events: {}
    }
});
