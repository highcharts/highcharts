/* *
 * USGS provider, used for tile map services
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

class USGS implements ProviderDefinition {

    /* *
     *
     *  Properties
     *
     * */

    public defaultCredits = (
        'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological' +
        'Survey</a>'
    );

    public initialProjectionName = 'WebMercator' as const;

    public requiresApiKey: undefined;

    public subdomains: undefined;

    public themes: Themes = {
        USTopo: {
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 20
        },
        USImagery: {
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 20
        },
        USImageryTopo: {
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}',
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

export default USGS;
