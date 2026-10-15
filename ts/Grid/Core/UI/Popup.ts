/* *
 *
 *  Grid Popup abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */


'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';
import type Button from './Button';

import GridUtils from '../GridUtils.js';
import Globals from '../Globals.js';
import { fireEvent } from '../../../Shared/Utilities.js';

const { makeHTMLElement } = GridUtils;

/**
 * Whether the browser can render an element in the top layer. Popover is
 * Baseline since January 2025, so anything older falls back to the popup
 * being laid out, and clipped, inside the grid container.
 *
 * @return
 * True when the Popover API is available.
 */
function supportsPopover(): boolean {
    return typeof HTMLElement.prototype.showPopover === 'function';
}


/* *
 *
 *  Class
 *
 * */

/**
 * Abstract base class for for Grid popups.
 */
export abstract class Popup {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The popup container element.
     */
    public container?: HTMLElement;

    /**
     * The popup content element.
     */
    public content?: HTMLElement;

    /**
     * Parent element of the popup.
     */
    public grid: Grid;

    /**
     * Whether the popup is currently visible.
     */
    public isVisible: boolean = false;

    /**
     * The anchor element that the popup is positioned relative to.
     */
    public anchorElement?: HTMLElement;

    /**
     * The button that opened the popup, if any.
     */
    protected button?: Button;

    /**
     * Event listener destroyers.
     */
    protected eventListenerDestroyers: Function[] = [];

    /**
     * Options for the popup.
     */
    private options: PopupOptions;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a popup for the given grid.
     *
     * @param grid
     * The grid that will own this popup.
     *
     * @param button
     * The button that opened the popup, if any.
     *
     * @param options
     * Popup options.
     */
    constructor(grid: Grid, button?: Button, options?: PopupOptions) {
        this.grid = grid;
        this.button = button;
        this.options = options || {};
    }

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Renders the popup content.
     *
     * @param contentElement
     * The content element.
     */
    protected abstract renderContent(contentElement: HTMLElement): void;

    /**
     * Shows the popup positioned relative to the anchor element.
     *
     * @param anchorElement
     * The element to position the popup relative to.
     */
    public show(anchorElement?: HTMLElement): void {
        if (this.container) {
            return;
        }

        this.button?.setHighlighted(true);

        this.container = makeHTMLElement('div', {
            className: Globals.getClassName('popup')
        });

        if (this.usesPopover) {
            this.container.popover = 'manual';
        }
        this.content = makeHTMLElement('div', {
            className: Globals.getClassName('popupContent')
        });

        const { header } = this.options;
        if (header) {
            this.addHeader(header.label, header.category);
        }

        this.renderContent(this.content);
        this.container.appendChild(this.content);

        this.anchorElement = anchorElement;
        this.isVisible = true;

        this.grid.contentWrapper?.appendChild(this.container);

        // The top layer is what nothing clips. The grid container hides its
        // overflow and, through `container-type`, is a containing block for
        // fixed positioning too, so a popup laid out inside it cannot reach
        // past its edges. The element stays where it is in the DOM, so the
        // grid's styles and theme still reach it. Manual, because the
        // dismiss and key handling below are the grid's own, and guarded on
        // `isConnected`, because `showPopover` throws on a detached element.
        if (this.usesPopover && this.container.isConnected) {
            this.container.showPopover();
        }

        this.position(anchorElement);
        this.addEventListeners();

        this.grid.popups.add(this);

        fireEvent(this, 'afterShow');
    }

    /**
     * Hides the popup. In reality, it just destroys the popup container and
     * removes the event listeners.
     */
    public hide(): void {
        if (!this.container) {
            return;
        }

        fireEvent(this, 'beforeHide');

        this.grid.popups.delete(this);

        this.isVisible = false;

        // Remove event listeners
        this.removeEventListeners();
        this.container.remove();

        delete this.container;
        delete this.content;

        this.button?.setHighlighted(false);

        fireEvent(this, 'afterHide');
    }

