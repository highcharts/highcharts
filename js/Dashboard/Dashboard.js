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
        /*
         * TODO
         *
         * 1. loop over layouts + init
         * 2. Bindings elements
         *
         */
    }
    /* *
      *
      *  Static Properties
      *
      * */
    Dashboard.defaultOptions = {
        layouts: []
        // components: []
    };
    return Dashboard;
}());
export default Dashboard;
