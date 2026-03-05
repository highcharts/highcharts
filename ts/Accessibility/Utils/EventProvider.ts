/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Class that can keep track of events added, and clean them up on destroy.
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { EventCallback } from '../../Core/Callback';

import H from '../../Core/Globals.js';
import DOMElementType from '../../Core/Renderer/DOMElementType';
import U from '../../Core/Utilities.js';
const { addEvent } = U;

/* *
 *
 *  Class
 *
 * */

interface ElementsFocusEventRemovers {
    element: DOMElementType,
    remover: Function
}

/**
 * @private
 */
class EventProvider {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor() {
        this.eventRemovers = [];
    }

    /* *
     *
     *  Properties
     *
     * */

    public eventRemovers: Array<ElementsFocusEventRemovers>;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public addEvent<T>(
        el: (Class<T>|T),
        type: string,
        fn: (EventCallback<T>|Function),
        options?: U.EventOptions
    ): Function;
    /**
     * Add an event to an element and keep track of it for later removal.
     * Same args as Highcharts.addEvent.
     * @private
     */
    public addEvent(): Function {
        const remover = addEvent.apply(H, arguments);
        this.eventRemovers.push({
            element: arguments[0], // HTML element
            remover
        });
        return remover;
    }

    /**
     * Remove added event.
     * @private
     */
    public removeEvent(event: Function): void {
        const pos =
            this.eventRemovers.map((e): Function => e.remover).indexOf(event);
        this.eventRemovers[pos].remover();
        this.eventRemovers.splice(pos, 1);
    }

    /**
     * Remove all added events.
     * @private
     */
    public removeAddedEvents(): void {
        this.eventRemovers.map((e): Function => e.remover)
            .forEach((remover): void => remover());
        this.eventRemovers = [];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default EventProvider;
