/* *
 *
 *  Grid Summary Table Row
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

import type Cell from '../../Core/Table/Cell';
import type Column from '../../Core/Table/Column';
import type { SummaryRenderRow } from './SummaryRowsTypes';

import TableRow from '../../Core/Table/Body/TableRow.js';
import SummaryTableCell from './SummaryTableCell.js';
import Globals from '../../Core/Globals.js';
import {
    applyTrackedStyles,
    applyUserClassNames,
    mergeStyleValues
} from '../../Core/GridUtils.js';


/* *
 *
 *  Constants
 *
 * */

const summaryRowClassName = Globals.classNamePrefix + 'summary-row';


/* *
 *
 *  Class
 *
 * */

/**
 * Row rendered in the summary section, fed from a computed row object rather
 * than the data provider.
 */
class SummaryTableRow extends TableRow {

    /**
     * Body section id the row belongs to.
     */
    public readonly bodySectionId = 'summary';

    /**
     * Per-cell format overrides for this row, keyed by column id.
     */
    public formats: Record<string, string> = {};

    /**
     * Per-cell class name and style overrides for this row, keyed by column id.
     */
    public renderRow?: SummaryRenderRow;

    /**
     * Class name applied to the row element from options.
     */
    private customClassName?: string;

    /**
     * Style properties applied to the row element from options.
     */
    private customStyleProperties?: string[];

    /**
     * Skips the data-provider fetch of the base row init.
     */
    public override init(): Promise<void> {
        this.setRowAttributes();
        return Promise.resolve();
    }

    public override createCell(column: Column): Cell {
        return new SummaryTableCell(this, column);
    }

    public override async update(): Promise<void> {
        if (this.renderRow) {
            await this.sync(this.renderRow, this.index);
        }
    }

    /**
     * Feeds the row with the computed values and the resolved per-cell
     * overrides.
     *
     * @param renderRow
     * Resolved summary row to render.
     *
     * @param index
     * Row index within the summary section.
     */
    public async sync(
        renderRow: SummaryRenderRow,
        index: number = this.index
    ): Promise<void> {
        this.index = index;
        this.renderRow = renderRow;
        this.data = renderRow.data;
        this.formats = renderRow.formats;
        this.setRowAttributes();

        if (this.rendered) {
            for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
                await (this.cells[i] as SummaryTableCell).setValue();
            }
        }

        this.reflow();
    }

    public override setHoveredState(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.getClassName('hoveredRow')
        );
    }

    public override setSyncedState(synced: boolean): void {
        this.htmlElement.classList[synced ? 'add' : 'remove'](
            Globals.getClassName('syncedRow')
        );
    }

    public override setRowAttributes(): void {
        const el = this.htmlElement;

        el.classList.add(
            Globals.getClassName('rowElement'),
            summaryRowClassName
        );
        el.removeAttribute('data-row-index');

        this.customClassName = applyUserClassNames(
            el,
            this.customClassName,
            this.renderRow?.className
        );

        // Applied on top of the layout styles the reflow writes to the element,
        // so only the properties from options are removed on an update.
        this.customStyleProperties = applyTrackedStyles(
            el,
            this.customStyleProperties,
            mergeStyleValues(this, this.renderRow?.style)
        );

        this.updateRowAttributes();
        this.updateParityClass();
        this.updateStateClasses();
    }

    public override updateRowAttributes(): void {
        const summaryDescription = this.viewport.grid.options?.lang
            ?.accessibility?.summaryRows?.descriptions?.summary;

        if (summaryDescription) {
            this.htmlElement.setAttribute(
                'aria-roledescription',
                summaryDescription
            );
        }
    }

    protected override updateParityClass(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('rowEven'),
            Globals.getClassName('rowOdd')
        );
        el.classList.add(
            Globals.getClassName(this.index % 2 ? 'rowEven' : 'rowOdd')
        );
    }

    protected override updateStateClasses(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('hoveredRow'),
            Globals.getClassName('syncedRow')
        );
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryTableRow;
