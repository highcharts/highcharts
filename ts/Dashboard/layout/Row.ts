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
        this.columns = [];

        this.setRowContainer();
        this.setColumns();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Row.Options;
    public layout: Layout;
    public columns: Array<Column>;
    public container?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */
    public setRowContainer(): void {
        const row = this,
            layout = row.layout,
            renderer = layout.dashboard.renderer;

        if (layout.dashboard.guiEnabled) {
            if (renderer && layout.container) {
                // Generate row HTML structure.
                this.container = renderer.renderRow(
                    row,
                    layout.container
                );
            }
        } else {
            // this.container = from user gui
        }
    }
    /**
     * setColumns
     */
    public setColumns(): void {
        const row = this,
            rowsOptions = row.options.columns;

        let rowOptions;

        for (let i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
            rowOptions = rowsOptions[i];
            row.addColumn(rowOptions);
        }

    }
    /**
     * addColumn
     */
    public addColumn(options: Column.Options): Column {
        const row = this,
            column = new Column(
                row,
                options
            );

        row.columns.push(column);

        return column;
    }
}

namespace Row {
    export interface Options {
        id?: string;
        columns: Array<Column.Options>;
    }
}

export default Row;
