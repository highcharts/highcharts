/* *
 *
 *  (c) 2009-2020 Øystein Moseng
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
var addEvent = U.addEvent, extend = U.extend;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 * @class
 */
var EventProvider = function () {
    this.eventRemovers = [];
};
extend(EventProvider.prototype, {
    /**
     * Add an event to an element and keep track of it for later removal.
     * Same args as Highcharts.addEvent.
     * @private
     * @return {Function}
     */
    addEvent: function () {
        var remover = addEvent.apply(H, arguments);
        this.eventRemovers.push(remover);
        return remover;
    },
    /**
     * Remove all added events.
     * @private
     * @return {void}
     */
    removeAddedEvents: function () {
        this.eventRemovers.forEach(function (remover) {
            remover();
        });
        this.eventRemovers = [];
    }
});
export default EventProvider;
