/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for the range selector.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import U from '../../../parts/Utilities.js';
var extend = U.extend;

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';

import ChartUtilities from '../utils/chartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;

import HTMLUtilities from '../utils/htmlUtilities.js';
var setElAttrs = HTMLUtilities.setElAttrs;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class RangeSelectorComponent extends AccessibilityComponent {
            public constructor ();
            public getKeyboardNavigation(): Array<KeyboardNavigationHandler>;
            public getRangeSelectorButtonNavigation(
            ): KeyboardNavigationHandler;
            public getRangeSelectorInputNavigation(): KeyboardNavigationHandler;
            public onButtonNavKbdArrowKey(
                keyboardNavigationHandler: KeyboardNavigationHandler,
                keyCode: number
            ): number;
            public onButtonNavKbdClick(keyboardNavigationHandler: KeyboardNavigationHandler): number;
            public onChartUpdate(): void;
            public onInputKbdMove(
                keyboardNavigationHandler: KeyboardNavigationHandler,
                direction: number
            ): number;
            public onInputNavInit(direction: number): void;
            public onInputNavTerminate(): void;
            public setRangeButtonAttrs(button: SVGElement): void;
            public setRangeInputAttrs(
                input: HTMLDOMElement,
                langKey: string
            ): void;
        }
        interface Chart {
            highlightedInputRangeIx?: number;
            highlightedRangeSelectorItemIx?: number;
            oldRangeSelectorItemState?: number;
            /** @requires modules/accessibility */
            highlightRangeSelectorButton(ix: number): boolean;
        }
        interface RangeSelector {
            maxInput?: HTMLDOMElement;
            minInput?: HTMLDOMElement;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function shouldRunInputNavigation(chart: Highcharts.Chart): boolean {
    var inputVisible = (
        chart.rangeSelector &&
        chart.rangeSelector.inputGroup &&
        chart.rangeSelector.inputGroup.element
            .getAttribute('visibility') !== 'hidden'
    );

    return (
        inputVisible &&
        (chart.options.rangeSelector as any).inputEnabled !== false &&
        (chart.rangeSelector as any).minInput &&
        (chart.rangeSelector as any).maxInput
    );
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
H.Chart.prototype.highlightRangeSelectorButton = function (
    ix: number
): boolean {
    var buttons: Array<Highcharts.SVGElement> = (this.rangeSelector as any).buttons,
        curSelectedIx = this.highlightedRangeSelectorItemIx;

    // Deselect old
    if (typeof curSelectedIx !== 'undefined' && buttons[curSelectedIx]) {
        buttons[curSelectedIx].setState(
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
var RangeSelectorComponent: typeof Highcharts.RangeSelectorComponent =
    function (): void {} as any;
RangeSelectorComponent.prototype = new (AccessibilityComponent as any)();
extend(RangeSelectorComponent.prototype, /** @lends Highcharts.RangeSelectorComponent */ { // eslint-disable-line

    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function (this: Highcharts.RangeSelectorComponent): void {
        var chart = this.chart,
            component = this,
            rangeSelector = chart.rangeSelector;

        if (!rangeSelector) {
            return;
        }

        if (rangeSelector.buttons && rangeSelector.buttons.length) {
            rangeSelector.buttons.forEach(function (
                button: Highcharts.SVGElement
            ): void {
                unhideChartElementFromAT(chart, button.element);
                component.setRangeButtonAttrs(button);
            });
        }

        // Make sure input boxes are accessible and focusable
        if (rangeSelector.maxInput && rangeSelector.minInput) {
            ['minInput', 'maxInput'].forEach(function (
                key: string,
                i: number
            ): void {
                var input = (rangeSelector as any)[key];
                if (input) {
                    unhideChartElementFromAT(chart, input);
                    component.setRangeInputAttrs(
                        input,
                        'accessibility.rangeSelector.' + (i ? 'max' : 'min') +
                            'InputLabel'
                    );
                }
            });
        }
    },


    /**
     * @private
     * @param {Highcharts.SVGElement} button
     */
    setRangeButtonAttrs: function (
        this: Highcharts.RangeSelectorComponent,
        button: Highcharts.SVGElement
    ): void {
        var chart = this.chart,
            label = chart.langFormat(
                'accessibility.rangeSelector.buttonText',
                {
                    chart: chart,
                    buttonText: button.text && button.text.textStr
                }
            );

        setElAttrs(button.element, {
            tabindex: -1,
            role: 'button',
            'aria-label': label
        });
    },


    /**
     * @private
     */
    setRangeInputAttrs: function (
        this: Highcharts.RangeSelectorComponent,
        input: Highcharts.HTMLDOMElement,
        langKey: string
    ): void {
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
    getRangeSelectorButtonNavigation: function (
        this: Highcharts.RangeSelectorComponent
    ): Highcharts.KeyboardNavigationHandler {
        var chart = this.chart,
            keys = this.keyCodes,
            component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [keys.left, keys.right, keys.up, keys.down],
                    function (
                        this: Highcharts.KeyboardNavigationHandler,
                        keyCode: number
                    ): number {
                        return component.onButtonNavKbdArrowKey(this, keyCode);
                    }
                ],
                [
                    [keys.enter, keys.space],
                    function (
                        this: Highcharts.KeyboardNavigationHandler
                    ): number {
                        return component.onButtonNavKbdClick(this);
                    }
                ]
            ],

            validate: function (): (number|undefined) {
                var hasRangeSelector = chart.rangeSelector &&
                    chart.rangeSelector.buttons &&
                    chart.rangeSelector.buttons.length;
                return hasRangeSelector;
            },

            init: function (direction: number): void {
                var lastButtonIx = (
                    (chart.rangeSelector as any).buttons.length - 1
                );
                chart.highlightRangeSelectorButton(
                    direction > 0 ? 0 : lastButtonIx
                );
            }
        });
    },


    /**
     * @private
     * @param {Highcharts.KeyboardNavigationHandler} keyboardNavigationHandler
     * @param {number} keyCode
     * @return {number} Response code
     */
    onButtonNavKbdArrowKey: function (
        this: Highcharts.RangeSelectorComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler,
        keyCode: number
    ): number {
        var response = keyboardNavigationHandler.response,
            keys = this.keyCodes,
            chart = this.chart,
            wrapAround = chart.options.accessibility
                .keyboardNavigation.wrapAround,
            direction = (
                keyCode === keys.left || keyCode === keys.up
            ) ? -1 : 1,
            didHighlight = chart.highlightRangeSelectorButton(
                (chart.highlightedRangeSelectorItemIx as any) + direction
            );

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
    onButtonNavKbdClick: function (
        this: Highcharts.RangeSelectorComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler
    ): number {
        var response = keyboardNavigationHandler.response,
            chart = this.chart,
            wasDisabled = chart.oldRangeSelectorItemState === 3;

        if (!wasDisabled) {
            this.fakeClickEvent(
                (chart.rangeSelector as any).buttons[
                    chart.highlightedRangeSelectorItemIx as any
                ].element
            );
        }

        return response.success;
    },


    /**
     * Get navigation for the range selector input boxes.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler}
     *         The module object.
     */
    getRangeSelectorInputNavigation: function (
        this: Highcharts.RangeSelectorComponent
    ): Highcharts.KeyboardNavigationHandler {
        var chart = this.chart,
            keys = this.keyCodes,
            component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [
                [
                    [
                        keys.tab, keys.up, keys.down
                    ], function (
                        this: Highcharts.KeyboardNavigationHandler,
                        keyCode: number,
                        e: KeyboardEvent
                    ): number {
                        var direction = (
                            keyCode === keys.tab && e.shiftKey ||
                            keyCode === keys.up
                        ) ? -1 : 1;

                        return component.onInputKbdMove(this, direction);
                    }
                ]
            ],

            validate: function (): boolean {
                return shouldRunInputNavigation(chart);
            },

            init: function (direction: number): void {
                component.onInputNavInit(direction);
            },

            terminate: function (): void {
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
    onInputKbdMove: function (
        this: Highcharts.RangeSelectorComponent,
        keyboardNavigationHandler: Highcharts.KeyboardNavigationHandler,
        direction: number
    ): number {
        var chart: Highcharts.Chart = this.chart as any,
            response = keyboardNavigationHandler.response,
            newIx = chart.highlightedInputRangeIx =
                (chart.highlightedInputRangeIx as any) + direction,
            newIxOutOfRange = newIx > 1 || newIx < 0;

        if (newIxOutOfRange) {
            return response[direction > 0 ? 'next' : 'prev'];
        }

        (chart.rangeSelector as any)[newIx ? 'maxInput' : 'minInput'].focus();
        return response.success;
    },


    /**
     * @private
     * @param {number} direction
     */
    onInputNavInit: function (
        this: Highcharts.RangeSelectorComponent,
        direction: number
    ): void {
        var chart: Highcharts.Chart = this.chart as any,
            buttonIxToHighlight = direction > 0 ? 0 : 1;

        chart.highlightedInputRangeIx = buttonIxToHighlight;
        (chart.rangeSelector as any)[
            buttonIxToHighlight ? 'maxInput' : 'minInput'
        ].focus();
    },


    /**
     * @private
     */
    onInputNavTerminate: function (
        this: Highcharts.RangeSelectorComponent
    ): void {
        var rangeSel: Highcharts.RangeSelector = (
            (this.chart as any).rangeSelector || {}
        );

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
    getKeyboardNavigation: function (
        this: Highcharts.RangeSelectorComponent
    ): Array<Highcharts.KeyboardNavigationHandler> {
        return [
            this.getRangeSelectorButtonNavigation(),
            this.getRangeSelectorInputNavigation()
        ];
    }

});

export default RangeSelectorComponent;
