const PREFIX = 'highcharts-dashboard-edit-';

const EditGlobals: EditGlobals = {
    prefix: PREFIX,
    resizeHandler: PREFIX + 'resize-handler',
    separator: PREFIX + 'separator',
    enableEditModeItem: PREFIX + 'item-enable',
    saveLocalItem: PREFIX + 'item-save-local',
    contextMenuBtn: PREFIX + 'context-menu-btn',
    contextMenu: PREFIX + 'context-menu',
    contextMenuItem: PREFIX + 'context-menu-item',
    editModeEnabled: PREFIX + 'enabled'
};

interface EditGlobals {
    prefix: string;
    resizeHandler: string;
    separator: string;
    enableEditModeItem: string;
    saveLocalItem: string;
    contextMenuBtn: string;
    contextMenu: string;
    contextMenuItem: string;
    editModeEnabled: string;
}

export default EditGlobals;
