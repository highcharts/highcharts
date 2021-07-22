/* *
 *
 *  Popup generator for Stock tools
 *
 *  (c) 2009-2021 Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Annotation from './Annotations';
import type Chart from '../../Core/Chart/Chart';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type Series from '../../Core/Series/Series';
import type { SeriesTypePlotOptions } from '../../Core/Series/SeriesType';
import type SMAIndicator from '../../Stock/Indicators/SMA/SMAIndicator';
import H from '../../Core/Globals.js';
const {
    doc,
    isFirefox
} = H;
import NavigationBindings from './NavigationBindings.js';
import D from '../../Core/DefaultOptions.js';
const { getOptions } = D;
import Pointer from '../../Core/Pointer.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    defined,
    fireEvent,
    isArray,
    isObject,
    isString,
    objectEach,
    pick,
    stableSort,
    wrap
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class Popup {
            public constructor(parentDiv: HTMLDOMElement, iconsURL: string, chart?: Chart);
            public annotations: PopupAnnotationsObject;
            public container: HTMLDOMElement;
            public formType?: string;
            public iconsURL: string;
            public indicators: PopupIndicatorsObject;
            public lang: Record<string, string>;
            public popup: Popup;
            public chart?: Chart;
            public tabs: PopupTabsObject;
            public addButton (
                parentDiv: HTMLDOMElement,
                label: string,
                type: string,
                fieldsDiv: HTMLDOMElement,
                callback?: Function
            ): HTMLDOMElement;
            public addCloseBtn(): void;
            public addColsContainer(container: HTMLDOMElement): Record<string, HTMLDOMElement>;
            public addInput(
                option: string,
                type: string,
                parentDiv: HTMLDOMElement,
                inputAttributes: InputAttributes
            ): HTMLDOMElement;
            public closePopup(): void;
            public deselectAll(): void;
            public getFields(parentDiv: HTMLDOMElement, type: string): PopupFieldsObject;
            public getLangpack(): Record<string, string>;
            public init(parentDiv: HTMLDOMElement, iconsURL: string, chart?: Chart): void;
            public showForm(
                type: string,
                chart: AnnotationChart,
                options: AnnotationsOptions,
                callback: Function
            ): void;
            public showPopup(): void;
        }
        interface FilteredSeries {
            [key: string]: Series;
        }
        interface PopupAnnotationsObject {
            addForm(
                this: Popup,
                chart: AnnotationChart,
                options: AnnotationsOptions,
                callback: Function,
                isInit?: boolean
            ): void;
            addFormFields(
                this: Popup,
                parentDiv: HTMLDOMElement,
                chart: AnnotationChart,
                parentNode: string,
                options: AnnotationsOptions,
                storage: Array<unknown>,
                isRoot?: boolean
            ): void;
            addToolbar(this: Popup, chart: AnnotationChart, options: AnnotationsOptions, callback: Function): void;
        }
        interface PopupConfigObject {
            annotation: Annotation;
            formType: string;
            onSubmit: Function;
            options: AnnotationsOptions;
        }
        interface PopupFieldsDictionary<T> {
            [key: string]: (T | PopupFieldsDictionary<T>);
        }
        interface PopupFieldsObject {
            actionType: string;
            fields: PopupFieldsDictionary<string>;
            linkedTo?: string;
            seriesId?: string;
            type?: string;
        }
        interface PopupIndicatorsObject {
            addForm(this: Popup, chart: AnnotationChart, options: AnnotationsOptions, callback: Function): void;
            addFormFields(
                this: Popup,
                chart: AnnotationChart,
                series: SMAIndicator,
                seriesType: string,
                rhsColWrapper: HTMLDOMElement
            ): void;
            addIndicatorList(
                this: Popup,
                chart: AnnotationChart,
                parentDiv: HTMLDOMElement,
                listType: string,
                filter?: string
            ): void;
            addSearchBox(this: Popup, chart: AnnotationChart, parentDiv: HTMLDOMElement): void;
            addParamInputs(
                this: Popup,
                chart: AnnotationChart,
                parentNode: string,
                fields: PopupFieldsDictionary<string>,
                type: string,
                parentDiv: HTMLDOMElement
            ): void;
            filterSeries(series: SeriesTypePlotOptions, filter?: string): SeriesTypePlotOptions;
            sortSeries(series: any): any;
            getAmount(this: Chart): number;
            getNameType(series: SMAIndicator, type: string): Record<string, string>;
            listAllSeries(
                this: Popup,
                type: string,
                optionName: string,
                chart: AnnotationChart,
                parentDiv: HTMLDOMElement,
                selectedOption: string
            ): void;
        }
        interface PopupTabsObject {
            addContentItem(): HTMLDOMElement;
            addMenuItem(this: Popup, tabName: string, disableTab?: number): HTMLDOMElement;
            deselectAll(this: Popup): void;
            init(this: Popup, chart: AnnotationChart): void;
            selectTab(this: Popup, tab: Element, index: number): void;
            switchTabs(this: Popup, disableTab: number): void;
        }
        interface InputAttributes {
            value: string|number;
            type: string;
        }
    }
}

const indexFilter = /\d/g,
    PREFIX = 'highcharts-',
    DIV = 'div',
    INPUT = 'input',
    LABEL = 'label',
    BUTTON = 'button',
    SELECT = 'select',
    OPTION = 'option',
    SPAN = 'span',
    UL = 'ul',
    LI = 'li',
    H3 = 'h3';

/* eslint-disable no-invalid-this, valid-jsdoc */

