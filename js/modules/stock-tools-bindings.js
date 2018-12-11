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

var fireEvent = H.fireEvent,
    defined = H.defined,
    pick = H.pick,
    extend = H.extend,
    isNumber = H.isNumber,
    correctFloat = H.correctFloat,
    bindingsUtils = H.NavigationBindings.prototype.utils,
    PREFIX = 'highcharts-';

/**
 * Generates function which will add a flag series using modal in GUI.
 * Method fires an event "showPopup" with config:
 * `{type, options, callback}`.
 *
 * Example: NavigationBindings.utils.addFlagFromForm('url(...)') - will
 * generate function that shows modal in GUI.
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
bindingsUtils.addFlagFromForm = function (type) {
    return function (e) {
        var navigation = this,
            chart = navigation.chart,
            toolbar = chart.toolbar,
            getFieldType = bindingsUtils.getFieldType,
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
                                navigation,
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
                                            navigation.fieldsToOptions(
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

        if (!toolbar || !toolbar.guiEnabled) {
            chart.addSeries(seriesOptions);
        }

        fireEvent(
            navigation,
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
                    navigation.fieldsToOptions(
                        data.fields,
                        seriesOptions.data[0]
                    );
                    chart.addSeries(seriesOptions);
                }
            }
        );
    };
};

bindingsUtils.manageIndicators = function (data) {
    var navigation = this,
        chart = navigation.chart,
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
        navigation.fieldsToOptions(data.fields, seriesConfig);
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
                navigation.resizeYAxes();
            }
        }
    } else {
        seriesConfig.id = H.uniqueKey();
        navigation.fieldsToOptions(data.fields, seriesConfig);

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
            navigation.resizeYAxes();
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
        navigation,
        'deselectButton',
        {
            button: navigation.selectedButtonElement
        }
    );

    chart.redraw();
};

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
bindingsUtils.updateHeight = function (e, annotation) {
    annotation.update({
        typeOptions: {
            height: this.chart.yAxis[0].toValue(e.chartY) -
                annotation.options.typeOptions.points[1].y
        }
    });
};

// @todo
// Consider using getHoverData(), but always kdTree (columns?)
bindingsUtils.attractToPoint = function (e, chart) {
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
};

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
bindingsUtils.isNotNavigatorYAxis = function (axis) {
    return axis.userOptions.className !== PREFIX + 'navigator-yaxis';
};
/**
 * Update each point after specified index, most of the annotations use
 * this. For example crooked line: logic behind updating each point is the
 * same, only index changes when adding an annotation.
 *
 * Example: NavigationBindings.utils.updateNthPoint(1) - will generate
 * function that updates all consecutive points except point with index=0.
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
bindingsUtils.updateNthPoint = function (startIndex) {
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
};

// Extends NavigationBindigs to support indicators and resizers:
extend(H.NavigationBindings.prototype, {
    /**
     * Get current positions for all yAxes. If new axis does not have position,
     * returned is default height and last available top place.
     *
     * @private
     * @function Highcharts.NavigationBindings#getYAxisPositions
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
     * @function Highcharts.NavigationBindings#getYAxisResizers
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
     * @function Highcharts.NavigationBindings#resizeYAxes
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
     * @function Highcharts.NavigationBindings#recalculateYAxisPositions
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
    }
});

/**
 * @type         {Highcharts.Dictionary<Highcharts.StockToolsBindingsObject>|*}
 * @since        7.0.0
 * @optionparent navigation.bindings
 */
var stockToolsBindings = {
    // Line type annotations:
    /**
     * A segment annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @product highstock
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
                type: 'crookedLine',
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
     * @product highstock
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
                type: 'crookedLine',
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
     * @product highstock
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
                type: 'infinityLine',
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
     * @product highstock
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
                type: 'infinityLine',
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
     * @product highstock
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
                type: 'infinityLine',
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
     * @product highstock
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
                type: 'infinityLine',
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
     * @product highstock
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
                type: 'infinityLine',
                typeOptions: {
                    type: 'horizontalLine',
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
     * @product highstock
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
                type: 'infinityLine',
                typeOptions: {
                    type: 'verticalLine',
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
     * @product highstock
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
                langKey: 'crooked3',
                type: 'crookedLine',
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
     * @product highstock
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
                type: 'crookedLine',
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
     * @product highstock
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
                langKey: 'elliott3',
                type: 'elliottWave',
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
     * @product highstock
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
                langKey: 'elliott5',
                type: 'elliottWave',
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
     * @product highstock
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
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (y-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @product highstock
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
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (xy-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @product highstock
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
            bindingsUtils.updateRectSize
        ]
    },
    // Advanced type annotations:
    /**
     * A fibonacci annotation bindings. Includes `start` and two events in
     * `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
                type: 'verticalLine',
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
     * @product highstock
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
                type: 'verticalLine',
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
     * @product highstock
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
                type: 'verticalLine',
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
     * @product highstock
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
                lastPrice = options.lastPrice && options.lastPrice.enabled,
                gui = this.chart.stockToolbar;

            if (gui && gui.guiEnabled) {
                if (lastPrice) {
                    button.firstChild.style['background-image'] =
                        'url("' + gui.options.iconsURL +
                        'current-price-show.svg")';
                } else {
                    button.firstChild.style['background-image'] =
                        'url("' + gui.options.iconsURL +
                        'current-price-hide.svg")';
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
     * @product highstock
     * @default {"className": "highcharts-indicators", "init": function() {}}
     */
    indicators: {
        /** @ignore */
        className: 'highcharts-indicators',
        /** @ignore */
        init: function () {
            var navigation = this;

            fireEvent(
                navigation,
                'showPopup',
                {
                    formType: 'indicators',
                    options: {},
                    // Callback on submit:
                    onSubmit: function (data) {
                        navigation.utils.manageIndicators.call(
                            navigation,
                            data
                        );
                    }
                }
            );
        }
    },
    /**
     * Hides/shows all annotations on a chart.
     *
     * @type    {Highcharts.StockToolsBindingsObject}
     * @product highstock
     * @default {"className": "highcharts-toggle-annotations", "init": function() {}}
     */
    toggleAnnotations: {
        /** @ignore */
        className: 'highcharts-toggle-annotations',
        /** @ignore */
        init: function (button) {
            var gui = this.chart.stockToolbar;

            this.toggledAnnotations = !this.toggledAnnotations;

            (this.chart.annotations || []).forEach(function (annotation) {
                annotation.setVisibility(!this.toggledAnnotations);
            }, this);

            if (gui && gui.guiEnabled) {
                if (this.toggledAnnotations) {
                    button.firstChild.style['background-image'] =
                        'url("' + gui.options.iconsURL +
                            'annotations-hidden.svg")';
                } else {
                    button.firstChild.style['background-image'] =
                        'url("' + gui.options.iconsURL +
                            'annotations-visible.svg")';
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
     * @product highstock
     * @default {"className": "highcharts-save-chart", "init": function() {}}
     */
    saveChart: {
        /** @ignore */
        className: 'highcharts-save-chart',
        /** @ignore */
        init: function (button) {
            var navigation = this,
                chart = navigation.chart,
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
                if (navigation.utils.isNotNavigatorYAxis(yAxis)) {
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

H.setOptions({
    navigation: {
        bindings: stockToolsBindings
    }
});
