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


import './Functions/ABS.js';
import './Functions/AND.js';
import './Functions/AVERAGE.js';
import './Functions/AVERAGEA.js';
import './Functions/COUNT.js';
import './Functions/COUNTA.js';
import './Functions/IF.js';
import './Functions/ISNA.js';
import './Functions/MAX.js';
import './Functions/MEDIAN.js';
import './Functions/MIN.js';
import './Functions/MOD.js';
import './Functions/MODE.js';
import './Functions/NOT.js';
import './Functions/OR.js';
import './Functions/PRODUCT.js';
import './Functions/SUM.js';
import './Functions/XOR.js';


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
    Range,
    Reference,
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
    ...FormulaType
};


export default Formula;
