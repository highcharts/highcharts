/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../Axis';
import type { DeepPartial } from '../../../Shared/Types';
import type PlotBandOptions from './PlotBandOptions';
import type PlotLineOptions from './PlotLineOptions';
import type PlotLineOrBand from './PlotLineOrBand';
import type SVGElement from '../../Renderer/SVG/SVGElement';
import type SVGPath from '../../Renderer/SVG/SVGPath';

import {
    addEvent,
    extend,
    isNumber,
    splat
} from '../../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../AxisComposition' {
    interface AxisComposition {
        /**
         * Clip rectangle keeping plot bands within the axis (#6257).
         * @internal
         */
        plotBandClip?: SVGElement;
    }
}

declare module '../AxisOptions' {
    interface AxisOptions {
        plotBands?: Array<PlotBandOptions>;
        plotLines?: Array<PlotLineOptions>;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace PlotLineOrBandAxis {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Axis {

        /**
         * Add a plot band after render time.
         *
         * @sample highcharts/members/axis-addplotband/
         *         Toggle the plot band from a button
         *
         * @function Highcharts.Axis#addPlotBand
         *
         * @param {Highcharts.AxisPlotBandsOptions} options
         * A configuration object for the plot band, as defined in
         * [xAxis.plotBands](https://api.highcharts.com/highcharts/xAxis.plotBands).
         *
         * @return {Highcharts.PlotLineOrBand|undefined}
         * The added plot band, or `undefined` if the options are not valid.
         */
        addPlotBand(
            options: PlotBandOptions
        ): (PlotLineOrBand|undefined);

        /**
         * Add a plot line after render time.
         *
         * @sample highcharts/members/axis-addplotline/
         *         Toggle the plot line from a button
         *
         * @function Highcharts.Axis#addPlotLine
         *
         * @param {Highcharts.AxisPlotLinesOptions} options
         * A configuration object for the plot line, as defined in
         * [xAxis.plotLines](https://api.highcharts.com/highcharts/xAxis.plotLines).
         *
         * @return {Highcharts.PlotLineOrBand|undefined}
         * The added plot line, or `undefined` if the options are not valid.
         */
        addPlotLine(
            options: PlotLineOptions
        ): (PlotLineOrBand|undefined);

        /**
         * Internal function to create the SVG path definition for a plot band.
         *
         * @function Highcharts.Axis#getPlotBandPath
         *
         * @param {number} from
         * The axis value to start from.
         *
         * @param {number} to
         * The axis value to end on.
         *
         * @param {Highcharts.AxisPlotBandsOptions|Highcharts.AxisPlotLinesOptions} options
         * The plotBand or plotLine configuration object.
         *
         * @return {Highcharts.SVGPathArray}
         * The SVG path definition in array form.
         */
        getPlotBandPath(
            from: number,
            to: number,
            options?: (PlotBandOptions|PlotLineOptions)
        ): SVGPath;

        /**
         * Remove a plot band by its id.
         *
         * @sample highcharts/members/axis-removeplotband/
         *         Remove plot band by id
         * @sample highcharts/members/axis-addplotband/
         *         Toggle the plot band from a button
         *
         * @function Highcharts.Axis#removePlotBand
         *
         * @param {string} id
         *        The plot band's `id` as given in the original configuration
         *        object or in the `addPlotBand` option.
         */
        removePlotBand(id: string): void;

        /**
         * Remove a plot band or plot line from the chart by id. Called
         * internally from `removePlotBand` and `removePlotLine`.
         * @internal
         * @function Highcharts.Axis#removePlotBandOrLine
         */
        removePlotBandOrLine(id: string): void;

        /**
         * Remove a plot line by its id.
         *
         * @sample highcharts/xaxis/plotlines-id/
         *         Remove plot line by id
         * @sample highcharts/members/axis-addplotline/
         *         Toggle the plot line from a button
         *
         * @function Highcharts.Axis#removePlotLine
         *
         * @param {string} id
         *        The plot line's `id` as given in the original configuration
         *        object or in the `addPlotLine` option.
         */
        removePlotLine(id: string): void;

    }

    /* *
     *
     *  Variables
     *
     * */

    let PlotLineOrBandClass: typeof PlotLineOrBand;

    /* *
     *
     *  Functions
     *
     * */

    const getAdderFunction = (coll: 'plotLines'|'plotBands') =>
        /**
         * Add a plot band or plot line after render time. Called from
         * addPlotBand and addPlotLine internally.
         *
         * @internal
         * @function Highcharts.Axis#addPlotBandOrLine
         * @param {Highcharts.AxisPlotBandsOptions|Highcharts.AxisPlotLinesOptions} options
         *        The `plotBand` or `plotLine` configuration object.
         */
        function addPlotLineOrBand<T extends PlotBandOptions|PlotLineOptions>(
            this: Composition,
            options: T
        ): PlotLineOrBand {

            const plotItem = new PlotLineOrBandClass(this, options, coll);

            if (this.visible) {
                plotItem.render();
            }

            this.options[coll] ||= this.userOptions[coll] = [];
            this.options[coll].push(options);

            this[coll].push(plotItem);

            return plotItem;
        };

    /** @internal */
    export function compose<T extends typeof Axis>(
        PlotLineOrBandType: typeof PlotLineOrBand,
        AxisClass: T
    ): (T&typeof Composition) {
        const axisProto = AxisClass.prototype as Composition;

        if (!axisProto.addPlotBand) {
            PlotLineOrBandClass = PlotLineOrBandType;

            extend(axisProto, {
                addPlotBand: getAdderFunction('plotBands'),
                addPlotLine: getAdderFunction('plotLines'),
                getPlotBandPath,
                removePlotBand: removePlotBandOrLine,
                removePlotLine: removePlotBandOrLine
            });

            addEvent(AxisClass, 'afterInit', function (): void {

                // First time only, not on Axis.update()
                if (!this.plotBands) {

                    // Placeholder for plotlines and plotbands groups
                    this.plotLinesAndBandsGroups = {};

                    // Plot lines and bands from options
                    for (const coll of ['plotBands', 'plotLines'] as const) {
                        this[coll] = [];
                        for (
                            const pOptions of splat(this.options[coll] || [])
                        ) {
                            this[coll].push(new PlotLineOrBandClass(
                                this as Composition,
                                pOptions,
                                coll
                            ));
                        }
                    }
                }
            });

            // Update plot bands and lines one to one
            addEvent(AxisClass, 'update', function ({
                options
            }: { options: DeepPartial<Axis['options']> }): void {

                for (const coll of ['plotBands', 'plotLines'] as const) {

                    // Check if we have new options to process, otherwise do
                    // nothing with existing plot lines and bands
                    if (options[coll]) {

                        const plotItems = this[coll];
                        splat(options[coll]).forEach(
                            (pOptions = {}, i): void => {
                                // Match by id
                                let pItem: PlotLineOrBand | undefined;
                                if (pOptions?.id) {
                                    pItem = plotItems.find(
                                        (p): boolean => p.id === pOptions.id
                                    );
                                }

                                // Match by index
                                pItem ||= plotItems[i];

                                // Update
                                if (pItem) {
                                    pItem.update(pOptions, false);
                                    options[coll]![i] = pItem.options;

                                // Add
                                } else {
                                    pItem = (this as Composition)[
                                        coll === 'plotBands' ?
                                            'addPlotBand' :
                                            'addPlotLine'
                                    ](pOptions as PlotBandOptions);
                                }
                                pItem!.isActive = true;
                            }
                        );

                        // Remove inactive items from end to start
                        let i = plotItems.length;
                        while (i--) {
                            if (!plotItems[i].isActive) {
                                plotItems[i].remove();
                            } else {
                                delete plotItems[i].isActive;
                            }
                        }
                    }
                }
            });
        }

        return AxisClass as (T&typeof Composition);
    }

    /**
     * Internal function to create the SVG path definition for a plot band.
     *
     * @function Highcharts.Axis#getPlotBandPath
     *
     * @param {number} from
     * The axis value to start from.
     *
     * @param {number} to
     * The axis value to end on.
     *
     * @param {Highcharts.AxisPlotBandsOptions|Highcharts.AxisPlotLinesOptions} options
     * The plotBand or plotLine configuration object.
     *
     * @return {Highcharts.SVGPathArray}
     * The SVG path definition in array form.
     */
    function getPlotBandPath(
        this: Composition,
        from: number,
        to: number,
        options?: (PlotBandOptions|PlotLineOptions)
    ): SVGPath {
        options = options || this.options;
        // Keep real coordinates so a gradient spans the full band. The band is
        // clipped to the axis in `PlotLineOrBand.render` (#6257).
        const toPath = this.getPlotLinePath({
                value: to,
                force: 'pass',
                acrossPanes: options.acrossPanes
            }),
            result = [] as SVGPath,
            horiz = this.horiz,
            outside =
                !isNumber(this.min) ||
                !isNumber(this.max) ||
                (from < this.min && to < this.min) ||
                (from > this.max && to > this.max),
            path = this.getPlotLinePath({
                value: from,
                force: 'pass',
                acrossPanes: options.acrossPanes
            });

        if (path && toPath) {

            // The band isn't fitted to the axis, so flag the ones that extend
            // outside it for clipping (#6257)
            if (isNumber(this.min) && isNumber(this.max)) {
                result.isOverflowing = Math.min(from, to) < this.min ||
                    Math.max(from, to) > this.max;
            }

            // Flat paths don't need labels (#3836), neither do bands clipped
            // away entirely (#6257)
            result.isFlat = outside;

            // Go over each subpath - for panes in Highcharts Stock
            for (let i = 0; i < path.length; i += 2) {
                const pathStart = path[i],
                    pathEnd = path[i + 1],
                    toPathStart = toPath[i],
                    toPathEnd = toPath[i + 1];

                // Type checking all affected path segments. Consider
                // something smarter.
                if (
                    (pathStart[0] === 'M' || pathStart[0] === 'L') &&
                    (pathEnd[0] === 'M' || pathEnd[0] === 'L') &&
                    (toPathStart[0] === 'M' || toPathStart[0] === 'L') &&
                    (toPathEnd[0] === 'M' || toPathEnd[0] === 'L')
                ) {
                    // Add 1 pixel when coordinates are the same, also when
                    // inverted or on the yAxis (#4964)
                    if (horiz && toPathStart[1] === pathStart[1]) {
                        toPathStart[1]++;
                        toPathEnd[1]++;
                    } else if (!horiz && toPathStart[2] === pathStart[2]) {
                        toPathStart[2]++;
                        toPathEnd[2]++;
                    }

                    result.push(
                        ['M', pathStart[1], pathStart[2]],
                        ['L', pathEnd[1], pathEnd[2]],
                        ['L', toPathEnd[1], toPathEnd[2]],
                        ['L', toPathStart[1], toPathStart[2]],
                        ['Z']
                    );
                }
            }

        }

        return result;
    }

    /**
     * Remove a plot band or plot line from the chart by id. Called
     * internally from `removePlotBand` and `removePlotLine`.
     * @internal
     * @function Highcharts.Axis#removePlotBandOrLine
     */
    function removePlotBandOrLine(
        this: Composition,
        id: string
    ): void {
        [...this.plotBands || [], ...this.plotLines || []].find(
            (plotItem): boolean => plotItem.id === id
        )?.remove();
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default PlotLineOrBandAxis;
