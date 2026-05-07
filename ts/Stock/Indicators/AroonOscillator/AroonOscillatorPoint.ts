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

import AroonOscillatorIndicator from './AroonOscillatorIndicator';
import type AroonPoint from '../Aroon/AroonPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class AroonOscillatorPoint extends AroonPoint {
    public series: AroonOscillatorIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AroonOscillatorPoint;
