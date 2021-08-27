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
 * Declarations
 *
 * */

export interface DefaultSonificationInstrumentMappingOptions extends SonificationInstrumentMappingOptions {
    pointPlayTime?: (string|Function);
}
export interface DefaultSonificationInstrumentOptions {
    instrument: (string|Highcharts.Instrument);
    mapping?: DefaultSonificationInstrumentMappingOptions;
}
export interface SonificationInstrumentOptions extends Highcharts.PointInstrumentOptionsObject {
    instrument: (string|Highcharts.Instrument);
    mapping?: SonificationInstrumentMappingOptions;
}
export interface SonificationInstrumentMappingOptions {
    duration?: (number|string|Function);
    frequency?: (number|string|Function);
    pan?: (number|string|Function);
    volume?: (number|string|Function);
}

export interface EarconConfiguration {
    condition: Function;
    earcon: Highcharts.Earcon;
    onPoint?: string;
}
