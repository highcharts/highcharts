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
import H from '../parts/Globals.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationChart {
            navigationBindings: NavigationBindings;
        }
        interface AnnotationEditableObject {
            circle: Array<string>;
            crookedLine: Array<string>;
            fibonacci: Array<string>;
            label: Array<string>;
            measure: Array<string>;
            nestedOptions: Dictionary<Array<string>>;
            pitchfork: Array<string>;
            rect: Array<string>;
            tunnel: Array<string>;
            verticalLine: Array<string>;
        }
        interface AnnotationNonEditableObject {
            rectangle: Array<string>;
        }
        interface AnnotationsOptions {
            langKey?: string;
        }
        interface Chart {
            navigationBindings?: NavigationBindings;
            /** @requires modules/annotations */
            initNavigationBindings(): void;
        }
        interface LangNavigationOptions {
            popup?: Dictionary<string>;
        }
        interface LangOptions {
            navigation?: LangNavigationOptions;
        }
        class NavigationBindings {
            public static annotationsEditable: AnnotationEditableObject;
            public static annotationsNonEditable: AnnotationNonEditableObject
            public constructor(chart: AnnotationChart, options: NavigationOptions);
            public activeAnnotation?: (false|Annotation);
            public boundClassNames: Dictionary<NavigationBindingsOptionsObject>;
            public chart: AnnotationChart;
            public container: HTMLDOMElement;
            public currentUserDetails?: Annotation;
            public eventsToUnbind: Array<Function>;
            public mouseMoveEvent?: (false|Function);
            public nextEvent?: (false|Function);
            public options: NavigationOptions;
            public selectedButtonElement?: (HTMLDOMElement|null);
            public selectedButton: (NavigationBindingsOptionsObject|null);
            public stepIndex?: number;
            public steps?: boolean;
            public utils: NavigationBindingsUtilsObject;
            public annotationToFields(annotation: Annotation): Dictionary<string>;
            public bindingsButtonClick(
                button: HTMLDOMElement,
                events: (NavigationBindingsOptionsObject|Dictionary<Function>),
                clickEvent: PointerEventObject
            ): void;
            public bindingsChartClick(chart: AnnotationChart, clickEvent: PointerEventObject): void;
            public bindingsContainerMouseMove(container: HTMLDOMElement, moveEvent: PointerEventObject): void;
            public deselectAnnotation(): void;
            public destroy(): void;
            public fieldsToOptions<T>(fields: PopupFieldsDictionary<string>, config: T): T;
            public getButtonEvents(container: HTMLDOMElement, event: Event): NavigationBindingsButtonEventsObject;
            public getClickedClassNames(container: HTMLDOMElement, event: Event): Array<[string, HTMLDOMElement]>;
            public initEvents(): void;
            public initUpdate(): void;
            public removeEvents(): void;
            public update(options: NavigationOptions): void
        }
        interface NavigationBindingsButtonEventsObject {
            button: HTMLDOMElement;
            events: NavigationBindingsOptionsObject;
        }
        interface NavigationBindingsOptionsObject {
            className: string;
            end?: Function;
            init?: Function;
            start?: Function;
            steps?: Array<Function>;
        }
        interface NavigationBindingsUtilsObject {
            getFieldType(value: ('boolean'|'number'|'string')): ('checkbox'|'number'|'text');
            updateRectSize(event: PointerEventObject, annotation: Annotation): void;
        }
        interface NavigationEventsOptions {
            closePopup?: Function;
            deselectButton?: Function;
            selectButton?: Function;
            showPopup?: Function;
        }
        interface NavigationOptions {
            annotationsOptions?: DeepPartial<AnnotationsOptions>;
            bindings?: Dictionary<NavigationBindingsOptionsObject>;
            bindingsClassName?: string;
            events?: NavigationEventsOptions;
            iconsURL?: string;
        }
        interface PointerEventObject {
            activeAnnotation?: boolean;
        }
    }
}

