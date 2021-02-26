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
var createElement = U.createElement, merge = U.merge, fireEvent = U.fireEvent, addEvent = U.addEvent, objectEach = U.objectEach, isFunction = U.isFunction, uniqueKey = U.uniqueKey, getStyle = U.getStyle;
var Component = /** @class */ (function () {
    function Component(options) {
        this.tableEvents = [];
        this.options = merge(Component.defaultOptions, options);
        this.id = this.options.id && this.options.id.length ?
            this.options.id :
            Component.getUUID();
        if (typeof this.options.parentElement === 'string') {
            var el = document.getElementById(this.options.parentElement);
            if (!el) {
                throw new Error('Could not find element with id: ' + this.options.parentElement);
            }
            this.parentElement = el;
        }
        else {
            this.parentElement = this.options.parentElement;
        }
        this.type = this.options.type;
        this.store = this.options.store;
        this.hasLoaded = false;
        // Initial dimensions
        this.dimensions = {
            width: Number(getStyle(this.parentElement, 'width')),
            height: Number(getStyle(this.parentElement, 'height'))
        };
        this.element = createElement('div', {
            className: this.options.className
        });
        // Add the component instance to the registry
        Component.addInstance(this);
    }
    Component.addComponent = function (componentClass) {
        var name = Component.getName(componentClass), registry = Component.registry;
        if (typeof name === 'undefined' ||
            registry[name]) {
            return false;
        }
        registry[name] = componentClass;
        return true;
    };
    Component.getAllComponentNames = function () {
        return Object.keys(Component.registry);
    };
    Component.getAllComponents = function () {
        return merge(Component.registry);
    };
    /**
     * Extracts the name from a given component class.
     *
     * @param {DataStore} component
     * Component class to extract the name from.
     *
     * @return {string}
     * Component name, if the extraction was successful, otherwise an empty
     * string.
     */
    Component.getName = function (component) {
        return (component.toString().match(Component.nameRegExp) ||
            ['', ''])[1];
    };
    /**
     * Adds a component instance to the registry
     * @param {Component} component
     * The component to add
     */
    Component.addInstance = function (component) {
        Component.instanceRegistry[component.id] = component;
    };
    /**
     * Removes a component instance from the registry
     * @param {Component} component
     * The component to remove
     */
    Component.removeInstance = function (component) {
        delete Component.instanceRegistry[component.id];
    };
    /**
     * Retrieves the IDs of the registered component instances
     * @return {string[]}
     * Array of component IDs
     */
    Component.getAllInstanceIDs = function () {
        return Object.keys(this.instanceRegistry);
    };
    /**
     * Retrieves all registered component instances
     * @return {ComponentType[]}
     * Array of components
     */
    Component.getAllInstances = function () {
        var _this = this;
        var ids = this.getAllInstanceIDs();
        return ids.map(function (id) { return _this.instanceRegistry[id]; });
    };
    Component.getInstanceById = function (id) {
        return this.instanceRegistry[id];
    };
    Component.relayMessage = function (sender, // Possibly layout?
    message, // should probably be a typical event with optional payloads
    target // currently all or type. Could also add groups
    ) {
        var _this = this;
        if (target === void 0) { target = 'all'; }
        this.getAllInstanceIDs()
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
    Component.getUUID = function () {
        return 'dashboard-component-' + uniqueKey();
    };
    Component.prototype.setStore = function (store) {
        var _this = this;
        this.store = store;
        if (store) {
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
        }
        // Clean up old event listeners
        if (!store && this.tableEvents.length) {
            while (this.tableEvents.length) {
                var eventCallback = this.tableEvents.pop();
                if (typeof eventCallback === 'function') {
                    eventCallback();
                }
            }
        }
        fireEvent(this, 'storeAttached', { store: store });
        return this;
    };
    Component.prototype.resize = function (width, height) {
        if (width === void 0) { width = this.dimensions.width; }
        if (height === void 0) { height = this.dimensions.height; }
        var percentageRegex = /\%$/;
        var dimensions = {
            width: { value: 0, type: 'px' },
            height: { value: 0, type: 'px' }
        };
        if (typeof width === 'string') {
            if (width.match(percentageRegex)) {
                dimensions.width.value = Number(width.replace(percentageRegex, ''));
                dimensions.width.type = '%';
            }
            // Perhaps somewhat naive
            dimensions.width.value = Number(width.replace('px', ''));
        }
        else {
            dimensions.width.value = width;
        }
        if (typeof height === 'string') {
            if (height.match(percentageRegex)) {
                dimensions.height.value = Number(height.replace(percentageRegex, ''));
                dimensions.height.type = '%';
            }
            // Perhaps somewhat naive
            dimensions.height.value = Number(height.replace('px', ''));
        }
        else {
            dimensions.height.value = height;
        }
        this.dimensions.height = dimensions.height.value;
        this.dimensions.width = dimensions.width.value;
        this.element.style.width = dimensions.width.value + dimensions.width.type;
        this.element.style.height = dimensions.height.value + dimensions.height.type;
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
        // Set up the store on inital load if it has not been done
        if (!this.hasLoaded && this.store) {
            this.setStore(this.store);
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
        this.hasLoaded = true;
        return this;
    };
    /**
     * @todo make this call load on initial render
     *
     * @return {this}
     */
    Component.prototype.render = function () {
        var _a, _b;
        if (!this.hasLoaded) {
            this.load();
            // Call resize to set the sizes
            this.resize((_a = this.options.dimensions) === null || _a === void 0 ? void 0 : _a.width, (_b = this.options.dimensions) === null || _b === void 0 ? void 0 : _b.height);
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
     * Converts the class instance to a class JSON.
     *
     * @return {Component.ClassJSON}
     * Class JSON of this Component instance.
     */
    Component.prototype.toJSON = function () {
        var _a;
        return {
            $class: Component.getName(this.constructor),
            store: (_a = this.store) === null || _a === void 0 ? void 0 : _a.toJSON(),
            options: {
                parentElement: this.parentElement.id,
                dimensions: this.dimensions,
                type: this.options.type,
                id: this.options.id || this.id
            }
        };
    };
    /**
     *
     * Record of component instances
     *
     */
    Component.instanceRegistry = {};
    /**
     * Regular expression to extract the  name (group 1) from the
     * stringified class type.
     */
    Component.nameRegExp = /^function\s+(\w*?)(?:Component)?\s*\(/;
    Component.defaultOptions = {
        className: 'highcharts-dashboard-component',
        parentElement: document.body,
        type: '',
        id: ''
    };
    return Component;
}());
export default Component;
