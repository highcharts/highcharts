import Row from './Row.js';
import Dashboard from './../Dashboard.js';
import GUIElement from './GUIElement.js';

class Layout extends GUIElement {
    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        dashboard: Dashboard,
        options: Layout.Options
    ) {
        super(options);

        this.dashboard = dashboard;
        this.rows = [];

        // GUI structure
        this.setElementContainer(dashboard.guiEnabled, dashboard.container);
        this.setRows();
    }

    /* *
    *
    *  Properties
    *
    * */
    public dashboard: Dashboard;
    public rows: Array<Row>;

    /* *
    *
    *  Functions
    *
    * */
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
