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


import FormulaParser from './FormulaParser.js';
import FormulaProcessor from './FormulaProcessor.js';
import FormulaType from './FormulaTypes.js';
import FormulaFunction from './Functions/FormulaFunction.js';


import './Functions/Average.js';
import './Functions/Count.js';
import './Functions/If.js';
import './Functions/Not.js';
import './Functions/Sum.js';


/* *
 *
 *  Declarations
 *
 * */


export type {
    FormulaParserError
} from './FormulaParser';


export type {
    Arguments,
    Formula,
    Function,
    Item,
    Operator,
    Pointer,
    Range,
    Term,
    Value
} from './FormulaTypes';


/* *
 *
 *  Default Export
 *
 * */


/**
 * Formula engine to make use of spreadsheet formula strings.
 * @internal
 */
const Formula = {
    ...FormulaParser,
    ...FormulaProcessor,
    ...FormulaType,
    FormulaFunction
};


export default Formula;
