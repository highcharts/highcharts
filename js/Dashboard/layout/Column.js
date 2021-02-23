var Column = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Column(row, options, columnElement) {
        this.options = options;
        this.row = row;
        this.setColumnContainer(columnElement);
    }
    /* *
    *
    *  Functions
    *
    * */
    Column.prototype.setColumnContainer = function (columnElement) {
        var column = this, row = column.row, dashboard = row.layout.dashboard, renderer = dashboard.renderer;
        // @ToDo use try catch block
        if (dashboard.guiEnabled) {
            if (renderer && row.container) {
                // Generate column HTML structure
                column.container = renderer.renderColumn(column, row.container);
                // render card HTML structure
                renderer.renderCard(column.container);
            }
            else {
                // Error
            }
        }
        else if (columnElement instanceof HTMLElement) { // @ToDo check if this is enough
            column.container = columnElement;
        }
        else {
            // Error
        }
    };
    return Column;
}());
export default Column;
