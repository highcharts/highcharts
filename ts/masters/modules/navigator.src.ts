// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/navigator
 * @requires highcharts
 *
 * Standalone navigator module
 *
 * (c) 2009-2026 Highsoft AS
 * Author: Mateusz Bernacik
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import StandaloneNavigator from '../../Stock/Navigator/StandaloneNavigator.js';
import Navigator from '../../Stock/Navigator/Navigator.js';
import Scrollbar from '../../Stock/Scrollbar/Scrollbar.js';

const G: AnyRecord = Highcharts;
G.StandaloneNavigator = G.StandaloneNavigator || StandaloneNavigator;
G.navigator = G.StandaloneNavigator.navigator;

Scrollbar.compose(G.Axis);
Navigator.compose(G.Chart, G.Axis, G.Series);

export default Highcharts;
