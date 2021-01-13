/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Create announcer to speak messages to screen readers and other AT.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
import AST from '../../Core/Renderer/HTML/AST.js';
var doc = H.doc;
import DOMElementProvider from './DOMElementProvider.js';
import HTMLUtilities from './HTMLUtilities.js';
var setElAttrs = HTMLUtilities.setElAttrs, visuallyHideElement = HTMLUtilities.visuallyHideElement;
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
        AST.setElementHTML(this.announceRegion, message);
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
        var chartContainer = this.chart.announcerContainer || this.createAnnouncerContainer();
        var div = this.domElementProvider.createElement('div');
        setElAttrs(div, {
            'aria-hidden': false,
            'aria-live': type
        });
        visuallyHideElement(div);
        chartContainer.appendChild(div);
        return div;
    };
    Announcer.prototype.createAnnouncerContainer = function () {
        var chart = this.chart;
        var container = doc.createElement('div');
        setElAttrs(container, {
            'aria-hidden': false,
            style: 'position:relative',
            'class': 'highcharts-announcer-container'
        });
        chart.renderTo.insertBefore(container, chart.renderTo.firstChild);
        chart.announcerContainer = container;
        return container;
    };
    return Announcer;
}());
H.Announcer = Announcer;
export default Announcer;
