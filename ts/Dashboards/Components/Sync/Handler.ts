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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ComponentType from '../ComponentType';
import type SharedState from '../SharedComponentState';

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
     * Adds a handler to the handler regisitry.
     *
     * @param handler The handler to add to the registry.
     */
    public static register(handler: SyncHandler): void {
        const { id } = handler;
        this.registry[id] = handler;
    }

    /**
     * Gets a handler from handler registry.
     *
     * @param handlerID The ID of the handler to get.
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
     * @deprecated replaced by {@link Data.DataCursor}.
     */
    public presentationStateTrigger?: SharedState.eventTypes;

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
     * @param id an unique ID for the handler.
     *
     * @param trigger The id of the presentationState that should trigger
     * this handler. Should be `undefined` when DataCursor is used.
     *
     * @param func
     * The function to be called when the handler is activated.
     */
    constructor(
        id: string,
        trigger: SharedState.eventTypes | undefined,
        func: Function
    ) {
        this.id = id;
        this.presentationStateTrigger = trigger;
        this.func = func;

        SyncHandler.register(this);
    }

    /**
     * Attaches the handler to a component and presentationState.
     *
     * @deprecated use {@link register}
     * @param component The component to attach to.
     */
    public create(component: ComponentType): void {
        const { activeGroup } = component;
        const { func } = this;
        if (activeGroup && this.presentationStateTrigger) {
            this.callback = activeGroup
                .getSharedState()
                .on(
                    this.presentationStateTrigger,
                    function (e): void {
                        if (
                            component.id !==
                            (e.detail ? e.detail.sender : void 0)
                        ) {
                            func.call(component, e);
                        }
                    }
                );
        }
    }

    /**
     * Calls the activation function on the component and sets the callback to
     * the return function.
     *
     * @param component The component to register on.
     */
    public register(component: ComponentType): void {
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
