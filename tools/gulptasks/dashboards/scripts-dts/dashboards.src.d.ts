/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import Board from "./es-modules/Dashboards/Board";
import Globals from "./es-modules/Dashboards/Globals";

import "./es-modules/Dashboards/Components/HTMLComponent";
import "./es-modules/Dashboards/Components/KPIComponent";
import "./es-modules/Data/Connectors/CSVConnector";
import "./es-modules/Data/Connectors/JSONConnector";
import "./es-modules/Data/Connectors/GoogleSheetsConnector";
import "./es-modules/Data/Connectors/HTMLTableConnector";
import "./es-modules/Data/Modifiers/ChainModifier";
import "./es-modules/Data/Modifiers/InvertModifier";
import "./es-modules/Data/Modifiers/RangeModifier";
import "./es-modules/Data/Modifiers/SortModifier";

export * as Board from "./es-modules/Dashboards/Board";
export * as Component from "./es-modules/Dashboards/Components/Component";
export * as ComponentRegistry from "./es-modules/Dashboards/Components/ComponentRegistry";
export * as PluginHandler from "./es-modules/Dashboards/PluginHandler";
export * as Sync from "./es-modules/Dashboards/Components/Sync/Sync";

export * as DataConnector from "./es-modules/Data/Connectors/DataConnector";
export * as DataCursor from "./es-modules/Data/DataCursor";
export * as DataModifier from "./es-modules/Data/Modifiers/DataModifier";
export * as DataPool from "./es-modules/Data/DataPool";
export * as DataTable from "./es-modules/Data/DataTable";

export * as DataGrid from "./es-modules/DataGrid/DataGrid";

export const board: typeof Board.board;
export const boards: typeof Globals.boards;
export const win: typeof Globals.win;

export as namespace Dashboards;
