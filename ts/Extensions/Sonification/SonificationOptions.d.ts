/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Default options for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 * Imports
 *
 * */
import type Instrument from './Instrument';
import type PointSonify from './PointSonify';

/* *
 *
 * Declarations
 *
 * */

export interface DefaultSonificationInstrumentMappingOptions extends SonificationInstrumentMappingOptions {
    pointPlayTime?: (string|Function);
}
export interface DefaultSonificationInstrumentOptions {
    instrument: (string|Instrument);
    mapping?: DefaultSonificationInstrumentMappingOptions;
}
export interface SonificationInstrumentOptions extends PointSonify.PointInstrumentOptions {
    instrument: (string|Instrument);
    mapping?: SonificationInstrumentMappingOptions;
}
export interface SonificationInstrumentMappingOptions {
    duration?: (number|string|Function);
    frequency?: (number|string|Function);
    pan?: (number|string|Function);
    volume?: (number|string|Function);
}
