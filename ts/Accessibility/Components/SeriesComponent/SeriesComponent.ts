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
import type KeyboardNavigationHandler from '../../KeyboardNavigationHandler';

import AccessibilityComponent from '../../AccessibilityComponent.js';
import ChartUtilities from '../../Utils/ChartUtilities.js';
const { hideSeriesFromAT } = ChartUtilities;
import ForcedMarkers from './ForcedMarkers.js';
import NewDataAnnouncer from './NewDataAnnouncer.js';
import Series from '../../../Core/Series/Series.js';
import SeriesDescriber from './SeriesDescriber.js';
const { describeSeries } = SeriesDescriber;
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
        SeriesClass: typeof Series
    ): void {
        // Handle forcing markers
        ForcedMarkers.compose(SeriesClass);
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

        this.addEvent(Tooltip, 'refresh', function (): void {
            if (
                this.chart === component.chart &&
                this.label &&
                this.label.element
            ) {
                this.label.element.setAttribute('aria-hidden', true);
            }
        });
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
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    public getKeyboardNavigation(): KeyboardNavigationHandler {
        return (this.keyboardNavigation as any).getKeyboardNavigationHandler();
    }


    /**
     * Remove traces
     */
    public destroy(): void {
        (this as any).newDataAnnouncer.destroy();
        (this as any).keyboardNavigation.destroy();
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SeriesComponent;
