import GUIElement from './Layout/GUIElement';

/**
 *
 * Prefix of a GUIElement HTML class name.
 *
 */
const PREFIX = 'hcd-';

const DashboardGlobals: DashboardGlobals = {
    prefix: PREFIX,
    guiElementType: {
        row: 'row',
        cell: 'cell',
        layout: 'layout'
    },
    respoBreakpoints: {
        small: 'small',
        medium: 'medium',
        large: 'large'
    },
    classNames: {
        layout: PREFIX + 'layout',
        cell: PREFIX + 'cell',
        row: PREFIX + 'row',
        layoutsWrapper: PREFIX + 'layouts-wrapper'
    }
};

interface DashboardGlobals {
    prefix: string;
    guiElementType: Record<string, GUIElement.GUIElementType>;
    respoBreakpoints: Record<string, string>;
    classNames: EditGlobals.ClassNamesOptions;
}

namespace EditGlobals {
    export interface ClassNamesOptions {
        layout: string;
        cell: string;
        row: string;
        layoutsWrapper: string;
    }
}

export default DashboardGlobals;
