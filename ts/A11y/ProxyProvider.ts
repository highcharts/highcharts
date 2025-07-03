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
    className = '',
    content = ''
): HTMLElement {
    const el = new AST(
        `<${elType} class="${className}" position="absolute" style="margin: 0; padding: 0; border: 0;">${content}</${elType}>`
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
class ProxyProvider {
    private stylesheet: CSSStyleSheet;
    private groups: Record<string, ProxyGroup> = {};

    /*
        Todo:

        Add to a11y class. Remember destroy().
            Series animate finished = updatePositions().
    */

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
     * Inserted after the specified group, or at the end if not found.
     */
    public addGroup(groupName: string, insertAfter?: string): void {
        this.removeGroup(groupName);
        const refNode = insertAfter ?
                this.groups[insertAfter].containerEl.nextSibling :
                null,
            el = addPlainA11yEl(
                'div', this.chart.container, 'hc-a11y-proxy-container'
            );
        this.chart.container.insertBefore(el, refNode);
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
        parent?: HTMLElement
    ): HTMLElement {
        return addPlainA11yEl(
            elType, parent || this.groups[groupName].containerEl,
            'hc-a11y-sr-only', content
        );
    }


    /**
     * Proxy an existing element. Will overlay the element once updatePositions
     * is called (or stuff is resized).
     */
    public addTouchableProxy(
        groupName: string,
        svgEl: SVGElement,
        proxyElType: keyof HTMLElementTagNameMap,
        content: string,
        attrs?: HTMLAttributes,
        parent?: HTMLElement
    ): HTMLElement {
        const group = this.groups[groupName],
            container = parent || group.containerEl,
            el = addPlainA11yEl(proxyElType, container, '', content),
            computedStyle = win.getComputedStyle(svgEl),
            setSize = (): void => {
                const bbox = svgEl.getBoundingClientRect(),
                    containerBBox = container.getBoundingClientRect();
                Object.assign(el.style, {
                    left: bbox.x - containerBBox.x + 'px',
                    top: bbox.y - containerBBox.y + 'px',
                    width: bbox.width + 'px',
                    height: bbox.height + 'px',
                    overflow: 'hidden',
                    cursor: computedStyle.cursor,
                    tabindex: '-1'
                });
            },
            resizeObserver = new ResizeObserver(setSize);

        if (attrs) {
            attr(el, attrs);
        }
        group.resizeObservers.push(resizeObserver);
        group.sizeUpdaters.push(setSize);
        resizeObserver.observe(svgEl);

        [
            'mousedown', 'mouseup', 'mouseenter', 'mouseover', 'mouseout',
            'mouseleave', 'pointerdown', 'pointerup', 'pointermove',
            'pointercancel', 'pointerleave', 'pointerenter', 'wheel',
            'dragstart', 'dragend', 'dragenter', 'dragleave', 'dragover',
            'drop', 'click'
        ].forEach(
            (type): unknown => group.eventRemovers.push(
                addEvent(el, type, (e): void => {
                    svgEl.dispatchEvent(new (
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
