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
    isObject = H.isObject,
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
    init: function (parentDiv) {
        var popup;

        // create popup
        popup = createElement(DIV, {
            className: 'highcharts-popup'
        }, null, parentDiv);

        this.addCloseBtn.call(this, popup);

        return popup;
    },
    addCloseBtn: function (popup) {
        var _self = this,
            closeBtn;

        // create close popup btn
        closeBtn = createElement(DIV, {
            innerHTML: 'X',
            className: 'highcharts-popup-close'
        }, null, popup);

        addEvent(closeBtn, 'click', function () {
            _self.closePopup.call(_self);
        });
    },
    addColsContainer: function (container) {
        var rhsCol,
            lhsCol;

        lhsCol = createElement(DIV, {
            className: 'highcharts-popup-lhs-col'
        }, null, container);

        rhsCol = createElement(DIV, {
            className: 'highcharts-popup-rhs-col'
        }, null, container);

        createElement(DIV, {
            className: 'highcharts-popup-rhs-col-wrapper'
        }, null, rhsCol);

        return {
            lhsCol: lhsCol,
            rhsCol: rhsCol
        };
    },
    addIndicatorList: function (chart, tabContentDiv, listType) {
        var _self = this,
            lhsCol = tabContentDiv
                        .querySelectorAll('.highcharts-popup-lhs-col')[0],
            rhsCol = tabContentDiv
                        .querySelectorAll('.highcharts-popup-rhs-col')[0],
            defaultOptions = H.getOptions(),
            isEdit = listType === 'edit',
            series = listType === 'edit' ? chart.series : // EDIT mode
                                        defaultOptions.plotOptions, // ADD mode
            createIndicatorFields = this.createIndicatorFields,
            indicatorList,
            item;

        indicatorList = createElement(UL, {
            className: 'highcharts-indicator-list'
        }, null, lhsCol);

        objectEach(series, function (serie, value) {
            var seriesOptions = serie.options;

            if (
                serie.params ||
                seriesOptions && seriesOptions.params
                ) {

                var seriesNameType = _self.getSeriesNameType(serie, value);

                item = createElement(LI, {
                    className: 'highcharts-indicator-list',
                    innerHTML: seriesNameType.name
                }, null, indicatorList);

                addEvent(item, 'click', function () {
                    createIndicatorFields.call(
                        _self,
                        chart,
                        isEdit ? serie : series[seriesNameType.type],
                        seriesNameType.type,
                        rhsCol,
                        listType
                    );
                });
            }
        });
    },
    getSeriesNameType: function (series, type) {
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
    listAllSeries: function (type, chart, rhsColWrapper) {
        var selectBox,
            seriesOptions;

        // input type
        selectBox = createElement(
            SELECT,
            {
                name: 'highcharts-type-' + type
            },
            null,
            rhsColWrapper
        );

        // list all series which have id - its mandatory for creating indicator
        each(chart.series, function (serie) {

            seriesOptions = serie.options;

            if (
                seriesOptions.id &&
                seriesOptions.id !== 'highcharts-navigator-series'
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
    createIndicatorFields: function (chart, series, seriesType, rhsCol) {
        var fields = series.params || series.options.params,
            rhsColWrapper = rhsCol
                .querySelectorAll('.highcharts-popup-rhs-col-wrapper')[0];

        // edit mode

        // reset current content
        rhsColWrapper.innerHTML = '';

        // input type
        createElement(
            INPUT,
            {
                type: 'hidden',
                name: 'highcharts-type-' + seriesType,
                value: seriesType
            },
            null,
            rhsColWrapper
        );

        // list all series with id
        this.listAllSeries(seriesType, chart, rhsColWrapper);

        // add param fields
        this.addParamInputs(
            'params',
            fields,
            seriesType,
            rhsColWrapper
        );
    },
    addParamInputs: function (parentNode, fields, type, rhsColWrapper) {
        var _self = this,
            addParamInputs = _self.addParamInputs,
            addInput = _self.addInput,
            parentFullName;

        objectEach(fields, function (value, fieldName) {

            parentFullName = parentNode + '.' + fieldName;

            if (isObject(value)) {
                addParamInputs.call(
                    _self,
                    parentFullName,
                    value,
                    type,
                    rhsColWrapper
                );
            } else {
                addInput(parentFullName, type, rhsColWrapper, value);
            }
        });
    },
    addInput: function (optionName, type, rhsColWrapper, defaultValue) {
        var fieldName = optionName.split('.'),
            paramName = fieldName[fieldName.length - 1],
            inputName = 'highcharts-' + type + '-' + paramName;

        // add label
        createElement(
            LABEL, {
                innerHTML: paramName,
                htmlFor: inputName
            },
            null,
            rhsColWrapper
        );

        // add input
        createElement(
            INPUT,
            {
                name: inputName,
                value: defaultValue
            },
            null,
            rhsColWrapper
        ).setAttribute('highcharts-data-name', optionName);
    },
    addButton: function (parentDiv, callback) {
        var _self = this,
            closePopup = this.closePopup,
            getFields = this.getFields,
            button;

        button = createElement(BUTTON, {
            innerHTML: 'add'
        }, null, parentDiv);

        addEvent(button, 'click', function () {

            closePopup.call(_self);

            return callback(
                getFields(parentDiv)
            );
        });
    },
    getFields: function (rhsCol) {
        var inputList = rhsCol.querySelectorAll('input'),
            seriesId = rhsCol.querySelectorAll('select > option:checked')[0],
            param,
            fieldsOutput;

        fieldsOutput = {
            linkedTo: seriesId.getAttribute('value'),
            fields: { }
        };

        each(inputList, function (input) {
            param = input.getAttribute('highcharts-data-name');

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
    indicatorsForm: function (chart, callback) {

        var tabsContainers;

        // add tabs
        this.tabs.init.call(this);

        // get all tabs content divs
        tabsContainers = this.popupDiv
                            .querySelectorAll('.highcharts-tab-item-content');

        // ADD tab
        this.addColsContainer(tabsContainers[0]);
        this.addIndicatorList(chart, tabsContainers[0], 'add');
        this.addButton.call(
            this,
            tabsContainers[0].querySelectorAll('.highcharts-popup-rhs-col')[0],
            callback
        );

        // EDIT tab
        this.addColsContainer(tabsContainers[1]);
        this.addIndicatorList(chart, tabsContainers[1], 'edit');
        this.addButton.call(
            this,
            tabsContainers[1].querySelectorAll('.highcharts-popup-rhs-col')[0],
            callback
        );
    },
    showPopup: function () {
        var popupDiv = this.popupDiv,
            popupCloseBtn = popupDiv
                            .querySelectorAll('.highcharts-popup-close')[0];

        popupDiv.innerHTML = '';
        popupDiv.appendChild(popupCloseBtn);
        popupDiv.style.display = 'block';

        // reposition
        // positioner();
    },
    closePopup: function () {
        this.popupDiv.style.display = 'none';
    },
    showForm: function (type, chart, callback) {

        this.popupDiv = chart.stockToolbar.popup;

        // show blank popup
        this.showPopup.call(this);

        // indicator popup
        if (type === 'indicators') {
            this.indicatorsForm.call(this, chart, callback);
        } else {
            // general popup content
        }
    },
    tabs: {
        init: function () {
            var tabs = this.tabs,
                firstTab; // run by default

            // create menu items
            firstTab = tabs.addMenuItem.call(this, 'add');
            tabs.addMenuItem.call(this, 'edit');

            // create tabs containers
            tabs.addContentItem.call(this, 'add');
            tabs.addContentItem.call(this, 'edit');

            tabs.switchTabs.call(this);

            // activate first tab
            tabs.selectTab.call(this, firstTab, 0);
        },
        addMenuItem: function (type) {
            var popupDiv = this.popupDiv,
                menuItem;

            // tab 1
            menuItem = createElement(
                SPAN,
                {
                    innerHTML: type,
                    className: 'highcharts-tab-item'
                },
                null,
                popupDiv
            );

            menuItem.setAttribute('highcharts-data-tab-type', type);

            return menuItem;
        },
        addContentItem: function () {
            var popupDiv = this.popupDiv;

            return createElement(
                DIV,
                {
                    className: 'highcharts-tab-item-content'
                },
                null,
                popupDiv
            );
        },
        switchTabs: function () {
            var _self = this,
                popupDiv = this.popupDiv,
                tabs = popupDiv.querySelectorAll('.highcharts-tab-item');

            each(tabs, function (tab, i) {
                addEvent(tab, 'click', function () {

                    // reset class on other elements
                    _self.tabs.deselectAll.call(_self);
                    _self.tabs.selectTab.call(_self, this, i);
                });
            });
        },
        selectTab: function (tab, index) {
            var allTabs = this.popupDiv
                            .querySelectorAll('.highcharts-tab-item-content');

            tab.className += ' highcharts-tab-item-active';
            allTabs[index].className += ' highcharts-tab-item-show';
        },
        deselectAll: function () {
            var popupDiv = this.popupDiv,
                tabs = popupDiv
                            .querySelectorAll('.highcharts-tab-item'),
                tabsContent = popupDiv
                            .querySelectorAll('.highcharts-tab-item-content'),
                i;

            for (i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('highcharts-tab-item-active');
                tabsContent[i].classList.remove('highcharts-tab-item-show');
            }
        }
    }
};
