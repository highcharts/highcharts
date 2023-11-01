/* *
 *
 *  (c) 2014-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import U from '../../Core/Utilities.js';
const { objectEach } = U;

/* *
 *
 *  Namespace
 *
 * */

namespace TreemapUtilities {

    /* *
     *
     *  Declarations
     *
     * */

    interface TreemapRecursiveCallbackFunction<TContext = any, TItem = any> {
        (this: TContext, item: TItem): (boolean|TItem);
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @todo find correct name for this function.
     * @todo Similar to reduce, this function is likely redundant
     */
    export function recursive<TContext = any, TItem = any>(
        this: any,
        item: TItem,
        func: TreemapRecursiveCallbackFunction<TContext, TItem>,
        context?: TContext
    ): void {
        let next: any;

        next = func.call(context || this, item);
        if (next !== false) {
            recursive(next, func, context);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default TreemapUtilities;
