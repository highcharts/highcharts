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
import type { Formula } from '../Formula/Formula';
import type {
    MathModifierColumnFormulaOptions,
    MathModifierOptions
} from './MathModifierOptions';


import DataModifier from './DataModifier.js';
import FormulaParser from '../Formula/FormulaParser.js';
import FormulaProcessor from '../Formula/FormulaProcessor.js';

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
    public static readonly defaultOptions: MathModifierOptions = {
        type: 'Math',
        alternativeSeparators: false
    };


    /* *
     *
     *  Constructor
     *
     * */


    public constructor(
        options: Partial<MathModifierOptions>
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


    public options: MathModifierOptions;


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

        const alternativeSeparators = modifier.options.alternativeSeparators,
            formulaColumns = (
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

        const columnFormulas = (modifier.options.columnFormulas || []);

        for (
            let i = 0,
                iEnd = columnFormulas.length,
                columnFormula: MathModifierColumnFormulaOptions,
                formula: Formula;
            i < iEnd;
            ++i
        ) {
            columnFormula = columnFormulas[i];
            formula = FormulaParser.parseFormula(
                columnFormula.formula,
                alternativeSeparators
            );
            modified.setColumn(
                columnFormula.column,
                modifier.processColumnFormula(
                    formula,
                    table,
                    columnFormula.rowStart,
                    columnFormula.rowEnd
                )
            );
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
                try {
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
                } catch {
                    column[i] = NaN;
                }
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
     * @param {number} rowStart
     * Row index to start the replacing process from.
     *
     * @param {number} rowEnd
     * Row index to end the replacing process.
     *
     * @return {Highcharts.DataTableColumn}
     * Returns the processed table column.
     */
    protected processColumnFormula(
        formula: Formula,
        table: DataTable,
        rowStart: number = 0,
        rowEnd: number = table.getRowCount()
    ): DataTable.Column {
        rowStart = rowStart >= 0 ? rowStart : 0;
        rowEnd = rowEnd >= 0 ? rowEnd : table.getRowCount() + rowEnd;

        const column = [],
            modified = table.modified;


        for (let i = 0, iEnd = (rowEnd - rowStart); i < iEnd; ++i) {
            try {
                column[i] = FormulaProcessor.processFormula(formula, modified);
            } catch {
                column[i] = NaN;
            } finally {
                formula = FormulaProcessor.translateReferences(formula, 0, 1);
            }
        }

        return column;
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
