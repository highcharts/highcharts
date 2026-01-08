/* *
 *
 *  Grid Cell abstract class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../../Data/DataTable';
import type TableRow from './Body/TableRow';
import type HeaderRow from './Header/HeaderRow';

import Column from './Column';
import Row from './Row';
import Templating from '../../../Core/Templating.js';
import U from '../../../Core/Utilities.js';

const {
    fireEvent
} = U;


/* *
 *
 *  Abstract Class of Cell
 *
 * */
abstract class Cell {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The HTML element of the cell.
     */
    public htmlElement: HTMLTableCellElement;

    /**
     * The column of the cell.
     */
    public column?: Column;

    /**
     * The row of the cell.
     */
    public row: Row;

    /**
     * The raw value of the cell.
     */
    public value: DataTable.CellType;

    /**
     * An additional, custom class name that can be changed dynamically.
     */
    private customClassName?: string;

    /**
     * Array of cell events to be removed when the cell is destroyed.
     */
    protected cellEvents: Array<[
        keyof HTMLElementEventMap,
        (e: Event) => void
    ]> = [];


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid.
     *
     * @param row
     * The row of the cell.
     *
     * @param column
     * The column of the cell.
     */
    constructor(row: Row, column?: Column) {
        this.column = column;
        this.row = row;
        this.row.registerCell(this);

        this.htmlElement = this.init();
        this.htmlElement.setAttribute('tabindex', '-1');

        if (!this.column?.options.cells?.editMode?.enabled) {
            this.htmlElement.setAttribute('aria-readonly', 'true');
        }

        this.initEvents();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Init element.
     * @internal
     */
    protected init(): HTMLTableCellElement {
        const cell = document.createElement('td', {});

        cell.setAttribute('role', 'gridcell');

        return cell;
    }

    /**
     * Initialize event listeners. Events added to the `cellEvents` array will
     * be registered now and unregistered when the cell is destroyed.
     */
    protected initEvents(): void {
        this.cellEvents.push(['blur', (): void => this.onBlur()]);
        this.cellEvents.push(['focus', (): void => this.onFocus()]);
        this.cellEvents.push(['click', (e): void => {
            this.onClick(e as MouseEvent);
        }]);
        this.cellEvents.push(['keydown', (e): void => {
            this.onKeyDown(e as KeyboardEvent);
        }]);
        this.cellEvents.push(['mouseout', (): void => {
            this.onMouseOut();
        }]);
        this.cellEvents.push(['mouseover', (): void => {
            this.onMouseOver();
        }]);

        this.cellEvents.forEach((pair): void => {
            this.htmlElement.addEventListener(pair[0], pair[1]);
        });
    }

    /**
     * Handles user click on the cell. If Enter key is pressed, it will be
     * handled by the `onClick` method.
     *
     * @param e
     * Mouse event object or keyboard event object when Enter key is pressed.
     *
     * @internal
     */
    protected abstract onClick(e: MouseEvent|KeyboardEvent): void;

    /**
     * Handles the focus event on the cell.
     */
    protected onFocus(): void {
        this.row.viewport.setFocusAnchorCell(this);
    }

    /**
     * Handles the blur event on the cell.
     */
    protected onBlur(): void {
        delete this.row.viewport.focusCursor;
    }

    /**
     * Handles user keydown on the cell.
     *
     * @param e
     * Keyboard event object.
     */
    protected onKeyDown(e: KeyboardEvent): void {
        const { row, column } = this;
        if (!column) {
            return;
        }

        const vp = row.viewport;
        const { header } = vp;

        const getVerticalPos = (): number => {
            if ((row as TableRow).index !== void 0) {
                return (row as TableRow).index - vp.rows[0].index;
            }

            const level = (row as HeaderRow).level;
            if (!header || level === void 0) {
                return 0;
            }

            return Math.max(level, header.levels) - header.rows.length - 1;
        };

        const changeFocusKeys: Record<typeof e.key, [number, number]> = {
            ArrowDown: [1, 0],
            ArrowUp: [-1, 0],
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1]
        };

        const dir = changeFocusKeys[e.key];

        if (e.key === 'Enter') {
            this.onClick(e);
        }

        if (dir) {
            e.preventDefault();
            e.stopPropagation();

            const { header } = vp;
            const localRowIndex = getVerticalPos();
            const nextVerticalDir = localRowIndex + dir[0];

            if (nextVerticalDir < 0 && header) {
                const extraRowIdx = header.rows.length + nextVerticalDir;
                if (extraRowIdx + 1 > header.levels) {
                    header.rows[extraRowIdx]
                        .cells[column.index + dir[1]]?.htmlElement.focus();
                } else {
                    vp.columns[column.index + dir[1]]
                        ?.header?.htmlElement.focus();
                }
                return;
            }

            const nextRow = vp.rows[nextVerticalDir];
            if (nextRow) {
                nextRow.cells[column.index + dir[1]]?.htmlElement.focus();
            }
        }
    }

    /**
     * Handles the mouse over event on the cell.
     * @internal
     */
    protected onMouseOver(): void {
        const { grid } = this.row.viewport;
        grid.hoverColumn(this.column?.id);

        fireEvent(this, 'mouseOver', {
            target: this
        });
    }

    /**
     * Handles the mouse out event on the cell.
     * @internal
     */
    protected onMouseOut(): void {
        const { grid } = this.row.viewport;
        grid.hoverColumn();

        fireEvent(this, 'mouseOut', {
            target: this
        });
    }

    /**
     * Renders the cell by appending the HTML element to the row.
     */
    public render(): void {
        this.row.htmlElement.appendChild(this.htmlElement);
        this.reflow();
    }

    /**
     * Reflows the cell dimensions.
     */
    public reflow(): void {
        const column = this.column;
        if (!column) {
            return;
        }

        const elementStyle = this.htmlElement.style;

        elementStyle.width = elementStyle.maxWidth = column.getWidth() + 'px';
    }

    /**
     * Returns the formatted string where the templating context is the cell.
     *
     * @param template
     * The template string.
     *
     * @return
     * The formatted string.
     */
    public format(template: string): string {
        return Templating.format(template, this, this.row.viewport.grid);
    }

    /**
     * Sets the custom class name of the cell based on the template.
     *
     * @param template
     * The template string.
     */
    protected setCustomClassName(template?: string): void {
        const element = this.htmlElement;

        if (this.customClassName) {
            element.classList.remove(...this.customClassName.split(/\s+/g));
        }

        if (!template) {
            delete this.customClassName;
            return;
        }

        const newClassName = this.format(template);
        if (!newClassName) {
            delete this.customClassName;
            return;
        }

        element.classList.add(...newClassName.split(/\s+/g));
        this.customClassName = newClassName;
    }

    /**
     * Destroys the cell.
     */
    public destroy(): void {
        this.cellEvents.forEach((pair): void => {
            this.htmlElement.removeEventListener(pair[0], pair[1]);
        });

        this.column?.unregisterCell(this);
        this.row.unregisterCell(this);
        this.htmlElement.remove();
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Cell;
