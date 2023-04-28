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
    iconsURLPrefix:
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@381ddd8/gfx/dashboard-icons/',
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
        customSelectButton: PREFIX + 'custom-option-button',
        toggleContainer: PREFIX + 'toggle-container',
        toggleWrapper: PREFIX + 'toggle-wrapper',
        toggleSlider: PREFIX + 'toggle-slider',
        toggleWrapperColored: PREFIX + 'toggle-wrapper-colored',
        toggleLabels: PREFIX + 'toggle-labels',
        button: PREFIX + 'button',
        sidebarNavButton: PREFIX + 'sidebar-button-nav',
        labelText: PREFIX + 'label-text',
        editSidebarTabBtn: PREFIX + 'sidebar-tab-btn',
        editToolsBtn: PREFIX + 'tools-btn',
        editTools: PREFIX + 'tools',
        editGridItems: PREFIX + 'grid-items',

        // Confirmation popup
        confirmationPopup: PREFIX + 'confirmation-popup',
        popupContentContainer: PREFIX + 'confirmation-popup-content',
        popupConfirmBtn: PREFIX + 'confirmation-popup-confirm-btn',
        popupCloseButton: PREFIX + 'popup-close',

        editOverlay: PREFIX + 'overlay',
        editOverlayActive: PREFIX + 'overlay-active',
        resizerMenuBtnActive: PREFIX + 'resizer-menu-btn-active',
        sidebarCloseButton: PREFIX + 'close-btn',
        editSidebarTabBtnWrapper: PREFIX + 'tabs-buttons-wrapper',
        editSidebarRight: PREFIX + 'sidebar-right',
        editSidebarRightShow: PREFIX + 'sidebar-right-show',
        viewFullscreen: PREFIX + 'view-fullscreen',

        // Accordion
        accordionMenu: PREFIX + 'accordion-menu',
        accordionContainer: PREFIX + 'accordion',
        accordionHeader: PREFIX + 'accordion-header',
        accordionHeaderBtn: PREFIX + 'accordion-header-btn',
        accordionHeaderIcon: PREFIX + 'accordion-header-icon',
        accordionContent: PREFIX + 'accordion-content',
        accordionNestedWrapper: PREFIX + 'accordion-nested',
        accordionMenuButtonsContainer:
            PREFIX + 'accordion-menu-buttons-container',
        accordionMenuButton: PREFIX + 'accordion-menu-button',
        hiddenElement: PREFIX + 'hidden-element',
        collapsableContentHeader: PREFIX + 'collapsable-content-header',

        // Custom dropdown with icons
        dropdown: PREFIX + 'dropdown',
        dropdownContent: PREFIX + 'dropdown-content',
        dropdownButton: PREFIX + 'dropdown-button',
        dropdownButtonContent: PREFIX + 'dropdown-button-content',
        dropdownIcon: PREFIX + 'pointer',
        rotateElement: PREFIX + 'rotate-element',

        icon: PREFIX + 'icon'
    },
    lang: {
        editMode: 'Edit mode',
        style: 'Styles',
        id: 'Id',
        title: 'Title',
        caption: 'Caption',
        chartConfig: 'Chart configuration',
        chartClassName: 'Chart class name',
        chartID: 'Chart ID',
        chartOptions: 'Chart options',
        chartType: 'Chart type',
        pointFormat: 'Point format',
        scaleElements: 'Scale elements',
        confirmDestroyRow: 'Do you want to destroy the row?',
        confirmDestroyCell: 'Do you want to destroy the cell?',
        confirmButton: 'Confirm',
        cancelButton: 'Cancel',
        viewFullscreen: 'View in full screen',
        exitFullscreen: 'Exit full screen',
        on: 'on',
        off: 'off',
        settings: 'Settings',
        addComponent: 'Add component',
        dataLabels: 'Data labels'
    }
};

interface EditGlobals {
    prefix: string;
    iconsURLPrefix: string;
    classNames: EditGlobals.ClassNamesOptions;
    lang: EditGlobals.LangOptions;
}

namespace EditGlobals {
    export interface ClassNamesOptions {
        accordionContainer: string;
        accordionContent: string;
        accordionHeader: string;
        accordionHeaderBtn: string;
        accordionHeaderIcon: string;
        accordionMenu: string;
        accordionMenuButton: string;
        accordionMenuButtonsContainer: string;
        accordionNestedWrapper: string;
        button: string;
        cellEditHighlight: string;
        collapsableContentHeader: string;
        confirmationPopup: string;
        contextDetectionPointer: string;
        contextMenu: string;
        contextMenuBtn: string;
        contextMenuItem: string;
        currentEditedElement: string;
        customSelect: string;
        customSelectButton: string;
        dashboardCellEditHighlightActive: string;
        dragMock: string;
        dropPointer: string;
        dropdown: string;
        dropdownButton: string;
        dropdownButtonContent: string;
        dropdownContent: string;
        dropdownIcon: string;
        editGridItems: string;
        editModeEnabled: string;
        editOverlay: string;
        editOverlayActive: string;
        editSidebar: string;
        editSidebarHide: string;
        editSidebarMenuItem: string;
        editSidebarRight: string;
        editSidebarRightShow: string;
        editSidebarShow: string;
        editSidebarTabBtn: string;
        editSidebarTabBtnWrapper: string;
        editSidebarTitle: string;
        editSidebarWrapper: string;
        editToolbar: string;
        editToolbarCell: string;
        editToolbarCellOutline: string;
        editToolbarItem: string;
        editToolbarRow: string;
        editToolbarRowOutline: string;
        editTools: string;
        editToolsBtn: string;
        hiddenElement: string;
        icon: string;
        labelText: string;
        maskElement: string;
        menu: string;
        menuDestroy: string;
        menuHorizontalSeparator: string;
        menuItem: string;
        menuVerticalSeparator: string;
        popupCloseButton: string;
        popupConfirmBtn: string;
        popupContentContainer: string;
        resizePointer: string;
        resizeSnap: string;
        resizeSnapX: string;
        resizeSnapY: string;
        resizerMenuBtnActive: string;
        rotateElement: string;
        rowContextHighlight: string;
        separator: string;
        sidebarCloseButton: string;
        sidebarNavButton: string;
        toggleContainer: string;
        toggleLabels: string;
        toggleSlider: string;
        toggleWrapper: string;
        toggleWrapperColored: string;
        viewFullscreen: string;
    }

    export interface LangOptions {
        chartConfig: string;
        editMode: string;
        style: string;
        chartOptions: string;
        chartType: string;
        id: string;
        title: string;
        caption: string;
        chartClassName: string;
        chartID: string;
        pointFormat: string;
        scaleElements: string;
        confirmDestroyRow: string;
        confirmDestroyCell: string;
        confirmButton: string;
        cancelButton: string;
        viewFullscreen: string;
        exitFullscreen: string;
        on: string;
        off: string;
        settings: string;
        addComponent: string;
        dataLabels: string;
        [key: string]: string;
    }

    export type TLangKeys = 'editMode'|'verticalSeparator';
}

export default EditGlobals;
