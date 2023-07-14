/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import Board from "./es-modules/Dashboards/Board";
import Globals from "./es-modules/Dashboards/Globals";

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
