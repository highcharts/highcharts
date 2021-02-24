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
    GUIRenderer.prototype.renderCard = function (container) {
        return createElement('div', {
            // id: 'dashboard-row-1',
            className: PREFIX + 'card'
        }, {}, container);
    };
    return GUIRenderer;
}());
export default GUIRenderer;
