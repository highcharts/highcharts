import U from './../../Core/Utilities.js';
var createElement = U.createElement, pick = U.pick;
var PREFIX = 'highcharts-dashboard-';
var GUIRenderer = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GUIRenderer(options) {
        this.options = options;
    }
    /* *
    *
    *  Functions
    *
    * */
    // @TODO add docs, improve it
    GUIRenderer.prototype.renderLayout = function (container) {
        return createElement('div', {
            // id: 'dashboard-layout-1',
            className: PREFIX + 'layout'
        }, {}, container);
    };
    // @TODO add docs, improve it
    GUIRenderer.prototype.renderRow = function (row, container) {
        var layoutOptions = row.layout.options;
        return createElement('div', {
            id: row.options.id || '',
            className: layoutOptions.rowClassName + ' ' + PREFIX + 'row'
        }, {}, container);
    };
    // @TODO add docs, improve it
    GUIRenderer.prototype.renderColumn = function (column, container) {
        var layoutOptions = column.row.layout.options;
        return createElement('div', {
            id: column.options.id || '',
            className: layoutOptions.columnClassName + ' ' + PREFIX + 'column'
        }, {}, container);
    };
    // @TODO add docs, improve it
    GUIRenderer.prototype.renderCard = function (container) {
        return createElement('div', {
            // id: 'dashboard-row-1',
            className: PREFIX + 'card'
        }, {}, container);
    };
    return GUIRenderer;
}());
export default GUIRenderer;
