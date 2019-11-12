/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Extend SVG and Chart classes with focus border capabilities.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
var addEvent = H.addEvent;

import U from '../../parts/Utilities.js';
var extend = U.extend,
    pick = U.pick;

declare global {
    namespace Highcharts {
        interface Chart {
            focusElement?: SVGElement;
            /** @requires modules/accessibility */
            setFocusToElement(
                svgElement: SVGElement,
                focusElement?: (HTMLDOMElement|SVGDOMElement)
            ): void;
        }
        interface SVGElement {
            addFocusBorder(margin: number, style: CSSObject): void;
            removeFocusBorder(): void;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

/*
 * Add focus border functionality to SVGElements. Draws a new rect on top of
 * element around its bounding box. This is used by multiple components.
 */
extend(H.SVGElement.prototype, {

    /**
     * @private
     * @function Highcharts.SVGElement#addFocusBorder
     *
     * @param {number} margin
     *
     * @param {Highcharts.CSSObject} style
     */
    addFocusBorder: function (
        this: Highcharts.SVGElement,
        margin: number,
        style: Highcharts.CSSObject
    ): void {
        // Allow updating by just adding new border
        if (this.focusBorder) {
            this.removeFocusBorder();
        }
        // Add the border rect
        var bb = this.getBBox(),
            pad = pick(margin, 3);

        bb.x += this.translateX ? this.translateX : 0;
        bb.y += this.translateY ? this.translateY : 0;

        this.focusBorder = this.renderer.rect(
            bb.x - pad,
            bb.y - pad,
            bb.width + 2 * pad,
            bb.height + 2 * pad,
            style && style.borderRadius as any
        )
            .addClass('highcharts-focus-border')
            .attr({
                zIndex: 99
            })
            .add(this.parentGroup);

        if (!this.renderer.styledMode) {
            this.focusBorder.attr({
                stroke: style && style.stroke,
                'stroke-width': style && style.strokeWidth
            });
        }
    },

    /**
     * @private
     * @function Highcharts.SVGElement#removeFocusBorder
     */
    removeFocusBorder: function (this: Highcharts.SVGElement): void {
        if (this.focusBorder) {
            this.focusBorder.destroy();
            delete this.focusBorder;
        }
    }
});


/**
 * Set chart's focus to an SVGElement. Calls focus() on it, and draws the focus
 * border. This is used by multiple components.
 *
 * @private
 * @function Highcharts.Chart#setFocusToElement
 *
 * @param {Highcharts.SVGElement} svgElement
 *        Element to draw the border around.
 *
 * @param {SVGDOMElement|HTMLDOMElement} [focusElement]
 *        If supplied, it draws the border around svgElement and sets the focus
 *        to focusElement.
 */
H.Chart.prototype.setFocusToElement = function (
    svgElement: Highcharts.SVGElement,
    focusElement?: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement)
): void {
    var focusBorderOptions: (
            Highcharts.AccessibilityKeyboardNavigationFocusBorderOptions
        ) = (this.options.accessibility as any).keyboardNavigation.focusBorder,
        browserFocusElement = focusElement || svgElement.element;

    // Set browser focus if possible
    if (
        browserFocusElement &&
        browserFocusElement.focus
    ) {
        // If there is no focusin-listener, add one to work around Edge issue
        // where Narrator is not reading out points despite calling focus().
        if (!(
            (browserFocusElement as any).hcEvents &&
            (browserFocusElement as any).hcEvents.focusin
        )) {
            addEvent(browserFocusElement, 'focusin', function (): void {});
        }

        browserFocusElement.focus();

        // Hide default focus ring
        if (focusBorderOptions.hideBrowserFocusOutline) {
            browserFocusElement.style.outline = 'none';
        }
    }
    if (focusBorderOptions.enabled) {
        // Remove old focus border
        if (this.focusElement) {
            this.focusElement.removeFocusBorder();
        }
        // Draw focus border (since some browsers don't do it automatically)
        svgElement.addFocusBorder(focusBorderOptions.margin as any, {
            stroke: (focusBorderOptions.style as any).color,
            strokeWidth: (focusBorderOptions.style as any).lineWidth,
            borderRadius: (focusBorderOptions.style as any).borderRadius
        });
        this.focusElement = svgElement;
    }
};
