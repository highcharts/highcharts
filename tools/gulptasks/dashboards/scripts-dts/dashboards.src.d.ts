/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import Board from "./es-modules/Dashboards/Board";
import Globals from "./es-modules/Dashboards/Globals";

import "./es-modules/Dashboards/Components/HTMLComponent";
import "./es-modules/Data/Connectors/CSVConnector";
import "./es-modules/Data/Connectors/JSONConnector";
import "./es-modules/Data/Connectors/GoogleSheetsConnector";
import "./es-modules/Data/Connectors/HTMLTableConnector";
import "./es-modules/Data/Modifiers/ChainModifier";
import "./es-modules/Data/Modifiers/InvertModifier";
import "./es-modules/Data/Modifiers/RangeModifier";
import "./es-modules/Data/Modifiers/SortModifier";

export { default as Board } from "./es-modules/Dashboards/Board";
export { default as Component } from "./es-modules/Dashboards/Components/Component";
export { default as ComponentRegistry } from "./es-modules/Dashboards/Components/ComponentRegistry";
export { default as PluginHandler } from "./es-modules/Dashboards/PluginHandler";
export { default as Sync } from "./es-modules/Dashboards/Components/Sync/Sync";

export { default as DataConnector } from "./es-modules/Data/Connectors/DataConnector";
export { default as DataCursor } from "./es-modules/Data/DataCursor";
export { default as DataModifier } from "./es-modules/Data/Modifiers/DataModifier";
export { default as DataPool } from "./es-modules/Data/DataPool";
export { default as DataTable } from "./es-modules/Data/DataTable";

export const board: typeof Board.board;
export const boards: typeof Globals.boards;
export const win: typeof Globals.win;

export as namespace Dashboards;
