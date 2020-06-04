/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Create announcer to speak messages to screen readers and other AT.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../../parts/Globals.js';
import DOMElementProvider from './DOMElementProvider.js';
import HTMLUtilities from './htmlUtilities.js';
var visuallyHideElement = HTMLUtilities.visuallyHideElement;
var Announcer = /** @class */ (function () {
    function Announcer(chart, type) {
        this.chart = chart;
        this.domElementProvider = new DOMElementProvider();
        this.announceRegion = this.addAnnounceRegion(type);
    }
    Announcer.prototype.destroy = function () {
        this.domElementProvider.destroyCreatedElements();
    };
    Announcer.prototype.announce = function (message) {
        var _this = this;
        this.announceRegion.innerHTML = message;
        // Delete contents after a little while to avoid user finding the live
        // region in the DOM.
        if (this.clearAnnouncementRegionTimer) {
            clearTimeout(this.clearAnnouncementRegionTimer);
        }
        this.clearAnnouncementRegionTimer = setTimeout(function () {
            _this.announceRegion.innerHTML = '';
            delete _this.clearAnnouncementRegionTimer;
        }, 1000);
    };
    Announcer.prototype.addAnnounceRegion = function (type) {
        var chartContainer = this.chart.renderTo;
        var div = this.domElementProvider.createElement('div');
        div.setAttribute('aria-hidden', false);
        div.setAttribute('aria-live', type);
        visuallyHideElement(div);
        chartContainer.insertBefore(div, chartContainer.firstChild);
        return div;
    };
    return Announcer;
}());
H.Announcer = Announcer;
export default Announcer;
