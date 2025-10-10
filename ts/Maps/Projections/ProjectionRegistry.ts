/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

/** @internal */
export interface ProjectionRegistry {
    EqualEarth: typeof EqualEarth;
    LambertConformalConic: typeof LambertConformalConic;
    Miller: typeof Miller;
    Orthographic: typeof Orthographic;
    WebMercator: typeof WebMercator;
}

/** @internal */
export type ProjectionRegistryName = keyof ProjectionRegistry;

/* *
 *
 *  Constants
 *
 * */

/** @internal */
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
