/* *
 *
 *  Grid Exporting composition
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';

import Exporting from './Exporting.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    pushUnique
} = U;

/* *
 *
 *  Class Namespace
 *
 * */

namespace ExportingComposition {
    /**
     * Extends the grid classes with exporting.
     *
     * @param GridClass
     * The class to extend.
     *
     */
    export function compose(
        GridClass: typeof Grid
    ): void {
        if (!pushUnique(Globals.composed, 'Exporting')) {
            return;
        }

        addEvent(GridClass, 'afterRenderViewport', initExporting);
    }

    /**
     * Init exporting
     */
    function initExporting(this: Grid): void {
        this.exporting = new Exporting(this);
    }
}

/* *
 *
 * Declarations
 *
 * */
declare module '../../Core/Grid' {
    export default interface Grid {
        exporting?: Exporting;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ExportingComposition;
