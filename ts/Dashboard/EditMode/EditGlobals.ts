/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

import DG from '../Globals.js';

const PREFIX = DG.classNamePrefix + 'edit-';

const EditGlobals: EditGlobals = {
    prefix: PREFIX,
    iconsURL: 'https://code.highcharts.com/@product.version@/gfx/dashboard-icons/',
    classNames: {
        resizeSnap: PREFIX + 'resize-snap',
        resizeSnapX: PREFIX + 'resize-snap-x',
        resizeSnapY: PREFIX + 'resize-snap-y',
        separator: PREFIX + 'separator',
        contextMenuBtn: PREFIX + 'context-menu-btn',
        contextMenu: PREFIX + 'context-menu',
        contextMenuItem: PREFIX + 'context-menu-item',
        editModeEnabled: PREFIX + 'enabled',
        editToolbar: PREFIX + 'toolbar',
        editToolbarCellOutline: PREFIX + 'toolbar-cell-outline',
        editToolbarRowOutline: PREFIX + 'toolbar-row-outline',
        editToolbarItem: PREFIX + 'toolbar-item',
        editToolbarRow: PREFIX + 'toolbar-row',
        editToolbarCell: PREFIX + 'toolbar-cell',
        editSidebar: PREFIX + 'sidebar',
        editSidebarShow: PREFIX + 'sidebar-show',
        editSidebarHide: PREFIX + 'sidebar-hide',
        editSidebarTitle: PREFIX + 'sidebar-title',
        editSidebarTab: PREFIX + 'sidebar-tab',
        editSidebarTabContainer: PREFIX + 'sidebar-tab-wrapper',
        editSidebarTabsContainer: PREFIX + 'sidebar-tabs',
        editSidebarTabContent: PREFIX + 'sidebar-tab-content',
        editSidebarTabActive: PREFIX + 'toolbar-tab-active',
        editSidebarMenuItem: PREFIX + 'sidebar-item',
        rowContextHighlight: PREFIX + 'row-context-highlight',
        cellEditHighlight: PREFIX + 'cell-highlight',
        dashboardCellEditHighlightActive: PREFIX + 'cell-highlight-active',
        dragMock: PREFIX + 'drag-mock',
        dropPointer: PREFIX + 'drop-pointer',
        contextDetectionPointer: PREFIX + 'ctx-detection-pointer',
        resizePointer: PREFIX + 'resize-pointer',
        currentEditedElement: PREFIX + 'unmask',
        maskElement: PREFIX + 'mask',
        menuItem: PREFIX + 'menu-item',
        menu: PREFIX + 'menu',
        menuVerticalSeparator: PREFIX + 'menu-vertical-separator',
        menuHorizontalSeparator: PREFIX + 'menu-horizontal-separator',
        menuDestroy: PREFIX + 'menu-destroy',
        editSidebarWrapper: PREFIX + 'sidebar-wrapper',
        customSelect: PREFIX + 'custom-select',
        toggleWrapper: PREFIX + 'toggle-wrapper',
        toggleSlider: PREFIX + 'toggle-slider',
        button: PREFIX + 'button',
        sidebarNavButton: PREFIX + 'sidebar-button-nav',
        labelText: PREFIX + 'label-text',
        editSidebarTabBtn: PREFIX + 'sidebar-tab-btn',
        editToolsBtn: PREFIX + 'tools-btn',
        editTools: PREFIX + 'tools',
        editGridItems: PREFIX + 'grid-items',
        popupContentContainer: PREFIX + 'popup-content',
        popupConfirmBtn: PREFIX + 'popup-confirm-btn',
        editOverlay: PREFIX + 'overlay',
        editOverlayActive: PREFIX + 'overlay-active',
        resizerMenuBtnActive: PREFIX + 'resizer-menu-btn-active',
        sidebarCloseButton: PREFIX + 'close-btn',
        editSidebarTabBtnWrapper: PREFIX + 'tabs-buttons-wrapper',
        editSidebarRight: PREFIX + 'sidebar-right',
        editSidebarRightShow: PREFIX + 'sidebar-right-show',
        viewFullscreen: PREFIX + 'view-fullscreen'
    },
    lang: {
        editMode: 'Edit mode',
        style: 'Styles',
        chartOptions: 'Chart options',
        id: 'Id',
        title: 'Title',
        caption: 'Caption',
        chartClassName: 'Chart class name',
        chartID: 'Chart id',
        scaleElements: 'Scale elements',
        confirmDestroyRow: 'Do you want to destroy the row?',
        confirmDestroyCell: 'Do you want to destroy the cell?',
        confirmButton: 'Confirm',
        cancelButton: 'Cancel',
        viewFullscreen: 'View in full screen',
        exitFullscreen: 'Exit full screen'
    }
};

interface EditGlobals {
    prefix: string;
    iconsURL: string;
    classNames: Record<string, string>;
    lang: EditGlobals.LangOptions;
}

namespace EditGlobals {
    export interface ClassNamesOptions {
        resizeSnap: string;
        resizeSnapX: string;
        resizeSnapY: string;
        separator: string;
        contextMenuBtn: string;
        contextMenu: string;
        contextMenuItem: string;
        editModeEnabled: string;
        editToolbar: string;
        editToolbarCellOutline: string;
        editToolbarRowOutline: string;
        editToolbarItem: string;
        editToolbarRow: string;
        editToolbarCell: string;
        editSidebar: string;
        editSidebarShow: string;
        editSidebarHide: string;
        editSidebarTitle: string;
        editSidebarTab: string;
        editSidebarTabContainer: string;
        editSidebarTabsContainer: string;
        editSidebarTabContent: string;
        editSidebarTabActive: string;
        editSidebarMenuItem: string;
        rowContextHighlight: string;
        cellEditHighlight: string;
        dashboardCellEditHighlightActive: string;
        dragMock: string;
        dropPointer: string;
        contextDetectionPointer: string;
        resizePointer: string;
        maskElement: string;
        currentEditedElement: string;
        menuItem: string;
        menu: string;
        menuVerticalSeparator: string;
        menuHorizontalSeparator: string;
        menuDestroy: string;
        editSidebarWrapper: string;
        customSelect: string;
        toggleWrapper: string;
        toggleSlider: string;
        button: string;
        labelText: string;
        sidebarNavButton: string;
        editSidebarTabBtn: string;
        editToolsBtn: string;
        editTools: string;
        editGridItems: string;
        popupContentContainer: string;
        popupConfirmBtn: string;
        editOverlay: string;
        resizerMenuBtnActive: string;
        sidebarCloseButton: string;
        editSidebarTabBtnWrapper: string;
        editSidebarRight: string;
        editSidebarRightShow: string;
    }

    export interface LangOptions {
        editMode?: string;
        style?: string;
        chartOptions?: string;
        id?: string;
        title?: string;
        caption?: string;
        chartClassName?: string;
        chartID?: string;
        scaleElements?: string;
        confirmDestroyRow?: string;
        confirmDestroyCell?: string;
        confirmButton?: string;
        cancelButton?: string;
        viewFullscreen?: string;
        exitFullscreen?: string;
    }

    export type TLangKeys = 'editMode'|'verticalSeparator';
}

export default EditGlobals;
