/* *
 * LimaLabs provider, used for tile map services
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

class LimaLabs implements ProviderDefinition {

    /* *
     *
     *  Properties
     *
     * */

    public defaultCredits = (
        'Map data &copy;2023' +
        ' <a href="https://maps.lima-labs.com/">LimaLabs</a>'
    );

    public initialProjectionName = 'WebMercator' as const;

    public requiresApiKey = true;

    public subdomains: undefined;

    public themes: Themes = {
        Standard: {
            url: 'https://cdn.lima-labs.com/{zoom}/{x}/{y}.png?api={apikey}',
            minZoom: 0,
            maxZoom: 20
        }
    };

}

/* *
 *
 *  Default Export
 *
 * */

export default LimaLabs;
