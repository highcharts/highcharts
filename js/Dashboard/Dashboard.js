import Layout from './layout/Layout.js';
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
        * 1. Loop over layouts + init
        * 2. Bindings elements
        *
        */
        this.initContainer(renderTo);
        this.setLayouts();
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * initContainer
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
        var gui = this.options.gui;
        var layoutsOptions = gui.layouts;
        for (var i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            this.layouts.push(new Layout(this.container, gui.enabled, layoutsOptions[i]));
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
