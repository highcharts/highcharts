/* *
 *
 *  Grid Summary Table Cell
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import type {
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type SummaryTableRow from './SummaryTableRow';

import TableCell from '../../Core/Table/Body/TableCell.js';
import { defined } from '../../../Shared/Utilities.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Read-only cell rendering a computed summary value from the row object.
 */
class SummaryTableCell extends TableCell {

    public declare readonly row: SummaryTableRow;

    /**
     * Renders the value, sourcing it from the computed summary row object
     * instead of the data provider, then runs the normal cell pipeline so
     * `cells.format`, renderers and styles are honored.
     *
     * @param value
     * Optional explicit value.
     *
     * @param updateDataset
     * Ignored for summary cells.
     */
    public override async setValue(
        value?: DataTableCellType,
        updateDataset: boolean = false
    ): Promise<void> {
        if (!defined(value)) {
            value = this.row.data[this.column.id] as DataTableCellType;
        }

        await super.setValue(value, updateDataset);
    }

    /**
     * Summary cells are never editable.
     */
    public override isEditable(): boolean {
        return false;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryTableCell;
