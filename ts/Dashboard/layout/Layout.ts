import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import Row from './Row.js';
import Dashboard from './../Dashboard.js';

import U from '../../Core/Utilities.js';

const {
    error
} = U;

class Layout {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        dashboard: Dashboard,
        options: Layout.Options
    ) {
        this.options = options;
        this.dashboard = dashboard;
        this.rows = [];

        this.setLayoutContainer();
        this.setRows();
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Layout.Options;
    public dashboard: Dashboard;
    public rows: Array<Row>;
    public container?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */
    public setLayoutContainer(): void {
        /*
        * TODO
        *
        *
        * 2. Create layout structure
        *
        */

        const layout = this,
            dashboard = layout.dashboard,
            renderer = layout.dashboard.renderer;

        if (dashboard.guiEnabled) {
            if (renderer) {
                // Generate layout HTML structure.
                this.container = renderer.renderLayout(
                    layout.dashboard.container
                );
            } else {
                // Throw an error - GUIRenderer module required!
                error(33, true);
            }
        } else {
            // this.container = from user gui
        }
    }

    public setRows(): void {
        const layout = this,
            rowsOptions = layout.options.rows;

        let rowOptions;

        for (let i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
            rowOptions = rowsOptions[i];

            layout.addRow(rowOptions);
        }
    }

    public addRow(options: Row.Options): Row {
        const layout = this,
            row = new Row(
                layout,
                options
            );

        layout.rows.push(row);

        return row;
    }
}

interface Layout {
    options: Layout.Options;
}
namespace Layout {
    export interface Options {
        id?: string;
        rowClassName: string;
        columnClassName: string;
        rows: Array<Row.Options>;
    }
}

export default Layout;
