/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/boost
 * @requires highcharts
 *
 * Boost module
 *
 * (c) 2010-2021 Highsoft AS
 * Author: Torstein Honsi
 *
 * License: www.highcharts.com/license
 *
 * */

'use strict';

import Highcharts from '../../Core/Globals.js';
import Boost from '../../Extensions/Boost/Boost.js';
import BoostUtils from '../../Extensions/Boost/BoostUtils.js';

const G: AnyRecord = Highcharts;
G.hasWebGLSupport = BoostUtils.hasWebGLSupport;

Boost.compose(G.Color);
