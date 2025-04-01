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

import Column from '../Column.js';
import DistributionStrategy from './ColumnDistributionStrategy.js';
import MixedDistributionStrategy from './MixedDistributionStrategy.js';
import FixedDistributionStrategy from './FixedDistributionStrategy.js';
import FullDistributionStrategy from './FullDistributionStrategy.js';

import U from '../../../../Core/Utilities.js';
const {
    defined,
    getStyle
} = U;


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

    /**
     * Returns the minimum width of the column.
     *
     * @param column
     * The column to get the minimum width for.
     *
     * @returns
     * The minimum width in pixels.
     */
    export function getMinWidth(column: Column): number {
        const tableColumnEl = column.cells[0]?.htmlElement;
        const headerColumnEl = column.header?.htmlElement;

        const getElPaddings = (el: HTMLElement): number => (
            (getStyle(el, 'padding-left', true) || 0) +
            (getStyle(el, 'padding-right', true) || 0) +
            (getStyle(el, 'border-left', true) || 0) +
            (getStyle(el, 'border-right', true) || 0)
        );

        let result = Column.MIN_COLUMN_WIDTH;
        if (tableColumnEl) {
            result = Math.max(result, getElPaddings(tableColumnEl));
        }
        if (headerColumnEl) {
            result = Math.max(result, getElPaddings(headerColumnEl));
        }
        return result;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnDistribution;
