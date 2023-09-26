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

export interface ProjectionRegistry {
    EqualEarth: typeof EqualEarth;
    LambertConformalConic: typeof LambertConformalConic;
    Miller: typeof Miller;
    Orthographic: typeof Orthographic;
    WebMercator: typeof WebMercator;
}

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
