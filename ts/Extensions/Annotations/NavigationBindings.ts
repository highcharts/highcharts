/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type MockPointOptions from './MockPointOptions';
import type NavigationOptions from '../Exporting/NavigationOptions';
import type Pointer from '../../Core/Pointer';
import type PointerEvent from '../../Core/PointerEvent';
import Annotation from './Annotations.js';
import Chart from '../../Core/Chart/Chart.js';
import ChartNavigationComposition from '../../Core/Chart/ChartNavigationComposition.js';
import F from '../../Core/FormatUtilities.js';
const { format } = F;
import H from '../../Core/Globals.js';
import D from '../../Core/DefaultOptions.js';
const { setOptions } = D;
import U from '../../Core/Utilities.js';
import ControllableEllipse from './Controllables/ControllableEllipse';
const {
    addEvent,
    attr,
    fireEvent,
    isArray,
    isFunction,
    isNumber,
    isObject,
    merge,
    objectEach,
    pick
} = U;

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        navigationBindings?: NavigationBindings;
        /** @requires modules/annotations */
        initNavigationBindings(): void;
    }
}

declare module '../../Core/LangOptions'{
    interface LangOptions {
        navigation?: Highcharts.LangNavigationOptions;
    }
}

declare module '../../Core/PointerEvent' {
    interface PointerEvent {
        activeAnnotation?: boolean;
    }
}

