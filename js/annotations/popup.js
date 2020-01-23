/* *
 *
 *  Popup generator for Stock tools
 *
 *  (c) 2009-2017 Sebastian Bochan
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var addEvent = U.addEvent, defined = U.defined, isArray = U.isArray, isObject = U.isObject, isString = U.isString, objectEach = U.objectEach, pick = U.pick, wrap = U.wrap;
var createElement = H.createElement, indexFilter = /\d/g, PREFIX = 'highcharts-', DIV = 'div', INPUT = 'input', LABEL = 'label', BUTTON = 'button', SELECT = 'select', OPTION = 'option', SPAN = 'span', UL = 'ul', LI = 'li', H3 = 'h3';
/* eslint-disable no-invalid-this, valid-jsdoc */
// onContainerMouseDown blocks internal popup events, due to e.preventDefault.
// Related issue #4606
wrap(H.Pointer.prototype, 'onContainerMouseDown', function (proceed, e) {
    var popupClass = e.target && e.target.className;
    // elements is not in popup
    if (!(isString(popupClass) &&
        popupClass.indexOf(PREFIX + 'popup-field') >= 0)) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});
H.Popup = function (parentDiv, iconsURL) {
    this.init(parentDiv, iconsURL);
};
H.Popup.prototype = {
    /**
     * Initialize the popup. Create base div and add close button.
     * @private
     * @param {Highcharts.HTMLDOMElement} parentDiv
     * Container where popup should be placed
     * @param {string} iconsURL
     * Icon URL
     */
    init: function (parentDiv, iconsURL) {
        // create popup div
        this.container = createElement(DIV, {
            className: PREFIX + 'popup'
        }, null, parentDiv);
        this.lang = this.getLangpack();
        this.iconsURL = iconsURL;
        // add close button
        this.addCloseBtn();
    },
    /**
     * Create HTML element and attach click event (close popup).
     * @private
     */
    addCloseBtn: function () {
        var _self = this, closeBtn;
        // create close popup btn
        closeBtn = createElement(DIV, {
            className: PREFIX + 'popup-close'
        }, null, this.container);
        closeBtn.style['background-image'] = 'url(' +
            this.iconsURL + 'close.svg)';
        ['click', 'touchstart'].forEach(function (eventName) {
            addEvent(closeBtn, eventName, function () {
                _self.closePopup();
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
    addColsContainer: function (container) {
        var rhsCol, lhsCol;
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
    addInput: function (option, type, parentDiv, value) {
        var optionParamList = option.split('.'), optionName = optionParamList[optionParamList.length - 1], lang = this.lang, inputName = PREFIX + type + '-' + optionName;
        if (!inputName.match(indexFilter)) {
            // add label
            createElement(LABEL, {
                innerHTML: lang[optionName] || optionName,
                htmlFor: inputName
            }, null, parentDiv);
        }
        // add input
        createElement(INPUT, {
            name: inputName,
            value: value[0],
            type: value[1],
            className: PREFIX + 'popup-field'
        }, null, parentDiv).setAttribute(PREFIX + 'data-name', option);
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
    addButton: function (parentDiv, label, type, callback, fieldsDiv) {
        var _self = this, closePopup = this.closePopup, getFields = this.getFields, button;
        button = createElement(BUTTON, {
            innerHTML: label
        }, null, parentDiv);
        ['click', 'touchstart'].forEach(function (eventName) {
            addEvent(button, eventName, function () {
                closePopup.call(_self);
                return callback(getFields(fieldsDiv, type));
            });
        });
        return button;
    },
    /**
     * Get values from all inputs and create JSON.
     * @private
     * @param {Highcharts.HTMLDOMElement} - container where inputs are created
     * @param {string} - add | edit | remove
     * @return {Highcharts.PopupFieldsObject} - fields
     */
    getFields: function (parentDiv, type) {
        var inputList = parentDiv.querySelectorAll('input'), optionSeries = '#' + PREFIX + 'select-series > option:checked', optionVolume = '#' + PREFIX + 'select-volume > option:checked', linkedTo = parentDiv.querySelectorAll(optionSeries)[0], volumeTo = parentDiv.querySelectorAll(optionVolume)[0], seriesId, param, fieldsOutput;
        fieldsOutput = {
            actionType: type,
            linkedTo: linkedTo && linkedTo.getAttribute('value'),
            fields: {}
        };
        [].forEach.call(inputList, function (input) {
            param = input.getAttribute(PREFIX + 'data-name');
            seriesId = input.getAttribute(PREFIX + 'data-series-id');
            // params
            if (seriesId) {
                fieldsOutput.seriesId = input.value;
            }
            else if (param) {
                fieldsOutput.fields[param] = input.value;
            }
            else {
                // type like sma / ema
                fieldsOutput.type = input.value;
            }
        });
        if (volumeTo) {
            fieldsOutput.fields['params.volumeSeriesID'] = volumeTo.getAttribute('value');
        }
        return fieldsOutput;
    },
    /**
     * Reset content of the current popup and show.
     * @private
     */
    showPopup: function () {
        var popupDiv = this.container, toolbarClass = PREFIX + 'annotation-toolbar', popupCloseBtn = popupDiv
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
    /**
     * Hide popup.
     * @private
     */
    closePopup: function () {
        this.popup.container.style.display = 'none';
    },
    /**
     * Create content and show popup.
     * @private
     * @param {string} - type of popup i.e indicators
     * @param {Highcharts.Chart} - chart
     * @param {Highcharts.AnnotationsOptions} - options
     * @param {Function} - on click callback
     */
    showForm: function (type, chart, options, callback) {
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
    },
    /**
     * Return lang definitions for popup.
     * @private
     * @return {Highcharts.Dictionary<string>} - elements translations.
     */
    getLangpack: function () {
        return H.getOptions().lang.navigation.popup;
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
        addToolbar: function (chart, options, callback) {
            var _self = this, lang = this.lang, popupDiv = this.popup.container, showForm = this.showForm, toolbarClass = PREFIX + 'annotation-toolbar', button;
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
                lang[options.langKey] || options.langKey, 
                // Basic shapes:
                options.shapes && options.shapes[0].type)
            }, null, popupDiv);
            // add buttons
            button = this.addButton(popupDiv, lang.removeButton || 'remove', 'remove', callback, popupDiv);
            button.className += ' ' + PREFIX + 'annotation-remove-button';
            button.style['background-image'] = 'url(' +
                this.iconsURL + 'destroy.svg)';
            button = this.addButton(popupDiv, lang.editButton || 'edit', 'edit', function () {
                showForm.call(_self, 'annotation-edit', chart, options, callback);
            }, popupDiv);
            button.className += ' ' + PREFIX + 'annotation-edit-button';
            button.style['background-image'] = 'url(' +
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
        addForm: function (chart, options, callback, isInit) {
            var popupDiv = this.popup.container, lang = this.lang, bottomRow, lhsCol;
            // create title of annotations
            lhsCol = createElement('h2', {
                innerHTML: lang[options.langKey] || options.langKey,
                className: PREFIX + 'popup-main-title'
            }, null, popupDiv);
            // left column
            lhsCol = createElement(DIV, {
                className: PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full'
            }, null, popupDiv);
            bottomRow = createElement(DIV, {
                className: PREFIX + 'popup-bottom-row'
            }, null, popupDiv);
            this.annotations.addFormFields.call(this, lhsCol, chart, '', options, [], true);
            this.addButton(bottomRow, isInit ?
                (lang.addButton || 'add') :
                (lang.saveButton || 'save'), isInit ? 'add' : 'save', callback, popupDiv);
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
        addFormFields: function (parentDiv, chart, parentNode, options, storage, isRoot) {
            var _self = this, addFormFields = this.annotations.addFormFields, addInput = this.addInput, lang = this.lang, parentFullName, titleName;
            objectEach(options, function (value, option) {
                // create name like params.styles.fontSize
                parentFullName = parentNode !== '' ?
                    parentNode + '.' + option : option;
                if (isObject(value)) {
                    if (
                    // value is object of options
                    !isArray(value) ||
                        // array of objects with params. i.e labels in Fibonacci
                        (isArray(value) && isObject(value[0]))) {
                        titleName = lang[option] || option;
                        if (!titleName.match(indexFilter)) {
                            storage.push([
                                true,
                                titleName,
                                parentDiv
                            ]);
                        }
                        addFormFields.call(_self, parentDiv, chart, parentFullName, value, storage, false);
                    }
                    else {
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
                storage = storage.sort(function (a) {
                    return a[1].match(/format/g) ? -1 : 1;
                });
                storage.forEach(function (genInput) {
                    if (genInput[0] === true) {
                        createElement(SPAN, {
                            className: PREFIX + 'annotation-title',
                            innerHTML: genInput[1]
                        }, null, genInput[2]);
                    }
                    else {
                        addInput.apply(genInput[0], genInput.splice(1));
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
        addForm: function (chart, _options, callback) {
            var tabsContainers, indicators = this.indicators, lang = this.lang, buttonParentDiv;
            // add tabs
            this.tabs.init.call(this, chart);
            // get all tabs content divs
            tabsContainers = this.popup.container
                .querySelectorAll('.' + PREFIX + 'tab-item-content');
            // ADD tab
            this.addColsContainer(tabsContainers[0]);
            indicators.addIndicatorList.call(this, chart, tabsContainers[0], 'add');
            buttonParentDiv = tabsContainers[0]
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];
            this.addButton(buttonParentDiv, lang.addButton || 'add', 'add', callback, buttonParentDiv);
            // EDIT tab
            this.addColsContainer(tabsContainers[1]);
            indicators.addIndicatorList.call(this, chart, tabsContainers[1], 'edit');
            buttonParentDiv = tabsContainers[1]
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];
            this.addButton(buttonParentDiv, lang.saveButton || 'save', 'edit', callback, buttonParentDiv);
            this.addButton(buttonParentDiv, lang.removeButton || 'remove', 'remove', callback, buttonParentDiv);
        },
        /**
         * Create HTML list of all indicators (ADD mode) or added indicators
         * (EDIT mode).
         * @private
         */
        addIndicatorList: function (chart, parentDiv, listType) {
            var _self = this, lhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-lhs-col')[0], rhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0], isEdit = listType === 'edit', series = (isEdit ?
                chart.series : // EDIT mode
                chart.options.plotOptions // ADD mode
            ), addFormFields = this.indicators.addFormFields, rhsColWrapper, indicatorList, item;
            // create wrapper for list
            indicatorList = createElement(UL, {
                className: PREFIX + 'indicator-list'
            }, null, lhsCol);
            rhsColWrapper = rhsCol
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col-wrapper')[0];
            objectEach(series, function (serie, value) {
                var seriesOptions = serie.options;
                if (serie.params ||
                    seriesOptions && seriesOptions.params) {
                    var indicatorNameType = _self.indicators.getNameType(serie, value), indicatorType = indicatorNameType.type;
                    item = createElement(LI, {
                        className: PREFIX + 'indicator-list',
                        innerHTML: indicatorNameType.name
                    }, null, indicatorList);
                    ['click', 'touchstart'].forEach(function (eventName) {
                        addEvent(item, eventName, function () {
                            addFormFields.call(_self, chart, isEdit ? serie : series[indicatorType], indicatorNameType.type, rhsColWrapper);
                            // add hidden input with series.id
                            if (isEdit && serie.options) {
                                createElement(INPUT, {
                                    type: 'hidden',
                                    name: PREFIX + 'id-' + indicatorType,
                                    value: serie.options.id
                                }, null, rhsColWrapper)
                                    .setAttribute(PREFIX + 'data-series-id', serie.options.id);
                            }
                        });
                    });
                }
            });
            // select first item from the list
            if (indicatorList.childNodes.length > 0) {
                indicatorList.childNodes[0].click();
            }
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
        getNameType: function (series, type) {
            var options = series.options, seriesTypes = H.seriesTypes, 
            // add mode
            seriesName = seriesTypes[type] &&
                seriesTypes[type].prototype.nameBase || type.toUpperCase(), seriesType = type;
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
        listAllSeries: function (type, optionName, chart, parentDiv, selectedOption) {
            var selectName = PREFIX + optionName + '-type-' + type, lang = this.lang, selectBox, seriesOptions;
            createElement(LABEL, {
                innerHTML: lang[optionName] || optionName,
                htmlFor: selectName
            }, null, parentDiv);
            // select type
            selectBox = createElement(SELECT, {
                name: selectName,
                className: PREFIX + 'popup-field'
            }, null, parentDiv);
            selectBox.setAttribute('id', PREFIX + 'select-' + optionName);
            // list all series which have id - mandatory for creating indicator
            chart.series.forEach(function (serie) {
                seriesOptions = serie.options;
                if (!seriesOptions.params &&
                    seriesOptions.id &&
                    seriesOptions.id !== PREFIX + 'navigator-series') {
                    createElement(OPTION, {
                        innerHTML: seriesOptions.name || seriesOptions.id,
                        value: seriesOptions.id
                    }, null, selectBox);
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
        addFormFields: function (chart, series, seriesType, rhsColWrapper) {
            var fields = series.params || series.options.params, getNameType = this.indicators.getNameType;
            // reset current content
            rhsColWrapper.innerHTML = '';
            // create title (indicator name in the right column)
            createElement(H3, {
                className: PREFIX + 'indicator-title',
                innerHTML: getNameType(series, seriesType).name
            }, null, rhsColWrapper);
            // input type
            createElement(INPUT, {
                type: 'hidden',
                name: PREFIX + 'type-' + seriesType,
                value: seriesType
            }, null, rhsColWrapper);
            // list all series with id
            this.indicators.listAllSeries.call(this, seriesType, 'series', chart, rhsColWrapper, series.linkedParent && fields.volumeSeriesID);
            if (fields.volumeSeriesID) {
                this.indicators.listAllSeries.call(this, seriesType, 'volume', chart, rhsColWrapper, series.linkedParent && series.linkedParent.options.id);
            }
            // add param fields
            this.indicators.addParamInputs.call(this, chart, 'params', fields, seriesType, rhsColWrapper);
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
        addParamInputs: function (chart, parentNode, fields, type, parentDiv) {
            var _self = this, addParamInputs = this.indicators.addParamInputs, addInput = this.addInput, parentFullName;
            objectEach(fields, function (value, fieldName) {
                // create name like params.styles.fontSize
                parentFullName = parentNode + '.' + fieldName;
                if (isObject(value)) {
                    addParamInputs.call(_self, chart, parentFullName, value, type, parentDiv);
                }
                else if (
                // skip volume field which is created by addFormFields
                parentFullName !== 'params.volumeSeriesID') {
                    addInput.call(_self, parentFullName, type, parentDiv, [value, 'text'] // all inputs are text type
                    );
                }
            });
        },
        /**
         * Get amount of indicators added to chart.
         * @private
         * @return {number} - Amount of indicators
         */
        getAmount: function () {
            var series = this.series, counter = 0;
            objectEach(series, function (serie) {
                var seriesOptions = serie.options;
                if (serie.params ||
                    seriesOptions && seriesOptions.params) {
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
        init: function (chart) {
            var tabs = this.tabs, indicatorsCount = this.indicators.getAmount.call(chart), firstTab; // run by default
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
        addMenuItem: function (tabName, disableTab) {
            var popupDiv = this.popup.container, className = PREFIX + 'tab-item', lang = this.lang, menuItem;
            if (disableTab === 0) {
                className += ' ' + PREFIX + 'tab-disabled';
            }
            // tab 1
            menuItem = createElement(SPAN, {
                innerHTML: lang[tabName + 'Button'] || tabName,
                className: className
            }, null, popupDiv);
            menuItem.setAttribute(PREFIX + 'data-tab-type', tabName);
            return menuItem;
        },
        /**
         * Create tab content
         * @private
         * @return {HTMLDOMElement} - created HTML tab-content element
         */
        addContentItem: function () {
            var popupDiv = this.popup.container;
            return createElement(DIV, {
                className: PREFIX + 'tab-item-content'
            }, null, popupDiv);
        },
        /**
         * Add click event to each tab
         * @private
         * @param {number} disableTab
         * Disable tab when 0
         */
        switchTabs: function (disableTab) {
            var _self = this, popupDiv = this.popup.container, tabs = popupDiv.querySelectorAll('.' + PREFIX + 'tab-item'), dataParam;
            tabs.forEach(function (tab, i) {
                dataParam = tab.getAttribute(PREFIX + 'data-tab-type');
                if (dataParam === 'edit' && disableTab === 0) {
                    return;
                }
                ['click', 'touchstart'].forEach(function (eventName) {
                    addEvent(tab, eventName, function () {
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
        selectTab: function (tab, index) {
            var allTabs = this.popup.container
                .querySelectorAll('.' + PREFIX + 'tab-item-content');
            tab.className += ' ' + PREFIX + 'tab-item-active';
            allTabs[index].className += ' ' + PREFIX + 'tab-item-show';
        },
        /**
         * Set all tabs as invisible.
         * @private
         */
        deselectAll: function () {
            var popupDiv = this.popup.container, tabs = popupDiv
                .querySelectorAll('.' + PREFIX + 'tab-item'), tabsContent = popupDiv
                .querySelectorAll('.' + PREFIX + 'tab-item-content'), i;
            for (i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove(PREFIX + 'tab-item-active');
                tabsContent[i].classList.remove(PREFIX + 'tab-item-show');
            }
        }
    }
};
addEvent(H.NavigationBindings, 'showPopup', function (config) {
    if (!this.popup) {
        // Add popup to main container
        this.popup = new H.Popup(this.chart.container, (this.chart.options.navigation.iconsURL ||
            (this.chart.options.stockTools &&
                this.chart.options.stockTools.gui.iconsURL) ||
            'https://code.highcharts.com/@product.version@/gfx/stock-icons/'));
    }
    this.popup.showForm(config.formType, this.chart, config.options, config.onSubmit);
});
addEvent(H.NavigationBindings, 'closePopup', function () {
    if (this.popup) {
        this.popup.closePopup();
    }
});
