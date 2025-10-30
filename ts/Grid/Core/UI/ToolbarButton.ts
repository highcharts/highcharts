/* *
 *
 *  Grid Toolbar Button class
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

import type Toolbar from './Toolbar';
import type Button from './Button';
import type Popup from './Popup';

import SvgIcons from './SvgIcons.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

class ToolbarButton implements Button {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The wrapper element for the button.
     */
    public wrapper?: HTMLSpanElement;

    /**
     * The toolbar that the button belongs to.
     */
    public toolbar?: Toolbar;

    public popup?: Popup;

    /**
     * Used to remove the event listeners when the button is destroyed.
     */
    protected eventListenerDestroyers: Function[] = [];

    /**
     * Whether the button is active.
     */
    protected isActive: boolean = false;

    /**
     * The options for the toolbar button.
     */
    private options: ToolbarButton.Options;

    /**
     * The default icon for the toolbar button.
     */
    private icon?: SVGElement;

    /**
     * The button element.
     */
    private buttonEl?: HTMLButtonElement;

    /**
     * The active indicator for the button.
     */
    private activeIndicator?: HTMLDivElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(options: ToolbarButton.Options) {
        this.options = options;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Adds the button to the toolbar.
     *
     * @param toolbar
     * The toolbar to add the button to.
     */
    public add(toolbar: Toolbar): this {
        const cfg = this.options;
        this.toolbar = toolbar;
        toolbar.buttons.push(this);

        const wrapper = makeHTMLElement('span', cfg.classNameKey && {
            className: Globals.getClassName(cfg.classNameKey)
        }, toolbar.container);
        this.wrapper = wrapper;

        const button = this.buttonEl = makeHTMLElement<HTMLButtonElement>(
            'button',
            {
                className: (
                    Globals.getClassName('button') +
                    (this.isActive ? ' active' : '')
                )
            },
            wrapper
        );
        button.setAttribute('type', 'button');
        button.setAttribute('tabindex', '-1');

        this.setA11yAttributes(button);

        this.setIcon(cfg.icon);
        this.refreshState();
        this.addEventListeners();

        return this;
    }

    public setA11yAttributes(button: HTMLButtonElement): void {
        const { accessibility, tooltip } = this.options;
        const { ariaLabel, ariaExpanded, ariaControls } = accessibility || {};

        if (tooltip) {
            button.title = tooltip;
        }

        if (ariaLabel) {
            button.setAttribute('aria-label', ariaLabel);
        }

        if (typeof ariaExpanded === 'boolean') {
            button.setAttribute('aria-expanded', ariaExpanded);
        }

        if (ariaControls) {
            button.setAttribute('aria-controls', ariaControls);
        }
    }

    public focus(): void {
        this.buttonEl?.focus();

        const tb = this.toolbar;
        if (tb) {
            tb.focusCursor = tb.buttons.indexOf(this);
        }
    }

    /**
     * Sets the icon for the button.
     *
     * @param icon
     * The icon to set.
     */
    public setIcon(icon: SvgIcons.GridIconName): void {
        this.icon?.remove();
        this.icon = SvgIcons.createGridIcon(icon);
        this.buttonEl?.appendChild(this.icon);
    }

    public setActive(active: boolean): void {
        this.isActive = active;
        this.buttonEl?.classList.toggle('active', active);
        this.renderActiveIndicator(active);
    }

    public setHighlighted(highlighted: boolean): void {
        this.buttonEl?.classList.toggle('highlighted', highlighted);

        const ariaExpanded = this.options.accessibility?.ariaExpanded;
        if (typeof ariaExpanded === 'boolean') {
            this.buttonEl?.setAttribute('aria-expanded', highlighted);
        }
    }

    /**
     * Destroys the button.
     */
    public destroy(): void {
        this.removeEventListeners();
        this.wrapper?.remove();

        // Unregister from toolbar
        this.toolbar?.buttons.splice(this.toolbar.buttons.indexOf(this), 1);
        delete this.toolbar;
    }

    /**
     * Initializes the state of the button.
     */
    protected refreshState(): void {
        // Do nothing, to be overridden by subclasses
    }

    /**
     * Handles the click event for the button.
     *
     * @param event
     * The mouse event.
     */
    protected clickHandler(event: MouseEvent): void {
        this.options.onClick?.(event, this);
    }

    /**
     * Renders the active indicator for the button.
     *
     * @param render
     * Whether the active indicator should be rendered.
     */
    protected renderActiveIndicator(render: boolean): void {
        const button = this.buttonEl;
        if (!button) {
            return;
        }

        this.activeIndicator?.remove();

        if (!render) {
            delete this.activeIndicator;
            return;
        }

        this.activeIndicator = makeHTMLElement('div', {
            className: Globals.getClassName('toolbarButtonActiveIndicator')
        }, button);
    }

    /**
     * Adds event listeners to the button.
     */
    protected addEventListeners(): void {
        const clickListener = (event: MouseEvent): void => {
            this.clickHandler(event);
        };

        this.buttonEl?.addEventListener('click', clickListener);
        this.eventListenerDestroyers.push((): void => {
            this.buttonEl?.removeEventListener('click', clickListener);
        });
    }

    /**
     * Removes event listeners from the button.
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

namespace ToolbarButton {

    /**
     * Options for the toolbar button.
     */
    export interface Options {
        /**
         * The icon for the button.
         */
        icon: SvgIcons.GridIconName;

        /**
         * The class name key for the button.
         */
        classNameKey?: Globals.ClassNameKey;

        /**
         * The tooltip string for the button.
         */
        tooltip?: string;

        /**
         * Whether the button should be always visible.
         */
        alwaysVisible?: boolean;

        /**
         * The accessibility options for the button.
         */
        accessibility?: ToolbarButtonA11yOptions;

        /**
         * The click handler for the button.
         */
        onClick?: (event: MouseEvent, button: ToolbarButton) => void;
    }

    export interface ToolbarButtonA11yOptions {
        /**
         * The aria label attribute for the button.
         */
        ariaLabel?: string;

        /**
         * The aria expanded attribute for the button.
         */
        ariaExpanded?: boolean;

        /**
         * The aria controls attribute for the button.
         */
        ariaControls?: string;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ToolbarButton;
