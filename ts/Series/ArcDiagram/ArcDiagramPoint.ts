/* *
 *
 *  Arc diagram module
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ArcDiagramPointOptions from './ArcDiagramPointOptions';
import type ArcDiagramSeries from './ArcDiagramSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import NodesComposition from '../NodesComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { extend } from '../../Shared/Utilities.js';
const {
    seriesTypes: {
        sankey: {
            prototype: {
                pointClass: SankeyPoint
            }
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class ArcDiagramPoint extends SankeyPoint {

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public fromNode!: ArcDiagramPoint;

    /** @internal */
    public index!: number;

    /** @internal */
    public linksFrom!: Array<ArcDiagramPoint>;

    /** @internal */
    public linksTo!: Array<ArcDiagramPoint>;

    public options!: ArcDiagramPointOptions;

    /** @internal */
    public series!: ArcDiagramSeries;

    /** @internal */
    public scale!: number;

    /** @internal */
    public shapeArgs!: SVGAttributes;

    /** @internal */
    public toNode!: ArcDiagramPoint;


    /* *
     *
     *  Functions
     *
     * */


    /** @internal */
    public isValid(): boolean {
        // No null points here
        return true;
    }


}

/* *
 *
 *  Prototype Properties
 *
 * */

/** @internal */
interface ArcDiagramPoint {
    /** @internal */
    setState: typeof NodesComposition['setNodeState'];
}
extend(ArcDiagramPoint.prototype, {
    /** @internal */
    setState: NodesComposition.setNodeState
});

/* *
 *
 *  Default Export
 *
 * */

export default ArcDiagramPoint;
