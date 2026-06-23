/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type BubblePointOptions from '../Bubble/BubblePointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapBubblePointOptions extends BubblePointOptions {
    z?: (number|null);
}

/* *
 *
 *  Default Export
 *
 * */

export default MapBubblePointOptions;
