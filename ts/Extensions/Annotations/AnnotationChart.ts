/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
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

import type Annotation from './Annotation';
import type Chart from '../../Core/Chart/Chart';
import type Pointer from '../../Core/Pointer';

import U from '../../Core/Utilities.js';
const { wrap } = U;

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */


/**
 * @private
 */
function wrapPointerOnContainerMouseDown(
    this: Annotation,
    proceed: Function
): void {
    if (!this.chart.hasDraggedAnnotation) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
}

/* *
 *
 *  Default Export
 *
 * */

namespace AnnotationChart {

    /* *
     *
     *  Functions
     *
     * */

    export function compose(
        _ChartClass: typeof Chart,
        PointerClass: typeof Pointer
    ): void {

        if (composedClasses.indexOf(PointerClass) === -1) {
            composedClasses.push(PointerClass);

            const pointerProto = PointerClass.prototype;

            wrap(
                pointerProto,
                'onContainerMouseDown',
                wrapPointerOnContainerMouseDown
            );
        }
    }

}

/* *
 *
 *  Export Default
 *
 * */

export default AnnotationChart;
