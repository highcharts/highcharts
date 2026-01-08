/* *
 *
 *  Grid FilteringRow class
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

import type Table from '../../Table.js';
import type Column from '../../Column.js';

import FilterCell from './FilterCell.js';
import Globals from '../../../Globals.js';
import HeaderRow from '../../Header/HeaderRow.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a special filtering row in the data grid header.
 */
class FilterRow extends HeaderRow {

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a filtering row in the Grid's header.
     *
     * @param viewport
     * The Grid Table instance which the row belongs to.
     */
    constructor(viewport: Table) {
        super(
            viewport,
            (viewport.header?.levels ?? 0) + 1 // Level (1-based)
        );
    }


    /* *
     *
     *  Methods
     *
     * */

    public override createCell(column: Column): FilterCell {
        return new FilterCell(this, column);
    }

    public override renderContent(): void {
        const vp = this.viewport;
        const enabledColumns = vp.grid.enabledColumns || [];

        vp.theadElement?.appendChild(this.htmlElement);
        this.htmlElement.classList.add(Globals.getClassName('headerRow'));

        for (let i = 0, iEnd = vp.columns.length; i < iEnd; i++) {
            const column = vp.columns[i];
            if (enabledColumns?.indexOf(column.id) < 0) {
                continue;
            }

            const cell = this.createCell(column);

            cell.render();

            if (column.options.filtering?.inline) {
                column.filtering?.renderFilteringContent(cell.htmlElement);
            }
        }

        const firstCell = this.cells[0];
        if (firstCell.column?.index === 0) {
            // Add class to disable left border on first column
            this.cells[0].htmlElement.classList.add(
                Globals.getClassName('columnFirst')
            );
        }

        this.setLastCellClass();
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default FilterRow;
