/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import * as _Dashboards from "../dashboards.src";

import _EditMode from "../es-modules/Dashboards/EditMode/EditMode";
import _FullScreen from "../es-modules/Dashboards/EditMode/Fullscreen";

import "../es-modules/Dashboards/EditMode/EditMode";
import "../es-modules/Dashboards/EditMode/FullScreen";

declare module "../dashboards.src" {
    const EditMode: typeof _EditMode;
    const FullScreen: typeof _FullScreen
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
