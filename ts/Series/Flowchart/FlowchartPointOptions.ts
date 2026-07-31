/* *
 *
 *  Flowchart series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Tord Vikestad
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { FlowchartNodeShape } from './FlowchartSymbols';
import type {
    NetworkgraphDataOptions,
    NetworkgraphPointOptions
} from '../Networkgraph/NetworkgraphPointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @product highcharts
 *
 * @optionparent series.flowchart.data
 */
export interface FlowchartDataOptions extends NetworkgraphDataOptions {

    /**
     * A label for the connection, shown next to the middle of the link. Use
     * it for the condition a branch out of a decision stands for, like `Yes`
     * and `No`, or for what a loop-closing edge means.
     *
     * In array notation a link is given as `[from, to, text]`.
     *
     * @sample {highcharts} highcharts/series-flowchart/order-fulfillment/
     *         Labeled branches out of a decision
     *
     * @product highcharts
     */
    text?: string;

}

/**
 * @product highcharts
 *
 * @optionparent series.flowchart.nodes
 */
export interface FlowchartPointOptions extends NetworkgraphPointOptions {

    /**
     * The symbol this node is drawn with, in classic flowchart notation:
     *
     * - `rectangle`: a process step. The default.
     * - `oval`: a terminator, i.e. the start or the end of the flow.
     * - `diamond`: a decision, with one branch out per outcome.
     * - `parallelogram`: input or output.
     * - `hexagon`: preparation.
     * - `subroutine`: a predefined process, defined elsewhere.
     * - `cylinder`: a data store.
     * - `document`: generated output.
     *
     * The shape is sized to fit the node's data label, so a long name
     * widens the shape rather than overflowing it.
     *
     * @sample {highcharts} highcharts/series-flowchart/node-shapes/
     *         Every node shape
     *
     * @type    {string}
     *
     * @default rectangle
     *
     * @product highcharts
     */
    shape?: FlowchartNodeShape;

}

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartPointOptions;
