/* *
 *
 *  Grid Pro Pagination class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type Pagination from '../../Core/Pagination/Pagination';

import Utilities from '../../../Core/Utilities.js';
import Globals from '../../../Core/Globals.js';

const { addEvent, pushUnique } = Utilities;


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the pagination class with events.
 *
 * @param PaginationClass
 * The class to extend.
 *
 * @internal
 */
export function compose(
    PaginationClass: typeof Pagination
): void {
    if (!pushUnique(Globals.composed, 'PaginationPro')) {
        return;
    }

    // Register pagination events
    addEvent(
        PaginationClass,
        'beforePageChange',
        (e: PaginationEvent): void => {
            const { target, currentPage, nextPage, pageSize } = e;
            target.options?.events?.beforePageChange?.call(target, {
                currentPage: currentPage,
                nextPage: nextPage,
                pageSize: pageSize
            });
        }
    );

    addEvent(
        PaginationClass,
        'afterPageChange',
        (e: PaginationEvent): void => {
            const { target, currentPage, previousPage, pageSize } = e;
            target.options?.events?.afterPageChange?.call(target, {
                currentPage: currentPage,
                previousPage: previousPage,
                pageSize: pageSize
            });
        }
    );

    addEvent(
        PaginationClass,
        'beforePageSizeChange',
        (e: PaginationEvent): void => {
            const { target, newPageSize, pageSize } = e;
            target.options?.events?.beforePageSizeChange?.call(target, {
                pageSize: pageSize,
                newPageSize: newPageSize
            });
        }
    );

    addEvent(
        PaginationClass,
        'afterPageSizeChange',
        (e: PaginationEvent): void => {
            const { target, previousPageSize, pageSize } = e;
            target.options?.events?.afterPageSizeChange?.call(target, {
                pageSize: pageSize,
                previousPageSize: previousPageSize
            });
        }
    );
}

declare module '../../Core/Pagination/PaginationOptions' {
    interface PaginationOptions {
        /**
         * Pagination events.
         *
         */
        events?: PaginationEvents;
    }
}

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Pagination events for Pro version.
 */
export interface PaginationEvents {
    /**
     * Fired before a page change occurs.
     *
     * @param e
     * The event object.
     */
    beforePageChange?: (e: BeforePageChangeEvent) => void;

    /**
     * Fired after a page change occurs.
     *
     * @param e
     * The event object.
     */
    afterPageChange?: (e: AfterPageChangeEvent) => void;

    /**
     * Fired before the page size setting changes.
     *
     * @param e
     * The event object.
     */
    beforePageSizeChange?: (e: BeforePageSizeChangeEvent) => void;

    /**
     * Fired after the page size setting changes.
     *
     * @param e
     * The event object.
     */
    afterPageSizeChange?: (e: AfterPageSizeChangeEvent) => void;
}

export interface BeforePageChangeEvent {
    currentPage: number;
    nextPage: number;
    pageSize: number;
}

export interface AfterPageChangeEvent {
    currentPage: number;
    previousPage: number;
    pageSize: number;
}

export interface BeforePageSizeChangeEvent {
    pageSize: number;
    newPageSize: number;
}

export interface AfterPageSizeChangeEvent {
    pageSize: number;
    previousPageSize: number;
}

export type PaginationEvent = Record<string, number> & { target: Pagination };

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
