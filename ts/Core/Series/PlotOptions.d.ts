/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { SeriesTypeRegistry } from './SeriesType';

/* *
 *
 *  Declarations
 *
 * */

export type PlotOptions = {
    [K in keyof SeriesTypeRegistry]?: (
        Omit<SeriesTypeRegistry[K]['prototype']['options'],
        (
            'data'|'id'|'index'|'legendIndex'|'mapData'|'name'|'stack'|
            'treemap'|'type'|'xAxis'|'yAxis'|'zIndex'
        )>
    )
};

/* *
 *
 *  Export
 *
 * */

export default PlotOptions;
