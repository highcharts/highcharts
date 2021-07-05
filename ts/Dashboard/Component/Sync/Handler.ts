import type ComponentTypes from '../ComponentType';
import type SharedState from '../SharedComponentState';

/* *
 *
 *  Adds listeners to the Component group for a given "trigger" event
 *
 * */

export default class SyncHandler {

    /**
     * Registry for reusable handlers
     */
    public static registry: Record<string, SyncHandler> = {};

    public static register(handler: SyncHandler): void {
        const { id } = handler;
        this.registry[id] = handler;
    }

    public static get(handlerID: string): SyncHandler | undefined {
        return this.registry[handlerID];
    }

    public id: string;
    public presentationStateTrigger: SharedState.eventTypes;
    public func: Function;
    public callback?: Function;

    constructor(id: string, trigger: SharedState.eventTypes, func: Function) {
        this.id = id;
        this.presentationStateTrigger = trigger;
        this.func = func;

        SyncHandler.register(this);
    }

    public create(component: ComponentTypes): void {
        const { id, activeGroup } = component;
        if (activeGroup) {
            this.callback = activeGroup.getSharedState().on(this.presentationStateTrigger, (e): void => {
                if (id !== (e.detail ? e.detail.sender : void 0)) {
                    this.func.call(component, e);
                }
            });
        }
    }

    public remove(): void {
        const { callback } = this;
        if (callback) {
            return callback();
        }
    }
}
