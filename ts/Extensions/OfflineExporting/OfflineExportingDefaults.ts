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
 * @private
 */
const exporting: ExportingOptions = {};

/* *
 *
 *  Default Export
 *
 * */

const OfflineExportingDefaults = {
    exporting
};

export default OfflineExportingDefaults;
