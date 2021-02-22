import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import Layout from './Layout.js';
import Column from './Column.js';
import U from '../../Core/Utilities.js';

const {
    error
} = U;

class Row {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        layout: Layout,
        options: Row.Options
    ) {
        this.options = options;
        this.layout = layout;

        this.setRowContainer(layout.dashboard.options.gui.enabled);
        // this.setColumns();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Row.Options;
    public layout: Layout;
    public container?: HTMLDOMElement;

    public setRowContainer(renderHTML?: boolean): void {
        const row = this,
            layout = row.layout,
            renderer = layout.dashboard.renderer;

        if (renderHTML) {
            if (renderer && layout.container) {
                // Generate row HTML structure.
                this.container = renderer.renderRow(
                    layout.container
                );
            } else {
                // Throw an error - GUIRenderer module required!
                error(33, true);
            }
        } else {
            // this.container = from user gui
        }
    }

    // public setColumns(): void {}
    // public addColumn(options: Column.Options): Column {
}

namespace Row {
    export interface Options {
        id?: string;
        columns: Array<Column.Options>;
    }
}

export default Row;
