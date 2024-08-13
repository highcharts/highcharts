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
import DGUtils from '../Utils.js';

const { makeHTMLElement } = DGUtils;
/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class HeaderRow extends Row {

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
    constructor(viewport: Table) {
        super(viewport);
        this.setRowAttributes();
    }


    /* *
    *
    *  Methods
    *
    * */

    public override createCell(column: Column): Cell {
        return new HeaderCell(column, this);
    }

    /**
     * Renders the row's content in the header.
     */
    public renderMultipleLevel(level: number): void {
        const header = this.viewport.dataGrid.userOptions?.settings?.header;
        const vp = this.viewport;

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

                const cell = this.createCell(
                    vp.getColumn(columnsOnLevel[i].columnId || '') ||
                    new Column(
                        vp,
                        columnsOnLevel[i].headerFormat || '',
                        i
                    )
                );
                cell.render();
                
                if (columnsOnLevel[i].columnId) {
                    cell.htmlElement.setAttribute(
                        'rowSpan',
                        3 - level
                    );
                } else {
                    cell.htmlElement.setAttribute(
                        'colSpan',
                        this.countColumnIds(columnsOnLevel[i].columns || [])
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
    
        // (array || []).forEach((item: GroupedHeader):void => {
        for (let i = 0, iEnd = level.length; i < iEnd; i++) { 
            if (level[i].columnId) {
                count++;
            }

            if (level[i].columns) {
                count += this.countColumnIds(level[i].columns || []);
            }
        };
    
        return count;
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    private setRowAttributes(): void {
        const el = this.htmlElement;
        el.setAttribute('aria-rowindex', 1);
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
