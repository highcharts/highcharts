/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/boost-canvas
 * @requires highcharts
 *
 * Boost module
 *
 * (c) 2010-2021 Highsoft AS
 * Author: Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import BoostCanvas from '../../Extensions/BoostCanvas.js';
const G: AnyRecord = Highcharts;
/**
 * Initialize the canvas boost.
 *
 * @function Highcharts.initCanvasBoost
 */
G.initCanvasBoost = function (): void {
    BoostCanvas.compose(G.Chart, G.Series, G.seriesTypes);
};
