/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

/* *
 *
 *  Imports
 *
 * */
import type ColumnPointOptions from '../Column/ColumnPointOptions';


/* *
 *
 *  Declarations
 *
 * */
export interface WordcloudPointOptions extends ColumnPointOptions {
    name?: string;
    weight?: number;
}


/* *
 *
 *  Default Export
 *
 * */
export default WordcloudPointOptions;
