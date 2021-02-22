import Layout from './layout/Layout.js';
import GUIRenderer from './layout/GUIRenderer.js';
import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';
var doc = H.doc;
var merge = U.merge, error = U.error, isString = U.isString;
var Dashboard = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Dashboard(renderTo, options) {
        this.container = void 0;
        this.options = merge(Dashboard.defaultOptions, options);
        this.layouts = [];
        /*
        * TODO
        *
        * 2. Bindings elements
        *
        */
        this.initContainer(renderTo);
        // Only for generating GUI for now
        // @TODO - add rederer when edit mode enabled
        if (this.options.gui.enabled) {
            this.renderer = new GUIRenderer({});
        }
        this.setLayouts();
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * initContainer
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     */
    Dashboard.prototype.initContainer = function (renderTo) {
        var dashboard = this;
        if (isString(renderTo)) {
            dashboard.container = renderTo =
                doc.getElementById(renderTo);
        }
        // Display an error if the renderTo is wrong
        if (!renderTo) {
            error(13, true);
        }
    };
    /**
     * setLayouts
     */
    Dashboard.prototype.setLayouts = function () {
        var dashboard = this, options = dashboard.options, layoutsOptions = options.gui.layouts;
        for (var i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            dashboard.layouts.push(new Layout(dashboard, layoutsOptions[i]));
        }
    };
    /* *
    *
    *  Static Properties
    *
    * */
    Dashboard.defaultOptions = {
        gui: {
            enabled: true,
            layouts: []
        }
        // components: []
    };
    return Dashboard;
}());
export default Dashboard;
