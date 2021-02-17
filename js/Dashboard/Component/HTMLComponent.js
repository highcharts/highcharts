var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Component from './Component.js';
import U from '../../Core/Utilities.js';
var createElement = U.createElement, merge = U.merge;
import AST from '../../Core/Renderer/HTML/AST.js';
import DataStore from '../../Data/Stores/DataStore.js';
var HTMLComponent = /** @class */ (function (_super) {
    __extends(HTMLComponent, _super);
    /* *
     *
     *  Class constructor
     *
     * */
    function HTMLComponent(options) {
        var _this = this;
        options = merge(HTMLComponent.defaultOptions, options);
        _this = _super.call(this, options) || this;
        _this.options = options;
        _this.type = 'HTML';
        _this.innerElements = [];
        _this.elements = [];
        _this.on('tableChanged', function (e) {
            var _a;
            if (((_a = e.detail) === null || _a === void 0 ? void 0 : _a.sender) !== _this.id) {
                _this.redraw();
            }
        });
        return _this;
    }
    /* *
     *
     *  Static functions
     *
     * */
    HTMLComponent.fromJSON = function (json) {
        var _a, _b, _c;
        var options = json.options;
        var elements = (_a = json.elements) === null || _a === void 0 ? void 0 : _a.map(function (el) { return JSON.parse(el); });
        var store = ((_b = json.store) === null || _b === void 0 ? void 0 : _b.$class) ? DataStore.getStore((_c = json.store) === null || _c === void 0 ? void 0 : _c.$class) : void 0;
        var component = new HTMLComponent(merge(options, { elements: elements, store: store }));
        return component;
    };
    /* *
     *
     *  Class methods
     *
     * */
    HTMLComponent.prototype.load = function () {
        var _this = this;
        this.emit({ type: 'load' });
        _super.prototype.load.call(this);
        this.elements = this.options.elements || [];
        this.constructTree();
        this.innerElements.forEach(function (element) {
            _this.element.appendChild(element);
        });
        this.parentElement.appendChild(this.element);
        this.emit({ type: 'afterLoad' });
        return this;
    };
    HTMLComponent.prototype.render = function () {
        _super.prototype.render.call(this); // Fires the render event and calls load
        this.emit({ type: 'afterRender', component: this });
        return this;
    };
    HTMLComponent.prototype.redraw = function () {
        _super.prototype.redraw.call(this);
        this.innerElements = [];
        this.constructTree();
        for (var i = 0; i < this.element.childNodes.length; i++) {
            var childnode = this.element.childNodes[i];
            if (this.innerElements[i]) {
                this.element.replaceChild(this.innerElements[i], childnode);
            }
            else {
                this.element.removeChild(childnode);
            }
        }
        this.render();
        this.emit({ type: 'afterRedraw', component: this });
        return this;
    };
    HTMLComponent.prototype.update = function (options) {
        _super.prototype.update.call(this, options);
        this.emit({ type: 'afterUpdate', component: this });
        return this;
    };
    // Could probably use the serialize function moved on
    // the exportdata branch
    HTMLComponent.prototype.constructTree = function () {
        var _this = this;
        this.elements.forEach(function (el) {
            var attributes = el.attributes;
            var createdElement = createElement(el.tagName || 'div', attributes, typeof (attributes === null || attributes === void 0 ? void 0 : attributes.style) !== 'string' ? attributes === null || attributes === void 0 ? void 0 : attributes.style :
                void 0);
            if (el.textContent) {
                AST.setElementHTML(createdElement, el.textContent);
            }
            _this.innerElements.push(createdElement);
        });
    };
    HTMLComponent.prototype.toJSON = function () {
        var elements = (this.options.elements || [])
            .map(function (el) { return JSON.stringify(el); });
        return merge(_super.prototype.toJSON.call(this), { elements: elements });
    };
    /* *
     *
     *  Static properties
     *
     * */
    HTMLComponent.defaultOptions = merge(Component.defaultOptions, {
        elements: []
    });
    return HTMLComponent;
}(Component));
/* *
 *
 *  Default export
 *
 * */
export default HTMLComponent;
