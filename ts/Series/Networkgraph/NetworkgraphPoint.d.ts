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

import type NetworkgraphPointOptions from './NetworkgraphPointOptions';
import type NetworkgraphSeries from './Networkgraph';
import type NodesComposition from '../NodesComposition';
import type Point from '../../Core/Series/Point';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

type DragNodesPoint = Highcharts.DragNodesPoint;

/* *
 *
 *  Class
 *
 * */

export declare class NetworkgraphPoint extends Point implements DragNodesPoint, NodesComposition.PointComposition {
    public className: NodesComposition.PointComposition['className'];
    public degree: number;
    public dispX?: number;
    public dispY?: number;
    public fixedPosition: DragNodesPoint['fixedPosition'];
    public formatPrefix: NodesComposition.PointComposition[
        'formatPrefix'
    ];
    public from: NodesComposition.PointComposition['from'];
    public fromNode: NetworkgraphPoint;
    public getSum: NodesComposition.PointComposition['getSum'];
    public hasShape: NodesComposition.PointComposition['hasShape'];
    public isNode: NodesComposition.PointComposition['isNode'];
    public isValid: () => boolean;
    public linksFrom: Array<NetworkgraphPoint>;
    public linksTo: Array<NetworkgraphPoint>;
    public mass: NodesComposition.PointComposition['mass'];
    public offset: NodesComposition.PointComposition['offset'];
    public options: NetworkgraphPointOptions;
    public prevX?: number;
    public prevY?: number;
    public radius: number;
    public series: NetworkgraphSeries;
    public setNodeState: NodesComposition.PointComposition['setState'];
    public to: NodesComposition.PointComposition['to'];
    public toNode: NetworkgraphPoint;
    public destroy(): void;
    public getDegree(): number;
    public getLinkAttributes(): SVGAttributes;
    public getLinkPath(): SVGPath;
    public getMass(): Record<string, number>;
    public getPointsCollection(): Array<NetworkgraphPoint>;
    public init(
        series: NetworkgraphSeries,
        options: (NetworkgraphPointOptions|PointShortOptions),
        x?: number
    ): NetworkgraphPoint;
    public redrawLink(): void;
    public remove(redraw?: boolean, animation?: boolean): void;
    public renderLink(): void;
}

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphPoint;
