import type ComponentTypes from '../ComponentType';

import defaultHandlers from './ChartSyncHandlers.js';
import SyncEmitter from './Emitter.js';
import SyncHandler from './Handler.js';

namespace Sync {
    export type EventType = 'visibility' | 'selection' | 'tooltip' | 'panning'

    export type EmitterConfig = [SyncEmitter['id'], SyncEmitter['func']];
    export type HandlerConfig = [SyncHandler['id'], SyncHandler['presentationStateTrigger'], SyncHandler['func']];
    export interface OptionsEntry {
        emitter: EmitterConfig;
        handler: HandlerConfig;
    }

    export type OptionsRecord = Record<SyncEmitter['id'] | SyncHandler['id'], OptionsEntry>
}
/* *
 *
 * Class responsible for handling the setup of component sync.
 *
 * */
class Sync {

    public static defaultHandlers = defaultHandlers;

    public registerSyncEmitter(emitter: SyncEmitter): void {
        const { id } = emitter;
        this.registeredSyncEmitters[id] = emitter;
    }

    public isRegisteredEmitter(id: string): boolean {
        return Boolean(this.registeredSyncEmitters[id]);
    }
    public registerSyncHandler(handler: SyncHandler): void {
        const { id } = handler;
        this.registeredSyncHandlers[id] = handler;
    }

    public isRegisteredHandler(handlerID: string): boolean {
        return Boolean(this.registeredSyncHandlers[handlerID]);
    }

    /**
     * Registry for the synchandlers used within the component
     */
    private registeredSyncHandlers: Record<SyncHandler['id'], SyncHandler>;
    private registeredSyncEmitters: Record<SyncEmitter['id'], SyncEmitter>;

    /**
     * The component
     */
    public component: ComponentTypes;

    /**
     * The sync events to enable for the component
     */
    public syncEvents: Sync.EventType[];

    /**
     * The emitters and handlers to use for each event
     */
    public syncConfig: Sync.OptionsRecord;

    public isSyncing: boolean;

    constructor(
        component: ComponentTypes,
        syncEvents: Sync.EventType[],
        syncHandlers: Sync.OptionsRecord = Sync.defaultHandlers
    ) {
        this.component = component;
        this.syncEvents = syncEvents;
        this.syncConfig = syncHandlers;
        this.registeredSyncHandlers = {};
        this.registeredSyncEmitters = {};
        this.isSyncing = false;
    }

    /**
     * Registers the handlers and emitters on the component
     */
    public start(): void {
        const { syncConfig, syncEvents, component } = this;
        Object.keys(syncConfig)
            .forEach((id): void => {
                if (syncEvents.indexOf(id as Sync.EventType) > -1) {
                    const { emitter: emitterConfig, handler: handlerConfig } = syncConfig[id];
                    // Avoid registering the same handler multiple times
                    // i.e. panning and selection uses the same handler
                    const handler = new SyncHandler(...handlerConfig);
                    if (!this.isRegisteredHandler(handler.id)) {
                        this.registerSyncHandler(handler);
                        handler.create(component);
                    }

                    const emitter = new SyncEmitter(...emitterConfig);
                    if (!this.isRegisteredEmitter(emitter.id)) {
                        this.registerSyncEmitter(emitter);
                        emitter.create(component);
                    }

                }
            });
        this.isSyncing = true;
    }

    public stop(): void {
        const {
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
    }

}

export default Sync;
