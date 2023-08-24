/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import * as _Dashboards from "../dashboards.src";

import _Formula from "../es-modules/Data/Formula/Formula";

import "../es-modules/Data/Modifiers/MathModifier";

declare module "../dashboards.src" {
    const Formula: typeof _Formula;
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