    /**
     * Toggles the popup visibility.
     *
     * @param anchorElement
     * The element to position the popup relative to. If not provided, the popup
     * will be positioned relative to the parent element.
     */
    public toggle(anchorElement?: HTMLElement): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(anchorElement);
        }
    }

    /**
     * Reflows the popup.
     */
    public reflow(): void {
        const anchor = this.anchorElement;

        if (!anchor?.isConnected) {
            this.hide();
            return;
        }

        if (this.usesPopover) {
            const rect = anchor.getBoundingClientRect();

            // Nothing clips a popup in the top layer, so it has to leave the
            // screen itself once its anchor has, rather than hang over
            // whatever the page scrolled into its place.
            if (
                rect.bottom < 0 || rect.top > window.innerHeight ||
                rect.right < 0 || rect.left > window.innerWidth
            ) {
                this.hide();
                return;
            }
        }

        this.position(anchor);
    }

    /**
     * Whether the popup opens as a native popover, which renders in the
     * browser's top layer, where the grid container cannot clip it.
     *
     * @return
     * True when a popover is used.
     */
    protected get usesPopover(): boolean {
        return supportsPopover() && this.prefersPopover;
    }

    /**
     * Whether the popup asks for a popover, before the browser gets a say.
     * Subclasses override this, not `usesPopover`, so that the support check
     * stays in one place.
     *
     * @return
     * True when a popover is wanted.
     */
    protected get prefersPopover(): boolean {
        return this.options.popover ??
            this.grid.options?.rendering?.popups?.insideContainer !== true;
    }

    /**
     * Positions the popup relative to the anchor element.
     *
     * @param anchorElement
     * The element to position relative to. If not provided, the popup will be
     * positioned relative to the parent element.
     */
    private position(anchorElement?: HTMLElement): void {
        const { container, content } = this;

        if (!container || !content) {
            return;
        }

        const wrapper = this.grid.contentWrapper;
        const anchorRect =
            anchorElement?.getBoundingClientRect() ??
            wrapper?.getBoundingClientRect();

        if (!anchorRect) {
            return;
        }

        // What the popup has to fit into: the viewport in the top layer,
        // where nothing clips it, and the grid otherwise. `innerHeight` and
        // not `documentElement.clientHeight`, which is the root element in
        // quirks mode rather than the viewport.
        const bounds = this.usesPopover ?
            new DOMRect(0, 0, window.innerWidth, window.innerHeight) :
            wrapper?.getBoundingClientRect();

        if (!bounds) {
            return;
        }

        const next = this.options.nextToAnchor || false;
        const edgePadding = 8;

        // Capping the height before the popup is measured is what lets its
        // `overflow` scroll; without the cap the bottom alignment below only
        // moves the overflow to the top edge.
        container.style.maxHeight =
            `${Math.max(bounds.height - 2 * edgePadding, 0)}px`;

        const popupRect = container.getBoundingClientRect();

        const top = Math.max(
            next ? anchorRect.top : anchorRect.bottom + 4,
            bounds.top + edgePadding
        );
        let left = next ? anchorRect.right + 3 : anchorRect.left;

        // If the popup's right side runs past the bounds, flip it to the
        // other side of the anchor.
        if (left + popupRect.width > bounds.right - edgePadding) {
            left = -popupRect.width + (
                next ? anchorRect.left + 4 : anchorRect.right
            );
        }

        if (left < bounds.left + edgePadding) {
            left = bounds.left + edgePadding;
        }

        container.style.left = `${left - bounds.left}px`;

        // If the content is too tall, pin it to the bottom of the bounds so
        // that the content scrolls instead of the popup running off.
        if (top + popupRect.height > bounds.bottom - edgePadding) {
            container.style.top = 'auto';
            container.style.bottom = `${edgePadding}px`;
        } else {
            container.style.top = `${top - bounds.top}px`;
            container.style.bottom = 'auto';
        }
    }

    /**
     * Adds a header to the context menu.
     *
     * @param label
     * The label shown in the header of the context menu.
     *
     * @param category
     * The category shown in the header of the context menu, before the label.
     *
     * @returns
     * The header element.
     */
    protected addHeader(
        label: string,
        category?: string
    ): HTMLElement | undefined {
        if (!this.content) {
            return;
        }

        const container = makeHTMLElement('div', {
            className: Globals.getClassName('menuHeader')
        }, this.content);

        if (category) {
            makeHTMLElement('span', {
                className: Globals.getClassName('menuHeaderCategory'),
                innerText: category + ' '
            }, container);
        }

        makeHTMLElement('span', {
            className: Globals.getClassName('menuHeaderName'),
            innerText: label
        }, container);

        return container;
    }

    /**
     * Handles key down events.
     *
     * @param e
     * Keyboard event
     */
    protected onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape' || (
            e.key === 'Tab' && e.shiftKey
        )) {
            e.preventDefault();
            this.hide();
            this.button?.focus();
        }
    }

    /**
     * Handles click outside events.
     *
     * @param e
     * Mouse event
     */
    protected onClickOutside(e: MouseEvent): void {
        if (
            !this.container?.contains(e.target as Node) &&
            !this.anchorElement?.contains(e.target as Node)
        ) {
            this.hide();
        }
    }

    /**
     * Adds event listeners for click outside and escape key.
     */
    protected addEventListeners(): void {
        const container = this.container;
        if (!container) {
            return;
        }

        const clickOutsideListener = (event: MouseEvent): void => {
            this.onClickOutside(event);
        };

        const keyDownListener = (event: KeyboardEvent): void => {
            this.onKeyDown(event);
        };

        const scrollListener = (): void => {
            this.reflow();
        };

        document.addEventListener('mousedown', clickOutsideListener);
        container.addEventListener('keydown', keyDownListener);

        // Captured, so that a scroll in any container the anchor sits in is
        // caught: a popup in the top layer is placed against the viewport, so
        // it does not travel with its anchor on its own.
        if (this.usesPopover) {
            window.addEventListener('scroll', scrollListener, true);
        }

        this.eventListenerDestroyers.push(
            (): void => {
                document.removeEventListener('mousedown', clickOutsideListener);
                container.removeEventListener('keydown', keyDownListener);
                window.removeEventListener('scroll', scrollListener, true);
            }
        );
    }

    /**
     * Removes event listeners.
     */
    private removeEventListeners(): void {
        for (const destroyer of this.eventListenerDestroyers) {
            destroyer();
        }
        this.eventListenerDestroyers.length = 0;
    }
}


/* *
 *
 *  Declarations
 *
 * */

export interface PopupOptions {
    /**
     * Whether to position the popup next to the anchor element (`true`), or
     * directly below it (`false`). Defaults to `false`.
     */
    nextToAnchor?: boolean;

    /**
     * The header of the popup.
     */
    header?: {
        /**
         * The prefix of the header label, placed before the label.
         */
        category?: string;
        /**
         * The label of the header.
         */
        label: string;
    };

    /**
     * Whether to open this popup as a native popover, regardless of
     * `rendering.popups.popover`. Used where the grid container cannot
     * contain the popup at all.
     */
    popover?: boolean;
}


/* *
 *
 *  Default Export
 *
 * */

export default Popup;
