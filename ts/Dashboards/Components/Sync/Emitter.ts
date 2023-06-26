/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import type ComponentType from '../ComponentType';

export type EmitterFunction = (this: ComponentType) => Function | void;

/**
 *  Class responsible for adding event listeners on a component
 *  @internal
 */
class SyncEmitter {
    /**
     * Registry for reusable emitter.
     * The emitter is stored by ID.
     */
    public static registry: Record<string, SyncEmitter> = {};

    /**
     * Adds an emitter to the emitter registry.
     *
     * @param emitter the emitter to add to the registry.
     */
    public static register(emitter: SyncEmitter): void {
        const { id } = emitter;
        this.registry[id] = emitter;
    }

    /**
     * Gets an emitter from emitter registry.
     *
     * @param emitterID The ID of the emitter to get.
     */
    public static get(emitterID: string): SyncEmitter | undefined {
        return this.registry[emitterID];
    }

    /**
     * The ID of the emitter.
     * @remark Can be any string, but should be unique.
     */
    public id: string;
    /**
     * The function to be called when the emitter is activated.
     */
    public func: EmitterFunction;
    /**
     * Callback function that is called when the emitter is removed.
     * Normally provided as the return value of {@link func}.
     */
    public callback?: ReturnType<EmitterFunction>;

    /**
     * Creates a new emitter instance.
     *
     * @param id An unique ID for the emitter.
     *
     * @param func
     * The function to be called when the emitter is activated.
     */
    constructor(id: string, func: EmitterFunction) {
        this.id = id;
        this.func = func;

        SyncEmitter.register(this);
    }

    /**
     * Attaches the emitter to a component.
     *
     * @param component The component to attach to.
     */
    public create(component: ComponentType): void {
        this.callback = this.func.call(component);
    }

    /**
     * To be used when removing the emitter from the component.
     * Calls the {@link callback} function.
     */
    public remove(): void {
        if (this.callback) {
            this.callback();
        }
    }
}

export default SyncEmitter;
