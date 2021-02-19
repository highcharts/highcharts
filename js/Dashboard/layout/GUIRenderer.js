var GUIRenderer = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GUIRenderer(dashboardContainer, options) {
        this.options = options;
        this.dashboardContainer = dashboardContainer;
        // temporary solution until create an options parser
        this.dashboardContainer.innerHTML = this.createHTML();
    }
    /* *
    *
    *  Functions
    *
    * */
    GUIRenderer.prototype.createHTML = function () {
        /*
        * TODO
        *
        * 1. Assing HTML to layout's container
        * 2. Create layout structure
        * 3. Create cols
        * 4. Create rows
        *
        */
        /**
         * Static HTML for demo
         */
        return "\n            <div class=\"\">\n                <div class=\"row\">\n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>\n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>                    \n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>\n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>                    \n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>\n                </div>                \n                <div class=\"row\">\n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>\n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>                    \n                    <div class=\"col\">\n                        <div class=\"card\"></div>\n                    </div>\n                </div>\n            </div>\n        ";
    };
    return GUIRenderer;
}());
export default GUIRenderer;
