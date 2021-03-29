const PREFIX = 'highcharts-dashboard-edit-';

const EditGlobals: EditGlobals = {
    prefix: PREFIX,
    classNames: {
        resizeHandler: PREFIX + 'resize-handler',
        separator: PREFIX + 'separator',
        enableEditModeItem: PREFIX + 'item-enable',
        saveLocalItem: PREFIX + 'item-save-local',
        contextMenuBtn: PREFIX + 'context-menu-btn',
        contextMenu: PREFIX + 'context-menu',
        contextMenuItem: PREFIX + 'context-menu-item',
        editModeEnabled: PREFIX + 'enabled'
    },
    lang: {
        editMode: 'Edit mode',
        saveLocal: 'Save locally'
    }
};

interface EditGlobals {
    prefix: string;
    classNames: EditGlobals.ClassNamesOptions;
    lang: EditGlobals.LangOptions;
}

namespace EditGlobals {
    export interface ClassNamesOptions {
        resizeHandler: string;
        separator: string;
        enableEditModeItem: string;
        saveLocalItem: string;
        contextMenuBtn: string;
        contextMenu: string;
        contextMenuItem: string;
        editModeEnabled: string;
    }

    export interface LangOptions {
        editMode?: string;
        saveLocal?: string;
    }

    export type TLangKeys = 'editMode'|'saveLocal'|'separator';
}

export default EditGlobals;