/**
 * A config object for navigation bindings in annotations.
 *
 * @interface Highcharts.NavigationBindingsOptionsObject
 *//**
 * ClassName of the element for a binding.
 * @name Highcharts.NavigationBindingsOptionsObject#className
 * @type {string|undefined}
 *//**
 * Last event to be fired after last step event.
 * @name Highcharts.NavigationBindingsOptionsObject#end
 * @type {Function|undefined}
 *//**
 * Initial event, fired on a button click.
 * @name Highcharts.NavigationBindingsOptionsObject#init
 * @type {Function|undefined}
 *//**
 * Event fired on first click on a chart.
 * @name Highcharts.NavigationBindingsOptionsObject#start
 * @type {Function|undefined}
 *//**
 * Last event to be fired after last step event. Array of step events to be
 * called sequentially after each user click.
 * @name Highcharts.NavigationBindingsOptionsObject#steps
 * @type {Array<Function>|undefined}
 */

import U from '../parts/Utilities.js';
const {
    addEvent,
    attr,
    extend,
    isArray,
    isNumber,
    isObject,
    objectEach,
    pick
} = U;

import chartNavigationMixin from '../mixins/navigation.js';

var doc = H.doc,
    win = H.win,
    merge = H.merge,
    fireEvent = H.fireEvent,
    PREFIX = 'highcharts-';

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * IE 9-11 polyfill for Element.closest():
 * @private
 */
function closestPolyfill(el: Element, s: string): (Element|null) {
    var ElementProto = win.Element.prototype,
        elementMatches =
            ElementProto.matches ||
            ElementProto.msMatchesSelector ||
            ElementProto.webkitMatchesSelector,
        ret: (Element|null) = null;

    if (ElementProto.closest) {
        ret = ElementProto.closest.call(el, s);
    } else {
        do {
            if (elementMatches.call(el, s)) {
                return el;
            }
            el = el.parentElement || el.parentNode as any;

        } while (el !== null && el.nodeType === 1);
    }
    return ret;
}


/**
 * @private
 * @interface bindingsUtils
 */
