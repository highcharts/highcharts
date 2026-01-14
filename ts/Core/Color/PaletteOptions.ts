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

/* *
 *
 *  Imports
 *
 * */

import type ColorType from './ColorType';

/* *
 *
 *  Declarations
 *
 * */
interface PaletteColors {
    backgroundColor?: ColorType;
    dataColors?: Array<ColorType>;
    neutralColor100?: ColorType;
    neutralColor80?: ColorType;
    neutralColor60?: ColorType;
    neutralColor40?: ColorType;
    neutralColor20?: ColorType;
    neutralColor10?: ColorType;
    neutralColor5?: ColorType;
    neutralColor3?: ColorType;
    highlightColor100?: ColorType;
    highlightColor80?: ColorType;
    highlightColor60?: ColorType;
    highlightColor40?: ColorType;
    highlightColor20?: ColorType;
    highlightColor10?: ColorType;
    positiveColor?: ColorType;
    negativeColor?: ColorType;
}

export interface PaletteOptions {
    light?: PaletteColors;
}


/* *
 *
 *  Default Export
 *
 * */

export default PaletteOptions;
