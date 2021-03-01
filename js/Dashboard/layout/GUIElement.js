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
     * @param {boolean} render
     * Decide wheather to render a new element or not.
     *
     * @param {HTMLDOMElement} parentContainer
     * The container for a new HTML element.
     *
     * @param {HTMLAttributes} attribs
     * Attributes for a new HTML element.
     *
     * @param {HTMLElement|string} elementOrId
     * HTML element or id of HTML element that will be set
     * as a GUIELement container.
     */
    GUIElement.prototype.setElementContainer = function (render, parentContainer, attribs, elementOrId) {
        if (attribs === void 0) { attribs = {}; }
        var guiElement = this;
        var elem;
        // @ToDo use try catch block
        if (render && parentContainer) {
            guiElement.container = createElement('div', attribs, {}, parentContainer);
        }
        else if (elementOrId instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = elementOrId;
        }
        else if (typeof elementOrId === 'string') {
            elem = document.getElementById(elementOrId);
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
