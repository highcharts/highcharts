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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';

import LicenseValidation from './LicenseValidation.js';
import Globals from '../../../Core/Globals.js';
import GridGlobals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    pushUnique
} = U;

/* *
 *
 *  Namespace
 *
 * */

/**
 * @internal
 */
namespace LicenseValidationComposition {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Compose license validation into Grid Pro.
     *
     * @param GridClass
     * The Grid class to extend with license validation.
     *
     * @internal
     */
    export function compose(GridClass: typeof Grid): void {
        // Ensure composition only applied once
        if (!pushUnique(Globals.composed, 'LicenseValidation')) {
            return;
        }

        // Hook into Grid after viewport render (earliest event Grid fires)
        addEvent(GridClass, 'afterRenderViewport', onGridInit);
    }

    /**
     * Check license on Grid initialization.
     *
     * @internal
     */
    function onGridInit(this: Grid): void {
        // Skip validation in SSR environments
        if (typeof window === 'undefined') {
            return;
        }

        // Skip validation on whitelisted URLs
        // (localhost, *.highcharts.com, *.jsfiddle.net)
        if (LicenseValidation.isWhitelistedURL()) {
            return;
        }

        // Get license key from instance
        let licenseKey = this.options?.licenseKey;

        // Auto-promote instance key to global if different from current global
        // (Allows later grids to override stale/invalid keys)
        if (
            licenseKey &&
            licenseKey !== (GridGlobals as AnyRecord).licenseKey
        ) {
            (GridGlobals as AnyRecord).licenseKey = licenseKey;
        }

        // Use global key if instance doesn't have one
        if (!licenseKey) {
            licenseKey = (GridGlobals as AnyRecord).licenseKey;
        }

        // Skip validation if we've already validated this exact key
        const lastKey = (GridGlobals as AnyRecord).lastValidatedKey;
        if (lastKey !== void 0 && licenseKey === lastKey) {
            return;
        }

        // Validate the license key
        const isValid = LicenseValidation.validate(licenseKey);

        // Track the validated key to avoid redundant validation
        (GridGlobals as AnyRecord).lastValidatedKey = licenseKey;

        // Show warning only once if invalid or missing
        const hasWarned = (GridGlobals as AnyRecord).licenseWarningShown;
        if (!isValid && !hasWarned) {
            // eslint-disable-next-line no-console
            console.warn(
                'This is an unlicensed version of Highcharts Grid Pro. ' +
                'Insert Grid Key in the configuration or visit ' +
                'https://shop.highcharts.com to get one.'
            );
            (GridGlobals as AnyRecord).licenseWarningShown = true;
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default LicenseValidationComposition;
