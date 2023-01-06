/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import OpenStreetMap from './OpenStreetMap.js';
import Google from './Google.js';
import Gaode from './Gaode.js';
import Stamen from './Stamen.js';

const registry: Record<string, typeof ProviderDefinition> = {
    OpenStreetMap,
    Google,
    Gaode,
    Stamen
};

export default registry;
