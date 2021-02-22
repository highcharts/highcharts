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
        this.setRowContainer(layout.dashboard.options.gui.enabled);
        // this.setColumns();
    }
    Row.prototype.setRowContainer = function (renderHTML) {
        var row = this, layout = row.layout, renderer = layout.dashboard.renderer;
        if (renderHTML) {
            if (renderer && layout.container) {
                // Generate row HTML structure.
                this.container = renderer.renderRow(layout.container);
            }
            else {
                // Throw an error - GUIRenderer module required!
                error(33, true);
            }
        }
        else {
            // this.container = from user gui
        }
    };
    return Row;
}());
export default Row;
