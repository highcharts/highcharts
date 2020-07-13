/* *
 *
 *  (c) 2009-2017 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Annotation from './Annotations.js';
import chartNavigationMixin from '../../mixins/navigation.js';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, attr = U.attr, extend = U.extend, format = U.format, fireEvent = U.fireEvent, isArray = U.isArray, isFunction = U.isFunction, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge, objectEach = U.objectEach, pick = U.pick, setOptions = U.setOptions;
/**
 * A config object for navigation bindings in annotations.
 *
 * @interface Highcharts.NavigationBindingsOptionsObject
 */ /**
* ClassName of the element for a binding.
* @name Highcharts.NavigationBindingsOptionsObject#className
* @type {string|undefined}
*/ /**
* Last event to be fired after last step event.
* @name Highcharts.NavigationBindingsOptionsObject#end
* @type {Function|undefined}
*/ /**
* Initial event, fired on a button click.
* @name Highcharts.NavigationBindingsOptionsObject#init
* @type {Function|undefined}
*/ /**
* Event fired on first click on a chart.
* @name Highcharts.NavigationBindingsOptionsObject#start
* @type {Function|undefined}
*/ /**
* Last event to be fired after last step event. Array of step events to be
* called sequentially after each user click.
* @name Highcharts.NavigationBindingsOptionsObject#steps
* @type {Array<Function>|undefined}
*/
var doc = H.doc, win = H.win, PREFIX = 'highcharts-';
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * IE 9-11 polyfill for Element.closest():
 * @private
 */
