/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/series-on-point
 * @requires highcharts
 *
 * Series on point module
 *
 * (c) 2010-2021 Highsoft AS
 * Author: Rafal and Pjoter
 *
 * License: www.highcharts.com/license
 */

'use strict';

import SeriesOnPointComposition from '../../Series/SeriesOnPointComposition.js';

const G: AnyRecord = Highcharts;

SeriesOnPointComposition.compose(G.Series, G.Chart);
