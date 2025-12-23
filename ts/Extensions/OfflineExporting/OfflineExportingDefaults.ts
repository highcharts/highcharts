/* *
 *
 *  (c) 2010-2025 Highsoft AS
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

const OfflineExportingDefaults = {
    exporting
};

export default OfflineExportingDefaults;
