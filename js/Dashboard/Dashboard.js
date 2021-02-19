import Layout from './layout/Layout.js';
import GUIRenderer from './layout/GUIRenderer.js';
// import type GUI from './layout/GUI.js';
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
            this.renderer = new GUIRenderer(this.options.gui);
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
        var options = this.options, layoutsOptions = options.gui.layouts;
        for (var i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            this.layouts.push(new Layout(this.container, layoutsOptions[i], options.gui.enabled, this.renderer));
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
