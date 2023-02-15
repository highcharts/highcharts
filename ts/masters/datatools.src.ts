/**
 * @license Highcharts Data Tools v0.0.1 (@product.date@)
 * @module highsoft/datatools
 * @requires window
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import DataOnDemand from '../Data/DataOnDemand.js';
import DataStates from '../Data/DataStates.js';
import DataTable from '../Data/DataTable.js';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        DataTools: typeof DT;
    }
    let Dashboards: typeof DT;
}

/* *
 *
 *  Namespace
 *
 * */

const DT = {
    DataOnDemand,
    DataStates,
    DataTable
};

/* *
 *
 *  Classic Exports
 *
 * */

if (!window.DataTools) {
    window.DataTools = DT;
}

export default DT;
