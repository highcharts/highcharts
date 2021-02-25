var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Column from './Column.js';
import GUIElement from './GUIElement.js';
var Row = /** @class */ (function (_super) {
    __extends(Row, _super);
    /* *
    *
    *  Constructors
    *
    * */
    function Row(layout, options, rowElement) {
        var _this = _super.call(this, options) || this;
        _this.layout = layout;
        _this.columns = [];
        _this.setElementContainer(layout.dashboard.guiEnabled, layout.container, rowElement);
        _this.setInnerElements(layout.dashboard.guiEnabled);
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
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
}(GUIElement));
export default Row;
