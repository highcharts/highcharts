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
    isObject = H.isObject,
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

H.Popup = function (parentDiv) {
    return this.init(parentDiv);
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
        var popup;

        // create popup div
        popup = createElement(DIV, {
            className: PREFIX + 'popup'
        }, null, parentDiv);

        // add close button
        this.addCloseBtn.call(this, popup);

        return popup;
    },
    /*
     * Create HTML element and attach click event (close popup).
     *
     * @param {HTMLDOMElement} - popup's div
     *
     */
    addCloseBtn: function (popup) {
        var _self = this,
            closeBtn;

        // create close popup btn
        closeBtn = createElement(DIV, {
            className: PREFIX + 'popup-close'
        }, null, popup);

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
    addInput: function (optionName, type, parentDiv, defaultValue) {
        var fieldName = optionName.split('.'),
            paramName = fieldName[fieldName.length - 1],
            inputName = PREFIX + type + '-' + paramName;

        // add label
        createElement(
            LABEL, {
                innerHTML: paramName,
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
                value: defaultValue
            },
            null,
            parentDiv
        ).setAttribute(PREFIX + 'data-name', optionName);
    },
    /*
     * Create button.
     *
     * @param {HTMLDOMElement} - container where elements should be added
     * @param {String} - text placed as button label
     * @param {String} - add | edit | remove
     * @param {Function} - on click callback
     * @param {Object} - params / arguments of callback
     *
     * @return {HTMLDOMElement} - html button
     */
    addButton: function (parentDiv, label, type, callback, callbackParams) {
        var _self = this,
            closePopup = this.closePopup,
            button;

        button = createElement(BUTTON, {
            innerHTML: label
        }, null, parentDiv);

        addEvent(button, 'click', function () {
            closePopup.call(_self);

            return callback(callbackParams);
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
            seriesId = parentDiv.querySelectorAll('select > option:checked')[0],
            param,
            fieldsOutput;

        fieldsOutput = {
            actionType: type,
            seriesId: seriesId && seriesId.getAttribute('data-series-id'),
            linkedTo: seriesId && seriesId.getAttribute('value'),
            fields: { }
        };

        each(inputList, function (input) {
            param = input.getAttribute(PREFIX + 'data-name');

            // params
            if (param) {
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
        var popupDiv = this.popupDiv,
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
        var popupDiv = this.popupDiv;

        popupDiv.style.display = 'none';
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

        this.popupDiv = chart.stockToolbar.popup;

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
            this.flags.addForm.call(this, chart, options, callback);
        }

        // flags form
        if (type === 'flag-toolbar') {
            this.flags.addToolbar.call(this, chart, options, callback);
        }
    },
    flags: {
        /*
         * Create annotation simple form.
         * It contains two buttons (edit / remove).
         *
         * @param {Chart} - chart
         * @param {Object} - options
         * @param {Function} - on click callback
         *
         */
        addForm: function (chart, options, callback) {
            var popupDiv = this.popupDiv,
                getFields = this.getFields,
                bottomRow,
                lhsCol;

             // left column
            lhsCol = createElement(DIV, {
                className: PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full'
            }, null, popupDiv);

            bottomRow = createElement(DIV, {
                className: PREFIX + 'popup-bottom-row'
            }, null, popupDiv);

            this.flags.addFormFields.call(this, lhsCol, chart, options);

            this.addButton.call(
                this,
                bottomRow,
                'add',
                'add',
                callback,
                getFields(popupDiv, 'add')
            );
        },
        /*
         * Create annotation's form fields.
         *
         * @param {HTMLDOMElement} - div where inputs are placed
         * @param {Chart} - chart
         * @param {Object} - options
         *
         */
        addFormFields: function (parentDiv, chart, options) {
            var _self = this,
                shapeOptions = options,
                lang = chart.stockToolbar.lang;

            objectEach(shapeOptions, function (option, value) {
                _self.addInput(
                    lang[value] || value,
                    'flag',
                    parentDiv,
                    option
                );
            });
        },
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
                popupDiv = this.popupDiv,
                getFields = this.getFields,
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
                getFields(popupDiv, 'remove')
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
                }
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
         *
         */
        addForm: function (chart, options, callback) {
            var popupDiv = this.popupDiv,
                getFields = this.getFields,
                bottomRow,
                lhsCol;

             // left column
            lhsCol = createElement(DIV, {
                className: PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full'
            }, null, popupDiv);

            bottomRow = createElement(DIV, {
                className: PREFIX + 'popup-bottom-row'
            }, null, popupDiv);

            this.annotations.addFormFields.call(this, lhsCol, chart, options);

            this.addButton.call(
                this,
                bottomRow,
                'update',
                'update',
                callback,
                getFields(popupDiv, 'edit')
            );
        },
        /*
         * Create annotation's form fields.
         *
         * @param {HTMLDOMElement} - div where inputs are placed
         * @param {Chart} - chart
         * @param {Object} - options
         *
         */
        addFormFields: function (parentDiv, chart, options) {
            var _self = this,
                shapeOptions = options.shapeOptions,
                lang = chart.stockToolbar.lang;

            objectEach(shapeOptions, function (option, value) {
                _self.addInput(
                    lang[value],
                    'annotation',
                    parentDiv,
                    option
                );
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
                getFields = this.getFields,
                indicators = this.indicators,
                buttonParentDiv;

            // add tabs
            this.tabs.init.call(this, chart);

            // get all tabs content divs
            tabsContainers = this.popupDiv
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
                getFields(buttonParentDiv, 'add')
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
                getFields(buttonParentDiv, 'update')
            );
            this.addButton.call(
                this,
                buttonParentDiv,
                'remove',
                'remove',
                callback,
                getFields(buttonParentDiv, 'remove')
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
                indicatorList,
                item;

            // create wrapper for list
            indicatorList = createElement(UL, {
                className: PREFIX + 'indicator-list'
            }, null, lhsCol);

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
                            rhsCol
                        );
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
                    name: PREFIX + 'type-' + type
                },
                null,
                parentDiv
            );

            // list all series which have id - mandatory for creating indicator
            each(chart.series, function (serie) {

                seriesOptions = serie.options;

                if (
                    seriesOptions.id &&
                    seriesOptions.id !== PREFIX + 'navigator-series'
                    ) {
                    var optionSelect = createElement(
                        OPTION,
                        {
                            innerHTML: seriesOptions.name || seriesOptions.id,
                            value: seriesOptions.id
                        },
                        null,
                        selectBox
                    );

                    optionSelect.setAttribute(
                        'data-series-id',
                        seriesOptions.id
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
        addFormFields: function (chart, series, seriesType, parentDiv) {
            var fields = series.params || series.options.params,
                rhsColWrapper;

            rhsColWrapper = parentDiv
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col-wrapper')[0];

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
         * @param {Chart} - name of parent to create chain of names
         * @param {Series} - fields - params which are based for input create
         * @param {String} - indicator type like: sma, ema, etc.
         * @param {HTMLDOMElement} - element where created HTML list is added
         *
         */
        addParamInputs: function (parentNodeName, fields, type, parentDiv) {
            var _self = this,
                addParamInputs = this.indicators.addParamInputs,
                addInput = this.addInput,
                parentFullName;

            objectEach(fields, function (value, fieldName) {
                // create name like params.styles.fontSize
                parentFullName = parentNodeName + '.' + fieldName;

                if (isObject(value)) {
                    addParamInputs.call(
                        _self,
                        parentFullName,
                        value,
                        type,
                        parentDiv
                    );
                } else {
                    addInput(parentFullName, type, parentDiv, value);
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
            var popupDiv = this.popupDiv,
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
            var popupDiv = this.popupDiv;

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
                popupDiv = this.popupDiv,
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
            var allTabs = this.popupDiv
                        .querySelectorAll('.' + PREFIX + 'tab-item-content');

            tab.className += ' ' + PREFIX + 'tab-item-active';
            allTabs[index].className += ' ' + PREFIX + 'tab-item-show';
        },
        /*
         * Set all tabs as invisible.
         *
         */
        deselectAll: function () {
            var popupDiv = this.popupDiv,
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
