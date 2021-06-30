import type ComponentTypes from '../ComponentType';
import type Sync from './Sync';

/* *
 *
 *  Wrapper for event listeners on a component
 *
 * */
class SyncEmitter implements Sync.Emitter {


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

        SyncEmitter.register(this);
    }

    public createEmitter(component: ComponentTypes): Function {
        return this.func.bind(component);
    }
}

export default SyncEmitter;
