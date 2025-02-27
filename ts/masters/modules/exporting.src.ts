/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/exporting
 * @requires highcharts
 *
 * Exporting module
 *
 * (c) 2010-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';

import Highcharts from '../../Core/Globals.js';
import Exporting from '../../Extensions/Exporting/Exporting.js';
import HttpUtilities from '../../Core/HttpUtilities.js';

const G: AnyRecord = Highcharts;

// Compatibility
G.HttpUtilities = G.HttpUtilities || HttpUtilities;
G.ajax = G.HttpUtilities.ajax;
/// TO DO: Correct - for now it can export only png, jpeg, svg
G.downloadSVGLocal = Exporting.downloadSVGLocal;
G.getJSON = G.HttpUtilities.getJSON;
G.post = G.HttpUtilities.post;

// Compose
Exporting.compose(G.Chart, G.Renderer);

export default Highcharts;
