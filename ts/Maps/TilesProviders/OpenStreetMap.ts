/* *
 * OpenStreetMap provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

class OpenStreetMap implements ProviderDefinition {
    subdomains = ['a', 'b', 'c'];

    themes = {
        Standard: {
            url: 'https://tile.openstreetmap.org/{zoom}/{x}/{y}.png',
            minZoom: 0,
            maxZoom: 19
        },
        Hot: {
            url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            minZoom: 0,
            maxZoom: 19
        },
        OpenTopoMap: {
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            minZoom: 0,
            maxZoom: 17,
            credits: `Map data: &copy; <a href="https://www.openstreetmap.org/copyright">
                OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> 
                | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> 
                (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
        }
    };

    initialProjectionName = 'WebMercator';

    defaultCredits = `Map data \u00a92023 <a href="https://www.openstreetmap.org/copyright">
            OpenStreetMap</a>`;
}

export default OpenStreetMap;
