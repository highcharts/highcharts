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

import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type DataLabelTextPathOptions from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
import type { TreegraphLinkOptions } from './TreegraphLink';
import type TreegraphPoint from './TreegraphPoint';
import type TreemapSeriesOptions from '../Treemap/TreemapSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export type TreegraphLayoutTypes = 'Walker';

export interface CollapseButtonOptions {
    enabled: boolean;
    fillColor?: ColorType;
    height: number;
    onlyOnHover: boolean;
    shape: SymbolKey;
    lineColor?: ColorType;
    lineWidth: number;
    style?: CSSObject;
    width: number;
    x: number;
    y: number;
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

export interface TreegraphSeriesLevelOptions extends TreegraphSeriesOptions {
    collapsed?: boolean;
}

export interface TreegraphSeriesOptions extends TreemapSeriesOptions {
    dataLabels: TreegraphDataLabelOptions | Array<TreegraphDataLabelOptions>;
    collapseButton: CollapseButtonOptions;
    link: TreegraphLinkOptions;
    reversed?: boolean;
    marker: PointMarkerOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphSeriesOptions;
