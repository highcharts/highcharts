import type ComponentTypes from '../ComponentType';

/* *
 *
 *  Wrapper for event listeners on a component
 *
 * */
export default class SyncEmitter {


    /**
     * Registry for reusable handlers
     */
    public static registry: Record<string, SyncEmitter> = {};

    public static register(handler: SyncEmitter): void {
        const { id } = handler;
        this.registry[id] = handler;
    }

    public static get(handlerID: string): SyncEmitter | undefined {
        return this.registry[handlerID];
    }


    public id: string;
    public type: 'data' | 'presentation'; // Might not be necessary
    public func: Function;

    constructor(id: string, type: 'data' | 'presentation', func: Function) {
        this.id = id;
        this.type = type;
        this.func = func;
    }

    public createEmitter(component: ComponentTypes): Function {
        return this.func.bind(component);
    }
}
