import Layout from './layout/Layout.js';
import U from '../Core/Utilities.js';
var merge = U.merge;
var Dashboard = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Dashboard(renderTo, options) {
        this.options = merge(Dashboard.defaultOptions, options);
        this.layouts = [];
        /*
        * TODO
        *
        * 1. Loop over layouts + init
        * 2. Bindings elements
        *
        */
        this.setLayouts();
    }
    /* *
     *
     *  Functions
     *
     * */
    Dashboard.prototype.setLayouts = function () {
        var gui = this.options.gui;
        var layoutsOptions = gui.layouts;
        for (var i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            this.layouts.push(new Layout(gui.enabled, layoutsOptions[i]));
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
