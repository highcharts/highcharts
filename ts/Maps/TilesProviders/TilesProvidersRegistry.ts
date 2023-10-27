/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import OpenStreetMap from './OpenStreetMap.js';
import Stamen from './Stamen.js';
import LimaLabs from './LimaLabs.js';
import Thunderforest from './Thunderforest.js';
import Esri from './Esri.js';
import USGS from './USGS.js';

const registry: Record<string, typeof ProviderDefinition> = {
    OpenStreetMap,
    Stamen,
    LimaLabs,
    Thunderforest,
    Esri,
    USGS
};

export default registry;
