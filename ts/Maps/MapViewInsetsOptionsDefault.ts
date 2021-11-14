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

const defaultOptions: MapViewInsetsOptions = {
    borderColor: Palette.neutralColor10,
    borderWidth: 1,
    center: [0, 0],
    padding: 5,
    relativeTo: 'plotBox',
    units: 'percent'
};

/* *
 *
 *  Default Export
 *
 * */

export default defaultOptions;
