/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/pointandfigure
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Point and figure series type for Highcharts Stock
 *
 * (c) 2010-2024 Kamil Musialowski
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import PointAndFigureSeries from '../../Series/PointAndFigure/PointAndFigureSeries.js';
const G: AnyRecord = Highcharts;
PointAndFigureSeries.compose(G.Axis, G.Renderer);
export default Highcharts;
