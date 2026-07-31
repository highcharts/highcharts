// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/flowchart
 * @requires highcharts
 * @requires highcharts/modules/networkgraph
 *
 * Flowchart series type
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Tord Vikestad
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import FlowchartSeries from '../../Series/Flowchart/FlowchartSeries.js';
const G: AnyRecord = Highcharts;
FlowchartSeries.compose(G.Chart);
export default Highcharts;
