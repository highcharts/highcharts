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
import GUIElement from './GUIElement.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    /* *
    *
    *  Constructor
    *
    * */
    /**
     * Constructs an instance of the Column class.
     *
     * @param {Row} row
     * Reference to the row instance.
     *
     * @param {Column.Options} options
     * Options for the column.
     *
     * @param {HTMLElement} columnElement
     * The container of the column HTML element.
     */
    function Column(row, options, columnElement) {
        var _this = this;
        var columnClassName = row.layout.options.columnClassName;
        _this = _super.call(this) || this;
        _this.options = options;
        _this.row = row;
        _this.setElementContainer(row.layout.dashboard.guiEnabled, row.container, {
            id: options.id,
            className: columnClassName ?
                columnClassName + ' ' + GUIElement.prefix + 'column' : GUIElement.prefix + 'column'
        }, columnElement || options.id, merge(row.layout.options.style, row.options.style, options.style));
        return _this;
    }
    return Column;
}(GUIElement));
export default Column;
