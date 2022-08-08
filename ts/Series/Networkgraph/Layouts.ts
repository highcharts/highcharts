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

import type { LayoutTypeRegistry } from './LayoutType';
import type PackedBubbleChart from '../PackedBubble/PackedBubbleChart';
import type Point from '../../Core/Series/Point';

import A from '../../Core/Animation/AnimationUtilities.js';
const { setAnimation } = A;
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import RFLayout from './ReingoldFruchtermanLayout.js';
import U from '../../Core/Utilities.js';
const { addEvent } = U;

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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface NetworkgraphPoint {
            dispX?: number;
            dispY?: number;
            prevX?: number;
            prevY?: number;
        }
        interface NetworkgraphSeriesOptions {
            layoutAlgorithm?: RFLayout.Options;
        }
        let layouts: LayoutTypeRegistry;
    }
}

import './Integrations.js';
import './QuadTree.js';

H.layouts = {} as LayoutTypeRegistry;

// Clear previous layouts
addEvent(Chart as any, 'predraw', function (
    this: Highcharts.NetworkgraphChart
): void {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach(
            function (layout): void {
                layout.stop();
            }
        );
    }
});
addEvent(Chart as any, 'render', function (
    this: Highcharts.NetworkgraphChart
): void {
    let systemsStable,
        afterRender = false;

    /**
     * @private
     */
    function layoutStep(layout: RFLayout): void {
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
    }

    if (this.graphLayoutsLookup) {
        setAnimation(false, this);
        // Start simulation
        this.graphLayoutsLookup.forEach(
            function (layout): void {
                layout.start();
            }
        );

        // Just one sync step, to run different layouts similar to
        // async mode.
        while (!systemsStable) {
            systemsStable = true;
            this.graphLayoutsLookup.forEach(layoutStep);
        }

        if (afterRender) {
            this.series.forEach(function (s): void {
                if (s && s.layout) {
                    s.render();
                }
            });
        }
    }
});

// disable simulation before print if enabled
addEvent(Chart as any, 'beforePrint', function (
    this: PackedBubbleChart
): void {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach(function (layout): void {
            layout.updateSimulation(false);
        });
        this.redraw();
    }
});

// re-enable simulation after print
addEvent(Chart as any, 'afterPrint', function (
    this: PackedBubbleChart
): void {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach(function (layout): void {
            // return to default simulation
            layout.updateSimulation();
        });
    }
    this.redraw();
});

/* *
 *
 *  Default Export
 *
 * */

const Layouts = {
    types: H.layouts
};

export default Layouts;
