/**
 * Popup generator for Stock tools
 *
 * (c) 2009-2017 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    createElement = H.createElement,
    each = H.each,
    objectEach = H.objectEach,
    pick = H.pick,
    wrap = H.wrap,
    isString = H.isString,
    isObject = H.isObject,
    isArray = H.isArray,
    PREFIX = 'highcharts-',
    DIV = 'div',
    INPUT = 'input',
    LABEL = 'label',
    BUTTON = 'button',
    SELECT = 'select',
    OPTION = 'option',
    SPAN = 'span',
    UL = 'ul',
    LI = 'li';

// onContainerMouseDown blocks internal popup events, due to e.preventDefault.
// Related issue #4606

wrap(H.Pointer.prototype, 'onContainerMouseDown', function (proceed, e) {

    var popupClass = e.target.className;

    // elements is not in popup
    if (!(isString(popupClass) &&
        popupClass.indexOf(PREFIX + 'popup-field') >= 0)
    ) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

H.Popup = function (parentDiv) {
    this.init(parentDiv);
};

H.Popup.prototype = {
    /*
     * Initialize the popup. Create base div and add close button.
     *
     * @param {HTMLDOMElement} - container where popup should be placed
     *
     * @return {HTMLDOMElement} - return created popup's div
     *
     */
    init: function (parentDiv) {

        // create popup div
        this.container = createElement(DIV, {
            className: PREFIX + 'popup'
        }, null, parentDiv);

        // add close button
        this.addCloseBtn.call(this);
    },
    /*
     * Create HTML element and attach click event (close popup).
     *
     */
    addCloseBtn: function () {
        var _self = this,
            closeBtn;

        // create close popup btn
        closeBtn = createElement(DIV, {
            className: PREFIX + 'popup-close'
        }, null, this.container);

        addEvent(closeBtn, 'click', function () {
            _self.closePopup.call(_self);
        });
    },
    /*
     * Create two columns (divs) in HTML.
     *
     * @param {HTMLDOMElement} - container of columns
     *
     * @return {Object} - reference to two HTML columns
     *
     */
    addColsContainer: function (container) {
        var rhsCol,
            lhsCol;

        // left column
        lhsCol = createElement(DIV, {
            className: PREFIX + 'popup-lhs-col'
        }, null, container);

        // right column
        rhsCol = createElement(DIV, {
            className: PREFIX + 'popup-rhs-col'
        }, null, container);

        // wrapper content
        createElement(DIV, {
            className: PREFIX + 'popup-rhs-col-wrapper'
        }, null, rhsCol);

        return {
            lhsCol: lhsCol,
            rhsCol: rhsCol
        };
    },
    /*
     * Create input with label.
     *
     * @param {String} - chain of fields i.e params.styles.fontSize
     * @param {String} - indicator type
     * @param {HTMLDOMElement} - container where elements should be added
     * @param {String} - dafault value of input i.e period value is 14,
     * extracted from defaultOptions (ADD mode) or series options (EDIT mode)
     *
     */
    addInput: function (option, type, parentDiv, value) {
        var optionParamList = option.split('.'),
            optionName = optionParamList[optionParamList.length - 1],
            lang = this.lang,
            inputName = PREFIX + type + '-' + optionName;

        // add label
        createElement(
            LABEL, {
                innerHTML: lang[optionName] || optionName,
                htmlFor: inputName
            },
            null,
            parentDiv
        );

        // add input
        createElement(
            INPUT,
            {
                name: inputName,
                value: value[0],
                type: value[1],
                className: PREFIX + 'popup-field'
            },
            null,
            parentDiv
        ).setAttribute(PREFIX + 'data-name', option);
    },
    /*
     * Create button.
     *
     * @param {HTMLDOMElement} - container where elements should be added
     * @param {String} - text placed as button label
     * @param {String} - add | edit | remove
     * @param {Function} - on click callback
     * @param {HTMLDOMElement} - container where inputs are generated
     *
     * @return {HTMLDOMElement} - html button
     */
    addButton: function (parentDiv, label, type, callback, fieldsDiv) {
        var _self = this,
            closePopup = this.closePopup,
            getFields = this.getFields,
            button;

        button = createElement(BUTTON, {
            innerHTML: label
        }, null, parentDiv);

        addEvent(button, 'click', function () {
            closePopup.call(_self);

            return callback(
                getFields(fieldsDiv, type)
            );
        });

        return button;
    },
    /*
     * Get values from all inputs and create JSON.
     *
     * @param {HTMLDOMElement} - container where inputs are created
     * @param {String} - add | edit | remove
     *
     * @return {Object} - fields
     */
    getFields: function (parentDiv, type) {

        var inputList = parentDiv.querySelectorAll('input'),
            linkedTo = parentDiv.querySelectorAll('select > option:checked')[0],
            seriesId,
            param,
            fieldsOutput;

        fieldsOutput = {
            actionType: type,
            linkedTo: linkedTo && linkedTo.getAttribute('value'),
            fields: { }
        };

        each(inputList, function (input) {
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

        return fieldsOutput;
    },
    /*
     * Reset content of the current popup and show.
     *
     * @param {Chart} - chart
     * @param {Function} - on click callback
     *
     * @return {Object} - fields
     */
    showPopup: function () {

        var popupDiv = this.popup.container,
            toolbarClass = PREFIX + 'annotation-toolbar',
            popupCloseBtn = popupDiv
                            .querySelectorAll('.' + PREFIX + 'popup-close')[0];

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
    },
    /*
     * Hide popup.
     *
     */
    closePopup: function () {
        this.popup.container.style.display = 'none';
    },
    /*
     * Create content and show popup.
     *
     * @param {String} - type of popup i.e indicators
     * @param {Chart} - chart
     * @param {Object} - options
     * @param {Function} - on click callback
     *
     */
    showForm: function (type, chart, options, callback) {

        this.popup = chart.stockToolbar.popup;

        // show blank popup
        this.showPopup.call(this);

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
    },
    annotations: {
        /*
         * Create annotation simple form. It contains two buttons
         * (edit / remove) and text label.
         *
         * @param {Chart} - chart
         * @param {Object} - options
         * @param {Function} - on click callback
         *
         */
        addToolbar: function (chart, options, callback) {
            var _self = this,
                popupDiv = this.popup.container,
                showForm = this.showForm,
                toolbarClass = PREFIX + 'annotation-toolbar',
                button;

            // set small size
            if (popupDiv.className.indexOf(toolbarClass) === -1) {
                popupDiv.className += ' ' + toolbarClass;
            }

            // set position
            popupDiv.style.top = chart.plotTop + 10 + 'px';

            // create label
            createElement(SPAN, {
                innerHTML: pick(
                    // Advanced annotations:
                    options.type,
                    // Basic shapes:
                    options.shapes && options.shapes[0].type
                )
            }, null, popupDiv);

            // add buttons
            button = this.addButton.call(
                this,
                popupDiv,
                'remove',
                'remove',
                callback,
                popupDiv
            );

            button.className += ' ' + PREFIX + 'annotation-remove-button';

            button = this.addButton.call(
                this,
                popupDiv,
                'edit',
                'edit',
                function () {
                    showForm.call(
                        _self,
                        'annotation-edit',
                        chart,
                        options,
                        callback
                    );
                },
                popupDiv
            );

            button.className += ' ' + PREFIX + 'annotation-edit-button';
        },
        /*
         * Create annotation simple form.
         * It contains two buttons (edit / remove).
         *
         * @param {Chart} - chart
         * @param {Object} - options
         * @param {Function} - on click callback
         * @param {Boolean} - if it is a form declared for init annotation
         *
         */
        addForm: function (chart, options, callback, isInit) {
            var popupDiv = this.popup.container,
                bottomRow,
                lhsCol;

             // left column
            lhsCol = createElement(DIV, {
                className: PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full'
            }, null, popupDiv);

            bottomRow = createElement(DIV, {
                className: PREFIX + 'popup-bottom-row'
            }, null, popupDiv);

            this.annotations.addFormFields.call(
                this,
                lhsCol,
                chart,
                'params',
                options
            );

            this.addButton.call(
                this,
                bottomRow,
                isInit ? 'add' : 'edit',
                isInit ? 'add' : 'edit',
                callback,
                popupDiv
            );
        },
        /*
         * Create annotation's form fields.
         *
         * @param {HTMLDOMElement} - div where inputs are placed
         * @param {Chart} - chart
         * @param {String} - name of parent to create chain of names
         * @param {Object} - options
         *
         */
        addFormFields: function (parentDiv, chart, parentNode, options) {
            var _self = this,
                addFormFields = this.annotations.addFormFields,
                addInput = this.addInput,
                lang = chart.stockToolbar.lang,
                parentFullName;

            objectEach(options, function (value, option) {

                // create name like params.styles.fontSize
                parentFullName = parentNode + '.' + option;

                if (isObject(value)) {
                    if (
                        // value is object of options
                        !isArray(value) ||
                        // array of objects with params. i.e labels in Fibonacci
                        (isArray(value) && isObject(value[0]))
                    ) {

                        createElement(SPAN, {
                            className: PREFIX + 'annotation-title',
                            innerHTML: lang[option] || option
                        }, null, parentDiv);

                        addFormFields.call(
                            _self,
                            parentDiv,
                            chart,
                            parentFullName,
                            value
                        );
                    } else {
                        addInput.call(
                            chart.stockToolbar,
                            parentFullName,
                            'annotation',
                            parentDiv,
                            value
                        );
                    }
                }
            });
        }
    },
    indicators: {
        /*
         * Create indicator's form. It contains two tabs (ADD and EDIT) with
         * content.
         *
         * @param {Chart} - chart
         * @param {Object} - options
         * @param {Function} - on click callback
         *
         */
        addForm: function (chart, options, callback) {

            var tabsContainers,
                indicators = this.indicators,
                buttonParentDiv;

            // add tabs
            this.tabs.init.call(this, chart);

            // get all tabs content divs
            tabsContainers = this.popup.container
                        .querySelectorAll('.' + PREFIX + 'tab-item-content');

            // ADD tab
            this.addColsContainer(tabsContainers[0]);
            indicators.addIndicatorList.call(
                this,
                chart,
                tabsContainers[0],
                'add'
            );

            buttonParentDiv = tabsContainers[0]
                        .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];

            this.addButton.call(
                this,
                buttonParentDiv,
                'add',
                'add',
                callback,
                buttonParentDiv
            );

            // EDIT tab
            this.addColsContainer(tabsContainers[1]);
            indicators.addIndicatorList.call(
                this,
                chart,
                tabsContainers[1],
                'edit'
            );

            buttonParentDiv = tabsContainers[1]
                        .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];

            this.addButton.call(
                this,
                buttonParentDiv,
                'update',
                'edit',
                callback,
                buttonParentDiv
            );
            this.addButton.call(
                this,
                buttonParentDiv,
                'remove',
                'remove',
                callback,
                buttonParentDiv
            );
        },
        /*
         * Create HTML list of all indicators (ADD mode) or added indicators
         * (EDIT mode).
         *
         * @param {Chart} - chart
         * @param {HTMLDOMElement} - container where list is added
         * @param {String} - 'edit' or 'add' mode
         *
         */
        addIndicatorList: function (chart, parentDiv, listType) {
            var _self = this,
                lhsCol = parentDiv
                        .querySelectorAll('.' + PREFIX + 'popup-lhs-col')[0],
                rhsCol = parentDiv
                        .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0],
                defaultOptions = H.getOptions(),
                isEdit = listType === 'edit',
                series = isEdit ? chart.series : // EDIT mode
                                defaultOptions.plotOptions, // ADD mode
                addFormFields = this.indicators.addFormFields,
                rhsColWrapper,
                indicatorList,
                item;

            // create wrapper for list
            indicatorList = createElement(UL, {
                className: PREFIX + 'indicator-list'
            }, null, lhsCol);

            rhsColWrapper = rhsCol
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col-wrapper')[0];

            objectEach(series, function (serie, value) {
                var seriesOptions = serie.options;

                if (
                    serie.params ||
                    seriesOptions && seriesOptions.params
                    ) {

                    var indicatorNameType = _self.indicators
                                                    .getNameType(serie, value);

                    item = createElement(LI, {
                        className: PREFIX + 'indicator-list',
                        innerHTML: indicatorNameType.name
                    }, null, indicatorList);

                    addEvent(item, 'click', function () {

                        addFormFields.call(
                            _self,
                            chart,
                            isEdit ? serie : series[indicatorNameType.type],
                            indicatorNameType.type,
                            rhsColWrapper
                        );

                        // add hidden input with series.id
                        if (isEdit && serie.options) {
                            createElement(INPUT, {
                                type: 'hidden',
                                name: PREFIX + 'id-' + indicatorNameType.type,
                                value: serie.options.id
                            }, null, rhsColWrapper)
                            .setAttribute(
                                PREFIX + 'data-series-id',
                                serie.options.id
                            );
                        }
                    });
                }
            });

            // select first item from the list
            if (indicatorList.childNodes.length > 0) {
                indicatorList.childNodes[0].click();
            }
        },
        /*
         * Extract full name and type of requested indicator.
         *
         * @param {Series} - series which name is needed.
         * (EDIT mode - defaultOptions.series, ADD mode - indicator series).
         * @param {String} - indicator type like: sma, ema, etc.
         *
         * @return {Object} - series name and type like: sma, ema, etc.
         *
         */
        getNameType: function (series, type) {
            var options = series.options,
                seriesTypes = H.seriesTypes,
                // add mode
                seriesName = seriesTypes[type] &&
                    seriesTypes[type].prototype.nameBase || type.toUpperCase(),
                seriesType = type;

            // edit
            if (options && options.type) {
                seriesType = series.options.type;
                seriesName = series.name;
            }

            return {
                name: seriesName,
                type: seriesType
            };
        },
        /*
         * List all series with unique ID. Its mandatory for indicators to set
         * correct linking.
         *
         * @param {String} - indicator type like: sma, ema, etc.
         * @param {Chart} - chart
         * @param {HTMLDOMElement} - element where created HTML list is added
         *
         */
        listAllSeries: function (type, chart, parentDiv) {
            var selectBox,
                seriesOptions;

            // input type
            selectBox = createElement(
                SELECT,
                {
                    name: PREFIX + 'type-' + type,
                    className: PREFIX + 'popup-field'
                },
                null,
                parentDiv
            );

            // list all series which have id - mandatory for creating indicator
            each(chart.series, function (serie) {

                seriesOptions = serie.options;

                if (
                    !seriesOptions.params &&
                    seriesOptions.id &&
                    seriesOptions.id !== PREFIX + 'navigator-series'
                    ) {
                    createElement(
                        OPTION,
                        {
                            innerHTML: seriesOptions.name || seriesOptions.id,
                            value: seriesOptions.id
                        },
                        null,
                        selectBox
                    );
                }
            });
        },
        /*
         * Create typical inputs for chosen indicator. Fields are extracted from
         * defaultOptions (ADD mode) or current indicator (ADD mode). Two extra
         * fields are added:
         * - hidden input - contains indicator type (required for callback)
         * - select - list of series which can be linked with indicator
         *
         * @param {Chart} - chart
         * @param {Series} - indicator
         * @param {String} - indicator type like: sma, ema, etc.
         * @param {HTMLDOMElement} - element where created HTML list is added
         *
         */
        addFormFields: function (chart, series, seriesType, rhsColWrapper) {
            var fields = series.params || series.options.params;

            // reset current content
            rhsColWrapper.innerHTML = '';

            // input type
            createElement(
                INPUT,
                {
                    type: 'hidden',
                    name: PREFIX + 'type-' + seriesType,
                    value: seriesType
                },
                null,
                rhsColWrapper
            );

            // list all series with id
            this.indicators.listAllSeries(seriesType, chart, rhsColWrapper);

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
        /*
         * Recurent function which lists all fields, from params object and
         * create them as inputs. Each input has unique `data-name` attribute,
         * which keeps chain of fields i.e params.styles.fontSize.
         *
         * @param {Chart} - chart
         * @param {String} - name of parent to create chain of names
         * @param {Series} - fields - params which are based for input create
         * @param {String} - indicator type like: sma, ema, etc.
         * @param {HTMLDOMElement} - element where created HTML list is added
         *
         */
        addParamInputs: function (chart, parentNode, fields, type, parentDiv) {
            var _self = this,
                addParamInputs = this.indicators.addParamInputs,
                addInput = this.addInput,
                parentFullName;

            objectEach(fields, function (value, fieldName) {
                // create name like params.styles.fontSize
                parentFullName = parentNode + '.' + fieldName;

                if (isObject(value)) {
                    addParamInputs.call(
                        _self,
                        chart,
                        parentFullName,
                        value,
                        type,
                        parentDiv
                    );
                } else {
                    addInput.call(
                        chart.stockToolbar,
                        parentFullName,
                        type,
                        parentDiv,
                        [value, 'text'] // all inputs are text type
                    );
                }
            });
        },
        /*
         * Get amount of indicators added to chart.
         *
         * @return {Number} - Amount of indicators
         */
        getAmount: function () {
            var series = this.series,
                counter = 0;

            objectEach(series, function (serie) {
                var seriesOptions = serie.options;

                if (
                    serie.params ||
                    seriesOptions && seriesOptions.params
                    ) {
                    counter++;
                }
            });

            return counter;
        }
    },
    tabs: {
        /*
         * Init tabs. Create tab menu items, tabs containers
         *
         * @param {Chart} - reference to current chart
         *
         */
        init: function (chart) {
            var tabs = this.tabs,
                indicatorsCount = this.indicators.getAmount.call(chart),
                firstTab; // run by default

            // create menu items
            firstTab = tabs.addMenuItem.call(this, 'add');
            tabs.addMenuItem.call(this, 'edit', indicatorsCount);

            // create tabs containers
            tabs.addContentItem.call(this, 'add');
            tabs.addContentItem.call(this, 'edit');

            tabs.switchTabs.call(this, indicatorsCount);

            // activate first tab
            tabs.selectTab.call(this, firstTab, 0);
        },
        /*
         * Create tab menu item
         *
         * @param {String} - `add` or `edit`
         * @param {Number} - Disable tab when 0
         *
         * @return {HTMLDOMElement} - created HTML tab-menu element
         */
        addMenuItem: function (tabName, disableTab) {
            var popupDiv = this.popup.container,
                className = PREFIX + 'tab-item',
                menuItem;

            if (disableTab === 0) {
                className += ' ' + PREFIX + 'tab-disabled';
            }

            // tab 1
            menuItem = createElement(
                SPAN,
                {
                    innerHTML: tabName,
                    className: className
                },
                null,
                popupDiv
            );

            menuItem.setAttribute(PREFIX + 'data-tab-type', tabName);

            return menuItem;
        },
        /*
         * Create tab content
         *
         * @return {HTMLDOMElement} - created HTML tab-content element
         *
         */
        addContentItem: function () {
            var popupDiv = this.popup.container;

            return createElement(
                DIV,
                {
                    className: PREFIX + 'tab-item-content'
                },
                null,
                popupDiv
            );
        },
        /*
         * Add click event to each tab
         *
         * @param {Number} - Disable tab when 0
         *
         */
        switchTabs: function (disableTab) {
            var _self = this,
                popupDiv = this.popup.container,
                tabs = popupDiv.querySelectorAll('.' + PREFIX + 'tab-item'),
                dataParam;

            each(tabs, function (tab, i) {

                dataParam = tab.getAttribute(PREFIX + 'data-tab-type');

                if (dataParam === 'edit' && disableTab === 0) {
                    return;
                }

                addEvent(tab, 'click', function () {

                    // reset class on other elements
                    _self.tabs.deselectAll.call(_self);
                    _self.tabs.selectTab.call(_self, this, i);
                });
            });
        },
        /*
         * Set tab as visible
         *
         * @param {HTMLDOMElement} - current tab
         * @param {Number} - Index of tab in menu
         *
         */
        selectTab: function (tab, index) {
            var allTabs = this.popup.container
                        .querySelectorAll('.' + PREFIX + 'tab-item-content');

            tab.className += ' ' + PREFIX + 'tab-item-active';
            allTabs[index].className += ' ' + PREFIX + 'tab-item-show';
        },
        /*
         * Set all tabs as invisible.
         *
         */
        deselectAll: function () {
            var popupDiv = this.popup.container,
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
};
