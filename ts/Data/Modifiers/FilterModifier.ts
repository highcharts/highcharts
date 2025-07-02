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
import type { FilterModifierOptions } from './FilterModifierOptions';

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
 * Filters out table rows with a specific query.
 *
 */
class FilterModifier extends DataModifier {


    /* *
     *
     *  Static Properties
     *
     * */


    /**
     * Default options for the range modifier.
     */
    public static readonly defaultOptions: FilterModifierOptions = {
        type: 'Filter'
    };


    /* *
     *
     *  Constructor
     *
     * */


    /**
     * Constructs an instance of the range modifier.
     *
     * @param {Partial<FilterModifier.Options>} [options]
     * Options to configure the range modifier.
     */
    public constructor(
        options?: Partial<FilterModifierOptions>
    ) {
        super();

        this.options = merge(FilterModifier.defaultOptions, options);
    }


    /* *
     *
     *  Properties
     *
     * */


    /**
     * Options of the range modifier.
     */
    public readonly options: FilterModifierOptions;


    /* *
     *
     *  Functions
     *
     * */


    /**
     * Replaces table rows with filtered rows.
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

        const { filterIn, contains } = modifier.options;

        if (!contains) {
            return table;
        }

        let columnNames: string[];
        if (typeof filterIn === 'string') {
            columnNames = [filterIn];
        } else if (Array.isArray(filterIn)) {
            columnNames = filterIn;
        } else {
            columnNames = table.getColumnNames();
        }

        // This is not an ideal solution, but let's follow the convention of the
        // other modifiers for now.
        const modified = table.modified;
        const rows = [];
        const indexes: Array<number|undefined> = [];

        for (
            let i = 0,
                iEnd = table.getRowCount(),
                jEnd = columnNames.length,
                match: boolean,
                cell: string;
            i < iEnd;
            ++i
        ) {
            const row = table.getRow(i, columnNames);
            if (!row) {
                continue;
            }

            match = false;

            for (let j = 0; j < jEnd; ++j) {
                cell = '' + row[j];

                if (cell.includes(contains)) {
                    match = true;
                    break;
                }
            }

            if (match) {
                rows.push(table.getRow(i) || []);
                indexes.push(modified.getOriginalRowIndex(i));
            }
        }

        modified.deleteRows();
        modified.setRows(rows);
        modified.setOriginalRowIndexes(indexes);

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
        Filter: typeof FilterModifier;
    }
}

DataModifier.registerType('Filter', FilterModifier);


/* *
 *
 *  Default Export
 *
 * */


export default FilterModifier;
