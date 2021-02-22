var Column = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Column(row, options) {
        this.options = options;
        this.row = row;
        this.setColumnContainer();
    }
    /* *
    *
    *  Functions
    *
    * */
    Column.prototype.setColumnContainer = function () {
        var column = this, row = column.row, dashboard = row.layout.dashboard, renderer = dashboard.renderer;
        if (dashboard.guiEnabled) {
            if (renderer && row.container) {
                // Generate column HTML structure
                this.container = renderer.renderColumn(column, row.container);
                // render card HTML structure
                renderer.renderCard(this.container);
            }
            else {
                // this.container = from user gui
            }
        }
    };
    return Column;
}());
export default Column;
