/* *
 *
 *  License Validation Composition for Grid Pro
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Author:
 *  - Mikkel Espolin Birkeland
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';

import { validate } from './LicenseValidation.js';
import Globals from '../../Core/Globals.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';

/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the grid classes with license validation.
 *
 * @param GridClass
 * The class to extend.
 *
 */
function compose(GridClass: typeof Grid): void {

    if (!pushUnique(Globals.composed, 'LicenseValidation')) {
        return;
    }

    addEvent(GridClass, 'afterLoad', validateLicense);
    addEvent(GridClass, 'afterUpdate', validateLicense);
}

/**
 * Callback function called after the grid is loaded or updated.
 *
 * @param this Grid instance.
 */
function validateLicense(this: Grid): void {
    validate(this);
}

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * Grid Key for Grid Pro. Get your Grid Key at:
         * https://shop.highcharts.com
         *
         * The Grid Key can be set globally using `Grid.setOptions()` or
         * on individual Grid instances.
         *
         * @example
         * Global setting.
         *
         * Grid.setOptions({
         *   gridKey: 'XXXX-XXXX-XXXX-AYYY-ZZZZ-WWWW'
         * });
         *
         * @example
         * Per instance.
         *
         * Grid.grid('container', {
         *   gridKey: 'XXXX-XXXX-XXXX-AYYY-ZZZZ-WWWW'
         * });
         */
        gridKey?: string;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
