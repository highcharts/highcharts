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
var GroupComponent = /** @class */ (function (_super) {
    __extends(GroupComponent, _super);
    function GroupComponent(options) {
        var _this = _super.call(this, options) || this;
        _this.options = __assign(__assign({}, GroupComponent.defaultOptions), options);
        _this.components = options.components || [];
        return _this;
    }
    GroupComponent.prototype.load = function () {
        this.emit({ type: 'load' });
        _super.prototype.load.call(this);
        this.parentElement.appendChild(this.element);
        this.hasLoaded = true;
        this.emit({ type: 'afterLoad' });
        return this;
    };
    GroupComponent.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this);
        this.element.style.display = 'flex';
        this.element.style.flexDirection = this.options.direction;
        this.components.forEach(function (comp) {
            comp.parentElement = _this.element;
            if (_this.options.direction === 'column') {
                comp.dimensions.width = _this.dimensions.width;
                comp.dimensions.height = (_this.dimensions.height) / _this.components.length;
            }
            if (_this.options.direction === 'row') {
                comp.dimensions.height = _this.dimensions.height || 500;
                comp.dimensions.width = ((_this.dimensions.width || 500) / _this.components.length) - 50;
            }
            comp.render();
        });
        return this;
    };
    GroupComponent.defaultOptions = __assign(__assign({}, Component.defaultOptions), { direction: 'column', components: [] });
    return GroupComponent;
}(Component));
export default GroupComponent;
