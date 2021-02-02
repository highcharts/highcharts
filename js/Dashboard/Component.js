import U from '../Core/Utilities.js';
var createElement = U.createElement, merge = U.merge, fireEvent = U.fireEvent, addEvent = U.addEvent, objectEach = U.objectEach, isFunction = U.isFunction, uniqueKey = U.uniqueKey;
var Component = /** @class */ (function () {
    function Component(options) {
        var _this = this;
        this.tableEvents = [];
        this.id = 'dashboard-component' + uniqueKey();
        this.options = merge(Component.defaultOptions, options);
        this.parentElement = this.options.parentElement;
        this.type = this.options.type;
        this.store = this.options.store;
        if (this.store) {
            this.attachStore(this.store);
        }
        // Initial dimensions
        this.dimensions = this.options.dimensions || {
            width: this.parentElement.scrollWidth,
            height: this.parentElement.scrollHeight
        };
        this.element = createElement('div', {
            className: options.className
        });
        this.parentElement.appendChild(this.element);
        // Setup event listeners
        // Grabbed from Chart.ts
        var events = this.options.events;
        if (events) {
            objectEach(events, function (event, eventType) {
                if (isFunction(event)) {
                    _this.on(eventType, event);
                }
            });
        }
        this.on('message', function (e) {
            var _a;
            if (typeof ((_a = e.message) === null || _a === void 0 ? void 0 : _a.callback) === 'function') {
                e.message.callback.apply(_this);
            }
        });
        Component.addComponent(this);
    }
    Component.addComponent = function (component) {
        Component.componentRegistry[component.id] = component;
    };
    Component.removeComponent = function (component) {
        delete Component.componentRegistry[component.id];
    };
    Component.getAllComponentIDs = function () {
        return Object.keys(this.componentRegistry);
    };
    Component.getAllComponents = function () {
        var _this = this;
        var ids = this.getAllComponentIDs();
        return ids.map(function (id) { return _this.componentRegistry[id]; });
    };
    // This could be on another class
    Component.relayMessage = function (sender, // Possibly layout?
    message, // should probably be a typical event with optional payloads
    target // currently all or type. Could also add groups or IDs
    ) {
        var _this = this;
        if (target === void 0) { target = 'all'; }
        this.getAllComponentIDs().forEach(function (componentID) {
            var component = _this.componentRegistry[componentID];
            if (component.type === target || target === 'all') {
                component.emit('message', {
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
        // Set up event listeners
        ['afterInsertRow', 'afterDeleteRow', 'afterUpdateRow', 'afterClearTable']
            .forEach(function (event) {
            _this.tableEvents.push(store.table.on(event, function (e) {
                clearInterval(_this.tableEventTimeout);
                _this.tableEventTimeout = setTimeout(function () {
                    _this.emit('tableChanged', e);
                    _this.tableEventTimeout = void 0;
                }, 100);
            }));
        });
        this.tableEvents.push(store.on('afterLoad', function (e) {
            _this.emit('tableChanged', e);
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
    Component.prototype.update = function (newOptions) {
        // Update options
        this.options = merge(this.options, newOptions);
        fireEvent(this, 'update', {
            options: newOptions
        });
        return this;
    };
    Component.prototype.render = function () {
        this.parentElement.appendChild(this.element);
        var e = {
            component: this
        };
        fireEvent(this, 'render', e);
        return e.component;
    };
    Component.prototype.redraw = function () {
        // Do a redraw
        var e = {
            component: this
        };
        fireEvent(this, 'redraw', e);
        return e.component;
    };
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
    Component.prototype.emit = function (type, attributes) {
        if (attributes === void 0) { attributes = {}; }
        fireEvent(this, type, attributes);
    };
    Component.prototype.postMessage = function (message, target) {
        Component.relayMessage(this, message, target);
    };
    Component.componentRegistry = {};
    Component.defaultOptions = {
        className: 'highcharts-dashboard-component',
        parentElement: document.body,
        type: ''
    };
    return Component;
}());
export default Component;
