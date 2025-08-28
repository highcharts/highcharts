/* *
 *
 *  Grid FilterPopup class
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

import type HeaderCell from './HeaderCell.js';

import GridUtils from '../../GridUtils.js';
import Globals from '../../Globals.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * Popup component for filter functionality in Grid table headers.
 *
 * TODO: Generalize this class to be used for other popup components.
 */
class FilterPopup {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The header cell that owns this popup.
     */
    public headerCell: HeaderCell;

    /**
     * The popup container element.
     */
    public container: HTMLElement;

    /**
     * The popup content element.
     */
    public content: HTMLElement;

    /**
     * Parent element of the popup.
     */
    public wrapper: HTMLElement;

    /**
     * Whether the popup is currently visible.
     */
    isVisible: boolean;

    /**
     * The anchor element that the popup is positioned relative to.
     */
    anchorElement?: HTMLElement;

    /**
     * Event listener for click outside the popup.
     */
    private clickOutsideListener?: (event: MouseEvent) => void;

    /**
     * Event listener for escape key.
     */
    private escapeKeyListener?: (event: KeyboardEvent) => void;

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a FilterPopup for the given header cell.
     *
     * @param headerCell
     * The header cell that will own this popup.
     */
    constructor(headerCell: HeaderCell) {
        const wrapper = headerCell.tableHeader.viewport.grid.contentWrapper;
        if (!wrapper) {
            throw new Error('No content element found.');
        }

        this.wrapper = wrapper;
        this.headerCell = headerCell;
        this.isVisible = false;

        this.container = this.createContainer();
        this.content = this.createContent();
        this.container.appendChild(this.content);
    }

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Creates the main popup container element.
     *
     * @returns
     * The popup container element.
     */
    private createContainer(): HTMLElement {
        return makeHTMLElement('div', {
            className: Globals.getClassName('popup')
        });
    }

    /**
     * Creates the popup content element.
     */
    private createContent(): HTMLElement {
        const content = makeHTMLElement('div', {
            className: Globals.getClassName('popupContent')
        });

        // TODO: Add content here
        content.innerHTML = '<div>Filter popup content will go here</div>';

        return content;
    }

    /**
     * Shows the popup positioned relative to the anchor element.
     *
     * @param anchorElement
     * The element to position the popup relative to.
     */
    public show(anchorElement: HTMLElement): void {
        if (this.isVisible) {
            return;
        }

        this.anchorElement = anchorElement;
        this.isVisible = true;

        this.wrapper.appendChild(this.container);
        this.positionPopup(anchorElement);
        this.addEventListeners();
    }

    /**
     * Hides the popup.
     */
    public hide(): void {
        if (!this.isVisible) {
            return;
        }

        this.isVisible = false;

        // Remove event listeners
        this.removeEventListeners();
        this.container.remove();
    }

    /**
     * Toggles the popup visibility.
     *
     * @param anchorElement
     * The element to position the popup relative to.
     */
    public toggle(anchorElement: HTMLElement): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(anchorElement);
        }
    }

    /**
     * Positions the popup relative to the anchor element.
     *
     * @param anchorElement
     * The element to position relative to.
     */
    private positionPopup(anchorElement: HTMLElement): void {
        const anchorRect = anchorElement.getBoundingClientRect();
        const popupRect = this.container.getBoundingClientRect();
        const parentRect = this.wrapper.getBoundingClientRect();

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
    }

    /**
     * Adds event listeners for click outside and escape key.
     */
    private addEventListeners(): void {
        this.clickOutsideListener = (event: MouseEvent): void => {
            if (
                !this.container.contains(event.target as Node) &&
                !this.anchorElement?.contains(event.target as Node)
            ) {
                this.hide();
            }
        };

        this.escapeKeyListener = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                this.hide();
            }
        };

        document.addEventListener('click', this.clickOutsideListener);
        document.addEventListener('keydown', this.escapeKeyListener);
    }

    /**
     * Removes event listeners.
     */
    private removeEventListeners(): void {
        if (this.clickOutsideListener) {
            document.removeEventListener('click', this.clickOutsideListener);
            delete this.clickOutsideListener;
        }

        if (this.escapeKeyListener) {
            document.removeEventListener('keydown', this.escapeKeyListener);
            delete this.escapeKeyListener;
        }
    }

    /**
     * Cleans up the popup and removes it from the DOM.
     */
    public destroy(): void {
        this.hide();
        this.removeEventListeners();

        if (this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default FilterPopup;
