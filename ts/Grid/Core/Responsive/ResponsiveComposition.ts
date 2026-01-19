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
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    diffObjects,
    defined,
    merge,
    pushUnique,
    uniqueKey
} = U;


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
    if (!this.container) {
        return;
    }

    this.activeRules = new Set();

    this.resizeObserver = new ResizeObserver((entries): void => {
        onResize.call(this, entries[0]);
    });

    this.resizeObserver.observe(this.container);
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
 */
function setResponsive(this: Grid, matchingRules: RuleOptions[]): void {
    const ruleIds = matchingRules.map((rule): string => rule._id as string);
    const ruleIdsString = (ruleIds.toString() || void 0);
    const currentRuleIds = this.currentResponsive?.ruleIds;

    if (ruleIdsString === currentRuleIds) {
        return;
    }

    if (this.currentResponsive) {
        const undoOptions = this.currentResponsive.undoOptions;
        this.currentResponsive = void 0;
        this.updatingResponsive = true;
        void this.update(undoOptions as Options, true);
        this.updatingResponsive = false;
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

        this.currentResponsive = {
            ruleIds: ruleIdsString,
            mergedOptions,
            undoOptions
        };

        if (!this.updatingResponsive) {
            void this.update(mergedOptions as Options, true);
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
    if (!this.activeRules) {
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
        resizeObserver?: ResizeObserver;
        activeRules?: Set<RuleOptions>;
        currentResponsive?: {
            ruleIds?: string;
            mergedOptions: DeepPartial<Options>;
            undoOptions: DeepPartial<Options>;
        };
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
