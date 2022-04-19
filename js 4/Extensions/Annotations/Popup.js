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
import AST from '../../Core/Renderer/HTML/AST.js';
import H from '../../Core/Globals.js';
var doc = H.doc, isFirefox = H.isFirefox;
import NavigationBindings from './NavigationBindings.js';
import D from '../../Core/DefaultOptions.js';
var getOptions = D.getOptions;
import Pointer from '../../Core/Pointer.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, createElement = U.createElement, defined = U.defined, fireEvent = U.fireEvent, isArray = U.isArray, isObject = U.isObject, objectEach = U.objectEach, pick = U.pick, stableSort = U.stableSort, wrap = U.wrap;
var indexFilter = /\d/g, PREFIX = 'highcharts-', A = 'a', DIV = 'div', INPUT = 'input', LABEL = 'label', BUTTON = 'button', SELECT = 'select', OPTION = 'option', SPAN = 'span', UL = 'ul', LI = 'li', H3 = 'h3';
/**
 * Enum for properties which should have dropdown list.
 * @private
 */
var DropdownProperties;
(function (DropdownProperties) {
    DropdownProperties[DropdownProperties["params.algorithm"] = 0] = "params.algorithm";
    DropdownProperties[DropdownProperties["params.average"] = 1] = "params.average";
})(DropdownProperties || (DropdownProperties = {}));
/**
 * List of available algorithms for the specific indicator.
 * @private
 */
var dropdownParameters = {
    'algorithm-pivotpoints': ['standard', 'fibonacci', 'camarilla'],
    'average-disparityindex': ['sma', 'ema', 'dema', 'tema', 'wma']
};
/* eslint-disable no-invalid-this, valid-jsdoc */
// onContainerMouseDown blocks internal popup events, due to e.preventDefault.
// Related issue #4606
wrap(Pointer.prototype, 'onContainerMouseDown', function (proceed, e) {
    // elements is not in popup
    if (!this.inClass(e.target, PREFIX + 'popup')) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});
