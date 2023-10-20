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

import OpenStreetMap from './OpenStreetMap.js';
import Stamen from './Stamen.js';
import LimaLabs from './LimaLabs.js';
import Thunderforest from './Thunderforest.js';
import Esri from './Esri.js';
import USGS from './USGS.js';

/* *
 *
 *  Declarations
 *
 * */

export interface TilesProviderRegistry {
    Esri: typeof Esri;
    LimaLabs: typeof LimaLabs;
    OpenStreetMap: typeof OpenStreetMap;
    Stamen: typeof Stamen;
    Thunderforest: typeof Thunderforest;
    USGS: typeof USGS;
}

export type TilesProviderRegistryName = keyof TilesProviderRegistry;

/* *
 *
 *  Constants
 *
 * */

const tilesProviderRegistry: TilesProviderRegistry = {
    Esri,
    LimaLabs,
    OpenStreetMap,
    Stamen,
    Thunderforest,
    USGS
};

/* *
 *
 *  Default Export
 *
 * */

export default tilesProviderRegistry;
