/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
import type Pane from '../../Extensions/Pane/Pane';
import type RadialAxis from './RadialAxis';
import type RadialAxisOptions from './RadialAxisOptions';

import ColorAxisBase from './Color/ColorAxisBase';
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
interface SolidGaugeAxis extends ColorAxisBase, RadialAxis.AxisComposition {
    center: Array<number>;
    coll: AxisCollectionKey;
    max: number;
    min: number;
    options: (ColorAxisBase.Options&RadialAxisOptions);
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
    extend<SolidGaugeAxis|RadialAxis.AxisComposition>(axis, ColorAxisBase);
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
