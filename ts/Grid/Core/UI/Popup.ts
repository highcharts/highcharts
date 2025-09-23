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
     * Event listener destroyers.
     */
    protected eventListenerDestroyers: (() => void)[] = [];


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
     */
    constructor(grid: Grid) {
        this.grid = grid;
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
     * Hides the popup.
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

        const popupRect = this.container.getBoundingClientRect();
        const parentRect = wrapper.getBoundingClientRect();
        const anchorRect = anchorElement?.getBoundingClientRect() ?? parentRect;

        const top = anchorRect.bottom + 4; // 4px gap
        let left = anchorRect.left;

        if (left < parentRect.left) {
            left = parentRect.left;
        }

        if (left + popupRect.width > parentRect.width) {
            left = anchorRect.right - popupRect.width;
        }

        // Apply positioning
        this.container.style.top = `${top - parentRect.top}px`;
        this.container.style.left = `${left - parentRect.left}px`;

        // If the content is too tall, constrain the container to the bottom
        // of the parent to enable content Y-scrolling.
        const contentRect = this.content.getBoundingClientRect();
        this.container.style.bottom = (
            contentRect.height + contentRect.top - parentRect.top >
            parentRect.height
        ) ? '0' : 'auto';
    }

    protected onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.hide();
        }
    }

    /**
     * Adds event listeners for click outside and escape key.
     */
    protected addEventListeners(): void {
        const clickOutsideListener = (event: MouseEvent): void => {
            if (
                !this.container?.contains(event.target as Node) &&
                !this.anchorElement?.contains(event.target as Node)
            ) {
                this.hide();
            }
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
 *  Default Export
 *
 * */

export default Popup;
