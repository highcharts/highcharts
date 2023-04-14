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
import ProcessorFunction from './Functions/ProcessorFunction.js';

import './Functions/Average.js';
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
 *
 * @private
 * @namespace Formula
 */
const Formula = {
    ...FormulaParser,
    ...FormulaProcessor,
    ...FormulaType,
    ProcessorFunction
};

export default Formula;
