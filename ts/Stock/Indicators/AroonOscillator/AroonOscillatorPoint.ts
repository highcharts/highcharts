/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AroonOscillatorIndicator from './AroonOscillatorIndicator';
import type AroonPoint from '../Aroon/AroonPoint';

/* *
 *
 *  Class
 *
 * */

declare class AroonOscillatorPoint extends AroonPoint {
    /** @internal */
    public series: AroonOscillatorIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default AroonOscillatorPoint;
