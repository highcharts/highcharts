/* *
 *
 *  Grid Header Cell Toolbar class
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

import type Toolbar from '../../../UI/Toolbar';
import type Column from '../../Column';

import GridUtils from '../../../GridUtils.js';
import Globals from '../../../Globals.js';
import ToolbarButton from '../../../UI/ToolbarButton.js';
import SortToolbarButton from './ToolbarButtons/SortToolbarButton.js';
import FilterToolbarButton from './ToolbarButtons/FilterToolbarButton.js';
import MenuToolbarButton from './ToolbarButtons/MenuToolbarButton.js';
import U from '../../../../../Core/Utilities.js';

const { makeHTMLElement } = GridUtils;
const { getStyle } = U;


/* *
 *
 *  Class
 *
 * */

class HeaderCellToolbar implements Toolbar {

    /**
     * The maximum width of the column to be minimized.
     */
    static MINIMIZED_COLUMN_WIDTH: number = 120;

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The column that this toolbar belongs to.
     */
    public column: Column;

    public buttons: ToolbarButton[] = [];

    public container?: HTMLDivElement;

    public focusCursor: number = 0;

    /**
     * Whether the toolbar is minimized. If true, the toolbar will only show
     * the context menu button.
     */
    private isMinimized?: boolean;

    /**
     * Whether the menu button is centered. Used when the header content is
     * super thin, so that it's not visible.
     */
    private isMenuCentered?: boolean;

    /**
     * The resize observer of the column.
     */
    private columnResizeObserver?: ResizeObserver;

    /**
     * The event listener destroyers of the toolbar.
     */
    private eventListenerDestroyers: Function[] = [];


    /* *
     *
     *  Constructor
     *
     * */

    constructor(column: Column) {
        this.column = column;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Initializes the buttons of the toolbar.
     */
    private renderFull(): void {
        const columnOptions = this.column.options;
        const sortingEnabled = columnOptions.sorting?.enabled ??
            columnOptions.sorting?.sortable;

        if (sortingEnabled) {
            new SortToolbarButton().add(this);
        }

        if (
            columnOptions.filtering?.enabled &&
            !columnOptions.filtering.inline
        ) {
            new FilterToolbarButton().add(this);
        }
    }

    private renderMinimized(): void {
        const columnOptions = this.column.options;
        const sortingEnabled = columnOptions.sorting?.enabled ??
            columnOptions.sorting?.sortable;

        if (
            sortingEnabled || (
                columnOptions.filtering?.enabled &&
                !columnOptions.filtering.inline
            )
        ) {
            new MenuToolbarButton().add(this);
        }
    }

    /**
     * Render the toolbar.
     */
    public add(): void {
        const headerCell = this.column.header;
        if (!headerCell?.container) {
            return;
        }

        if (this.columnResizeObserver) {
            this.columnResizeObserver.disconnect();
            delete this.columnResizeObserver;
        }

        this.columnResizeObserver = new ResizeObserver(
            (): void => this.reflow()
        );
        this.columnResizeObserver.observe(headerCell.container);

        const container = this.container = makeHTMLElement('div', {
            className: Globals.getClassName('headerCellIcons')
        });

        headerCell.container.appendChild(container);

        const onKeyDown = (e: KeyboardEvent): void => {
            this.keyDownHandler(e);
        };
        container.addEventListener('keydown', onKeyDown);
        this.eventListenerDestroyers.push((): void => {
            container.removeEventListener('keydown', onKeyDown);
        });
    }

    /**
     * Refreshes the state of the toolbar buttons.
     * @internal
     */
    public refreshState(): void {
        for (const button of this.buttons) {
            button.refreshState();
        }
    }

    /**
     * Destroys all buttons of the toolbar.
     */
    public clearButtons(): void {
        const { buttons } = this;
        while (buttons.length > 0) {
            buttons[buttons.length - 1].destroy();
        }
    }

    /**
     * Reflows the toolbar. It is called when the column is resized.
     */
    public reflow(): void {
        const width = this.column.getWidth();
        const shouldBeMinimized =
            width <= HeaderCellToolbar.MINIMIZED_COLUMN_WIDTH;

        if (shouldBeMinimized !== this.isMinimized) {
            this.isMinimized = shouldBeMinimized;

            this.clearButtons();
            if (shouldBeMinimized) {
                this.renderMinimized();
            } else {
                this.renderFull();
            }
        }

        if (!shouldBeMinimized) {
            return;
        }

        const parent = this.column.header?.htmlElement;
        const container = this.container;
        const parentWidth = parent?.offsetWidth || 0;
        const containerWidth = this.buttons[0]?.wrapper?.offsetWidth || 0;
        const parentPaddings = (
            (parent && getStyle(parent, 'padding-left', true) || 0) +
            (parent && getStyle(parent, 'padding-right', true) || 0)
        );
        const containerMargins = (
            (container && getStyle(container, 'margin-left', true) || 0) +
            (container && getStyle(container, 'margin-right', true) || 0)
        );
        const shouldBeCentered =
            parentWidth - parentPaddings < containerWidth + containerMargins;

        if (this.isMenuCentered !== shouldBeCentered) {
            this.isMenuCentered = shouldBeCentered;
            this.column.header?.container?.classList.toggle(
                Globals.getClassName('noWidth'), shouldBeCentered
            );
        }
    }

    /**
     * Destroy the toolbar.
     */
    public destroy(): void {
        for (const destroyer of this.eventListenerDestroyers) {
            destroyer();
        }
        this.eventListenerDestroyers.length = 0;
        this.clearButtons();

        this.columnResizeObserver?.disconnect();
        delete this.columnResizeObserver;
    }

    /**
     * Focuses the first button of the toolbar.
     */
    public focus(): void {
        this.buttons[0]?.focus();
    }

    /**
     * Handles the key down event on the toolbar.
     *
     * @param e
     * Keyboard event object.
     */
    private keyDownHandler(e: KeyboardEvent): void {
        const len = this.buttons.length;
        const cursor = this.focusCursor;

        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                this.buttons[Math.abs((cursor - 1 + len) % len)].focus();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                this.buttons[(cursor + 1) % len].focus();
                break;
            case 'Escape':
                this.column.header?.htmlElement.focus();
                break;
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCellToolbar;
