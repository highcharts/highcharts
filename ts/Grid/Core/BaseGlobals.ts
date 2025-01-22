/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Class
 *
 * */

/**
 * Common globals namespace for all Grid-based modules.
 */
class BaseGlobals {

    /* *
    *
    *  Static Properties
    *
    * */

    protected static rawClassNames = {
        container: 'container',
        tableElement: 'table',
        captionElement: 'caption',
        descriptionElement: 'description',
        theadElement: 'thead',
        tbodyElement: 'tbody',
        rowElement: 'row',
        rowEven: 'row-even',
        rowOdd: 'row-odd',
        hoveredRow: 'hovered-row',
        columnElement: 'column',
        hoveredCell: 'hovered-cell',
        hoveredColumn: 'hovered-column',
        syncedRow: 'synced-row',
        syncedCell: 'synced-cell',
        syncedColumn: 'synced-column',
        editedCell: 'edited-cell',
        mockedCell: 'mocked-cell',
        rowsContentNowrap: 'rows-content-nowrap',
        virtualization: 'virtualization',
        scrollableContent: 'scrollable-content',
        headerCell: 'header-cell',
        headerCellContent: 'header-cell-content',
        headerRow: 'head-row-content',
        noData: 'no-data',
        columnFirst: 'column-first',
        columnSortable: 'column-sortable',
        columnSortableIcon: 'column-sortable-icon',
        columnSortedAsc: 'column-sorted-asc',
        columnSortedDesc: 'column-sorted-desc',
        resizerWrapper: 'resizer-content',
        resizerHandles: 'column-resizer',
        resizedColumn: 'column-resized',
        creditsContainer: 'credits-container',
        creditsText: 'credits',
        visuallyHidden: 'visually-hidden',
        lastHeaderCellInRow: 'last-header-cell-in-row',
        loadingWrapper: 'loading-wrapper',
        loadingSpinner: 'spinner',
        loadingMessage: 'loading-message'
    } as const;


    /* *
     *
     *  Properties
     *
     * */

    public readonly classNamePrefix: string;
    public readonly win: Window;
    public readonly userAgent: string;
    public readonly isChrome: boolean;
    public readonly isSafari: boolean;


    /* *
     *
     *  Constructors
     *
     * */

    public constructor(classNamePrefix: string) {
        this.classNamePrefix = classNamePrefix;
        this.win = window;
        this.userAgent = (window.navigator && window.navigator.userAgent) || '';
        this.isChrome = this.userAgent.indexOf('Chrome') !== -1;
        this.isSafari =
            !this.isChrome && this.userAgent.indexOf('Safari') !== -1;
    }


    /* *
     *
     * Functions
     *
     * */

    public getClassName(key: keyof typeof BaseGlobals.rawClassNames): string {
        return this.classNamePrefix + BaseGlobals.rawClassNames[key];
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default BaseGlobals;
