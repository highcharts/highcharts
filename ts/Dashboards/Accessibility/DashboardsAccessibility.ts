/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

import Dashboard from '../Dashboard.js';

/* *
 *
 *  Imports
 *
 * */

/* *
 *
 *  Functions
 *
 * */

/* *
 *
 *  Class
 *
 * */

class DashboardsAccessibility {
    /* *
    *
    *  Constructor
    *
    * */

    public constructor(
        dashboard: Dashboard
    ) {
        this.dashboard = dashboard;

        this.addTabIndexToCells();
    }

    /* *
     *
     *  Properties
     *
     * */
    public dashboard: Dashboard;

    /* *
    *
    *  Functions
    *
    * */
    public addTabIndexToCells():void {
        const components = this.dashboard.mountedComponents;
        let cell;

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            cell = components[i].cell;
            if (cell && cell.container) {
                cell.container.setAttribute('tabindex', -1);
            }
        }
    }
}

namespace DashboardsAccessibility {
    export interface Options {
        addTabIndexToCells: Function
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DashboardsAccessibility;
