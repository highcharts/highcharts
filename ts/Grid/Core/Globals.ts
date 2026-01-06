/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Declarations
 *
 * */

export type DeepRequired<T> = {
    [K in keyof T]-?: DeepRequired<T[K]>;
};

export type ClassNameKey = keyof typeof rawClassNames;


/* *
 *
 *  Constants
 *
 * */

export const classNamePrefix: string = 'hcg-';
export const version = '@product.version@';

export const rawClassNames = {
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
    mockedRow: 'mocked-row',
    rowsContentNowrap: 'rows-content-nowrap',
    virtualization: 'virtualization',
    scrollableContent: 'scrollable-content',
    headerCell: 'header-cell',
    headerCellContainer: 'header-cell-container',
    headerCellContent: 'header-cell-content',
    headerCellFilterIcon: 'header-cell-filter-icon',
    headerCellIcons: 'header-cell-icons',
    headerCellSortIcon: 'header-cell-sort-icon',
    headerCellMenuIcon: 'header-cell-menu-icon',
    headerRow: 'head-row-content',
    noData: 'no-data',
    noPadding: 'no-padding',
    columnFirst: 'column-first',
    columnSortable: 'column-sortable',
    columnSortableIcon: 'column-sortable-icon',
    columnSortedAsc: 'column-sorted-asc',
    columnSortedDesc: 'column-sorted-desc',
    resizableContent: 'resizable-content',
    resizerHandles: 'column-resizer',
    resizedColumn: 'column-resized',
    creditsContainer: 'credits-container',
    creditsText: 'credits',
    creditsPro: 'credits-pro',
    visuallyHidden: 'visually-hidden',
    lastHeaderCellInRow: 'last-header-cell-in-row',
    loadingWrapper: 'loading-wrapper',
    loadingSpinner: 'spinner',
    loadingMessage: 'loading-message',
    popup: 'popup',
    button: 'button',
    buttonSelected: 'button-selected',
    input: 'input',
    icon: 'icon',
    iconSearch: 'icon-search',
    popupContent: 'popup-content',
    columnFilterWrapper: 'column-filter-wrapper',
    toolbarButtonActiveIndicator: 'active-indicator',
    menuContainer: 'menu-container',
    menuItem: 'menu-item',
    menuHeader: 'menu-header',
    menuHeaderCategory: 'menu-header-category',
    menuHeaderName: 'menu-header-name',
    menuItemIcon: 'menu-item-icon',
    menuItemLabel: 'menu-item-label',
    menuDivider: 'menu-divider',
    clearFilterButton: 'clear-filter-button',
    paginationWrapper: 'pagination-wrapper',
    paginationContainer: 'pagination-container',
    paginationPageInfo: 'pagination-info',
    paginationControlsContainer: 'pagination-controls-container',
    paginationNavButtonsContainer: 'pagination-nav-buttons-container',
    paginationNavDropdown: 'pagination-nav-dropdown',
    paginationPageSize: 'pagination-page-size',
    noWidth: 'no-width',
    rightAlign: 'right',
    centerAlign: 'center',
    leftAlign: 'left'
} as const;

export const win = window;
export const composed: Array<string> = [];
export const userAgent = (win.navigator && win.navigator.userAgent) || '';
export const isChrome = userAgent.indexOf('Chrome') !== -1;
export const isSafari = !isChrome && userAgent.indexOf('Safari') !== -1;
export const getClassName = (classNameKey: ClassNameKey): string =>
    classNamePrefix + rawClassNames[classNameKey];


/* *
 *
 *  Default Export
 *
 * */

export default {
    classNamePrefix,
    version,
    rawClassNames,
    win,
    composed,
    userAgent,
    isChrome,
    isSafari,
    getClassName
} as const;
