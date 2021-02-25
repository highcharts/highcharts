import Layout from './Layout.js';
import Row from './Row.js';
import Column from './Column.js';
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
    GUIElement.prototype.setInnerElements = function (render) {
        var guiElement = this, innerElementsOptions = guiElement.options.rows ||
            guiElement.options.columns || [];
        var options, innerElements, innerElement;
        if (render) {
            for (var i = 0, iEnd = innerElementsOptions.length; i < iEnd; ++i) {
                options = innerElementsOptions[i];
                guiElement.addInnerElement(options);
            }
        }
        else if (guiElement.container) {
            if (guiElement instanceof Layout) {
                innerElements = guiElement.container
                    .getElementsByClassName(guiElement.options.rowClassName);
            }
            else if (guiElement instanceof Row) {
                innerElements = guiElement.container
                    .getElementsByClassName(guiElement.layout.options.columnClassName);
            }
            if (innerElements) {
                for (var i = 0, iEnd = innerElements.length; i < iEnd; ++i) {
                    innerElement = innerElements[i];
                    if (innerElement instanceof HTMLElement) { // @ToDo check if this is enough
                        guiElement.addInnerElement({}, innerElement);
                    }
                }
            }
        }
    };
    GUIElement.prototype.addInnerElement = function (options, element) {
        var guiElement = this;
        var innerGUIElement;
        if (guiElement instanceof Layout) {
            innerGUIElement = new Row(guiElement, options, element);
            guiElement.rows.push(innerGUIElement);
        }
        else if (guiElement instanceof Row) {
            innerGUIElement = new Column(guiElement, options, element);
            guiElement.columns.push(innerGUIElement);
        }
        else {
            // Error
        }
        return innerGUIElement;
    };
    return GUIElement;
}());
export default GUIElement;
