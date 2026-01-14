/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type Component from '../Component';

import SyncEmitter from './Emitter.js';
import SyncHandler from './Handler.js';

import U from '../../../Core/Utilities.js';
const { merge, isObject } = U;

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
     * @param predefinedSyncConfig
     * The predefined sync configuration.
     */
    constructor(
        component: Component,
        predefinedSyncConfig: Sync.PredefinedSyncConfig
    ) {
        this.component = component;
        this.predefinedSyncConfig = predefinedSyncConfig;
        this.syncConfig = Sync.prepareSyncConfig(
            predefinedSyncConfig,
            component.options.sync
        );
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
    public component: Component;

    /**
     * The predefined sync configuration.
     */
    public predefinedSyncConfig: Sync.PredefinedSyncConfig;

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
     * Method that prepares the sync configuration from the predefined config
     * and current component options.
     *
     * @param predefinedConfig The predefined sync configuration.
     * @param componentSyncOptions The current component sync options.
     * @returns The sync configuration.
     */
    private static prepareSyncConfig(
        predefinedConfig: Sync.PredefinedSyncConfig,
        componentSyncOptions: Sync.RawOptionsRecord = {}
    ) : Sync.OptionsRecord {
        const {
            defaultSyncPairs: defaultPairs,
            defaultSyncOptions: defaultOptionsList
        } = predefinedConfig;

        return Object.keys(componentSyncOptions).reduce(
            (acc: Sync.OptionsRecord, syncName): Sync.OptionsRecord => {
                if (syncName) {
                    const defaultPair = defaultPairs[syncName];
                    const defaultOptions = defaultOptionsList[syncName];
                    const entry = componentSyncOptions[syncName];

                    const preparedOptions: Sync.OptionsEntry = merge(
                        defaultOptions || {},
                        { enabled: isObject(entry) ? entry.enabled : entry },
                        isObject(entry) ? entry : {}
                    );

                    if (defaultPair && preparedOptions.enabled) {
                        const keys: (keyof Sync.SyncPair)[] = [
                            'emitter',
                            'handler'
                        ];

                        for (const key of keys) {
                            if (
                                preparedOptions[key] === true ||
                                preparedOptions[key] === void 0
                            ) {
                                preparedOptions[key] =
                                    defaultPair[key] as any;
                            }
                        }
                    }

                    acc[syncName] = preparedOptions;
                }

                return acc;
            },
            {}
        );
    }

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
        const { component } = this;

        this.syncConfig = Sync.prepareSyncConfig(
            this.predefinedSyncConfig,
            component.options.sync
        );

        for (const id of Object.keys(this.syncConfig)) {
            const syncOptions = this.syncConfig[id];
            if (!syncOptions) {
                continue;
            }

            let {
                emitter: emitterConfig,
                handler: handlerConfig
            } = syncOptions;

            if (handlerConfig) {
                if (handlerConfig === true) {
                    handlerConfig =
                        Sync.defaultHandlers[id]
                            .handler as Sync.HandlerConfig;
                }

                const handler = new SyncHandler(id, handlerConfig);
                if (!this.isRegisteredHandler(handler.id)) {
                    this.registerSyncHandler(handler);
                    handler.register(component);
                }
            }

            if (emitterConfig) {
                if (emitterConfig === true) {
                    emitterConfig =
                        Sync.defaultHandlers[id]
                            .emitter as Sync.EmitterConfig;
                }

                const emitter = new SyncEmitter(id, emitterConfig);
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
    export type EmitterConfig = SyncEmitter['func'];

    /** @internal */
    export type HandlerConfig = SyncHandler['func'];

    /** @internal */
    export interface SyncPair {
        emitter?: EmitterConfig;
        handler?: HandlerConfig;
    }

    /**
     * The configuration used to determine the default sync options, handlers
     * and emitters for a component.
     */
    export interface PredefinedSyncConfig {
        /**
         * The default sync pairs (emitters and handlers) for the component.
         */
        defaultSyncPairs: Record<string, SyncPair>;
        /**
         * The default sync options for the component.
         */
        defaultSyncOptions: Record<string, OptionsEntry>;
    }

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
         * The group in which components sharing the same connector should be
         * synced.
         *
         * If `null` or `undefined` the component will be synced with all
         * components with the same connector.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/sync/groups | Sync groups for the same connector }
         *
         * @default undefined
         */
        group?: string;

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
        Record<string, OptionsEntry>
    );

    /** @internal */
    export type RawOptionsRecord = (
        Record<string, boolean | OptionsEntry | undefined>
    );
}


/* *
 *
 *  Default Export
 *
 * */

export default Sync;
