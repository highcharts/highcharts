/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/navigator
 * @requires highcharts
 *
 * Standalone navigator module
 *
 * (c) 2009-2025 Mateusz Bernacik
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import StandaloneNavigator from '../../Stock/Navigator/StandaloneNavigator.js';
import NavigatorComposition from '../../Stock/Navigator/NavigatorComposition.js';

const G: AnyRecord = Highcharts;
G.StandaloneNavigator = G.StandaloneNavigator || StandaloneNavigator;
G.navigator = G.StandaloneNavigator.navigator;
NavigatorComposition.compose(G.Chart, G.Axis, G.Series);

export default Highcharts;
