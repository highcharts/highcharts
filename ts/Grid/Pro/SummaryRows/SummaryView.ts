/* *
 *
 *  Grid Summary View
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

import type Table from '../../Core/Table/Table';
import type TableRow from '../../Core/Table/Body/TableRow';
import type {
    SummaryRenderRow,
    SummaryRowPosition
} from './SummaryRowsTypes';

import SummaryTableRow from './SummaryTableRow.js';
import Globals from '../../Core/Globals.js';
import { applyUserClassNames, makeHTMLElement } from '../../Core/GridUtils.js';


/* *
 *
 *  Declarations
 *
 * */

interface SummarySection {
    position: SummaryRowPosition;
    tbodyElement: HTMLElement;
    rows: SummaryTableRow[];

    /**
     * Class names applied to the section element from options, tracked so that
     * an update removes the previous ones.
     */
    className?: string;
}


/* *
 *
 *  Class
 *
 * */

/**
 * Renders computed summary rows in dedicated frozen tbody sections above and/or
 * below the scrollable table body.
 */
class SummaryView {

    /* *
     *
     *  Properties
     *
     * */

    private readonly viewport: Table;

    /**
     * Frozen section stuck above the scrollable body.
     */
    private readonly top: SummarySection;

    /**
     * Frozen section stuck below the scrollable body.
     */
    private readonly bottom: SummarySection;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
        this.top = this.createSection('top', 'before');
        this.bottom = this.createSection('bottom', 'after');
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Registers a summary body section.
     *
     * @param position
     * Summary position the section holds.
     *
     * @param sectionPosition
     * Body section placement relative to the main rows.
     */
    private createSection(
        position: SummaryRowPosition,
        sectionPosition: ('before' | 'after')
    ): SummarySection {
        const prefix = Globals.classNamePrefix;
        const tbodyElement = makeHTMLElement('tbody', {
            className: prefix + 'tbody-summary ' + prefix +
                'tbody-summary-' + position
        });
        const section: SummarySection = { position, tbodyElement, rows: [] };

        this.viewport.registerBodySection({
            id: 'summary-' + position,
            position: sectionPosition,
            tbodyElement,
            getRows: (): TableRow[] => section.rows,
            getRowByElement: (element): (TableRow | undefined) =>
                section.rows.find(
                    (row): boolean => row.htmlElement === element
                ),
            getRowById: (): (TableRow | undefined) => void 0
        });

        return section;
    }

    /**
     * Renders the given summary rows into the top and bottom sections.
     *
     * @param summaryRows
     * Resolved summary rows (values, formats, position).
     */
    public async render(summaryRows: SummaryRenderRow[]): Promise<void> {
        await this.renderSection(
            this.top,
            summaryRows.filter((row): boolean => row.position === 'top'),
            true
        );
        await this.renderSection(
            this.bottom,
            summaryRows.filter((row): boolean => row.position !== 'top'),
            false
        );

        this.syncHorizontalScroll(this.viewport.tbodyElement.scrollLeft);
        await this.viewport.syncAriaRowIndexes();
    }

    /**
     * Renders one section's rows, reusing existing rows.
     *
     * @param section
     * Target section.
     *
     * @param summaryRows
     * Rows assigned to the section.
     *
     * @param before
     * Whether the section is inserted before the main body.
     */
    private async renderSection(
        section: SummarySection,
        summaryRows: SummaryRenderRow[],
        before: boolean
    ): Promise<void> {
        const tableElement = this.viewport.tableElement;
        const { tbodyElement, rows } = section;

        section.className = applyUserClassNames(
            tbodyElement,
            section.className,
            this.viewport.grid.options?.rendering?.rows?.summary?.[
                section.position
            ]?.className
        );

        if (
            summaryRows.length &&
            tbodyElement.parentElement !== tableElement
        ) {
            if (before) {
                tableElement.insertBefore(
                    tbodyElement,
                    this.viewport.tbodyElement
                );
            } else {
                tableElement.appendChild(tbodyElement);
            }
        }

        for (let i = 0, iEnd = summaryRows.length; i < iEnd; ++i) {
            let row = rows[i];

            if (!row) {
                row = new SummaryTableRow(this.viewport, i);
                await row.sync(summaryRows[i], i);
                await row.init();
                await row.render();
                tbodyElement.appendChild(row.htmlElement);
                rows[i] = row;
            } else {
                await row.sync(summaryRows[i], i);
                if (!row.htmlElement.isConnected) {
                    tbodyElement.appendChild(row.htmlElement);
                }
            }
        }

        for (let i = rows.length - 1; i >= summaryRows.length; --i) {
            rows[i].destroy();
            rows.length = i;
        }

        if (!rows.length && tbodyElement.parentElement) {
            tbodyElement.remove();
        }
    }

    /**
     * Re-applies per-cell widths and horizontal offset after a reflow.
     */
    public reflow(): void {
        this.reflowSection(this.top);
        this.reflowSection(this.bottom);
        this.syncHorizontalScroll(this.viewport.tbodyElement.scrollLeft);
    }

    /**
     * Reflows a single section's rows.
     *
     * @param section
     * Target section.
     */
    private reflowSection(section: SummarySection): void {
        for (let i = 0, iEnd = section.rows.length; i < iEnd; ++i) {
            section.rows[i].reflow();
        }
    }

    /**
     * Keeps the frozen rows aligned with the main body horizontal scroll.
     *
     * @param scrollLeft
     * Current horizontal scroll offset of the main body.
     */
    public syncHorizontalScroll(scrollLeft: number): void {
        const transform = scrollLeft ? `translateX(${-scrollLeft}px)` : '';

        this.offsetSection(this.top, transform);
        this.offsetSection(this.bottom, transform);
    }

    /**
     * Applies the horizontal offset to a single section.
     *
     * @param section
     * Target section.
     *
     * @param transform
     * Transform to apply to each row.
     */
    private offsetSection(section: SummarySection, transform: string): void {
        section.tbodyElement.scrollLeft = 0;
        for (let i = 0, iEnd = section.rows.length; i < iEnd; ++i) {
            section.rows[i].htmlElement.style.transform = transform;
        }
    }

    /**
     * Unregisters the sections and removes all rendered rows.
     */
    public destroy(): void {
        this.destroySection('top', this.top);
        this.destroySection('bottom', this.bottom);
    }

    /**
     * Destroys a single section.
     *
     * @param position
     * Summary position the section holds.
     *
     * @param section
     * Target section.
     */
    private destroySection(
        position: SummaryRowPosition,
        section: SummarySection
    ): void {
        this.viewport.unregisterBodySection('summary-' + position);

        for (let i = 0, iEnd = section.rows.length; i < iEnd; ++i) {
            section.rows[i].destroy();
        }

        section.rows.length = 0;
        section.tbodyElement.remove();
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryView;
