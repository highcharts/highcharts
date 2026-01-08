// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/export-data
 * @requires highcharts
 * @requires highcharts/modules/exporting
 *
 * Export data module
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';

import Highcharts from '../../Core/Globals.js';
import DownloadURL from '../../Shared/DownloadURL.js';
import ExportData from '../../Extensions/ExportData/ExportData.js';

const G: AnyRecord = Highcharts;

// Compatibility
G.dataURLtoBlob = G.dataURLtoBlob || DownloadURL.dataURLtoBlob;
G.downloadURL = G.downloadURL || DownloadURL.downloadURL;

// Compose
ExportData.compose(G.Chart, G.Exporting, G.Series);

export default Highcharts;
