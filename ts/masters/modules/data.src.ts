// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/data
 * @requires highcharts
 *
 * Data module
 *
 * (c) 2012-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import HttpUtilities from '../../Core/HttpUtilities.js';
import Data from '../../Extensions/Data.js';
const G: AnyRecord = Highcharts;
// Classes
G.Data = G.Data || Data;
G.HttpUtilities = G.HttpUtilities || HttpUtilities;
// Functions
G.ajax = G.HttpUtilities.ajax;
G.data = G.Data.data;
G.getJSON = G.HttpUtilities.getJSON;
G.post = G.HttpUtilities.post;
export default Highcharts;
