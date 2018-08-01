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
    UL = 'ul',
    LI = 'li';

H.Popup = function (parentDiv) {
    return this.init(parentDiv);
};

H.Popup.prototype = {
    init: function (parentDiv) {
        var popup,
            rhsCol;

        // create popup
        popup = createElement(DIV, {
            className: 'highcharts-popup'
        }, null, parentDiv);

        createElement(DIV, {
            className: 'highcharts-popup-lhs-col'
        }, null, popup);

        rhsCol = createElement(DIV, {
            className: 'highcharts-popup-rhs-col'
        }, null, popup);

        createElement(DIV, {
            className: 'highcharts-popup-rhs-col-wrapper'
        }, null, rhsCol);

        return popup;
    },
    addIndicatorList: function (chart, popupDiv) {
        var _self = this,
            defaultOptions = H.getOptions(),
            lhsCol = popupDiv
                        .querySelectorAll('.highcharts-popup-lhs-col')[0],
            rhsCol = popupDiv
                        .querySelectorAll('.highcharts-popup-rhs-col')[0],
            series = defaultOptions.plotOptions,
            createForm = this.createForm,
            indicatorList,
            item;

        indicatorList = createElement(UL, {
            className: 'highcharts-indicator-list'
        }, null, lhsCol);

        objectEach(series, function (serie, value) {
            if (serie.params) {
                item = createElement(LI, {
                    className: 'highcharts-indicator-list',
                    innerHTML: value
                }, null, indicatorList);

                addEvent(item, 'click', function () {
                    createForm.call(_self, chart, value, rhsCol);
                });
            }
        });
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
    createForm: function (chart, type, rhsCol) {
        var defaultOptions = H.getOptions(),
            fields = defaultOptions.plotOptions[type].params,
            rhsColWrapper = rhsCol
                .querySelectorAll('.highcharts-popup-rhs-col-wrapper')[0];

        // reset current content
        rhsColWrapper.innerHTML = '';

        // input type
        createElement(
            INPUT,
            {
                type: 'hidden',
                name: 'highcharts-type-' + type,
                value: type
            },
            null,
            rhsColWrapper
        );

        // list all series with id
        this.listAllSeries(type, chart, rhsColWrapper);

        // add param fields
        this.addParamInputs('params', fields, type, rhsColWrapper);
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
        ).setAttribute('data-name', optionName);
    },
    addButton: function (rhsCol, callback) {
        var getFields = this.getFields,
            button;

        button = createElement(BUTTON, {
            innerHTML: 'add'
        }, null, rhsCol);

        addEvent(button, 'click', function () {
            callback(
                getFields(rhsCol)
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
            param = input.getAttribute('data-name');

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
    showForm: function (chart, callback) {
        var popup = this,
            popupDiv = chart.stockToolbar.popup,
            lhsCol = popupDiv.querySelectorAll('.highcharts-popup-lhs-col')[0],
            rhsCol = popupDiv.querySelectorAll('.highcharts-popup-rhs-col')[0];

        popupDiv.style.display = 'block';

        // reset popup content
        lhsCol.innerHTML = '';
        popup.addIndicatorList(chart, popupDiv);
        popup.addButton(rhsCol, callback);
    }
};
