/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Class that can keep track of events added, and clean them up on destroy.
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import type { DOMElementType } from '../../Core/Renderer/DOMElementType';

import { addEvent, type EventOptions } from '../../Shared/Utilities.js';
import H from '../../Core/Globals.js';

/* *
 *
 *  Class
 *
 * */

/** @internal */
interface ElementsFocusEventRemovers {
    element: DOMElementType,
    remover: Function
}


/** @internal */
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


    public addEvent<T>(
        el: (Class<T>|T),
        type: string,
        fn: (EventCallback<T>|Function),
        options?: EventOptions
    ): Function;
    /**
     * Add an event to an element and keep track of it for later removal.
     * Same args as Highcharts.addEvent.
     *
     * @internal
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
     *
     * @internal
     */
    public removeEvent(event: Function): void {
        const pos =
            this.eventRemovers.map((e): Function => e.remover).indexOf(event);
        this.eventRemovers[pos].remover();
        this.eventRemovers.splice(pos, 1);
    }

    /**
     * Remove all added events.
     *
     * @internal
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

/** @internal */
export default EventProvider;
