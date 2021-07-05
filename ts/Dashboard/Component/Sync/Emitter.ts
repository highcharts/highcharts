import type ComponentTypes from '../ComponentType';


export type EmitterFunction = (this: ComponentTypes) => Function | void;

/* *
 *
 *  Wrapper for event listeners on a component
 *
 * */
class SyncEmitter {


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
    public func: EmitterFunction;
    public callback?: ReturnType<EmitterFunction>;

    constructor(id: string, type: 'data' | 'presentation', func: EmitterFunction) {
        this.id = id;
        this.type = type;
        this.func = func;

        SyncEmitter.register(this);
    }

    public create(component: ComponentTypes): void {
        this.callback = this.func.call(component);
    }

    public remove(): void {
        const { callback } = this;
        if (callback) {
            return callback();
        }
    }
}

export default SyncEmitter;
