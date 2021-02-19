import U from './../../Core/Utilities.js';
var createElement = U.createElement;
var PREFIX = 'highcharts-dashboard-';
var GUIRenderer = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GUIRenderer(options) {
        this.layoutContainer = void 0;
        this.options = options;
    }
    /* *
    *
    *  Functions
    *
    * */
    // @TODO add docs, improve it
    GUIRenderer.prototype.createHTML = function (layoutOptions, dashboardContainer) {
        // init layout container
        this.layoutContainer = this.HTMLElement('layout', dashboardContainer);
        this.addRows(layoutOptions);
        return this.layoutContainer;
    };
    /**
     * addRows
     */
    GUIRenderer.prototype.addRows = function (layoutOptions) {
        var rows = layoutOptions.rows;
        var columnsInRow;
        var column;
        var row;
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            columnsInRow = rows[i].columns;
            // init row HTML
            row = this.HTMLElement('row', this.layoutContainer);
            // add columns
            for (var j = 0, jEnd = columnsInRow.length; j < jEnd; ++j) {
                column = this.HTMLElement('column', row);
                this.HTMLElement('card', column);
            }
        }
    };
    /**
     * HTMLElement
     */
    GUIRenderer.prototype.HTMLElement = function (className, container) {
        return createElement('div', {
            className: PREFIX + className
        }, {}, container);
    };
    return GUIRenderer;
}());
export default GUIRenderer;
