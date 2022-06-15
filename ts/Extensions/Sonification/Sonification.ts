/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Sonification module.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../Core/Chart/Chart';
import type Series from '../../Core/Series/Series';
import type Point from '../../Core/Series/Point';
import type { Options } from '../../Core/Options';
import D from '../../Core/DefaultOptions.js';
const { defaultOptions } = D;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    merge
} = U;
import H from '../../Core/Globals.js';
const {
    win
} = H;
import defaultSonificationOptions from './Options.js';

import SonificationTimeline from '../../Extensions/Sonification/SonificationTimeline.js';
import timelineFromChart from './TimelineFromChart.js';


declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        sonification?: Sonification;
        /** @requires modules/sonification */
        sonify: () => void;
        /** @requires modules/sonification */
        updateSonificationEnabled: () => void;
    }
}
declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        sonify: () => void;
    }
}
declare module '../../Core/Series/PointLike' {
    interface PointLike {
        sonify: () => void;
    }
}


/**
 * @private
 */
class Sonification {
    timeline?: SonificationTimeline;
    private audioContext?: AudioContext;
    private retryContextCounter: number = 0;
    private audioDestination?: AudioDestinationNode;

    constructor(private chart: Chart) {
        try {
            this.audioContext = new win.AudioContext();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.audioContext.suspend();
            this.audioDestination = this.audioContext.destination;
        } catch (e) { /* ignore */ }
    }


    setMasterVolume(vol: number): void {
        if (this.timeline) {
            this.timeline.setMasterVolume(vol);
        }
    }


    setAudioDestination(audioDestination: AudioDestinationNode): void {
        this.audioDestination = audioDestination;
        this.update();
    }


    destroy(): void {
        if (this.timeline) {
            this.timeline.cancel();
            delete this.timeline;
        }
        if (this.audioContext) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.audioContext.close();
        }
    }


    update(): void {
        if (!this.ready(this.update.bind(this))) {
            return;
        }
        if (this.timeline) {
            this.timeline.cancel();
        }
        if (this.audioContext && this.audioDestination) {
            this.timeline = timelineFromChart(
                this.audioContext, this.audioDestination, this.chart
            );
        }
    }


    sonifyChart(): void {
        if (!this.ready(this.sonifyChart.bind(this))) {
            return;
        }

        if (this.timeline) {
            this.timeline.play();
        }
    }


    sonifySeries(series: Series): void {
        if (!this.ready(this.sonifySeries.bind(this, series))) {
            return;
        }

        if (this.timeline) {
            this.timeline.play((e): boolean =>
                !!e.relatedPoint && e.relatedPoint.series === series);
        }
    }


    // Note: We may want to do this more efficiently in the future.
    sonifyPoint(point: Point): void {
        if (!this.ready(this.sonifyPoint.bind(this, point))) {
            return;
        }

        if (this.timeline) {
            this.timeline.play((e): boolean => e.relatedPoint === point);
        }
    }


    // Only continue if sonification enabled. If audioContext is
    // suspended, retry up to 5 times.
    private ready(callback: () => void): boolean {
        if (
            !this.audioContext ||
            !this.audioDestination ||
            this.chart.options.sonification &&
            this.chart.options.sonification.enabled === false
        ) {
            return false;
        }
        if (this.audioContext.state === 'suspended') {
            if (this.retryContextCounter++ < 5) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.audioContext.resume().then(callback);
            }
            return false;
        }
        return true;
    }
}


namespace Sonification {

    const composedClasses: Array<Function> = [];

    /**
     * Update sonification object on chart.
     * @private
     */
    function updateSonificationEnabled(this: Chart): void {
        const sonification = this.sonification,
            sOptions = this.options && this.options.sonification;

        if (sOptions && sOptions.enabled) {
            if (sonification) {
                sonification.update();
            } else {
                this.sonification = new Sonification(this);
                this.sonification.update();
            }
        } else if (sonification) {
            sonification.destroy();
            delete this.sonification;
        }
    }


    /**
     * Destroy with chart.
     * @private
     */
    function chartOnDestroy(this: Chart): void {
        if (this && this.sonification) {
            this.sonification.destroy();
        }
    }


    /**
     * Update on render
     * @private
     */
    function chartOnRender(this: Chart): void {
        if (this.updateSonificationEnabled) {
            this.updateSonificationEnabled();
        }
    }


    /**
     * Update
     * @private
     */
    function chartOnUpdate(this: Chart, e: { options: Options }): void {
        const newOptions = e.options.sonification;
        if (newOptions) {
            merge(true, this.options.sonification, newOptions);
            chartOnRender.call(this);
        }
    }


    /**
     * Compose
     * @private
     */
    export function compose(
        ChartClass: typeof Chart,
        SeriesClass: typeof Series,
        PointClass: typeof Point
    ): void {

        // Extend chart
        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);
            extend(ChartClass.prototype, {
                updateSonificationEnabled,
                sonify: function (): void {
                    if (this.sonification) {
                        this.sonification.sonifyChart();
                    }
                }
            });
            addEvent(ChartClass, 'destroy', chartOnDestroy);
            addEvent(ChartClass, 'render', chartOnRender);
            addEvent(ChartClass, 'update', chartOnUpdate);
        }

        // Extend series
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);
            SeriesClass.prototype.sonify = function (): void {
                if (this.chart.sonification) {
                    this.chart.sonification.sonifySeries(this);
                }
            };
        }

        // Extend points
        if (composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);
            PointClass.prototype.sonify = function (): void {
                if (this.series.chart.sonification) {
                    this.series.chart.sonification.sonifyPoint(this);
                }
            };
        }
    }
}


// Add default options
merge(
    true,
    defaultOptions,
    defaultSonificationOptions
);


/* *
 *
 *  Default Export
 *
 * */

export default Sonification;
