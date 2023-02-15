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

import Component from './Component/Component.js';
import Board from './Board.js';
import Sync from './Component/Sync/Sync.js';

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

    export interface DashboardPlugin<T = (AnyRecord|undefined)> {
        custom: T;
        maxRevision?: number;
        minRevision?: number;
        name: string;
        onRegister: PluginHandler.EventCallback;
        onUnregister: PluginHandler.EventCallback;
    }

    export interface Event {
        Component: typeof Component;
        Board: typeof Board;
        Sync: typeof Sync;
        revision: number;
    }

    export type EventCallback = (e: Event) => void;

    /* *
     *
     *  Constants
     *
     * */

    export const registry: Record<string, DashboardPlugin> = {};

    /**
     * Revision of the Dashboard plugin API.
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
     * @param {Dashboard.Plugin} plugin
     * Dashboard plugin to register.
     *
     * @param {string} [key]
     * Plugin key for the registry. (Default: `plugin.name`)
     */
    export function addPlugin(
        plugin: DashboardPlugin,
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
            Component,
            Board,
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
                Component,
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
