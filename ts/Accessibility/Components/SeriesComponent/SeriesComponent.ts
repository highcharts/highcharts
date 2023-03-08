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


/* *
 *
 *  Imports
 *
 * */

import type Accessibility from '../../Accessibility';
import type Chart from '../../../Core/Chart/Chart';
import type KeyboardNavigationHandler from '../../KeyboardNavigationHandler';
import type Point from '../../../Core/Series/Point';
import type Tooltip from '../../../Core/Tooltip';

import AccessibilityComponent from '../../AccessibilityComponent.js';
import ChartUtilities from '../../Utils/ChartUtilities.js';
const { hideSeriesFromAT } = ChartUtilities;
import ForcedMarkers from './ForcedMarkers.js';
import NewDataAnnouncer from './NewDataAnnouncer.js';
import Series from '../../../Core/Series/Series.js';
import SeriesDescriber from './SeriesDescriber.js';
const { describeSeries } = SeriesDescriber;
import SeriesKeyboardNavigation from './SeriesKeyboardNavigation.js';


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
class SeriesComponent extends AccessibilityComponent {


    /* *
     *
     *  Static Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public static compose(
        ChartClass: typeof Chart,
        PointClass: typeof Point,
        SeriesClass: typeof Series
    ): void {
        NewDataAnnouncer.compose(SeriesClass);
        ForcedMarkers.compose(SeriesClass);
        SeriesKeyboardNavigation.compose(ChartClass, PointClass, SeriesClass);
    }


    /* *
     *
     *  Properties
     *
     * */

    public keyboardNavigation?: SeriesKeyboardNavigation;
    public newDataAnnouncer?: NewDataAnnouncer;


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Init the component.
     */
    public init(): void {
        this.newDataAnnouncer = new NewDataAnnouncer(this.chart);
        (this.newDataAnnouncer as any).init();

        this.keyboardNavigation = new SeriesKeyboardNavigation(
            this.chart, this.keyCodes
        );
        (this.keyboardNavigation as any).init();

        this.hideTooltipFromATWhenShown();
        this.hideSeriesLabelsFromATWhenShown();
    }


    /**
     * @private
     */
    public hideTooltipFromATWhenShown(): void {
        const component = this;

        if (this.chart.tooltip) {
            this.addEvent(
                this.chart.tooltip.constructor as unknown as Tooltip,
                'refresh',
                function (): void {
                    if (
                        this.chart === component.chart &&
                        this.label &&
                        this.label.element
                    ) {
                        this.label.element.setAttribute('aria-hidden', true);
                    }
                }
            );
        }
    }


    /**
     * @private
     */
    public hideSeriesLabelsFromATWhenShown(): void {
        this.addEvent(
            this.chart as any,
            'afterDrawSeriesLabels',
            function (): void {
                this.series.forEach(function (series: Series): void {
                    if (series.labelBySeries) {
                        series.labelBySeries.attr('aria-hidden', true as any);
                    }
                });
            }
        );
    }


    /**
     * Called on chart render. It is necessary to do this for render in case
     * markers change on zoom/pixel density.
     */
    public onChartRender(): void {
        const chart = this.chart;

        chart.series.forEach(function (
            series: Accessibility.SeriesComposition
        ): void {
            const shouldDescribeSeries = (series.options.accessibility &&
                series.options.accessibility.enabled) !== false &&
                series.visible;

            if (shouldDescribeSeries) {
                describeSeries(series);
            } else {
                hideSeriesFromAT(series);
            }
        });
    }


    /**
     * Get keyboard navigation handler for this component.
     * @private
     */
    public getKeyboardNavigation(): KeyboardNavigationHandler {
        return (this.keyboardNavigation as any).getKeyboardNavigationHandler();
    }


    /**
     * Remove traces
     * @private
     */
    public destroy(): void {
        (this as any).newDataAnnouncer.destroy();
        (this as any).keyboardNavigation.destroy();
    }

}


/* *
 *
 *  Class Prototype
 *
 * */

interface SeriesComponent {
    chart: SeriesKeyboardNavigation.ChartComposition;
}


/* *
 *
 *  Default Export
 *
 * */

export default SeriesComponent;
