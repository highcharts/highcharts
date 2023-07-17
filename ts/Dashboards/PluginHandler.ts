/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Globals from './Globals';

import Board from './Board.js';
import Sync from './Components/Sync/Sync.js';
import ComponentRegistry from './Components/ComponentRegistry.js';

/* *
 *
 *  Namespace
 *
 * */

namespace PluginHandler {

    /* *
     *
     *  Declarations
     *
     * */

    export interface DashboardsPlugin<T = (Globals.AnyRecord|undefined)> {
        /** @internal */
        custom: T;
        /**
         * Maximal version of plugin that is compatible with dashboard
         */
        maxRevision?: number;
        /**
         * Minimal version of plugin that is compatible with dashboard
         */
        minRevision?: number;
        /**
         * Name of plugin
         */
        name: string;
        /** @internal */
        onRegister: PluginHandler.EventCallback;
        /** @internal */
        onUnregister: PluginHandler.EventCallback;
    }

    /** @internal */
    export interface Event {
        ComponentRegistry: typeof ComponentRegistry;
        Board: typeof Board;
        Sync: typeof Sync;
        revision: number;
    }

    /** @internal */
    export type EventCallback = (e: Event) => void;

    /* *
     *
     *  Constants
     *
     * */

    /** @internal */
    export const registry: Record<string, DashboardsPlugin> = {};

    /**
     * Revision of the Dashboard plugin API.
     *
     * @internal
     */
    export const revision: number = 0;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds a dashboard plugin.
     *
     * @param {Dashboards.Plugin} plugin
     * Dashboard plugin to register.
     *
     * @param {string} [key]
     * Plugin key for the registry. (Default: `plugin.name`)
     */
    export function addPlugin(
        plugin: DashboardsPlugin,
        key: string = plugin.name
    ): void {
        const {
            maxRevision,
            minRevision,
            onRegister
        } = plugin;

        if (registry[key]) {
            // only throw error with custom key
            if (key !== plugin.name) {
                throw new Error(`Plugin '${key}' already registered.`);
            }
            return;
        }

        if (
            (typeof minRevision === 'number' && minRevision > revision) ||
            (typeof maxRevision === 'number' && maxRevision < revision)
        ) {
            throw new Error(`Plugin '${key}' does not support revision ${revision}.`);
        }

        onRegister({
            Board,
            ComponentRegistry,
            Sync,
            revision
        });

        registry[key] = plugin;
    }

    /**
     * Removes a dashboard plugin.
     *
     * @param {string} key
     * Plugin key in the registry.
     */
    export function removePlugin(
        key: string
    ): void {

        if (registry[key]) {
            registry[key].onUnregister({
                ComponentRegistry: ComponentRegistry,
                Board,
                Sync,
                revision
            });

            delete registry[key];
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default PluginHandler;
