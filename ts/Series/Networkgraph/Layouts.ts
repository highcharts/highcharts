/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2021 Paweł Fus
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
import type { LayoutType, LayoutTypeRegistry } from './LayoutType';
import type Point from '../../Core/Series/Point';
import type RFLayout from './ReingoldFruchtermanLayout';

import A from '../../Core/Animation/AnimationUtilities.js';
const { setAnimation } = A;
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const { addEvent } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        graphLayoutsLookup?: Array<LayoutType>;
    }
}

declare module '../../Core/GlobalsLike' {
    interface GlobalsLike {
        layouts: LayoutTypeRegistry;
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        dispX?: number;
        dispY?: number;
        fromNode?: Point;
        linksFrom?: Array<Point>;
        linksTo?: Array<Point>;
        mass?: number;
        prevX?: number;
        prevY?: number;
        toNode?: Point;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        forces?: Array<string>;
    }
}

import './Integrations.js';
import './QuadTree.js';

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function compose(
    ChartClass: typeof Chart
): void {

    if (composedClasses.indexOf(ChartClass)) {
        composedClasses.push(ChartClass);

        addEvent(ChartClass, 'afterPrint', onChartAfterPrint);
        addEvent(ChartClass, 'beforePrint', onChartBeforePrint);
        addEvent(ChartClass, 'predraw', onChartPredraw);
        addEvent(ChartClass, 'render', onChartRender);
    }

}

/**
 * Re-enable simulation after print.
 * @private
 */
function onChartAfterPrint(
    this: Chart
): void {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach((layout): void => {
            // return to default simulation
            layout.updateSimulation();
        });
        this.redraw();
    }
}

/**
 * Disable simulation before print if enabled.
 * @private
 */
function onChartBeforePrint(
    this: Chart
): void {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach((layout): void => {
            layout.updateSimulation(false);
        });
        this.redraw();
    }
}

/**
 * Clear previous layouts.
 * @private
 */
function onChartPredraw(
    this: Chart
): void {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach((layout): void => {
            layout.stop();
        });
    }
}

/**
 * @private
 */
function onChartRender(
    this: Chart
): void {
    let systemsStable,
        afterRender = false;

    const layoutStep = (layout: RFLayout): void => {
        if (
            (layout.maxIterations as any)-- &&
            isFinite(layout.temperature as any) &&
            !layout.isStable() &&
            !layout.enableSimulation
        ) {
            // Hook similar to build-in addEvent, but instead of
            // creating whole events logic, use just a function.
            // It's faster which is important for rAF code.
            // Used e.g. in packed-bubble series for bubble radius
            // calculations
            if (layout.beforeStep) {
                layout.beforeStep();
            }

            layout.step();
            systemsStable = false;
            afterRender = true;
        }
    };

    if (this.graphLayoutsLookup) {
        setAnimation(false, this);
        // Start simulation
        this.graphLayoutsLookup.forEach((layout): void => layout.start());

        // Just one sync step, to run different layouts similar to
        // async mode.
        while (!systemsStable) {
            systemsStable = true;
            this.graphLayoutsLookup.forEach(layoutStep);
        }

        if (afterRender) {
            this.series.forEach((series): void => {
                if (series && series.layout) {
                    series.render();
                }
            });
        }
    }
}

/* *
 *
 *  Registry
 *
 * */

H.layouts = {} as LayoutTypeRegistry;

/* *
 *
 *  Default Export
 *
 * */

const Layouts = {
    compose,
    types: H.layouts
};

export default Layouts;
