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
    *  Constructors
    *
    * */
    function Layout(dashboard, options) {
        var _this = _super.call(this, options) || this;
        _this.dashboard = dashboard;
        _this.rows = [];
        // GUI structure
        _this.setElementContainer('layout', dashboard.guiEnabled, dashboard.container);
        _this.setRows();
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
    Layout.prototype.setRows = function () {
        var _a;
        var layout = this;
        var rowsElements, rowElement, i, iEnd;
        rowsElements = pick(layout.options.rows || [], (_a = layout === null || layout === void 0 ? void 0 : layout.container) === null || _a === void 0 ? void 0 : _a.getElementsByClassName(layout.options.rowClassName));
        for (i = 0, iEnd = rowsElements.length; i < iEnd; ++i) {
            rowElement = rowsElements[i];
            layout.addRow(layout.dashboard.guiEnabled ? rowElement : {}, rowElement instanceof HTMLElement ? rowElement : void 0);
        }
    };
    Layout.prototype.addRow = function (options, rowElement) {
        var layout = this, row = new Row(layout, options, rowElement);
        layout.rows.push(row);
        return row;
    };
    return Layout;
}(GUIElement));
export default Layout;
