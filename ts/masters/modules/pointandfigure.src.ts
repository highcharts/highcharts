// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/pointandfigure
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Point and figure series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Kamil Musialowski
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import PointAndFigureSeries from '../../Series/PointAndFigure/PointAndFigureSeries.js';
const G: AnyRecord = Highcharts;
PointAndFigureSeries.compose(G.Renderer);
export default Highcharts;
