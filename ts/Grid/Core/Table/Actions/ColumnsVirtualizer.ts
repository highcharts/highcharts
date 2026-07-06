/* *
 *
 *  Grid Columns Virtualizer class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { ColumnsSettings } from '../../Options';

import type Table from '../Table';

import Globals from '../../Globals.js';
import { defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Handles horizontal column windowing.
 */
class ColumnsVirtualizer {

    /**
     * The viewport of the data grid.
     */
    public readonly viewport: Table;

    /**
     * Size of the column buffer in columns.
     */
    public readonly buffer: number;

    /**
     * First rendered column index.
     */
    public columnCursor: number = 0;

    /**
     * Last rendered column index.
     */
    public columnEnd: number = -1;

    /**
     * Flag indicating if a scroll update is queued for the next animation
     * frame.
     */
    private scrollQueued = false;

    /**
     * Flag indicating if rendered columns are currently being updated.
     */
    private isRendering = false;

    /**
     * Whether another update should run after the current one finishes.
     */
    private pendingRender = false;

    /**
     * Rendering column settings.
     */
    private readonly columnSettings: ColumnsSettings;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        const columnSettings = viewport.grid.options?.rendering?.columns || {};

        this.viewport = viewport;
        this.columnSettings = columnSettings;
        this.buffer = Math.max(columnSettings.bufferSize || 0, 0);
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Initializes the rendered column range.
     */
    public initialize(): void {
        const viewport = this.viewport;

        viewport.virtualColumns = this.shouldVirtualizeColumns();
        viewport.tableElement.classList.toggle(
            Globals.getClassName('columnVirtualization'),
            viewport.virtualColumns
        );
        this.updateRange(true);
    }

    /**
     * Refreshes the rendered column range after layout changes.
     */
    public refresh(): void {
        if (this.updateRange()) {
            void this.renderColumns();
        }
    }

    /**
     * Schedules horizontal virtualization work.
     */
    public scroll(): void {
        if (this.scrollQueued) {
            return;
        }

        this.scrollQueued = true;
        requestAnimationFrame((): void => {
            this.scrollQueued = false;
            if (this.updateRange()) {
                void this.renderColumns();
            }
        });
    }

    /**
     * Checks if columns virtualization should be enabled.
     */
    private shouldVirtualizeColumns(): boolean {
        const { viewport } = this;
        const columns = viewport.grid.userOptions.rendering?.columns;

        if (defined(columns?.virtualization)) {
            return columns.virtualization;
        }

        const threshold = this.columnSettings.virtualizationThreshold ?? 20;
        return viewport.columns.length >= threshold;
    }

    /**
     * Updates the current rendered range.
     *
     * @param force
     * Whether to force assigning rendered columns.
     */
    private updateRange(force: boolean = false): boolean {
        const viewport = this.viewport;
        const columns = viewport.columns;
        let from = 0;
        let to = columns.length - 1;

        if (viewport.virtualColumns) {
            const range = viewport.columnLayout.getVisibleRange(
                viewport.tbodyElement.scrollLeft,
                viewport.tbodyElement.clientWidth
            );

            from = Math.max(0, range.from - this.buffer);
            to = Math.min(columns.length - 1, range.to + this.buffer);
        }

        if (!force && from === this.columnCursor && to === this.columnEnd) {
            return false;
        }

        this.columnCursor = from;
        this.columnEnd = to;
        viewport.renderedColumns = to >= from ?
            columns.slice(from, to + 1) :
            [];

        return true;
    }

    /**
     * Updates currently rendered cells and headers.
     */
    private async renderColumns(): Promise<void> {
        if (this.isRendering) {
            this.pendingRender = true;
            return;
        }

        this.isRendering = true;

        try {
            await this.viewport.updateRenderedColumns();
        } finally {
            this.isRendering = false;

            if (this.pendingRender) {
                this.pendingRender = false;
                if (this.updateRange()) {
                    await this.renderColumns();
                }
            }
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnsVirtualizer;
