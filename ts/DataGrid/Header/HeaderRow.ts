/* *
 *
 *  Data Grid class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import type { GroupedHeaderOptions } from '../Options';
import Table from '../Table.js';
import Row from '../Row.js';
import Globals from '../Globals.js';
import HeaderCell from './HeaderCell.js';
import Column from '../Column.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid header.
 */
class HeaderRow extends Row {
    /* *
    *
    *  Properties
    *
    * */

    /**
     * The level in the header.
     */
    public level: number;
    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param viewport
     * The Data Grid Table instance which the row belongs to.
     *
     * @param level
     * The current level of header that is rendered.
     */
    constructor(viewport: Table, level: number) {
        super(viewport);
        this.level = level;
        this.setRowAttributes();
    }
    /* *
    *
    *  Methods
    *
    * */

    public override createCell(column: Column): HeaderCell {
        return new HeaderCell(column, this);
    }

    /**
     * Renders the row's content in the header.
     *
     * @param level
     * The current level in the header tree
     */
    public renderMultipleLevel(level: number): void {
        const header = this.viewport.dataGrid.options?.settings?.header;
        const vp = this.viewport;
        const enabledColumns = vp.dataGrid.enabledColumns;

        // Render element
        vp.theadElement.appendChild(this.htmlElement);
        this.htmlElement.classList.add(Globals.classNames.headerRow);

        if (!header) {
            super.render();
            this.reflow();
            return;
        }

        const columnsOnLevel = this.getColumnsAtLevel(header, level);

        for (let i = 0, iEnd = columnsOnLevel.length; i < iEnd; i++) {
            const column = columnsOnLevel[i];
            const colSpan =
                (typeof column !== 'string' && column.columns) ?
                    vp.dataGrid.getColumnIds(column.columns).length : 0;
            const columnId = typeof column === 'string' ?
                column : column.columnId;
            const dataColumn = vp.getColumn(columnId || '');
            const headerFormat = (typeof column !== 'string') ?
                column.headerFormat : void 0;
            const className = (typeof column !== 'string') ?
                column.className : void 0;

            // Skip hidden column or header when all columns are hidden.
            if (
                (
                    columnId &&
                    enabledColumns && enabledColumns?.indexOf(columnId) < 0
                ) || (!dataColumn && colSpan === 0)
            ) {
                continue;
            }

            const headerCell = this.createCell(
                vp.getColumn(columnId || '') ||
                new Column(
                    vp,
                    headerFormat?.replace(/<[^>]*>/g, '') || '', // Remove HTML tags and empty spaces.
                    i
                )
            );

            if (headerFormat) {
                headerCell.userOptions.headerFormat = headerFormat;
            }

            if (className) {
                headerCell.userOptions.className = className;
            }

            // Add class to disable left border on first column
            if (dataColumn?.index === 0 && i === 0) {
                headerCell.htmlElement.classList.add(
                    Globals.classNames.columnFirst
                );
            }

            headerCell.render();
            headerCell.columns =
                typeof column !== 'string' ? column.columns : void 0;

            if (columnId) {
                headerCell.htmlElement.setAttribute(
                    'rowSpan',
                    (this.viewport.header?.levels || 1) - level
                );
            } else {
                if (colSpan > 1) {
                    headerCell.htmlElement.setAttribute('colSpan', colSpan);
                }
            }
        }

        this.reflow();
    }
    /**
     * Get all headers that should be rendered in a level.
     *
     * @param scope
     * Level that we start
     * @param targetLevel
     * Max level
     * @param currentLevel
     * Current level
     * @returns
     */
    private getColumnsAtLevel(
        scope: Array<GroupedHeaderOptions | string>,
        targetLevel: number,
        currentLevel: number = 0
    ): Array<GroupedHeaderOptions|string> {
        let result: Array<GroupedHeaderOptions|string> = [];

        for (const column of scope) {
            if (currentLevel === targetLevel) {
                result.push(column);
            }

            if (typeof column !== 'string' && column.columns) {
                result = result.concat(
                    this.getColumnsAtLevel(
                        column.columns,
                        targetLevel,
                        currentLevel + 1
                    )
                );
            }
        }

        return result;
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    public setRowAttributes(): void {
        const el = this.htmlElement;
        el.setAttribute('aria-rowindex', this.level);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace HeaderRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderRow;
