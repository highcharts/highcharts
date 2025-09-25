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

import SvgIcons from './SvgIcons.js';
import Globals from '../Globals.js';
import GridUtils from '../GridUtils.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

class ToolbarButton {

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

        const wrapper = this.wrapper = makeHTMLElement('span', {
            className: Globals.getClassName(cfg.classNameKey)
        });
        toolbar.container?.appendChild(wrapper);

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

        if (cfg.tooltip) {
            button.title = cfg.tooltip;
            button.setAttribute('aria-label', cfg.tooltip);
        }

        this.setIcon(cfg.icon);
        this.refreshState();
        this.addEventListeners();

        return this;
    }

    /**
     * Focuses the button.
     */
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
        this.icon = SvgIcons.createGridIcon(icon, this.options.size ?? 20);
        this.buttonEl?.appendChild(this.icon);
    }

    /**
     * Sets the active state of the button.
     *
     * @param active
     * Whether the button should be active.
     */
    public setActive(active: boolean): void {
        this.isActive = active;
        this.buttonEl?.classList.toggle('active', active);
        this.renderActiveIndicator(active);
    }

    /**
     * Sets the highlighted state of the button.
     *
     * @param highlighted
     * Whether the button should be highlighted.
     */
    public setHighlighted(highlighted: boolean): void {
        this.buttonEl?.classList.toggle('highlighted', highlighted);
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
        if (this.options.onClick) {
            this.options.onClick(event, this);
        }
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
        classNameKey: Globals.ClassNameKey;

        /**
         * The tooltip string for the button.
         */
        tooltip?: string;

        /**
         * The size of the button.
         */
        size?: number;

        /**
         * Whether the button should be always visible.
         */
        alwaysVisible?: boolean;

        /**
         * The click handler for the button.
         */
        onClick?: (event: MouseEvent, button: ToolbarButton) => void;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ToolbarButton;
