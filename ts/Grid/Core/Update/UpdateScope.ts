/* *
 *
 *  Grid Update System - Update Scope
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Update scope levels - determines what kind of UI update is needed.
 */
export enum UpdateScope {
    /** No UI update needed - options only */
    NONE = 0,

    /** DOM attributes only (className, aria-*) */
    DOM_ATTR = 1,

    /** DOM elements (text, innerHTML, add/remove elements) */
    DOM_ELEMENT = 2,

    /** Reflow needed (dimensions, layout recalculation) */
    REFLOW = 3,

    /** Rows update (sorting, filtering - no full render) */
    ROWS_UPDATE = 4,

    /** Full viewport render (structural changes) */
    VIEWPORT_RENDER = 5
}

/**
 * Update config entry - defines how an option should be updated.
 */
export interface UpdateConfigEntry {
    /** Update scope level */
    scope: UpdateScope;

    /** Option paths (1+ paths) */
    options: string[];

    /**
     * Custom update handler
     * Context (this): Grid instance
     *
     * @param module Module instance (Pagination, Accessibility, Credits)
     *        or undefined for non-module options (caption, lang, rendering)
     * @param newVal New value for the option
     * @param oldVal Previous value for the option
     * @param path Option path (e.g., 'pagination.pageSize')
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler?: (
        this: Grid,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        module: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newVal: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        oldVal?: any,
        path?: string
    ) => void;

    /** Priority within scope (lower = earlier) */
    priority?: number;

    /** Dependencies (other option paths that must be updated first) */
    dependencies?: string[];
}

/**
 * Update config - map of config entries.
 */
export type UpdateConfig = Record<string, UpdateConfigEntry>;

/**
 * Option change - represents a single option change to be executed.
 */
export interface OptionChange {
    /** Full path (e.g. 'pagination.pageSize') */
    path: string;

    /** Update scope */
    scope: UpdateScope;

    /** Priority within scope */
    priority?: number;

    /** Dependencies */
    dependencies?: string[];

    /** Handler to execute */
    handler: () => void;
}

/**
 * Update plan - organized changes by phases.
 */
export interface UpdatePlan {
    /** Changes grouped by scope (phases) */
    phases: Map<UpdateScope, OptionChange[]>;

    /** Maximum scope required */
    maxScope: UpdateScope;

    /** Whether there are structural changes (columns, dataTable, header) */
    hasStructuralChanges: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default UpdateScope;
