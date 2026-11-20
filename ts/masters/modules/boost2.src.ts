// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/boost2
 * @requires highcharts
 *
 * Boost2 - WebGPU renderer for series marks (proof of concept)
 *
 * (c) 2026 Highsoft AS
 *
 * License: www.highcharts.com/license
 *
 * */

'use strict';

import Highcharts from '../../Core/Globals.js';
import Boost2 from '../../Extensions/Boost2/Boost2.js';

const G: AnyRecord = Highcharts;

G.Boost2 = Boost2;

Boost2.compose(G.Series, G.seriesTypes);

export default Highcharts;
