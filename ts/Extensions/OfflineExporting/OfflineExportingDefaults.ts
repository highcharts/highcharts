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
            onclick: function (): void {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                (async (): Promise<void> => {
                    await this.exporting?.exportChartLocal({
                        type: 'application/pdf'
                    });
                })();
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
