import Row from './Row.js';
import Dashboard from '../Dashboard.js';
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
        this.setInnerElements(dashboard.guiEnabled);
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
