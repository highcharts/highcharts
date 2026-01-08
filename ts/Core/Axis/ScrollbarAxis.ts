/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type Axis from './Axis';
import type ScrollbarType from '../../Stock/Scrollbar/Scrollbar';
import type ScrollbarOptions from '../../Stock/Scrollbar/ScrollbarOptions';

import H from '../Globals.js';
const { composed } = H;
import U from '../Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    pick,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module './AxisComposition' {
    interface AxisComposition {
        scrollbar?: ScrollbarType;
    }
}

declare module './AxisOptions' {
    interface AxisOptions {
        /**
         * An optional scrollbar to display on the X axis in response to
         * limiting the minimum and maximum of the axis values.
         *
         * In styled mode, all the presentational options for the scrollbar are
         * replaced by the classes `.highcharts-scrollbar-thumb`,
         * `.highcharts-scrollbar-arrow`, `.highcharts-scrollbar-button`,
         * `.highcharts-scrollbar-rifles` and `.highcharts-scrollbar-track`.
         *
         * @sample {highstock} stock/yaxis/heatmap-scrollbars/
         *         Heatmap with both scrollbars
         *
         * @since     4.2.6
         * @product   highstock
         * @apioption xAxis.scrollbar
         */
        scrollbar?: ScrollbarOptions;
    }
}

/** @internal */
interface ScrollbarAxis extends Axis {
    scrollbar?: ScrollbarType;
}

/* *
 *
 *  Composition
 *
 * */

/** @internal */
namespace ScrollbarAxis {

    /* *
     *
     *  Variables
     *
     * */

    let Scrollbar: typeof ScrollbarType;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Attaches to axis events to create scrollbars if enabled.
     *
     * @internal
     *
     * @param {Highcharts.Axis} AxisClass
     * Axis class to extend.
     *
     * @param {Highcharts.Scrollbar} ScrollbarClass
     * Scrollbar class to use.
     */
    export function compose(
        AxisClass: typeof Axis,
        ScrollbarClass: typeof ScrollbarType
    ): void {

        if (pushUnique(composed, 'Axis.Scrollbar')) {
            Scrollbar = ScrollbarClass;

            addEvent(AxisClass, 'afterGetOffset', onAxisAfterGetOffset);
            addEvent(AxisClass, 'afterInit', onAxisAfterInit);
            addEvent(AxisClass, 'afterRender', onAxisAfterRender);
        }

    }

    /** @internal */
    function getExtremes(
        axis: ScrollbarAxis
    ): Record<string, number> {
        const axisMin = pick(
            axis.options?.min,
            axis.min as any
        );
        const axisMax = pick(
            axis.options?.max,
            axis.max as any
        );
        return {
            axisMin,
            axisMax,
            scrollMin: defined(axis.dataMin) ?
                Math.min(
                    axisMin,
                    axis.min ?? Infinity,
                    axis.dataMin,
                    axis.threshold ?? Infinity
                ) : axisMin,
            scrollMax: axis.treeGrid?.adjustedMax ?? (
                defined(axis.dataMax) ?
                    Math.max(
                        axisMax,
                        axis.max ?? -Infinity,
                        axis.dataMax,
                        axis.threshold ?? -Infinity
                    ) :
                    axisMax
            )
        };
    }

    /**
     * Make space for a scrollbar.
     * @internal
     */
    function onAxisAfterGetOffset(
        this: Axis
    ): void {
        const axis = this as ScrollbarAxis,
            scrollbar = axis.scrollbar,
            opposite = scrollbar && !scrollbar.options.opposite,
            index = axis.horiz ? 2 : opposite ? 3 : 1;

        if (scrollbar) {
            // Reset scrollbars offsets
            axis.chart.scrollbarsOffsets = [0, 0];
            axis.chart.axisOffset[index] +=
                scrollbar.size + (scrollbar.options.margin || 0);
        }
    }

