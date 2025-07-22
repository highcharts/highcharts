/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/offline-exporting
 * @requires highcharts
 * @requires highcharts/modules/exporting
 *
 * Client side exporting module
 *
 * (c) 2015-2025 Torstein Honsi / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';

import Highcharts from '../../Core/Globals.js';
import DownloadURL from '../../Extensions/DownloadURL.js';
import OfflineExporting from '../../Extensions/OfflineExporting/OfflineExporting.js';

const G: AnyRecord = Highcharts;

// Compatibility
G.dataURLtoBlob = G.dataURLtoBlob || DownloadURL.dataURLtoBlob;
G.downloadSVGLocal = OfflineExporting.downloadSVGLocal;
G.downloadURL = G.downloadURL || DownloadURL.downloadURL;

// Compose
OfflineExporting.compose(G.Exporting);

export default Highcharts;
