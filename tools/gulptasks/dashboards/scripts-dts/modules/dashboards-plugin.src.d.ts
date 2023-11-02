/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import * as _Dashboards from "../dashboards.src";
import _DataGridPlugin from "../es-modules/Dashboards/Plugins/DataGridPlugin";
import _HighchartsPlugin from "../es-modules/Dashboards/Plugins/HighchartsPlugin";

declare module "../dashboards.src" {
    const DataGridPlugin: typeof _DataGridPlugin;
    const HighchartsPlugin: typeof _HighchartsPlugin;
}

/**
 * Adds the module to the imported Dashboards namespace.
 *
 * @param dashboards
 * The imported Dashboards namespace to extend.
 */
declare function factory(dashboards: typeof _Dashboards): void;

export let Dashboards: typeof _Dashboards;

export default factory;
