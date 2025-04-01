/* *
 *
 *  Column Distribution class
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

import type { ColumnDistributionType } from '../../Options';
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

    type StrategyConstructor = new (viewport: Table) => DistributionStrategy;

    const distributions: Record<ColumnDistributionType, StrategyConstructor> = {
        mixed: MixedDistributionStrategy,
        fixed: FixedDistributionStrategy,
        full: FullDistributionStrategy
    };

    /**
     * Returns the column distribution of the table according to the options:
     * 1. If `columns.distribution` defined, use it. If not:
     * 2. If any column has a width defined, use `mixed`. If not:
     * 3. Use `full`.
     */
    function assumeDistributionType(viewport: Table): ColumnDistributionType {
        const { options } = viewport.grid;
        let result = options?.rendering?.columns?.distribution;

        if (result) {
            return result;
        }

        if (
            options?.columns?.some(column => defined(column.width)) ||
            defined(options?.columnDefaults?.width)
        ) {
            return 'mixed';
        }

        return 'full';
    }

    /**
     * Creates a new column distribution strategy based on the viewport's
     * options.
     *
     * @param viewport
     * The table that the column distribution strategy is applied to.
     *
     * @returns
     * The proper column distribution strategy.
     */
    export function createStrategy(viewport: Table): DistributionStrategy {
        return new distributions[assumeDistributionType(viewport)](viewport);
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnDistribution;
