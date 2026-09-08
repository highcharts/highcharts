/* *
 *
 *  Grid FilteringRow class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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

    public override async renderContent(): Promise<void> {
        const vp = this.viewport;
        const desiredKeys: Record<string, boolean> = {};
        const orderedCells: FilterCell[] = [];

        if (!this.htmlElement.parentElement) {
            vp.theadElement?.appendChild(this.htmlElement);
        }
        this.htmlElement.classList.add(Globals.getClassName('headerRow'));
        this.clearPositionClasses();

        const columns = vp.getRenderedColumns();
        const firstColumn = columns[0];

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            const column = columns[i];
            const { cell, isNew } = this.syncHeaderCell(
                this.getColumnCellKey(column.id),
                desiredKeys,
                orderedCells,
                column
            );

            if (column === firstColumn) {
                cell.htmlElement.classList.add(
                    Globals.getClassName('columnFirst')
                );
            }

            if (isNew) {
                await cell.render();

                if (
                    vp.grid.columnPolicy
                        .isColumnInlineFilteringEnabled(column.id)
                ) {
                    column.filtering?.renderFilteringContent(cell.htmlElement);
                }
            }
        }

        this.destroyStaleCells(desiredKeys);
        this.syncCellElements(orderedCells);
        this.cells = orderedCells;
        this.setLastCellClass();
        this.reflowPosition();
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default FilterRow;
