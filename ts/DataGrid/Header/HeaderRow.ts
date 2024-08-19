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
import Table from '../Table.js';
import Globals from '../Globals.js';
import HeaderCell from './HeaderCell.js';
import Cell from '../Cell.js';
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

    /**
     * Constructs a row in the data grid header.
     *
     * @param viewport
     * The Data Grid Table instance which the row belongs to.
     */
    constructor(viewport: Table, index: number) {
        super(viewport, index);
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
                    this.countColumnIds(columnsOnLevel[i].columns || []);
                const dataColumn = vp.getColumn(
                    columnsOnLevel[i].columnId || ''
                );
                const {
                    useHTML,
                    headerFormat,
                    columnId
                } = columnsOnLevel[i];

                // Skip hidden column or header when all columns are hidden.
                if (
                    (
                        enabledColumns &&
                        columnId &&
                        enabledColumns.indexOf(
                            columnId as string
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
                        vp.getColumn(
                            columnId || ''
                        )
                    ) || (
                        new Column(
                        vp,
                        headerFormat || '',
                        i
                    ))
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
     * @param level - level that we start
     * @param targetLevel - max level
     * @param currentLevel - current level
     * @returns 
     */
    private getColumnsAtLevel (
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
        };
    
        return result;
    }

    /**
     * Calculates all references to columns in child. It is necessary to set
     * correct colpan and calculate width. 
     * 
     * @param level - level that we start
     * @returns 
     */
    public countColumnIds(level: GroupedHeader[]): number {
        let count = 0;
        const enabledColumns = this.viewport.dataGrid.enabledColumns;

        for (let i = 0, iEnd = level.length; i < iEnd; i++) {
            if (
                enabledColumns &&
                level[i].columnId &&
                enabledColumns.indexOf(level[i].columnId as string) > -1
            ) {
                count++;
            }

            if (level[i].columns) {
                count += this.countColumnIds(level[i].columns || []);
            }
        };
    
        return count;
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
