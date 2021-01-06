/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for series and points.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../../Core/Globals.js';
import U from '../../../Core/Utilities.js';
var extend = U.extend;
import AccessibilityComponent from '../../AccessibilityComponent.js';
import SeriesKeyboardNavigation from './SeriesKeyboardNavigation.js';
import NewDataAnnouncer from './NewDataAnnouncer.js';
import addForceMarkersEvents from './ForcedMarkers.js';
import ChartUtilities from '../../Utils/ChartUtilities.js';
var hideSeriesFromAT = ChartUtilities.hideSeriesFromAT;
import SeriesDescriber from './SeriesDescriber.js';
var describeSeries = SeriesDescriber.describeSeries;
import Tooltip from '../../../Core/Tooltip.js';
// Expose functionality to users
H.SeriesAccessibilityDescriber = SeriesDescriber;
// Handle forcing markers
addForceMarkersEvents();
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * The SeriesComponent class
 *
 * @private
 * @class
 * @name Highcharts.SeriesComponent
 */
var SeriesComponent = function () { };
SeriesComponent.prototype = new AccessibilityComponent();
extend(SeriesComponent.prototype, /** @lends Highcharts.SeriesComponent */ {
    /**
     * Init the component.
     */
    init: function () {
        this.newDataAnnouncer = new NewDataAnnouncer(this.chart);
        this.newDataAnnouncer.init();
        this.keyboardNavigation = new SeriesKeyboardNavigation(this.chart, this.keyCodes);
        this.keyboardNavigation.init();
        this.hideTooltipFromATWhenShown();
        this.hideSeriesLabelsFromATWhenShown();
    },
    /**
     * @private
     */
    hideTooltipFromATWhenShown: function () {
        var component = this;
        this.addEvent(Tooltip, 'refresh', function () {
            if (this.chart === component.chart &&
                this.label &&
                this.label.element) {
                this.label.element.setAttribute('aria-hidden', true);
            }
        });
    },
    /**
     * @private
     */
    hideSeriesLabelsFromATWhenShown: function () {
        this.addEvent(this.chart, 'afterDrawSeriesLabels', function () {
            this.series.forEach(function (series) {
                if (series.labelBySeries) {
                    series.labelBySeries.attr('aria-hidden', true);
                }
            });
        });
    },
    /**
     * Called on chart render. It is necessary to do this for render in case
     * markers change on zoom/pixel density.
     */
    onChartRender: function () {
        var chart = this.chart;
        chart.series.forEach(function (series) {
            var shouldDescribeSeries = (series.options.accessibility &&
                series.options.accessibility.enabled) !== false &&
                series.visible;
            if (shouldDescribeSeries) {
                describeSeries(series);
            }
            else {
                hideSeriesFromAT(series);
            }
        });
    },
    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function () {
        return this.keyboardNavigation.getKeyboardNavigationHandler();
    },
    /**
     * Remove traces
     */
    destroy: function () {
        this.newDataAnnouncer.destroy();
        this.keyboardNavigation.destroy();
    }
});
export default SeriesComponent;
