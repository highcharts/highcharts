var GUI = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GUI(dashboardContainer, options) {
        this.options = options;
        this.dashboardContainer = dashboardContainer;
        this.dashboardContainer.innerHTML = this.createHTML();
    }
    /* *
    *
    *  Functions
    *
    * */
    GUI.prototype.createHTML = function () {
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
    return GUI;
}());
export default GUI;
