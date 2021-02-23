import Column from './Column.js';
import U from '../../Core/Utilities.js';
var error = U.error;
var Row = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Row(layout, options, rowElement) {
        this.options = options;
        this.layout = layout;
        this.columns = [];
        this.setRowContainer(rowElement);
        this.setColumns();
    }
    /* *
    *
    *  Functions
    *
    * */
    Row.prototype.setRowContainer = function (rowElement) {
        var row = this, layout = row.layout, renderer = layout.dashboard.renderer;
        // @ToDo use try catch block
        if (layout.dashboard.guiEnabled && !rowElement) {
            if (renderer && layout.container) {
                // Generate row HTML structure.
                row.container = renderer.renderRow(row, layout.container);
            }
            else {
                // Error
            }
        }
        else if (rowElement instanceof HTMLElement) { // @ToDo check if this is enough
            row.container = rowElement;
        }
        else {
            // Error
        }
    };
    /**
     * setColumns
     */
    Row.prototype.setColumns = function () {
        var row = this, layout = row.layout, columnsOptions = row.options.columns || [];
        var columnOptions, columnsElements, columnElement, i, iEnd;
        if (layout.dashboard.guiEnabled) {
            for (i = 0, iEnd = columnsOptions.length; i < iEnd; ++i) {
                columnOptions = columnsOptions[i];
                row.addColumn(columnOptions);
            }
        }
        else if (row.container) {
            columnsElements = row.container.getElementsByClassName(layout.options.columnClassName);
            for (i = 0, iEnd = columnsElements.length; i < iEnd; ++i) {
                columnElement = columnsElements[i];
                if (columnElement instanceof HTMLElement) { // @ToDo check if this is enough
                    row.addColumn({}, columnElement);
                }
            }
        }
    };
    /**
     * addColumn
     *
     * @param {Column.Options} [options]
     * Options for the row column.
     *
     * @param {HTMLElement} [columnElement]
     * HTML element of the column.
     *
     * @return {Column}
     */
    Row.prototype.addColumn = function (options, columnElement) {
        var row = this, column = new Column(row, options, columnElement);
        row.columns.push(column);
        return column;
    };
    return Row;
}());
export default Row;
