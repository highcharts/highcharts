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
import U from '../../Core/Utilities.js';
var createElement = U.createElement, merge = U.merge, fireEvent = U.fireEvent, addEvent = U.addEvent, objectEach = U.objectEach, isFunction = U.isFunction, uniqueKey = U.uniqueKey;
var Component = /** @class */ (function () {
    function Component(options) {
        this.tableEvents = [];
        this.options = merge(Component.defaultOptions, options);
        this.id = this.options.id;
        this.parentElement = this.options.parentElement;
        this.type = this.options.type;
        this.store = this.options.store;
        this.hasLoaded = false;
        // Initial dimensions
        this.dimensions = this.options.dimensions || {
            width: this.parentElement.scrollWidth,
            height: this.parentElement.scrollHeight
        };
        this.element = createElement('div', {
            className: this.options.className
        });
        // Add the component instance to the registry
        Component.addComponent(this);
    }
    /**
     * Adds a component instance to the registry
     * @param {Component} component
     * The component to add
     */
    Component.addComponent = function (component) {
        Component.instanceRegistry[component.id] = component;
    };
    /**
     * Removes a component instance from the registry
     * @param {Component} component
     * The component to remove
     */
    Component.removeComponent = function (component) {
        delete Component.instanceRegistry[component.id];
    };
    /**
     * Retrieves the IDs of the registered component instances
     * @return {string[]}
     * Array of component IDs
     */
    Component.getAllComponentIDs = function () {
        return Object.keys(this.instanceRegistry);
    };
    /**
     * Retrieves all registered component instances
     * @return {ComponentType[]}
     * Array of components
     */
    Component.getAllComponents = function () {
        var _this = this;
        var ids = this.getAllComponentIDs();
        return ids.map(function (id) { return _this.instanceRegistry[id]; });
    };
    Component.getComponentById = function (id) {
        return this.instanceRegistry[id];
    };
    Component.relayMessage = function (sender, // Possibly layout?
    message, // should probably be a typical event with optional payloads
    target // currently all or type. Could also add groups
    ) {
        var _this = this;
        if (target === void 0) { target = 'all'; }
        this.getAllComponentIDs()
            .filter(function (id) { return id !== sender.id; })
            .forEach(function (componentID) {
            var component = _this.instanceRegistry[componentID];
            if (component.type === target || target === 'all') {
                component.emit({
                    type: 'message',
                    detail: {
                        sender: sender,
                        target: target
                    },
                    message: message
                });
            }
        });
    };
    Component.prototype.attachStore = function (store) {
        var _this = this;
        this.store = store;
        // Set up event listeners
        [
            'afterInsertRow',
            'afterDeleteRow',
            'afterChangeRow',
            'afterUpdateRow',
            'afterClearTable'
        ].forEach(function (event) {
            _this.tableEvents.push(store.table.on(event, function (e) {
                clearInterval(_this.tableEventTimeout);
                _this.tableEventTimeout = setTimeout(function () {
                    _this.emit(__assign(__assign({}, e), { type: 'tableChanged' }));
                    _this.tableEventTimeout = void 0;
                }, 0);
            }));
        });
        this.tableEvents.push(store.on('afterLoad', function (e) {
            _this.emit(__assign(__assign({}, e), { type: 'tableChanged' }));
        }));
        fireEvent(this, 'storeAttached', { store: store });
    };
    Component.prototype.resize = function (width, height) {
        this.dimensions = { width: width, height: height };
        this.element.style.width = this.dimensions.width + 'px';
        this.element.style.height = this.dimensions.height + 'px';
        fireEvent(this, 'resize', {
            width: width,
            height: height
        });
        return this;
    };
    /**
     * Handles updating via options
     * @param {Partial<Component.ComponentOptions>} newOptions
     * The options to apply
     *
     * @return {this}
     */
    Component.prototype.update = function (newOptions) {
        // Update options
        this.options = merge(this.options, newOptions);
        fireEvent(this, 'update', {
            options: newOptions
        });
        return this;
    };
    /**
     * Handles setting things up on initial render
     *
     * @return {this}
     */
    Component.prototype.load = function () {
        var _this = this;
        if (this.store) {
            this.attachStore(this.store);
        }
        /* this.parentElement.appendChild(this.element); */
        // Setup event listeners
        // Grabbed from Chart.ts
        var events = this.options.events;
        if (events) {
            objectEach(events, function (eventCallback, eventType) {
                if (isFunction(eventCallback)) {
                    _this.on(eventType, eventCallback);
                }
            });
        }
        this.on('message', function (e) {
            var _a;
            if (typeof ((_a = e.message) === null || _a === void 0 ? void 0 : _a.callback) === 'function') {
                e.message.callback.apply(_this);
            }
        });
        return this;
    };
    /**
     * @todo make this call load on initial render
     *
     * @return {this}
     */
    Component.prototype.render = function () {
        if (!this.hasLoaded) {
            this.load();
        }
        var e = {
            component: this
        };
        fireEvent(this, 'render', e);
        return e.component;
    };
    /**
     * @todo redraw should (usually) call render
     * @return {this}
     */
    Component.prototype.redraw = function () {
        // Do a redraw
        var e = {
            component: this
        };
        fireEvent(this, 'redraw', e);
        return e.component;
    };
    /**
     * @todo Should perhaps also remove the component from the registry
     * or set an `isactive` flag to false
     */
    Component.prototype.destroy = function () {
        while (this.element.firstChild) {
            this.element.firstChild.remove();
        }
        // Unregister events
        this.tableEvents.forEach(function (eventCallback) { return eventCallback(); });
        this.element.remove();
    };
    Component.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    Component.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    Component.prototype.postMessage = function (message, target) {
        Component.relayMessage(this, message, target);
    };
    /**
     *
     * Record of component instances
     *
     */
    Component.instanceRegistry = {};
    Component.defaultOptions = {
        className: 'highcharts-dashboard-component',
        parentElement: document.body,
        type: '',
        id: 'dashboard-component-' + uniqueKey()
    };
    return Component;
}());
export default Component;
