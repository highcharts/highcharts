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

import type ProjectionDefinition from '../ProjectionDefinition';

import LambertConformalConic from './LambertConformalConic.js';
import EqualEarth from './EqualEarth.js';
import Miller from './Miller.js';
import Orthographic from './Orthographic.js';
import WebMercator from './WebMercator.js';

/* *
 *
 *  Constants
 *
 * */

const registry: Record<string, typeof ProjectionDefinition> = {
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

export default registry;
