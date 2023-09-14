/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Proxy elements are used to shadow SVG elements in HTML for assistive
 *  technology, such as screen readers or voice input software.
 *
 *  The ProxyElement class represents such an element, and deals with
 *  overlay positioning and mirroring events for the target.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Accessibility from './Accessibility';
import type BBoxObject from '../Core/Renderer/BBoxObject';
import type {
    DOMElementType,
    HTMLDOMElement,
    SVGDOMElement
} from '../Core/Renderer/DOMElementType';
import type HTMLAttributes from '../Core/Renderer/HTML/HTMLAttributes';
import type HTMLElement from '../Core/Renderer/HTML/HTMLElement';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
export type NullableHTMLAttributes = Nullable<HTMLAttributes>;

import H from '../Core/Globals.js';
const { doc } = H;
import U from '../Core/Utilities.js';
const {
    attr,
    css,
    merge
} = U;

import EventProvider from './Utils/EventProvider.js';
import ChartUtilities from './Utils/ChartUtilities.js';
const { fireEventOnWrappedOrUnwrappedElement } = ChartUtilities;
import HTMLUtilities from './Utils/HTMLUtilities.js';
const {
    cloneMouseEvent,
    cloneTouchEvent,
    getFakeMouseEvent,
    removeElement
} = HTMLUtilities;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a proxy element that overlays a target and relays events
 * to its target.
 *
 * @private
 * @class
 */
class ProxyElement {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The proxy element that receives the proxied events.
     */
    public innerElement: HTMLDOMElement;

    /**
     * The entire proxy HTML element container. Note: If the proxy element is
     * not wrapped, this refers to the same element as innerElement.
     */
    public element: HTMLDOMElement;

