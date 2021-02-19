import U from './../../Core/Utilities.js';
var createElement = U.createElement;
var PREFIX = 'highcharts-dashboard';
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
    return GUIRenderer;
}());
export default GUIRenderer;
