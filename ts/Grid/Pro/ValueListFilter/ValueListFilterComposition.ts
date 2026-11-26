/* *
 *
 *  Grid Value List Filter Composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import type Column from '../../Core/Table/Column';
import type Options from '../../Core/Options';
import type {
    FilteringRuleItem,
    FilteringRuleValue
} from '../../Core/Options';
import type {
    FilterCondition
} from '../../../Data/Modifiers/FilterModifierOptions';
import type {
    RenderFilterValueEditorEvent
} from '../../Core/Table/Actions/ColumnFiltering/ColumnFiltering';
import type { DeepPartial } from '../../../Shared/Types';

import ColumnFiltering from
    '../../Core/Table/Actions/ColumnFiltering/ColumnFiltering.js';
import Globals from '../../Core/Globals.js';
import {
    conditionMappers
} from '../../Core/Table/Actions/ColumnFiltering/FilteringTypes.js';
import ValueListFilter from './ValueListFilter.js';
import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import {
    addEvent,
    defined,
    isArray,
    merge,
    pushUnique
} from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

/**
 * Default options of the value list filtering.
 */
export const defaultOptions: DeepPartial<Options> = {
    lang: {
        columnFilteringOperators: {
            oneOf: 'Is one of'
        },
        valueListFilter: {
            all: 'All',
            blanks: '(Blanks)',
            selectAll: '(Select All)',
            selected: '{count} selected'
        }
    }
};

/* *
 *
 *  Composition
 *
 * */

/**
 * Composes Grid Pro with the value list of the `oneOf` filtering operator.
 *
 * @param ColumnClass
 * Column class to extend.
 */
export function compose(ColumnClass: typeof Column): void {
    if (!pushUnique(Globals.composed, 'ValueListFilter')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);
    conditionMappers.oneOf = mapOneOf;

    addEvent(ColumnFiltering, 'renderValueEditor', onRenderValueEditor);
    addEvent(ColumnClass, 'afterFilter', onColumnAfterFilter);
}

/**
 * Builds the condition of the `oneOf` operator: one equality check per listed
 * value, which the size of a value list keeps small. An empty list matches no
 * row, as an `or` of nothing. A blank entry matches the empty cells.
 *
 * @param columnId
 * Id of the column to filter.
 *
 * @param value
 * The selected values.
 */
function mapOneOf(
    columnId: string,
    value?: FilteringRuleValue
): (FilterCondition | undefined) {
    if (!isArray(value)) {
        return;
    }

    const conditions = value.map((item): FilterCondition => (
        defined(item) && item !== '' ?
            { columnId, operator: '===', value: item } :
            { columnId, operator: 'empty', value: null }
    ));

    return conditions.length === 1 ?
        conditions[0] :
        { operator: 'or', conditions };
}

/**
 * Renders the value list in place of the filter value input, for the columns
 * filtered with the `oneOf` operator.
 *
 * @param e
 * Value editor render event payload.
 */
function onRenderValueEditor(
    this: ColumnFiltering,
    e: RenderFilterValueEditorEvent
): void {
    if (e.condition !== 'oneOf') {
        return;
    }

    // Kept across re-renders of the filter UI, so that the list can follow
    // the applied filter.
    this.valueList ??= new ValueListFilter(this);

    e.elements = this.valueList.render(e.container);
}

/**
 * Keeps the value list in sync with filters applied outside of it, like the
 * clear filter button.
 */
function onColumnAfterFilter(this: Column): void {
    this.filtering?.valueList?.refresh();
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Table/Actions/ColumnFiltering/ColumnFiltering' {
    export default interface ColumnFiltering {
        valueList?: ValueListFilter;
    }
}

declare module '../../Core/Table/Actions/ColumnFiltering/FilteringTypes' {
    interface OptInConditionRegistry {
        oneOf: FilteringRuleItem[];
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
