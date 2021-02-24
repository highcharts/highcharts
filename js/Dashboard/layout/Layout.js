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
        _this.setElementContainer(dashboard.guiEnabled, dashboard.container);
        _this.setRows();
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
    Layout.prototype.setRows = function () {
        var layout = this, rowsOptions = layout.options.rows || [];
        var rowOptions, rowsElements, rowElement, i, iEnd;
        if (layout.dashboard.guiEnabled) {
            for (i = 0, iEnd = rowsOptions.length; i < iEnd; ++i) {
                rowOptions = rowsOptions[i];
                layout.addRow(rowOptions);
            }
        }
        else if (layout.container) {
            rowsElements = layout.container.getElementsByClassName(layout.options.rowClassName);
            for (i = 0, iEnd = rowsElements.length; i < iEnd; ++i) {
                rowElement = rowsElements[i];
                if (rowElement instanceof HTMLElement) { // @ToDo check if this is enough
                    layout.addRow({}, rowElement);
                }
            }
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
