import U from '../../Core/Utilities.js';
var createElement = U.createElement;
var PREFIX = 'highcharts-dashboard-';
var GUIElement = /** @class */ (function () {
    function GUIElement() {
    }
    /* *
    *
    *  Functions
    *
    * */
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
export { GUIElement, PREFIX };
