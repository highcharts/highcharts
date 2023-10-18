/* *
 *
 *  (c) 2010-2022
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

import type MapSeriesOptions from '../Map/MapSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TiledWebMapSeries from './TiledWebMapSeries';
import type { TilesProviderRegistryName } from '../../Maps/TilesProviders/TilesProviderRegistry';

/* *
 *
 *  Declarations
 *
 * */

interface TiledWebMapSeriesOptions extends MapSeriesOptions {
    provider?: ProviderOptions
    states?: SeriesStatesOptions<TiledWebMapSeries>;
}

interface ProviderOptions {
    apiKey?: string
    onload?: Function,
    subdomain?: string,
    theme?: string,
    type?: TilesProviderRegistryName,
    url?: string,
}

/* *
 *
 *  Default Export
 *
 * */

export default TiledWebMapSeriesOptions;
