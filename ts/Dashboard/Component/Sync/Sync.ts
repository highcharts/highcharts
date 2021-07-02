import type ComponentTypes from '../ComponentType';

import defaultHandlers from './ChartSyncHandlers.js';
import type SyncEmitter from './Emitter';
import type SyncHandler from './Handler';

namespace Sync {
    export type EventType = 'visibility' | 'selection' | 'tooltip' | 'panning'

    export type Handler = SyncHandler;
    export type Emitter = SyncEmitter;

    export type EmitterFunction = (this: ComponentTypes, callbacks: Function[]) => void;
    export interface OptionsEntry {
        emitter: Function | SyncEmitter;
        handler: Function | SyncHandler;
    }

    export type OptionsRecord = Record<EventType, OptionsEntry>
}
/* *
 *
 * Class responsible for handling the setup of component sync.
 *
 * */
class Sync {

    public static defaultHandlers = defaultHandlers;

    public registerSyncEmitter(emitter: Sync.Emitter): void {
        const { id } = emitter;
        this.registeredSyncEmitters[id] = emitter;
    }

    public isRegisteredEmitter(id: string): boolean {
        return Boolean(this.registeredSyncEmitters[id]);
    }
    public registerSyncHandler(handler: Sync.Handler): void {
        const { id } = handler;
        this.registeredSyncHandlers[id] = handler;
    }

    public isRegisteredHandler(handlerID: string): boolean {
        return Boolean(this.registeredSyncHandlers[handlerID]);
    }

    /**
     * Registry for the synchandlers used within the component
     */
    private registeredSyncHandlers: Record<Sync.Handler['id'], Sync.Handler>;
    private registeredSyncEmitters: Record<Sync.Emitter['id'], Sync.Emitter>;

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

    constructor(component: ComponentTypes, syncEvents: Sync.EventType[], syncHandlers: Sync.OptionsRecord) {
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
        Object.keys(syncHandlers).forEach((id: string): void => {
            if (syncEvents.indexOf(id as Sync.EventType) > -1) {
                const { emitter, handler } = (syncHandlers as any)[id];
                if (typeof handler === 'function') {
                    handler(this);
                } else {
                    // Avoid registering the same handler multiple times
                    // i.e. panning and selection uses the same handler
                    if (!this.isRegisteredHandler(handler.id)) {
                        this.registerSyncHandler(handler);
                        handler.createHandler(component)();
                    }
                }

                if (typeof emitter === 'function') {
                    emitter(this);
                } else {
                    if (!this.isRegisteredEmitter(emitter.id)) {
                        this.registerSyncEmitter(emitter);
                        emitter.createEmitter(component)();
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
        });
        Object.keys(registeredSyncEmitters).forEach((id): void => {
            registeredSyncEmitters[id].remove();
        });
    }

}

export default Sync;
