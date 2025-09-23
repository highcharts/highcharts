/* *
 *
 *  Grid Header Cell Toolbar class
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

import type Toolbar from '../../UI/Toolbar';
import type Column from '../Column';

import GridUtils from '../../GridUtils.js';
import Globals from '../../Globals.js';
import ToolbarButton from '../../UI/ToolbarButton.js';
import SortToolbarButton from './ColumnToolbarButtons/SortToolbarButton.js';
import FilterToolbarButton from './ColumnToolbarButtons/FilterToolbarButton.js';
import MenuToolbarButton from './ColumnToolbarButtons/MenuToolbarButton.js';

const { makeHTMLElement } = GridUtils;


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

    /**
     * The buttons of the toolbar.
     */
    public buttons: ToolbarButton[] = [];

    /**
     * The container of the toolbar.
     */
    public container?: HTMLDivElement;

    /**
     * Whether the toolbar is minimized. If true, the toolbar will only show
     * the context menu button.
     */
    private isMinimized?: boolean;

    /**
     * The resize observer of the column.
     */
    private columnResizeObserver?: ResizeObserver;

    /**
     * The event listener destroyers of the toolbar.
     */
    private eventListenerDestroyers: Function[] = [];

    /**
     * The index of the focused button in the toolbar.
     */
    private focusCursor: number = 0;


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

        if (columnOptions.sorting?.sortable) {
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
        new MenuToolbarButton().add(this);
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
    }

    /**
     * Destroy the toolbar.
     */
    public destroy(): void {
        for (const destroyer of this.eventListenerDestroyers) {
            destroyer();
        }

        this.columnResizeObserver?.disconnect();
        delete this.columnResizeObserver;
    }

    /**
     * Focuses the first button of the toolbar.
     */
    public focus(): void {
        this.focusCursor = 0;
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
        switch (e.key) {
            case 'ArrowLeft':
                this.focusCursor = Math.abs(
                    (this.focusCursor - 1 + len) % len
                );
                this.buttons[this.focusCursor].focus();
                break;
            case 'ArrowRight':
                this.focusCursor = (this.focusCursor + 1) % len;
                this.buttons[this.focusCursor].focus();
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
