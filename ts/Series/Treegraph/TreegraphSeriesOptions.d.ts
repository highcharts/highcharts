/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
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

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type TreemapSeriesOptions from '../Treemap/TreemapSeriesOptions';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type DataLabelTextPathOptions from '../../Core/Series/DataLabelOptions';
import type TreegraphPoint from './TreegraphPoint';
import type Point from '../../Core/Series/Point';

/* *
 *
 *  Declarations
 *
 * */


export type TreegraphLayoutTypes = 'Walker';
export type linkOptions = {

};
export interface TreegraphDataLabelFormatterCallback {
    (
        this: (
            TreegraphDataLabelFormatterContext|
            Point.PointLabelObject
        )
    ): (string|undefined);
}
export interface TreegraphDataLabelFormatterContext {
    point: TreegraphPoint
}
export interface TreegraphDataLabelOptions extends DataLabelOptions {
    linkFormat?: string;
    linkFormatter?: TreegraphDataLabelFormatterCallback;
    linkTextPath?: DataLabelTextPathOptions;
}
export interface TreegraphSeriesOptions extends TreemapSeriesOptions {
    dataLabels?: TreegraphDataLabelOptions | Array<TreegraphDataLabelOptions>;
    link?: any;
    layout?: string;
    reversed?: boolean;
    marker?: PointMarkerOptions;
}


export default TreegraphSeriesOptions;
