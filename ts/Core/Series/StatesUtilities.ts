/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type {
    PointMarkerAnyStateOptions,
    PointMarkerOptions,
    PointMarkerStatesOptions
} from './PointOptions.js';
import type {
    SeriesOptions,
    SeriesAnyStateOptions,
    SeriesStatesOptions
} from './SeriesOptions.js';
import type { StatesOptions, StatesOptionsKey } from './StatesOptions.js';

/* *
 *
 *  Functions
 *
 * */

/**
 * Shared state lookup for series and marker `states` objects (same keys).
 *
 * @internal
 */
function getStateOptionsSlice(
    states: StatesOptions | undefined,
    state: StatesOptionsKey
): unknown {
    if (!states) {
        return void 0;
    }
    switch (state) {
        case '':
            return void 0;
        case 'hover':
            return states.hover;
        case 'inactive':
            return states.inactive;
        case 'normal':
            return states.normal;
        case 'select':
            return states.select;
        default:
            return void 0;
    }
}

/**
 * Resolve series state options for a given state key without dynamic indexing.
 *
 * @internal
 *
 * @param {SeriesStatesOptions<T>|undefined} states
 * Series `states` option object.
 *
 * @param {StatesOptionsKey} state
 * State id, or `''` for none (returns `undefined`).
 */
export function getSeriesStateOptions<T extends SeriesOptions>(
    states: SeriesStatesOptions<T> | undefined,
    state: StatesOptionsKey
): SeriesAnyStateOptions<T> | undefined {
    return getStateOptionsSlice(states, state) as (
        SeriesAnyStateOptions<T> | undefined
    );
}

/**
 * Resolve marker state options for a given state key without dynamic indexing.
 *
 * @internal
 *
 * @param {PointMarkerStatesOptions<T>|undefined} states
 * Marker `states` option object.
 *
 * @param {StatesOptionsKey} state
 * State id, or `''` for none (returns `undefined`).
 */
export function getMarkerStateOptions<T extends PointMarkerOptions>(
    states: PointMarkerStatesOptions<T> | undefined,
    state: StatesOptionsKey
): PointMarkerAnyStateOptions<T> | undefined {
    return getStateOptionsSlice(states, state) as (
        PointMarkerAnyStateOptions<T> | undefined
    );
}

/**
 * Read a series-level option that may appear on a merged state object
 * (including keys inherited through {@link StateGenericOptions}).
 *
 * @internal
 */
export function getSeriesStateVisual<T extends SeriesOptions>(
    stateOptions: SeriesAnyStateOptions<T>,
    key: keyof T
): unknown {
    return (stateOptions as Partial<T>)[key];
}
