/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Class that can keep track of events added, and clean them up on destroy.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class EventProvider {
            public constructor();
            public eventRemovers: Array<Function>;
            public addEvent: typeof addEvent;
            public removeAddedEvents(): void;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 * @class
 */
var EventProvider: typeof Highcharts.EventProvider = function (
    this: Highcharts.EventProvider
): void {
    this.eventRemovers = [];
} as any;
extend(EventProvider.prototype, {

    /**
     * Add an event to an element and keep track of it for later removal.
     * Same args as Highcharts.addEvent.
     * @private
     * @return {Function}
     */
    addEvent: function (this: Highcharts.EventProvider): Function {
        var remover = addEvent.apply(H, arguments);
        this.eventRemovers.push(remover);
        return remover;
    },


    /**
     * Remove all added events.
     * @private
     * @return {void}
     */
    removeAddedEvents: function (this: Highcharts.EventProvider): void {
        this.eventRemovers.forEach(function (remover: Function): void {
            remover();
        });
        this.eventRemovers = [];
    }

});

export default EventProvider;
