/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
