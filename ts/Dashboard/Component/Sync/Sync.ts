import type ComponentTypes from '../ComponentType';

import defaultHandlers from './ChartSyncHandlers.js';
import type SyncEmitter from './Emitter';
import type SyncHandler from './Handler';

namespace Sync {
    export type EventType = 'visibility' | 'selection' | 'tooltip' | 'panning'

    export interface OptionsEntry {
        emitter: Function | SyncEmitter;
        handler: Function | SyncHandler;
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
    public syncHandlers: Sync.OptionsRecord;

    constructor(
        component: ComponentTypes,
        syncEvents: Sync.EventType[],
        syncHandlers: Sync.OptionsRecord = defaultHandlers
    ) {
        this.component = component;
        this.syncEvents = syncEvents;
        this.syncHandlers = syncHandlers;
        this.registeredSyncHandlers = {};
        this.registeredSyncEmitters = {};
    }

    /**
     * Registers the handlers and emitters on the component
     */
    public start(): void {
        const { syncHandlers, syncEvents, component } = this;
        Object.keys(syncHandlers)
            .forEach((id): void => {
                if (syncEvents.indexOf(id as Sync.EventType) > -1) {
                    const { emitter, handler } = syncHandlers[id];
                    if (typeof handler === 'function') {
                        handler(this);
                    } else {
                        // Avoid registering the same handler multiple times
                        // i.e. panning and selection uses the same handler
                        if (!this.isRegisteredHandler(handler.id)) {
                            this.registerSyncHandler(handler);
                            handler.create(component);
                        }
                    }

                    if (typeof emitter === 'function') {
                        emitter(this);
                    } else {
                        if (!this.isRegisteredEmitter(emitter.id)) {
                            this.registerSyncEmitter(emitter);
                            emitter.create(component);
                        }
                    }
                }
            });
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
    }

}

export default Sync;
