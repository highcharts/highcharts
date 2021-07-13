/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 * Imports
 *
 * */

import type ExportingOptions from '../Exporting/ExportingOptions';
import type Chart from '../../Core/Chart/Chart';

/* *
 *
 * Declarations
 *
 * */

const OfflineExportingDefaults: ExportingOptions = {
    libURL: 'https://code.highcharts.com/@product.version@/lib/',

    // When offline-exporting is loaded, redefine the menu item definitions
    // related to download.
    menuItemDefinitions: {
        downloadPNG: {
            textKey: 'downloadPNG',
            onclick: function (this: Chart): void {
                this.exportChartLocal();
            }
        },
        downloadJPEG: {
            textKey: 'downloadJPEG',
            onclick: function (this: Chart): void {
                this.exportChartLocal({
                    type: 'image/jpeg'
                });
            }
        },
        downloadSVG: {
            textKey: 'downloadSVG',
            onclick: function (this: Chart): void {
                this.exportChartLocal({
                    type: 'image/svg+xml'
                });
            }
        },
        downloadPDF: {
            textKey: 'downloadPDF',
            onclick: function (this: Chart): void {
                this.exportChartLocal({
                    type: 'application/pdf'
                });
            }
        }

    }
};

/* *
 *
 *  Default Export
 *
 * */

export default OfflineExportingDefaults;
