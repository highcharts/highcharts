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
export interface PaletteColors {
    backgroundColor?: ColorType;
    colors?: Array<ColorType>;
    neutralColor?: ColorType;
    highlightColor?: ColorType;
    positiveColor?: ColorType;
    negativeColor?: ColorType;
}

export interface PaletteOptions {
    injectCSS?: boolean;
    colorScheme?: 'light dark' |'light' | 'dark';
    dark?: PaletteColors;
    light?: PaletteColors;
}


/* *
 *
 *  Default Export
 *
 * */

export default PaletteOptions;
