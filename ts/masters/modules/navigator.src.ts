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
import Navigator from '../../Stock/Navigator/StandaloneNavigator.js';
import Highcharts from '../../Core/Globals.js';

const G: AnyRecord = Highcharts;

Navigator.compose(G.Axis, G.Chart, G.Series);

G.Navigator = Navigator;

G.navigator = Navigator.navigator;