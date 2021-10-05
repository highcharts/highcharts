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

import H from '../../../Core/Globals.js';
import Series from '../../../Core/Series/Series.js';
import Tooltip from '../../../Core/Tooltip.js';
import U from '../../../Core/Utilities.js';
const { extend } = U;

import AccessibilityComponent from '../../AccessibilityComponent.js';
import SeriesKeyboardNavigation from './SeriesKeyboardNavigation.js';
import NewDataAnnouncer from './NewDataAnnouncer.js';
import ForcedMarkers from './ForcedMarkers.js';

import ChartUtilities from '../../Utils/ChartUtilities.js';
const hideSeriesFromAT = ChartUtilities.hideSeriesFromAT;

import SeriesDescriber from './SeriesDescriber.js';
const describeSeries = SeriesDescriber.describeSeries;


/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class SeriesComponent extends AccessibilityComponent {
            public constructor ();
            public keyboardNavigation?: SeriesKeyboardNavigation;
            public newDataAnnouncer?: NewDataAnnouncer;
            public hideSeriesLabelsFromATWhenShown(): void;
            public hideTooltipFromATWhenShown(): void;
            public getKeyboardNavigation(): KeyboardNavigationHandler;
            public init(): void;
            public onChartRender(): void;
        }
        let SeriesAccessibilityDescriber: typeof SeriesDescriber;
    }
}

// Expose functionality to users
H.SeriesAccessibilityDescriber = SeriesDescriber;

// Handle forcing markers
ForcedMarkers.compose(Series);


/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The SeriesComponent class
 *
 * @private
 * @class
 * @name Highcharts.SeriesComponent
 */
const SeriesComponent: typeof Highcharts.SeriesComponent =
    function (): void {} as any;
SeriesComponent.prototype = new (AccessibilityComponent as any)();
extend(SeriesComponent.prototype, /** @lends Highcharts.SeriesComponent */ {

    /**
     * Init the component.
     */
    init: function (this: Highcharts.SeriesComponent): void {
        this.newDataAnnouncer = new NewDataAnnouncer(this.chart);
        (this.newDataAnnouncer as any).init();

        this.keyboardNavigation = new (SeriesKeyboardNavigation as any)(
            this.chart, this.keyCodes
        );
        (this.keyboardNavigation as any).init();

        this.hideTooltipFromATWhenShown();
        this.hideSeriesLabelsFromATWhenShown();
    },


    /**
     * @private
     */
    hideTooltipFromATWhenShown: function (
        this: Highcharts.SeriesComponent
    ): void {
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
    },


    /**
     * @private
     */
    hideSeriesLabelsFromATWhenShown: function (
        this: Highcharts.SeriesComponent
    ): void {
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
    },


    /**
     * Called on chart render. It is necessary to do this for render in case
     * markers change on zoom/pixel density.
     */
    onChartRender: function (this: Highcharts.SeriesComponent): void {
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
    },


    /**
     * Get keyboard navigation handler for this component.
     * @return {Highcharts.KeyboardNavigationHandler}
     */
    getKeyboardNavigation: function (
        this: Highcharts.SeriesComponent
    ): Highcharts.KeyboardNavigationHandler {
        return (this.keyboardNavigation as any).getKeyboardNavigationHandler();
    },


    /**
     * Remove traces
     */
    destroy: function (this: Highcharts.SeriesComponent): void {
        (this as any).newDataAnnouncer.destroy();
        (this as any).keyboardNavigation.destroy();
    }
});

/* *
 *
 *  Default Export
 *
 * */

export default SeriesComponent;
