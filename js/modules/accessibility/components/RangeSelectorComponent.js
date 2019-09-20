/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for the range selector.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import U from '../../../parts/Utilities.js';
var extend = U.extend;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';


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
    var buttons = this.rangeSelector.buttons;

    // Deselect old
    if (buttons[this.highlightedRangeSelectorItemIx]) {
        buttons[this.highlightedRangeSelectorItemIx].setState(
            this.oldRangeSelectorItemState || 0
        );
    }
    // Select new
    this.highlightedRangeSelectorItemIx = ix;
    if (buttons[ix]) {
        this.setFocusToElement(buttons[ix].box, buttons[ix].element);
        this.oldRangeSelectorItemState = buttons[ix].state;
        buttons[ix].setState(2);
        return true;
    }
    return false;
};


/**
 * The RangeSelectorComponent class
 *
 * @private
 * @class
 * @name Highcharts.RangeSelectorComponent
 */
var RangeSelectorComponent = function () {};
RangeSelectorComponent.prototype = new AccessibilityComponent();
extend(RangeSelectorComponent.prototype, /** @lends Highcharts.RangeSelectorComponent */ { // eslint-disable-line

    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        var chart = this.chart,
            component = this,
            rangeSelector = chart.rangeSelector;

        if (!rangeSelector) {
            return;
        }

        // Make sure buttons are accessible and focusable
        if (rangeSelector.buttons && rangeSelector.buttons.length) {
            rangeSelector.buttons.forEach(function (button) {
                component.unhideElementFromScreenReaders(button.element);
                button.element.setAttribute('tabindex', '-1');
                button.element.setAttribute('role', 'button');
                button.element.setAttribute(
                    'aria-label',
                    chart.langFormat(
                        'accessibility.rangeSelectorButton',
                        {
                            chart: chart,
                            buttonText: button.text && button.text.textStr
                        }
                    )
                );
            });
        }

        // Make sure input boxes are accessible and focusable
        if (rangeSelector.maxInput && rangeSelector.minInput) {
            ['minInput', 'maxInput'].forEach(function (key, i) {
                if (rangeSelector[key]) {
                    component.unhideElementFromScreenReaders(
                        rangeSelector[key]
                    );
                    rangeSelector[key].setAttribute('tabindex', '-1');
                    rangeSelector[key].setAttribute('role', 'textbox');
                    rangeSelector[key].setAttribute(
                        'aria-label',
                        chart.langFormat(
                            'accessibility.rangeSelector' +
                                (i ? 'MaxInput' : 'MinInput'), { chart: chart }
                        )
                    );
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
        var chart = this.chart,
            keys = this.keyCodes,
            a11yOptions = chart.options.accessibility,
            component = this;

        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Left/Right/Up/Down
                [[
                    keys.left, keys.right, keys.up, keys.down
                ], function (keyCode) {
                    var direction = (
                        keyCode === keys.left || keyCode === keys.up
                    ) ? -1 : 1;

                    // Try to highlight next/prev button
                    if (
                        !chart.highlightRangeSelectorButton(
                            chart.highlightedRangeSelectorItemIx + direction
                        )
                    ) {
                        // If we failed, handle wrap around/move
                        if (a11yOptions.keyboardNavigation.wrapAround) {
                            this.init(direction);
                            return this.response.success;
                        }
                        return this.response[direction > 0 ? 'next' : 'prev'];
                    }
                }],

                // Enter/Spacebar
                [[
                    keys.enter, keys.space
                ], function () {
                    // Don't allow click if button used to be disabled
                    if (chart.oldRangeSelectorItemState !== 3) {
                        component.fakeClickEvent(
                            chart.rangeSelector.buttons[
                                chart.highlightedRangeSelectorItemIx
                            ].element
                        );
                    }
                }]
            ],

            // Only run this module if we have range selector
            validate: function () {
                return chart.rangeSelector && chart.rangeSelector.buttons &&
                    chart.rangeSelector.buttons.length;
            },

            // Focus first/last button
            init: function (direction) {
                chart.highlightRangeSelectorButton(
                    direction > 0 ? 0 : chart.rangeSelector.buttons.length - 1
                );
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
        var chart = this.chart,
            keys = this.keyCodes;

        return new KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Tab/Up/Down
                [[
                    keys.tab, keys.up, keys.down
                ], function (keyCode, e) {
                    var direction = (
                            keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.up
                        ) ? -1 : 1,

                        newIx = chart.highlightedInputRangeIx =
                            chart.highlightedInputRangeIx + direction;

                    // Try to highlight next/prev item in list.
                    if (newIx > 1 || newIx < 0) { // Out of range
                        return this.response[direction > 0 ? 'next' : 'prev'];
                    }
                    chart.rangeSelector[
                        newIx ? 'maxInput' : 'minInput'
                    ].focus();
                    return this.response.success;
                }]
            ],

            // Only run if we have range selector with input boxes
            validate: function () {
                var inputVisible = (
                    chart.rangeSelector &&
                    chart.rangeSelector.inputGroup &&
                    chart.rangeSelector.inputGroup.element
                        .getAttribute('visibility') !== 'hidden'
                );

                return (
                    inputVisible &&
                    chart.options.rangeSelector.inputEnabled !== false &&
                    chart.rangeSelector.minInput &&
                    chart.rangeSelector.maxInput
                );
            },

            // Highlight first/last input box
            init: function (direction) {
                chart.highlightedInputRangeIx = direction > 0 ? 0 : 1;
                chart.rangeSelector[
                    chart.highlightedInputRangeIx ? 'maxInput' : 'minInput'
                ].focus();
            },

            // Hide HTML element when leaving boxes
            terminate: function () {
                var rangeSel = chart.rangeSelector;
                if (rangeSel && rangeSel.maxInput && rangeSel.minInput) {
                    rangeSel.hideInput('max');
                    rangeSel.hideInput('min');
                }
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
    }

});

export default RangeSelectorComponent;
