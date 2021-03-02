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
var pick = U.pick, merge = U.merge;
var Row = /** @class */ (function (_super) {
    __extends(Row, _super);
    /* *
    *
    *  Constructor
    *
    * */
    /**
     * Constructs an instance of the Row class.
     *
     * @param {Layout} layout
     * Reference to the layout instance.
     *
     * @param {Row.Options} options
     * Options for the row.
     *
     * @param {HTMLElement} rowElement
     * The container of the row HTML element.
     */
    function Row(layout, options, rowElement) {
        var _this = this;
        var rowClassName = layout.options.rowClassName;
        _this = _super.call(this) || this;
        _this.layout = layout;
        _this.columns = [];
        _this.options = options;
        _this.setElementContainer(layout.dashboard.guiEnabled, layout.container, {
            id: options.id,
            className: rowClassName ?
                rowClassName + ' ' + GUIElement.prefix + 'row' : GUIElement.prefix + 'row'
        }, rowElement || options.id, merge(layout.options.style, options.style));
        _this.setColumns();
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
    /**
     * Set the row columns using column options or columnClassName.
     */
    Row.prototype.setColumns = function () {
        var _a;
        var row = this, columnsElements = pick(row.options.columns, (_a = row.container) === null || _a === void 0 ? void 0 : _a.getElementsByClassName(row.layout.options.columnClassName)) || [];
        var columnElement, i, iEnd;
        for (i = 0, iEnd = columnsElements.length; i < iEnd; ++i) {
            columnElement = columnsElements[i];
            row.addColumn(row.layout.dashboard.guiEnabled ? columnElement : {}, columnElement instanceof HTMLElement ? columnElement : void 0);
        }
    };
    /**
     * Add a new Column instance to the row columns array.
     *
     * @param {Column.Options} [options]
     * Options for the row column.
     *
     * @param {HTMLElement} [columnElement]
     * The container for a new column HTML element.
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
