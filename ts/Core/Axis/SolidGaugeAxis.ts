/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

/** @internal */
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

/** @internal */
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

/** @internal */
const SolidGaugeAxis = {
    init
};

/** @internal */
export default SolidGaugeAxis;
