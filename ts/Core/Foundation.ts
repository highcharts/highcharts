/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { ChartOptions } from './Chart/ChartOptions';
import type { EventCallback as CoreEventCallback } from './Callback';
import type { SeriesOptions } from './Series/SeriesOptions';
import type { XAxisOptions } from './Axis/AxisOptions';

import Axis from './Axis/Axis.js';
import Chart from './Chart/Chart.js';
import Series from './Series/Series.js';
import U from './Utilities.js';
const {
    addEvent,
    fireEvent,
    isFunction,
    objectEach,
    removeEvent
} = U;

/* *
 *
 *  Class
 *
 * */

abstract class Foundation<TypeOfClass extends Function> {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor() {
        this.Class = this.constructor as TypeOfClass;
    }

    /* *
     *
     *  Properties
     *
     * */

    public Class: TypeOfClass;

    /* *
     *
     *  Functions
     *
     * */

    public emit<EventArguments extends AnyRecord|Event = AnyRecord|Event>(
        event: Foundation.EventsOf<TypeOfClass>,
        eventArguments?: EventArguments,
        defaultFunction?: (
            Foundation.EventCallback<TypeOfClass, EventArguments>|
            Function
        )
    ): void {
        fireEvent(this, event, eventArguments, defaultFunction);
    }

    public off<EventArguments extends AnyRecord|Event = AnyRecord|Event>(
        event: Foundation.EventsOf<TypeOfClass>,
        fn: Foundation.EventCallback<TypeOfClass, EventArguments>
    ): void {
        removeEvent(this, event, fn);
    }

    public on<EventArguments extends AnyRecord|Event = AnyRecord|Event>(
        event: Foundation.EventsOf<TypeOfClass>,
        fn: Foundation.EventCallback<TypeOfClass, EventArguments>,
        options?: U.EventOptions
    ): Function {
        return addEvent(this, event, fn, options);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Foundation {

    /* *
     *
     *  Declarations
     *
     * */

    export type EventCallback<
        TypeOfClass extends Function,
        EventArguments extends AnyRecord|Event = AnyRecord|Event
    > = (
        CoreEventCallback<
        TypeOfClass['prototype'],
        (EventArguments&U.EventObject<TypeOfClass['prototype']>)
        >
    );

    export type EventsOf<TypeOfClass extends Function> = (
        keyof FunctionsOf<TypeOfClass>|
        `after${Capitalize<keyof FunctionsOf<TypeOfClass>>}`|
        `before${Capitalize<keyof FunctionsOf<TypeOfClass>>}`
    );

    export type FunctionsOf<TypeOfClass extends Function> =
        Omit<globalThis.FunctionsOf<TypeOfClass['prototype']>, (
            'Class'|
            'emit'|
            'off'|
            'on'
        )>;

    export type Off<TypeOfClass extends Function> = <
        EventArguments extends AnyRecord|Event = AnyRecord|Event
    >(
        event: EventsOf<TypeOfClass>,
        fn: Foundation.EventCallback<TypeOfClass, EventArguments>
    ) => void;

    export type On<TypeOfClass extends Function> = <
        EventArguments extends AnyRecord|Event = AnyRecord|Event
    >(
        event: EventsOf<TypeOfClass>,
        fn: Foundation.EventCallback<TypeOfClass, EventArguments>,
        options?: U.EventOptions
    ) => Function;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function createOffFunction<TypeOfClass extends Function>(
        Class: TypeOfClass
    ): Off<TypeOfClass> {
        return <TEvent extends AnyRecord|Event = AnyRecord|Event>(
            event: EventsOf<TypeOfClass>,
            fn?: EventCallback<TypeOfClass, TEvent>
        ): void =>
            removeEvent(Class, event, fn);
    }

    /**
     * @private
     */
    export function createOnFunction<TypeOfClass extends Function>(
        Class: TypeOfClass
    ): On<TypeOfClass> {
        return <TEvent extends AnyRecord|Event = AnyRecord|Event>(
            event: EventsOf<TypeOfClass>,
            fn: EventCallback<TypeOfClass, TEvent>,
            options?: U.EventOptions
        ): Function =>
            addEvent(Class, event, fn, options);
    }

    /**
     * Register event options. If an event handler is set on the options, it
     * should be subject to Chart.update, Axis.update and Series.update. This is
     * contrary to general handlers that are set directly using addEvent either
     * on the class or on the instance. #6538, #6943, #10861.
     * @private
     */
    export function registerEventOptions(
        component: Axis|Chart|Series,
        options: XAxisOptions|ChartOptions|SeriesOptions
    ): void {

        // A lookup over those events that are added by _options_ (not
        // programmatically). These are updated through .update()
        component.eventOptions = component.eventOptions || {};

        // Register event listeners
        objectEach(
            options.events,
            function (event: any, eventType: string): void {
                // If event does not exist, or is changed by the .update()
                // function
                if (component.eventOptions[eventType] !== event) {

                    // Remove existing if set by option
                    if (component.eventOptions[eventType]) {
                        removeEvent(
                            component,
                            eventType,
                            component.eventOptions[eventType]
                        );
                        delete component.eventOptions[eventType];
                    }

                    if (isFunction(event)) {
                        component.eventOptions[eventType] = event;
                        addEvent(component, eventType, event);
                    }
                }
            }
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Foundation;
