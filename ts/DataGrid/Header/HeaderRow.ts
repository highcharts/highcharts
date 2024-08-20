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
import type { GroupedHeader } from '../Options';
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
    *  Constructor
    *
    * */

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
        const header = this.viewport.dataGrid.userOptions?.settings?.header;
        const vp = this.viewport;
        const enabledColumns = vp.dataGrid.enabledColumns;

        // Render element
        vp.theadElement.appendChild(
            this.htmlElement
        );

        this.htmlElement.classList.add(
            Globals.classNames.headerRow
        );

        if (header) {
            const columnsOnLevel = this.getColumnsAtLevel(header, level);
            for (let i = 0, iEnd = columnsOnLevel.length; i < iEnd; i++) {
                // Skip hidden column
                const colSpan =
                    vp.dataGrid.getColumnIds(
                        columnsOnLevel[i].columns || []
                    ).length;
                const columnId = (typeof columnsOnLevel[i] === 'string' ?
                    columnsOnLevel[i] : columnsOnLevel[i].columnId) as string;
                const dataColumn = vp.getColumn(columnId || '');
                const {
                    useHTML,
                    headerFormat
                } = columnsOnLevel[i];

                // Skip hidden column or header when all columns are hidden.
                if (
                    (
                        enabledColumns &&
                        columnId &&
                        enabledColumns.indexOf(
                            columnId
                        ) < 0
                    ) || (
                        !dataColumn &&
                        colSpan === 0
                    )
                ) {
                    continue;
                }

                const cell = this.createCell(
                    (
                        vp.getColumn(columnId)
                    ) || (
                        new Column(
                            vp,
                            headerFormat || '',
                            i
                        )
                    )
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
                    cell.htmlElement.setAttribute(
                        'colSpan',
                        colSpan
                    );
                }
            }
        } else {
            super.render();
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
        level: GroupedHeader[],
        targetLevel: number,
        currentLevel = 0
    ): GroupedHeader[] {
        let result:GroupedHeader[] = [];

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
