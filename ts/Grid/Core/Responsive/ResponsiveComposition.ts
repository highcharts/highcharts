/* *
 *
 *  Grid Responsive composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { DeepPartial } from '../../../Shared/Types';
import type Grid from '../../Core/Grid';
import type { Options } from '../Options';
import type { ResponsiveOptions, RuleOptions } from './ResponsiveOptions';

import Globals from '../../Core/Globals.js';
import {
    addEvent,
    defined,
    diffObjects,
    merge,
    pushUnique
} from '../../../Shared/Utilities.js';
import { uniqueKey } from '../../../Core/Utilities.js';

/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the grid classes with responsive options.
 *
 * @param GridClass
 * The class to extend.
 *
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'Responsive')) {
        return;
    }

    addEvent(GridClass, 'beforeRenderViewport', initResizeObserver);
    addEvent(GridClass, 'beforeDestroy', destroyResizeObserver);
}

/**
 * Initializes the resize observer.
 *
 * @param this
 * Reference to Grid.
 */
function initResizeObserver(this: Grid): void {
    destroyResizeObserver.call(this);
    if (!this.container || !this.contentWrapper) {
        return;
    }

    this.activeRules = new Set();

    // Synchronously evaluate responsive rules so the first render already
    // uses the correct options (avoids a redundant second render).
    if (!this.updatingResponsive) {
        const rules = this.options?.responsive?.rules || [];
        if (rules.length > 0) {
            const { clientWidth: width, clientHeight: height } =
                this.container;
            const fakeEntry = {
                contentRect: { width, height }
            } as ResizeObserverEntry;
            const matchingRules: RuleOptions[] = [];

            for (const rule of rules) {
                if (typeof rule._id === 'undefined') {
                    rule._id = uniqueKey();
                }

                if (matchResponsiveRule.call(this, rule, fakeEntry)) {
                    matchingRules.push(rule);
                }
            }

            this.activeRules = new Set(matchingRules);
            setResponsive.call(this, matchingRules, false);
        }
    }

    this.resizeObserver = new ResizeObserver((entries): void => {
        onResize.call(this, entries[0]);
    });

    this.resizeObserver.observe(this.contentWrapper);
}

/**
 * Destroys the resize observer.
 *
 * @param this
 * Reference to Grid.
 */
function destroyResizeObserver(this: Grid): void {
    this.resizeObserver?.disconnect();
    delete this.activeRules;
}

/**
 * Checks if the responsive rule matches the current grid size.
 *
 * @param this
 * Reference to Grid.
 *
 * @param rule
 * The responsive rule to check.
 *
 * @param entry
 * The resize observer entry.
 */
function matchResponsiveRule(
    this: Grid,
    rule: RuleOptions,
    entry: ResizeObserverEntry
): boolean {
    const {
        maxWidth, maxHeight,
        minWidth, minHeight,
        callback
    } = rule.condition;

    return (
        (!defined(callback) || callback?.call(this, this)) &&
        (!defined(maxWidth) || entry.contentRect.width <= maxWidth) &&
        (!defined(maxHeight) || entry.contentRect.height <= maxHeight) &&
        (!defined(minWidth) || entry.contentRect.width >= minWidth) &&
        (!defined(minHeight) || entry.contentRect.height >= minHeight)
    );
}

/**
 * Updates the grid based on the currently active responsive rules.
 *
 * @param this
 * Reference to Grid.
 *
 * @param matchingRules
 * Active responsive rules.
 *
 * @param redraw
 * Whether to redraw the grid. Default is `true`.
 */
function setResponsive(
    this: Grid,
    matchingRules: RuleOptions[],
    redraw = true
): void {
    const ruleIds = matchingRules.map((rule): string => rule._id as string);
    const ruleIdsString = (ruleIds.toString() || void 0);
    const currentRuleIds = this.currentResponsive?.ruleIds;

    if (ruleIdsString === currentRuleIds || this.updatingResponsive) {
        return;
    }

    this.updatingResponsive = true;

    let lastUpdate: Promise<void> | undefined;

    if (this.currentResponsive) {
        const undoOptions = this.currentResponsive.undoOptions;
        this.currentResponsive = void 0;

        if (redraw) {
            lastUpdate = this.update(undoOptions as Options, true);
        } else {
            this.update(undoOptions as Options, false);
        }
    }

    if (ruleIdsString) {
        const mergedOptions = merge(
            ...matchingRules.map(
                (rule): DeepPartial<Options> => rule.gridOptions
            )
        );
        const undoOptions = diffObjects(
            mergedOptions,
            this.options || {},
            true
        );
        const columnUndoOptions = getColumnUndoOptions.call(
            this,
            mergedOptions
        );
        if (columnUndoOptions) {
            undoOptions.columns = columnUndoOptions;
        } else {
            syncColumnIds(undoOptions, mergedOptions);
        }

        this.currentResponsive = {
            ruleIds: ruleIdsString,
            mergedOptions,
            undoOptions
        };

        if (redraw) {
            lastUpdate = this.update(mergedOptions as Options, true);
        } else {
            this.update(mergedOptions as Options, false);
        }
    }

    // Keep the flag alive until the last queued update finishes so that
    // ResizeObserver callbacks arriving in the meantime are ignored.
    if (lastUpdate !== void 0) {
        void lastUpdate.then((): void => {
            this.updatingResponsive = false;
        });
    } else {
        this.updatingResponsive = false;
    }
}

