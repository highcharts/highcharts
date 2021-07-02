import type ComponentTypes from '../ComponentType';
import type Sync from './Sync';


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
    public func: Sync.EmitterFunction;
    public callbacks: Function[];

    constructor(id: string, type: 'data' | 'presentation', func: Sync.EmitterFunction) {
        this.id = id;
        this.type = type;
        this.func = func;
        this.callbacks = [];

        SyncEmitter.register(this);
    }

    public createEmitter(component: ComponentTypes): Function {
        return this.func.bind(component, this.callbacks);
    }

    public remove(): void {
        this.callbacks.forEach((callback): void => callback());
    }
}

export default SyncEmitter;
