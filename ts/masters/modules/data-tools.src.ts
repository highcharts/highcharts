/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/data-tools
 * @requires highcharts
 *
 * Highcharts
 *
 * (c) 2010-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import DataConverter from '../../Data/Converters/DataConverter.js';
import DataCursor from '../../Data/DataCursor.js';
import DataModifier from '../../Data/Modifiers/DataModifier.js';
import DataPool from '../../Data/DataPool.js';
import DataTable from '../../Data/DataTable.js';
import '../../Data/Modifiers/ChainModifier.js';
import '../../Data/Modifiers/InvertModifier.js';
import '../../Data/Modifiers/RangeModifier.js';
import '../../Data/Modifiers/SortModifier.js';
const G: AnyRecord = Highcharts;
G.DataConverter = DataConverter;
G.DataCursor = DataCursor;
G.DataModifier = DataModifier;
G.DataPool = DataPool;
G.DataTable = DataTable;
