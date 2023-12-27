/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/navigator
 * @requires highcharts
 *
 * Standalone navigator module
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Navigator from '../../Stock/Navigator/Navigator.js';
import StandaloneNavigator from '../../Stock/Navigator/StandaloneNavigator.js';
import NavigatorComposition from '../../Stock/Navigator/NavigatorComposition.js';

const G: AnyRecord = Highcharts;
G.Navigator = StandaloneNavigator;
NavigatorComposition.compose(G.Axis, Navigator, G.Series);

G.navigator = StandaloneNavigator.navigator;
