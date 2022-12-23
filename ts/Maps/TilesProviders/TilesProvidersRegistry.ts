/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import OpenStreetMap from './OpenStreetMap.js';
import Google from './Google.js';
import Carto from './Carto.js';
import Gaode from './Gaode.js';

const registry: Record<string, typeof ProviderDefinition> = {
    OpenStreetMap,
    Google,
    Carto,
    Gaode
};

export default registry;
