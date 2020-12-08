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
            container = doc.getElementById(container) || makeDiv('hc-dg-container');
        }
        this.container = container;
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
        this.render();
    }
    DataGrid.prototype.getRowCount = function () {
        return this.dataTable.getRowCount();
    };
    DataGrid.prototype.getColumnCount = function () {
        // TBD.
        return 5;
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
        var numColumns = this.getColumnCount();
        this.innerContainer.style.cssText =
            'display: grid;' +
                ("grid-template-columns: repeat(" + numColumns + ", 1fr);") +
                'width: 100%;' +
                'min-height: 20px;' +
                'position: fixed;' +
                'z-index: -1;';
    };
    DataGrid.prototype.updateScrollingLength = function () {
        var height = (this.getRowCount() + 1) * DataGrid.cellHeight;
        this.scrollContainer.style.height = height + 'px';
    };
    DataGrid.prototype.getNumRowsToDraw = function () {
        return Math.min(this.getRowCount() + 1, Math.floor(this.outerContainer.clientHeight / DataGrid.cellHeight));
    };
    DataGrid.prototype.renderInitialRows = function () {
        var rowsToDraw = this.getNumRowsToDraw();
        var i = 0;
        var _loop_1 = function () {
            var rowEl = makeDiv('hc-dg-row');
            rowEl.style.cssText = 'background-color: white; width: 150px; max-height: 20px; z-index: -1;';
            var dataTableRow = this_1.dataTable.getRow(i);
            if (dataTableRow) {
                var row = Object.values(dataTableRow.getAllCells());
                row.forEach(function (columnValue) {
                    var cellEl = makeDiv('hc-dg-cell');
                    cellEl.style.cssText = 'border: 1px solid black; overflow: hidden; z-index: -1;';
                    cellEl.textContent = columnValue;
                    rowEl.appendChild(cellEl);
                });
            }
            this_1.innerContainer.appendChild(rowEl);
            i++;
        };
        var this_1 = this;
        while (i < rowsToDraw) {
            _loop_1();
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
