import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import Row from './Row.js';
import Dashboard from './../Dashboard.js';
import Bindings from './Bindings.js';

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

        // GUI structure
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
            const layoutId = layout.options.id;

            if (layoutId) {
                const layoutContainer = document.getElementById(layoutId);

                if (layoutContainer) {
                    this.container = layoutContainer;
                }
            }
        }
    }

    public setRows(): void {
        const layout = this,
            rowsOptions = layout.options.rows || [];

        let rowOptions,
            rowsElements,
            rowElement,
            i, iEnd;

        if (layout.dashboard.guiEnabled) {
            for (i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
                rowOptions = rowsOptions[i];
                layout.addRow(rowOptions);
            }
        } else if (layout.container) {
            rowsElements = layout.container.getElementsByClassName(layout.options.rowClassName);

            for (i = 0, iEnd = rowsElements.length; i < iEnd; ++i) {
                rowElement = rowsElements[i];

                if (rowElement instanceof HTMLElement) { // @ToDo check if this is enough
                    layout.addRow({}, rowElement);
                }
            }
        }
    }

    public addRow(
        options: Row.Options,
        rowElement?: HTMLElement
    ): Row {
        const layout = this,
            row = new Row(layout, options, rowElement);

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
