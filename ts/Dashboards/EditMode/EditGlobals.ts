/* *
 *
 *  (c) 2009-2024 Highsoft AS
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

/**
 * @internal
 */
const EditGlobals: EditGlobals = {
    classNames: {
        resizeSnap: PREFIX + 'resize-snap',
        resizeSnapX: PREFIX + 'resize-snap-x',
        resizeSnapY: PREFIX + 'resize-snap-y',
        separator: PREFIX + 'separator',
        contextMenuBtn: PREFIX + 'context-menu-btn',
        contextMenuBtnText: PREFIX + 'context-menu-btn-text',
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
        editSidebarHeader: PREFIX + 'sidebar-header',
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
        popupButtonContainer: PREFIX + 'confirmation-popup-button-container',
        popupContentContainer: PREFIX + 'confirmation-popup-content',
        popupCancelBtn: PREFIX + 'confirmation-popup-cancel-btn',
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
        standaloneElement: PREFIX + 'standalone-element',

        // Custom dropdown with icons
        collapsedElement: PREFIX + 'collapsed-element',
        dropdown: PREFIX + 'dropdown',
        dropdownContent: PREFIX + 'dropdown-content',
        dropdownButton: PREFIX + 'dropdown-button',
        dropdownButtonContent: PREFIX + 'dropdown-button-content',
        dropdownIcon: PREFIX + 'pointer',
        icon: PREFIX + 'icon'
    },
    lang: {
        accessibility: {
            contextMenu: {
                button: 'Context menu'
            },
            editMode: {
                editMode: 'Edit mode toggle button'
            }
        },
        addComponent: 'Add component',
        cancelButton: 'Cancel',
        caption: 'Caption',
        chartClassName: 'Chart class name',
        chartConfig: 'Chart configuration',
        chartID: 'Chart ID',
        chartOptions: 'Chart options',
        chartType: 'Chart type',
        connectorName: 'Connector name',
        confirmButton: 'Confirm',
        confirmDestroyCell: 'Do you really want to destroy the cell?',
        confirmDestroyRow: 'Do you really want to destroy the row?',
        confirmDiscardChanges: 'Do you really want to discard the changes?',
        dataLabels: 'Data labels',
        editMode: 'Edit mode',
        errorMessage: 'Something went wrong',
        exitFullscreen: 'Exit full screen',
        htmlInput: 'HTML',
        id: 'Id',
        off: 'off',
        on: 'on',
        pointFormat: 'Point format',
        settings: 'Settings',
        style: 'Styles',
        title: 'Title',
        viewFullscreen: 'View in full screen',
        sidebar: {
            HTML: 'HTML',
            row: 'Row',
            Highcharts: 'Highcharts',
            DataGrid: 'DataGrid',
            KPI: 'KPI'
        }
    }
};

/**
 * @internal
 */
interface EditGlobals {
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
        contextMenuBtnText: string;
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
        editSidebarHeader: string;
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
        popupCancelBtn: string;
        popupConfirmBtn: string;
        popupButtonContainer: string;
        popupContentContainer: string;
        resizePointer: string;
        resizeSnap: string;
        resizeSnapX: string;
        resizeSnapY: string;
        resizerMenuBtnActive: string;
        collapsedElement: string;
        rowContextHighlight: string;
        separator: string;
        sidebarCloseButton: string;
        sidebarNavButton: string;
        standaloneElement: string;
        toggleContainer: string;
        toggleLabels: string;
        toggleSlider: string;
        toggleWrapper: string;
        toggleWrapperColored: string;
        viewFullscreen: string;
    }

    export interface LangOptions {
        /**
         * Accessibility language options for the dashboard.
         */
        accessibility: EditGlobals.LangAccessibilityOptions;
        /**
         * @default 'Add component'
         */
        addComponent: string;
        /**
         * @default 'Cancel'
         */
        cancelButton: string;
        /**
         * @default 'Caption'
         */
        caption: string;
        /**
         * @default 'Chart class name'
         */
        chartClassName: string;
        /**
         * @default 'Chart configuration'
         */
        chartConfig: string;
        /**
         * @default 'Chart ID'
         */
        chartID: string;
        /**
         * @default 'Chart options'
         */
        chartOptions: string;
        /**
         * @default 'Chart type'
         */
        chartType: string;
        /**
         * @default 'Connector name'
         */
        connectorName: string;
        /**
         * @default 'Confirm'
         */
        confirmButton: string;
        /**
         * @default 'Do you really want to destroy the cell?'
         */
        confirmDestroyCell: string;
        /**
         * @default 'Do you really want to destroy the row?'
         */
        confirmDestroyRow: string;
        /**
         * @default 'Do you really want to discard the changes?'
         */
        confirmDiscardChanges: string;
        /**
         * @default 'Data labels'
         */
        dataLabels: string;
        /**
         * @default 'Edit mode'
         */
        editMode: string;
        /**
         * @default 'Something went wrong'
         */
        errorMessage: string;
        /**
         * @default 'Exit full screen'
         */
        exitFullscreen: string;
        /**
         * @default 'Id'
         */
        id: string;
        /**
         * @default 'off'
         */
        off: string;
        /**
         * @default 'on'
         */
        on: string;
        /**
         * @default 'Point format'
         */
        pointFormat: string;
        /**
         * @default 'Settings'
         */
        settings: string;
        /**
         * Options for the sidebar and its components.
         */
        sidebar:SidebarLangOptions
        /**
         * @default 'Styles'
         */
        style: string;
        /**
         * @default 'Title'
         */
        title: string;
        /**
         * @default 'View in full screen'
         */
        viewFullscreen: string;
        [key: string]: any;
    }

    export interface SidebarLangOptions {
        [key: string]: string;
        /**
         * @default 'HTML'
         */
        HTML: string;
        /**
         * @default 'Row'
         */
        row: string;
        /**
         * @default 'Highcharts'
         */
        Highcharts: string;
        /**
         * @default 'DataGrid'
         */
        DataGrid: string;
        /**
         * @default 'KPI'
         */
        KPI: string;
    }

    export interface LangAccessibilityOptions {
        contextMenu: LangAccessibilityOptionsContextMenu;
        editMode: LangAccessibilityOptionsEditMode;
    }

    export interface LangAccessibilityOptionsContextMenu {
        [key: string]: string;

        /**
         * @default 'Context menu'
         */
        button: string;
    }

    export interface LangAccessibilityOptionsEditMode {
        [key: string]: string;

        /**
         * @default 'Edit mode'
         */
        editMode: string;
    }

    export type TLangKeys = 'editMode' | 'verticalSeparator';
}

export default EditGlobals;
