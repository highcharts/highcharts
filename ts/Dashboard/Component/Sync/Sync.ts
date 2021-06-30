import type ComponentTypes from '../ComponentType';

import defaultHandlers from './ChartSyncHandlers.js';

namespace Sync {
    export type EventType = 'visibility' | 'selection' | 'tooltip' | 'panning'

    export interface OptionsEntry {
        emitter: Function | Emitter;
        handler: Function | Handler;
    }

    export type OptionsRecord = Record<EventType, OptionsEntry>

    export interface Handler {
        id: string;
        createHandler: Function;
    }
    export interface Emitter {
        id: string;
        createEmitter: Function;
    }
}
/* *
 *
 * Class responsible for handling the setup of component sync.
 *
 * */
class Sync {

    public static defaultHandlers = defaultHandlers;

    /**
     * Registry for the synchandlers used within the component
     */
    private registeredSyncHandlers: Sync.Handler['id'][]

    public registerSyncHandler(handler: Sync.Handler): void {
        const { id } = handler;
        this.registeredSyncHandlers.push(id);
    }

    public isRegisteredHandler(handlerID: string): boolean {
        return this.registeredSyncHandlers.indexOf(handlerID) > -1;
    }

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
        this.registeredSyncHandlers = [];
    }

    /**
     * Registers the handlers and emitters on the component
     */
    public setup(): void {
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
                    emitter.createEmitter(component)();
                }
            }
        });
    }

}

export default Sync;