    private eventProvider: EventProvider;

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        private chart: Accessibility.ChartComposition,
        public target: ProxyElement.Target,
        proxyElementType: keyof HTMLElementTagNameMap = 'button',
        wrapperElementType?: keyof HTMLElementTagNameMap,
        attributes?: NullableHTMLAttributes
    ) {
        this.eventProvider = new EventProvider();

        const innerEl = this.innerElement =
                doc.createElement(proxyElementType),
            wrapperEl = this.element = wrapperElementType ?
                doc.createElement(wrapperElementType) : innerEl;

        if (!chart.styledMode) {
            this.hideElementVisually(innerEl);
        }

        if (wrapperElementType) {
            if (wrapperElementType === 'li' && !chart.styledMode) {
                wrapperEl.style.listStyle = 'none';
            }
            wrapperEl.appendChild(innerEl);
            this.element = wrapperEl;
        }

        this.updateTarget(target, attributes);
    }

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */


    /**
     * Fake a click event on the target.
     */
    public click(): void {
        const pos = this.getTargetPosition();
        pos.x += pos.width / 2;
        pos.y += pos.height / 2;
        const fakeEventObject = getFakeMouseEvent('click', pos);
        fireEventOnWrappedOrUnwrappedElement(
            this.target.click,
            fakeEventObject
        );
    }


    /**
     * Update the target to be proxied. The position and events are updated to
     * match the new target.
     * @param target The new target definition
     * @param attributes New HTML attributes to apply to the proxy. Set an
     * attribute to null to remove.
     */
    public updateTarget(
        target: ProxyElement.Target,
        attributes?: NullableHTMLAttributes
    ): void {
        this.target = target;
        this.updateCSSClassName();
        const attrs = attributes || {};

        Object.keys(attrs).forEach((a): void => {
            if (attrs[a as keyof HTMLAttributes] === null) {
                delete attrs[a as keyof HTMLAttributes];
            }
        });

        const targetAriaLabel = this.getTargetAttr(target.click, 'aria-label');
        attr(this.innerElement, merge(targetAriaLabel ? {
            'aria-label': targetAriaLabel
        } : {}, attrs as HTMLAttributes));

        this.eventProvider.removeAddedEvents();
        this.addProxyEventsToElement(this.innerElement, target.click);
        this.refreshPosition();
    }


    /**
     * Refresh the position of the proxy element to match the current target
     */
    public refreshPosition(): void {
        const bBox = this.getTargetPosition();
        css(this.innerElement, {
            width: (bBox.width || 1) + 'px',
            height: (bBox.height || 1) + 'px',
            left: (Math.round(bBox.x) || 0) + 'px',
            top: (Math.round(bBox.y) || 0) + 'px'
        });
    }


    /**
     * Remove button from DOM, and clear events.
     */
    public remove(): void {
        this.eventProvider.removeAddedEvents();
        removeElement(this.element);
    }


    // -------------------------- private ------------------------------------


    /**
     * Update the CSS class name to match target
     */
    private updateCSSClassName(): void {
        const stringHasNoTooltip = (s: string): boolean => (
            s.indexOf('highcharts-no-tooltip') > -1
        );
        const legend = this.chart.legend;
        const groupDiv = legend.group && legend.group.div;
        const noTooltipOnGroup = stringHasNoTooltip(
            groupDiv && groupDiv.className || ''
        );
        const targetClassName = this.getTargetAttr(
            this.target.click,
            'class'
        ) as string || '';
        const noTooltipOnTarget = stringHasNoTooltip(targetClassName);

        this.innerElement.className = noTooltipOnGroup || noTooltipOnTarget ?
            'highcharts-a11y-proxy-element highcharts-no-tooltip' :
            'highcharts-a11y-proxy-element';
    }


    /**
     * Mirror events for a proxy element to a target
     */
    private addProxyEventsToElement(
        element: HTMLDOMElement,
        target: DOMElementType|SVGElement|HTMLElement
    ): void {
        [
            'click', 'touchstart', 'touchend', 'touchcancel', 'touchmove',
            'mouseover', 'mouseenter', 'mouseleave', 'mouseout'
        ].forEach((evtType: string): void => {
            const isTouchEvent = evtType.indexOf('touch') === 0;

            this.eventProvider.addEvent(
                element,
                evtType,
                (e: MouseEvent | TouchEvent): void => {
                    const clonedEvent = isTouchEvent ?
                        cloneTouchEvent(e as TouchEvent) :
                        cloneMouseEvent(e as MouseEvent);

                    if (target) {
                        fireEventOnWrappedOrUnwrappedElement(
                            target,
                            clonedEvent
                        );
                    }

                    e.stopPropagation();

                    // #9682, #15318: Touch scrolling didnt work when touching
                    // proxy
                    if (!isTouchEvent) {
                        e.preventDefault();
                    }
                },
                { passive: false }
            );
        });
    }


    /**
     * Set visually hidden style on a proxy element
     */
    private hideElementVisually(el: HTMLDOMElement): void {
        css(el, {
            borderWidth: 0,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            outline: 'none',
            opacity: 0.001,
            filter: 'alpha(opacity=1)',
            zIndex: 999,
            overflow: 'hidden',
            padding: 0,
            margin: 0,
            display: 'block',
            position: 'absolute',
            '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=1)'
        });
    }


    /**
     * Get the position relative to chart container for the target
     */
    private getTargetPosition(): BBoxObject {
        const clickTarget = this.target.click;
        // We accept both DOM elements and wrapped elements as click targets.
        const clickTargetElement = (clickTarget as SVGElement).element ?
            (clickTarget as SVGElement).element :
            clickTarget as SVGDOMElement;
        const posElement = this.target.visual || clickTargetElement;
        const chartDiv: HTMLDOMElement = this.chart.renderTo;

        if (chartDiv && posElement && posElement.getBoundingClientRect) {
            const rectEl = posElement.getBoundingClientRect(),
                chartPos = this.chart.pointer.getChartPosition();

            return {
                x: (rectEl.left - chartPos.left) / chartPos.scaleX,
                y: (rectEl.top - chartPos.top) / chartPos.scaleY,
                width: rectEl.right / chartPos.scaleX -
                    rectEl.left / chartPos.scaleX,
                height: rectEl.bottom / chartPos.scaleY -
                    rectEl.top / chartPos.scaleY
            };
        }

        return { x: 0, y: 0, width: 1, height: 1 };
    }


    /**
     * Get an attribute value of a target
     */
    private getTargetAttr(
        target: SVGElement|HTMLElement|DOMElementType,
        key: string
    ): unknown {
        if ((target as SVGElement).element) {
            return (target as SVGElement).element.getAttribute(key);
        }
        return target.getAttribute(key);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace ProxyElement {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Target {
        click: (DOMElementType|SVGElement|HTMLElement);
        visual?: DOMElementType;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ProxyElement;
