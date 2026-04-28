// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Gantt JS v@product.version@ (@product.date@)
 * @module highcharts/modules/pathfinder
 * @requires highcharts
 *
 * Pathfinder
 *
 * (c) 2016-2026 Highsoft AS
 * Author: Øystein Moseng
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Pathfinder from '../../Gantt/Pathfinder.js';
import { composeArrowSymbols } from '../../Extensions/ArrowSymbols.js';

const G: AnyRecord = Highcharts;
G.Pathfinder = G.Pathfinder || Pathfinder;
composeArrowSymbols(G.SVGRenderer);
G.Pathfinder.compose(G.Chart, G.Point);

export default Highcharts;
