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

import type Grid from '../../Core/Grid';
import type { ResponsiveOptions, RuleOptions } from './ResponsiveOptions';

import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    defined,
    pushUnique
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

    for (const rule of rules) {
        const {
            maxWidth, maxHeight,
            minWidth, minHeight,
            callback
        } = rule.condition;
        const value = (
            (!defined(callback) || callback?.call(this, this)) &&
            (!defined(maxWidth) || entry.contentRect.width <= maxWidth) &&
            (!defined(maxHeight) || entry.contentRect.height <= maxHeight) &&
            (!defined(minWidth) || entry.contentRect.width >= minWidth) &&
            (!defined(minHeight) || entry.contentRect.height >= minHeight)
        );

        const ruleIsActive = this.activeRules.has(rule);
        if (ruleIsActive !== value) {
            // TODO: Trigger grid update when rule changes (if the rule is
            // active, merge the rule's gridOptions with the base options, when
            // its inactive, remove them from the base options - everything
            // should remain the same as it was before the specific rule was
            // activated - for the options affected by the rule)
        }
        this.activeRules[value ? 'add' : 'delete'](rule);
    }
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
        activeRules?: Set<RuleOptions>
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
