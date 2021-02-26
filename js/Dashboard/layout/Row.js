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
import U from '../../Core/Utilities.js';
var pick = U.pick;
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
        _this.setColumns();
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
    Row.prototype.setColumns = function () {
        var _a;
        var row = this;
        var columnsElements, columnElement, i, iEnd;
        columnsElements = pick(row.options.columns || [], (_a = row === null || row === void 0 ? void 0 : row.container) === null || _a === void 0 ? void 0 : _a.getElementsByClassName(row.layout.options.columnClassName));
        for (i = 0, iEnd = columnsElements.length; i < iEnd; ++i) {
            columnElement = columnsElements[i];
            row.addColumn(row.layout.dashboard.guiEnabled ? columnElement : {}, columnElement instanceof HTMLElement ? columnElement : void 0);
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
}(GUIElement));
export default Row;
