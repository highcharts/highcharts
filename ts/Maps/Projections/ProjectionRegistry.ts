/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type ProjectionDefinition from '../ProjectionTypes';

import EqualEarth from './EqualEarth.js';
import WebMercator from './WebMercator.js';


'use strict';

const registry: Record<string, ProjectionDefinition> = {
    EqualEarth,
    WebMercator
};

export default registry;
