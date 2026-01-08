/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type { XAxisOptions } from './Axis/AxisOptions';
import type { ChartOptions } from './Chart/ChartOptions';
import type { SeriesOptions } from './Series/SeriesOptions';
import type { LegendOptions } from './Legend/LegendOptions';

import Axis from './Axis/Axis.js';
import Chart from './Chart/Chart.js';
import Legend from './Legend/Legend.js';
import Series from './Series/Series.js';
import U from './Utilities.js';
const {
    addEvent,
    isFunction,
    objectEach,
    removeEvent
} = U;

/* *
 *
 *  Class Namespace
 *
 * */

/** @internal */
namespace Foundation {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Register event options. If an event handler is set on the options, it
     * should be subject to Chart.update, Axis.update and Series.update. This is
     * contrary to general handlers that are set directly using addEvent either
     * on the class or on the instance. #6538, #6943, #10861.
     * @internal
     */
    export function registerEventOptions(
        component: Axis|Chart|Legend|Series,
        options: XAxisOptions|ChartOptions|LegendOptions|SeriesOptions
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
                        addEvent(component, eventType, event, {
                            order: 0 // #14080 fire those events as firsts
                        });
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

/** @internal */
export default Foundation;
