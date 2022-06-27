/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type BoostTargetObject from './BoostTargetObject';

import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
const { doc } = H;
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    error
} = U;
import WGLRenderer from './WGLRenderer.js';

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike extends BoostTargetObject {}
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike extends BoostTargetObject {}
}

let mainCanvas: HTMLCanvasElement|undefined;

/**
 * Create a canvas + context and attach it to the target
 *
 * @private
 * @function createAndAttachRenderer
 *
 * @param {Highcharts.Chart} chart
 * the chart
 *
 * @param {Highcharts.Series} series
 * the series
 *
 * @return {Highcharts.BoostGLRenderer}
 * the canvas renderer
 */
function createAndAttachRenderer(
    chart: Chart,
    series: Series
): WGLRenderer {
    const targetGroup = chart.seriesGroup || series.group,
        alpha = 1;

    let width = chart.chartWidth,
        height = chart.chartHeight,
        target: BoostTargetObject = chart,
        foSupported: boolean = doc.implementation.hasFeature(
            'www.http://w3.org/TR/SVG11/feature#Extensibility',
            '1.1'
        );

    if (chart.boost && chart.boost.isChartSeriesBoosting()) {
        target = chart;
    } else {
        target = series;
    }

    // Support for foreignObject is flimsy as best.
    // IE does not support it, and Chrome has a bug which messes up
    // the canvas draw order.
    // As such, we force the Image fallback for now, but leaving the
    // actual Canvas path in-place in case this changes in the future.
    foSupported = false;

    if (!mainCanvas) {
        mainCanvas = doc.createElement('canvas');
    }

    if (!target.renderTarget) {
        target.canvas = mainCanvas;

        // Fall back to image tag if foreignObject isn't supported,
        // or if we're exporting.
        if (chart.renderer.forExport || !foSupported) {
            target.renderTarget = chart.renderer.image(
                '',
                0,
                0,
                width,
                height
            )
                .addClass('highcharts-boost-canvas')
                .add(targetGroup);

            target.boostClear = function (): void {
                (target.renderTarget as any).attr({
                    // Insert a blank pixel (#17182)
                    /* eslint-disable-next-line max-len*/
                    href: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                });
            };

            target.boostCopy = function (): void {
                target.boostResizeTarget();
                (target.renderTarget as any).attr({
                    href: (target.canvas as any).toDataURL('image/png')
                });
            };

        } else {
            target.renderTargetFo = chart.renderer
                .createElement('foreignObject')
                .add(targetGroup);

            target.renderTarget = doc.createElement('canvas') as any;
            target.renderTargetCtx =
                (target.renderTarget as any).getContext('2d');

            target.renderTargetFo.element.appendChild(
                target.renderTarget as any
            );

            target.boostClear = function (): void {
                (target.renderTarget as any).width =
                    (target.canvas as any).width;
                (target.renderTarget as any).height =
                    (target.canvas as any).height;
            };

            target.boostCopy = function (): void {
                (target.renderTarget as any).width =
                    (target.canvas as any).width;
                (target.renderTarget as any).height =
                    (target.canvas as any).height;

                (target.renderTargetCtx as any)
                    .drawImage(target.canvas as any, 0, 0);
            };
        }

        target.boostResizeTarget = function (): void {
            width = chart.chartWidth;
            height = chart.chartHeight;

            (target.renderTargetFo || (target.renderTarget as any))
                .attr({
                    x: 0,
                    y: 0,
                    width,
                    height
                })
                .css({
                    pointerEvents: 'none',
                    mixedBlendMode: 'normal',
                    opacity: alpha
                });

            if (target instanceof Chart) {
                (target.markerGroup as any).translate(
                    chart.plotLeft,
                    chart.plotTop
                );
            }
        };

        target.boostClipRect = chart.renderer.clipRect();

        (target.renderTargetFo || (target.renderTarget as any))
            .clip(target.boostClipRect);

        if (target instanceof Chart) {
            target.markerGroup = target.renderer.g().add(targetGroup);

            target.markerGroup.translate(series.xAxis.pos, series.yAxis.pos);
        }
    }

    (target.canvas as any).width = width;
    (target.canvas as any).height = height;

    if (chart.boost && target.boostClipRect) {
        target.boostClipRect.attr(chart.boost.getBoostClipRect(target));
    }

    target.boostResizeTarget();
    target.boostClear();

    if (!target.ogl) {
        target.ogl = new WGLRenderer((ogl): void => {
            if (ogl.settings.debug.timeBufferCopy) {
                console.time('buffer copy'); // eslint-disable-line no-console
            }

            target.boostCopy();

            if (ogl.settings.debug.timeBufferCopy) {
                console.timeEnd('buffer copy'); // eslint-disable-line no-console
            }
        });

        if (!target.ogl.init(target.canvas)) {
            // The OGL renderer couldn't be inited.
            // This likely means a shader error as we wouldn't get to this point
            // if there was no WebGL support.
            error('[highcharts boost] - unable to init WebGL renderer');
        }

        // target.ogl.clear();
        target.ogl.setOptions(chart.options.boost || {});

        if (target instanceof Chart) {
            target.ogl.allocateBuffer(chart);
        }
    }

    target.ogl.setSize(width, height);

    return target.ogl;
}

addEvent(Series, 'hide', function (): void {
    if (this.canvas && this.renderTarget) {
        if (this.ogl) {
            this.ogl.clear();
        }
        this.boostClear();
    }

});

export default createAndAttachRenderer;
