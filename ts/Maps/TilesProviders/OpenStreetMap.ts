/* *
 * OpenStreetMap provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

export default class OpenStreetMap implements ProviderDefinition {
    subdomains = ['a', 'b', 'c'];

    themes = {
        Standard: {
            url: 'https://{s}.tile.openstreetmap.org/{zoom}/{x}/{y}.png',
            minZoom: 0,
            maxZoom: 20
        },
        Hot: {
            url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            minZoom: 0,
            maxZoom: 20
        },
        Mapnik: {
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            minZoom: 0,
            maxZoom: 20
        }
    };

    initialProjectionName = 'WebMercator';

    defaultCredits = `Map data \u00a92023 <a href="https://www.openstreetmap.org/copyright">
            OpenStreetMap</a>`;
}
