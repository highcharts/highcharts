const PREFIX = 'highcharts-dashboard-edit-';

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
        editToolbarItem: PREFIX + 'toolbar-item',
        editToolbarOptions: PREFIX + 'toolbar-options',
        editToolbarOptionsShow: PREFIX + 'toolbar-show',
        editToolbarOptionsHide: PREFIX + 'toolbar-hide',
        disabledNotEditedCells: PREFIX + 'hidden-cells',
        disabledNotEditedRows: PREFIX + 'hidden-rows',
        currentEditedCell: PREFIX + 'current-cell',
        currentEditedRow: PREFIX + 'current-row',
        editRow: PREFIX + 'toolbar-row',
        menuItem: PREFIX + 'menu-item',
        menu: PREFIX + 'menu',
        menuVerticalSeparator: PREFIX + 'menu-vertical-separator',
        menuHorizontalSeparator: PREFIX + 'menu-horizontal-separator',
        menuDestroy: PREFIX + 'menu-destroy',
        layoutToolbarSpace: PREFIX + 'layout-toolbar-space'
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
        editToolbarItem: string;
        editToolbarOptions: string;
        editToolbarOptionsShow: string;
        editToolbarOptionsHide: string;
        disabledNotEditedCells: string;
        disabledNotEditedRows: string;
        currentEditedCell: string;
        currentEditedRow: string;
        editRow: string;
        menuItem: string;
        menu: string;
        menuVerticalSeparator: string;
        menuHorizontalSeparator: string;
        menuDestroy: string;
        layoutToolbarSpace: string;
    }

    export interface LangOptions {
        editMode?: string;
        saveLocal?: string;
    }

    export type TLangKeys = 'editMode'|'saveLocal'|'verticalSeparator';
}

export default EditGlobals;
