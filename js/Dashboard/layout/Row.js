import Column from './Column.js';
import U from '../../Core/Utilities.js';
var error = U.error;
var Row = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Row(layout, options) {
        this.options = options;
        this.layout = layout;
        this.columns = [];
        this.setRowContainer();
        this.setColumns();
    }
    /* *
    *
    *  Functions
    *
    * */
    Row.prototype.setRowContainer = function () {
        var row = this, layout = row.layout, renderer = layout.dashboard.renderer;
        if (layout.dashboard.guiEnabled) {
            if (renderer && layout.container) {
                // Generate row HTML structure.
                this.container = renderer.renderRow(row, layout.container);
            }
        }
        else {
            // this.container = from user gui
        }
    };
    /**
     * setColumns
     */
    Row.prototype.setColumns = function () {
        var row = this, rowsOptions = row.options.columns;
        var rowOptions;
        for (var i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
            rowOptions = rowsOptions[i];
            row.addColumn(rowOptions);
        }
    };
    /**
     * addColumn
     */
    Row.prototype.addColumn = function (options) {
        var row = this, column = new Column(row, options);
        row.columns.push(column);
        return column;
    };
    return Row;
}());
export default Row;
