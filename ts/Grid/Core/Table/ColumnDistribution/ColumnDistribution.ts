/* *
 *
 *  Column Distribution namespace
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Table from '../Table';

import DistributionStrategy from './ColumnDistributionStrategy.js';
import MixedDistributionStrategy from './MixedDistributionStrategy.js';
import FixedDistributionStrategy from './FixedDistributionStrategy.js';
import FullDistributionStrategy from './FullDistributionStrategy.js';

import U from '../../../../Core/Utilities.js';
const { defined } = U;


/* *
 *
 *  Namespace
 *
 * */

namespace ColumnDistribution {

    /**
     * Abstract class representing a column distribution strategy.
     */
    export const AbstractStrategy = DistributionStrategy;

    /**
     * Registry of column distribution strategies.
     */
    export const types = {
        mixed: MixedDistributionStrategy,
        fixed: FixedDistributionStrategy,
        full: FullDistributionStrategy
    };

    export type StrategyType = keyof typeof types;

    /**
     * Returns the column distribution of the table according to the options:
     * 1. If `columns.resizing.mode` defined, use it. If not:
     * 2. If any column has a width defined, use `mixed`. If not:
     * 3. Use `full`.
     *
     * @param viewport
     * The table that the column distribution strategy is applied to.
     */
    function assumeDistributionType(viewport: Table): StrategyType {
        const { options } = viewport.grid;
        const colRendering = options?.rendering?.columns;
        const result = colRendering?.resizing?.mode ||
            colRendering?.distribution;

        if (result) {
            return result;
        }

        if (
            options?.columns?.some(
                (column): boolean => defined(column.width)
            ) || defined(options?.columnDefaults?.width)
        ) {
            return 'mixed';
        }

        return 'full';
    }

    /**
     * Creates a new column distribution strategy instance based on the
     * viewport's options.
     *
     * @param viewport
     * The table that the column distribution strategy is applied to.
     *
     * @returns
     * The proper column distribution strategy.
     */
    export function initStrategy(viewport: Table): DistributionStrategy {
        return new types[assumeDistributionType(viewport)](viewport);
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnDistribution;
