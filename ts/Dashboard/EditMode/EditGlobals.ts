const PREFIX = 'hcd-edit-';

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
        editToolbarOutline: PREFIX + 'toolbar-outline',
        editToolbarItem: PREFIX + 'toolbar-item',
        editToolbarRow: PREFIX + 'toolbar-row',
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
        popupConfirmBtn: PREFIX + 'popup-confirm-btn'
    },
    lang: {
        editMode: 'Edit mode',
        saveLocal: 'Save locally'
    }
};

interface EditGlobals {
    prefix: string;
    iconsURL: string;
    classNames: EditGlobals.ClassNamesOptions;
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
        editToolbarOutline: string;
        editToolbarItem: string;
        editToolbarRow: string;
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
    }

    export interface LangOptions {
        editMode?: string;
        saveLocal?: string;
    }

    export type TLangKeys = 'editMode'|'saveLocal'|'verticalSeparator';
}

export default EditGlobals;
