/* *
 * Thunderforest provider, used for tile map services
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    ProviderDefinition,
    Themes
} from '../ProviderDefinition';

/* *
 *
 *  Class
 *
 * */

class Thunderforest implements ProviderDefinition {

    /* *
     *
     *  Properties
     *
     * */

    public defaultCredits = (
        'Maps &copy <a href="https://www.thunderforest.com">Thunderforest</a>' +
        ', Data &copy; <a href="https://www.openstreetmap.org/copyright">' +
        'OpenStreetMap contributors</a>'
    );

    public initialProjectionName = 'WebMercator' as const;

    public requiresApiKey = true;

    public subdomains = ['a', 'b', 'c'];

    public themes: Themes = {
        OpenCycleMap: {
            url: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        Transport: {
            url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        TransportDark: {
            url: 'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        SpinalMap: {
            url: 'https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        Landscape: {
            url: 'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        Outdoors: {
            url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        Pioneer: {
            url: 'https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        MobileAtlas: {
            url: 'https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        },
        Neighbourhood: {
            url: 'https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey={apikey}',
            minZoom: 0,
            maxZoom: 22
        }
    };

}

/* *
 *
 *  Default Export
 *
 * */

export default Thunderforest;
