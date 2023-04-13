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

import type DataEvent from '../../DataEvent';
import type DataTable from '../../DataTable';

import DataModifier from '../DataModifier.js';
import MathFormula from './MathFormula.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Filters out table rows with a specific value range.
 *
 * @private
 */
class MathModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions: MathModifier.Options = {
        alternativeSeparator: false,
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

        const modified = table.modified;

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
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

    export interface Options extends DataModifier.Options {
        alternativeSeparator: boolean;
    }

    /* *
     *
     *  Constants
     *
     * */

    export const parseFormula = MathFormula.parseFormula;

    /* *
     *
     *  Functions
     *
     * */

    export function elementaryAlgebra(
        operation: string,
        x: number,
        y: number
    ): number {
        switch (operation) {
            case '+':
                return x + y;
            case '-':
                return x - y;
            case '*':
                return x * y;
            case '/':
                return x / y;
            case '^':
                return Math.pow(x, y);
            default:
                return NaN;
        }
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module '../DataModifierType' {
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