H.Popup = function (parentDiv, iconsURL, chart) {
    this.init(parentDiv, iconsURL, chart);
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
    init: function (parentDiv, iconsURL, chart) {
        this.chart = chart;
        // create popup div
        this.container = createElement(DIV, {
            className: PREFIX + 'popup highcharts-no-tooltip'
        }, void 0, parentDiv);
        addEvent(this.container, 'mousedown', function () {
            var activeAnnotation = chart &&
                chart.navigationBindings &&
                chart.navigationBindings.activeAnnotation;
            if (activeAnnotation) {
                activeAnnotation.cancelClick = true;
                var unbind_1 = addEvent(H.doc, 'click', function () {
                    setTimeout(function () {
                        activeAnnotation.cancelClick = false;
                    }, 0);
                    unbind_1();
                });
            }
        });
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
        var iconsURL = this.iconsURL;
        // create close popup btn
        closeBtn = createElement(DIV, {
            className: PREFIX + 'popup-close'
        }, void 0, this.container);
        closeBtn.style['background-image'] = 'url(' +
            (iconsURL.match(/png|svg|jpeg|jpg|gif/ig) ?
                iconsURL : iconsURL + 'close.svg') + ')';
        ['click', 'touchstart'].forEach(function (eventName) {
            addEvent(closeBtn, eventName, function () {
                if (_self.chart) {
                    fireEvent(_self.chart.navigationBindings, 'closePopup');
                }
                else {
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
    addColsContainer: function (container) {
        var rhsCol, lhsCol;
        // left column
        lhsCol = createElement(DIV, {
            className: PREFIX + 'popup-lhs-col'
        }, void 0, container);
        // right column
        rhsCol = createElement(DIV, {
            className: PREFIX + 'popup-rhs-col'
        }, void 0, container);
        // wrapper content
        createElement(DIV, {
            className: PREFIX + 'popup-rhs-col-wrapper'
        }, void 0, rhsCol);
        return {
            lhsCol: lhsCol,
            rhsCol: rhsCol
        };
    },
    /**
     * Create input with label.
     *
     * @private
     *
     * @param {string} option
     *        Chain of fields i.e params.styles.fontSize separeted by the dot.
     *
     * @param {string} indicatorType
     *        Type of the indicator i.e. sma, ema...
     *
     * @param {HTMLDOMElement} parentDiv
     *        HTML parent element.
     *
     * @param {Highcharts.InputAttributes} inputAttributes
     *        Attributes of the input.
     *
     * @return {HTMLInputElement}
     *         Return created input element.
     */
    addInput: function (option, indicatorType, parentDiv, inputAttributes) {
        var optionParamList = option.split('.'), optionName = optionParamList[optionParamList.length - 1], lang = this.lang, inputName = PREFIX + indicatorType + '-' + pick(inputAttributes.htmlFor, optionName);
        var input;
        if (!inputName.match(indexFilter)) {
            // add label
            createElement(LABEL, {
                htmlFor: inputName,
                className: inputAttributes.labelClassName
            }, void 0, parentDiv).appendChild(doc.createTextNode(lang[optionName] || optionName));
        }
        // add input
        input = createElement(INPUT, {
            name: inputName,
            value: inputAttributes.value,
            type: inputAttributes.type,
            className: PREFIX + 'popup-field'
        }, void 0, parentDiv);
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
    addButton: function (parentDiv, label, type, fieldsDiv, callback) {
        var _self = this, closePopup = this.closePopup, getFields = this.getFields, button;
        button = createElement(BUTTON, void 0, void 0, parentDiv);
        button.appendChild(doc.createTextNode(label));
        if (callback) {
            ['click', 'touchstart'].forEach(function (eventName) {
                addEvent(button, eventName, function () {
                    closePopup.call(_self);
                    return callback(getFields(fieldsDiv, type));
                });
            });
        }
        return button;
    },
    /**
     * Get values from all inputs and selections then create JSON.
     *
     * @private
     *
     * @param {Highcharts.HTMLDOMElement} parentDiv
     * The container where inputs and selections are created.
     *
     * @param {string} type
     * Type of the popup bookmark (add|edit|remove).
     */
    getFields: function (parentDiv, type) {
        var inputList = Array.prototype.slice.call(parentDiv.querySelectorAll(INPUT)), selectList = Array.prototype.slice.call(parentDiv.querySelectorAll(SELECT)), optionSeries = '#' + PREFIX + 'select-series > option:checked', optionVolume = '#' + PREFIX + 'select-volume > option:checked', linkedTo = parentDiv.querySelectorAll(optionSeries)[0], volumeTo = parentDiv.querySelectorAll(optionVolume)[0];
        var fieldsOutput;
        fieldsOutput = {
            actionType: type,
            linkedTo: linkedTo && linkedTo.getAttribute('value') || '',
            fields: {}
        };
        inputList.forEach(function (input) {
            var param = input.getAttribute(PREFIX + 'data-name'), seriesId = input.getAttribute(PREFIX + 'data-series-id');
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
        selectList.forEach(function (select) {
            var id = select.id;
            // Get inputs only for the parameters, not for series and volume.
            if (id !== PREFIX + 'select-series' &&
                id !== PREFIX + 'select-volume') {
                var parameter = id.split('highcharts-select-')[1];
                fieldsOutput.fields[parameter] = select.value;
            }
        });
        if (volumeTo) {
            fieldsOutput.fields['params.volumeSeriesID'] = volumeTo
                .getAttribute('value') || '';
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
        this.formType = void 0;
        // reset content
        popupDiv.innerHTML = AST.emptyHTML;
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
    closePopup: function () {
        var container = pick(this.popup && this.popup.container, this.container);
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
    showForm: function (type, chart, options, callback) {
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
    getLangpack: function () {
        return getOptions().lang.navigation.popup;
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
            if (chart) {
                popupDiv.style.top = chart.plotTop + 10 + 'px';
            }
            // create label
            createElement(SPAN, void 0, void 0, popupDiv).appendChild(doc.createTextNode(pick(
            // Advanced annotations:
            lang[options.langKey] || options.langKey, 
            // Basic shapes:
            options.shapes && options.shapes[0].type)));
            // add buttons
            button = this.addButton(popupDiv, lang.removeButton || 'remove', 'remove', popupDiv, callback);
            button.className += ' ' + PREFIX + 'annotation-remove-button';
            button.style['background-image'] = 'url(' +
                this.iconsURL + 'destroy.svg)';
            button = this.addButton(popupDiv, lang.editButton || 'edit', 'edit', popupDiv, function () {
                showForm.call(_self, 'annotation-edit', chart, options, callback);
            });
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
            if (!chart) {
                return;
            }
            // create title of annotations
            lhsCol = createElement('h2', {
                className: PREFIX + 'popup-main-title'
            }, void 0, popupDiv);
            lhsCol.appendChild(doc.createTextNode(lang[options.langKey] || options.langKey || ''));
            // left column
            lhsCol = createElement(DIV, {
                className: (PREFIX + 'popup-lhs-col ' + PREFIX + 'popup-lhs-full')
            }, void 0, popupDiv);
            bottomRow = createElement(DIV, {
                className: PREFIX + 'popup-bottom-row'
            }, void 0, popupDiv);
            this.annotations.addFormFields.call(this, lhsCol, chart, '', options, [], true);
            this.addButton(bottomRow, isInit ?
                (lang.addButton || 'add') :
                (lang.saveButton || 'save'), isInit ? 'add' : 'save', popupDiv, callback);
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
            if (!chart) {
                return;
            }
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
                stableSort(storage, function (a) {
                    return a[1].match(/format/g) ? -1 : 1;
                });
                if (isFirefox) {
                    storage.reverse(); // (#14691)
                }
                storage.forEach(function (genInput) {
                    if (genInput[0] === true) {
                        createElement(SPAN, {
                            className: PREFIX + 'annotation-title'
                        }, void 0, genInput[2]).appendChild(doc.createTextNode(genInput[1]));
                    }
                    else {
                        genInput[4] = {
                            value: genInput[4][0],
                            type: genInput[4][1]
                        };
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
            if (!chart) {
                return;
            }
            // add tabs
            this.tabs.init.call(this, chart);
            // get all tabs content divs
            tabsContainers = this.popup.container
                .querySelectorAll('.' + PREFIX + 'tab-item-content');
            // ADD tab
            this.addColsContainer(tabsContainers[0]);
            indicators.addSearchBox.call(this, chart, tabsContainers[0]);
            indicators.addIndicatorList.call(this, chart, tabsContainers[0], 'add');
            buttonParentDiv = tabsContainers[0]
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];
            this.addButton(buttonParentDiv, lang.addButton || 'add', 'add', buttonParentDiv, callback);
            // EDIT tab
            this.addColsContainer(tabsContainers[1]);
            indicators.addIndicatorList.call(this, chart, tabsContainers[1], 'edit');
            buttonParentDiv = tabsContainers[1]
                .querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0];
            this.addButton(buttonParentDiv, lang.saveButton || 'save', 'edit', buttonParentDiv, callback);
            this.addButton(buttonParentDiv, lang.removeButton || 'remove', 'remove', buttonParentDiv, callback);
        },
        /**
         * Filter object of series which are not indicators.
         * If the filter string exists, check against it.
         *
         * @private
         *
         * @param {Highcharts.FilteredSeries} series
         *        All series are available in the plotOptions.
         *
         * @param {string|undefined} filter
         *        Applied filter string from the input.
         *        For the first iteration, it's an empty string.
         *
         * @return {Array<Highcharts.FilteredSeries>} filteredSeriesArray
         *         Returns array of filtered series based on filter string.
         */
        filterSeries: function (series, filter) {
            var popup = this, indicators = popup.indicators, lang = popup.chart && popup.chart.options.lang, indicatorAliases = lang &&
                lang.navigation &&
                lang.navigation.popup &&
                lang.navigation.popup.indicatorAliases;
            var filteredSeriesArray = [], filteredSeries;
            objectEach(series, function (series, value) {
                var seriesOptions = series.options;
                // Allow only indicators.
                if (series.params || seriesOptions &&
                    seriesOptions.params) {
                    var _a = indicators.getNameType(series, value), indicatorFullName = _a.indicatorFullName, indicatorType = _a.indicatorType;
                    if (filter) {
                        // Replace invalid characters.
                        var validFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        var regex = new RegExp(validFilter, 'i'), alias = indicatorAliases &&
                            indicatorAliases[indicatorType] &&
                            indicatorAliases[indicatorType].join(' ') || '';
                        if (indicatorFullName.match(regex) ||
                            alias.match(regex)) {
                            filteredSeries = {
                                indicatorFullName: indicatorFullName,
                                indicatorType: indicatorType,
                                series: series
                            };
                            filteredSeriesArray.push(filteredSeries);
                        }
                    }
                    else {
                        filteredSeries = {
                            indicatorFullName: indicatorFullName,
                            indicatorType: indicatorType,
                            series: series
                        };
                        filteredSeriesArray.push(filteredSeries);
                    }
                }
            });
            return filteredSeriesArray;
        },
        /**
         * Filter an array of series and map its names and types.
         *
         * @private
         *
         * @param {Highcharts.FilteredSeries} series
         *        All series that are available in the plotOptions.
         *
         * @return {Array<Highcharts.FilteredSeries>} filteredSeriesArray
         *         Returns array of filtered series based on filter string.
         */
        filterSeriesArray: function (series) {
            var filteredSeriesArray = [], filteredSeries;
            // Allow only indicators.
            series.forEach(function (series) {
                var seriesOptions = series.options;
                if (series.is('sma')) {
                    filteredSeries = {
                        indicatorFullName: series.name,
                        indicatorType: series.type,
                        series: series
                    };
                    filteredSeriesArray.push(filteredSeries);
                }
            });
            return filteredSeriesArray;
        },
        /**
         * Create HTML list of all indicators (ADD mode) or added indicators
         * (EDIT mode).
         *
         * @private
         *
         * @param {Highcharts.AnnotationChart} chart
         *        The chart object.
         *
         * @param {string} [optionName]
         *        Name of the option into which selection is being added.
         *
         * @param {HTMLDOMElement} [parentDiv]
         *        HTML parent element.
         *
         * @param {string} listType
         *        Type of list depending on the selected bookmark.
         *        Might be 'add' or 'edit'.
         *
         * @param {string|undefined} filter
         *        Applied filter string from the input.
         *        For the first iteration, it's an empty string.
         */
        addIndicatorList: function (chart, parentDiv, listType, filter) {
            var popup = this, indicators = popup.indicators, lang = popup.lang, lhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-lhs-col')[0], rhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-rhs-col')[0], isEdit = listType === 'edit', addFormFields = this.indicators.addFormFields, series = (isEdit ?
                chart.series : // EDIT mode
                chart.options.plotOptions || {} // ADD mode
            );
            if (!chart && series) {
                return;
            }
            var rhsColWrapper, indicatorList, item, filteredSeriesArray = [];
            // Filter and sort the series.
            if (!isEdit && !isArray(series)) {
                // Apply filters only for the 'add' indicator list.
                filteredSeriesArray = indicators.filterSeries.call(this, series, filter);
            }
            else if (isArray(series)) {
                filteredSeriesArray = indicators.filterSeriesArray.call(this, series);
            }
            // Sort indicators alphabeticaly.
            stableSort(filteredSeriesArray, function (a, b) {
                var seriesAName = a.indicatorFullName.toLowerCase(), seriesBName = b.indicatorFullName.toLowerCase();
                return (seriesAName < seriesBName) ?
                    -1 : (seriesAName > seriesBName) ? 1 : 0;
            });
            // If the list exists remove it from the DOM
            // in order to create a new one with different filters.
            if (lhsCol.children[1]) {
                lhsCol.children[1].remove();
            }
            // Create wrapper for list.
            indicatorList = createElement(UL, {
                className: PREFIX + 'indicator-list'
            }, void 0, lhsCol);
            rhsColWrapper = rhsCol.querySelectorAll('.' + PREFIX + 'popup-rhs-col-wrapper')[0];
            filteredSeriesArray.forEach(function (seriesSet) {
                var indicatorFullName = seriesSet.indicatorFullName, indicatorType = seriesSet.indicatorType, series = seriesSet.series;
                item = createElement(LI, {
                    className: PREFIX + 'indicator-list'
                }, void 0, indicatorList);
                item.appendChild(doc.createTextNode(indicatorFullName));
                ['click', 'touchstart'].forEach(function (eventName) {
                    addEvent(item, eventName, function () {
                        var button = rhsColWrapper.parentNode
                            .children[1];
                        addFormFields.call(popup, chart, series, indicatorType, rhsColWrapper);
                        if (button) {
                            button.style.display = 'block';
                        }
                        // add hidden input with series.id
                        if (isEdit && series.options) {
                            createElement(INPUT, {
                                type: 'hidden',
                                name: PREFIX + 'id-' + indicatorType,
                                value: series.options.id
                            }, void 0, rhsColWrapper).setAttribute(PREFIX + 'data-series-id', series.options.id);
                        }
                    });
                });
            });
            // select first item from the list
            if (indicatorList.childNodes.length > 0) {
                indicatorList.childNodes[0].click();
            }
            else if (!isEdit) {
                AST.setElementHTML(rhsColWrapper.parentNode.children[0], lang.noFilterMatch || '');
                rhsColWrapper.parentNode.children[1]
                    .style.display = 'none';
            }
        },
        /**
         * Add searchbox HTML element and its' label.
         *
         * @private
         *
         * @param {Highcharts.AnnotationChart} chart
         *        The chart object.
         *
         * @param {HTMLDOMElement} parentDiv
         *        HTML parent element.
         */
        addSearchBox: function (chart, parentDiv) {
            var popup = this, lhsCol = parentDiv.querySelectorAll('.' + PREFIX + 'popup-lhs-col')[0], options = 'searchIndicators', inputAttributes = {
                value: '',
                type: 'text',
                htmlFor: 'search-indicators',
                labelClassName: 'highcharts-input-search-indicators-label'
            }, clearFilterText = this.lang.clearFilter, inputWrapper = createElement(DIV, {
                className: 'highcharts-input-wrapper'
            }, void 0, lhsCol);
            var handleInputChange = function (inputText) {
                // Apply some filters.
                popup.indicators.addIndicatorList.call(popup, chart, popup.container, 'add', inputText);
            };
            // Add input field with the label and button.
            var input = this.addInput(options, INPUT, inputWrapper, inputAttributes), button = createElement(A, {
                textContent: clearFilterText
            }, void 0, inputWrapper);
            input.classList.add('highcharts-input-search-indicators');
            button.classList.add('clear-filter-button');
            // Add input change events.
            addEvent(input, 'input', function (e) {
                handleInputChange(this.value);
                // Show clear filter button.
                if (this.value.length) {
                    button.style.display = 'inline-block';
                }
                else {
                    button.style.display = 'none';
                }
            });
            // Add clear filter click event.
            ['click', 'touchstart'].forEach(function (eventName) {
                addEvent(button, eventName, function () {
                    // Clear the input.
                    input.value = '';
                    handleInputChange('');
                    // Hide clear filter button- no longer nececary.
                    button.style.display = 'none';
                });
            });
        },
        /**
         * Add selection HTML element and its' label.
         *
         * @private
         *
         * @param {string} indicatorType
         * Type of the indicator i.e. sma, ema...
         *
         * @param {string} [optionName]
         * Name of the option into which selection is being added.
         *
         * @param {HTMLDOMElement} [parentDiv]
         * HTML parent element.
         */
        addSelection: function (indicatorType, optionName, parentDiv) {
            var optionParamList = optionName.split('.'), labelText = optionParamList[optionParamList.length - 1];
            var selectName = PREFIX + optionName + '-type-' + indicatorType, lang = this.lang, selectBox;
            // Add a label for the selection box.
            createElement(LABEL, {
                htmlFor: selectName
            }, null, parentDiv).appendChild(doc.createTextNode(lang[labelText] || optionName));
            // Create a selection box.
            selectBox = createElement(SELECT, {
                name: selectName,
                className: PREFIX + 'popup-field',
                id: PREFIX + 'select-' + optionName
            }, null, parentDiv);
            selectBox.setAttribute('id', PREFIX + 'select-' + optionName);
            return selectBox;
        },
        /**
         * Get and add selection options.
         *
         * @private
         *
         * @param {Highcharts.AnnotationChart} chart
         *        The chart object.
         *
         * @param {string} [optionName]
         *        Name of the option into which selection is being added.
         *
         * @param {HTMLSelectElement} [selectBox]
         *        HTML select box element to which the options are being added.
         *
         * @param {string|undefined} indicatorType
         *        Type of the indicator i.e. sma, ema...
         *
         * @param {string|undefined} parameterName
         *        Name of the parameter which should be applied.
         *
         * @param {string|undefined} selectedOption
         *        Default value in dropdown.
         */
        addSelectionOptions: function (chart, optionName, selectBox, indicatorType, parameterName, selectedOption, currentSeries) {
            var popup = this;
            // Get and apply selection options for the possible series.
            if (optionName === 'series' || optionName === 'volume') {
                // List all series which have id - mandatory for indicator.
                chart.series.forEach(function (series) {
                    var seriesOptions = series.options, seriesName = seriesOptions.name ||
                        seriesOptions.params ?
                        series.name :
                        seriesOptions.id || '';
                    if (seriesOptions.id !== PREFIX + 'navigator-series' &&
                        seriesOptions.id !== (currentSeries &&
                            currentSeries.options &&
                            currentSeries.options.id)) {
                        if (!defined(selectedOption) &&
                            optionName === 'volume' &&
                            series.type === 'column') {
                            selectedOption = seriesOptions.id;
                        }
                        createElement(OPTION, {
                            value: seriesOptions.id
                        }, void 0, selectBox).appendChild(doc.createTextNode(seriesName));
                    }
                });
            }
            else if (indicatorType && parameterName) {
                // Get and apply options for the possible parameters.
                var dropdownKey = parameterName + '-' + indicatorType, parameterOption = dropdownParameters[dropdownKey];
                parameterOption.forEach(function (element) {
                    createElement(OPTION, {
                        value: element
                    }, void 0, selectBox).appendChild(doc.createTextNode(element));
                });
            }
            // Add the default dropdown value if defined.
            if (defined(selectedOption)) {
                selectBox.value = selectedOption;
            }
        },
        /**
         * Extract full name and type of requested indicator.
         *
         * @private
         *
         * @param {Highcharts.Series} series
         * Series which name is needed(EDITmode - defaultOptions.series,
         * ADDmode - indicator series).
         *
         * @param {string} [indicatorType]
         * Type of the indicator i.e. sma, ema...
         *
         * @return {Highcharts.Dictionary<string>}
         * Full name and series type.
         */
        getNameType: function (series, indicatorType) {
            var options = series.options, seriesTypes = H.seriesTypes;
            // add mode
            var seriesName = (seriesTypes[indicatorType] &&
                seriesTypes[indicatorType].prototype.nameBase) ||
                indicatorType.toUpperCase(), seriesType = indicatorType;
            // edit
            if (options && options.type) {
                seriesType = series.options.type;
                seriesName = series.name;
            }
            return {
                indicatorFullName: seriesName,
                indicatorType: seriesType
            };
        },
        /**
         * Create the selection box for the series,
         * add options and apply the default one.
         *
         * @private
         *
         * @param {string} indicatorType
         *        Type of the indicator i.e. sma, ema...
         *
         * @param {string} [optionName]
         *        Name of the option into which selection is being added.
         *
         * @param {Highcharts.AnnotationChart} chart
         *        The chart object.
         *
         * @param {HTMLDOMElement} [parentDiv]
         *        HTML parent element.
         *
         * @param {string|undefined} selectedOption
         *        Default value in dropdown.
         */
        listAllSeries: function (indicatorType, optionName, chart, parentDiv, currentSeries, selectedOption) {
            var popup = this, indicators = popup.indicators;
            // Won't work without the chart.
            if (!chart) {
                return;
            }
            // Add selection boxes.
            var selectBox = indicators.addSelection.call(popup, indicatorType, optionName, parentDiv);
            // Add possible dropdown options.
            indicators.addSelectionOptions.call(popup, chart, optionName, selectBox, void 0, void 0, void 0, currentSeries);
            // Add the default dropdown value if defined.
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
            rhsColWrapper.innerHTML = AST.emptyHTML;
            // create title (indicator name in the right column)
            createElement(H3, {
                className: PREFIX + 'indicator-title'
            }, void 0, rhsColWrapper).appendChild(doc.createTextNode(getNameType(series, seriesType).indicatorFullName));
            // input type
            createElement(INPUT, {
                type: 'hidden',
                name: PREFIX + 'type-' + seriesType,
                value: seriesType
            }, void 0, rhsColWrapper);
            // list all series with id
            this.indicators.listAllSeries.call(this, seriesType, 'series', chart, rhsColWrapper, series, series.linkedParent && series.linkedParent.options.id);
            if (fields.volumeSeriesID) {
                this.indicators.listAllSeries.call(this, seriesType, 'volume', chart, rhsColWrapper, series, series.linkedParent && fields.volumeSeriesID);
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
            var popup = this, indicators = popup.indicators;
            var addParamInputs = this.indicators.addParamInputs, addInput = this.addInput, parentFullName;
            if (!chart) {
                return;
            }
            objectEach(fields, function (value, fieldName) {
                // create name like params.styles.fontSize
                parentFullName = parentNode + '.' + fieldName;
                if (defined(value) && // skip if field is unnecessary, #15362
                    parentFullName) {
                    if (isObject(value)) {
                        // (15733) 'Periods' has an arrayed value. Label must be
                        // created here.
                        addInput.call(popup, parentFullName, type, parentDiv, {});
                        addParamInputs.call(popup, chart, parentFullName, value, type, parentDiv);
                    }
                    // If the option is listed in dropdown enum,
                    // add the selection box for it.
                    if (parentFullName in DropdownProperties) {
                        // Add selection boxes.
                        var selectBox = indicators.addSelection.call(popup, type, parentFullName, parentDiv);
                        // Add possible dropdown options.
                        indicators.addSelectionOptions.call(popup, chart, parentNode, selectBox, type, fieldName, value);
                    }
                    else if (
                    // Skip volume field which is created by addFormFields.
                    parentFullName !== 'params.volumeSeriesID' &&
                        !isArray(value) // Skip params declared in array.
                    ) {
                        addInput.call(popup, parentFullName, type, parentDiv, {
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
        getAmount: function () {
            var series = this.series, counter = 0;
            series.forEach(function (serie) {
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
            if (!chart) {
                return;
            }
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
                className: className
            }, void 0, popupDiv);
            menuItem.appendChild(doc.createTextNode(lang[tabName + 'Button'] || tabName));
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
                // #12100
                className: PREFIX + 'tab-item-content ' +
                    PREFIX + 'no-mousewheel'
            }, void 0, popupDiv);
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
addEvent(NavigationBindings, 'showPopup', function (config) {
    if (!this.popup) {
        // Add popup to main container
        this.popup = new H.Popup(this.chart.container, (this.chart.options.navigation.iconsURL ||
            (this.chart.options.stockTools &&
                this.chart.options.stockTools.gui.iconsURL) ||
            'https://code.highcharts.com/@product.version@/gfx/stock-icons/'), this.chart);
    }
    this.popup.showForm(config.formType, this.chart, config.options, config.onSubmit);
});
addEvent(NavigationBindings, 'closePopup', function () {
    if (this.popup) {
        this.popup.closePopup();
    }
});
export default H.Popup;
