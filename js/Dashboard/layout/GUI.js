var GUI = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GUI(options) {
        this.options = options;
        this.createHTML();
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
        return "\n            <div class=\"row\">\n                <div class=\"col\"></div>\n                <div class=\"col\"></div>\n                <div class=\"col\"></div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col\"></div>\n                <div class=\"col\"></div>\n                <div class=\"col\"></div>\n            </div>            \n            <div class=\"row\">\n                <div class=\"col\"></div>\n                <div class=\"col\"></div>\n                <div class=\"col\"></div>\n            </div>";
    };
    return GUI;
}());
export default GUI;
