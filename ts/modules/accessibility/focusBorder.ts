/* *
 *
 *  (c) 2009-2020 Øystein Moseng
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
import U from '../../parts/Utilities.js';
const {
    addEvent,
    extend,
    pick
} = U;

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
            focusBorder?: SVGElement;
            /** @requires modules/accessibility */
            addFocusBorder(margin: number, style: CSSObject): void;
            /** @requires modules/accessibility */
            removeFocusBorder(): void;
        }
    }
}

interface TextAnchorCorrectionObject {
    x: number;
    y: number;
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
        const bb = this.getBBox(),
            pad = pick(margin, 3);

        bb.x += this.translateX ? this.translateX : 0;
        bb.y += this.translateY ? this.translateY : 0;

        let borderPosX = bb.x - pad,
            borderPosY = bb.y - pad,
            borderWidth = bb.width + 2 * pad,
            borderHeight = bb.height + 2 * pad;

        // For text elements, apply x and y offset, #11397.
        /**
         * @private
         * @function
         *
         * @param {Highcharts.SVGElement} text
         *
         * @return {TextAnchorCorrectionObject}
         */
        function getTextCorrection(text: Highcharts.SVGElement): TextAnchorCorrectionObject {
            let posXCorrection = 0,
                posYCorrection = 0;

            if (text.attr('text-anchor') === 'middle') {
                posXCorrection = H.isFirefox && text.rotation ? 0.25 : 0.5;
                posYCorrection = H.isFirefox && !text.rotation ? 0.75 : 0.5;
            } else if (!text.rotation) {
                posYCorrection = 0.75;
            } else {
                posXCorrection = 0.25;
                posYCorrection *= (H.isFirefox ? 2 : 0);
            }

            return {
                x: posXCorrection,
                y: posYCorrection
            };
        }

        if (this.element.nodeName === 'text' || this.element.nodeName === 'g') {
            const isLabel = this.element.nodeName === 'g',
                isRotated = !!this.rotation,
                correction = !isLabel ? getTextCorrection(this) :
                    {
                        x: isRotated ? 1 : 0,
                        y: 0
                    };

            borderPosX = +this.attr('x') - (bb.width * correction.x) - pad;
            borderPosY = +this.attr('y') - (bb.height * correction.y) - pad;

            if (isLabel && isRotated) {
                [borderWidth, borderHeight] = [borderHeight, borderWidth];
                borderPosX = +this.attr('x') - (bb.height * correction.x) - pad;
                borderPosY = +this.attr('y') - (bb.width * correction.y) - pad;
            }
        }

        this.focusBorder = this.renderer.rect(
            borderPosX,
            borderPosY,
            borderWidth,
            borderHeight,
            parseInt((style && style.borderRadius || 0).toString(), 10)
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
    this: Highcharts.AccessibilityChart,
    svgElement: Highcharts.SVGElement,
    focusElement?: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement)
): void {
    var focusBorderOptions: (
            Highcharts.AccessibilityKeyboardNavigationFocusBorderOptions
        ) = this.options.accessibility.keyboardNavigation.focusBorder,
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
        svgElement.addFocusBorder(focusBorderOptions.margin, {
            stroke: focusBorderOptions.style.color,
            strokeWidth: focusBorderOptions.style.lineWidth,
            borderRadius: focusBorderOptions.style.borderRadius
        });
        this.focusElement = svgElement;
    }
};