declare module '../Exporting/NavigationOptions' {
    interface NavigationOptions {
        annotationsOptions?: DeepPartial<Highcharts.AnnotationsOptions>;
        bindings?: Record<string, Highcharts.NavigationBindingsOptionsObject>;
        bindingsClassName?: string;
        events?: Highcharts.NavigationEventsOptions;
        iconsURL?: string;
    }
}

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
            basicAnnotation: Array<string>;
            circle: Array<string>;
            ellipse: Array<string>;
            crookedLine: Array<string>;
            fibonacci: Array<string>;
            label: Array<string>;
            measure: Array<string>;
            nestedOptions: Record<string, Array<string>>;
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
        interface LangNavigationOptions {
            popup?: PopupOptions;
        }
        interface PopupOptions {
            [key: string]: string | IndicatorAliases | undefined;
            indicatorAliases?: IndicatorAliases;
        }
        interface IndicatorAliases {
            [key: string]: Array<string>;
        }
        interface NavigationBindingsButtonEventsObject {
            button: HTMLDOMElement;
            events: NavigationBindingsOptionsObject;
        }
        interface NavigationBindingsOptionsObject {
            noDataState?: 'normal' | 'disabled';
            className: string;
            end?: Function;
            init?: Function;
            start?: Function;
            steps?: Array<Function>;
        }
        interface NavigationBindingsUtilsObject {
            getFieldType(
                value: ('boolean'|'number'|'string')
            ): ('checkbox'|'number'|'text');
            updateRectSize(event: PointerEvent, annotation: Annotation): void;
        }
        interface NavigationEventsOptions {
            closePopup?: Function;
            deselectButton?: Function;
            selectButton?: Function;
            showPopup?: Function;
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

const doc = H.doc,
    win = H.win,
    PREFIX = 'highcharts-';

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * IE 9-11 polyfill for Element.closest():
 * @private
 */
function closestPolyfill(el: Element, s: string): (Element|null) {
    let ElementProto = win.Element.prototype,
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
const bindingsUtils = {
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
    getFieldType: function (
        value: ('boolean'|'number'|'string')
    ): ('checkbox'|'number'|'text') {
        return ({
            'string': 'text',
            'number': 'number',
            'boolean': 'checkbox'
        } as Record<string, ('checkbox'|'number'|'text')>)[
            typeof value
        ];
    },

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
    updateRectSize: function (
        event: PointerEvent,
        annotation: Annotation
    ): void {
        const chart = annotation.chart,
            options = annotation.options.typeOptions,
            xAxis = isNumber(options.xAxis) && chart.xAxis[options.xAxis],
            yAxis = isNumber(options.yAxis) && chart.yAxis[options.yAxis];

        if (xAxis && yAxis) {
            const x = xAxis.toValue(event[xAxis.horiz ? 'chartX' : 'chartY']),
                y = yAxis.toValue(event[yAxis.horiz ? 'chartX' : 'chartY']),
                width = x - options.point.x,
                height = options.point.y - y;

            annotation.update({
                typeOptions: {
                    background: {
                        width: chart.inverted ? height : width,
                        height: chart.inverted ? width : height
                    }
                }
            });
        }
    },

    /**
     * Returns the first xAxis or yAxis that was clicked with its value.
     *
     * @private
     * @function Highcharts.NavigationBindingsUtilsObject#getAssignedAxis
     *
     * @param {Array<Highcharts.PointerAxisCoordinateObject>} coords
     *        All the chart's x or y axes with a current pointer's axis value.
     *
     * @return {Highcharts.PointerAxisCoordinateObject}
     *         Object with a first found axis and its value that pointer
     *         is currently pointing.
     */
    getAssignedAxis(
        coords: Array<Pointer.AxisCoordinateObject>
    ): Pointer.AxisCoordinateObject {
        return coords.filter(function (coord): boolean {
            const extremes = coord.axis.getExtremes(),
                axisMin = extremes.min,
                axisMax = extremes.max,
                // Correct axis edges when axis has series
                // with pointRange (like column)
                minPointOffset = pick(coord.axis.minPointOffset, 0);

            return isNumber(axisMin) && isNumber(axisMax) &&
                coord.value >= (axisMin - minPointOffset) &&
                coord.value <= (axisMax + minPointOffset) &&
                // don't count navigator axis
                !coord.axis.options.isInternal;
        })[0]; // If the axes overlap, return the first axis that was found.
    }
};

/**
 * @private
 */
class NavigationBindings {

    /* *
     *
     *  Static Properties
     *
     * */


    // Define which options from annotations should show up in edit box:
    public static annotationsEditable = {
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
        } as Record<string, Array<string>>,
        // Simple shapes:
        circle: ['shapes'],
        ellipse: ['shapes'],
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
    public static annotationsNonEditable = {
        rectangle: ['crosshairX', 'crosshairY', 'labelOptions'],
        ellipse: ['labelOptions'],
        circle: ['labelOptions']
    };

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        chart: Highcharts.AnnotationChart,
        options: NavigationOptions
    ) {
        this.chart = chart;
        this.options = options;
        this.eventsToUnbind = [];
        this.container = (
            doc.getElementsByClassName(
                this.options.bindingsClassName || ''
            ) as HTMLCollectionOf<HTMLElement>
        );
    }

    /* *
     *
     *  Properties
     *
     * */

    public activeAnnotation?: (false|Annotation);
    public boundClassNames: Record<string, Highcharts.NavigationBindingsOptionsObject> =
        void 0 as any;
    public chart: Highcharts.AnnotationChart;
    public container: HTMLCollectionOf<HTMLDOMElement>;
    public currentUserDetails?: Annotation;
    public eventsToUnbind: Array<Function>;
    public mouseMoveEvent?: (false|Function);
    public nextEvent?: (false|Function);
    public options: NavigationOptions;
    public popup?: Highcharts.Popup;
    public selectedButtonElement?: (HTMLDOMElement|null);
    public selectedButton: (
        Highcharts.NavigationBindingsOptionsObject|null
    ) = void 0 as any;
    public stepIndex?: number;
    public steps?: boolean;

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
    public initEvents(): void {
        const navigation = this,
            chart = navigation.chart,
            bindingsContainer = navigation.container,
            options = navigation.options;

        // Shorthand object for getting events for buttons:
        navigation.boundClassNames = {};

        objectEach((options.bindings || {}), function (
            value: Highcharts.NavigationBindingsOptionsObject
        ): void {
            navigation.boundClassNames[value.className] = value;
        });

        // Handle multiple containers with the same class names:
        ([] as Array<HTMLElement>).forEach.call(bindingsContainer, function (
            subContainer: HTMLElement
        ): void {
            navigation.eventsToUnbind.push(
                addEvent(subContainer, 'click', function (
                    event: PointerEvent
                ): void {
                    const bindings = navigation.getButtonEvents(
                        subContainer,
                        event
                    );

                    if (
                        bindings &&
                        bindings.button.className
                            .indexOf('highcharts-disabled-btn') === -1
                    ) {
                        navigation.bindingsButtonClick(
                            bindings.button,
                            bindings.events,
                            event
                        );
                    }
                })
            );
        });

        objectEach(options.events || {}, function (callback, eventName): void {
            if (isFunction(callback)) {
                navigation.eventsToUnbind.push(
                    addEvent(
                        navigation,
                        eventName,
                        callback,
                        { passive: false }
                    )
                );
            }
        });

        navigation.eventsToUnbind.push(
            addEvent(chart.container, 'click', function (
                this: HTMLDOMElement,
                e: PointerEvent
            ): void {
                if (
                    !chart.cancelClick &&
                    chart.isInsidePlot(
                        e.chartX - chart.plotLeft,
                        e.chartY - chart.plotTop,
                        {
                            visiblePlotOnly: true
                        }
                    )
                ) {
                    navigation.bindingsChartClick(this as any, e);
                }
            })
        );
        navigation.eventsToUnbind.push(
            addEvent(
                chart.container,
                H.isTouchDevice ? 'touchmove' : 'mousemove',
                function (e: PointerEvent): void {
                    navigation.bindingsContainerMouseMove(this, e);
                },
                H.isTouchDevice ? { passive: false } : void 0
            )
        );
    }

    /**
     * Common chart.update() delegation, shared between bindings and exporting.
     *
     * @private
     * @function Highcharts.NavigationBindings#initUpdate
     */
    public initUpdate(): void {
        const navigation = this;
        ChartNavigationComposition
            .compose(this.chart).navigation
            .addUpdate((options: NavigationOptions): void => {
                navigation.update(options);
            });
    }

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
     * @param {Object} events
     *        Events passed down from bindings (`init`, `start`, `step`, `end`)
     *
     * @param {Highcharts.PointerEventObject} clickEvent
     *        Browser's click event
     */
    public bindingsButtonClick(
        button: HTMLDOMElement,
        events: Highcharts.NavigationBindingsOptionsObject,
        clickEvent: PointerEvent
    ): void {
        const navigation = this,
            chart = navigation.chart,
            svgContainer = chart.renderer.boxWrapper;
        let shouldEventBeFired = true;

        if (navigation.selectedButtonElement) {
            if (
                navigation.selectedButtonElement.classList === button.classList
            ) {
                shouldEventBeFired = false;
            }

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

        if (shouldEventBeFired) {
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
        } else {
            chart.stockTools && chart.stockTools.toggleButtonAciveClass(button);
            svgContainer.removeClass(PREFIX + 'draw-mode');
            navigation.nextEvent = false;
            navigation.mouseMoveEvent = false;
            navigation.selectedButton = null;
        }
    }
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
    public bindingsChartClick(
        chart: Highcharts.AnnotationChart,
        clickEvent: PointerEvent
    ): void {
        chart = this.chart;

        const navigation = this,
            activeAnnotation = navigation.activeAnnotation,
            selectedButton = navigation.selectedButton,
            svgContainer = chart.renderer.boxWrapper;

        if (activeAnnotation) {
            // Click outside popups, should close them and deselect the
            // annotation
            if (
                !activeAnnotation.cancelClick && // #15729
                !clickEvent.activeAnnotation &&
                // Element could be removed in the child action, e.g. button
                (clickEvent.target as any).parentNode &&
                // TO DO: Polyfill for IE11?
                !closestPolyfill(
                    clickEvent.target as any, '.' + PREFIX + 'popup'
                )
            ) {
                fireEvent(navigation, 'closePopup');
            } else if (activeAnnotation.cancelClick) {
                // Reset cancelClick after the other event handlers have run
                setTimeout((): void => {
                    activeAnnotation.cancelClick = false;
                }, 0);
            }
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
            if (navigation.currentUserDetails && selectedButton.steps) {
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

                if (
                    (selectedButton.steps as any)[navigation.stepIndex as any]
                ) {
                    // If we have more steps, bind them one by one:
                    navigation.mouseMoveEvent = navigation.nextEvent = (
                        selectedButton.steps as any
                    )[navigation.stepIndex as any];
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
    }
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
    public bindingsContainerMouseMove(
        _container: HTMLDOMElement,
        moveEvent: Event
    ): void {
        if (this.mouseMoveEvent) {
            this.mouseMoveEvent(
                moveEvent,
                this.currentUserDetails
            );
        }
    }
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
    public fieldsToOptions<T>(
        fields: Record<string, string>,
        config: T
    ): T {
        objectEach(fields, function (value: string, field: string): void {
            let parsedValue = parseFloat(value),
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
                    const nextName = pick(path[index + 1], '');

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
    }
    /**
     * Shorthand method to deselect an annotation.
     *
     * @function Highcharts.NavigationBindings#deselectAnnotation
     */
    public deselectAnnotation(): void {
        if (this.activeAnnotation) {
            this.activeAnnotation.setControlPointsVisibility(false);
            this.activeAnnotation = false;
        }
    }
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
    public annotationToFields(
        annotation: Annotation
    ): Record<string, string> {
        const options = annotation.options,
            editables = NavigationBindings.annotationsEditable,
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
                NavigationBindings.annotationsNonEditable as any
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
         * @param {Object} parentEditables
         *        Editables from NavigationBindings.annotationsEditable
         *
         * @param {Object} parent
         *        Where new options will be assigned
         */
        function traverse(
            option: any,
            key: (0|string),
            parentEditables: any,
            parent: any
        ): void {
            let nextParent: any;

            if (
                parentEditables &&
                option &&
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

                    option.forEach(function (
                        arrayOption: any,
                        i: number
                    ): void {
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
                                function (
                                    nestedOption: any,
                                    nestedKey: string
                                ): void {
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
                    objectEach(
                        option,
                        function (nestedOption: any, nestedKey: string): void {
                            traverse(
                                nestedOption,
                                nestedKey,
                                key === 0 ?
                                    parentEditables :
                                    (nestedEditables as any)[key],
                                nextParent
                            );
                        }
                    );
                } else {
                    // Leaf:
                    if (key === 'format') {
                        parent[key] = [
                            format(
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
                objectEach(
                    options[key],
                    function (typeOption: any, typeKey: string): void {
                        (traverse as any)(
                            typeOption,
                            typeKey,
                            nestedEditables,
                            visualOptions[key],
                            true
                        );
                    }
                );
            } else {
                traverse(option, key, (editables as any)[type], visualOptions);
            }
        });

        return visualOptions;
    }

    /**
     * Get all class names for all parents in the element. Iterates until finds
     * main container.
     *
     * @function Highcharts.NavigationBindings#getClickedClassNames
     *
     * @param {Highcharts.HTMLDOMElement} container
     * Container that event is bound to.
     *
     * @param {global.Event} event
     * Browser's event.
     *
     * @return {Array<Array<string, Highcharts.HTMLDOMElement>>}
     * Array of class names with corresponding elements
     */
    public getClickedClassNames(
        container: HTMLDOMElement,
        event: Event
    ): Array<[string, HTMLDOMElement]> {
        let element: HTMLDOMElement = event.target as any,
            classNames: Array<[string, HTMLDOMElement]> = [],
            elemClassName: (string|null|undefined);

        while (element) {
            elemClassName = attr(element, 'class');
            if (elemClassName) {
                classNames = classNames.concat(
                    elemClassName
                        .split(' ')
                        .map(function (name: string): [string, HTMLDOMElement] { // eslint-disable-line no-loop-func
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

    }
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
     * @return {Object}
     *         Object with events (init, start, steps, and end)
     */
    public getButtonEvents(
        container: HTMLDOMElement,
        event: Event
    ): Highcharts.NavigationBindingsButtonEventsObject {
        let navigation = this,
            classNames = this.getClickedClassNames(container, event),
            bindings: (
                Highcharts.NavigationBindingsButtonEventsObject|undefined
            );


        classNames.forEach(function (
            className: [string, HTMLDOMElement]
        ): void {
            if (navigation.boundClassNames[className[0]] && !bindings) {
                bindings = {
                    events: navigation.boundClassNames[className[0]],
                    button: className[1]
                };
            }
        });

        return bindings as any;
    }
    /**
     * Bindings are just events, so the whole update process is simply
     * removing old events and adding new ones.
     *
     * @private
     * @function Highcharts.NavigationBindings#update
     */
    public update(options?: NavigationOptions): void {
        this.options = merge(true, this.options, options);
        this.removeEvents();
        this.initEvents();
    }
    /**
     * Remove all events created in the navigation.
     *
     * @private
     * @function Highcharts.NavigationBindings#removeEvents
     */
    public removeEvents(): void {
        this.eventsToUnbind.forEach(function (unbinder: Function): void {
            unbinder();
        });
    }
    public destroy(): void {
        this.removeEvents();
    }
}

interface NavigationBindings {
    utils: typeof bindingsUtils;
}

/**
 * General utils for bindings
 *
 * @private
 * @name Highcharts.NavigationBindings.utils
 * @type {bindingsUtils}
 */
NavigationBindings.prototype.utils = bindingsUtils;


Chart.prototype.initNavigationBindings = function (
    this: Highcharts.AnnotationChart
): void {
    const chart = this,
        options = chart.options;

    if (options && options.navigation && options.navigation.bindings) {
        chart.navigationBindings = new NavigationBindings(
            chart,
            options.navigation
        );
        chart.navigationBindings.initEvents();
        chart.navigationBindings.initUpdate();
    }
};

addEvent(Chart, 'load', function (): void {
    this.initNavigationBindings();
});

addEvent(Chart, 'destroy', function (): void {
    if (this.navigationBindings) {
        this.navigationBindings.destroy();
    }
});

addEvent(NavigationBindings, 'deselectButton', function (): void {
    this.selectedButtonElement = null;
});

addEvent(Annotation, 'remove', function (): void {
    if (this.chart.navigationBindings) {
        this.chart.navigationBindings.deselectAnnotation();
    }
});


/**
 * Show edit-annotation form:
 * @private
 */
function selectableAnnotation(annotationType: typeof Annotation): void {
    const originalClick = annotationType.prototype.defaultOptions.events &&
            annotationType.prototype.defaultOptions.events.click;

    /**
     * @private
     */
    function selectAndShowPopup(
        this: Annotation,
        eventArguments: AnyRecord
    ): void {
        const annotation = this,
            navigation = annotation.chart.navigationBindings,
            prevAnnotation = navigation.activeAnnotation;

        if (originalClick) {
            originalClick.call(annotation, eventArguments);
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
                    onSubmit: function (
                        data: Highcharts.PopupFieldsObject
                    ): void {

                        let config: Highcharts.PopupFieldsDictionary<string> = {},
                            typeOptions;

                        if (data.actionType === 'remove') {
                            navigation.activeAnnotation = false;
                            navigation.chart.removeAnnotation(annotation);
                        } else {
                            navigation.fieldsToOptions(
                                data.fields as Record<string, string>,
                                config
                            );
                            navigation.deselectAnnotation();

                            typeOptions = config.typeOptions;

                            if (annotation.options.type === 'measure') {
                                // Manually disable crooshars according to
                                // stroke width of the shape:
                                (typeOptions as any).crosshairY.enabled = (
                                    (typeOptions as any).crosshairY
                                        .strokeWidth !== 0
                                );
                                (typeOptions as any).crosshairX.enabled = (
                                    (typeOptions as any).crosshairX
                                        .strokeWidth !== 0
                                );
                            }

                            annotation.update(config);
                        }
                    }
                }
            );
        } else {
            // Deselect current:
            fireEvent(navigation, 'closePopup');
        }
        // Let bubble event to chart.click:
        eventArguments.activeAnnotation = true;
    }

    merge(
        true,
        annotationType.prototype.defaultOptions.events,
        {
            click: selectAndShowPopup
        }
    );
}

if ((H as any).Annotation) {
    // Basic shapes:
    selectableAnnotation(Annotation);

    // Advanced annotations:
    objectEach(
        Annotation.types,
        function (annotationType: typeof Annotation): void {
            selectableAnnotation(annotationType);
        }
    );
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
                ellipse: 'Ellipse',
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
         *
         * @sample {highstock} stock/stocktools/stocktools-thresholds
         *               Custom bindings
         * @sample {highcharts} highcharts/annotations/bindings/
         *               Simple binding
         * @sample {highcharts} highcharts/annotations/bindings-custom-annotation/
         *               Custom annotation binding
         *
         * @since        7.0.0
         * @requires     modules/annotations
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
                    this: NavigationBindings,
                    e: PointerEvent
                ): Annotation|void {
                    const coords = this.chart.pointer.getCoordinates(e),
                        coordsX = this.utils.getAssignedAxis(coords.xAxis),
                        coordsY = this.utils.getAssignedAxis(coords.yAxis),
                        navigation = this.chart.options.navigation;

                    // Exit if clicked out of axes area
                    if (!coordsX || !coordsY) {
                        return;
                    }

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'circle',
                                type: 'basicAnnotation',
                                shapes: [{
                                    type: 'circle',
                                    point: {
                                        x: coordsX.value,
                                        y: coordsY.value,
                                        xAxis: coordsX.axis.options.index,
                                        yAxis: coordsY.axis.options.index
                                    },
                                    r: 5
                                }]
                            },
                            navigation.annotationsOptions,
                            (navigation.bindings as any).circleAnnotation
                                .annotationsOptions
                        )
                    );
                },
                /** @ignore-option */
                steps: [
                    function (
                        this: NavigationBindings,
                        e: PointerEvent,
                        annotation: Annotation
                    ): void {
                        let mockPointOpts = annotation.options.shapes[0]
                                .point as MockPointOptions,
                            distance;

                        if (
                            isNumber(mockPointOpts.xAxis) &&
                            isNumber(mockPointOpts.yAxis)
                        ) {
                            const inverted = this.chart.inverted,
                                x = this.chart.xAxis[mockPointOpts.xAxis]
                                    .toPixels(mockPointOpts.x),
                                y = this.chart.yAxis[mockPointOpts.yAxis]
                                    .toPixels(mockPointOpts.y);

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
                        }

                        annotation.update({
                            shapes: [{
                                r: distance
                            }]
                        });
                    }
                ]
            },
            ellipseAnnotation: {
                className: 'highcharts-ellipse-annotation',
                start: function (
                    this: NavigationBindings,
                    e: PointerEvent
                ): Annotation|void {
                    const coords = this.chart.pointer.getCoordinates(e),
                        coordsX = this.utils.getAssignedAxis(coords.xAxis),
                        coordsY = this.utils.getAssignedAxis(coords.yAxis),
                        navigation = this.chart.options.navigation;

                    if (!coordsX || !coordsY) {
                        return;
                    }

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'ellipse',
                                type: 'basicAnnotation',
                                shapes: [
                                    {
                                        type: 'ellipse',
                                        xAxis: coordsX.axis.options.index,
                                        yAxis: coordsY.axis.options.index,
                                        points: [{
                                            x: coordsX.value,
                                            y: coordsY.value
                                        }, {
                                            x: coordsX.value,
                                            y: coordsY.value
                                        }],
                                        ry: 1
                                    }
                                ]
                            },
                            navigation.annotationsOptions,
                            (navigation.bindings as any).ellipseAnnotation
                                .annotationOptions
                        )
                    );
                },
                steps: [
                    function (
                        this: NavigationBindings,
                        e: PointerEvent,
                        annotation: Annotation
                    ): void {
                        const target = (
                                annotation.shapes[0] as ControllableEllipse
                            ),
                            position = target.getAbsolutePosition(
                                target.points[1]
                            );

                        target.translatePoint(
                            e.chartX - position.x,
                            e.chartY - position.y,
                            1
                        );

                        target.redraw(false);
                    },
                    function (
                        this: NavigationBindings,
                        e: PointerEvent,
                        annotation: Annotation
                    ): void {
                        const target =
                                annotation.shapes[0] as ControllableEllipse,
                            position =
                                target.getAbsolutePosition(target.points[0]),
                            position2 =
                                target.getAbsolutePosition(target.points[1]),
                            newR = target.getDistanceFromLine(
                                position,
                                position2,
                                e.chartX,
                                e.chartY
                            ),
                            yAxis = target.getYAxis(),
                            newRY = Math.abs(
                                yAxis.toValue(0) - yAxis.toValue(newR)
                            );

                        target.setYRadius(newRY);
                        target.redraw(false);
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
                    this: NavigationBindings,
                    e: PointerEvent
                ): Annotation|void {
                    const coords = this.chart.pointer.getCoordinates(e),
                        coordsX = this.utils.getAssignedAxis(coords.xAxis),
                        coordsY = this.utils.getAssignedAxis(coords.yAxis);

                    // Exit if clicked out of axes area
                    if (!coordsX || !coordsY) {
                        return;
                    }

                    const x = coordsX.value,
                        y = coordsY.value,
                        xAxis = coordsX.axis.options.index,
                        yAxis = coordsY.axis.options.index,
                        navigation = this.chart.options.navigation;

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'rectangle',
                                type: 'basicAnnotation',
                                shapes: [{
                                    type: 'path',
                                    points: [
                                        { xAxis, yAxis, x, y },
                                        { xAxis, yAxis, x, y },
                                        { xAxis, yAxis, x, y },
                                        { xAxis, yAxis, x, y },
                                        { command: 'Z' }
                                    ]
                                }]
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
                        this: NavigationBindings,
                        e: PointerEvent,
                        annotation: Annotation
                    ): void {
                        let points: Array<MockPointOptions> =
                                annotation.options.shapes[0].points as any,
                            coords = this.chart.pointer.getCoordinates(e),
                            coordsX = this.utils.getAssignedAxis(coords.xAxis),
                            coordsY = this.utils.getAssignedAxis(coords.yAxis),
                            x, y;

                        if (coordsX && coordsY) {
                            x = coordsX.value;
                            y = coordsY.value;

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
                    this: NavigationBindings,
                    e: PointerEvent
                ): Annotation|void {
                    const coords = this.chart.pointer.getCoordinates(e),
                        coordsX = this.utils.getAssignedAxis(coords.xAxis),
                        coordsY = this.utils.getAssignedAxis(coords.yAxis),
                        navigation = this.chart.options.navigation;

                    // Exit if clicked out of axes area
                    if (!coordsX || !coordsY) {
                        return;
                    }

                    return this.chart.addAnnotation(
                        merge(
                            {
                                langKey: 'label',
                                type: 'basicAnnotation',
                                labelOptions: {
                                    format: '{y:.2f}'
                                },
                                labels: [{
                                    point: {
                                        xAxis: coordsX.axis.options.index,
                                        yAxis: coordsY.axis.options.index,
                                        x: coordsX.value,
                                        y: coordsY.value
                                    },
                                    overflow: 'none',
                                    crop: true
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
         *            measure, pitchfork, tunnel, verticalLine, basicAnnotation
         * @requires     modules/annotations
         * @apioption navigation.annotationsOptions
         */
        annotationsOptions: {
            animation: {
                defer: 0
            }
        }
    }
});
addEvent(Chart, 'render', function (): void {
    const chart = this,
        navigationBindings = chart.navigationBindings,
        disabledClassName = 'highcharts-disabled-btn';

    if (chart && navigationBindings) {
        // Check if the buttons should be enabled/disabled based on
        // visible series.

        let buttonsEnabled = false;
        chart.series.forEach(function (series): void {
            if (!series.options.isInternal && series.visible) {
                buttonsEnabled = true;
            }
        });

        objectEach(
            navigationBindings.boundClassNames,
            function (
                value: Highcharts.NavigationBindingsOptionsObject,
                key: string
            ): void {

                if (
                    chart.navigationBindings &&
                    chart.navigationBindings.container &&
                    chart.navigationBindings.container[0]
                ) {

                    // Get the HTML element coresponding to the className taken
                    // from StockToolsBindings.
                    const buttonNode = chart.navigationBindings.container[0]
                        .querySelectorAll('.' + key);

                    if (buttonNode) {
                        for (let i = 0; i < buttonNode.length; i++) {
                            const button = buttonNode[i],
                                cls = button.className;
                            if (value.noDataState === 'normal') {
                                // If button has noDataState: 'normal', and has
                                // disabledClassName, remove this className.
                                if (cls.indexOf(disabledClassName) !== -1) {
                                    button.classList.remove(disabledClassName);
                                }
                            } else if (!buttonsEnabled) {
                                if (cls.indexOf(disabledClassName) === -1) {
                                    button.className += ' ' + disabledClassName;
                                }
                            } else {
                                // Enable all buttons by deleting the className.
                                if (cls.indexOf(disabledClassName) !== -1) {
                                    button.classList.remove(disabledClassName);
                                }
                            }
                        }
                    }
                }
            }
        );
    }
});

addEvent(
    NavigationBindings,
    'closePopup',
    function (this: NavigationBindings): void {
        this.deselectAnnotation();
    }
);

export default NavigationBindings;
