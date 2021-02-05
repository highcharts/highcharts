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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Component from './Component.js';
import U from '../../Core/Utilities.js';
var createElement = U.createElement, merge = U.merge;
import AST from '../../Core/Renderer/HTML/AST.js';
var HTMLComponent = /** @class */ (function (_super) {
    __extends(HTMLComponent, _super);
    function HTMLComponent(options) {
        var _this = this;
        options = merge(HTMLComponent.defaultOptions, options);
        _this = _super.call(this, options) || this;
        _this.type = 'HTML';
        _this.innerElements = [];
        _this.elements = options.elements;
        _this.on('tableChanged', function (e) {
            var _a;
            if (((_a = e.detail) === null || _a === void 0 ? void 0 : _a.sender) !== _this.id) {
                _this.redraw();
            }
        });
        return _this;
    }
    HTMLComponent.prototype.load = function () {
        this.emit({ type: 'load' });
        _super.prototype.load.call(this);
        this.parentElement.appendChild(this.element);
        this.hasLoaded = true;
        this.emit({ type: 'afterLoad' });
        return this;
    };
    HTMLComponent.prototype.render = function () {
        var _this = this;
        var elements = _super.prototype.render.call(this).elements; // Fires the render event
        this.elements = elements;
        this.constructTree();
        this.innerElements.forEach(function (element) {
            _this.element.appendChild(element);
        });
        this.emit({ type: 'afterRender', component: this, detail: { sender: this.id } });
        return this;
    };
    HTMLComponent.prototype.redraw = function () {
        var elements = _super.prototype.redraw.call(this).elements; // Fires the render event
        this.elements = elements;
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
        this.emit({ type: 'afterRedraw', component: this, detail: { sender: this.id } });
        return this;
    };
    // Could probably use the serialize function moved on
    // the exportdata branch
    HTMLComponent.prototype.constructTree = function () {
        var _this = this;
        this.elements.forEach(function (el) {
            var _a;
            var created = createElement(el.tagName || 'div', el.attributes, (_a = el.attributes) === null || _a === void 0 ? void 0 : _a.style);
            if (el.textContent) {
                AST.setElementHTML(created, el.textContent);
            }
            _this.innerElements.push(created);
        });
    };
    HTMLComponent.defaultOptions = __assign({}, Component.defaultOptions);
    return HTMLComponent;
}(Component));
export default HTMLComponent;
