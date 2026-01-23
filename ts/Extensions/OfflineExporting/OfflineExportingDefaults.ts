/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ExportingOptions from '../Exporting/ExportingOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * @optionparent exporting
 * @internal
 */
const exporting: ExportingOptions = {};

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const OfflineExportingDefaults = {
    exporting
};

/** @internal */
export default OfflineExportingDefaults;
