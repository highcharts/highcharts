/* *
 *
 *  Projection registry
 *
 *  (c) 2021-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Torstein Honsi
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import LambertConformalConic from './LambertConformalConic.js';
import EqualEarth from './EqualEarth.js';
import Miller from './Miller.js';
import Orthographic from './Orthographic.js';
import WebMercator from './WebMercator.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @interface Highcharts.ProjectionRegistry
 */
export interface ProjectionRegistry {
    EqualEarth: typeof EqualEarth;
    LambertConformalConic: typeof LambertConformalConic;
    Miller: typeof Miller;
    Orthographic: typeof Orthographic;
    WebMercator: typeof WebMercator;
}

/**
 * @typedef {keyof Highcharts.ProjectionRegistry} Highcharts.ProjectionRegistryName
 */
export type ProjectionRegistryName = keyof ProjectionRegistry;

/* *
 *
 *  Constants
 *
 * */

const projectionRegistry: ProjectionRegistry = {
    EqualEarth,
    LambertConformalConic,
    Miller,
    Orthographic,
    WebMercator
};

/* *
 *
 *  Default Export
 *
 * */

export default projectionRegistry;
