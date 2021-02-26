import U from '../../Core/Utilities.js';
var createElement = U.createElement;
var PREFIX = 'highcharts-dashboard-';
var GUIElement = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function GUIElement(options) {
        this.options = options;
    }
    /* *
    *
    *  Functions
    *
    * */
    // @ToDo return dictionary type instead of string
    GUIElement.prototype.setElementContainer = function (type, render, parentContainer, element) {
        var guiElement = this, options = guiElement.options;
        var attribs, className, elem;
        // @ToDo use try catch block
        if (render && parentContainer) {
            attribs = {};
            if (options.id) {
                attribs.id = options.id;
            }
            // @ToDo remove as any.
            className = options[type + 'ClassName'];
            attribs.className = className ?
                className + ' ' + PREFIX + type :
                PREFIX + type;
            guiElement.container = createElement('div', attribs, {}, parentContainer);
        }
        else if (element instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = element;
        }
        else if (typeof options.id === 'string') {
            elem = document.getElementById(options.id);
            if (elem) {
                guiElement.container = elem;
            }
            else {
                // Error
            }
        }
        else {
            // Error
        }
    };
    return GUIElement;
}());
export default GUIElement;
