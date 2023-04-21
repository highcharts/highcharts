/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from '../DataEvent';
import type DataTable from '../DataTable';
import type {
    Formula,
    Value
} from '../Formula/Formula';


import DataModifier from './DataModifier.js';
import FormulaParser from '../Formula/FormulaParser.js';
import FormulaProcessor from '../Formula/FormulaProcessor.js';
import FormulaTypes from '../Formula/FormulaTypes.js';
const {
    isValue
} = FormulaTypes;

/* *
 *
 *  Class
 *
 * */


/**
 * Replaces formula strings in a table with calculated values.
 *
 * @private
 * @class
 * @name Highcharts.DataModifier.types.MathModifier
 * @augments Highcharts.DataModifier
 */
class MathModifier extends DataModifier {


    /* *
     *
     *  Static Properties
     *
     * */


    /**
     * Default options of MathModifier.
     * @private
     */
    public static readonly defaultOptions: MathModifier.Options = {
        alternativeSeparators: false,
        modifier: 'Math'
    };


    /* *
     *
     *  Constructor
     *
     * */


    public constructor(
        options: Partial<MathModifier.Options>
    ) {
        super();

        this.options = {
            ...MathModifier.defaultOptions,
            ...options
        };
    }


    /* *
     *
     *  Properties
     *
     * */


    public options: MathModifier.Options;


    /* *
     *
     *  Functions
     *
     * */


    public modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: (DataEvent.Detail|undefined)
    ): T {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        const formulaColumns = (
                modifier.options.formulaColumns ||
                table.getColumnNames()
            ),
            modified = table.modified;

        for (
            let i = 0,
                iEnd = formulaColumns.length,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = formulaColumns[i];

            if (formulaColumns.indexOf(columnName) >= 0) {
                modified.setColumn(
                    columnName,
                    modifier.processColumn(table, columnName)
                );
            }
        }

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }


    /**
     * Process a column by replacing formula strings with calculated values.
     *
     * @private
     *
     * @param {Highcharts.DataTable} table
     * Table to extract column from and use as reference.
     *
     * @param {string} columnNameOrAlias
     * Name or alias of column to process.
     *
     * @param {number} rowIndex
     * Row index to start the replacing process from.
     *
     * @return {Highcharts.DataTableColumn}
     * Returns the processed table column.
     */
    protected processColumn(
        table: DataTable,
        columnNameOrAlias: string,
        rowIndex: number = 0
    ): DataTable.Column {
        const alternativeSeparators = this.options.alternativeSeparators,
            column = (table.getColumn(columnNameOrAlias, true) || [])
                .slice(rowIndex > 0 ? rowIndex : 0);

        for (
            let i = 0,
                iEnd = column.length,
                cacheFormula: Formula = [],
                cacheString: string = '',
                cell: DataTable.CellType;
            i < iEnd;
            ++i
        ) {
            cell = column[i];

            if (
                typeof cell === 'string' &&
                cell[0] === '='
            ) {

                // use cache while formula string is repetitive
                cacheFormula = (
                    cacheString === cell ?
                        cacheFormula :
                        FormulaParser.parseFormula(
                            cell.substring(1),
                            alternativeSeparators
                        )
                );

                // process parsed formula string
                column[i] =
                    FormulaProcessor.processFormula(cacheFormula, table);
            }
        }

        return column;
    }


    /**
     * Process a column by replacing cell values with calculated values from a
     * given formula.
     *
     * @private
     *
     * @param {Highcharts.Formula} formula
     * Formula to use for processing.
     *
     * @param {Highcharts.DataTable} table
     * Table to extract column from and use as reference.
     *
     * @param {string} columnNameOrAlias
     * Name or alias of column to process.
     *
     * @param {number} rowIndex
     * Row index to start the replacing process from.
     *
     * @return {Highcharts.DataTableColumn}
     * Returns the processed table column.
     */
    protected processFormula(
        formula: Formula,
        table: DataTable,
        columnNameOrAlias: string,
        rowIndex: number = 0
    ): DataTable.Column {
        const column = (table.getColumn(columnNameOrAlias, true) || [])
                .slice(rowIndex > 0 ? rowIndex : 0),
            modified = table.modified;

        rowIndex = rowIndex > 0 ? rowIndex : 0;

        for (
            let i = 0,
                iEnd = column.length;
            i < iEnd;
            ++i
        ) {
            // @todo pass some form of row index for references/ranges
            column[i] = FormulaProcessor.processFormula(formula, table);
        }

        return column;
    }


}


/* *
 *
 *  Class Namespace
 *
 * */


namespace MathModifier {


    /* *
     *
     *  Declarations
     *
     * */


    /**
     * Options to configure a formula replacing column values.
     */
    export interface ColumnFormula {

        /**
         * Column name or alias in the DataTable to replace with values of the
         * formula.
         */
        column: string;

        /**
         * Formula to use to replace column values.
         */
        formula: string;

        /**
         * Row index to start the replacing process from.
         */
        rowIndex?: number;

    }


    /**
     * Options to configure the MathModifier and Formula system.
     */
    export interface Options extends DataModifier.Options {

        /**
         * Whether to expect regular or alternative separators in formulas.
         * * `false` to expect `,` between arguments and `.` in decimals.
         * * `true` to expect `;` between arguments and `,` in decimals.
         */
        alternativeSeparators: boolean;

        /**
         * Array of column formulas that will be used to replace the column
         * values in their columns.
         * @private
         * @todo Implement
         */
        columnFormulas?: Array<ColumnFormula>;

        /**
         * Array of column names or aliases to replace formula strings to
         * replace with calculated values. By default all columns in a table
         * will be processed.
         */
        formulaColumns?: Array<string>;

    }


}


/* *
 *
 *  Registry
 *
 * */


declare module './DataModifierType' {
    interface DataModifierTypes {
        Math: typeof MathModifier
    }
}


DataModifier.registerType('Math', MathModifier);


/* *
 *
 *  Default Export
 *
 * */


export default MathModifier;
