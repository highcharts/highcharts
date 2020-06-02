/**
 *
 *  Events generator for Stock tools
 *
 *  (c) 2009-2020 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import NavigationBindings from '../annotations/navigationBindings.js';
import U from '../parts/Utilities.js';
var correctFloat = U.correctFloat, defined = U.defined, extend = U.extend, fireEvent = U.fireEvent, isNumber = U.isNumber, merge = U.merge, pick = U.pick, setOptions = U.setOptions, uniqueKey = U.uniqueKey;
var bindingsUtils = NavigationBindings.prototype.utils, PREFIX = 'highcharts-';
/* eslint-disable no-invalid-this, valid-jsdoc */
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
 * @param {Highcharts.FlagsShapeValue} type
 *        Type of flag series, e.g. "squarepin"
 *
 * @return {Function}
 *         Callback to be used in `start` callback
 */
bindingsUtils.addFlagFromForm = function (type) {
    return function (e) {
        var navigation = this, chart = navigation.chart, toolbar = chart.stockTools, getFieldType = bindingsUtils.getFieldType, point = bindingsUtils.attractToPoint(e, chart), pointConfig = {
            x: point.x,
            y: point.y
        }, seriesOptions = {
            type: 'flags',
            onSeries: point.series.id,
            shape: type,
            data: [pointConfig],
            point: {
                events: {
                    click: function () {
                        var point = this, options = point.options;
                        fireEvent(navigation, 'showPopup', {
                            point: point,
                            formType: 'annotation-toolbar',
                            options: {
                                langKey: 'flags',
                                type: 'flags',
                                title: [
                                    options.title,
                                    getFieldType(options.title)
                                ],
                                name: [
                                    options.name,
                                    getFieldType(options.name)
                                ]
                            },
                            onSubmit: function (updated) {
                                if (updated.actionType === 'remove') {
                                    point.remove();
                                }
                                else {
                                    point.update(navigation.fieldsToOptions(updated.fields, {}));
                                }
                            }
                        });
                    }
                }
            }
        };
        if (!toolbar || !toolbar.guiEnabled) {
            chart.addSeries(seriesOptions);
        }
        fireEvent(navigation, 'showPopup', {
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
                navigation.fieldsToOptions(data.fields, seriesOptions.data[0]);
                chart.addSeries(seriesOptions);
            }
        });
    };
};
bindingsUtils.manageIndicators = function (data) {
    var navigation = this, chart = navigation.chart, seriesConfig = {
        linkedTo: data.linkedTo,
        type: data.type
    }, indicatorsWithVolume = [
        'ad',
        'cmf',
        'mfi',
        'vbp',
        'vwap'
    ], indicatorsWithAxes = [
        'ad',
        'atr',
        'cci',
        'cmf',
        'macd',
        'mfi',
        'roc',
        'rsi',
        'ao',
        'aroon',
        'aroonoscillator',
        'trix',
        'apo',
        'dpo',
        'ppo',
        'natr',
        'williamsr',
        'stochastic',
        'slowstochastic',
        'linearRegression',
        'linearRegressionSlope',
        'linearRegressionIntercept',
        'linearRegressionAngle'
    ], yAxis, series;
    if (data.actionType === 'edit') {
        navigation.fieldsToOptions(data.fields, seriesConfig);
        series = chart.get(data.seriesId);
        if (series) {
            series.update(seriesConfig, false);
        }
    }
    else if (data.actionType === 'remove') {
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
    }
    else {
        seriesConfig.id = uniqueKey();
        navigation.fieldsToOptions(data.fields, seriesConfig);
        if (indicatorsWithAxes.indexOf(data.type) >= 0) {
            yAxis = chart.addAxis({
                id: uniqueKey(),
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
        else {
            seriesConfig.yAxis = chart.get(data.linkedTo).options.yAxis;
        }
        if (indicatorsWithVolume.indexOf(data.type) >= 0) {
            seriesConfig.params.volumeSeriesID = chart.series.filter(function (series) {
                return series.options.type === 'column';
            })[0].options.id;
        }
        chart.addSeries(seriesConfig, false);
    }
    fireEvent(navigation, 'deselectButton', {
        button: navigation.selectedButtonElement
    });
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
 * @param {Highcharts.PointerEventObject} e
 *        normalized browser event
 *
 * @param {Highcharts.Annotation} annotation
 *        Annotation to be updated
 *
 * @return {void}
 */
bindingsUtils.updateHeight = function (e, annotation) {
    annotation.update({
        typeOptions: {
            height: this.chart.pointer.getCoordinates(e).yAxis[0].value -
                annotation.options.typeOptions.points[1].y
        }
    });
};
// @todo
// Consider using getHoverData(), but always kdTree (columns?)
bindingsUtils.attractToPoint = function (e, chart) {
    var coords = chart.pointer.getCoordinates(e), x = coords.xAxis[0].value, y = coords.yAxis[0].value, distX = Number.MAX_VALUE, closestPoint;
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
 * Axis to check.
 *
 * @return {boolean}
 * True, if axis comes from navigator.
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
        var options = annotation.options.typeOptions, coords = this.chart.pointer.getCoordinates(e), x = coords.xAxis[0].value, y = coords.yAxis[0].value;
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
extend(NavigationBindings.prototype, {
    /* eslint-disable valid-jsdoc */
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
        var positions, allAxesHeight = 0;
        /** @private */
        function isPercentage(prop) {
            return defined(prop) && !isNumber(prop) && prop.match('%');
        }
        positions = yAxes.map(function (yAxis) {
            var height = isPercentage(yAxis.options.height) ?
                parseFloat(yAxis.options.height) / 100 :
                yAxis.height / plotHeight, top = isPercentage(yAxis.options.top) ?
                parseFloat(yAxis.options.top) / 100 :
                correctFloat(yAxis.top - yAxis.chart.plotTop) / plotHeight;
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
        yAxes.forEach(function (_yAxis, index) {
            var nextYAxis = yAxes[index + 1];
            // We have next axis, bind them:
            if (nextYAxis) {
                resizers[index] = {
                    enabled: true,
                    controlledAxis: {
                        next: [
                            pick(nextYAxis.options.id, nextYAxis.options.index)
                        ]
                    }
                };
            }
            else {
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
     * @param {number} [defaultHeight]
     * Default height for yAxis
     */
    resizeYAxes: function (defaultHeight) {
        defaultHeight = defaultHeight || 20; // in %, but as a number
        var chart = this.chart, 
        // Only non-navigator axes
        yAxes = chart.yAxis.filter(bindingsUtils.isNotNavigatorYAxis), plotHeight = chart.plotHeight, allAxesLength = yAxes.length, 
        // Gather current heights (in %)
        positions = this.getYAxisPositions(yAxes, plotHeight, defaultHeight), resizers = this.getYAxisResizers(yAxes), allAxesHeight = positions.allAxesHeight, changedSpace = defaultHeight;
        // More than 100%
        if (allAxesHeight > 1) {
            // Simple case, add new panes up to 5
            if (allAxesLength < 6) {
                // Added axis, decrease first pane's height:
                positions[0].height = correctFloat(positions[0].height - changedSpace);
                // And update all other "top" positions:
                positions = this.recalculateYAxisPositions(positions, changedSpace);
            }
            else {
                // We have more panes, rescale all others to gain some space,
                // This is new height for upcoming yAxis:
                defaultHeight = 100 / allAxesLength;
                // This is how much we need to take from each other yAxis:
                changedSpace = defaultHeight / (allAxesLength - 1);
                // Now update all positions:
                positions = this.recalculateYAxisPositions(positions, changedSpace, true, -1);
            }
            // Set last position manually:
            positions[allAxesLength - 1] = {
                top: correctFloat(100 - defaultHeight),
                height: defaultHeight
            };
        }
        else {
            // Less than 100%
            changedSpace = correctFloat(1 - allAxesHeight) * 100;
            // Simple case, return first pane it's space:
            if (allAxesLength < 5) {
                positions[0].height = correctFloat(positions[0].height + changedSpace);
                positions = this.recalculateYAxisPositions(positions, changedSpace);
            }
            else {
                // There were more panes, return to each pane a bit of space:
                changedSpace /= allAxesLength;
                // Removed axis, add extra space to the first pane:
                // And update all other positions:
                positions = this.recalculateYAxisPositions(positions, changedSpace, true, 1);
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
     * @param {Array<Highcharts.Dictionary<number>>} positions
     * Default positions of all yAxes.
     * @param {number} changedSpace
     * How much space should be added or removed.
     * @param {boolean} modifyHeight
     * Update only `top` or both `top` and `height`.
     * @param {number} adder
     * `-1` or `1`, to determine whether we should add or remove space.
     *
     * @return {Array<object>}
     *         Modified positions,
     */
    recalculateYAxisPositions: function (positions, changedSpace, modifyHeight, adder) {
        positions.forEach(function (position, index) {
            var prevPosition = positions[index - 1];
            position.top = !prevPosition ? 0 :
                correctFloat(prevPosition.height + prevPosition.top);
            if (modifyHeight) {
                position.height = correctFloat(position.height + adder * changedSpace);
            }
        });
        return positions;
    }
    /* eslint-enable valid-jsdoc */
});
/**
 * @type         {Highcharts.Dictionary<Highcharts.NavigationBindingsOptionsObject>}
 * @since        7.0.0
 * @optionparent navigation.bindings
 */
var stockToolsBindings = {
    // Line type annotations:
    /**
     * A segment annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-segment", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    segment: {
        /** @ignore-option */
        className: 'highcharts-segment',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'segment',
                type: 'crookedLine',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.segment.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A segment with an arrow annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-segment", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowSegment: {
        /** @ignore-option */
        className: 'highcharts-arrow-segment',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'arrowSegment',
                type: 'crookedLine',
                typeOptions: {
                    line: {
                        markerEnd: 'arrow'
                    },
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.arrowSegment.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-ray", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    ray: {
        /** @ignore-option */
        className: 'highcharts-ray',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'ray',
                type: 'crookedLine',
                typeOptions: {
                    type: 'ray',
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.ray.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray with an arrow annotation bindings. Includes `start` and one event
     * in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-ray", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowRay: {
        /** @ignore-option */
        className: 'highcharts-arrow-ray',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'arrowRay',
                type: 'infinityLine',
                typeOptions: {
                    type: 'ray',
                    line: {
                        markerEnd: 'arrow'
                    },
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.arrowRay.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line annotation. Includes `start` and one event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-infinity-line", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    infinityLine: {
        /** @ignore-option */
        className: 'highcharts-infinity-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'infinityLine',
                type: 'infinityLine',
                typeOptions: {
                    type: 'line',
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.infinityLine.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line with arrow annotation. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-infinity-line", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowInfinityLine: {
        /** @ignore-option */
        className: 'highcharts-arrow-infinity-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'arrowInfinityLine',
                type: 'infinityLine',
                typeOptions: {
                    type: 'line',
                    line: {
                        markerEnd: 'arrow'
                    },
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.arrowInfinityLine.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A horizontal line annotation. Includes `start` event.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-horizontal-line", "start": function() {}, "annotationsOptions": {}}
     */
    horizontalLine: {
        /** @ignore-option */
        className: 'highcharts-horizontal-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'horizontalLine',
                type: 'infinityLine',
                draggable: 'y',
                typeOptions: {
                    type: 'horizontalLine',
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.horizontalLine.annotationsOptions);
            this.chart.addAnnotation(options);
        }
    },
    /**
     * A vertical line annotation. Includes `start` event.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-line", "start": function() {}, "annotationsOptions": {}}
     */
    verticalLine: {
        /** @ignore-option */
        className: 'highcharts-vertical-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'verticalLine',
                type: 'infinityLine',
                draggable: 'x',
                typeOptions: {
                    type: 'verticalLine',
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.verticalLine.annotationsOptions);
            this.chart.addAnnotation(options);
        }
    },
    /**
     * Crooked line (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points in crooked line) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    // Crooked Line type annotations:
    crooked3: {
        /** @ignore-option */
        className: 'highcharts-crooked3',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'crooked3',
                type: 'crookedLine',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.crooked3.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    /**
     * Crooked line (five points) annotation bindings. Includes `start` and four
     * events in `steps` (for all consequent points in crooked line) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}], "annotationsOptions": {}}
     */
    crooked5: {
        /** @ignore-option */
        className: 'highcharts-crooked5',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'crookedLine',
                type: 'crookedLine',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.crooked5.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
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
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    elliott3: {
        /** @ignore-option */
        className: 'highcharts-elliott3',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'elliott3',
                type: 'elliottWave',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                },
                labelOptions: {
                    style: {
                        color: '#666666'
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.elliott3.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3)
        ]
    },
    /**
     * Elliott wave (five points) annotation bindings. Includes `start` and four
     * event in `steps` (for all consequent points in Elliott wave) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}], "annotationsOptions": {}}
     */
    elliott5: {
        /** @ignore-option */
        className: 'highcharts-elliott5',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'elliott5',
                type: 'elliottWave',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                },
                labelOptions: {
                    style: {
                        color: '#666666'
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.elliott5.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4),
            bindingsUtils.updateNthPoint(5)
        ]
    },
    /**
     * A measure (x-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-x", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureX: {
        /** @ignore-option */
        className: 'highcharts-measure-x',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'measure',
                type: 'measure',
                typeOptions: {
                    selectType: 'x',
                    point: {
                        x: coords.xAxis[0].value,
                        y: coords.yAxis[0].value,
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
            }, navigation.annotationsOptions, navigation.bindings.measureX.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (y-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-y", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureY: {
        /** @ignore-option */
        className: 'highcharts-measure-y',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'measure',
                type: 'measure',
                typeOptions: {
                    selectType: 'y',
                    point: {
                        x: coords.xAxis[0].value,
                        y: coords.yAxis[0].value,
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
            }, navigation.annotationsOptions, navigation.bindings.measureY.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (xy-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-xy", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureXY: {
        /** @ignore-option */
        className: 'highcharts-measure-xy',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'measure',
                type: 'measure',
                typeOptions: {
                    selectType: 'xy',
                    point: {
                        x: coords.xAxis[0].value,
                        y: coords.yAxis[0].value,
                        xAxis: 0,
                        yAxis: 0
                    },
                    background: {
                        width: 0,
                        height: 0,
                        strokeWidth: 10
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
            }, navigation.annotationsOptions, navigation.bindings.measureXY.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    // Advanced type annotations:
    /**
     * A fibonacci annotation bindings. Includes `start` and two events in
     * `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-fibonacci", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    fibonacci: {
        /** @ignore-option */
        className: 'highcharts-fibonacci',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'fibonacci',
                type: 'fibonacci',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                },
                labelOptions: {
                    style: {
                        color: '#666666'
                    }
                }
            }, navigation.annotationsOptions, navigation.bindings.fibonacci.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * A parallel channel (tunnel) annotation bindings. Includes `start` and
     * two events in `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-parallel-channel", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    parallelChannel: {
        /** @ignore-option */
        className: 'highcharts-parallel-channel',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'parallelChannel',
                type: 'tunnel',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }]
                }
            }, navigation.annotationsOptions, navigation.bindings.parallelChannel.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * An Andrew's pitchfork annotation bindings. Includes `start` and two
     * events in `steps` array (sets second and third control points).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-pitchfork", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    pitchfork: {
        /** @ignore-option */
        className: 'highcharts-pitchfork',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, options = merge({
                langKey: 'pitchfork',
                type: 'pitchfork',
                typeOptions: {
                    points: [{
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value,
                            controlPoint: {
                                style: {
                                    fill: 'red'
                                }
                            }
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }, {
                            x: coords.xAxis[0].value,
                            y: coords.yAxis[0].value
                        }],
                    innerBackground: {
                        fill: 'rgba(100, 170, 255, 0.8)'
                    }
                },
                shapeOptions: {
                    strokeWidth: 2
                }
            }, navigation.annotationsOptions, navigation.bindings.pitchfork.annotationsOptions);
            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
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
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-counter", "start": function() {}, "annotationsOptions": {}}
     */
    verticalCounter: {
        /** @ignore-option */
        className: 'highcharts-vertical-counter',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart), navigation = this.chart.options.navigation, verticalCounter = !defined(this.verticalCounter) ? 0 :
                this.verticalCounter, options = merge({
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
                        text: verticalCounter.toString()
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
            }, navigation.annotationsOptions, navigation.bindings.verticalCounter.annotationsOptions), annotation;
            annotation = this.chart.addAnnotation(options);
            verticalCounter++;
            annotation.options.events.click.call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow and a label with
     * value.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-label", "start": function() {}, "annotationsOptions": {}}
     */
    verticalLabel: {
        /** @ignore-option */
        className: 'highcharts-vertical-label',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart), navigation = this.chart.options.navigation, options = merge({
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
            }, navigation.annotationsOptions, navigation.bindings.verticalLabel.annotationsOptions), annotation;
            annotation = this.chart.addAnnotation(options);
            annotation.options.events.click.call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow. Green arrow when
     * pointing from above, red when pointing from below the point.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-arrow", "start": function() {}, "annotationsOptions": {}}
     */
    verticalArrow: {
        /** @ignore-option */
        className: 'highcharts-vertical-arrow',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (e) {
            var closestPoint = bindingsUtils.attractToPoint(e, this.chart), navigation = this.chart.options.navigation, options = merge({
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
            }, navigation.annotationsOptions, navigation.bindings.verticalArrow.annotationsOptions), annotation;
            annotation = this.chart.addAnnotation(options);
            annotation.options.events.click.call(annotation, {});
        }
    },
    // Flag types:
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'circlepin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-circlepin", "start": function() {}}
     */
    flagCirclepin: {
        /** @ignore-option */
        className: 'highcharts-flag-circlepin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('circlepin')
    },
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'diamondpin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-diamondpin", "start": function() {}}
     */
    flagDiamondpin: {
        /** @ignore-option */
        className: 'highcharts-flag-diamondpin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('flag')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag with
     * `'squarepin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-squarepin", "start": function() {}}
     */
    flagSquarepin: {
        /** @ignore-option */
        className: 'highcharts-flag-squarepin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('squarepin')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag without pin
     * shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-simplepin", "start": function() {}}
     */
    flagSimplepin: {
        /** @ignore-option */
        className: 'highcharts-flag-simplepin',
        /** @ignore-option */
        start: bindingsUtils.addFlagFromForm('nopin')
    },
    // Other tools:
    /**
     * Enables zooming in xAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-x", "init": function() {}}
     */
    zoomX: {
        /** @ignore-option */
        className: 'highcharts-zoom-x',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'x'
                }
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Enables zooming in yAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-y", "init": function() {}}
     */
    zoomY: {
        /** @ignore-option */
        className: 'highcharts-zoom-y',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'y'
                }
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Enables zooming in xAxis and yAxis on a chart. Includes `start` event
     * which changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-xy", "init": function() {}}
     */
    zoomXY: {
        /** @ignore-option */
        className: 'highcharts-zoom-xy',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.update({
                chart: {
                    zoomType: 'xy'
                }
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Changes main series to `'line'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-line", "init": function() {}}
     */
    seriesTypeLine: {
        /** @ignore-option */
        className: 'highcharts-series-type-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.series[0].update({
                type: 'line',
                useOhlcData: true
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Changes main series to `'ohlc'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-ohlc", "init": function() {}}
     */
    seriesTypeOhlc: {
        /** @ignore-option */
        className: 'highcharts-series-type-ohlc',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.series[0].update({
                type: 'ohlc'
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Changes main series to `'candlestick'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-candlestick", "init": function() {}}
     */
    seriesTypeCandlestick: {
        /** @ignore-option */
        className: 'highcharts-series-type-candlestick',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.series[0].update({
                type: 'candlestick'
            });
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Displays chart in fullscreen.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-full-screen", "init": function() {}}
     */
    fullScreen: {
        /** @ignore-option */
        className: 'highcharts-full-screen',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            this.chart.fullscreen.toggle();
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Hides/shows two price indicators:
     * - last price in the dataset
     * - last price in the selected range
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-current-price-indicator", "init": function() {}}
     */
    currentPriceIndicator: {
        /** @ignore-option */
        className: 'highcharts-current-price-indicator',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            var chart = this.chart, series = chart.series[0], options = series.options, lastVisiblePrice = (options.lastVisiblePrice &&
                options.lastVisiblePrice.enabled), lastPrice = options.lastPrice && options.lastPrice.enabled, gui = chart.stockTools, iconsURL = gui.getIconsURL();
            if (gui && gui.guiEnabled) {
                if (lastPrice) {
                    button.firstChild.style['background-image'] =
                        'url("' + iconsURL +
                            'current-price-show.svg")';
                }
                else {
                    button.firstChild.style['background-image'] =
                        'url("' + iconsURL +
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
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Indicators bindings. Includes `init` event to show a popup.
     *
     * Note: In order to show base series from the chart in the popup's
     * dropdown each series requires
     * [series.id](https://api.highcharts.com/highstock/series.line.id) to be
     * defined.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-indicators", "init": function() {}}
     */
    indicators: {
        /** @ignore-option */
        className: 'highcharts-indicators',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function () {
            var navigation = this;
            fireEvent(navigation, 'showPopup', {
                formType: 'indicators',
                options: {},
                // Callback on submit:
                onSubmit: function (data) {
                    navigation.utils.manageIndicators.call(navigation, data);
                }
            });
        }
    },
    /**
     * Hides/shows all annotations on a chart.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-toggle-annotations", "init": function() {}}
     */
    toggleAnnotations: {
        /** @ignore-option */
        className: 'highcharts-toggle-annotations',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            var chart = this.chart, gui = chart.stockTools, iconsURL = gui.getIconsURL();
            this.toggledAnnotations = !this.toggledAnnotations;
            (chart.annotations || []).forEach(function (annotation) {
                annotation.setVisibility(!this.toggledAnnotations);
            }, this);
            if (gui && gui.guiEnabled) {
                if (this.toggledAnnotations) {
                    button.firstChild.style['background-image'] =
                        'url("' + iconsURL +
                            'annotations-hidden.svg")';
                }
                else {
                    button.firstChild.style['background-image'] =
                        'url("' + iconsURL +
                            'annotations-visible.svg")';
                }
            }
            fireEvent(this, 'deselectButton', { button: button });
        }
    },
    /**
     * Save a chart in localStorage under `highcharts-chart` key.
     * Stored items:
     * - annotations
     * - indicators (with yAxes)
     * - flags
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-save-chart", "init": function() {}}
     */
    saveChart: {
        /** @ignore-option */
        className: 'highcharts-save-chart',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (button) {
            var navigation = this, chart = navigation.chart, annotations = [], indicators = [], flags = [], yAxes = [];
            chart.annotations.forEach(function (annotation, index) {
                annotations[index] = annotation.userOptions;
            });
            chart.series.forEach(function (series) {
                if (series.is('sma')) {
                    indicators.push(series.userOptions);
                }
                else if (series.type === 'flags') {
                    flags.push(series.userOptions);
                }
            });
            chart.yAxis.forEach(function (yAxis) {
                if (bindingsUtils.isNotNavigatorYAxis(yAxis)) {
                    yAxes.push(yAxis.options);
                }
            });
            H.win.localStorage.setItem(PREFIX + 'chart', JSON.stringify({
                annotations: annotations,
                indicators: indicators,
                flags: flags,
                yAxes: yAxes
            }));
            fireEvent(this, 'deselectButton', { button: button });
        }
    }
};
setOptions({
    navigation: {
        bindings: stockToolsBindings
    }
});
NavigationBindings.prototype.utils = merge(bindingsUtils, NavigationBindings.prototype.utils);
