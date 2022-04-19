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
import AST from '../../Core/Renderer/HTML/AST.js';
import DOMElementProvider from './DOMElementProvider.js';
import H from '../../Core/Globals.js';
var doc = H.doc;
import HU from './HTMLUtilities.js';
var addClass = HU.addClass, visuallyHideElement = HU.visuallyHideElement;
import U from '../../Core/Utilities.js';
var attr = U.attr;
/* *
 *
 *  Class
 *
 * */
var Announcer = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function Announcer(chart, type) {
        this.chart = chart;
        this.domElementProvider = new DOMElementProvider();
        this.announceRegion = this.addAnnounceRegion(type);
    }
    /* *
     *
     *  Functions
     *
     * */
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
            _this.announceRegion.innerHTML = AST.emptyHTML;
            delete _this.clearAnnouncementRegionTimer;
        }, 1000);
    };
    Announcer.prototype.addAnnounceRegion = function (type) {
        var chartContainer = (this.chart.announcerContainer || this.createAnnouncerContainer()), div = this.domElementProvider.createElement('div');
        attr(div, {
            'aria-hidden': false,
            'aria-live': type
        });
        if (this.chart.styledMode) {
            addClass(div, 'highcharts-visually-hidden');
        }
        else {
            visuallyHideElement(div);
        }
        chartContainer.appendChild(div);
        return div;
    };
    Announcer.prototype.createAnnouncerContainer = function () {
        var chart = this.chart, container = doc.createElement('div');
        attr(container, {
            'aria-hidden': false,
            'class': 'highcharts-announcer-container'
        });
        container.style.position = 'relative';
        chart.renderTo.insertBefore(container, chart.renderTo.firstChild);
        chart.announcerContainer = container;
        return container;
    };
    return Announcer;
}());
/* *
 *
 *  Default Export
 *
 * */
export default Announcer;
