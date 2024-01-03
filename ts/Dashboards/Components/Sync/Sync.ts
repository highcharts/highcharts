/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 * Imports
 *
 * */

import type ComponentType from '../ComponentType';

import SyncEmitter from './Emitter.js';
import SyncHandler from './Handler.js';

/* *
 *
 * Class
 *
 * */

/** @internal */
class Sync {

    /* *
     *
     * Constructor
     *
     * */

    /**
     * Creates an instance of the sync class.
     *
     * @param component
     * The component to which the emitters and handlers are attached.
     *
     * @param syncHandlers
     * The emitters and handlers to use for each event.
     */
    constructor(
        component: ComponentType,
        syncHandlers: Sync.OptionsRecord = Sync.defaultHandlers
    ) {
        this.component = component;
        this.syncConfig = syncHandlers;
        this.registeredSyncHandlers = {};
        this.registeredSyncEmitters = {};
        this.isSyncing = false;
        this.listeners = [];
    }
    /* *
     *
     *  Properties
     *
     * */

    /**
     * Array of listeners that should be removed when the sync is stopped.
     */
    private listeners: Array<Function>;

    /**
     * Default handlers for the sync class. This property is extended by
     * different Components, where default syncs are added. Allows overwriting
     * the configuration before creating the dashboard.
     */
    public static defaultHandlers: Record<string, Sync.OptionsEntry> = {};

    /**
     * Registry for the sync handlers used within the component.
     */
    private registeredSyncHandlers: Record<SyncHandler['id'], SyncHandler>;

    /**
     * Registry for the sync emitters used within the component.
     */
    private registeredSyncEmitters: Record<SyncEmitter['id'], SyncEmitter>;

    /**
     * The component to which the emitters and handlers are attached.
     */
    public component: ComponentType;


    /**
     * The emitters and handlers to use for each event
     */
    public syncConfig: Sync.OptionsRecord;

    /**
     * Whether the component is currently syncing.
     */
    public isSyncing: boolean;

    /* *
     *
     *  Functions
     *
     * */
    /**
     * Add new emitter to the registered emitters.
     *
     * @param emitter
     * The emitter to register.
     */
    public registerSyncEmitter(emitter: SyncEmitter): void {
        const { id } = emitter;
        this.registeredSyncEmitters[id] = emitter;
    }

    /**
     * Method that checks if the emitter is registered.
     *
     * @param id
     * The id of the emitter to check.
     *
     * @returns
     * Whether the emitter is registered.
     */
    public isRegisteredEmitter(id: string): boolean {
        return Boolean(this.registeredSyncEmitters[id]);
    }

    /**
     * Register new handler to the registered handlers.
     *
     * @param handler
     * The handler to register.
     */
    public registerSyncHandler(handler: SyncHandler): void {
        const { id } = handler;
        this.registeredSyncHandlers[id] = handler;
    }

    /**
     * Method that checks if the handler is registered.
     *
     * @param handlerID
     * The id of the handler to check.
     *
     * @returns
     * Whether the handler is registered.
     */
    public isRegisteredHandler(handlerID: string): boolean {
        return Boolean(this.registeredSyncHandlers[handlerID]);
    }

    /**
     * Registers the handlers and emitters on the component
     */
    public start(): void {
        const { syncConfig, component } = this;
        for (const id of Object.keys(syncConfig)) {
            if (!syncConfig[id]) {
                continue;
            }
            let {
                emitter: emitterConfig,
                handler: handlerConfig
            } = syncConfig[id];
            if (handlerConfig) {
                // Avoid registering the same handler multiple times
                // i.e. panning and selection uses the same handler
                if (typeof handlerConfig === 'boolean') {
                    handlerConfig =
                        Sync.defaultHandlers[id]
                            .handler as Sync.HandlerConfig;
                }

                // Create a tuple if the handler is a function.
                if (typeof handlerConfig === 'function') {
                    handlerConfig = [id, handlerConfig];
                }

                const handler = new SyncHandler(...handlerConfig);
                if (!this.isRegisteredHandler(handler.id)) {
                    this.registerSyncHandler(handler);

                    handler.register(component);
                }
            }

            if (emitterConfig) {
                if (typeof emitterConfig === 'boolean') {
                    emitterConfig =
                        Sync.defaultHandlers[id]
                            .emitter as Sync.EmitterConfig;
                }

                // TODO: should rework the SyncHandler constructor when
                // all handlers are updated
                if (typeof emitterConfig === 'function') {
                    emitterConfig = [id, emitterConfig];
                }

                const emitter = new SyncEmitter(...emitterConfig);
                if (!this.isRegisteredEmitter(emitter.id)) {
                    this.registerSyncEmitter(emitter);
                    emitter.create(component);
                }
            }

        }
        this.isSyncing = true;

        this.listeners.push(component.on('update', (): void => this.stop()));
    }