function closestPolyfill(el, s) {
    var ElementProto = win.Element.prototype, elementMatches = ElementProto.matches ||
        ElementProto.msMatchesSelector ||
        ElementProto.webkitMatchesSelector, ret = null;
    if (ElementProto.closest) {
        ret = ElementProto.closest.call(el, s);
    }
    else {
        do {
            if (elementMatches.call(el, s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
    }
    return ret;
}
/**
 * @private
 * @interface bindingsUtils
 */
var bindingsUtils = {
    /**
     * Update size of background (rect) in some annotations: Measure, Simple
     * Rect.
     *
     * @private
     * @function Highcharts.NavigationBindingsUtilsObject.updateRectSize
     *
     * @param {Highcharts.PointerEventObject} event
     * Normalized browser event
     *
     * @param {Highcharts.Annotation} annotation
     * Annotation to be updated
     */
    updateRectSize: function (event, annotation) {
        var chart = annotation.chart, options = annotation.options.typeOptions, coords = chart.pointer.getCoordinates(event), width = coords.xAxis[0].value - options.point.x, height = options.point.y - coords.yAxis[0].value;
        annotation.update({
            typeOptions: {
                background: {
                    width: chart.inverted ? height : width,
                    height: chart.inverted ? width : height
                }
            }
        });
    },
    /**
     * Get field type according to value
     *
     * @private
     * @function Highcharts.NavigationBindingsUtilsObject.getFieldType
     *
     * @param {'boolean'|'number'|'string'} value
     * Atomic type (one of: string, number, boolean)
     *
     * @return {'checkbox'|'number'|'text'}
     * Field type (one of: text, number, checkbox)
     */
    getFieldType: function (value) {
        return {
            'string': 'text',
            'number': 'number',
            'boolean': 'checkbox'
        }[typeof value];
    }
};
/**
 * @private
 */
var NavigationBindings = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function NavigationBindings(chart, options) {
        this.boundClassNames = void 0;
        this.selectedButton = void 0;
        this.chart = chart;
        this.options = options;
        this.eventsToUnbind = [];
        this.container = doc.getElementsByClassName(this.options.bindingsClassName || '');
    }
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
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Initi all events conencted to NavigationBindings.
     *
     * @private
     * @function Highcharts.NavigationBindings#initEvents
     */
    NavigationBindings.prototype.initEvents = function () {
        var navigation = this, chart = navigation.chart, bindingsContainer = navigation.container, options = navigation.options;
        // Shorthand object for getting events for buttons:
        navigation.boundClassNames = {};
        objectEach((options.bindings || {}), function (value) {
            navigation.boundClassNames[value.className] = value;
        });
        // Handle multiple containers with the same class names:
        [].forEach.call(bindingsContainer, function (subContainer) {
            navigation.eventsToUnbind.push(addEvent(subContainer, 'click', function (event) {
                var bindings = navigation.getButtonEvents(subContainer, event);
                if (bindings) {
                    navigation.bindingsButtonClick(bindings.button, bindings.events, event);
                }
            }));
        });
        objectEach(options.events || {}, function (callback, eventName) {
            if (isFunction(callback)) {
                navigation.eventsToUnbind.push(addEvent(navigation, eventName, callback));
            }
        });
        navigation.eventsToUnbind.push(addEvent(chart.container, 'click', function (e) {
            if (!chart.cancelClick &&
                chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
                navigation.bindingsChartClick(this, e);
            }
        }));
        navigation.eventsToUnbind.push(addEvent(chart.container, H.isTouchDevice ? 'touchmove' : 'mousemove', function (e) {
            navigation.bindingsContainerMouseMove(this, e);
        }));
    };
    /**
     * Common chart.update() delegation, shared between bindings and exporting.
     *
     * @private
     * @function Highcharts.NavigationBindings#initUpdate
     */
    NavigationBindings.prototype.initUpdate = function () {
        var navigation = this;
        chartNavigationMixin.addUpdate(function (options) {
            navigation.update(options);
        }, this.chart);
    };
    /**
     * Hook for click on a button, method selcts/unselects buttons,
     * then calls `bindings.init` callback.
     *
     * @private
     * @function Highcharts.NavigationBindings#bindingsButtonClick
     *
     * @param {Highcharts.HTMLDOMElement} [button]
     *        Clicked button
     *
     * @param {object} events
     *        Events passed down from bindings (`init`, `start`, `step`, `end`)
     *
     * @param {Highcharts.PointerEventObject} clickEvent
     *        Browser's click event
     */
    NavigationBindings.prototype.bindingsButtonClick = function (button, events, clickEvent) {
        var navigation = this, chart = navigation.chart;
        if (navigation.selectedButtonElement) {
            fireEvent(navigation, 'deselectButton', { button: navigation.selectedButtonElement });
            if (navigation.nextEvent) {
                // Remove in-progress annotations adders:
                if (navigation.currentUserDetails &&
                    navigation.currentUserDetails.coll === 'annotations') {
                    chart.removeAnnotation(navigation.currentUserDetails);
                }
                navigation.mouseMoveEvent = navigation.nextEvent = false;
            }
        }
        navigation.selectedButton = events;
        navigation.selectedButtonElement = button;
        fireEvent(navigation, 'selectButton', { button: button });
        // Call "init" event, for example to open modal window
        if (events.init) {
            events.init.call(navigation, button, clickEvent);
        }
        if (events.start || events.steps) {
            chart.renderer.boxWrapper.addClass(PREFIX + 'draw-mode');
        }
    };
    /**
     * Hook for click on a chart, first click on a chart calls `start` event,
     * then on all subsequent clicks iterate over `steps` array.
     * When finished, calls `end` event.
     *
     * @private
     * @function Highcharts.NavigationBindings#bindingsChartClick
     *
     * @param {Highcharts.Chart} chart
     *        Chart that click was performed on.
     *
     * @param {Highcharts.PointerEventObject} clickEvent
     *        Browser's click event.
     */
    NavigationBindings.prototype.bindingsChartClick = function (chart, clickEvent) {
        var navigation = this, chart = navigation.chart, selectedButton = navigation.selectedButton, svgContainer = chart.renderer.boxWrapper;
        // Click outside popups, should close them and deselect the annotation
        if (navigation.activeAnnotation &&
            !clickEvent.activeAnnotation &&
            // Element could be removed in the child action, e.g. button
            clickEvent.target.parentNode &&
            // TO DO: Polyfill for IE11?
            !closestPolyfill(clickEvent.target, '.' + PREFIX + 'popup')) {
            fireEvent(navigation, 'closePopup');
            navigation.deselectAnnotation();
        }
        if (!selectedButton || !selectedButton.start) {
            return;
        }
        if (!navigation.nextEvent) {
            // Call init method:
            navigation.currentUserDetails = selectedButton.start.call(navigation, clickEvent);
            // If steps exists (e.g. Annotations), bind them:
            if (selectedButton.steps) {
                navigation.stepIndex = 0;
                navigation.steps = true;
                navigation.mouseMoveEvent = navigation.nextEvent =
                    selectedButton.steps[navigation.stepIndex];
            }
            else {
                fireEvent(navigation, 'deselectButton', { button: navigation.selectedButtonElement });
                svgContainer.removeClass(PREFIX + 'draw-mode');
                navigation.steps = false;
                navigation.selectedButton = null;
                // First click is also the last one:
                if (selectedButton.end) {
                    selectedButton.end.call(navigation, clickEvent, navigation.currentUserDetails);
                }
            }
        }
        else {
            navigation.nextEvent(clickEvent, navigation.currentUserDetails);
            if (navigation.steps) {
                navigation.stepIndex++;
                if (selectedButton.steps[navigation.stepIndex]) {
                    // If we have more steps, bind them one by one:
                    navigation.mouseMoveEvent = navigation.nextEvent =
                        selectedButton.steps[navigation.stepIndex];
                }
                else {
                    fireEvent(navigation, 'deselectButton', { button: navigation.selectedButtonElement });
                    svgContainer.removeClass(PREFIX + 'draw-mode');
                    // That was the last step, call end():
                    if (selectedButton.end) {
                        selectedButton.end.call(navigation, clickEvent, navigation.currentUserDetails);
                    }
                    navigation.nextEvent = false;
                    navigation.mouseMoveEvent = false;
                    navigation.selectedButton = null;
                }
            }
        }
    };
    /**
     * Hook for mouse move on a chart's container. It calls current step.
     *
     * @private
     * @function Highcharts.NavigationBindings#bindingsContainerMouseMove
     *
     * @param {Highcharts.HTMLDOMElement} container
     *        Chart's container.
     *
     * @param {global.Event} moveEvent
     *        Browser's move event.
     */
    NavigationBindings.prototype.bindingsContainerMouseMove = function (_container, moveEvent) {
        if (this.mouseMoveEvent) {
            this.mouseMoveEvent(moveEvent, this.currentUserDetails);
        }
    };
    /**
     * Translate fields (e.g. `params.period` or `marker.styles.color`) to
     * Highcharts options object (e.g. `{ params: { period } }`).
     *
     * @private
     * @function Highcharts.NavigationBindings#fieldsToOptions<T>
     *
     * @param {Highcharts.Dictionary<string>} fields
     *        Fields from popup form.
     *
     * @param {T} config
     *        Default config to be modified.
     *
     * @return {T}
     *         Modified config
     */
    NavigationBindings.prototype.fieldsToOptions = function (fields, config) {
        objectEach(fields, function (value, field) {
            var parsedValue = parseFloat(value), path = field.split('.'), parent = config, pathLength = path.length - 1;
            // If it's a number (not "format" options), parse it:
            if (isNumber(parsedValue) &&
                !value.match(/px/g) &&
                !field.match(/format/g)) {
                value = parsedValue;
            }
            // Remove empty strings or values like 0
            if (value !== '' && value !== 'undefined') {
                path.forEach(function (name, index) {
                    var nextName = pick(path[index + 1], '');
                    if (pathLength === index) {
                        // Last index, put value:
                        parent[name] = value;
                    }
                    else if (!parent[name]) {
                        // Create middle property:
                        parent[name] = nextName.match(/\d/g) ? [] : {};
                        parent = parent[name];
                    }
                    else {
                        // Jump into next property
                        parent = parent[name];
                    }
                });
            }
        });
        return config;
    };
    /**
     * Shorthand method to deselect an annotation.
     *
     * @function Highcharts.NavigationBindings#deselectAnnotation
     */
    NavigationBindings.prototype.deselectAnnotation = function () {
        if (this.activeAnnotation) {
            this.activeAnnotation.setControlPointsVisibility(false);
            this.activeAnnotation = false;
        }
    };
    /**
     * Generates API config for popup in the same format as options for
     * Annotation object.
     *
     * @function Highcharts.NavigationBindings#annotationToFields
     *
     * @param {Highcharts.Annotation} annotation
     *        Annotations object
     *
     * @return {Highcharts.Dictionary<string>}
     *         Annotation options to be displayed in popup box
     */
    NavigationBindings.prototype.annotationToFields = function (annotation) {
        var options = annotation.options, editables = NavigationBindings.annotationsEditable, nestedEditables = editables.nestedOptions, getFieldType = this.utils.getFieldType, type = pick(options.type, options.shapes && options.shapes[0] &&
            options.shapes[0].type, options.labels && options.labels[0] &&
            options.labels[0].itemType, 'label'), nonEditables = NavigationBindings.annotationsNonEditable[options.langKey] || [], visualOptions = {
            langKey: options.langKey,
            type: type
        };
        /**
         * Nested options traversing. Method goes down to the options and copies
         * allowed options (with values) to new object, which is last parameter:
         * "parent".
         *
         * @private
         *
         * @param {*} option
         *        Atomic type or object/array
         *
         * @param {string} key
         *        Option name, for example "visible" or "x", "y"
         *
         * @param {object} parentEditables
         *        Editables from NavigationBindings.annotationsEditable
         *
         * @param {object} parent
         *        Where new options will be assigned
         */
        function traverse(option, key, parentEditables, parent) {
            var nextParent;
            if (parentEditables &&
                option &&
                nonEditables.indexOf(key) === -1 &&
                ((parentEditables.indexOf &&
                    parentEditables.indexOf(key)) >= 0 ||
                    parentEditables[key] || // nested array
                    parentEditables === true // simple array
                )) {
                // Roots:
                if (isArray(option)) {
                    parent[key] = [];
                    option.forEach(function (arrayOption, i) {
                        if (!isObject(arrayOption)) {
                            // Simple arrays, e.g. [String, Number, Boolean]
                            traverse(arrayOption, 0, nestedEditables[key], parent[key]);
                        }
                        else {
                            // Advanced arrays, e.g. [Object, Object]
                            parent[key][i] = {};
                            objectEach(arrayOption, function (nestedOption, nestedKey) {
                                traverse(nestedOption, nestedKey, nestedEditables[key], parent[key][i]);
                            });
                        }
                    });
                }
                else if (isObject(option)) {
                    nextParent = {};
                    if (isArray(parent)) {
                        parent.push(nextParent);
                        nextParent[key] = {};
                        nextParent = nextParent[key];
                    }
                    else {
                        parent[key] = nextParent;
                    }
                    objectEach(option, function (nestedOption, nestedKey) {
                        traverse(nestedOption, nestedKey, key === 0 ? parentEditables : nestedEditables[key], nextParent);
                    });
                }
                else {
                    // Leaf:
                    if (key === 'format') {
                        parent[key] = [
                            format(option, annotation.labels[0].points[0]).toString(),
                            'text'
                        ];
                    }
                    else if (isArray(parent)) {
                        parent.push([option, getFieldType(option)]);
                    }
                    else {
                        parent[key] = [option, getFieldType(option)];
                    }
                }
            }
        }
        objectEach(options, function (option, key) {
            if (key === 'typeOptions') {
                visualOptions[key] = {};
                objectEach(options[key], function (typeOption, typeKey) {
                    traverse(typeOption, typeKey, nestedEditables, visualOptions[key], true);
                });
            }
            else {
                traverse(option, key, editables[type], visualOptions);
            }
        });
        return visualOptions;
    };
    /**
     * Get all class names for all parents in the element. Iterates until finds
     * main container.
     *
     * @function Highcharts.NavigationBindings#getClickedClassNames
     *
     * @param {Highcharts.HTMLDOMElement}
     *        Container that event is bound to.
     *
     * @param {global.Event} event
     *        Browser's event.
     *
     * @return {Array<Array<string, Highcharts.HTMLDOMElement>>}
     *         Array of class names with corresponding elements
     */
    NavigationBindings.prototype.getClickedClassNames = function (container, event) {
        var element = event.target, classNames = [], elemClassName;
        while (element) {
            elemClassName = attr(element, 'class');
            if (elemClassName) {
                classNames = classNames.concat(elemClassName
                    .split(' ')
                    .map(function (name) {
                    return [
                        name,
                        element
                    ];
                }));
            }
            element = element.parentNode;
            if (element === container) {
                return classNames;
            }
        }
        return classNames;
    };
    /**
     * Get events bound to a button. It's a custom event delegation to find all
     * events connected to the element.
     *
     * @private
     * @function Highcharts.NavigationBindings#getButtonEvents
     *
     * @param {Highcharts.HTMLDOMElement} container
     *        Container that event is bound to.
     *
     * @param {global.Event} event
     *        Browser's event.
     *
     * @return {object}
     *         Object with events (init, start, steps, and end)
     */
    NavigationBindings.prototype.getButtonEvents = function (container, event) {
        var navigation = this, classNames = this.getClickedClassNames(container, event), bindings;
        classNames.forEach(function (className) {
            if (navigation.boundClassNames[className[0]] && !bindings) {
                bindings = {
                    events: navigation.boundClassNames[className[0]],
                    button: className[1]
                };
            }
        });
        return bindings;
    };
    /**
     * Bindings are just events, so the whole update process is simply
     * removing old events and adding new ones.
     *
     * @private
     * @function Highcharts.NavigationBindings#update
     */
    NavigationBindings.prototype.update = function (options) {
        this.options = merge(true, this.options, options);
        this.removeEvents();
        this.initEvents();
    };
    /**
     * Remove all events created in the navigation.
     *
     * @private
     * @function Highcharts.NavigationBindings#removeEvents
     */
    NavigationBindings.prototype.removeEvents = function () {
        this.eventsToUnbind.forEach(function (unbinder) {
            unbinder();
        });
    };
    NavigationBindings.prototype.destroy = function () {
        this.removeEvents();
    };
    /* *
     *
     *  Static Properties
     *
     * */
    // Define which options from annotations should show up in edit box:
    NavigationBindings.annotationsEditable = {
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
        verticalLine: [],
        label: ['labelOptions'],
        // Measure
        measure: ['background', 'crosshairY', 'crosshairX'],
        // Others:
        fibonacci: [],
        tunnel: ['background', 'line', 'height'],
        pitchfork: ['innerBackground', 'outerBackground'],
        rect: ['shapes'],
        // Crooked lines, elliots, arrows etc:
        crookedLine: [],
        basicAnnotation: ['shapes', 'labelOptions']
    };
    // Define non editable fields per annotation, for example Rectangle inherits
    // options from Measure, but crosshairs are not available
    NavigationBindings.annotationsNonEditable = {
        rectangle: ['crosshairX', 'crosshairY', 'label']
    };
    return NavigationBindings;
}());
/**
 * General utils for bindings
 *
 * @private
 * @name Highcharts.NavigationBindings.utils
 * @type {bindingsUtils}
 */
NavigationBindings.prototype.utils = bindingsUtils;
H.Chart.prototype.initNavigationBindings = function () {
    var chart = this, options = chart.options;
    if (options && options.navigation && options.navigation.bindings) {
        chart.navigationBindings = new NavigationBindings(chart, options.navigation);
        chart.navigationBindings.initEvents();
        chart.navigationBindings.initUpdate();
    }
};
addEvent(H.Chart, 'load', function () {
    this.initNavigationBindings();
});
addEvent(H.Chart, 'destroy', function () {
    if (this.navigationBindings) {
        this.navigationBindings.destroy();
    }
});
addEvent(NavigationBindings, 'deselectButton', function () {
    this.selectedButtonElement = null;
});
addEvent(Annotation, 'remove', function () {
    if (this.chart.navigationBindings) {
        this.chart.navigationBindings.deselectAnnotation();
    }
});
/**
 * Show edit-annotation form:
 * @private
 */
function selectableAnnotation(annotationType) {
    var originalClick = annotationType.prototype.defaultOptions.events &&
        annotationType.prototype.defaultOptions.events.click;
    /**
     * @private
     */
    function selectAndshowPopup(event) {
        var annotation = this, navigation = annotation.chart.navigationBindings, prevAnnotation = navigation.activeAnnotation;
        if (originalClick) {
            originalClick.call(annotation, event);
        }
        if (prevAnnotation !== annotation) {
            // Select current:
            navigation.deselectAnnotation();
            navigation.activeAnnotation = annotation;
            annotation.setControlPointsVisibility(true);
            fireEvent(navigation, 'showPopup', {
                annotation: annotation,
                formType: 'annotation-toolbar',
                options: navigation.annotationToFields(annotation),
                onSubmit: function (data) {
                    var config = {}, typeOptions;
                    if (data.actionType === 'remove') {
                        navigation.activeAnnotation = false;
                        navigation.chart.removeAnnotation(annotation);
                    }
                    else {
                        navigation.fieldsToOptions(data.fields, config);
                        navigation.deselectAnnotation();
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
            });
        }
        else {
            // Deselect current:
            navigation.deselectAnnotation();
            fireEvent(navigation, 'closePopup');
        }
        // Let bubble event to chart.click:
        event.activeAnnotation = true;
    }
    merge(true, annotationType.prototype.defaultOptions.events, {
        click: selectAndshowPopup
    });
}
if (H.Annotation) {
    // Basic shapes:
    selectableAnnotation(Annotation);
    // Advanced annotations:
    objectEach(Annotation.types, function (annotationType) {
        selectableAnnotation(annotationType);
    });
}
setOptions({
    /**
     * @optionparent lang
     *
     * @private
     */
    lang: {
        /**
         * Configure the Popup strings in the chart. Requires the
         * `annotations.js` or `annotations-advanced.src.js` module to be
         * loaded.
         *
         * @since   7.0.0
         * @product highcharts highstock
         */
        navigation: {
            /**
             * Translations for all field names used in popup.
             *
             * @product highcharts highstock
             */
            popup: {
                simpleShapes: 'Simple shapes',
                lines: 'Lines',
                circle: 'Circle',
                rectangle: 'Rectangle',
                label: 'Label',
                shapeOptions: 'Shape options',
                typeOptions: 'Details',
                fill: 'Fill',
                format: 'Text',
                strokeWidth: 'Line width',
                stroke: 'Line color',
                title: 'Title',
                name: 'Name',
                labelOptions: 'Label options',
                labels: 'Labels',
                backgroundColor: 'Background color',
                backgroundColors: 'Background colors',
                borderColor: 'Border color',
                borderRadius: 'Border radius',
                borderWidth: 'Border width',
                style: 'Style',
                padding: 'Padding',
                fontSize: 'Font size',
                color: 'Color',
                height: 'Height',
                shapes: 'Shape options'
            }
        }
    },
    /**
     * @optionparent navigation
     * @product      highcharts highstock
     *
     * @private
     */
    navigation: {
        /**
         * A CSS class name where all bindings will be attached to. Multiple
         * charts on the same page should have separate class names to prevent
         * duplicating events.
         *
         * Default value of versions < 7.0.4 `highcharts-bindings-wrapper`
         *
         * @since     7.0.0
         * @type      {string}
         */
        bindingsClassName: 'highcharts-bindings-container',
        /**
         * Bindings definitions for custom HTML buttons. Each binding implements
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
         * @type         {Highcharts.Dictionary<Highcharts.NavigationBindingsOptionsObject>|*}
         * @sample       stock/stocktools/stocktools-thresholds
         *               Custom bindings in Highstock
         * @since        7.0.0
         * @product      highcharts highstock
         */
        bindings: {
            /**
             * A circle annotation bindings. Includes `start` and one event in
             * `steps` array.
             *
             * @type    {Highcharts.NavigationBindingsOptionsObject}
             * @default {"className": "highcharts-circle-annotation", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
             */
            circleAnnotation: {
                /** @ignore-option */
                className: 'highcharts-circle-annotation',
                /** @ignore-option */
                start: function (e) {
                    var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation;
                    return this.chart.addAnnotation(merge({
                        langKey: 'circle',
                        type: 'basicAnnotation',
                        shapes: [{
                                type: 'circle',
                                point: {
                                    xAxis: 0,
                                    yAxis: 0,
                                    x: coords.xAxis[0].value,
                                    y: coords.yAxis[0].value
                                },
                                r: 5
                            }]
                    }, navigation
                        .annotationsOptions, navigation
                        .bindings
                        .circleAnnotation
                        .annotationsOptions));
                },
                /** @ignore-option */
                steps: [
                    function (e, annotation) {
                        var point = annotation.options.shapes[0].point, x = this.chart.xAxis[0].toPixels(point.x), y = this.chart.yAxis[0].toPixels(point.y), inverted = this.chart.inverted, distance = Math.max(Math.sqrt(Math.pow(inverted ? y - e.chartX : x - e.chartX, 2) +
                            Math.pow(inverted ? x - e.chartY : y - e.chartY, 2)), 5);
                        annotation.update({
                            shapes: [{
                                    r: distance
                                }]
                        });
                    }
                ]
            },
            /**
             * A rectangle annotation bindings. Includes `start` and one event
             * in `steps` array.
             *
             * @type    {Highcharts.NavigationBindingsOptionsObject}
             * @default {"className": "highcharts-rectangle-annotation", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
             */
            rectangleAnnotation: {
                /** @ignore-option */
                className: 'highcharts-rectangle-annotation',
                /** @ignore-option */
                start: function (e) {
                    var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation, x = coords.xAxis[0].value, y = coords.yAxis[0].value;
                    return this.chart.addAnnotation(merge({
                        langKey: 'rectangle',
                        type: 'basicAnnotation',
                        shapes: [{
                                type: 'path',
                                points: [{
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: x,
                                        y: y
                                    }, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: x,
                                        y: y
                                    }, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: x,
                                        y: y
                                    }, {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: x,
                                        y: y
                                    }]
                            }]
                    }, navigation
                        .annotationsOptions, navigation
                        .bindings
                        .rectangleAnnotation
                        .annotationsOptions));
                },
                /** @ignore-option */
                steps: [
                    function (e, annotation) {
                        var points = annotation.options.shapes[0].points, coords = this.chart.pointer.getCoordinates(e), x = coords.xAxis[0].value, y = coords.yAxis[0].value;
                        // Top right point
                        points[1].x = x;
                        // Bottom right point (cursor position)
                        points[2].x = x;
                        points[2].y = y;
                        // Bottom left
                        points[3].y = y;
                        annotation.update({
                            shapes: [{
                                    points: points
                                }]
                        });
                    }
                ]
            },
            /**
             * A label annotation bindings. Includes `start` event only.
             *
             * @type    {Highcharts.NavigationBindingsOptionsObject}
             * @default {"className": "highcharts-label-annotation", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
             */
            labelAnnotation: {
                /** @ignore-option */
                className: 'highcharts-label-annotation',
                /** @ignore-option */
                start: function (e) {
                    var coords = this.chart.pointer.getCoordinates(e), navigation = this.chart.options.navigation;
                    return this.chart.addAnnotation(merge({
                        langKey: 'label',
                        type: 'basicAnnotation',
                        labelOptions: {
                            format: '{y:.2f}'
                        },
                        labels: [{
                                point: {
                                    xAxis: 0,
                                    yAxis: 0,
                                    x: coords.xAxis[0].value,
                                    y: coords.yAxis[0].value
                                },
                                overflow: 'none',
                                crop: true
                            }]
                    }, navigation
                        .annotationsOptions, navigation
                        .bindings
                        .labelAnnotation
                        .annotationsOptions));
                }
            }
        },
        /**
         * Path where Highcharts will look for icons. Change this to use icons
         * from a different server.
         *
         * @type      {string}
         * @default   https://code.highcharts.com/@product.version@/gfx/stock-icons/
         * @since     7.1.3
         * @apioption navigation.iconsURL
         */
        /**
         * A `showPopup` event. Fired when selecting for example an annotation.
         *
         * @type      {Function}
         * @apioption navigation.events.showPopup
         */
        /**
         * A `closePopup` event. Fired when Popup should be hidden, for example
         * when clicking on an annotation again.
         *
         * @type      {Function}
         * @apioption navigation.events.closePopup
         */
        /**
         * Event fired on a button click.
         *
         * @type      {Function}
         * @sample    highcharts/annotations/gui/
         *            Change icon in a dropddown on event
         * @sample    highcharts/annotations/gui-buttons/
         *            Change button class on event
         * @apioption navigation.events.selectButton
         */
        /**
         * Event fired when button state should change, for example after
         * adding an annotation.
         *
         * @type      {Function}
         * @sample    highcharts/annotations/gui/
         *            Change icon in a dropddown on event
         * @sample    highcharts/annotations/gui-buttons/
         *            Change button class on event
         * @apioption navigation.events.deselectButton
         */
        /**
         * Events to communicate between Stock Tools and custom GUI.
         *
         * @since        7.0.0
         * @product      highcharts highstock
         * @optionparent navigation.events
         */
        events: {},
        /**
         * Additional options to be merged into all annotations.
         *
         * @sample stock/stocktools/navigation-annotation-options
         *         Set red color of all line annotations
         *
         * @type      {Highcharts.AnnotationsOptions}
         * @extends   annotations
         * @exclude   crookedLine, elliottWave, fibonacci, infinityLine,
         *            measure, pitchfork, tunnel, verticalLine, basicAnnotation
         * @apioption navigation.annotationsOptions
         */
        annotationsOptions: {
            animation: {
                defer: 0
            }
        }
    }
});
export default NavigationBindings;
