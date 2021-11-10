/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type MapView from './MapView';
import type { MapViewInsetsOptions } from './MapViewOptions';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import defaultOptions from './MapViewInsetsOptionsDefault.js';
import U from '../Core/Utilities.js';
import Projection from './Projection.js';
const {
    merge
} = U;

class MapViewInset {

    public key?: string;
    public options: MapViewInsetsOptions;
    public path?: SVGPath;
    public projection: Projection;

    public constructor(
        mapView: MapView,
        options?: DeepPartial<MapViewInsetsOptions>
    ) {
        this.options = merge(defaultOptions, options);

        this.projection = new Projection(this.options.projection);

        if (this.options.geoBounds) {
            // The path in projected units in the map view's main projection.
            // This is used for hit testing where the points should render.
            this.path = mapView.projection.path(this.options.geoBounds);
        }
    }

}
export default MapViewInset;
