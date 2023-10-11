/* *
 * Esri provider, used for tile map services
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

class Esri implements ProviderDefinition {

    /* *
     *
     *  Properties
     *
     * */

    public defaultCredits = (
        'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, ' +
        ' Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong),' +
        ' Esri (Thailand), TomTom, 2012'
    );

    public initialProjectionName = 'WebMercator' as const;

    public requiresApiKey: undefined;

    public subdomains: undefined;

    public themes: Themes = {
        WorldStreetMap: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 20
        },
        DeLorme: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}',
            minZoom: 1,
            maxZoom: 11,
            credits: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme'
        },
        WorldTopoMap: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 20,
            credits: (
                'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom,' +
                ' Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL,' +
                ' Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong),' +
                ' and the GIS User Community'
            )
        },
        WorldImagery: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 20,
            credits: (
                'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS,' +
                ' AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,' +
                ' and the GIS User Community'
            )
        },
        WorldTerrain: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 13,
            credits: (
                'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme,' +
                ' and NPS'
            )
        },
        WorldShadedRelief: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 13,
            credits: 'Tiles &copy; Esri &mdash; Source: Esri'
        },
        WorldPhysical: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 8,
            credits:
                'Tiles &copy; Esri &mdash; Source: US National Park Service'
        },
        NatGeoWorldMap: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 16,
            credits: (
                'Tiles &copy; Esri &mdash; National Geographic, Esri,' +
                ' DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN,' +
                ' GEBCO, NOAA, iPC'
            )
        },
        WorldGrayCanvas: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            minZoom: 0,
            maxZoom: 16,
            credits: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        }
    };

}

/* *
 *
 *  Default Export
 *
 * */

export default Esri;
