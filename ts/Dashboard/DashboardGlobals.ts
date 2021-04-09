/**
 *
 * Prefix of a GUIElement HTML class name.
 *
 */
const PREFIX = 'hcd-';

const DashboardGlobals: DashboardGlobals = {
    prefix: PREFIX,
    classNames: {
        layout: PREFIX + 'layout',
        cell: PREFIX + 'cell',
        row: PREFIX + 'row'
    }
};

interface DashboardGlobals {
    prefix: string;
    classNames: EditGlobals.ClassNamesOptions;
}

namespace EditGlobals {
    export interface ClassNamesOptions {
        layout: string;
        cell: string;
        row: string;
    }
}

export default DashboardGlobals;
