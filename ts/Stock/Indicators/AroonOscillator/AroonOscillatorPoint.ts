/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
