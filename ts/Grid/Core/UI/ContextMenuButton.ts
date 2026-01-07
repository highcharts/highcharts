/* *
 *
 *  Grid Context Menu Button class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type ContextMenu from './ContextMenu';
import type Button from './Button';
import type Popup from './Popup';

import { GridIconName, createGridIcon } from './SvgIcons.js';
import Globals, { ClassNameKey } from '../Globals.js';
import GridUtils from '../GridUtils.js';

const { makeHTMLElement } = GridUtils;


/* *
 *
 *  Class
 *
 * */

export class ContextMenuButton implements Button {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The wrapper `<li>` element for the button.
     */
    public wrapper?: HTMLLIElement;

    /**
     * The context menu that the button belongs to.
     */
    public contextMenu?: ContextMenu;

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
     * The options for the context menu button.
     */
    protected options: ContextMenuButtonOptions;

    /**
     * The container for the icon element.
     */
    private iconWrapper?: HTMLElement;

    /**
     * The default icon for the context menu button.
     */
    private icon?: SVGElement;

    /**
     * The button element.
     */
    private buttonEl?: HTMLButtonElement;

    /**
     * The span element for the label.
     */
    private spanEl?: HTMLSpanElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(options: ContextMenuButtonOptions) {
        this.options = options;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Adds the button to the context menu.
     *
     * @param contextMenu
     * The context menu to add the button to.
     */
    public add(contextMenu: ContextMenu): this | undefined {
        const cfg = this.options;
        this.contextMenu = contextMenu;
        contextMenu.buttons.push(this);

        const container = contextMenu.ensureItemsContainer();
        if (!container) {
            return;
        }

        const liEl = this.wrapper = makeHTMLElement('li', cfg.classNameKey && {
            className: Globals.getClassName(cfg.classNameKey)
        }, container);

        const buttonEl = this.buttonEl = makeHTMLElement('button', {
            className: Globals.getClassName('menuItem')
        }, liEl);

        const iconEl = this.iconWrapper = makeHTMLElement('span', {
            className: Globals.getClassName('menuItemIcon')
        }, buttonEl);

        this.spanEl = makeHTMLElement('span', {
            className: Globals.getClassName('menuItemLabel'),
            innerText: cfg.label || ''
        }, buttonEl);

        const chevronEl = makeHTMLElement('span', {
            className: Globals.getClassName('menuItemIcon')
        }, buttonEl);

        iconEl.setAttribute('aria-hidden', 'true');
        chevronEl.setAttribute('aria-hidden', 'true');
        buttonEl.setAttribute('type', 'button');
        buttonEl.setAttribute('tabindex', '-1');

        this.refreshState();

        if (cfg.chevron) {
            chevronEl.appendChild(createGridIcon('chevronRight'));
        }

        if (cfg.icon) {
            this.setIcon(cfg.icon);
        }

        this.addEventListeners();

        return this;
    }

    public focus(): void {
        this.buttonEl?.focus();

        const cm = this.contextMenu;
        if (cm) {
            cm.focusCursor = cm.buttons.indexOf(this);
        }
    }

    public setLabel(label: string): void {
        if (this.spanEl) {
            this.spanEl.innerText = label;
        }
    }

    /**
     * Sets the icon for the button.
     *
     * @param icon
     * The icon to set.
     */
    public setIcon(icon?: GridIconName): void {
        this.icon?.remove();
        if (!icon) {
            return;
        }

        this.icon = createGridIcon(icon);
        this.iconWrapper?.appendChild(this.icon);
    }

    public setActive(active: boolean): void {
        this.isActive = active;
        this.buttonEl?.classList.toggle('active', active);

        const { activeIcon, icon } = this.options;
        if (activeIcon) {
            this.setIcon(active ? activeIcon : icon);
        }
    }

    public setHighlighted(highlighted: boolean): void {
        this.buttonEl?.classList.toggle('highlighted', highlighted);
    }

    /**
     * Destroys the button.
     */
    public destroy(): void {
        this.removeEventListeners();
        this.wrapper?.remove();

        // Unregister from the context menu
        const cm = this.contextMenu;
        if (cm) {
            cm.buttons.splice(cm.buttons.indexOf(this), 1);
            delete this.contextMenu;
        }
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
 *  Declarations
 *
 * */

export interface ContextMenuButtonOptions {
    /**
     * The label for the button.
     */
    label?: string;

    /**
     * The icon for the button.
     */
    icon?: GridIconName;

    /**
     * A class name key applied to the `<li>` wrapper of the button.
     */
    classNameKey?: ClassNameKey;

    /**
     * The icon for the active state of the button.
     */
    activeIcon?: GridIconName;

    /**
     * The icon for the highlighted state of the button.
     */
    highlightedIcon?: GridIconName;

    /**
     * The tooltip string for the button.
     */
    tooltip?: string;

    /**
     * If the chevron icon should be rendered.
     */
    chevron?: boolean;

    /**
     * The click handler for the button.
     */
    onClick?: (event: MouseEvent, button: ContextMenuButton) => void;
}


/* *
 *
 *  Default Export
 *
 * */

export default ContextMenuButton;
