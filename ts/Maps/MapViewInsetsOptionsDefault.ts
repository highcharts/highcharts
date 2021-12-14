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

/* *
 *
 *  Imports
 *
 * */

import type { MapViewInsetsOptions } from './MapViewOptions';

import { Palette } from '../Core/Color/Palettes.js';

/**
 * Generic options for the placement and appearance of map insets like
 * non-contiguous territories.
 *
 * @since next
 * @product      highmaps
 * @optionparent mapView.insetOptions
 */
const defaultOptions: MapViewInsetsOptions = {
    /**
     *
     */
    borderColor: Palette.neutralColor20,
    borderWidth: 1,
    center: [0, 0],
    padding: '10%',
    relativeTo: 'mapBoundingBox',
    units: 'percent'
};

/* *
 *
 *  Default Export
 *
 * */

export default defaultOptions;
