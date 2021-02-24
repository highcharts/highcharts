import Layout from './Layout.js';
import Row from './Row.js';
import Column from './Column.js';
import U from './../../Core/Utilities.js';
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
    GUIElement.prototype.getType = function () {
        var guiElement = this;
        var type = '';
        if (guiElement instanceof Layout) {
            type = 'layout';
        }
        else if (guiElement instanceof Row) {
            type = 'row';
        }
        else if (guiElement instanceof Column) {
            type = 'column';
        }
        return type;
    };
    GUIElement.prototype.setElementContainer = function (render, parentContainer, element) {
        var guiElement = this, options = guiElement.options, type = guiElement.getType();
        var attribs, className, elem;
        // @ToDo use try catch block
        if (render && parentContainer) {
            attribs = {};
            if (options.id) {
                attribs.id = options.id;
            }
            // @ToDo remove as any.
            className = options[type + 'ClassName'];
            attribs.className = className ? className + ' ' + PREFIX + type : PREFIX + type;
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
