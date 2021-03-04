import U from '../../Core/Utilities.js';
var createElement = U.createElement;
var GUIElement = /** @class */ (function () {
    function GUIElement() {
    }
    /* *
    *
    *  Functions
    *
    * */
    /**
     * Create or set existing HTML element as a GUIElement container.
     *
     * @param {GUIElement.ContainerOptions} options
     * Options.
     */
    GUIElement.prototype.setElementContainer = function (options) {
        var guiElement = this;
        var elem;
        // @ToDo use try catch block
        if (options.render && options.parentContainer) {
            // Purge empty id attribute.
            if (options.attribs && !options.attribs.id) {
                delete options.attribs.id;
            }
            guiElement.container = createElement('div', options.attribs || {}, options.style || {}, options.parentContainer);
        }
        else if (options.element instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = options.element;
        }
        else if (typeof options.elementId === 'string') {
            elem = document.getElementById(options.elementId);
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
    /**
     *
     * Prefix of a GUIElement HTML class name.
     *
     */
    GUIElement.prefix = 'highcharts-dashboard-';
    return GUIElement;
}());
export default GUIElement;