/**
 * Builds undo options for columns by matching them by id.
 *
 * @param this
 * Reference to Grid.
 *
 * @param mergedOptions
 * The merged responsive options used to apply updates.
 */
function getColumnUndoOptions(
    this: Grid,
    mergedOptions: DeepPartial<Options>
): DeepPartial<Options>['columns'] | void {
    const mergedColumns = mergedOptions.columns;
    const currentColumns = this.options?.columns;

    if (!mergedColumns || !currentColumns) {
        return;
    }

    type ColumnOptions = NonNullable<Options['columns']>[number];
    const result: Array<DeepPartial<ColumnOptions>> = [];
    const columnMap = new Map<string, ColumnOptions>();

    for (let i = 0, iEnd = currentColumns.length; i < iEnd; ++i) {
        const column = currentColumns[i];
        if (typeof column.id === 'string') {
            columnMap.set(column.id, column);
        }
    }

    for (let i = 0, iEnd = mergedColumns.length; i < iEnd; ++i) {
        const mergedColumn = mergedColumns[i] as
            (Record<string, unknown> | undefined);
        const columnId = (typeof mergedColumn?.id === 'string') ?
            mergedColumn.id :
            void 0;

        if (!mergedColumn || !columnId) {
            continue;
        }

        const currentColumn = columnMap.get(columnId) as
            (Record<string, unknown> | undefined);

        if (!currentColumn) {
            continue;
        }

        const columnUndo = diffObjects(mergedColumn, currentColumn, true);

        if (Object.keys(columnUndo).length > 0) {
            (columnUndo as DeepPartial<ColumnOptions>).id = columnId;
            result.push(columnUndo as DeepPartial<ColumnOptions>);
        }
    }

    if (result.length) {
        return result;
    }
}

/**
 * Ensures column options keep their ids when undoing responsive updates.
 *
 * @param undoOptions
 * The undo options to be updated.
 *
 * @param mergedOptions
 * The merged responsive options used to apply updates.
 */
function syncColumnIds(
    undoOptions: DeepPartial<Options>,
    mergedOptions: DeepPartial<Options>
): void {
    const mergedColumns = mergedOptions.columns;
    const undoColumns = undoOptions.columns;

    if (!mergedColumns || !undoColumns) {
        return;
    }

    for (let i = 0, iEnd = Math.min(mergedColumns.length, undoColumns.length);
        i < iEnd; ++i) {
        const mergedColumn = mergedColumns[i] as (Record<string, unknown>|undefined);
        const undoColumn = undoColumns[i] as (Record<string, unknown>|undefined);

        if (mergedColumn && undoColumn && !('id' in undoColumn)) {
            undoColumn.id = mergedColumn.id;
        }
    }
}

/**
 * Handles the resize event.
 *
 * @param this
 * Reference to Grid.
 *
 * @param entry
 * The resize observer entry.
 */
function onResize(this: Grid, entry: ResizeObserverEntry): void {
    if (!this.activeRules || this.updatingResponsive) {
        return;
    }

    const rules = this.options?.responsive?.rules || [];
    const matchingRules: RuleOptions[] = [];

    for (const rule of rules) {
        if (typeof rule._id === 'undefined') {
            rule._id = uniqueKey();
        }

        if (matchResponsiveRule.call(this, rule, entry)) {
            matchingRules.push(rule);
        }
    }

    this.activeRules = new Set(matchingRules);
    setResponsive.call(this, matchingRules);
}

/* *
 *
 * Declarations
 *
 * */

declare module '../Options' {
    interface Options {
        /**
         * Allows setting a set of rules to apply for different screen or grid
         * sizes. Each rule specifies additional grid options.
         */
        responsive?: ResponsiveOptions;
    }
}

declare module '../Grid' {
    export default interface Grid {
        /**
         * Tracks the ResizeObserver instance for the grid.
         * @private
         */
        resizeObserver?: ResizeObserver;
        /**
         * Cache of currently active responsive rules.
         * @private
         */
        activeRules?: Set<RuleOptions>;
        /**
         * Stores merged responsive options and undo data.
         * @private
         */
        currentResponsive?: {
            ruleIds?: string;
            mergedOptions: DeepPartial<Options>;
            undoOptions: DeepPartial<Options>;
        };
        /**
         * Prevents recursive updates during responsive changes.
         * @private
         */
        updatingResponsive?: boolean;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
