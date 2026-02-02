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

import type { AnyRecord } from '../Shared/Types';
import type { Class } from './Globals';

import D from './Globals.js';
const {
    doc,
    supportsPassiveEvents
} = D;
import { extend, objectEach } from '../Shared/Utilities.js';
import {
    error as coreError,
    uniqueKey as coreUniqueKey
} from '../Core/Utilities.js'

/* *
 *
 *  Functions
 *
 * */

/**
 * Add an event listener.
 *
 * @function Highcharts.addEvent<T>
 *
 * @param  {D.Class<T>|T} el
 *         The element or object to add a listener to. It can be a
 *         {@link HTMLDOMElement}, an {@link SVGElement} or any other object.
 *
 * @param  {string} type
 *         The event type.
 *
 * @param  {Dashboards.EventCallbackFunction<T>|Function} fn
 *         The function callback to execute when the event is fired.
 *
 * @param  {Dashboards.EventOptionsObject} [options]
 *         Options for adding the event.
 *
 * @return {Function}
 *         A callback function to remove the added event.
 */
function addEvent<T>(
    el: (Class<T>|T),
    type: string,
    fn: (EventCallback<T>|Function),
    options: EventOptions = {}
): Function {
    /* eslint-enable valid-jsdoc */

    // Add hcEvents to either the prototype (in case we're running addEvent on a
    // class) or the instance. If hasOwnProperty('hcEvents') is false, it is
    // inherited down the prototype chain, in which case we need to set the
    // property on this instance (which may itself be a prototype).
    const owner = typeof el === 'function' && el.prototype || el;
    if (!Object.hasOwnProperty.call(owner, 'hcEvents')) {
        owner.hcEvents = {};
    }
    const events: Record<string, Array<any>> = owner.hcEvents;

    // Handle DOM events
    // If the browser supports passive events, add it to improve performance
    // on touch events (#11353).
    const addEventListener = (el as any).addEventListener;
    if (addEventListener) {
        addEventListener.call(
            el,
            type,
            fn,
            supportsPassiveEvents ? {
                passive: options.passive === void 0 ?
                    type.indexOf('touch') !== -1 : options.passive,
                capture: false
            } : false
        );
    }

    if (!events[type]) {
        events[type] = [];
    }

    const eventObject = {
        fn,
        order: typeof options.order === 'number' ? options.order : Infinity
    };
    events[type].push(eventObject);

    // Order the calls
    events[type].sort((
        a: EventWrapperObject<T>,
        b: EventWrapperObject<T>
    ): number => a.order - b.order);

    // Return a function that can be called to remove this event.
    return function (): void {
        removeEvent(el, type, fn);
    };
}

/**
 * Returns a deep copy of an argument. It differs from `merge` in that it copies
 * also arrays.
 *
 * @param value
 * The value to clone.
 *
 * @param excludedKeys
 * An array of keys to exclude from the clone.
 */
function deepClone(value: any, excludedKeys?: string[]): any {
    if (Array.isArray(value)) {
        return value.map((v): any => deepClone(v, excludedKeys));
    }

    if (value && typeof value === 'object') {
        const clone: Record<string, any> = {};
        const keys = Object.keys(value);

        for (const key of keys) {
            if (excludedKeys && excludedKeys.includes(key)) {
                clone[key] = value[key];
            } else {
                clone[key] = deepClone(value[key], excludedKeys);
            }
        }

        return clone;
    }

    return value;
}

/**
 * Creates a session-dependent unique key string for reference purposes.
 *
 * @function Dashboards.uniqueKey
 *
 * @return {string}
 * Unique key string
 */
function uniqueKey(): string {
    return `dashboard-${coreUniqueKey().replace('highcharts-', '')}`;
}

/**
 * Provide error messages for debugging, with links to online explanation. This
 * function can be overridden to provide custom error handling.
 *
 * @sample highcharts/chart/highcharts-error/
 *         Custom error handler
 *
 * @function Dashboards.error
 *
 * @param {number|string} code
 *        The error code. See
 *        [errors.xml](https://github.com/highcharts/highcharts/blob/master/errors/errors.xml)
 *        for available codes. If it is a string, the error message is printed
 *        directly in the console.
 *
 * @param {boolean} [stop=false]
 *        Whether to throw an error or just log a warning in the console.
 *
 * @return {void}
 */
function error(code: number|string, stop?: boolean): void {
    // TODO- replace with proper error handling
    if (code === 16) {
        console.warn( // eslint-disable-line no-console
            'Dashboard error: Dashboards library loaded more than once.' +
            'This may cause undefined behavior.'
        );
        return;
    }
    coreError(code, stop);
}

/**
 * Fire an event that was registered with addEvent.
 *
 * @function Highcharts.fireEvent<T>
 *
 * @param {T} el
 *        The object to fire the event on. It can be a {@link HTMLDOMElement},
 *        an {@link SVGElement} or any other object.
 *
 * @param {string} type
 *        The type of event.
 *
 * @param {Dashboards.Dictionary<*>|Event} [eventArguments]
 *        Custom event arguments that are passed on as an argument to the event
 *        handler.
 *
 * @param {Dashboards.EventCallbackFunction<T>|Function} [defaultFunction]
 *        The default function to execute if the other listeners haven't
 *        returned false.
 *
 * @return {void}
 */
