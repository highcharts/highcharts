/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/exporting
 * @requires highcharts
 *
 * Exporting module
 *
 * (c) 2010-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Exporting from '../../Extensions/Exporting/Exporting.js';
import HttpUtilities from '../../Core/HttpUtilities.js';
const G: AnyRecord = Highcharts;
G.HttpUtilities = HttpUtilities;
G.ajax = HttpUtilities.ajax;
G.getJSON = HttpUtilities.getJSON;
G.post = HttpUtilities.post;
Exporting.compose(G.Chart, G.Renderer);
