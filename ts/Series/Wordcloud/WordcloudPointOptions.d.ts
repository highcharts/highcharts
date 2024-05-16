/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2024 Highsoft AS
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

    /**
     * The name decides the text for a word.
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    name?: string;

    /**
     * The weighting of a word. The weight decides the relative size of a word
     * compared to the rest of the collection.
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    weight?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default WordcloudPointOptions;
