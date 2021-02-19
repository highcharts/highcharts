import U from '../../Core/Utilities.js';
var error = U.error;
var Layout = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Layout(dashboardContainer, options, guiEnabled, renderer) {
        this.options = options;
        this.dashboardContainer = dashboardContainer;
        if (renderer) {
            this.renderer = renderer;
        }
        this.setLayout(guiEnabled);
        // this.addRows();
    }
    /* *
    *
    *  Functions
    *
    * */
    Layout.prototype.setLayout = function (guiEnabled) {
        /*
        * TODO
        *
        *
        * 2. Create layout structure
        *
        */
        var layout = this;
        var renderer = layout.renderer;
        var layoutHTML;
        if (guiEnabled) {
            if (renderer) {
                // Generate layout HTML structure.
                layoutHTML = renderer.renderLayout(layout.dashboardContainer);
            }
            else {
                // Throw an error - GUIRenderer module required!
                error(33, true);
            }
        }
        else {
            // layoutHTML = from user gui
        }
        this.container = layoutHTML;
    };
    Layout.prototype.addRows = function () {
        /*
        * TODO
        *
        * 1. Init rows
        *
        */
    };
    return Layout;
}());
export default Layout;
