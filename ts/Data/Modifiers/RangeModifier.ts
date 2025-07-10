/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Dawid Dragula
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from '../DataEvent';
import type { RangeModifierOptions } from './RangeModifierOptions';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;


/* *
 *
 *  Class
 *
 * */


/**
 * Slices the table rows based on the specified range.
 */
class RangeModifier extends DataModifier {


    /* *
     *
     *  Static Properties
     *
     * */


    /**
     * Default options for the range modifier.
     */
    public static readonly defaultOptions: RangeModifierOptions = {
        type: 'Range',
        start: 0,
        end: Infinity
    };


    /* *
     *
     *  Constructor
     *
     * */


    /**
     * Constructs an instance of the range modifier.
     *
     * @param {Partial<RangeModifier.Options>} [options]
     * Options to configure the range modifier.
     */
    public constructor(
        options?: Partial<RangeModifierOptions>
    ) {
        super();

        this.options = merge(RangeModifier.defaultOptions, options);
    }


    /* *
     *
     *  Properties
     *
     * */


    /**
     * Options of the range modifier.
     */
    public readonly options: RangeModifierOptions;


    /* *
     *
     *  Functions
     *
     * */


    /**
     * Replaces table rows with ranged rows.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: DataEvent.Detail
    ): T {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        let { start, end } = modifier.options;
        start = Math.max(0, start || 0);
        end = Math.min(end || Infinity, table.getRowCount());
        const length = Math.max(end - start, 0);

        const modified = table.modified;
        modified.deleteRows();
        modified.setRows(table.getRows(start, length));
        modified.setOriginalRowIndexes(Array.from(
            { length },
            (_, i): number => i + start
        ));

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }
}


/* *
 *
 *  Registry
 *
 * */


declare module './DataModifierType' {
    interface DataModifierTypes {
        Range: typeof RangeModifier;
    }
}

DataModifier.registerType('Range', RangeModifier);


/* *
 *
 *  Default Export
 *
 * */


export default RangeModifier;
