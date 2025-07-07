/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Accessibility module for Highcharts: Proxy utilities
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../Core/Chart/Chart';
import type HTMLAttributes from '../Core/Renderer/HTML/HTMLAttributes';

import AST from '../Core/Renderer/HTML/AST.js';
import G from '../Core/Globals.js';
const { doc, win } = G;
import U from '../Core/Utilities.js';
const { addEvent, attr } = U;


/**
 * Utility function to add a plain, basic HTML element to the DOM.
 * Used by other proxy functions.
 *
 * @internal
 */
function addPlainA11yEl(
    elType: keyof HTMLElementTagNameMap,
    parent: HTMLElement,
    content = '',
    className = ''
): HTMLElement {
    const el = new AST(
        `<${elType} class="${className}" style="margin: 0; padding: 0; border: 0;">${content}</${elType}>`
    );
    return el.addToDOM(parent) as HTMLElement;
}


interface ProxyGroup {
    containerEl: HTMLElement;
    eventRemovers: Array<Function>;
    sizeUpdaters: Array<Function>;
    resizeObservers: Array<ResizeObserver>;
}


/**
 * Utility class for keeping track of proxy elements, events, and resizing.
 *
 * This is used by the a11y module to create touchable proxy elements and other
 * HTML elements.
 *
 * @internal
 */
export class ProxyProvider {
    private stylesheet: CSSStyleSheet;
    private groups: Record<string, ProxyGroup> = {};

    constructor(public chart: Chart) {
        // Insert the stylesheet
        this.stylesheet = new CSSStyleSheet();
        this.stylesheet.replaceSync(`
        .hc-a11y-proxy-container {
            position: relative;
            top: 0;
            left: 0;
            z-index: 20;
            padding: 0;
            margin: -1px;
            width: 1px;
            height: 1px;
            white-space: nowrap;
            opacity: 0;
            border: 0;

            ol, ul, li {
                list-style-type: none;
            }
        }
        .hc-a11y-sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            overflow: hidden;
            white-space: nowrap;
            clip: rect(0 0 0 0);
            clip-path: inset(50%);
        }
        `);
        doc.adoptedStyleSheets.push(this.stylesheet);
    }


    /**
     * Add a new group to contain proxy elements.
     *
     * If insertAfter is specified, the group is inserted after the
     * specified group, or at the end if the group is not found.
     *
     * If insertAfter is not specified, the group is inserted as the
     * first child of the chart's renderTo element.
     */
    public addGroup(groupName: string, insertAfter?: string): void {
        this.removeGroup(groupName);
        const container = this.chart.renderTo,
            refNode = insertAfter ?
                this.groups[insertAfter].containerEl.nextSibling :
                container.firstChild,
            el = addPlainA11yEl(
                'div', container, '',
                `hc-a11y-proxy-container hc-group-${groupName}`
            );
        container.insertBefore(el, refNode);
        this.groups[groupName] = {
            containerEl: el,
            eventRemovers: [],
            sizeUpdaters: [],
            resizeObservers: []
        };
    }


    /**
     * Remove a group if it exists.
     * Cleans up event handlers, resize observers, and all HTML elements.
     */
    public removeGroup(groupName: string): void {
        const group = this.groups[groupName];
        if (group) {
            group.eventRemovers.forEach((remover): void => remover());
            group.resizeObservers
                .forEach((observer): void => observer.disconnect());
            group.containerEl.remove();
            delete this.groups[groupName];
        }
    }


    /**
     * Add a visually hidden element to the group. This element is not
     * touchable, and does not proxy for a different element.
     */
    public addSROnly(
        groupName: string,
        elType: keyof HTMLElementTagNameMap,
        content = '',
        className = '',
        parent?: HTMLElement
    ): HTMLElement {
        return addPlainA11yEl(
            elType, parent || this.groups[groupName].containerEl,
            content, `hc-a11y-sr-only ${className}`
        );
    }


    /**
     * Proxy an existing element. Will overlay the element once updatePositions
     * is called (or stuff is resized).
     */
    public addTouchableProxy(
        groupName: string,
        targetEl: HTMLElement|SVGElement|undefined,
        proxyElType: keyof HTMLElementTagNameMap,
        content: string,
        className = '',
        attrs?: HTMLAttributes,
        parent?: HTMLElement
    ): HTMLElement {
        // Fallback if we are trying to proxy something that doesn't exist.
        // Put the content in, but don't overlay anything.
        if (
            !targetEl ||
            targetEl.tagName.toUpperCase() === 'TEXT' && !targetEl.textContent
        ) {
            return this.addSROnly(
                groupName, proxyElType,
                content, className, parent
            );
        }

        const group = this.groups[groupName],
            container = parent || group.containerEl,
            el = addPlainA11yEl(proxyElType, container, content, className),
            computedStyle = win.getComputedStyle(targetEl),
            setSize = (): void => {
                const bbox = targetEl.getBoundingClientRect(),
                    containerBBox = container.getBoundingClientRect();
                Object.assign(el.style, {
                    left: bbox.x - containerBBox.x + 'px',
                    top: bbox.y - containerBBox.y + 'px',
                    width: bbox.width + 'px',
                    height: bbox.height + 'px'
                });
            },
            resizeObserver = new ResizeObserver(setSize);

        Object.assign(el.style, {
            position: 'absolute',
            overflow: 'hidden',
            cursor: computedStyle.cursor,
            font: computedStyle.font,
            lineHeight: computedStyle.lineHeight,
            letterSpacing: computedStyle.letterSpacing,
            wordSpacing: computedStyle.wordSpacing,
            textTransform: computedStyle.textTransform,
            textAlign: computedStyle.textAlign,
            tabindex: '-1'
        });
        if (attrs) {
            attr(el, attrs);
        }
        group.resizeObservers.push(resizeObserver);
        group.sizeUpdaters.push(setSize);
        resizeObserver.observe(targetEl);

        [
            'mousedown', 'mouseup', 'mouseenter', 'mouseover', 'mouseout',
            'mouseleave', 'pointerdown', 'pointerup', 'pointermove',
            'pointercancel', 'pointerleave', 'pointerenter', 'wheel',
            'dragstart', 'dragend', 'dragenter', 'dragleave', 'dragover',
            'drop', 'click'
        ].forEach(
            (type): unknown => group.eventRemovers.push(
                addEvent(el, type, (e): void => {
                    targetEl.dispatchEvent(new (
                        e.constructor as typeof Event)(e.type, e)
                    );
                    e.stopPropagation();
                    e.preventDefault();
                })
            )
        );
        return el;
    }


    /**
     * Update the positions of all proxy elements in all groups.
     */
    public updatePositions(): void {
        Object.values(this.groups).forEach(
            (group): void => group.sizeUpdaters.forEach(
                (updater): void => updater()
            )
        );
    }


    /**
     * Remove traces of the proxy provider.
     */
    public destroy(): void {
        // Remove the stylesheet
        const index = doc.adoptedStyleSheets.indexOf(this.stylesheet);
        if (index !== -1) {
            doc.adoptedStyleSheets.splice(index, 1);
        }
        // Remove all groups
        Object.keys(this.groups).forEach(
            (groupName): void => this.removeGroup(groupName)
        );
    }
}

export default ProxyProvider;