    /**
     * Removes the handlers and emitters from the component.
     */
    public stop(): void {
        const {
            component,
            listeners,
            registeredSyncHandlers,
            registeredSyncEmitters
        } = this;

        Object.keys(registeredSyncHandlers).forEach((id): void => {
            registeredSyncHandlers[id].remove();
            delete registeredSyncHandlers[id];

        });
        Object.keys(registeredSyncEmitters).forEach((id): void => {
            registeredSyncEmitters[id].remove();
            delete registeredSyncEmitters[id];
        });

        this.isSyncing = false;

        for (let i = 0, iEnd = listeners.length; i < iEnd; ++i) {
            listeners[i]();
        }

        this.listeners.length = 0;
        this.listeners.push(component.on('afterUpdate', (): void => {
            this.start();
        }));
    }


}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Sync {

    /* *
     *
     *  Declarations
     *
     * */

    /** @internal */
    export type EmitterConfig = (
        | [SyncEmitter['id'], SyncEmitter['func']]
        | SyncEmitter['func']
    );

    /** @internal */
    export type HandlerConfig = (
        [
            SyncHandler['id'],
            SyncHandler['func']
        ] |
        SyncHandler['func']
    );

    export interface OptionsEntry {

        /**
         * Whether the sync should be enabled.
         *
         * @default false
         */
        enabled?: boolean;

        /**
         * Responsible for communicating to the component group that the action
         * has been triggered on the component.
         *
         * If `true` or undefined the default emitter will be used, if `false`
         * or `null` it will be disabled
         */
        emitter?: EmitterConfig | null | boolean;

        /**
         * Responsible for _handling_ incoming action from the synced component
         * group.
         *
         * If `true` or undefined the default handler will be used, if `false`
         * or `null` it will be disabled
         */
        handler?: HandlerConfig | null | boolean;

    }

    /** @internal */
    export type OptionsRecord = (
        Record<(SyncEmitter['id']|SyncHandler['id']), OptionsEntry>
    );

    /** @internal */
    export type RawOptionsRecord = (
        Record<(
            SyncEmitter['id']|SyncHandler['id']
        ), undefined|boolean|OptionsEntry>
    );

    /**
     * Crossfilter sync options.
     *
     * Example:
     * ```
     * {
     *     enabled: true,
     *     affectNavigator: true
     * }
     * ```
     */
    export interface CrossfilterSyncOptions extends Sync.OptionsEntry {
        /**
         * Whether this navigator component's content should be affected by
         * other navigators with crossfilter enabled.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/crossfilter-affecting-navigators | Affect Navigators Enabled }
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/ | Affect Navigators Disabled }
         *
         * @default false
         */
        affectNavigator?: boolean;
    }

    /**
     * Highlight sync options.
     *
     * Example:
     * ```
     * {
     *     enabled: true,
     *     highlightPoint: true,
     *     showTooltip: false,
     *     showCrosshair: true
     * }
     * ```
     */
    export interface HighlightSyncOptions extends Sync.OptionsEntry {
        /**
         * Whether the marker should be synced. When hovering over a point in
         * other component in the same group, the 'hover' state is enabled at
         * the corresponding point in this component.
         *
         * @default true
         */
        highlightPoint?: boolean;
        /**
         * Whether the tooltip should be synced. When hovering over a point in
         * other component in the same group, in this component the tooltip
         * should be also shown.
         *
         * @default true
         */
        showTooltip?: boolean;
        /**
         * Whether the crosshair should be synced. When hovering over a point in
         * other component in the same group, in this component the crosshair
         * should be also shown.
         *
         * Works only for axes that have crosshair enabled.
         *
         * @default true
         */
        showCrosshair?: boolean;
    }


    /* *
     *
     *  Constants
     *
     * */

    export const defaultSyncOptions: Record<string, unknown> = {
        crossfilter: {
            affectNavigator: false
        },
        highlight: {
            highlightPoint: true,
            showTooltip: true,
            showCrosshair: true
        }
    };
}
/* *
 *
 *  Default Export
 *
 * */

export default Sync;
