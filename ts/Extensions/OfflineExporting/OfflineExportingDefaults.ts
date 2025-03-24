/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
    // When offline-exporting is loaded, redefine the menu item definitions
    // related to download (adding local PDF export)
    menuItemDefinitions: {
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
