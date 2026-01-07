/* *
 *
 *  (c) 2024-2026 Highsoft AS
 *  Author: Hubert Kozik
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type Point from '../../Core/Series/Point';
import type Tooltip from '../../Core/Tooltip';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
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
interface Zooming {
    x: number;
    y: number;
    height: number;
    width: number;
    zoomX: number;
    zoomY: number;
    scale: number,
    panX: number;
    panY: number;
}

declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        dataLabelsParentGroups?: Array<SVGElement>;
        zooming?: Zooming
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
            reset,
            from = {},
            to = {}
        } = params,
        type = chart.zooming.type;

    if (type !== 'xy') {
        return;
    }

    if (
        trigger === 'mousewheel' ||
        trigger === 'pan' ||
        selection ||
        reset
    ) {
        chart.series.forEach((series): void => {
            if (!series.isCartesian && series.options.zoomEnabled !== false) {
                series.isDirty = true;
                chart.isDirtyBox = true;
                params.hasZoomed = true;

                const {
                    plotWidth = 0,
                    plotHeight = 0
                } = chart;

                if (trigger === 'pan' && series.zooming) {
                    series.zooming.panX -= (to.x || 0) / plotWidth;
                    series.zooming.panY -= (to.y || 0) / plotHeight;
                } else {
                    if (Object.keys(from).length) {
                        const {
                                width: toWidth = 1,
                                height: toHeight = 1
                            } = to,
                            currentScale =
                                Math.abs(series.group?.scaleX || 1);

                        let {
                                x: zoomX = 0,
                                y: zoomY = 0,
                                width: fromWidth = 1,
                                height: fromHeight = 1
                            } = from,
                            x = zoomX,
                            y = zoomY,
                            scale = series.zooming?.scale ||
                                series.group?.scaleX ||
                                1,
                            width = (
                                series.zooming?.width || 1
                            ) * plotWidth,
                            height = (
                                series.zooming?.height || 1
                            ) * plotHeight;

                        if (Object.keys(to).length) {
                            width = width * (fromWidth / toWidth);
                            height = height * (fromWidth / toHeight);

                            zoomX -= chart.plotLeft;
                            zoomY -= chart.plotTop;

                            x = zoomX - width / 2;
                            y = zoomY - height / 2;

                            scale =
                                Math.min(
                                    plotWidth / width,
                                    plotHeight / height
                                );

                            // Uncomment this block to visualize the zooming
                            // bounding box and the point, which is normalized
                            // position to zoom-in
                            // chart.renderer.circle(
                            //    zoomX + chart.plotLeft,
                            //    zoomY + chart.plotTop,
                            //    2
                            // ).attr({ stroke: 'blue' }).add();
                            // chart.renderer.rect(
                            //    x + chart.plotLeft,
                            //    y + chart.plotTop,
                            //    width,
                            //    height,
                            //    0,
                            //    2
                            // ).attr({ stroke: 'red' }).add();
                            // chart.renderer.circle(
                            //    chart.plotLeft + x + width / 2,
                            //    chart.plotTop + y + height / 2,
                            //    2
                            // ).attr({ stroke: 'blue' }).add();
                        } else {
                            fromWidth /= currentScale;
                            fromHeight /= currentScale;

                            scale = Math.min(
                                plotWidth / fromWidth,
                                plotHeight / fromHeight
                            );

                            let prevX = 0,
                                prevY = 0;

                            if (series.zooming) {
                                prevX = series.zooming.x * plotWidth;
                                prevY = series.zooming.y * plotHeight;
                            }

                            // Calculate the normalized coefficients of the
                            // rectangle center position
                            const factorX = (zoomX - chart.plotLeft) /
                                    ((plotWidth - fromWidth * currentScale) ||
                                        1),
                                factorY = (zoomY - chart.plotTop) /
                                    ((plotHeight - fromHeight * currentScale) ||
                                        1);

                            width = fromWidth;
                            height = fromHeight;

                            zoomX -= chart.plotLeft;
                            zoomY -= chart.plotTop;
                            zoomX /= currentScale;
                            zoomY /= currentScale;
                            zoomX += prevX + (fromWidth) * factorX;
                            zoomY += prevY + (fromHeight) * factorY;

                            x -= chart.plotLeft;
                            y -= chart.plotTop;
                            x /= currentScale;
                            y /= currentScale;
                            x += prevX;
                            y += prevY;

                            // Uncomment this block to visualize the zooming
                            // bounding box and the point, which is normalized
                            // position to zoom-in
                            // chart.renderer.rect(
                            //     x + chart.plotLeft,
                            //     y + chart.plotTop,
                            //     fromWidth,
                            //     fromHeight,
                            //     0,
                            //     2
                            // ).attr({ stroke: 'red' }).add();
                            // chart.renderer.circle(
                            //     zoomX + chart.plotLeft,
                            //     zoomY + chart.plotTop,
                            //     2
                            // ).attr({ stroke: 'blue' }).add();
                        }

                        series.zooming = {
                            x: x / plotWidth,
                            y: y / plotHeight,
                            zoomX: zoomX / plotWidth,
                            zoomY: zoomY / plotHeight,
                            width: width / plotWidth,
                            height: height / plotHeight,
                            scale,
                            panX: 0,
                            panY: 0
                        };

                        if (scale < 1) {
                            delete series.zooming;
                        }
                    } else {
                        delete series.zooming;
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
    const { chart, group, zooming } = this;

    let {
            plotSizeX = 0,
            plotSizeY = 0
        } = chart,
        { scale, translateX, translateY, name } = e,
        left = 0,
        top = 0;

    const initLeft = translateX,
        initTop = translateY;

    if (chart.inverted) {
        [plotSizeX, plotSizeY] = [plotSizeY, plotSizeX];
    }

    if (group && zooming) {
        scale = zooming.scale;

        left = zooming.zoomX * plotSizeX *
            (scale - (Math.abs(group.scaleX || 1)));
        top = zooming.zoomY * plotSizeY *
            (scale - (Math.abs(group.scaleY || 1)));

        if (name === 'series') {
            zooming.x = Math.max(
                0,
                Math.min(1 - zooming.width, zooming.x + (zooming.panX / scale))
            );
            left += zooming.panX * plotSizeX;
            zooming.panX = 0;
            zooming.y = Math.max(
                0,
                Math.min(1 - zooming.height, zooming.y + (zooming.panY / scale))
            );
            top += zooming.panY * plotSizeY;
            zooming.panY = 0;
        }

        translateX = (group.translateX || initLeft) - left;
        translateY = (group.translateY || initTop) - top;

        // Do not allow to move outside the chart
        // Vertical lock
        if (translateY > initTop) {
            translateY = initTop;
        } else if (
            (group.translateY || initTop) - top <
                (plotSizeY * (1 - scale) + initTop)
        ) {
            translateY = (plotSizeY * (1 - scale)) + initTop;
        }
        // Horizontal lock
        if (translateX > initLeft) {
            translateX = initLeft;
        } else if (
            translateX < (plotSizeX * (1 - scale) + initLeft)
        ) {
            translateX = (plotSizeX * (1 - scale)) + initLeft;
        }

        e.scale = scale;
        e.translateX = translateX;
        e.translateY = translateY;
    }
}

/**
 * Clip series and data labels group with zoom rect
 * @private
 */
