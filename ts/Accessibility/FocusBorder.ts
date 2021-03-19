/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Extend SVG and Chart classes with focus border capabilities.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    DOMElementType
} from '../Core/Renderer/DOMElementType';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import H from '../Core/Globals.js';
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';
import SVGLabel from '../Core/Renderer/SVG/SVGLabel.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    extend,
    pick
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        focusElement?: SVGElement;
        /** @requires modules/accessibility */
        renderFocusBorder(): void;
        /** @requires modules/accessibility */
        setFocusToElement(
            svgElement: SVGElement,
            focusElement?: DOMElementType
        ): void;
    }
}

declare global {
    namespace Highcharts {
        interface SVGElement {
            focusBorder?: SVGElement;
            /** @requires modules/accessibility */
            addFocusBorder(margin: number, attribs: SVGAttributes): void;
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


// Attributes that trigger a focus border update
const svgElementBorderUpdateTriggers = [
    'x', 'y', 'transform', 'width', 'height', 'r', 'd', 'stroke-width'
];


/**
 * Add hook to destroy focus border if SVG element is destroyed, unless
 * hook already exists.
 * @private
 * @param el Element to add destroy hook to
 */
function addDestroyFocusBorderHook(el: SVGElement): void {
    if (el.focusBorderDestroyHook) {
        return;
    }

    const origDestroy = el.destroy;

    el.destroy = function (): undefined {
        el.focusBorder?.destroy?.();
        return origDestroy.apply(el, arguments);
    };

    el.focusBorderDestroyHook = origDestroy;
}


/**
 * Remove hook from SVG element added by addDestroyFocusBorderHook, if
 * existing.
 * @private
 * @param el Element to remove destroy hook from
 */
function removeDestroyFocusBorderHook(el: SVGElement): void {
    if (!el.focusBorderDestroyHook) {
        return;
    }

    el.destroy = el.focusBorderDestroyHook;

    delete el.focusBorderDestroyHook;
}


/**
 * Add hooks to update the focus border of an element when the element
 * size/position is updated, unless already added.
 * @private
 * @param el Element to add update hooks to
 * @param updateParams Parameters to pass through to addFocusBorder when updating.
 */
function addUpdateFocusBorderHooks(
    el: SVGElement,
    ...updateParams: any[]
): void {
    if (el.focusBorderUpdateHooks) {
        return;
    }

    el.focusBorderUpdateHooks = {};

    svgElementBorderUpdateTriggers.forEach((trigger): void => {
        const setterKey = trigger + 'Setter';
        const origSetter = el[setterKey] || el._defaultSetter;

        el.focusBorderUpdateHooks[setterKey] = origSetter;

        el[setterKey] = function (): unknown {
            const ret = origSetter.apply(el, arguments);
            el.addFocusBorder.apply(el, updateParams as any);
            return ret;
        };
    });
}


/**
 * Remove hooks from SVG element added by addUpdateFocusBorderHooks, if
 * existing.
 * @private
 * @param el Element to remove update hooks from
 */
function removeUpdateFocusBorderHooks(el: SVGElement): void {
    if (!el.focusBorderUpdateHooks) {
        return;
    }

    Object.keys(el.focusBorderUpdateHooks).forEach((setterKey): void => {
        const origSetter = el.focusBorderUpdateHooks[setterKey];
        if (origSetter === el._defaultSetter) {
            delete el[setterKey];
        } else {
            el[setterKey] = origSetter;
        }
    });

    delete el.focusBorderUpdateHooks;
}


/*
 * Add focus border functionality to SVGElements. Draws a new rect on top of
 * element around its bounding box. This is used by multiple components.
 */
extend(SVGElement.prototype, {

    /**
     * @private
     * @function Highcharts.SVGElement#addFocusBorder
     *
     * @param {number} margin
     *
     * @param {SVGAttributes} attribs
     */
    addFocusBorder: function (
        this: SVGElement,
        margin: number,
        attribs: SVGAttributes
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
        function getTextAnchorCorrection(text: SVGElement): TextAnchorCorrectionObject {
            let posXCorrection = 0,
                posYCorrection = 0;

            if (text.attr('text-anchor') === 'middle') {
                posXCorrection = H.isFirefox && text.rotation ? 0.25 : 0.5;
                posYCorrection = H.isFirefox && !text.rotation ? 0.75 : 0.5;
            } else if (!text.rotation) {
                posYCorrection = 0.75;
            } else {
                posXCorrection = 0.25;
            }

            return {
                x: posXCorrection,
                y: posYCorrection
            };
        }

        const isLabel = this instanceof SVGLabel;
        if (this.element.nodeName === 'text' || isLabel) {
            const isRotated = !!this.rotation;
            const correction = !isLabel ? getTextAnchorCorrection(this) :
                {
                    x: isRotated ? 1 : 0,
                    y: 0
                };
            const attrX = +this.attr('x');
            const attrY = +this.attr('y');

            if (!isNaN(attrX)) {
                borderPosX = attrX - (bb.width * correction.x) - pad;
            }
            if (!isNaN(attrY)) {
                borderPosY = attrY - (bb.height * correction.y) - pad;
            }

            if (isLabel && isRotated) {
                const temp = borderWidth;
                borderWidth = borderHeight;
                borderHeight = temp;
                if (!isNaN(attrX)) {
                    borderPosX = attrX - (bb.height * correction.x) - pad;
                }
                if (!isNaN(attrY)) {
                    borderPosY = attrY - (bb.width * correction.y) - pad;
                }
            }
        }

        this.focusBorder = this.renderer.rect(
            borderPosX,
            borderPosY,
            borderWidth,
            borderHeight,
            parseInt((attribs && attribs.r || 0).toString(), 10)
        )
            .addClass('highcharts-focus-border')
            .attr({
                zIndex: 99
            })
            .add(this.parentGroup);

        if (!this.renderer.styledMode) {
            this.focusBorder.attr({
                stroke: attribs && attribs.stroke,
                'stroke-width': attribs && attribs.strokeWidth
            });
        }

        addUpdateFocusBorderHooks(this, margin, attribs);
        addDestroyFocusBorderHook(this);
    },

    /**
     * @private
     * @function Highcharts.SVGElement#removeFocusBorder
     */
    removeFocusBorder: function (this: SVGElement): void {
        removeUpdateFocusBorderHooks(this);
        removeDestroyFocusBorderHook(this);

        if (this.focusBorder) {
            this.focusBorder.destroy();
            delete this.focusBorder;
        }
    }
});


/**
 * Redraws the focus border on the currently focused element.
 *
 * @private
 * @function Highcharts.Chart#renderFocusBorder
 */
H.Chart.prototype.renderFocusBorder = function (this: Highcharts.AccessibilityChart): void {
    const focusElement = this.focusElement,
        focusBorderOptions: (
            Highcharts.AccessibilityKeyboardNavigationFocusBorderOptions
        ) = this.options.accessibility.keyboardNavigation.focusBorder;

    if (focusElement) {
        focusElement.removeFocusBorder();

        if (focusBorderOptions.enabled) {
            focusElement.addFocusBorder(focusBorderOptions.margin, {
                stroke: focusBorderOptions.style.color,
                'stroke-width': focusBorderOptions.style.lineWidth,
                r: focusBorderOptions.style.borderRadius
            });
        }
    }
};


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
    svgElement: SVGElement,
    focusElement?: DOMElementType
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

    if (this.focusElement) {
        this.focusElement.removeFocusBorder();
    }

    this.focusElement = svgElement;
    this.renderFocusBorder();
};
