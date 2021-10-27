/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ProjectionDefinition from '../ProjectionDefinition';

import EqualEarth from './EqualEarth.js';
import Miller from './Miller.js';
import Orthographic from './Orthographic.js';
import WebMercator from './WebMercator.js';


const registry: Record<string, ProjectionDefinition> = {
    EqualEarth,
    Miller,
    Orthographic,
    WebMercator
};

export default registry;