function onAfterDrawChartBox(this: Chart): void {
    const chart = this;

    let clipRect: SVGElement | undefined;

    if (chart.series.find((series): boolean => !!series.zooming)) {
        chart.zoomClipRect ||= chart.renderer.clipRect();

        chart.zoomClipRect.attr({
            x: chart.plotLeft,
            y: chart.plotTop,
            width: chart.inverted ? chart.clipBox.height :
                chart.clipBox.width,
            height: chart.inverted ? chart.clipBox.width :
                chart.clipBox.height
        });

        clipRect = chart.zoomClipRect;
    }

    chart.seriesGroup?.clip(clipRect);
    chart.series.forEach((series): void => {
        series.dataLabelsParentGroups?.forEach((dataLabelsGroup): void => {
            dataLabelsGroup.clip(clipRect);
        });
    });
}

/**
 * Adjust tooltip position to scaled series group
 * @private
 */
function onGetAnchor(params: {
    point: Point,
    ret: number[]
}): void {
    if (
        params.point.series &&
        !params.point.series.isCartesian &&
        params.point.series.group &&
        params.point.series.zooming
    ) {
        const chart = params.point.series.chart,
            scale = params.point.series.zooming.scale,
            left = (params.point.series.group.translateX || 0),
            top = (params.point.series.group.translateY || 0);
        params.ret[0] = (params.ret[0] * scale) + left - chart.plotLeft;
        params.ret[1] = (params.ret[1] * scale) + top - chart.plotTop;
    }
}

/**
 * Adjust series group props
 * @private
 */
function onAfterSetChartSize(
    this: Chart,
    params: ({ skipAxes: boolean })
): void {
    if (params.skipAxes) {
        this.series.forEach((series): void => {
            if (series.group && series.zooming) {
                series.group.attr({
                    translateX: 0,
                    translateY: 0,
                    scaleX: 1,
                    scaleY: 1
                });
            }
        });
    }
}

/**
 * Create data labels parent group for clipping purposes after zoom-in
 * @private
 */
function onInitDataLabelsGroup(
    this: Series,
    { index, zIndex }: { index: number, zIndex: number }
): void {
    if (this.hasDataLabels?.()) {
        this.dataLabelsParentGroups ||= [];
        this.dataLabelsParentGroups[index] ||= this.chart.renderer.g()
            .attr({ zIndex })
            .add();
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
        SeriesClass: typeof Series,
        TooltipClass: typeof Tooltip
    ): void {
        if (pushUnique(composed, 'NonCartesianSeriesZoom')) {
            addEvent(ChartClass, 'afterDrawChartBox', onAfterDrawChartBox);
            addEvent(ChartClass, 'transform', onTransform);
            addEvent(ChartClass, 'afterSetChartSize', onAfterSetChartSize);
            addEvent(SeriesClass, 'getPlotBox', onGetPlotBox);
            addEvent(SeriesClass, 'initDataLabelsGroup', onInitDataLabelsGroup);
            addEvent(TooltipClass, 'getAnchor', onGetAnchor);
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

/**
 * Whether to zoom non-cartesian series. If `chart.zooming` is set, the option
 * allows to disable zooming on an individual non-cartesian series. By default
 * zooming is enabled for all series.
 *
 * Note: This option works only for non-cartesian series.
 *
 * @type      {boolean}
 * @since 12.3.0
 * @apioption plotOptions.series.zoomEnabled
 */

/**
 * Whether to zoom non-cartesian series. If `chart.zooming` is set, the option
 * allows to disable zooming on an individual non-cartesian series. By default
 * zooming is enabled for all series.
 *
 * Note: This option works only for non-cartesian series.
 *
 * @type      {boolean}
 * @since 12.3.0
 * @apioption series.zoomEnabled
 */

(''); // Keeps doclets above in JS file
