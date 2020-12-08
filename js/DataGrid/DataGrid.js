/* *
 *
 *  Data Grid class
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import DataTable from '../Data/DataTable.js';
import DataGridUtils from './DataGridUtils.js';
var makeDiv = DataGridUtils.makeDiv;
import H from '../Core/Globals.js';
var doc = H.doc;
import U from '../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
var DataGrid = /** @class */ (function () {
    /* *
     *
     *  Functions
     *
     * */
    function DataGrid(container, options) {
        // Initialize containers
        if (typeof container === 'string') {
            this.container = doc.getElementById(container) || makeDiv('hc-dg-container');
        }
        else {
            this.container = container;
        }
        this.outerContainer = makeDiv('hc-dg-outer-container');
        this.scrollContainer = makeDiv('hc-dg-scroll-container');
        this.innerContainer = makeDiv('hc-dg-inner-container');
        this.scrollContainer.appendChild(this.innerContainer);
        this.outerContainer.appendChild(this.scrollContainer);
        this.container.appendChild(this.outerContainer);
        // Init options
        this.options = merge(DataGrid.defaultOptions, options);
        // Init data table
        this.dataTable = this.getDataTableFromOptions();
        this.rowElements = [];
        this.render();
    }
    DataGrid.prototype.getRowCount = function () {
        return this.dataTable.getRowCount();
    };
    DataGrid.prototype.getDataTableFromOptions = function () {
        if (this.options.dataTable) {
            return this.options.dataTable;
        }
        if (this.options.json) {
            return DataTable.fromJSON({
                $class: 'DataTable',
                rows: this.options.json
            });
        }
        return new DataTable();
    };
    DataGrid.prototype.render = function () {
        this.emptyContainer();
        this.updateScrollingLength();
        this.applyContainerStyles();
        this.renderInitialRows();
        this.addEvents();
    };
    DataGrid.prototype.emptyContainer = function () {
        var container = this.innerContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    };
    DataGrid.prototype.applyContainerStyles = function () {
        this.outerContainer.style.cssText =
            'width: 100%;' +
                'height: 100%;' +
                'overflow: scroll;' +
                'position: relative;';
        this.scrollContainer.style.cssText =
            'height: 1000px;' +
                'z-index: 1;' +
                'position: relative;';
        this.innerContainer.style.cssText =
            'display: flex;' +
                'flex-direction: column;' +
                'width: 100%;' +
                'min-height: 20px;' +
                'position: fixed;' +
                'z-index: -1;';
    };
    DataGrid.prototype.addEvents = function () {
        var _this = this;
        this.outerContainer.addEventListener('scroll', function (e) { return _this.onScroll(e); });
    };
    DataGrid.prototype.onScroll = function (e) {
        var _this = this;
        e.preventDefault();
        window.requestAnimationFrame(function () {
            var i = Math.floor(_this.outerContainer.scrollTop / DataGrid.cellHeight) || 0;
            var _loop_1 = function (tableRow) {
                var dataTableRow = _this.dataTable.getRow(i);
                if (dataTableRow) {
                    var row = Object.values(dataTableRow.getAllCells());
                    row.forEach(function (columnValue, j) {
                        var cell = tableRow.querySelectorAll('div')[j];
                        cell.textContent = columnValue;
                    });
                }
                i++;
            };
            for (var _i = 0, _a = _this.rowElements; _i < _a.length; _i++) {
                var tableRow = _a[_i];
                _loop_1(tableRow);
            }
        });
    };
    DataGrid.prototype.updateScrollingLength = function () {
        var height = (this.getRowCount() + 1) * DataGrid.cellHeight;
        this.scrollContainer.style.height = height + 'px';
    };
    DataGrid.prototype.getNumRowsToDraw = function () {
        return Math.min(this.getRowCount() + 1, Math.floor(this.outerContainer.clientHeight / DataGrid.cellHeight));
    };
    DataGrid.prototype.renderInitialRows = function () {
        this.rowElements = [];
        var rowsToDraw = this.getNumRowsToDraw();
        var i = 0;
        var _loop_2 = function () {
            var rowEl = makeDiv('hc-dg-row');
            rowEl.style.cssText = 'display: flex;' +
                'background-color: white;' +
                'max-height: 20px;' +
                'z-index: -1;';
            var dataTableRow = this_1.dataTable.getRow(i);
            if (dataTableRow) {
                var row = Object.values(dataTableRow.getAllCells());
                row.forEach(function (columnValue) {
                    var cellEl = makeDiv('hc-dg-cell');
                    cellEl.style.cssText = 'border: 1px solid black;' +
                        'overflow: hidden;' +
                        'padding: 0 10px;' +
                        'z-index: -1;';
                    cellEl.textContent = columnValue;
                    rowEl.appendChild(cellEl);
                });
            }
            this_1.innerContainer.appendChild(rowEl);
            this_1.rowElements.push(rowEl);
            i++;
        };
        var this_1 = this;
        while (i < rowsToDraw) {
            _loop_2();
        }
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataGrid.defaultOptions = {
    // nothing here yet
    };
    DataGrid.cellHeight = 20; // TODO: Make dynamic, and add style options
    return DataGrid;
}());
H.DataGrid = DataGrid;
export default DataGrid;