var bindingsUtils: Partial<Highcharts.NavigationBindingsUtilsObject> = {
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
    updateRectSize: function (event: Highcharts.PointerEventObject, annotation: Highcharts.Annotation): void {
        var chart = annotation.chart,
            options = annotation.options.typeOptions,
            coords = chart.pointer.getCoordinates(event),
            width = coords.xAxis[0].value - options.point.x,
            height = options.point.y - coords.yAxis[0].value;

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
    getFieldType: function (value: ('boolean'|'number'|'string')): ('checkbox'|'number'|'text') {
        return ({
            'string': 'text',
            'number': 'number',
            'boolean': 'checkbox'
        } as Highcharts.Dictionary<('checkbox'|'number'|'text')>)[
            typeof value
        ];
    }
};

/**
 * @private
 */
H.NavigationBindings = function (
    this: Highcharts.NavigationBindings,
    chart: Highcharts.AnnotationChart,
    options: Highcharts.NavigationOptions
): void {
    this.chart = chart;
    this.options = options;
    this.eventsToUnbind = [];
    this.container = doc.getElementsByClassName(
        this.options.bindingsClassName as any
    ) as any;
} as any;

// Define which options from annotations should show up in edit box:
H.NavigationBindings.annotationsEditable = {
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
        backgroundColors: [true as any],
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
    crookedLine: []
};

// Define non editable fields per annotation, for example Rectangle inherits
// options from Measure, but crosshairs are not available
H.NavigationBindings.annotationsNonEditable = {
    rectangle: ['crosshairX', 'crosshairY', 'label']
};

extend(H.NavigationBindings.prototype, {
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
     * Initi all events conencted to NavigationBindings.
     *
     * @private
     * @function Highcharts.NavigationBindings#initEvents
     */
    initEvents: function (this: Highcharts.NavigationBindings): void {
        var navigation = this,
            chart = navigation.chart,
            bindingsContainer = navigation.container,
            options = navigation.options;

        // Shorthand object for getting events for buttons:
        navigation.boundClassNames = {};

        objectEach(options.bindings, function (value: Highcharts.NavigationBindingsOptionsObject): void {
            navigation.boundClassNames[value.className] = value;
        });

        // Handle multiple containers with the same class names:
        ([] as Array<Element>).forEach.call(bindingsContainer, function (subContainer: Element): void {
            navigation.eventsToUnbind.push(
                addEvent(subContainer, 'click', function (event: Highcharts.PointerEventObject): void {
                    var bindings = navigation.getButtonEvents(
                        bindingsContainer,
                        event
                    );

                    if (bindings) {
                        navigation.bindingsButtonClick(
                            bindings.button,
                            bindings.events,
                            event
                        );
                    }
                })
            );
        });

        objectEach(options.events || {}, function (
            callback: Function,
            eventName: string
        ): void {
            if (H.isFunction(callback)) {
                navigation.eventsToUnbind.push(
                    addEvent(
                        navigation,
                        eventName,
                        callback
                    )
                );
            }
        });

        navigation.eventsToUnbind.push(
            addEvent(chart.container, 'click', function (
                this: Highcharts.HTMLDOMElement,
                e: Highcharts.PointerEventObject
            ): void {
                if (
                    !chart.cancelClick &&
                    chart.isInsidePlot(
                        e.chartX - chart.plotLeft,
                        e.chartY - chart.plotTop
                    )
                ) {
                    navigation.bindingsChartClick(this as any, e);
                }
            })
        );
        navigation.eventsToUnbind.push(
            addEvent(chart.container, 'mousemove', function (
                e: Highcharts.PointerEventObject
            ): void {
                navigation.bindingsContainerMouseMove(this, e);
            })
        );
    },

    /**
     * Common chart.update() delegation, shared between bindings and exporting.
     *
     * @private
     * @function Highcharts.NavigationBindings#initUpdate
     */
    initUpdate: function (this: Highcharts.NavigationBindings): void {
        var navigation = this;

        chartNavigationMixin.addUpdate(
            function (options: Highcharts.NavigationOptions): void {
                navigation.update(options);
            },
            this.chart
        );
    },

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
    bindingsButtonClick: function (
        this: Highcharts.NavigationBindings,
        button: Highcharts.HTMLDOMElement,
        events: Highcharts.NavigationBindingsOptionsObject,
        clickEvent: Highcharts.PointerEventObject
    ): void {
        var navigation = this,
            chart = navigation.chart;

        if (navigation.selectedButtonElement) {
            fireEvent(
                navigation,
                'deselectButton',
                { button: navigation.selectedButtonElement }
            );

            if (navigation.nextEvent) {
                // Remove in-progress annotations adders:
                if (
                    navigation.currentUserDetails &&
                    navigation.currentUserDetails.coll === 'annotations'
                ) {
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
    },
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
    bindingsChartClick: function (
        this: Highcharts.NavigationBindings,
        chart: Highcharts.AnnotationChart,
        clickEvent: Highcharts.PointerEventObject
    ): void {
        var navigation = this,
            chart = navigation.chart,
            selectedButton = navigation.selectedButton,
            svgContainer = chart.renderer.boxWrapper;

        // Click outside popups, should close them and deselect the annotation
        if (
            navigation.activeAnnotation &&
            !clickEvent.activeAnnotation &&
            // Element could be removed in the child action, e.g. button
            (clickEvent.target as any).parentNode &&
            // TO DO: Polyfill for IE11?
            !closestPolyfill(clickEvent.target as any, '.' + PREFIX + 'popup')
        ) {
            fireEvent(navigation, 'closePopup');
            navigation.deselectAnnotation();
        }

        if (!selectedButton || !selectedButton.start) {
            return;
        }


        if (!navigation.nextEvent) {
            // Call init method:
            navigation.currentUserDetails = selectedButton.start.call(
                navigation,
                clickEvent
            );

            // If steps exists (e.g. Annotations), bind them:
            if (selectedButton.steps) {
                navigation.stepIndex = 0;
                navigation.steps = true;
                navigation.mouseMoveEvent = navigation.nextEvent =
                    selectedButton.steps[navigation.stepIndex];
            } else {

                fireEvent(
                    navigation,
                    'deselectButton',
                    { button: navigation.selectedButtonElement }
                );
                svgContainer.removeClass(PREFIX + 'draw-mode');
                navigation.steps = false;
                navigation.selectedButton = null;
                // First click is also the last one:
                if (selectedButton.end) {
                    selectedButton.end.call(
                        navigation,
                        clickEvent,
                        navigation.currentUserDetails
                    );

                }
            }
        } else {

            navigation.nextEvent(
                clickEvent,
                navigation.currentUserDetails
            );

            if (navigation.steps) {

                (navigation.stepIndex as any)++;

                if ((selectedButton.steps as any)[navigation.stepIndex as any]) {
                    // If we have more steps, bind them one by one:
                    navigation.mouseMoveEvent = navigation.nextEvent =
                        (selectedButton.steps as any)[navigation.stepIndex as any];
                } else {
                    fireEvent(
                        navigation,
                        'deselectButton',
                        { button: navigation.selectedButtonElement }
                    );
                    svgContainer.removeClass(PREFIX + 'draw-mode');
                    // That was the last step, call end():
                    if (selectedButton.end) {
                        selectedButton.end.call(
                            navigation,
                            clickEvent,
                            navigation.currentUserDetails
                        );
                    }
                    navigation.nextEvent = false;
                    navigation.mouseMoveEvent = false;
                    navigation.selectedButton = null;
                }
            }
        }
    },
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
    bindingsContainerMouseMove: function (
        this: Highcharts.NavigationBindings,
        _container: Highcharts.HTMLDOMElement,
        moveEvent: Event
    ): void {
        if (this.mouseMoveEvent) {
            this.mouseMoveEvent(
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
    fieldsToOptions: function <T> (
        this: Highcharts.NavigationBindings,
        fields: Highcharts.Dictionary<string>,
        config: T
    ): T {
        objectEach(fields, function (value: string, field: string): void {
            var parsedValue = parseFloat(value),
                path = field.split('.'),
                parent = config,
                pathLength = path.length - 1;

            // If it's a number (not "format" options), parse it:
            if (
                isNumber(parsedValue) &&
                !value.match(/px/g) &&
                !field.match(/format/g)
            ) {
                value = parsedValue as any;
            }

            // Remove empty strings or values like 0
            if (value !== '' && value !== 'undefined') {
                path.forEach(function (name: string, index: number): void {
                    var nextName = pick(path[index + 1], '');

                    if (pathLength === index) {
                        // Last index, put value:
                        (parent as any)[name] = value;
                    } else if (!(parent as any)[name]) {
                        // Create middle property:
                        (parent as any)[name] = nextName.match(/\d/g) ? [] : {};
                        parent = (parent as any)[name];
                    } else {
                        // Jump into next property
                        parent = (parent as any)[name];
                    }
                });
            }
        });
        return config;
    },
    /**
     * Shorthand method to deselect an annotation.
     *
     * @function Highcharts.NavigationBindings#deselectAnnotation
     */
    deselectAnnotation: function (this: Highcharts.NavigationBindings): void {
        if (this.activeAnnotation) {
            this.activeAnnotation.setControlPointsVisibility(false);
            this.activeAnnotation = false;
        }
    },
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
    annotationToFields: function (
        this: Highcharts.NavigationBindings,
        annotation: Highcharts.Annotation
    ): Highcharts.Dictionary<string> {
        var options = annotation.options,
            editables = H.NavigationBindings.annotationsEditable,
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
            nonEditables = (
                H.NavigationBindings.annotationsNonEditable as any
            )[
                options.langKey as any
            ] || [],
            visualOptions = {
                langKey: options.langKey,
                type: type
            } as any;

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
         *        Editables from H.NavigationBindings.annotationsEditable
         *
         * @param {object} parent
         *        Where new options will be assigned
         */
        function traverse(option: any, key: (0|string), parentEditables: any, parent: any): void {
            var nextParent: any;

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

                    option.forEach(function (arrayOption: any, i: number): void {
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
                                function (nestedOption: any, nestedKey: string): void {
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
                    objectEach(option, function (nestedOption: any, nestedKey: string): void {
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

        objectEach(options, function (option: any, key: string): void {
            if (key === 'typeOptions') {
                visualOptions[key] = {};
                objectEach(options[key], function (typeOption: any, typeKey: string): void {
                    (traverse as any)(
                        typeOption,
                        typeKey,
                        nestedEditables,
                        visualOptions[key],
                        true
                    );
                });
            } else {
                traverse(option, key, (editables as any)[type], visualOptions);
            }
        });

        return visualOptions;
    },

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
    getClickedClassNames: function (
        this: Highcharts.NavigationBindings,
        container: Highcharts.HTMLDOMElement,
        event: Event
    ): Array<[string, Highcharts.HTMLDOMElement]> {
        var element: Highcharts.HTMLDOMElement = event.target as any,
            classNames: Array<[string, Highcharts.HTMLDOMElement]> = [],
            elemClassName: (string|null|undefined);

        while (element) {
            elemClassName = attr(element, 'class');
            if (elemClassName) {
                classNames = classNames.concat(
                    elemClassName
                        .split(' ')
                        .map(function (name: string): [string, Highcharts.HTMLDOMElement] { // eslint-disable-line no-loop-func
                            return [
                                name,
                                element
                            ];
                        })
                );
            }
            element = element.parentNode as any;

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
    getButtonEvents: function (
        this: Highcharts.NavigationBindings,
        container: Highcharts.HTMLDOMElement,
        event: Event
    ): Highcharts.NavigationBindingsButtonEventsObject {
        var navigation = this,
            classNames = this.getClickedClassNames(container, event),
            bindings: (Highcharts.NavigationBindingsButtonEventsObject|undefined);


        classNames.forEach(function (className: [string, Highcharts.HTMLDOMElement]): void {
            if (navigation.boundClassNames[className[0]] && !bindings) {
                bindings = {
                    events: navigation.boundClassNames[className[0]],
                    button: className[1]
                };
            }
        });

        return bindings as any;
    },
    /**
     * Bindings are just events, so the whole update process is simply
     * removing old events and adding new ones.
     *
     * @private
     * @function Highcharts.NavigationBindings#update
     */
    update: function (this: Highcharts.NavigationBindings, options: Highcharts.NavigationOptions): void {
        this.options = merge(true, this.options, options);
        this.removeEvents();
        this.initEvents();
    },
    /**
     * Remove all events created in the navigation.
     *
     * @private
     * @function Highcharts.NavigationBindings#removeEvents
     */
    removeEvents: function (this: Highcharts.NavigationBindings): void {
        this.eventsToUnbind.forEach(function (unbinder: Function): void {
            unbinder();
        });
    },
    destroy: function (this: Highcharts.NavigationBindings): void {
        this.removeEvents();
    },
    /**
     * General utils for bindings
     *
     * @private
     * @name Highcharts.NavigationBindings#utils
     * @type {bindingsUtils}
     */
    utils: bindingsUtils
});

H.Chart.prototype.initNavigationBindings = function (this: Highcharts.AnnotationChart): void {
    var chart = this,
        options = chart.options;

    if (options && options.navigation && options.navigation.bindings) {
        chart.navigationBindings = new H.NavigationBindings(
            chart,
            options.navigation
        );
        chart.navigationBindings.initEvents();
        chart.navigationBindings.initUpdate();
    }
};

addEvent(H.Chart, 'load', function (): void {
    this.initNavigationBindings();
});

addEvent(H.Chart, 'destroy', function (): void {
    if (this.navigationBindings) {
        this.navigationBindings.destroy();
    }
});

addEvent(H.NavigationBindings, 'deselectButton', function (): void {
    this.selectedButtonElement = null;
});

addEvent(H.Annotation, 'remove', function (): void {
    if (this.chart.navigationBindings) {
        this.chart.navigationBindings.deselectAnnotation();
    }
});


/**
 * Show edit-annotation form:
 * @private
 */
function selectableAnnotation(annotationType: typeof Highcharts.Annotation): void {
    var originalClick = annotationType.prototype.defaultOptions.events &&
            annotationType.prototype.defaultOptions.events.click;

    /**
     * @private
     */
    function selectAndshowPopup(this: Highcharts.Annotation, event: Highcharts.PointerEventObject): void {
        var annotation = this,
            navigation = annotation.chart.navigationBindings,
            prevAnnotation = navigation.activeAnnotation;

        if (originalClick) {
            (originalClick as any).click.call(annotation, event);
        }

        if (prevAnnotation !== annotation) {
            // Select current:
            navigation.deselectAnnotation();

            navigation.activeAnnotation = annotation;
            annotation.setControlPointsVisibility(true);

            fireEvent(
                navigation,
                'showPopup',
                {
                    annotation: annotation,
                    formType: 'annotation-toolbar',
                    options: navigation.annotationToFields(annotation),
                    onSubmit: function (data: Highcharts.PopupFieldsObject): void {

                        var config: Highcharts.PopupFieldsDictionary<string> = {},
                            typeOptions;

                        if (data.actionType === 'remove') {
                            navigation.activeAnnotation = false;
                            navigation.chart.removeAnnotation(annotation);
                        } else {
                            navigation.fieldsToOptions(data.fields, config);
                            navigation.deselectAnnotation();

                            typeOptions = config.typeOptions;

                            if (annotation.options.type === 'measure') {
                                // Manually disable crooshars according to
                                // stroke width of the shape:
                                (typeOptions as any).crosshairY.enabled =
                                    (typeOptions as any).crosshairY.strokeWidth !== 0;
                                (typeOptions as any).crosshairX.enabled =
                                    (typeOptions as any).crosshairX.strokeWidth !== 0;
                            }

                            annotation.update(config);
                        }
                    }
                }
            );
        } else {
            // Deselect current:
            navigation.deselectAnnotation();
            fireEvent(navigation, 'closePopup');
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
    objectEach(H.Annotation.types, function (annotationType: typeof Highcharts.Annotation): void {
        selectableAnnotation(annotationType);
    });
}

H.setOptions({
    /**
     * @optionparent lang
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
                start: function (
                    this: Highcharts.NavigationBindings,
                    e: Highcharts.PointerEventObject
                ): Highcharts.Annotation {
                    var coords = this.chart.pointer.getCoordinates(e),
                        navigation = this.chart.options.navigation,
                        controlPoints: Array<Partial<Highcharts.AnnotationControlPointOptionsObject>> = [{
                            positioner: function (
                                this: Highcharts.AnnotationControlPoint,
                                target: Highcharts.AnnotationControllable
                            ): Highcharts.PositionObject {
                                var xy = H.Annotation.MockPoint.pointToPixels(target.points[0]),
                                    r: number = target.options.r as any;

                                return {
                                    x: xy.x + r * Math.cos(Math.PI / 4) -
                                        this.graphic.width / 2,
                                    y: xy.y + r * Math.sin(Math.PI / 4) -
                                        this.graphic.height / 2
                                };
                            },
                            events: {
                                // TRANSFORM RADIUS ACCORDING TO Y
                                // TRANSLATION
                                drag: function (
                                    this: Highcharts.Annotation,
                                    e: Highcharts.AnnotationEventObject,
                                    target: Highcharts.AnnotationControllableCircle
                                ): void {
                                    var annotation = target.annotation,
                                        position = this.mouseMoveToTranslation(e);

                                    target.setRadius(
                                        Math.max(
                                            (target.options.r as any) +
                                                position.y /
                                                Math.sin(Math.PI / 4),
                                            5
                                        )
                                    );

                                    annotation.options.shapes[0] =
                                        annotation.userOptions.shapes[0] =
                                        target.options;

                                    target.redraw(false);
                                } as any
                            }
                        }];

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'circle',
                                shapes: [{
                                    type: 'circle',
                                    point: {
                                        xAxis: 0,
                                        yAxis: 0,
                                        x: coords.xAxis[0].value,
                                        y: coords.yAxis[0].value
                                    },
                                    r: 5,
                                    controlPoints: controlPoints
                                }]
                            },
                            navigation
                                .annotationsOptions,
                            (navigation
                                .bindings as any)
                                .circleAnnotation
                                .annotationsOptions
                        )
                    );
                },
                /** @ignore-option */
                steps: [
                    function (
                        this: Highcharts.NavigationBindings,
                        e: Highcharts.PointerEventObject,
                        annotation: Highcharts.Annotation
                    ): void {
                        var point = annotation.options.shapes[0].point,
                            x = this.chart.xAxis[0].toPixels((point as any).x),
                            y = this.chart.yAxis[0].toPixels((point as any).y),
                            inverted = this.chart.inverted,
                            distance = Math.max(
                                Math.sqrt(
                                    Math.pow(
                                        inverted ? y - e.chartX : x - e.chartX,
                                        2
                                    ) +
                                    Math.pow(
                                        inverted ? x - e.chartY : y - e.chartY,
                                        2
                                    )
                                ),
                                5
                            );

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
                start: function (
                    this: Highcharts.NavigationBindings,
                    e: Highcharts.PointerEventObject
                ): Highcharts.Annotation {
                    var coords = this.chart.pointer.getCoordinates(e),
                        navigation = this.chart.options.navigation,
                        x = coords.xAxis[0].value,
                        y = coords.yAxis[0].value,
                        controlPoints = [{
                            positioner: function (annotation: Highcharts.Annotation): Highcharts.PositionObject {
                                var xy = H.Annotation.MockPoint
                                    .pointToPixels(
                                        annotation.shapes[0].points[2]
                                    );

                                return {
                                    x: xy.x - 4,
                                    y: xy.y - 4
                                };
                            },
                            events: {
                                drag: function (
                                    this: Highcharts.Annotation,
                                    target: Highcharts.AnnotationControllableRect
                                ): void {
                                    var coords = this.chart.pointer.getCoordinates(e),
                                        x = coords.xAxis[0].value,
                                        y = coords.yAxis[0].value,
                                        shape = target.options.shapes[0],
                                        points: Array<Highcharts.AnnotationMockPointOptionsObject> =
                                            shape.points as any;

                                    // Top right point
                                    points[1].x = x;
                                    // Bottom right point (cursor position)
                                    points[2].x = x;
                                    points[2].y = y;
                                    // Bottom left
                                    points[3].y = y;

                                    target.options.shapes[0].points = points;

                                    target.redraw(false);
                                }
                            }
                        }];

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'rectangle',
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
                                }],
                                controlPoints: controlPoints
                            },
                            navigation
                                .annotationsOptions,
                            (navigation
                                .bindings as any)
                                .rectangleAnnotation
                                .annotationsOptions
                        )
                    );
                },
                /** @ignore-option */
                steps: [
                    function (
                        this: Highcharts.NavigationBindings,
                        e: Highcharts.PointerEventObject,
                        annotation: Highcharts.Annotation
                    ): void {
                        var points: Array<Highcharts.AnnotationMockPointOptionsObject> =
                                annotation.options.shapes[0].points as any,
                            coords = this.chart.pointer.getCoordinates(e),
                            x = coords.xAxis[0].value,
                            y = coords.yAxis[0].value;

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
                start: function (
                    this: Highcharts.NavigationBindings,
                    e: Highcharts.PointerEventObject
                ): Highcharts.Annotation {
                    var coords = this.chart.pointer.getCoordinates(e),
                        navigation = this.chart.options.navigation,
                        controlPoints = [{
                            symbol: 'triangle-down',
                            positioner: function (
                                this: Highcharts.AnnotationControlPoint,
                                target: Highcharts.AnnotationControllable
                            ): Highcharts.PositionObject {
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
                                drag: function (
                                    this: Highcharts.Annotation,
                                    e: Highcharts.AnnotationEventObject,
                                    target: Highcharts.Annotation
                                ): void {
                                    var xy = this.mouseMoveToTranslation(e);

                                    (target.translatePoint as any)(xy.x, xy.y);

                                    target.annotation.labels[0].options =
                                        target.options as any;

                                    target.redraw(false);
                                }
                            }
                        }, {
                            symbol: 'square',
                            positioner: function (
                                this: Highcharts.AnnotationControlPoint,
                                target: Highcharts.AnnotationControllable
                            ): Highcharts.PositionObject {
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

                            // TRANSLATE POSITION WITHOUT CHANGING THE
                            // ANCHOR
                            events: {
                                drag: function (
                                    this: Highcharts.Annotation,
                                    e: Highcharts.AnnotationEventObject,
                                    target: Highcharts.AnnotationControllable
                                ): void {
                                    var xy = this.mouseMoveToTranslation(e);

                                    target.translate(xy.x, xy.y);

                                    target.annotation.labels[0].options =
                                        target.options as any;

                                    target.redraw(false);
                                }
                            }
                        }];

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'label',
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
                                    crop: true,
                                    controlPoints: controlPoints
                                }]
                            },
                            navigation
                                .annotationsOptions,
                            (navigation
                                .bindings as any)
                                .labelAnnotation
                                .annotationsOptions
                        )
                    );
                }
            } as any
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
         *            measure, pitchfork, tunnel, verticalLine
         * @apioption navigation.annotationsOptions
         */
        annotationsOptions: {}
    }
});