    /**
     * Wrap axis initialization and create scrollbar if enabled.
     * @internal
     */
    function onAxisAfterInit(
        this: Axis
    ): void {
        const axis = this as ScrollbarAxis;

        if (axis.options?.scrollbar?.enabled) {
            // Predefined options:
            axis.options.scrollbar.vertical = !axis.horiz;
            axis.options.startOnTick = axis.options.endOnTick = false;

            axis.scrollbar = new Scrollbar(
                axis.chart.renderer,
                axis.options.scrollbar,
                axis.chart
            );

            addEvent(axis.scrollbar, 'changed', function (
                e: ScrollbarType.ChangedEvent
            ): void {
                const {
                        axisMin,
                        axisMax,
                        scrollMin: unitedMin,
                        scrollMax: unitedMax
                    } = getExtremes(axis),
                    minPX = axis.toPixels(unitedMin),
                    maxPX = axis.toPixels(unitedMax),
                    rangePX = maxPX - minPX;

                let to: number,
                    from: number;

                // #12834, scroll when show/hide series, wrong extremes
                if (!defined(axisMin) || !defined(axisMax)) {
                    return;
                }

                if (
                    (axis.horiz && !axis.reversed) ||
                    (!axis.horiz && axis.reversed)
                ) {
                    to = Math.min(
                        unitedMax,
                        axis.toValue(minPX + rangePX * this.to)
                    );
                    from = Math.max(
                        unitedMin,
                        axis.toValue(minPX + rangePX * this.from)
                    );
                } else {
                    // Y-values in browser are reversed, but this also
                    // applies for reversed horizontal axis:
                    to = Math.min(
                        unitedMax,
                        axis.toValue(minPX + rangePX * (1 - this.from))
                    );
                    from = Math.max(
                        unitedMin,
                        axis.toValue(minPX + rangePX * (1 - this.to))
                    );
                }

                if (this.shouldUpdateExtremes(e.DOMType)) {
                    // #17977, set animation to undefined instead of true
                    const animate = e.DOMType === 'mousemove' ||
                        e.DOMType === 'touchmove' ? false : void 0;

                    axis.setExtremes(
                        correctFloat(from),
                        correctFloat(to),
                        true,
                        animate,
                        e
                    );
                } else {
                    // When live redraw is disabled, don't change extremes
                    // Only change the position of the scrollbar thumb
                    this.setRange(this.from, this.to);
                }
            });
        }
    }

    /**
     * Wrap rendering axis, and update scrollbar if one is created.
     * @internal
     */
    function onAxisAfterRender(
        this: Axis
    ): void {
        const axis = this as ScrollbarAxis,
            {
                scrollMin,
                scrollMax
            } = getExtremes(axis),
            scrollbar = axis.scrollbar,
            offset = (axis.axisTitleMargin || 0) + (axis.titleOffset || 0),
            scrollbarsOffsets = axis.chart.scrollbarsOffsets,
            axisMargin = axis.options.margin || 0;

        let offsetsIndex: number,
            from: number,
            to: number;

        if (scrollbar && scrollbarsOffsets) {
            if (axis.horiz) {

                // Reserve space for labels/title
                if (!axis.opposite) {
                    scrollbarsOffsets[1] += offset;
                }

                scrollbar.position(
                    axis.left,
                    (
                        axis.top +
                        axis.height +
                        2 +
                        scrollbarsOffsets[1] -
                        (axis.opposite ? axisMargin : 0)
                    ),
                    axis.width,
                    axis.height
                );

                // Next scrollbar should reserve space for margin (if set)
                if (!axis.opposite) {
                    scrollbarsOffsets[1] += axisMargin;
                }

                offsetsIndex = 1;
            } else {

                // Reserve space for labels/title
                if (axis.opposite) {
                    scrollbarsOffsets[0] += offset;
                }

                let xPosition;
                if (!scrollbar.options.opposite) {
                    xPosition = axis.opposite ? 0 : axisMargin;
                } else {
                    xPosition = axis.left +
                        axis.width +
                        2 +
                        scrollbarsOffsets[0] -
                        (axis.opposite ? 0 : axisMargin);
                }

                scrollbar.position(
                    xPosition,
                    axis.top,
                    axis.width,
                    axis.height
                );

                // Next scrollbar should reserve space for margin (if set)
                if (axis.opposite) {
                    scrollbarsOffsets[0] += axisMargin;
                }

                offsetsIndex = 0;
            }

            scrollbarsOffsets[offsetsIndex] += scrollbar.size +
                (scrollbar.options.margin || 0);

            if (
                isNaN(scrollMin) ||
                isNaN(scrollMax) ||
                !defined(axis.min) ||
                !defined(axis.max) ||
                (
                    defined(axis.dataMin) && // #23335
                    axis.dataMin === axis.dataMax // #10733
                )
            ) {
                // Default action: when data extremes are the same or there is
                // not extremes on the axis, but scrollbar exists, make it
                // full size

                scrollbar.setRange(0, 1);
            } else if (axis.min === axis.max) { // #20359
                // When the extremes are the same, set the scrollbar to a point
                // within the extremes range. Utilize pointRange to perform the
                // calculations. (#20359)

                const interval: number = axis.pointRange / (
                    axis.dataMax as number +
                    1
                );
                from = interval * axis.min;
                to = interval * (axis.max + 1);

                scrollbar.setRange(from, to);
            } else {
                from = (axis.toPixels(axis.min) - axis.toPixels(scrollMin)) /
                    (axis.toPixels(scrollMax) - axis.toPixels(scrollMin));
                to = (axis.toPixels(axis.max) - axis.toPixels(scrollMin)) /
                    (axis.toPixels(scrollMax) - axis.toPixels(scrollMin));

                if (
                    (axis.horiz && !axis.reversed) ||
                    (!axis.horiz && axis.reversed)
                ) {
                    scrollbar.setRange(from, to);
                } else {
                    // Inverse vertical axis
                    scrollbar.setRange(1 - to, 1 - from);
                }
            }
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ScrollbarAxis;