// onContainerMouseDown blocks internal popup events, due to e.preventDefault.
// Related issue #4606

wrap(Pointer.prototype, 'onContainerMouseDown', function (this: Pointer, proceed: Function, e): void {

    const popupClass = e.target && e.target.className;

    // elements is not in popup
    if (!(isString(popupClass) &&
        popupClass.indexOf(PREFIX + 'popup-field') >= 0)
    ) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

H.Popup = function (this: Highcharts.Popup, parentDiv: HTMLDOMElement, iconsURL: string, chart?: Chart): void {
    this.init(parentDiv, iconsURL, chart);
} as any;

H.Popup.prototype = {
    /**
     * Initialize the popup. Create base div and add close button.
     * @private
     * @param {Highcharts.HTMLDOMElement} parentDiv
     * Container where popup should be placed
     * @param {string} iconsURL
     * Icon URL
     */
    init: function (parentDiv: HTMLDOMElement, iconsURL: string, chart?: Chart): void {
        this.chart = chart;

        // create popup div
        this.container = createElement(DIV, {
            className: PREFIX + 'popup highcharts-no-tooltip'
        }, null as any, parentDiv);

        this.lang = this.getLangpack();
        this.iconsURL = iconsURL;

        // add close button
        this.addCloseBtn();
    },
    /**
     * Create HTML element and attach click event (close popup).
     * @private
     */
    addCloseBtn: function (): void {
        let _self = this,
            closeBtn: HTMLDOMElement;

        const iconsURL = this.iconsURL;

        // create close popup btn
        closeBtn = createElement(DIV, {
            className: PREFIX + 'popup-close'
        }, null as any, this.container);

        closeBtn.style['background-image' as any] = 'url(' +
                (
                    iconsURL.match(/png|svg|jpeg|jpg|gif/ig) ?
                        iconsURL : iconsURL + 'close.svg'
                ) + ')';

        ['click', 'touchstart'].forEach(function (eventName: string): void {
            addEvent(closeBtn, eventName, function (): void {
                if (_self.chart) {
                    fireEvent(_self.chart.navigationBindings, 'closePopup');
                } else {
                    _self.closePopup();
                }
            });
        });
    },
    /**
     * Create two columns (divs) in HTML.
     * @private
     * @param {Highcharts.HTMLDOMElement} container
     * Container of columns
     * @return {Highcharts.Dictionary<Highcharts.HTMLDOMElement>}
     * Reference to two HTML columns (lhsCol, rhsCol)
     */
    addColsContainer: function (
        container: HTMLDOMElement
    ): Record<string, HTMLDOMElement> {
        let rhsCol,
            lhsCol;

        // left column
        lhsCol = createElement(DIV, {
            className: PREFIX + 'popup-lhs-col'
        }, null as any, container);

        // right column
        rhsCol = createElement(DIV, {
            className: PREFIX + 'popup-rhs-col'
        }, null as any, container);

        // wrapper content
        createElement(DIV, {
            className: PREFIX + 'popup-rhs-col-wrapper'
        }, null as any, rhsCol);

        return {
            lhsCol: lhsCol,
            rhsCol: rhsCol
        };
    },
    /**
     * Create input with label.
     * @private
     * @param {string} option
     * Chain of fields i.e params.styles.fontSize
     * @param {string} type
     * Indicator type
     * @param {Highhcharts.HTMLDOMElement}
     * Container where elements should be added
     * @param {string} value
     * Default value of input i.e period value is 14, extracted from
     * defaultOptions (ADD mode) or series options (EDIT mode)
     */
    addInput: function (
        option: string, type: string,
        parentDiv: HTMLDOMElement,
        inputAttributes: Highcharts.InputAttributes
    ): HTMLDOMElement {
        const optionParamList = option.split('.'),
            optionName = optionParamList[optionParamList.length - 1],
            lang = this.lang,
            inputName = PREFIX + type + '-' + optionName;
        let input;

        if (!inputName.match(indexFilter)) {
            // add label
            createElement(
                LABEL, {
                    htmlFor: inputName
                },
                void 0,
                parentDiv
            ).appendChild(
                doc.createTextNode(lang[optionName] || optionName)
            );
        }

        // add input
        input = createElement(
            INPUT,
            {
                name: inputName,
                value: inputAttributes.value as any,
                type: inputAttributes.type,
                className: PREFIX + 'popup-field'
            },
            void 0,
            parentDiv
        );
        input.setAttribute(PREFIX + 'data-name', option);
        return input;
    },
    /**
     * Create button.
     * @private
     * @param {Highcharts.HTMLDOMElement} parentDiv
     * Container where elements should be added
     * @param {string} label
     * Text placed as button label
     * @param {string} type
     * add | edit | remove
     * @param {Function} callback
     * On click callback
     * @param {Highcharts.HTMLDOMElement} fieldsDiv
     * Container where inputs are generated
     * @return {Highcharts.HTMLDOMElement}
     * HTML button
     */
    addButton: function (
        parentDiv: HTMLDOMElement,
        label: string,
        type: string,
        fieldsDiv: HTMLDOMElement,
        callback?: Function
    ): HTMLDOMElement {
        let _self = this,
            closePopup = this.closePopup,
            getFields = this.getFields,
            button: HTMLDOMElement;

        button = createElement(BUTTON, void 0, void 0, parentDiv);
        button.appendChild(doc.createTextNode(label));

        if (callback) {
            ['click', 'touchstart'].forEach(function (eventName: string): void {
                addEvent(button, eventName, function (): void {
                    closePopup.call(_self);

                    return callback(
                        getFields(fieldsDiv, type)
                    );
                });
            });
        }

        return button;
    },
    /**
     * Get values from all inputs and create JSON.
     * @private
     * @param {Highcharts.HTMLDOMElement} - container where inputs are created
     * @param {string} - add | edit | remove
     * @return {Highcharts.PopupFieldsObject} - fields
     */
    getFields: function (
        parentDiv: HTMLDOMElement,
        type: string
    ): Highcharts.PopupFieldsObject {

        let inputList = parentDiv.querySelectorAll('input'),
            optionSeries = '#' + PREFIX + 'select-series > option:checked',
            optionVolume = '#' + PREFIX + 'select-volume > option:checked',
            linkedTo = parentDiv.querySelectorAll(optionSeries)[0],
            volumeTo = parentDiv.querySelectorAll(optionVolume)[0],
            seriesId,
            param,
            fieldsOutput: Highcharts.PopupFieldsObject;

        fieldsOutput = {
            actionType: type,
            linkedTo: linkedTo && linkedTo.getAttribute('value'),
            fields: { }
        } as any;

        [].forEach.call(inputList, function (input: HTMLInputElement): void {
            param = input.getAttribute(PREFIX + 'data-name');
            seriesId = input.getAttribute(PREFIX + 'data-series-id');

            // params
            if (seriesId) {
                fieldsOutput.seriesId = input.value;
            } else if (param) {
                fieldsOutput.fields[param] = input.value;
            } else {
                // type like sma / ema
                fieldsOutput.type = input.value;
            }
        });

        if (volumeTo) {
            fieldsOutput.fields['params.volumeSeriesID'] = volumeTo.getAttribute('value') as any;
        }

        return fieldsOutput as any;
    },
    /**
     * Reset content of the current popup and show.
     * @private
     */
    showPopup: function (): void {

        const popupDiv = this.container,
            toolbarClass = PREFIX + 'annotation-toolbar',
            popupCloseBtn = popupDiv
                .querySelectorAll('.' + PREFIX + 'popup-close')[0];

        this.formType = void 0;

        // reset content
        popupDiv.innerHTML = '';

        // reset toolbar styles if exists
        if (popupDiv.className.indexOf(toolbarClass) >= 0) {
            popupDiv.classList.remove(toolbarClass);

            // reset toolbar inline styles
            popupDiv.removeAttribute('style');
        }

        // add close button
        popupDiv.appendChild(popupCloseBtn);
        popupDiv.style.display = 'block';
        popupDiv.style.height = '';
    },
    /**
     * Hide popup.
     * @private
     */
    closePopup: function (): void {
        const container = pick(
            this.popup && this.popup.container,
            this.container
        );
        container.style.display = 'none';
    },
    /**
     * Create content and show popup.
     * @private
     * @param {string} - type of popup i.e indicators
     * @param {Highcharts.Chart} - chart
     * @param {Highcharts.AnnotationsOptions} - options
     * @param {Function} - on click callback
     */
    showForm: function (
        type: string,
        chart: Highcharts.AnnotationChart,
        options: Highcharts.AnnotationsOptions,
        callback: Function
    ): void {

        if (!chart) {
            return;
        }

        this.popup = chart.navigationBindings.popup;

        // show blank popup
        this.showPopup();

        // indicator form
        if (type === 'indicators') {
            this.indicators.addForm.call(this, chart, options, callback);
        }

        // annotation small toolbar
        if (type === 'annotation-toolbar') {
            this.annotations.addToolbar.call(this, chart, options, callback);
        }

        // annotation edit form
        if (type === 'annotation-edit') {
            this.annotations.addForm.call(this, chart, options, callback);
        }

        // flags form - add / edit
        if (type === 'flag') {
            this.annotations.addForm.call(this, chart, options, callback, true);
        }

        this.formType = type;

        // Explicit height is needed to make inner elements scrollable
        this.container.style.height = this.container.offsetHeight + 'px';
    },
    /**
     * Return lang definitions for popup.
     * @private
     * @return {Highcharts.Dictionary<string>} - elements translations.
     */
    getLangpack: function (this: Highcharts.Popup): Record<string, string> {
        return (getOptions().lang as any).navigation.popup;
    },
    annotations: {
        /**
         * Create annotation simple form. It contains two buttons
         * (edit / remove) and text label.
         * @private
         * @param {Highcharts.Chart} - chart
         * @param {Highcharts.AnnotationsOptions} - options
         * @param {Function} - on click callback
         */
        addToolbar: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            options: Highcharts.AnnotationsOptions,
            callback: Function
        ): void {
            let _self = this,
                lang = this.lang,
                popupDiv = this.popup.container,
                showForm = this.showForm,
                toolbarClass = PREFIX + 'annotation-toolbar',
                button;

            // set small size
            if (popupDiv.className.indexOf(toolbarClass) === -1) {
                popupDiv.className += ' ' + toolbarClass;
            }

            // set position
            if (chart) {
                popupDiv.style.top = chart.plotTop + 10 + 'px';
            }

            // create label
            createElement(SPAN, void 0, void 0, popupDiv).appendChild(
                doc.createTextNode(pick(
                    // Advanced annotations:
                    lang[options.langKey as any] || options.langKey,
                    // Basic shapes:
                    options.shapes && options.shapes[0].type
                ))
            );

            // add buttons
            button = this.addButton(
                popupDiv,
                lang.removeButton || 'remove',
                'remove',
                popupDiv,
                callback
            );

            button.className += ' ' + PREFIX + 'annotation-remove-button';
            button.style['background-image' as any] = 'url(' +
                this.iconsURL + 'destroy.svg)';

            button = this.addButton(
                popupDiv,
                lang.editButton || 'edit',
                'edit',
                popupDiv,
                function (): void {
                    showForm.call(
                        _self,
                        'annotation-edit',
                        chart,
                        options,
                        callback
                    );
                }
            );

            button.className += ' ' + PREFIX + 'annotation-edit-button';
            button.style['background-image' as any] = 'url(' +
                this.iconsURL + 'edit.svg)';

        },
        /**
         * Create annotation simple form.
         * It contains fields with param names.
         * @private
         * @param {Highcharts.Chart} chart
         * Chart
         * @param {Object} options
         * Options
         * @param {Function} callback
         * On click callback
         * @param {boolean} [isInit]
         * If it is a form declared for init annotation
         */
        addForm: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            options: Highcharts.AnnotationsOptions,
            callback: Function,
            isInit?: boolean
        ): void {
            let popupDiv = this.popup.container,
                lang = this.lang,
                bottomRow,
                lhsCol;

            if (!chart) {
                return;
            }

            // create title of annotations
            lhsCol = createElement('h2', {
                className: PREFIX + 'popup-main-title'
            }, void 0, popupDiv);
            lhsCol.appendChild(
                doc.createTextNode(
                    lang[options.langKey as any] || options.langKey || ''
                )
            );

            // left column
            lhsCol = createElement(DIV, {
                className: PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full'
            }, null as any, popupDiv);

            bottomRow = createElement(DIV, {
                className: PREFIX + 'popup-bottom-row'
            }, null as any, popupDiv);

            this.annotations.addFormFields.call(
                this,
                lhsCol,
                chart,
                '',
                options,
                [],
                true
            );

            this.addButton(
                bottomRow,
                isInit ?
                    (lang.addButton || 'add') :
                    (lang.saveButton || 'save'),
                isInit ? 'add' : 'save',
                popupDiv,
                callback
            );
        },
        /**
         * Create annotation's form fields.
         * @private
         * @param {Highcharts.HTMLDOMElement} parentDiv
         * Div where inputs are placed
         * @param {Highcharts.Chart} chart
         * Chart
         * @param {string} parentNode
         * Name of parent to create chain of names
         * @param {Highcharts.AnnotationsOptions} options
         * Options
         * @param {Array<unknown>} storage
         * Array where all items are stored
         * @param {boolean} [isRoot]
         * Recursive flag for root
         */
        addFormFields: function (
            this: Highcharts.Popup,
            parentDiv: HTMLDOMElement,
            chart: Highcharts.AnnotationChart,
            parentNode: string,
            options: Highcharts.AnnotationsOptions,
            storage: Array<unknown>,
            isRoot?: boolean
        ): void {
            let _self = this,
                addFormFields = this.annotations.addFormFields,
                addInput = this.addInput,
                lang = this.lang,
                parentFullName,
                titleName;

            if (!chart) {
                return;
            }

            objectEach(options, function (value, option: string): void {

                // create name like params.styles.fontSize
                parentFullName = parentNode !== '' ?
                    parentNode + '.' + option : option;

                if (isObject(value)) {
                    if (
                        // value is object of options
                        !isArray(value) ||
                        // array of objects with params. i.e labels in Fibonacci
                        (isArray(value) && isObject(value[0]))
                    ) {
                        titleName = lang[option] || option;

                        if (!titleName.match(indexFilter)) {
                            storage.push([
                                true,
                                titleName,
                                parentDiv
                            ]);
                        }

                        addFormFields.call(
                            _self,
                            parentDiv,
                            chart,
                            parentFullName,
                            value as any,
                            storage,
                            false
                        );
                    } else {
                        storage.push([
                            _self,
                            parentFullName,
                            'annotation',
                            parentDiv,
                            value
                        ]);
                    }
                }
            });

            if (isRoot) {
                stableSort(storage, function (a: any): number {
                    return a[1].match(/format/g) ? -1 : 1;
                });

                if (isFirefox) {
                    storage.reverse(); // (#14691)
                }

                storage.forEach(function (genInput): void {
                    if ((genInput as any)[0] === true) {
                        createElement(
                            SPAN, {
                                className: PREFIX + 'annotation-title'
                            },
                            void 0,
                            (genInput as any)[2]
                        ).appendChild(doc.createTextNode(
                            (genInput as any)[1]
                        ));

                    } else {
                        addInput.apply((genInput as any)[0], (genInput as any).splice(1));
                    }
                });
            }
        }
    },
    indicators: {
        /**
         * Create indicator's form. It contains two tabs (ADD and EDIT) with
         * content.
         * @private
         */
        addForm: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            _options: Highcharts.AnnotationsOptions,
            callback: Function
        ): void {

            let tabsContainers,
                indicators = this.indicators,
                lang = this.lang,
                buttonParentDiv;

            if (!chart) {
                return;
            }

            // add tabs
            this.tabs.init.call(this, chart);

            // get all tabs content divs
            tabsContainers = this.popup.container
                .querySelectorAll('.' + PREFIX + 'tab-item-content');

            // ADD tab
            this.addColsContainer(tabsContainers[0] as any);
            indicators.addSearchBox.call(
                this,
                chart,
                tabsContainers[0] as any
            );
            indicators.addIndicatorList.call(
                this,
                chart,
                tabsContainers[0] as any,
                'add'
            );
            buttonParentDiv = tabsContainers[0]
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];

            this.addButton(
                buttonParentDiv as any,
                lang.addButton || 'add',
                'add',
                buttonParentDiv as any,
                callback
            );

            // EDIT tab
            this.addColsContainer(tabsContainers[1] as any);
            indicators.addIndicatorList.call(
                this,
                chart,
                tabsContainers[1] as any,
                'edit'
            );

            buttonParentDiv = tabsContainers[1]
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];

            this.addButton(
                buttonParentDiv as any,
                lang.saveButton || 'save',
                'edit',
                buttonParentDiv as any,
                callback
            );
            this.addButton(
                buttonParentDiv as any,
                lang.removeButton || 'remove',
                'remove',
                buttonParentDiv as any,
                callback
            );
        },
        /**
         * Sort the series in the object.
         * @private
         */
        sortSeries: function (series: Highcharts.FilteredSeries): Highcharts.FilteredSeries {
            let sorted: Highcharts.FilteredSeries = {},
                array = [],
                key;

            for (key in series) {
                if (Object.prototype.hasOwnProperty.call(series, key)) {
                    array.push(key);
                }
            }

            array.sort();

            for (key = 0; key < array.length; key++) {
                sorted[array[key]] = series[array[key]];
            }
            return sorted;
        },
        /**
         * Create an array of filtered and sorted series based on the filter.
         * @private
         */
        filterSeries: function (series: Highcharts.FilteredSeries, filter?: string): Highcharts.FilteredSeries {
            let filteredSeries = {} as Highcharts.FilteredSeries;

            if (filter) {
                objectEach(series, function (
                    series: Series,
                    value: string
                ): void {
                    const filterLength = filter.length,
                        slicedValue = value.slice(0, filterLength);
                    if (slicedValue === filter) {
                        filteredSeries[value] = series;
                    }
                });
                return this.sortSeries(filteredSeries);
            }
            // First iteration when filter doesn't exist.
            return this.sortSeries(series);
        },
        /**
         * Create HTML list of all indicators (ADD mode) or added indicators
         * (EDIT mode).
         * @private
         */
        addIndicatorList: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            parentDiv: HTMLDOMElement,
            listType: string,
            filter?: string
        ): void {
            const popup = this,
                indicators = popup.indicators,
                lhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-lhs-col')[0] as HTMLElement,
                rhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0] as HTMLElement,
                isEdit = listType === 'edit',
                addFormFields = this.indicators.addFormFields;
            let series = (
                    isEdit ?
                        chart.series : // EDIT mode
                        chart.options.plotOptions // ADD mode
                ),

                rhsColWrapper: Element,
                indicatorList: HTMLDOMElement,
                item: HTMLDOMElement,
                filteredSeries: Series[] | SeriesTypePlotOptions | undefined | Highcharts.FilteredSeries;

            if (!chart && series) {
                return;
            }

            // Filter and sort the series.
            if (!isEdit && series && !isArray(series)) {
                // Apply filters only for the 'add' indicator list.
                filteredSeries = indicators.filterSeries(series, filter);
            } else {
                filteredSeries = series;
            }

            // If the list exists remove it from the DOM
            // in order to create a new one with different filters.
            if (lhsCol.children[3]) {
                lhsCol.children[3].remove();
            }

            // Create wrapper for list.
            indicatorList = createElement(
                UL,
                {
                    className: PREFIX + 'indicator-list'
                },
                void 0,
                lhsCol
            );

            rhsColWrapper = rhsCol
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col-wrapper')[0];

            objectEach(filteredSeries, function (
                series: (Series|SeriesTypePlotOptions),
                value: string
            ): void {
                const seriesOptions = series.options;

                if (
                    (series as any).params ||
                    seriesOptions && (seriesOptions as any).params
                ) {
                    const indicatorNameType = popup.indicators.getNameType(series as any, value),
                        indicatorType = indicatorNameType.type;

                    item = createElement(
                        LI,
                        {
                            className: PREFIX + 'indicator-list'
                        },
                        void 0,
                        indicatorList
                    );
                    item.appendChild(doc.createTextNode(
                        indicatorNameType.name
                    ));

                    ['click', 'touchstart'].forEach(function (eventName: string): void {
                        addEvent(item, eventName, function (): void {

                            addFormFields.call(
                                popup,
                                chart,
                                isEdit ? series : (filteredSeries as any)[indicatorType],
                                indicatorNameType.type,
                                rhsColWrapper as any
                            );

                            // add hidden input with series.id
                            if (isEdit && series.options) {
                                createElement(
                                    INPUT,
                                    {
                                        type: 'hidden',
                                        name: PREFIX + 'id-' + indicatorType,
                                        value: (series as any).options.id
                                    },
                                    void 0,
                                    rhsColWrapper as any
                                ).setAttribute(
                                    PREFIX + 'data-series-id',
                                    (series as any).options.id
                                );
                            }
                        });
                    });
                }
            });

            // select first item from the list
            if (indicatorList.childNodes.length > 0) {
                (indicatorList.childNodes[0] as any).click();
            }
        },
        /**
         * Add searchbox.
         * @private
         */
        addSearchBox: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            parentDiv: HTMLDOMElement
        ): void {
            const popup = this,
                lhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-lhs-col')[0] as HTMLElement,
                options = 'type.search-indicators',
                inputAttributes = {
                    value: '',
                    type: 'text'
                },
                clearFilterText = this.lang.clearFilter;

            const handleInputChange = function (inputText: string): void {
                // Apply some filters.
                popup.indicators.addIndicatorList.call(popup, chart, popup.container, 'add', inputText);
            };

            // Add input field with the label and button.
            const input = this.addInput(options, INPUT, lhsCol, inputAttributes) as HTMLInputElement,
                button = this.addButton(lhsCol, clearFilterText, 'button', lhsCol);

            // Add input change events.
            ['input'].forEach(function (eventName: string): void {
                addEvent(input, eventName, function (): void {
                    const inputText = this.value;

                    handleInputChange(inputText);
                });
            });

            // Add clear filter click event.
            ['click', 'touchstart'].forEach(function (eventName: string): void {
                addEvent(button, eventName, function (): void {

                    // Clear the input.
                    input.value = '';
                    handleInputChange('');
                });
            });
        },
        /**
         * Extract full name and type of requested indicator.
         * @private
         * @param {Highcharts.Series} series
         * Series which name is needed. (EDIT mode - defaultOptions.series, ADD
         * mode - indicator series).
         * @param {string} - indicator type like: sma, ema, etc.
         * @return {Object} - series name and type like: sma, ema, etc.
         */
        getNameType: function (
            series: SMAIndicator,
            type: string
        ): Record<string, string> {
            let options = series.options,
                seriesTypes = H.seriesTypes,
                // add mode
                seriesName = seriesTypes[type] &&
                    (seriesTypes[type].prototype as any).nameBase || type.toUpperCase(),
                seriesType = type;

            // edit
            if (options && options.type) {
                seriesType = series.options.type as any;
                seriesName = series.name;
            }

            return {
                name: seriesName,
                type: seriesType
            };
        },
        /**
         * List all series with unique ID. Its mandatory for indicators to set
         * correct linking.
         * @private
         * @param {string} type
         * Indicator type like: sma, ema, etc.
         * @param {string} optionName
         * Type of select i.e series or volume.
         * @param {Highcharts.Chart} chart
         * Chart
         * @param {Highcharts.HTMLDOMElement} parentDiv
         * Element where created HTML list is added
         * @param {string} selectedOption
         *         optional param for default value in dropdown
         */
        listAllSeries: function (
            this: Highcharts.Popup,
            type: string,
            optionName: string,
            chart: Highcharts.AnnotationChart,
            parentDiv: HTMLDOMElement,
            selectedOption: string
        ): void {
            let selectName = PREFIX + optionName + '-type-' + type,
                lang = this.lang,
                selectBox: HTMLSelectElement,
                seriesOptions;

            if (!chart) {
                return;
            }

            createElement(
                LABEL, {
                    htmlFor: selectName
                },
                null as any,
                parentDiv
            ).appendChild(doc.createTextNode(
                lang[optionName] || optionName
            ));

            // select type
            selectBox = createElement(
                SELECT,
                {
                    name: selectName,
                    className: PREFIX + 'popup-field'
                },
                null as any,
                parentDiv
            ) as any;

            selectBox.setAttribute('id', PREFIX + 'select-' + optionName);

            // list all series which have id - mandatory for creating indicator
            chart.series.forEach(function (serie): void {

                seriesOptions = serie.options;

                if (
                    !(seriesOptions as any).params &&
                    seriesOptions.id &&
                    seriesOptions.id !== PREFIX + 'navigator-series'
                ) {
                    createElement(
                        OPTION,
                        {
                            value: seriesOptions.id
                        },
                        null as any,
                        selectBox
                    ).appendChild(doc.createTextNode(
                        seriesOptions.name || seriesOptions.id
                    ));
                }
            });

            if (defined(selectedOption)) {
                selectBox.value = selectedOption;
            }
        },
        /**
         * Create typical inputs for chosen indicator. Fields are extracted from
         * defaultOptions (ADD mode) or current indicator (ADD mode). Two extra
         * fields are added:
         * - hidden input - contains indicator type (required for callback)
         * - select - list of series which can be linked with indicator
         * @private
         * @param {Highcharts.Chart} chart
         * Chart
         * @param {Highcharts.Series} series
         * Indicator
         * @param {string} seriesType
         * Indicator type like: sma, ema, etc.
         * @param {Highcharts.HTMLDOMElement} rhsColWrapper
         * Element where created HTML list is added
         */
        addFormFields: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            series: SMAIndicator,
            seriesType: string,
            rhsColWrapper: HTMLDOMElement
        ): void {
            const fields = (series as any).params || series.options.params,
                getNameType = this.indicators.getNameType;

            // reset current content
            rhsColWrapper.innerHTML = '';

            // create title (indicator name in the right column)
            createElement(
                H3,
                {
                    className: PREFIX + 'indicator-title'
                },
                void 0,
                rhsColWrapper
            ).appendChild(
                doc.createTextNode(getNameType(series, seriesType).name)
            );

            // input type
            createElement(
                INPUT,
                {
                    type: 'hidden',
                    name: PREFIX + 'type-' + seriesType,
                    value: seriesType
                },
                null as any,
                rhsColWrapper
            );

            // list all series with id
            this.indicators.listAllSeries.call(
                this,
                seriesType,
                'series',
                chart,
                rhsColWrapper,
                series.linkedParent && fields.volumeSeriesID
            );

            if (fields.volumeSeriesID) {
                this.indicators.listAllSeries.call(
                    this,
                    seriesType,
                    'volume',
                    chart,
                    rhsColWrapper,
                    series.linkedParent && series.linkedParent.options.id as any
                );
            }

            // add param fields
            this.indicators.addParamInputs.call(
                this,
                chart,
                'params',
                fields,
                seriesType,
                rhsColWrapper
            );
        },
        /**
         * Recurent function which lists all fields, from params object and
         * create them as inputs. Each input has unique `data-name` attribute,
         * which keeps chain of fields i.e params.styles.fontSize.
         * @private
         * @param {Highcharts.Chart} chart
         * Chart
         * @param {string} parentNode
         * Name of parent to create chain of names
         * @param {Highcharts.PopupFieldsDictionary<string>} fields
         * Params which are based for input create
         * @param {string} type
         * Indicator type like: sma, ema, etc.
         * @param {Highcharts.HTMLDOMElement} parentDiv
         * Element where created HTML list is added
         */
        addParamInputs: function (
            this: Highcharts.Popup,
            chart: Highcharts.AnnotationChart,
            parentNode: string,
            fields: Highcharts.PopupFieldsDictionary<string>,
            type: string,
            parentDiv: HTMLDOMElement
        ): void {
            let _self = this,
                addParamInputs = this.indicators.addParamInputs,
                addInput = this.addInput,
                parentFullName;

            if (!chart) {
                return;
            }

            objectEach(fields, function (value, fieldName): void {
                // create name like params.styles.fontSize
                parentFullName = parentNode + '.' + fieldName;

                if (value !== void 0) { // skip if field is unnecessary, #15362
                    if (isObject(value)) {
                        addInput.call( // (15733) 'Periods' has an arrayed value. Label must be created here.
                            _self,
                            parentFullName,
                            type,
                            parentDiv,
                            '' as any
                        );
                        addParamInputs.call(
                            _self,
                            chart,
                            parentFullName,
                            value as any,
                            type,
                            parentDiv
                        );
                    } else if (
                        // skip volume field which is created by addFormFields
                        parentFullName !== 'params.volumeSeriesID'
                    ) {
                        addInput.call(
                            _self,
                            parentFullName,
                            type,
                            parentDiv,
                            {
                                value: value,
                                type: 'text'
                            } // all inputs are text type
                        );
                    }
                }
            });
        },
        /**
         * Get amount of indicators added to chart.
         * @private
         * @return {number} - Amount of indicators
         */
        getAmount: function (this: Chart): number {
            let series = this.series,
                counter = 0;

            series.forEach(function (serie): void {
                const seriesOptions = serie.options;

                if (
                    (serie as any).params ||
                    seriesOptions && (seriesOptions as any).params
                ) {
                    counter++;
                }
            });

            return counter;
        }
    },
    tabs: {
        /**
         * Init tabs. Create tab menu items, tabs containers
         * @private
         * @param {Highcharts.Chart} chart
         * Reference to current chart
         */
        init: function (this: Highcharts.Popup, chart: Highcharts.AnnotationChart): void {
            let tabs = this.tabs,
                indicatorsCount = this.indicators.getAmount.call(chart),
                firstTab; // run by default

            if (!chart) {
                return;
            }

            // create menu items
            firstTab = tabs.addMenuItem.call(this, 'add');
            tabs.addMenuItem.call(this, 'edit', indicatorsCount);

            // create tabs containers
            (tabs.addContentItem as any).call(this, 'add');
            (tabs.addContentItem as any).call(this, 'edit');

            tabs.switchTabs.call(this, indicatorsCount);

            // activate first tab
            tabs.selectTab.call(this, firstTab, 0);
        },
        /**
         * Create tab menu item
         * @private
         * @param {string} tabName
         * `add` or `edit`
         * @param {number} [disableTab]
         * Disable tab when 0
         * @return {Highcharts.HTMLDOMElement}
         * Created HTML tab-menu element
         */
        addMenuItem: function (
            this: Highcharts.Popup,
            tabName: string,
            disableTab?: number
        ): HTMLDOMElement {
            let popupDiv = this.popup.container,
                className = PREFIX + 'tab-item',
                lang = this.lang,
                menuItem;

            if (disableTab === 0) {
                className += ' ' + PREFIX + 'tab-disabled';
            }

            // tab 1
            menuItem = createElement(
                SPAN,
                {
                    className
                },
                void 0,
                popupDiv
            );
            menuItem.appendChild(
                doc.createTextNode(lang[tabName + 'Button'] || tabName)
            );

            menuItem.setAttribute(PREFIX + 'data-tab-type', tabName);

            return menuItem;
        },
        /**
         * Create tab content
         * @private
         * @return {HTMLDOMElement} - created HTML tab-content element
         */
        addContentItem: function (this: Highcharts.Popup): HTMLDOMElement {
            const popupDiv = this.popup.container;

            return createElement(
                DIV,
                {
                    className: PREFIX + 'tab-item-content ' + PREFIX + 'no-mousewheel'// #12100
                },
                null as any,
                popupDiv
            );
        },
        /**
         * Add click event to each tab
         * @private
         * @param {number} disableTab
         * Disable tab when 0
         */
        switchTabs: function (this: Highcharts.Popup, disableTab: number): void {
            let _self = this,
                popupDiv = this.popup.container,
                tabs = popupDiv.querySelectorAll('.' + PREFIX + 'tab-item'),
                dataParam;

            tabs.forEach(function (tab: Element, i: number): void {

                dataParam = tab.getAttribute(PREFIX + 'data-tab-type');

                if (dataParam === 'edit' && disableTab === 0) {
                    return;
                }

                ['click', 'touchstart'].forEach(function (eventName: string): void {
                    addEvent(tab, eventName, function (): void {

                        // reset class on other elements
                        _self.tabs.deselectAll.call(_self);
                        _self.tabs.selectTab.call(_self, this, i);
                    });
                });
            });
        },
        /**
         * Set tab as visible
         * @private
         * @param {globals.Element} - current tab
         * @param {number} - Index of tab in menu
         */
        selectTab: function (this: Highcharts.Popup, tab: Element, index: number): void {
            const allTabs = this.popup.container
                .querySelectorAll('.' + PREFIX + 'tab-item-content');

            tab.className += ' ' + PREFIX + 'tab-item-active';
            allTabs[index].className += ' ' + PREFIX + 'tab-item-show';
        },
        /**
         * Set all tabs as invisible.
         * @private
         */
        deselectAll: function (this: Highcharts.Popup): void {
            let popupDiv = this.popup.container,
                tabs = popupDiv
                    .querySelectorAll('.' + PREFIX + 'tab-item'),
                tabsContent = popupDiv
                    .querySelectorAll('.' + PREFIX + 'tab-item-content'),
                i;

            for (i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove(PREFIX + 'tab-item-active');
                tabsContent[i].classList.remove(PREFIX + 'tab-item-show');
            }
        }
    }
} as any;

addEvent(NavigationBindings, 'showPopup', function (
    this: NavigationBindings,
    config: Highcharts.PopupConfigObject
): void {
    if (!this.popup) {
        // Add popup to main container
        this.popup = new H.Popup(
            this.chart.container, (
                this.chart.options.navigation.iconsURL ||
                (
                    this.chart.options.stockTools &&
                    this.chart.options.stockTools.gui.iconsURL
                ) ||
                'https://code.highcharts.com/@product.version@/gfx/stock-icons/'
            ), this.chart
        );
    }

    this.popup.showForm(
        config.formType,
        this.chart,
        config.options,
        config.onSubmit
    );
});

addEvent(NavigationBindings, 'closePopup', function (this: NavigationBindings): void {
    if (this.popup) {
        this.popup.closePopup();
    }
});

export default H.Popup;
