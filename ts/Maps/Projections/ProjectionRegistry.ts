/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type ProjectionDefinition from '../ProjectionTypes';

import EqualEarth from './EqualEarth.js';
import Miller from './Miller.js';
import Orthographic from './Orthographic.js';
import WebMercator from './WebMercator.js';


'use strict';

const registry: Record<string, ProjectionDefinition> = {
    EqualEarth,
    Miller,
    Orthographic,
    WebMercator
};

export default registry;
