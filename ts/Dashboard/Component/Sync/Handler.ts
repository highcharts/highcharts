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

    constructor(id: string, trigger: SharedState.eventTypes, func: Function) {
        this.id = id;
        this.presentationStateTrigger = trigger;
        this.func = func;

        SyncHandler.register(this);
    }

    public createHandler(component: ComponentTypes): Function {
        return (): void => {
            const { id, activeGroup } = component;
            if (activeGroup) {
                activeGroup.getSharedState().on(this.presentationStateTrigger, (e): void => {
                    if (id !== (e.detail ? e.detail.sender : void 0)) {
                        this.func.bind(component)(e);
                    }
                });
            }
        };
    }
}
