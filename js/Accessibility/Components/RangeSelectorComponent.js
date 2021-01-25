/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for the range selector.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT, getAxisRangeDescription = ChartUtilities.getAxisRangeDescription;
import Announcer from '../Utils/Announcer.js';
import H from '../../Core/Globals.js';
import HTMLUtilities from '../Utils/HTMLUtilities.js';
var setElAttrs = HTMLUtilities.setElAttrs;
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import U from '../../Core/Utilities.js';
import RangeSelector from '../../Extensions/RangeSelector.js';
var addEvent = U.addEvent, extend = U.extend;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 */
function shouldRunInputNavigation(chart) {
    return Boolean(chart.rangeSelector &&
        chart.rangeSelector.inputGroup &&
        chart.rangeSelector.inputGroup.element
            .getAttribute('visibility') !== 'hidden' &&
        chart.options.rangeSelector.inputEnabled !== false &&
        chart.rangeSelector.minInput &&
        chart.rangeSelector.maxInput);
}
/**
 * Highlight range selector button by index.
 *
 * @private
 * @function Highcharts.Chart#highlightRangeSelectorButton
 *
 * @param {number} ix
 *
 * @return {boolean}
 */
H.Chart.prototype.highlightRangeSelectorButton = function (ix) {
    var _a, _b;
    var buttons = ((_a = this.rangeSelector) === null || _a === void 0 ? void 0 : _a.buttons) || [];
    var curHighlightedIx = this.highlightedRangeSelectorItemIx;
    var curSelectedIx = (_b = this.rangeSelector) === null || _b === void 0 ? void 0 : _b.selected;
    // Deselect old
    if (typeof curHighlightedIx !== 'undefined' &&
        buttons[curHighlightedIx] &&
        curHighlightedIx !== curSelectedIx) {
        buttons[curHighlightedIx].setState(this.oldRangeSelectorItemState || 0);
    }
    // Select new
    this.highlightedRangeSelectorItemIx = ix;
    if (buttons[ix]) {
        this.setFocusToElement(buttons[ix].box, buttons[ix].element);
        if (ix !== curSelectedIx) {
            this.oldRangeSelectorItemState = buttons[ix].state;
            buttons[ix].setState(1);
        }
        return true;
    }
    return false;
};
// Range selector does not have destroy-setup for class instance events - so
// we set it on the class and call the component from here.
addEvent(RangeSelector, 'afterBtnClick', function () {
    var _a;
    var component = (_a = this.chart.accessibility) === null || _a === void 0 ? void 0 : _a.components.rangeSelector;
    return component === null || component === void 0 ? void 0 : component.onAfterBtnClick();
});
/**
 * The RangeSelectorComponent class
 *
 * @private
 * @class
 * @name Highcharts.RangeSelectorComponent
 */
