/* *
 * LimaLabs provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

class LimaLabs implements ProviderDefinition {
    themes = {
        Standard: {
            url: 'https://cdn.lima-labs.com/{zoom}/{x}/{y}.png?api={apikey}',
            minZoom: 0,
            maxZoom: 20
        }
    };

    initialProjectionName = 'WebMercator';

    defaultCredits = 'Map data \u00a92023 <a href="https://maps.lima-labs.com/">LimaLabs</a>';

    requiresApiKey = true;
}

export default LimaLabs;