function fireEvent<T>(
    el: T,
    type: string,
    eventArguments?: (AnyRecord|Event),
    defaultFunction?: (EventCallback<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */
    eventArguments = eventArguments || {};

    if (
        doc?.createEvent &&
        (
            (el as any).dispatchEvent ||
            (
                (el as any).fireEvent &&
                // Enable firing events on Highcharts instance.
                (el as any) !== D
            )
        )
    ) {
        const e = doc.createEvent('Events');
        e.initEvent(type, true, true);

        eventArguments = extend(e, eventArguments);

        if ((el as any).dispatchEvent) {
            (el as any).dispatchEvent(eventArguments);
        } else {
            (el as any).fireEvent(type, eventArguments);
        }

    } else if ((el as any).hcEvents) {

        if (!(eventArguments as any).target) {
            // We're running a custom event

            extend(eventArguments as any, {
                // Attach a simple preventDefault function to skip
                // default handler if called. The built-in
                // defaultPrevented property is not overwritable (#5112)
                preventDefault: function (): void {
                    (eventArguments as any).defaultPrevented = true;
                },
                // Setting target to native events fails with clicking
                // the zoom-out button in Chrome.
                target: el,
                // If the type is not set, we're running a custom event
                // (#2297). If it is set, we're running a browser event.
                type: type
            });
        }

        const events: Array<EventWrapperObject<any>> = [];
        let object: any = el;
        let multilevel = false;

        // Recurse up the inheritance chain and collect hcEvents set as own
        // objects on the prototypes.
        while (object.hcEvents) {
            if (
                Object.hasOwnProperty.call(object, 'hcEvents') &&
                object.hcEvents[type]
            ) {
                if (events.length) {
                    multilevel = true;
                }
                events.unshift.apply(events, object.hcEvents[type]);
            }
            object = Object.getPrototypeOf(object);
        }

        // For performance reasons, only sort the event handlers in case we are
        // dealing with multiple levels in the prototype chain. Otherwise, the
        // events are already sorted in the addEvent function.
        if (multilevel) {
            // Order the calls
            events.sort((
                a: EventWrapperObject<T>,
                b: EventWrapperObject<T>
            ): number => a.order - b.order);
        }

        // Call the collected event handlers
        events.forEach((obj): void => {
            // If the event handler returns false, prevent the default handler
            // from executing
            if (obj.fn.call(el, eventArguments as any) === false) {
                (eventArguments as any).preventDefault();
            }
        });

    }

    // Run the default if not prevented
    if (defaultFunction && !eventArguments.defaultPrevented) {
        (defaultFunction as Function).call(el, eventArguments);
    }
}

/**
 * Remove an event that was added with {@link Highcharts#addEvent}.
 *
 * @function Dashboards.removeEvent<T>
 *
 * @param {Dashboards.Class<T>|T} el
 *        The element to remove events on.
 *
 * @param {string} [type]
 *        The type of events to remove. If undefined, all events are removed
 *        from the element.
 *
 * @param {Dashboards.EventCallbackFunction<T>} [fn]
 *        The specific callback to remove. If undefined, all events that match
 *        the element and optionally the type are removed.
 *
 * @return {void}
 */
function removeEvent<T>(
    el: (Class<T>|T),
    type?: string,
    fn?: (EventCallback<T>|Function)
): void {
    /* eslint-enable valid-jsdoc */

    /**
     * @private
     */
    function removeOneEvent(
        type: string,
        fn: (EventCallback<T>|Function)
    ): void {
        const removeEventListener = (el as any).removeEventListener;

        if (removeEventListener) {
            removeEventListener.call(el, type, fn, false);
        }
    }

    /**
     * @private
     */
    function removeAllEvents(eventCollection: any): void {
        let types: Record<string, boolean>,
            len;

        if (!(el as any).nodeName) {
            return; // Break on non-DOM events
        }

        if (type) {
            types = {};
            types[type] = true;
        } else {
            types = eventCollection;
        }

        objectEach(types, function (_val, n): void {
            if (eventCollection[n]) {
                len = eventCollection[n].length;
                while (len--) {
                    removeOneEvent(n as any, eventCollection[n][len].fn);
                }
            }
        });
    }

    const owner = typeof el === 'function' && el.prototype || el;
    if (Object.hasOwnProperty.call(owner, 'hcEvents')) {
        const events = owner.hcEvents;
        if (type) {
            const typeEvents = (
                events[type] || []
            ) as EventWrapperObject<T>[];

            if (fn) {
                events[type] = typeEvents.filter(
                    function (obj): boolean {
                        return fn !== obj.fn;
                    }
                );
                removeOneEvent(type, fn);

            } else {
                removeAllEvents(events);
                events[type] = [];
            }
        } else {
            removeAllEvents(events);
            delete owner.hcEvents;
        }
    }
}

export interface EventCallback<T> {
    (this: T, eventArguments: (AnyRecord|Event)): (boolean|void);
}
export interface EventWrapperObject<T> {
    fn: EventCallback<T>;
    order: number;
}
export interface EventOptions {
    order?: number;
    passive?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

const Utilities = {
    addEvent,
    deepClone,
    error,
    fireEvent,
    removeEvent,
    uniqueKey
};

export default Utilities;
