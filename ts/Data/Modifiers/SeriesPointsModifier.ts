/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */
import type DataEventEmitter from '../DataEventEmitter';
import DataModifier from './DataModifier.js';
import DataJSON from './../DataJSON.js';
import DataTable from './../DataTable.js';
import U from './../../Core/Utilities.js';
import DataTableRow from './../DataTableRow.js';

const {
    merge
} = U;

class SeriesPointsModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options for the series points modifier.
     */
    public static readonly defaultOptions: SeriesPointsModifier.Options = {
        modifier: 'SeriesPoints',
        aliasMap: {}
    };

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a class JSON to a series points modifier.
     *
     * @param {SeriesPointsModifier.ClassJSON} json
     * Class JSON to convert to an instance of series points modifier.
     *
     * @return {SeriesPointsModifier}
     * Series points modifier of the class JSON.
     */
    public static fromJSON(json: SeriesPointsModifier.ClassJSON): SeriesPointsModifier {
        return new SeriesPointsModifier(json.options);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the series points modifier.
     *
     * @param {SeriesPointsModifier.Options} [options]
     * Options to configure the series points modifier.
     */
    public constructor(options?: DeepPartial<SeriesPointsModifier.Options>) {
        super();

        this.options = merge(SeriesPointsModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the series points modifier.
     */
    public options: SeriesPointsModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create new DataTable with the same rows and add alternative
     * column names (alias) depending on mapping option.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     */
    public execute(
        table: DataTable,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this,
            aliasMap = modifier.options.aliasMap || {},
            aliasKeys = Object.keys(aliasMap),
            aliasValues = [],
            newTable = new DataTable();

        let row,
            newRow,
            newCells: Record<string, DataTableRow.CellType>,
            cellName,
            cellAliasOrName,
            cellNames,
            cell,
            aliasIndex;

        this.emit({ type: 'execute', detail: eventDetail, table });

        for (let k = 0, kEnd = aliasKeys.length; k < kEnd; k++) {
            aliasValues.push(aliasMap[aliasKeys[k]]);
        }

        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; i++) {
            row = table.getRow(i);

            if (row) {
                newCells = {};
                cellNames = row.getCellNames();

                for (let j = 0, jEnd = row.getCellCount(); j < jEnd; j++) {
                    cellName = cellNames[j];
                    aliasIndex = aliasValues.indexOf(cellName);
                    cellAliasOrName = aliasIndex !== -1 ? aliasKeys[aliasIndex] : cellName;

                    cell = row.getCell(cellName);
                    newCells[cellAliasOrName] = cell;
                }

                newRow = new DataTableRow(newCells);
                newTable.insertRow(newRow);
            }
        }

        this.emit({ type: 'afterExecute', detail: eventDetail, table: newTable });

        return newTable;
    }

    /**
     * Converts the series points modifier to a class JSON,
     * including all containing all modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this series points modifier.
     */
    public toJSON(): SeriesPointsModifier.ClassJSON {
        const json = {
            $class: 'SeriesPointsModifier',
            options: merge(this.options)
        };

        return json;
    }
}

/* *
 *
 *  Namespace
 *
 * */
namespace SeriesPointsModifier {
    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataModifier.ClassJSON {
        // nothing here yet
    }

    export interface Options extends DataModifier.Options {
        aliasMap: Record<string, string>;
    }
}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(SeriesPointsModifier);
DataModifier.addModifier(SeriesPointsModifier);

declare module './Types' {
    interface DataModifierTypeRegistry {
        SeriesPoints: typeof SeriesPointsModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default SeriesPointsModifier;
