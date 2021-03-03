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
import Row from './Row.js';
import GUIElement from './GUIElement.js';
import U from '../../Core/Utilities.js';
var pick = U.pick;
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    /* *
    *
    *  Constructor
    *
    * */
    /**
     * Constructs an instance of the Layout class.
     *
     * @param {Dashboard} dashboard
     * Reference to the dashboard instance.
     *
     * @param {Layout.Options} options
     * Options for the layout.
     */
    function Layout(dashboard, options) {
        var _this = _super.call(this) || this;
        _this.dashboard = dashboard;
        _this.rows = [];
        _this.options = options;
        // GUI structure
        _this.setElementContainer({
            render: dashboard.guiEnabled,
            parentContainer: dashboard.container,
            attribs: {
                id: options.id,
                className: GUIElement.prefix + 'layout'
            },
            elementId: options.id,
            style: _this.options.style
        });
        _this.setRows();
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
    /**
     * Set the layout rows using rows options or rowClassName.
     */
    Layout.prototype.setRows = function () {
        var _a;
        var layout = this, rowsElements = pick(layout.options.rows, (_a = layout.container) === null || _a === void 0 ? void 0 : _a.getElementsByClassName(layout.options.rowClassName)) || [];
        var rowElement, i, iEnd;
        for (i = 0, iEnd = rowsElements.length; i < iEnd; ++i) {
            rowElement = rowsElements[i];
            layout.addRow(layout.dashboard.guiEnabled ? rowElement : {}, rowElement instanceof HTMLElement ? rowElement : void 0);
        }
    };
    /**
     * Add a new Row instance to the layout rows array.
     *
     * @param {Row.Options} options
     * Options of a row.
     *
     * @param {HTMLElement} rowElement
     * The container for a new row HTML element.
     *
     * @return {Row}
     */
    Layout.prototype.addRow = function (options, rowElement) {
        var layout = this, row = new Row(layout, options, rowElement);
        layout.rows.push(row);
        return row;
    };
    return Layout;
}(GUIElement));
export default Layout;
