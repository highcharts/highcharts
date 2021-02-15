import GUI from './GUI';
var Layout = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function Layout(guiEnabled, options) {
        this.options = options;
        if (guiEnabled) {
            new GUI(options);
        }
        this.setLayout();
    }
    /* *
    *
    *  Functions
    *
    * */
    Layout.prototype.setLayout = function () {
        /*
        * TODO
        *
        * 1. Set container
        * 2. Create layout structure
        * 3. Init cols
        * 4. Init rows
        *
        */
    };
    return Layout;
}());
export default Layout;
