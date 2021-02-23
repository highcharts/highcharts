import Row from './Row.js';
import U from '../../Core/Utilities.js';
var error = U.error;
var Layout = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Layout(dashboard, options) {
        this.options = options;
        this.dashboard = dashboard;
        this.rows = [];
        // GUI structure
        this.setLayoutContainer();
        this.setRows();
    }
    /* *
    *
    *  Functions
    *
    * */
    Layout.prototype.setLayoutContainer = function () {
        var layout = this, dashboard = layout.dashboard, renderer = layout.dashboard.renderer;
        if (dashboard.guiEnabled) {
            if (renderer) {
                // Generate layout HTML structure.
                this.container = renderer.renderLayout(layout.dashboard.container);
            }
            else {
                // Throw an error - GUIRenderer module required!
                error(33, true);
            }
        }
        else {
            var layoutId = layout.options.id;
            if (layoutId) {
                var layoutContainer = document.getElementById(layoutId);
                if (layoutContainer) {
                    this.container = layoutContainer;
                }
            }
        }
    };
    Layout.prototype.setRows = function () {
        var layout = this, rowsOptions = layout.options.rows || [];
        var rowOptions, rowsElements, rowElement, i, iEnd;
        if (layout.dashboard.guiEnabled) {
            for (i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
                rowOptions = rowsOptions[i];
                layout.addRow(rowOptions);
            }
        }
        else if (layout.container) {
            rowsElements = layout.container.getElementsByClassName(layout.options.rowClassName);
            for (i = 0, iEnd = rowsElements.length; i < iEnd; ++i) {
                rowElement = rowsElements[i];
                if (rowElement instanceof HTMLElement) { // @ToDo check if this is enough
                    layout.addRow({}, rowElement);
                }
            }
        }
    };
    Layout.prototype.addRow = function (options, rowElement) {
        var layout = this, row = new Row(layout, options, rowElement);
        layout.rows.push(row);
        return row;
    };
    return Layout;
}());
export default Layout;
