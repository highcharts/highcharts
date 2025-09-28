/* *
 *
 *  Grid Popup abstract class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
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
import U from '../../../Core/Utilities.js';

const { makeHTMLElement } = GridUtils;
const { fireEvent } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Abstract base class for for Grid popups.
 */
abstract class Popup {

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
    private options: Popup.Options;


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
    constructor(grid: Grid, button?: Button, options?: Popup.Options) {
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
        this.content = makeHTMLElement('div', {
            className: Globals.getClassName('popupContent')
        });
        this.renderContent(this.content);
        this.container.appendChild(this.content);

        this.anchorElement = anchorElement;
        this.isVisible = true;

        this.grid.contentWrapper?.appendChild(this.container);
        this.positionPopup(anchorElement);
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
        if (this.anchorElement?.isConnected) {
            this.positionPopup(this.anchorElement);
        } else {
            this.hide();
        }
    }

    /**
     * Positions the popup relative to the anchor element.
     *
     * @param anchorElement
     * The element to position relative to. If not provided, the popup will be
     * positioned relative to the parent element.
     */
    private positionPopup(anchorElement?: HTMLElement): void {
        const wrapper = this.grid.contentWrapper;
        if (!this.container || !this.content || !wrapper) {
            return;
        }

        const next = this.options.nextToAnchor || false;
        const popupRect = this.container.getBoundingClientRect();
        const parentRect = wrapper.getBoundingClientRect();
        const anchorRect = anchorElement?.getBoundingClientRect() ?? parentRect;

        const top = next ? anchorRect.top : anchorRect.bottom + 4;
        let left = next ? anchorRect.right + 3 : anchorRect.left;

        if (left < parentRect.left) {
            left = parentRect.left;
        }

        if (left + popupRect.width > parentRect.width) {
            left = -popupRect.width + (
                next ? anchorRect.left + 4 : anchorRect.right
            );
        }

        // Apply positioning
        this.container.style.top = `${top - parentRect.top}px`;
        this.container.style.left = `${left - parentRect.left}px`;

        // If the content is too tall, constrain the container to the bottom
        // of the parent to enable content Y-scrolling.
        const contentRect = this.content.getBoundingClientRect();
        if (
            contentRect.height + contentRect.top - parentRect.top >
            parentRect.height
        ) {
            this.container.style.top = 'auto';
            this.container.style.bottom = '0';
        } else {
            this.container.style.top = `${top - parentRect.top}px`;
            this.container.style.bottom = 'auto';
        }
    }

    /**
     * Handles key down events.
     *
     * @param e
     * Keyboard event
     */
    protected onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
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
        const clickOutsideListener = (event: MouseEvent): void => {
            this.onClickOutside(event);
        };

        const escapeKeyListener = (event: KeyboardEvent): void => {
            this.onKeyDown(event);
        };

        document.addEventListener('mousedown', clickOutsideListener);
        document.addEventListener('keydown', escapeKeyListener);

        this.eventListenerDestroyers.push(
            (): void => {
                document.removeEventListener('mousedown', clickOutsideListener);
                document.removeEventListener('keydown', escapeKeyListener);
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
 *  Namespace
 *
 * */

namespace Popup {
    export interface Options {
        /**
         * Whether to position the popup next to the anchor element (`true`), or
         * directly below it (`false`). Defaults to `false`.
         */
        nextToAnchor?: boolean;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Popup;
