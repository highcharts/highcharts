/* *
 *
 *  Grid Summary Columns Modifier
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

import type { DataEventDetail } from '../../../Data/DataEvent';
import type {
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type DataModifierOptions from '../../../Data/Modifiers/DataModifierOptions';

import DataModifier from '../../../Data/Modifiers/DataModifier.js';
import DataTable from '../../../Data/DataTable.js';


/* *
 *
 *  Declarations
 *
 * */

/**
 * One column the modifier materializes into the queried table.
 */
export interface SummaryColumnSpec {

    /**
     * Id of the aggregating column, written into the table.
     */
    columnId: string;

    /**
     * Resolves the aggregated value of one row of the source table.
     *
     * @param table
     * Table the values are read from.
     *
     * @param rowIndex
     * Row of the table being resolved.
     */
    resolve(table: DataTable, rowIndex: number): DataTableCellType;
}

/* *
 *
 *  Class
 *
 * */

/**
 * Materializes aggregating columns (`columnAggregator` with `materialize`) into
 * the queried table, so that sorting, filtering and exporting see their values.
 *
 * It runs before the sorting and filtering modifiers, on a copy of the user
 * data table.
 */
class SummaryColumnsModifier extends DataModifier {

    /* *
     *
     *  Properties
     *
     * */

    // The modifier is created by the Grid, never from user data options, so it
    // is not part of the modifier registry its `type` names.
    public override readonly options: DataModifierOptions = {
        type: 'SummaryColumns' as DataModifierOptions['type']
    };

    /**
     * Columns to materialize, resolved from the Grid column options.
     */
    private readonly specs: SummaryColumnSpec[];


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs the modifier for a set of aggregating columns.
     *
     * @param specs
     * Columns to materialize.
     */
    public constructor(specs: SummaryColumnSpec[]) {
        super();

        this.specs = specs;
    }


    /* *
     *
     *  Methods
     *
     * */

    public override modifyTable(
        table: DataTable,
        eventDetail?: DataEventDetail
    ): DataTable {
        this.emit({ type: 'modify', detail: eventDetail, table });

        const modified = table.getModified();
        const specs = this.specs;
        const rowCount = table.getRowCount();

        for (let i = 0, iEnd = specs.length; i < iEnd; ++i) {
            const spec = specs[i];
            const values: DataTableCellType[] = [];

            for (let row = 0; row < rowCount; ++row) {
                values.push(spec.resolve(table, row));
            }

            modified.setColumn(spec.columnId, values);
        }

        this.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryColumnsModifier;
