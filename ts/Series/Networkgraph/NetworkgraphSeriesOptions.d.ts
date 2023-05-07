/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2021 Paweł Fus
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import { type EventCallback } from '../../Core/Callback';
import type {
    DataLabelOptions,
    DataLabelTextPathOptions
} from '../../Core/Series/DataLabelOptions';
import type NetworkgraphPoint from './NetworkgraphPoint';
import type NetworkgraphPointOptions from './NetworkgraphPointOptions';
import type NetworkgraphSeries from './NetworkgraphSeries';
import type NodesComposition from '../NodesComposition';
import type Point from '../../Core/Series/Point';
import type ReingoldFruchtermanLayout from './ReingoldFruchtermanLayout';
import type {
    SeriesOptions,
    SeriesEventsOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateInactiveOptions
    {
        animation?: (boolean|Partial<AnimationOptions>);
        linkOpacity?: number;
    }
}

export interface NetworkgraphDataLabelsFormatterCallbackFunction {
    (this: (
        NetworkgraphDataLabelsFormatterContextObject|
        Point.PointLabelObject
    )): (number|string|null|undefined);
}

export interface NetworkgraphDataLabelsFormatterContextObject
    extends Point.PointLabelObject {

    color: ColorType;
    key: string;
    point: NetworkgraphPoint;
}

export interface NetworkgraphDataLabelsOptionsObject
    extends DataLabelOptions {

    format?: string;
    formatter?: NetworkgraphDataLabelsFormatterCallbackFunction;
    linkFormat?: string;
    linkFormatter?: NetworkgraphDataLabelsFormatterCallbackFunction;
    linkTextPath?: DataLabelTextPathOptions;
}

export interface NetworkgraphLinkOptions {
    color?: ColorType;
    dashStyle?: DashStyleValue;
    opacity?: number;
    width?: number;
}

export interface NetworkgraphEventsOptions extends SeriesEventsOptions {
    afterSimulation?: EventCallback<NetworkgraphSeries, Event>
}

export interface NetworkgraphSeriesOptions
    extends SeriesOptions, NodesComposition.SeriesCompositionOptions {

    dataLabels?: NetworkgraphDataLabelsOptionsObject;
    draggable?: boolean;
    events?: NetworkgraphEventsOptions;
    inactiveOtherPoints?: boolean;
    layoutAlgorithm?: ReingoldFruchtermanLayout.Options;
    link?: NetworkgraphLinkOptions;
    nodes?: Array<NetworkgraphPointOptions>;
    states?: SeriesStatesOptions<NetworkgraphSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphSeriesOptions;
