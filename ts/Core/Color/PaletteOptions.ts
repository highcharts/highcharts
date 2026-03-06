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
export interface PaletteSchemeColors {
    backgroundColor?: ColorType;
    colors?: Array<ColorType|null|undefined>;
    neutralColor?: ColorType;
    highlightColor?: ColorType;
    positiveColor?: ColorType;
    negativeColor?: ColorType;
}

export interface PaletteOptions {
    colors?: Array<ColorType>;
    colorScheme?: 'light dark' |'light' | 'dark' | 'inherit';
    dark?: PaletteSchemeColors;
    injectCSS?: boolean;
    light?: PaletteSchemeColors;
}


/* *
 *
 *  Default Export
 *
 * */

export default PaletteOptions;
