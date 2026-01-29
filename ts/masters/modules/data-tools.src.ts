// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/data-tools
 * @requires highcharts
 *
 * Highcharts
 *
 * (c) 2010-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import DataConnector from '../../Data/Connectors/DataConnector.js';
import DataConverter from '../../Data/Converters/DataConverter.js';
import DataCursor from '../../Data/DataCursor.js';
import DataModifier from '../../Data/Modifiers/DataModifier.js';
import DataPool from '../../Data/DataPool.js';
import DataTable from '../../Data/DataTable.js';
import Formula from '../../Data/Formula/Formula.js';
import '../../Data/Connectors/CSVConnector.js';
import '../../Data/Connectors/JSONConnector.js';
import '../../Data/Connectors/GoogleSheetsConnector.js';
import '../../Data/Connectors/HTMLTableConnector.js';
import '../../Data/Modifiers/ChainModifier.js';
import '../../Data/Modifiers/InvertModifier.js';
import '../../Data/Modifiers/MathModifier.js';
import '../../Data/Modifiers/RangeModifier.js';
import '../../Data/Modifiers/SortModifier.js';
import '../../Data/Modifiers/FilterModifier.js';
const G: AnyRecord = Highcharts;
G.DataConnector = G.DataConnector || DataConnector;
G.DataConverter = G.DataConverter || DataConverter;
G.DataCursor = G.DataCursor || DataCursor;
G.DataModifier = G.DataModifier || DataModifier;
G.DataPool = G.DataPool || DataPool;
G.DataTable = G.DataTable || DataTable;
G.Formula = G.Formula || Formula;
export default Highcharts;
