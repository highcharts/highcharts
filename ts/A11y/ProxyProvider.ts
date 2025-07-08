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
 * Get focusable children of an element, as an array.
 *
 * @internal
 */
const focusableChildren = (el: HTMLElement): Array<HTMLElement> => Array.from(
    el.querySelectorAll(`
        a[href],
        area[href],
        input:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled]),
        button:not([disabled]),
        iframe,
        object,
        embed,
        [contenteditable],
        [tabindex]:not([tabindex="-1"])
    `)
);


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
    private groups: Record<string, ProxyGroup> = {};
    private outerContainerEl: HTMLElement;

    constructor(public chart: Chart) {
        this.outerContainerEl = doc.createElement('div');
        this.outerContainerEl.className = 'hc-a11y-proxy-outer-container';
        this.outerContainerEl.style.position = 'absolute';
        chart.renderTo.insertBefore(
            this.outerContainerEl, chart.renderTo.firstChild
        );
    }


    /**
     * Add a new group to contain proxy elements.
     *
     * If insertAfter is specified, the group is inserted after the
     * specified group, or at the end if the group is not found.
     *
     * If insertAfter is not specified, the group is inserted as the
     * first child of the proxy outer container.
     */
    public addGroup(groupName: string, insertAfter?: string): void {
        this.removeGroup(groupName);
        const container = this.outerContainerEl,
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
            targetEl?.tagName.toUpperCase() === 'TEXT' && !targetEl?.textContent
        ) {
            return this.addSROnly(
                groupName, proxyElType,
                content, className, parent
            );
        }

        const group = this.groups[groupName],
            container = parent || group.containerEl,
            touchableEl = addPlainA11yEl(
                'div', container, '', 'hc-a11y-touchable-container'
            ),
            setSize = (): void => {
                const bbox = targetEl.getBoundingClientRect(),
                    containerBBox = container.getBoundingClientRect();
                Object.assign(touchableEl.style, {
                    left: bbox.x - containerBBox.x + 'px',
                    top: bbox.y - containerBBox.y + 'px',
                    width: bbox.width + 'px',
                    height: bbox.height + 'px'
                });
            },
            resizeObserver = new ResizeObserver(setSize);

        Object.assign(touchableEl.style, {
            position: 'absolute',
            overflow: 'hidden',
            tabindex: '-1'
        });
        if (attrs) {
            attr(touchableEl, attrs);
        }
        group.resizeObservers.push(resizeObserver);
        group.sizeUpdaters.push(setSize);
        resizeObserver.observe(targetEl);

        // Add content as visually hidden
        const contentEl = this.addSROnly(
            groupName, proxyElType, content, className, touchableEl
        );

        // Loop through focusable children and map to focusable children in the
        // target element. On focus => set focus highlight.
        // Needed so that we can do keyboard navigation in the proxy elements.
        const focusableMap = new WeakMap<HTMLElement, HTMLElement>();
        if (targetEl instanceof HTMLElement && targetEl.childElementCount > 0) {
            const srcFocusable = focusableChildren(contentEl),
                targetFocusable = focusableChildren(targetEl);
            if (srcFocusable.length === targetFocusable.length) {
                srcFocusable.forEach((srcEl, i): void => {
                    const focusTarget = targetFocusable[i];
                    focusTarget.tabIndex = -1;
                    group.eventRemovers.push(
                        addEvent(srcEl, 'focus', (): void =>
                            this.chart.a11y?.setFocusIndicator(focusTarget)
                        ),
                        addEvent(srcEl, 'blur', (): void =>
                            this.chart.a11y?.hideFocus()
                        )
                    );
                    focusableMap.set(srcEl, focusTarget);
                });
            }
        }

        // Proxy events down to the target
        [
            'mousedown', 'mouseup', 'mouseenter', 'mouseover', 'mouseout',
            'mouseleave', 'mousemove', 'pointerdown', 'pointerup',
            'pointermove', 'pointercancel', 'pointerleave', 'pointerenter',
            'wheel', 'dragstart', 'dragend', 'dragenter', 'dragleave',
            'dragover', 'drop', 'click'
        ].forEach(
            (type): unknown => group.eventRemovers.push(
                addEvent(touchableEl, type, (e): void => {
                    // If the element is focusable and has been mapped to a
                    // focusable child target element within the targetEl,
                    // use that one as the target.
                    let realEl = e.target && focusableMap.get(e.target);
                    if (!realEl) {
                        // Not in map, try to find underlying element
                        // (can be a child of target)
                        touchableEl.style.pointerEvents = 'none';
                        const x = (e instanceof MouseEvent) ? e.clientX :
                                (e as TouchEvent)?.changedTouches
                                    ?.[0]?.clientX ?? null,
                            y = (e instanceof MouseEvent) ? e.clientY :
                                (e as TouchEvent)?.changedTouches
                                    ?.[0]?.clientY ?? null;
                        realEl = x !== null && y !== null &&
                            doc.elementFromPoint(x, y) || targetEl;
                        touchableEl.style.pointerEvents = '';
                    }

                    // Proxy the cursor style if relevant
                    if (type !== 'wheel') {
                        const targetStye = win.getComputedStyle(realEl);
                        touchableEl.style.cursor = targetStye.cursor;
                    }

                    // Proxy event to the underlying element
                    realEl.dispatchEvent(new (
                        e.constructor as typeof Event)(e.type, e)
                    );
                    e.stopPropagation();
                    e.preventDefault();
                }, { passive: false })
            )
        );

        return touchableEl;
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
        // Remove all groups
        Object.keys(this.groups).forEach(
            (groupName): void => this.removeGroup(groupName)
        );

        this.outerContainerEl.remove();
    }
}

export default ProxyProvider;
