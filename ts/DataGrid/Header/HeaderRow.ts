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
            // Skip hidden column
            const colSpan = vp.dataGrid.getColumnIds(
                columnsOnLevel[i].columns || []
            ).length;
            const columnId = (typeof columnsOnLevel[i] === 'string' ?
                columnsOnLevel[i] : columnsOnLevel[i].columnId) as string;
            const dataColumn = vp.getColumn(columnId || '');
            const { useHTML, headerFormat } = columnsOnLevel[i];

            // Skip hidden column or header when all columns are hidden.
            if (
                (
                    columnId &&
                    enabledColumns && enabledColumns?.indexOf(columnId) < 0
                ) || (!dataColumn && colSpan === 0 )
            ) {
                continue;
            }

            const cell = this.createCell(
                vp.getColumn(columnId) || new Column(vp, headerFormat || '', i)
            );

            if (headerFormat) {
                cell.userOptions.headerFormat = headerFormat;
            }

            if (useHTML) {
                cell.userOptions.useHTML = useHTML;
            }

            cell.render();

            if (columnId) {
                cell.htmlElement.setAttribute(
                    'rowSpan',
                    (this.viewport.header?.levels || 1) - level
                );
            } else {
                cell.htmlElement.setAttribute('colSpan', colSpan);
            }
        }

        this.reflow();
    }
    /**
     * Get all headers that should be rendered in a level.
     *
     * @param level
     * Level that we start
     * @param targetLevel
     * Max level
     * @param currentLevel
     * Current level
     * @returns
     */
    private getColumnsAtLevel(
        level: GroupedHeaderOptions[],
        targetLevel: number,
        currentLevel = 0
    ): GroupedHeaderOptions[] {
        let result:GroupedHeaderOptions[] = [];

        for (let i = 0, iEnd = level.length; i < iEnd; i++) {
            if (currentLevel === targetLevel) {
                result.push(level[i]);
            }
            if (level[i].columns) {
                result = result.concat(
                    this.getColumnsAtLevel(
                        level[i].columns || [],
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
