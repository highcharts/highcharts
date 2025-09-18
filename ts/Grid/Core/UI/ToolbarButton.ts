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
    private toolbar?: Toolbar;

    /**
     * The options for the toolbar button.
     */
    private options: ToolbarButton.Options;

    /**
     * The default icon for the toolbar button.
     */
    private icon?: SVGElement;

    /**
     * Whether the button is active.
     */
    private isActive: boolean = false;

    /**
     * The button element.
     */
    private buttonEl?: HTMLButtonElement;

    /**
     * The click listener for the button.
     */
    private clickListener?: (event: MouseEvent) => void;


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
                className: this.isActive ? 'hcg-button active' : 'hcg-button'
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
        this.addEventListeners();

        return this;
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
    }

    /**
     * Destroys the button.
     */
    public destroy(): void {
        this.removeEventListeners();

        // Unregister from toolbar
        this.toolbar?.buttons.splice(this.toolbar.buttons.indexOf(this), 1);
        delete this.toolbar;
    }

    /**
     * Adds event listeners to the button.
     */
    private addEventListeners(): void {
        this.clickListener = (event: MouseEvent): void => {
            if (this.options.onClick) {
                this.options.onClick(event, this);
            }
        };

        this.buttonEl?.addEventListener('click', this.clickListener);
    }

    /**
     * Removes event listeners from the button.
     */
    private removeEventListeners(): void {
        if (this.clickListener) {
            this.buttonEl?.removeEventListener('click', this.clickListener);
            delete this.clickListener;
        }
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
