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
        this.setLayoutContainer();
        this.setRows();
    }
    /* *
    *
    *  Functions
    *
    * */
    Layout.prototype.setLayoutContainer = function () {
        /*
        * TODO
        *
        *
        * 2. Create layout structure
        *
        */
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
        var rowOptions;
        for (var i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
            rowOptions = rowsOptions[i];
            layout.addRow(rowOptions);
        }
    };
    Layout.prototype.addRow = function (options) {
        var layout = this, row = new Row(layout, options);
        layout.rows.push(row);
        return row;
    };
    return Layout;
}());
export default Layout;
