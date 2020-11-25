/* *
 *
 *  (c) 2009-2020 Øystein Moseng
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
var extend = U.extend;
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
H.addEvent(RangeSelector, 'afterBtnClick', function () {
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
        if ((_a = rangeSelector.buttons) === null || _a === void 0 ? void 0 : _a.length) {
            rangeSelector.buttons.forEach(function (button) {
                unhideChartElementFromAT(chart, button.element);
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
            role: 'textbox',
            'aria-label': chart.langFormat(langKey, { chart: chart })
        });
    },
    /**
     * Get navigation for the range selector buttons.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object.
     */
    getRangeSelectorButtonNavigation: function () {
        var chart = this.chart, keys = this.keyCodes, component = this;
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
                var hasRangeSelector = chart.rangeSelector &&
                    chart.rangeSelector.buttons &&
                    chart.rangeSelector.buttons.length;
                return hasRangeSelector;
            },
            init: function (direction) {
                var lastButtonIx = (chart.rangeSelector.buttons.length - 1);
                chart.highlightRangeSelectorButton(direction > 0 ? 0 : lastButtonIx);
            }
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
     * Get navigation for the range selector input boxes.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler}
     *         The module object.
     */
    getRangeSelectorInputNavigation: function () {
        var chart = this.chart, keys = this.keyCodes, component = this;
        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [
                    [
                        keys.tab, keys.up, keys.down
                    ],
                    function (keyCode, e) {
                        var direction = (keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.up) ? -1 : 1;
                        return component.onInputKbdMove(this, direction);
                    }
                ]
            ],
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
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} direction
     * @return {number} Response code
     */
    onInputKbdMove: function (keyboardNavigationHandler, direction) {
        var chart = this.chart, response = keyboardNavigationHandler.response, newIx = chart.highlightedInputRangeIx =
            chart.highlightedInputRangeIx + direction, newIxOutOfRange = newIx > 1 || newIx < 0;
        if (newIxOutOfRange) {
            return response[direction > 0 ? 'next' : 'prev'];
        }
        chart.rangeSelector[newIx ? 'maxInput' : 'minInput'].focus();
        return response.success;
    },
    /**
     * @private
     * @param {number} direction
     */
    onInputNavInit: function (direction) {
        var chart = this.chart, buttonIxToHighlight = direction > 0 ? 0 : 1;
        chart.highlightedInputRangeIx = buttonIxToHighlight;
        chart.rangeSelector[buttonIxToHighlight ? 'maxInput' : 'minInput'].focus();
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
        (_a = this.announcer) === null || _a === void 0 ? void 0 : _a.destroy();
    }
});
export default RangeSelectorComponent;
