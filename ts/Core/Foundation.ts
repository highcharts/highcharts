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
import type {
    XAxisOptions
} from 'Axis/AxisOptions';
import type {
    ChartOptions
} from 'Chart/ChartOptions';
import type {
    SeriesOptions
} from 'Series/SeriesOptions';

import Axis from 'Axis/Axis.js';
import Chart from 'Chart/Chart.js';
import Series from 'Series/Series.js';

import U from './Utilities.js';
const {
    addEvent,
    isFunction,
    objectEach,
    removeEvent
} = U;


/* *
 *
 *  Functions
 *
 * */

/*
 * Register event options. If an event handler is set on the options, it should
 * be subject to Chart.update, Axis.update and Series.update. This is contrary
 * to general handlers that are set directly using addEvent either on the class
 * or on the instance. #6538, #6943, #10861.
 */
const registerEventOptions = (
    component: Axis|Chart|Series,
    options: XAxisOptions|ChartOptions|SeriesOptions
): void => {

    // A lookup over those events that are added by _options_ (not
    // programmatically). These are updated through .update()
    component.eventOptions = component.eventOptions || {};

    // Register event listeners
    objectEach(
        options.events,
        function (event: any, eventType: string): void {
            if (isFunction(event)) {

                // If event does not exist, or is changed by the .update()
                // function
                if (component.eventOptions[eventType] !== event) {

                    // Remove existing if set by option
                    if (isFunction(component.eventOptions[eventType])) {
                        removeEvent(
                            component,
                            eventType,
                            component.eventOptions[eventType]
                        );
                    }

                    component.eventOptions[eventType] = event;
                    addEvent(component, eventType, event);
                }
            }
        }
    );
};

/* *
 *
 *  Default Export
 *
 * */

const exports = {
    registerEventOptions
};

export default exports;
