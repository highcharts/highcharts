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

import type { AxisCollectionKey } from './AxisOptions';
import type Pane from '../../Extensions/Pane';
import type RadialAxis from './RadialAxis';

import ColorAxisLike from './Color/ColorAxisLike.js';
import U from '../Utilities.js';
const { extend } = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * @private
 */
interface SolidGaugeAxis extends ColorAxisLike, RadialAxis.AxisComposition {
    center: Array<number>;
    coll: AxisCollectionKey;
    max: number;
    min: number;
    options: (ColorAxisLike.Options&RadialAxis.Options);
    pane: Pane;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function init(
    axis: RadialAxis.AxisComposition
): void {
    extend<SolidGaugeAxis|RadialAxis.AxisComposition>(axis, ColorAxisLike);
}

/* *
 *
 *  Default export
 *
 * */

const SolidGaugeAxis = {
    init
};

export default SolidGaugeAxis;
