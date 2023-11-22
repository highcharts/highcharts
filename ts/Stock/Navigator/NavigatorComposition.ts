/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type Axis from '../../Core/Axis/Axis';
import type Chart from '../../Core/Chart/Chart';
import type Navigator from './Navigator';
import type Scrollbar from '../Scrollbar/Scrollbar';
import type Series from '../../Core/Series/Series';

import D from '../../Core/Defaults.js';
const {
    defaultOptions,
    setOptions
} = D;
import H from '../../Core/Globals.js';
const { isTouchDevice } = H;
import NavigatorAxisAdditions from '../../Core/Axis/NavigatorAxisComposition.js';
import NavigatorDefaults from './NavigatorDefaults.js';
import NavigatorSymbols from './NavigatorSymbols.js';
import RendererRegistry from '../../Core/Renderer/RendererRegistry.js';
const { getRendererType } = RendererRegistry;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        'navigator-handle': SymbolFunction;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        baseSeries?: Series;
        navigatorSeries?: Series;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

/* *
 *
 *  Variables
 *
 * */


/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function compose(
    AxisClass: typeof Axis,
    NavigatorClass: typeof Navigator,
    SeriesClass: typeof Series
): void {
    NavigatorAxisAdditions.compose(AxisClass);

    if (U.pushUnique(composedMembers, SeriesClass)) {
        addEvent(SeriesClass, 'afterUpdate', onSeriesAfterUpdate);
    }

    if (U.pushUnique(composedMembers, getRendererType)) {
        extend(getRendererType().prototype.symbols, NavigatorSymbols);
    }

    if (U.pushUnique(composedMembers, setOptions)) {
        extend(defaultOptions, { navigator: NavigatorDefaults });
    }

}

/**
 * Handle updating series
 * @private
 */
function onSeriesAfterUpdate(
    this: Series
): void {
    if (this.chart.navigator && !this.options.isInternal) {
        this.chart.navigator.setBaseSeries(null as any, false);
    }
}

/* *
 *
 *  Default Export
 *
 * */

const NavigatorComposition = {
    compose
};

export default NavigatorComposition;
