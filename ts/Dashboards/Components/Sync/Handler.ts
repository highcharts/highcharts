/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Component from '../Component';

/* *
 *
 *  Class
 *
 * */

/**
 * Class responsible for storing handler callbacks used in component sync.
 * @internal
 */
class SyncHandler {

    /**
     * Registry for reusable handlers.
     * The handler is stored by ID.
     */
    public static registry: Record<string, SyncHandler> = {};

    /**
     * Adds a handler to the handler registry.
     *
     * @param handler
     * The handler to add to the registry.
     */
    public static register(handler: SyncHandler): void {
        const { id } = handler;
        this.registry[id] = handler;
    }

    /**
     * Gets a handler from handler registry.
     *
     * @param handlerID
     * The ID of the handler to get.
     */
    public static get(handlerID: string): SyncHandler | undefined {
        return this.registry[handlerID];
    }

    /**
     * The ID of the handler.
     * @remark Can be any string, but should be unique.
     */
    public id: string;

    /**
     * The function to be called when the handler is activated.
     */
    public func: Function;

    /**
     * Callback function that is called when the handler is removed.
     * Normally provided as the return value of {@link func}.
     */
    public callback?: Function;


    /**
     * Creates a new handler instance.
     *
     * @param id
     * An unique ID for the handler.
     *
     * @param func
     * The function to be called when the handler is activated.
     */
    constructor(
        id: string,
        func: Function
    ) {
        this.id = id;
        this.func = func;

        SyncHandler.register(this);
    }

    /**
     * Calls the activation function on the component and sets the callback to
     * the return function.
     *
     * @param component
     * The component to register on.
     */
    public register(component: Component): void {
        const { func } = this;
        this.callback = func.call(component);
    }

    /**
     * To be used when removing the handler from the component.
     * Calls the {@link callback} function.
     */
    public remove(): void {
        if (this.callback) {
            this.callback();
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default SyncHandler;
