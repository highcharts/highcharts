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

import type Chart from '../../Core/Chart/Chart';
import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
const {
    unhideChartElementFromAT,
    getAxisRangeDescription
} = ChartUtilities;
import Announcer from '../Utils/Announcer.js';
import H from '../../Core/Globals.js';
import HTMLUtilities from '../Utils/HTMLUtilities.js';
const {
    setElAttrs
} = HTMLUtilities;
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import U from '../../Core/Utilities.js';
import RangeSelector from '../../Extensions/RangeSelector.js';
const {
    addEvent,
    extend
} = U;

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        highlightedInputRangeIx?: number;
        highlightedRangeSelectorItemIx?: number;
        oldRangeSelectorItemState?: number;
        /** @requires modules/accessibility */
        highlightRangeSelectorButton(ix: number): boolean;
    }
}

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class RangeSelectorComponent extends AccessibilityComponent {
            public constructor ();
            public announcer: Announcer;
            public getKeyboardNavigation(): Array<KeyboardNavigationHandler>;
            public getRangeSelectorButtonNavigation(
            ): KeyboardNavigationHandler;
            public getRangeSelectorInputNavigation(): KeyboardNavigationHandler;
            public initDropdownNav(): void;
            public onAfterBtnClick(): void;
            public onButtonNavKbdArrowKey(
                keyboardNavigationHandler: KeyboardNavigationHandler,
                keyCode: number
            ): number;
            public onButtonNavKbdClick(keyboardNavigationHandler: KeyboardNavigationHandler): number;
            public onChartUpdate(): void;
            public onInputKbdMove(direction: number): void;
            public onInputNavInit(direction: number): void;
            public onInputNavTerminate(): void;
            public removeDropdownKeydownHandler?: Function;
            public removeInputKeydownHandler?: Function;
            public setDropdownAttrs(): void;
            public setRangeButtonAttrs(button: SVGElement): void;
            public setRangeInputAttrs(
                input: HTMLDOMElement,
                langKey: string
            ): void;
            public updateSelectorVisibility(): void;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function shouldRunInputNavigation(chart: Chart): boolean {
    return Boolean(
        chart.rangeSelector &&
        chart.rangeSelector.inputGroup &&
        chart.rangeSelector.inputGroup.element
            .getAttribute('visibility') !== 'hidden' &&
        (chart.options.rangeSelector as any).inputEnabled !== false &&
        chart.rangeSelector.minInput &&
        chart.rangeSelector.maxInput
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
    const buttons: Array<Highcharts.SVGElement> = this.rangeSelector?.buttons || [];
    const curHighlightedIx = this.highlightedRangeSelectorItemIx;
    const curSelectedIx = this.rangeSelector?.selected;

    // Deselect old
    if (
        typeof curHighlightedIx !== 'undefined' &&
        buttons[curHighlightedIx] &&
        curHighlightedIx !== curSelectedIx
    ) {
        buttons[curHighlightedIx].setState(
            this.oldRangeSelectorItemState || 0
        );
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
addEvent(RangeSelector, 'afterBtnClick', function (): void {
    const component = this.chart.accessibility?.components.rangeSelector;
    return component?.onAfterBtnClick();
});


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
     * Init the component
     * @private
     */
    init: function (this: Highcharts.RangeSelectorComponent): void {
        const chart = this.chart;
        this.announcer = new Announcer(chart, 'polite');
    },


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function (this: Highcharts.RangeSelectorComponent): void {
        const chart = this.chart,
            component = this,
            rangeSelector = chart.rangeSelector;

        if (!rangeSelector) {
            return;
        }

        this.updateSelectorVisibility();
        this.setDropdownAttrs();

        if (rangeSelector.buttons?.length) {
            rangeSelector.buttons.forEach((button): void => {
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
     * Hide buttons from AT when showing dropdown, and vice versa.
     * @private
     */
    updateSelectorVisibility: function (this: Highcharts.RangeSelectorComponent): void {
        const chart = this.chart;
        const rangeSelector = chart.rangeSelector;
        const dropdown = rangeSelector?.dropdown;
        const buttons = rangeSelector?.buttons || [];
        const hideFromAT = (el: Element): void => el.setAttribute('aria-hidden', true);

        if (rangeSelector?.hasVisibleDropdown && dropdown) {
            unhideChartElementFromAT(chart, dropdown);
            buttons.forEach((btn): void => hideFromAT(btn.element));
        } else {
            if (dropdown) {
                hideFromAT(dropdown);
            }
            buttons.forEach((btn): void => unhideChartElementFromAT(chart, btn.element));
        }
    },


    /**
     * Set accessibility related attributes on dropdown element.
     * @private
     */
    setDropdownAttrs: function (this: Highcharts.RangeSelectorComponent): void {
        const chart = this.chart;
        const dropdown = chart.rangeSelector?.dropdown;
        if (dropdown) {
            const label = chart.langFormat('accessibility.rangeSelector.dropdownLabel',
                { rangeTitle: chart.options.lang.rangeSelectorZoom }
            );
            dropdown.setAttribute('aria-label', label);
            dropdown.setAttribute('tabindex', -1);
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
        setElAttrs(button.element, {
            tabindex: -1,
            role: 'button'
        });
    },


    /**
     * @private
     */
    setRangeInputAttrs: function (
        this: Highcharts.RangeSelectorComponent,
        input: HTMLDOMElement,
        langKey: string
    ): void {
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
     * Called whenever a range selector button has been clicked, either by
     * mouse, touch, or kbd/voice/other.
     * @private
     */
    onAfterBtnClick: function (
        this: Highcharts.RangeSelectorComponent
    ): void {
        const chart = this.chart;
        const axisRangeDescription = getAxisRangeDescription(chart.xAxis[0]);
        const announcement = chart.langFormat(
            'accessibility.rangeSelector.clickButtonAnnouncement',
            { chart, axisRangeDescription }
        );

        if (announcement) {
            this.announcer.announce(announcement);
        }
    },


    /**
     * @private
     */
    onInputKbdMove: function (
        this: Highcharts.RangeSelectorComponent,
        direction: number
    ): void {
        const chart = this.chart;
        const rangeSel = chart.rangeSelector;
        const newIx = chart.highlightedInputRangeIx = (chart.highlightedInputRangeIx || 0) + direction;
        const newIxOutOfRange = newIx > 1 || newIx < 0;

        if (newIxOutOfRange) {
            chart.accessibility?.keyboardNavigation.tabindexContainer.focus();
            chart.accessibility?.keyboardNavigation[
                direction < 0 ? 'prev' : 'next'
            ]();
        } else if (rangeSel) {
            const svgEl = rangeSel[newIx ? 'maxDateBox' : 'minDateBox'];
            const inputEl = rangeSel[newIx ? 'maxInput' : 'minInput'];
            if (svgEl && inputEl) {
                chart.setFocusToElement(svgEl, inputEl);
            }
        }
    },


    /**
     * @private
     * @param {number} direction
     */
    onInputNavInit: function (
        this: Highcharts.RangeSelectorComponent,
        direction: number
    ): void {
        const component = this;
        const chart = this.chart;
        const buttonIxToHighlight = direction > 0 ? 0 : 1;
        const rangeSel = chart.rangeSelector;
        const svgEl = rangeSel?.[buttonIxToHighlight ? 'maxDateBox' : 'minDateBox'];
        const minInput = rangeSel?.minInput;
        const maxInput = rangeSel?.maxInput;
        const inputEl = buttonIxToHighlight ? maxInput : minInput;

        chart.highlightedInputRangeIx = buttonIxToHighlight;
        if (svgEl && minInput && maxInput) {
            chart.setFocusToElement(svgEl, inputEl);

            // Tab-press with the input focused does not propagate to chart
            // automatically, so we manually catch and handle it when relevant.
            if (this.removeInputKeydownHandler) {
                this.removeInputKeydownHandler();
            }
            const keydownHandler = (e: KeyboardEvent): void => {
                const isTab = (e.which || e.keyCode) === this.keyCodes.tab;
                if (isTab) {
                    e.preventDefault();
                    e.stopPropagation();
                    component.onInputKbdMove(e.shiftKey ? -1 : 1);
                }
            };
            const minRemover = addEvent(minInput, 'keydown', keydownHandler);
            const maxRemover = addEvent(maxInput, 'keydown', keydownHandler);

            this.removeInputKeydownHandler = (): void => {
                minRemover();
                maxRemover();
            };
        }
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

        if (this.removeInputKeydownHandler) {
            this.removeInputKeydownHandler();
            delete this.removeInputKeydownHandler;
        }
    },


    /**
     * @private
     */
    initDropdownNav: function (this: Highcharts.RangeSelectorComponent): void {
        const chart = this.chart;
        const rangeSelector = chart.rangeSelector;
        const dropdown = rangeSelector?.dropdown;

        if (rangeSelector && dropdown) {
            chart.setFocusToElement(rangeSelector.buttonGroup as any, dropdown);
            if (this.removeDropdownKeydownHandler) {
                this.removeDropdownKeydownHandler();
            }
            // Tab-press with dropdown focused does not propagate to chart
            // automatically, so we manually catch and handle it when relevant.
            this.removeDropdownKeydownHandler = addEvent(dropdown, 'keydown',
                (e: KeyboardEvent): void => {
                    const isTab = (e.which || e.keyCode) === this.keyCodes.tab;
                    if (isTab) {
                        e.preventDefault();
                        e.stopPropagation();
                        chart.accessibility?.keyboardNavigation.tabindexContainer.focus();
                        chart.accessibility?.keyboardNavigation[
                            e.shiftKey ? 'prev' : 'next'
                        ]();
                    }
                });
        }
    },


    /**
     * Get navigation for the range selector buttons.
     * @private
     * @return {Highcharts.KeyboardNavigationHandler} The module object.
     */
    getRangeSelectorButtonNavigation: function (
        this: Highcharts.RangeSelectorComponent
    ): Highcharts.KeyboardNavigationHandler {
        const chart = this.chart;
        const keys = this.keyCodes;
        const component = this;

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

            validate: function (): boolean {
                return !!chart.rangeSelector?.buttons?.length;
            },

            init: function (direction: number): void {
                const rangeSelector = chart.rangeSelector;
                if (rangeSelector?.hasVisibleDropdown) {
                    component.initDropdownNav();
                } else if (rangeSelector) {
                    const lastButtonIx = rangeSelector.buttons.length - 1;
                    chart.highlightRangeSelectorButton(
                        direction > 0 ? 0 : lastButtonIx
                    );
                }
            },

            terminate: function (): void {
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
    getRangeSelectorInputNavigation: function (
        this: Highcharts.RangeSelectorComponent
    ): Highcharts.KeyboardNavigationHandler {
        const chart = this.chart;
        const component = this;

        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [],

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
    },


    /**
     * Remove component traces
     */
    destroy: function (this: Highcharts.RangeSelectorComponent): void {
        if (this.removeDropdownKeydownHandler) {
            this.removeDropdownKeydownHandler();
        }
        if (this.removeInputKeydownHandler) {
            this.removeInputKeydownHandler();
        }
        this.announcer?.destroy();
    }
});

export default RangeSelectorComponent;