var RangeSelectorComponent = function () { };
RangeSelectorComponent.prototype = new AccessibilityComponent();
extend(RangeSelectorComponent.prototype, /** @lends Highcharts.RangeSelectorComponent */ {
    /**
     * Init the component
     * @private
     */
    init: function () {
        var chart = this.chart;
        this.announcer = new Announcer(chart, 'polite');
    },
    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        var _a;
        var chart = this.chart, component = this, rangeSelector = chart.rangeSelector;
        if (!rangeSelector) {
            return;
        }
        this.updateSelectorVisibility();
        this.setDropdownAttrs();
        if ((_a = rangeSelector.buttons) === null || _a === void 0 ? void 0 : _a.length) {
            rangeSelector.buttons.forEach(function (button) {
                component.setRangeButtonAttrs(button);
            });
        }
        // Make sure input boxes are accessible and focusable
        if (rangeSelector.maxInput && rangeSelector.minInput) {
            ['minInput', 'maxInput'].forEach(function (key, i) {
                var input = rangeSelector[key];
                if (input) {
                    unhideChartElementFromAT(chart, input);
                    component.setRangeInputAttrs(input, 'accessibility.rangeSelector.' + (i ? 'max' : 'min') +
                        'InputLabel');
                }
            });
        }
    },
    /**
     * Hide buttons from AT when showing dropdown, and vice versa.
     * @private
     */
    updateSelectorVisibility: function () {
        var chart = this.chart;
        var rangeSelector = chart.rangeSelector;
        var dropdown = rangeSelector === null || rangeSelector === void 0 ? void 0 : rangeSelector.dropdown;
        var buttons = (rangeSelector === null || rangeSelector === void 0 ? void 0 : rangeSelector.buttons) || [];
        var hideFromAT = function (el) { return el.setAttribute('aria-hidden', true); };
        if ((rangeSelector === null || rangeSelector === void 0 ? void 0 : rangeSelector.hasVisibleDropdown) && dropdown) {
            unhideChartElementFromAT(chart, dropdown);
            buttons.forEach(function (btn) { return hideFromAT(btn.element); });
        }
        else {
            if (dropdown) {
                hideFromAT(dropdown);
            }
            buttons.forEach(function (btn) { return unhideChartElementFromAT(chart, btn.element); });
        }
    },
    /**
     * Set accessibility related attributes on dropdown element.
     * @private
     */
    setDropdownAttrs: function () {
        var _a;
        var chart = this.chart;
        var dropdown = (_a = chart.rangeSelector) === null || _a === void 0 ? void 0 : _a.dropdown;
        if (dropdown) {
            var label = chart.langFormat('accessibility.rangeSelector.dropdownLabel', { rangeTitle: chart.options.lang.rangeSelectorZoom });
            dropdown.setAttribute('aria-label', label);
            dropdown.setAttribute('tabindex', -1);
        }
    },
    /**
     * @private
     * @param {Highcharts.SVGElement} button
     */
    setRangeButtonAttrs: function (button) {
        setElAttrs(button.element, {
            tabindex: -1,
            role: 'button'
        });
    },
    /**
     * @private
     */
    setRangeInputAttrs: function (input, langKey) {
        var chart = this.chart;
        setElAttrs(input, {
            tabindex: -1,
            'aria-label': chart.langFormat(langKey, { chart: chart })
        });
    },
    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number} Response code
     */
    onButtonNavKbdArrowKey: function (keyboardNavigationHandler, keyCode) {
        var response = keyboardNavigationHandler.response, keys = this.keyCodes, chart = this.chart, wrapAround = chart.options.accessibility
            .keyboardNavigation.wrapAround, direction = (keyCode === keys.left || keyCode === keys.up) ? -1 : 1, didHighlight = chart.highlightRangeSelectorButton(chart.highlightedRangeSelectorItemIx + direction);
        if (!didHighlight) {
            if (wrapAround) {
                keyboardNavigationHandler.init(direction);
                return response.success;
            }
            return response[direction > 0 ? 'next' : 'prev'];
        }
        return response.success;
    },
    /**
     * @private
     */
    onButtonNavKbdClick: function (keyboardNavigationHandler) {
        var response = keyboardNavigationHandler.response, chart = this.chart, wasDisabled = chart.oldRangeSelectorItemState === 3;
        if (!wasDisabled) {
            this.fakeClickEvent(chart.rangeSelector.buttons[chart.highlightedRangeSelectorItemIx].element);
        }
        return response.success;
    },
    /**
     * Called whenever a range selector button has been clicked, either by
     * mouse, touch, or kbd/voice/other.
     * @private
     */
    onAfterBtnClick: function () {
        var chart = this.chart;
        var axisRangeDescription = getAxisRangeDescription(chart.xAxis[0]);
        var announcement = chart.langFormat('accessibility.rangeSelector.clickButtonAnnouncement', { chart: chart, axisRangeDescription: axisRangeDescription });
        if (announcement) {
            this.announcer.announce(announcement);
        }
    },
    /**
     * @private
     */
    onInputKbdMove: function (direction) {
        var _a, _b;
        var chart = this.chart;
        var rangeSel = chart.rangeSelector;
        var newIx = chart.highlightedInputRangeIx = (chart.highlightedInputRangeIx || 0) + direction;
        var newIxOutOfRange = newIx > 1 || newIx < 0;
        if (newIxOutOfRange) {
            (_a = chart.accessibility) === null || _a === void 0 ? void 0 : _a.keyboardNavigation.tabindexContainer.focus();
            (_b = chart.accessibility) === null || _b === void 0 ? void 0 : _b.keyboardNavigation[direction < 0 ? 'prev' : 'next']();
        }
        else if (rangeSel) {
            var svgEl = rangeSel[newIx ? 'maxDateBox' : 'minDateBox'];
            var inputEl = rangeSel[newIx ? 'maxInput' : 'minInput'];
            if (svgEl && inputEl) {
                chart.setFocusToElement(svgEl, inputEl);
            }
        }
    },
    /**
     * @private
     * @param {number} direction
     */
    onInputNavInit: function (direction) {
        var _this = this;
        var component = this;
        var chart = this.chart;
        var buttonIxToHighlight = direction > 0 ? 0 : 1;
        var rangeSel = chart.rangeSelector;
        var svgEl = rangeSel === null || rangeSel === void 0 ? void 0 : rangeSel[buttonIxToHighlight ? 'maxDateBox' : 'minDateBox'];
        var minInput = rangeSel === null || rangeSel === void 0 ? void 0 : rangeSel.minInput;
        var maxInput = rangeSel === null || rangeSel === void 0 ? void 0 : rangeSel.maxInput;
        var inputEl = buttonIxToHighlight ? maxInput : minInput;
        chart.highlightedInputRangeIx = buttonIxToHighlight;
        if (svgEl && minInput && maxInput) {
            chart.setFocusToElement(svgEl, inputEl);
            // Tab-press with the input focused does not propagate to chart
            // automatically, so we manually catch and handle it when relevant.
            if (this.removeInputKeydownHandler) {
                this.removeInputKeydownHandler();
            }
            var keydownHandler = function (e) {
                var isTab = (e.which || e.keyCode) === _this.keyCodes.tab;
                if (isTab) {
                    e.preventDefault();
                    e.stopPropagation();
                    component.onInputKbdMove(e.shiftKey ? -1 : 1);
                }
            };
            var minRemover_1 = addEvent(minInput, 'keydown', keydownHandler);
            var maxRemover_1 = addEvent(maxInput, 'keydown', keydownHandler);
            this.removeInputKeydownHandler = function () {
                minRemover_1();
                maxRemover_1();
            };
        }
    },
    /**
     * @private
     */
    onInputNavTerminate: function () {
        var rangeSel = (this.chart.rangeSelector || {});
        if (rangeSel.maxInput) {
            rangeSel.hideInput('max');
        }
        if (rangeSel.minInput) {
            rangeSel.hideInput('min');
        }
        if (this.removeInputKeydownHandler) {
            this.removeInputKeydownHandler();
            delete this.removeInputKeydownHandler;
        }
    },
    /**
     * @private
     */
    initDropdownNav: function () {
        var _this = this;
        var chart = this.chart;
        var rangeSelector = chart.rangeSelector;
        var dropdown = rangeSelector === null || rangeSelector === void 0 ? void 0 : rangeSelector.dropdown;
        if (rangeSelector && dropdown) {
            chart.setFocusToElement(rangeSelector.buttonGroup, dropdown);
            if (this.removeDropdownKeydownHandler) {
                this.removeDropdownKeydownHandler();
            }
            // Tab-press with dropdown focused does not propagate to chart
            // automatically, so we manually catch and handle it when relevant.
            this.removeDropdownKeydownHandler = addEvent(dropdown, 'keydown', function (e) {
                var _a, _b;
                var isTab = (e.which || e.keyCode) === _this.keyCodes.tab;
                if (isTab) {
                    e.preventDefault();
                    e.stopPropagation();
                    (_a = chart.accessibility) === null || _a === void 0 ? void 0 : _a.keyboardNavigation.tabindexContainer.focus();
                    (_b = chart.accessibility) === null || _b === void 0 ? void 0 : _b.keyboardNavigation[e.shiftKey ? 'prev' : 'next']();
                }
            });
        }
    },
    /**
     * Get navigation for the range selector buttons.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object.
     */
    getRangeSelectorButtonNavigation: function () {
        var chart = this.chart;
        var keys = this.keyCodes;
        var component = this;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [
                    [keys.left, keys.right, keys.up, keys.down],
                    function (keyCode) {
                        return component.onButtonNavKbdArrowKey(this, keyCode);
                    }
                ],
                [
                    [keys.enter, keys.space],
                    function () {
                        return component.onButtonNavKbdClick(this);
                    }
                ]
            ],
            validate: function () {
                var _a, _b;
                return !!((_b = (_a = chart.rangeSelector) === null || _a === void 0 ? void 0 : _a.buttons) === null || _b === void 0 ? void 0 : _b.length);
            },
            init: function (direction) {
                var rangeSelector = chart.rangeSelector;
                if (rangeSelector === null || rangeSelector === void 0 ? void 0 : rangeSelector.hasVisibleDropdown) {
                    component.initDropdownNav();
                }
                else if (rangeSelector) {
                    var lastButtonIx = rangeSelector.buttons.length - 1;
                    chart.highlightRangeSelectorButton(direction > 0 ? 0 : lastButtonIx);
                }
            },
            terminate: function () {
                if (component.removeDropdownKeydownHandler) {
                    component.removeDropdownKeydownHandler();
                    delete component.removeDropdownKeydownHandler;
                }
            }
        });
    },
    /**
     * Get navigation for the range selector input boxes.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler}
     *         The module object.
     */
    getRangeSelectorInputNavigation: function () {
        var chart = this.chart;
        var component = this;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [],
            validate: function () {
                return shouldRunInputNavigation(chart);
            },
            init: function (direction) {
                component.onInputNavInit(direction);
            },
            terminate: function () {
                component.onInputNavTerminate();
            }
        });
    },
    /**
     * Get keyboard navigation handlers for this component.
     * @return {Array<Highcharts.KeyboardNavigationHandler>}
     *         List of module objects.
     */
    getKeyboardNavigation: function () {
        return [
            this.getRangeSelectorButtonNavigation(),
            this.getRangeSelectorInputNavigation()
        ];
    },
    /**
     * Remove component traces
     */
    destroy: function () {
        var _a;
        if (this.removeDropdownKeydownHandler) {
            this.removeDropdownKeydownHandler();
        }
        if (this.removeInputKeydownHandler) {
            this.removeInputKeydownHandler();
        }
        (_a = this.announcer) === null || _a === void 0 ? void 0 : _a.destroy();
    }
});
export default RangeSelectorComponent;
