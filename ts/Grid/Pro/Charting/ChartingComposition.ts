/* *
 *
 *  Grid Charting composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Markus Barstad
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type {
    AfterChartCreateEvent,
    BeforeChartCreateEvent
} from './ChartingOptions';

import Charting from './Charting.js';
import { defaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import { addEvent, merge, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the Grid with creating charts from its data.
 *
 * @param GridClass
 * The class to extend.
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'Charting')) {
        return;
    }

    merge(true, defaultOptions, {
        charting: Charting.defaultOptions,
        lang: {
            charting: {
                closeChart: 'Close chart'
            }
        }
    });

    addEvent(GridClass, 'beforeLoad', initCharting);
    addEvent(GridClass, 'beforeDestroy', destroyCharting);
    addEvent(GridClass, 'beforeChartCreate', onBeforeChartCreate);
    addEvent(GridClass, 'afterChartCreate', onAfterChartCreate);
}

/**
 * Creates the charting controller of the Grid.
 */
function initCharting(this: Grid): void {
    this.charting = new Charting(this);
}

/**
 * Destroys the charting controller of the Grid.
 */
function destroyCharting(this: Grid): void {
    this.charting?.destroy();
}

/**
 * Calls the `beforeChartCreate` event callback from the options.
 *
 * @param e
 * The event payload.
 */
function onBeforeChartCreate(this: Grid, e: BeforeChartCreateEvent): void {
    this.options?.events?.beforeChartCreate?.call(this, e);
}

/**
 * Calls the `afterChartCreate` event callback from the options.
 *
 * @param e
 * The event payload.
 */
function onAfterChartCreate(this: Grid, e: AfterChartCreateEvent): void {
    this.options?.events?.afterChartCreate?.call(this, e);
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
