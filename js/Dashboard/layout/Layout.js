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
        * 1. Set reference to container
        * 2. Create layout structure
        *
        */
        var layout = this;
        var layoutHTML;
        if (guiEnabled) {
            if (layout.renderer) {
                // Generate layout HTML structure.
                layoutHTML = layout.renderer.renderLayout(layout.dashboardContainer);
            }
            else {
                // Throw an error - GUIRenderer module required!
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
