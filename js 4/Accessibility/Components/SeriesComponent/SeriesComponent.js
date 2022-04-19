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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import AccessibilityComponent from '../../AccessibilityComponent.js';
import ChartUtilities from '../../Utils/ChartUtilities.js';
var hideSeriesFromAT = ChartUtilities.hideSeriesFromAT;
import ForcedMarkers from './ForcedMarkers.js';
import NewDataAnnouncer from './NewDataAnnouncer.js';
import SeriesDescriber from './SeriesDescriber.js';
var describeSeries = SeriesDescriber.describeSeries;
import SeriesKeyboardNavigation from './SeriesKeyboardNavigation.js';
import Tooltip from '../../../Core/Tooltip.js';
/* *
 *
 *  Class
 *
 * */
/**
 * The SeriesComponent class
 *
 * @private
 * @class
 * @name Highcharts.SeriesComponent
 */
var SeriesComponent = /** @class */ (function (_super) {
    __extends(SeriesComponent, _super);
    function SeriesComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    SeriesComponent.compose = function (ChartClass, PointClass, SeriesClass) {
        NewDataAnnouncer.compose(SeriesClass);
        ForcedMarkers.compose(SeriesClass);
        SeriesKeyboardNavigation.compose(ChartClass, PointClass, SeriesClass);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Init the component.
     */
    SeriesComponent.prototype.init = function () {
        this.newDataAnnouncer = new NewDataAnnouncer(this.chart);
        this.newDataAnnouncer.init();
        this.keyboardNavigation = new SeriesKeyboardNavigation(this.chart, this.keyCodes);
        this.keyboardNavigation.init();
        this.hideTooltipFromATWhenShown();
        this.hideSeriesLabelsFromATWhenShown();
    };
    /**
     * @private
     */
    SeriesComponent.prototype.hideTooltipFromATWhenShown = function () {
        var component = this;
        this.addEvent(Tooltip, 'refresh', function () {
            if (this.chart === component.chart &&
                this.label &&
                this.label.element) {
                this.label.element.setAttribute('aria-hidden', true);
            }
        });
    };
    /**
     * @private
     */
    SeriesComponent.prototype.hideSeriesLabelsFromATWhenShown = function () {
        this.addEvent(this.chart, 'afterDrawSeriesLabels', function () {
            this.series.forEach(function (series) {
                if (series.labelBySeries) {
                    series.labelBySeries.attr('aria-hidden', true);
                }
            });
        });
    };
    /**
     * Called on chart render. It is necessary to do this for render in case
     * markers change on zoom/pixel density.
     */
    SeriesComponent.prototype.onChartRender = function () {
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
    };
    /**
     * Get keyboard navigation handler for this component.
     * @private
     */
    SeriesComponent.prototype.getKeyboardNavigation = function () {
        return this.keyboardNavigation.getKeyboardNavigationHandler();
    };
    /**
     * Remove traces
     * @private
     */
    SeriesComponent.prototype.destroy = function () {
        this.newDataAnnouncer.destroy();
        this.keyboardNavigation.destroy();
    };
    return SeriesComponent;
}(AccessibilityComponent));
/* *
 *
 *  Default Export
 *
 * */
export default SeriesComponent;
