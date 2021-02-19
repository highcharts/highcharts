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
        * 3. Init cols
        * 4. Init rows
        *
        */
        var layout = this;
        if (guiEnabled) {
            if (!layout.renderer) {
                // Throw an error - GUIRenderer module required!
            }
            // Generate layout HTML structure.
            // layout.renderer.renderLayout
        }
    };
    return Layout;
}());
export default Layout;
