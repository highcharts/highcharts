/* *
 *
 *  Arc diagram module
 *
 *  (c) 2018-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ArcDiagramPointOptions from './ArcDiagramPointOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import ArcDiagramSeries from './ArcDiagramSeries';
import NodesComposition from '../NodesComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sankey: {
            prototype: {
                pointClass: SankeyPoint
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;

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

    public fromNode!: ArcDiagramPoint;

    public index!: number;

    public linksFrom!: Array<ArcDiagramPoint>;

    public linksTo!: Array<ArcDiagramPoint>;

    public options!: ArcDiagramPointOptions;

    public series!: ArcDiagramSeries;

    public scale!: number;

    public shapeArgs!: SVGAttributes;

    public toNode!: ArcDiagramPoint;


    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public isValid(): boolean {
        // No null points here
        return true;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface ArcDiagramPoint {
    setState: typeof NodesComposition['setNodeState'];
}
extend(ArcDiagramPoint.prototype, {
    setState: NodesComposition.setNodeState
});

/* *
 *
 *  Default Export
 *
 * */

export default ArcDiagramPoint;
