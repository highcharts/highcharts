/**
 * (c) 2009-2017 Highsoft, Black Label
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var doc = H.doc,
    addEvent = H.addEvent,
    pick = H.pick,
    extend = H.extend,
    isNumber = H.isNumber,
    fireEvent = H.fireEvent,
    isArray = H.isArray,
    isObject = H.isObject,
    objectEach = H.objectEach,
    PREFIX = 'highcharts-';

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
     * @function bindingsUtils.updateRectSize
     *
     * @param {global.Event} event
     *        Normalized browser event
     *
     * @param {Highcharts.Annotation} annotation
     *        Annotation to be updated
     */
    updateRectSize: function (event, annotation) {
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
    },

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
    getFieldType: function (value) {
        return {
            string: 'text',
            number: 'number',
            boolean: 'checkbox'
        }[typeof value];
    }
};

H.NavigationBindings = function (chart, options) {
    this.chart = chart;
    this.options = options;
    this.eventsToUnbind = [];
    this.container = doc.getElementsByClassName(
        this.options.bindingsClassName
    );
};

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
    initEvents: function () {
        var navigation = this,
            chart = navigation.chart,
            bindingsContainer = navigation.container,
            options = navigation.options;

        // Shorthand object for getting events for buttons:
        navigation.boundClassNames = {};

        objectEach(options.bindings, function (value) {
            navigation.boundClassNames[value.className] = value;
        });

        // Handle multiple containers with the same class names:
        [].forEach.call(bindingsContainer, function (subContainer) {
            navigation.eventsToUnbind.push(
                addEvent(
                    subContainer,
                    'click',
                    function (event) {
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
                    }
                )
            );
        });

        objectEach(options.events || {}, function (callback, eventName) {
            navigation.eventsToUnbind.push(
                addEvent(
                    navigation,
                    eventName,
                    callback
                )
            );
        });

        navigation.eventsToUnbind.push(
            addEvent(chart.container, 'click', function (e) {
                if (
                    !chart.cancelClick &&
                    chart.isInsidePlot(
                        e.chartX - chart.plotLeft,
                        e.chartY - chart.plotTop
                    )
                ) {
                    navigation.bindingsChartClick(this, e);
                }
            })
        );
        navigation.eventsToUnbind.push(
            addEvent(chart.container, 'mousemove', function (e) {
                navigation.bindingsContainerMouseMove(this, e);
            })
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
     * @param {object} [events]
     *        Events passed down from bindings (`init`, `start`, `step`, `end`)
     *
     * @param {global.Event} [clickEvent]
     *        Browser's click event
     */
    bindingsButtonClick: function (button, events, clickEvent) {
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
     * @param {global.Event} clickEvent
     *        Browser's click event.
     */
    bindingsChartClick: function (chartContainer, clickEvent) {
        var navigation = this,
            chart = navigation.chart,
            selectedButton = navigation.selectedButton,
            svgContainer = chart.renderer.boxWrapper;

        if (
            navigation.activeAnnotation &&
            !clickEvent.activeAnnotation &&
            // Element could be removed in the child action, e.g. button
            clickEvent.target.parentNode &&
            // TO DO: Polyfill for IE11?
            !clickEvent.target.closest('.' + PREFIX + 'popup')
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

            navigation.nextEvent.call(
                navigation,
                clickEvent,
                navigation.currentUserDetails
            );

            if (navigation.steps) {

                navigation.stepIndex++;

                if (selectedButton.steps[navigation.stepIndex]) {
                    // If we have more steps, bind them one by one:
                    navigation.mouseMoveEvent = navigation.nextEvent =
                        selectedButton.steps[navigation.stepIndex];
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
     * @function Highcharts.NavigationBindings#fieldsToOptions
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
     * @function Highcharts.NavigationBindings#deselectAnnotation
     */
    deselectAnnotation: function () {
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
     * @return {object}
     *         Annotation options to be displayed in popup box
     */
    annotationToFields: function (annotation) {
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
            nonEditables = H.NavigationBindings
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
         * @function Highcharts.NavigationBindings#annotationToFields.traverse
         *
         * @param {*} option
         *        Atomic type or object/array
         *
         * @param {string} key
         *        Option name, for example "visible" or "x", "y"
         *
         * @param {object} allowed
         *        Editables from H.NavigationBindings.annotationsEditable
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
     * @function Highcharts.NavigationBindings#getClickedClassNames
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
     * @function Highcharts.NavigationBindings#getButtonEvents
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
        var navigation = this,
            classNames = this.getClickedClassNames(container, event),
            bindings;


        classNames.forEach(function (className) {
            if (navigation.boundClassNames[className[0]] && !bindings) {
                bindings = {
                    events: navigation.boundClassNames[className[0]],
                    button: className[1]
                };
            }
        });

        return bindings;
    },
    /**
     * Bindings are just events, so the whole update process is simply
     * removing old events and adding new ones.
     *
     * @private
     * @function Highcharts.NavigationBindings#update
     */
    update: function () {
        this.removeEvents();
        this.initEvents();
    },
    /**
     * Remove all events created in the navigation.
     *
     * @private
     * @function Highcharts.NavigationBindings#removeEvents
     */
    removeEvents: function () {
        this.eventsToUnbind.forEach(function (unbinder) {
            unbinder();
        });
    },
    destroy: function () {
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

addEvent(H.Chart, 'load', function () {
    var chart = this,
        options = chart.options;

    if (options && options.navigation && options.navigation.bindings) {
        chart.navigationBindings = new H.NavigationBindings(
            chart,
            options.navigation
        );
        chart.navigationBindings.initEvents();
    }
});

addEvent(H.Chart, 'destroy', function () {
    if (this.navigationBindings) {
        this.navigationBindings.destroy();
    }
});

addEvent(H.NavigationBindings, 'deselectButton', function () {
    this.selectedButtonElement = null;
});


// Show edit-annotation form:
function selectableAnnotation(annotationType) {
    var originalClick = annotationType.prototype.defaultOptions.events &&
            annotationType.prototype.defaultOptions.events.click;

    function selectAndshowPopup(event) {
        var annotation = this,
            navigation = annotation.chart.navigationBindings,
            prevAnnotation = navigation.activeAnnotation;

        if (originalClick) {
            originalClick.click.call(annotation, event);
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
                    onSubmit: function (data) {

                        var config = {},
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
    H.objectEach(H.Annotation.types, function (annotationType) {
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
         * @since           7.0.0
         * @type            {Object}
         * @product         highcharts highstock
         */
        navigation: {
            /**
             * Translations for all field names used in popup.
             *
             * @product         highcharts highstock
             * @type            {Object}
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
         * @since     7.0.0
         * @type      {string}
         */
        bindingsClassName: 'highcharts-bindings-wrapper',
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
         * @type         {Highcharts.Dictionary<Highcharts.StockToolsBindingsObject>|*}
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
                                    var xy = H.Annotation.MockPoint
                                        .pointToPixels(
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
                                    // TRANSFORM RADIUS ACCORDING TO Y
                                    // TRANSLATION
                                    drag: function (e, target) {
                                        var position = this
                                            .mouseMoveToTranslation(e);

                                        target.setRadius(
                                            Math.max(
                                                target.options.r +
                                                    position.y /
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
                            shapes: [{
                                type: 'rect',
                                point: {
                                    x: x,
                                    y: y,
                                    xAxis: 0,
                                    yAxis: 0
                                },
                                width: 5,
                                height: 5,

                                controlPoints: [{
                                    positioner: function (target) {
                                        var xy = H.Annotation.MockPoint
                                            .pointToPixels(
                                                target.points[0]
                                            );

                                        return {
                                            x: xy.x + target.options.width - 4,
                                            y: xy.y + target.options.height - 4
                                        };
                                    },
                                    events: {
                                        drag: function (e, target) {
                                            var xy = this
                                                .mouseMoveToTranslation(e);

                                            target.options.width = Math.max(
                                                target.options.width + xy.x,
                                                5
                                            );
                                            target.options.height = Math.max(
                                                target.options.height + xy.y,
                                                5
                                            );

                                            target.redraw(false);
                                        }
                                    }
                                }]
                            }]
                        };

                    return this.chart.addAnnotation(options);
                },
                /** @ignore */
                steps: [
                    function (e, annotation) {
                        var xAxis = this.chart.xAxis[0],
                            yAxis = this.chart.yAxis[0],
                            point = annotation.options.shapes[0].point,
                            x = xAxis.toPixels(point.x),
                            y = yAxis.toPixels(point.y),
                            width = Math.max(e.chartX - x, 5),
                            height = Math.max(e.chartY - y, 5);

                        annotation.update({
                            shapes: [{
                                width: width,
                                height: height,
                                point: {
                                    x: point.x,
                                    y: point.y
                                }
                            }]
                        });
                    }
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

                                // TRANSLATE POSITION WITHOUT CHANGING THE
                                // ANCHOR
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
            }
        },
        /**
         * A `showPopup` event. Fired when selecting for example an annotation.
         *
         * @type      {Function}
         * @apioption navigation.events.showPopup
         */

        /**
         * A `hidePopop` event. Fired when Popup should be hidden, for exampole
         * when clicking on an annotation again.
         *
         * @type      {Function}
         * @apioption navigation.events.hidePopup
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
        events: {}
    }
});
