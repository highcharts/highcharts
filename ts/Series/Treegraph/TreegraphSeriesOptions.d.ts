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
import type { LinkOptions } from '../Organization/OrganizationSeriesOptions';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
import type CSSObject from '../../Core/Renderer/CSSObject';

/* *
 *
 *  Declarations
 *
 * */


export type TreegraphLayoutTypes = 'Walker';
export interface CollapseButtonOptions {
    style?: CSSObject;
    onlyOnHover: boolean;
    shape: SymbolKey;
    x: number;
    y: number;
    enabled: boolean;
    height: number;
    width: number;
}
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
    linkFormatter: TreegraphDataLabelFormatterCallback;
    linkTextPath?: DataLabelTextPathOptions;
}
export interface TreegraphSeriesOptions extends TreemapSeriesOptions {
    dataLabels: TreegraphDataLabelOptions | Array<TreegraphDataLabelOptions>;
    collapseButton: CollapseButtonOptions;
    link: LinkOptions;
    reversed?: boolean;
    marker: PointMarkerOptions;
}


export default TreegraphSeriesOptions;
