/* *
 *
 *  (c) 2024 Hubert Kozik
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

import type Chart from '../../Core/Chart/Chart';
import type Series from '../../Core/Series/Series';
import H from '../../Core/Globals.js';
const { composed } = H;

import U from '../../Core/Utilities.js';
const {
    addEvent,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */
interface ZoomBox {
    height: number;
    width: number;
    x: number;
    y: number;
    scale: number,
    panX: number,
    panY: number
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        zoomBox?: ZoomBox
    }
}

/* /* *
 *
 *  Functions
 *
 * */

/**
 * Logic for non-cartesian series zooming and panning
 * @private
 */
function onTransform(
    this: Chart,
    params: Chart.ChartTransformParams
): void {
    const chart = this,
        {
            trigger,
            selection,
            from = {},
            to = {}
        } = params;

    if (
        trigger === 'mousewheel' ||
        trigger === 'zoom' ||
        trigger === 'pan' ||
        selection
    ) {
        chart.series.forEach((series): void => {
            if (!series.isCartesian) {
                series.isDirty = true;
                chart.isDirtyBox = true;
                params.hasZoomed = true;
                if (trigger === 'pan' && series.zoomBox) {
                    series.zoomBox.panX = to.x || 0;
                    series.zoomBox.panY = to.y || 0;
                } else {
                    if (Object.keys(from).length) {
                        const {
                            width: toWidth = 1,
                            height: toHeight = 1
                        } = to;

                        let {
                                x = 0,
                                y = 0,
                                width: fromWidth = 1,
                                height: fromHeight = 1
                            } = from,
                            scale = series.zoomBox?.scale || 1,
                            width = (
                                series.zoomBox?.width ||
                                chart.plotSizeX ||
                                0
                            ),
                            height = (
                                series.zoomBox?.height ||
                                chart.plotSizeY ||
                                0
                            );

                        if (Object.keys(to).length) {
                            width = width * (fromWidth / toWidth);
                            height = height * (fromWidth / toHeight);

                            scale =
                                Math.min(
                                    (chart.plotSizeX || 0) / width,
                                    (chart.plotSizeY || 0) / height
                                );
                        } else {
                            scale = Math.min(
                                (chart.plotSizeX || 0) / fromWidth,
                                (chart.plotSizeY || 0) / fromHeight
                            );
                            width = fromWidth;
                            height = fromHeight;
                            x = x + (width / 2);
                            y = y + (height / 2);
                        }

                        series.zoomBox = {
                            x, y, width, height, scale, panX: 0, panY: 0
                        };

                        if (scale < 1) {
                            delete series.zoomBox;
                        }
                    } else {
                        delete series.zoomBox;
                    }
                }
            }
        });
    }
}

/**
 * Apply zoom into series plot box
 * @private
 */
function onGetPlotBox(
    this: Series,
    e: {
        scale: number,
        translateX: number,
        translateY: number,
        name?: string
    }
): void {
    const { chart, group, zoomBox } = this,
        {
            plotSizeX = 0,
            plotSizeY = 0
        } = chart;
    let { scale, translateX, translateY, name } = e,
        left = 0,
        top = 0,
        initLeft = translateX,
        initTop = translateY;

    if (group && zoomBox) {
        scale = zoomBox.scale;
        left = zoomBox.x * (scale - (group.scaleX || 1)) -
            (name === 'series' ? zoomBox.panX : 0);
        top = zoomBox.y * (scale - (group.scaleY || 1)) -
            (name === 'series' ? zoomBox.panY : 0);

        initLeft = group.translateX || initLeft;
        initTop = group.translateY || initTop;

        translateX = initLeft - left;
        translateY = initTop - top;

        // Do not allow to move outside the chart
        // Vertical lock
        if (translateY > chart.plotTop) {
            translateY = initTop;
        } else if (
            initTop - top < (plotSizeY * (1 - scale) + chart.plotTop)
        ) {
            translateY = (plotSizeY * (1 - scale)) + chart.plotTop;
        }
        // Horizontal lock
        if (translateX > chart.plotLeft) {
            translateX = initLeft;
        } else if (
            translateX < (plotSizeX * (1 - scale) + chart.plotLeft)
        ) {
            translateX = (plotSizeX * (1 - scale)) + chart.plotLeft;
        }

        e.scale = scale;
        e.translateX = translateX;
        e.translateY = translateY;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * The series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.tiledwebmap
 *
 * @augments Highcharts.Series
 */
class NonCartesianSeriesZoom {

    /* *
     *
     *  Static Functions
     *
     * */
    public static compose(
        ChartClass: typeof Chart,
        SeriesClass: typeof Series
    ): void {
        if (pushUnique(composed, 'NonCartesianSeriesZoom')) {
            addEvent(ChartClass, 'transform', onTransform);
            addEvent(SeriesClass, 'getPlotBox', onGetPlotBox);
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default NonCartesianSeriesZoom;

/* *
 *
 *  API Options
 *
 * */


(''); // Keeps doclets above in JS file
