/**
 * The ElementMonitor class is a helper class that keeps count of adds and removes of
 * SVG/VMLElements and that their destroy method is called. This is to avoid memory leaks.
 */
function ElementMonitor(elementClass) {
	var that = this;
	this.KEY = 'elmt-id';

	// Store the 'base' implementations
	elementClass.prototype.base_init = elementClass.prototype.init;
	elementClass.prototype.base_destroy = elementClass.prototype.destroy;

	// Override with new ones that registers the init/destroy calls
	elementClass.prototype.init = function (renderer, nodeName) {
		// Call original implementation
		this.base_init(renderer, nodeName);

		// Register with the monitor
		that.registerElement(this, nodeName);
	};

	elementClass.prototype.destroy = function () {
		// Unregister with the monitor
		that.unregisterElement(this);

		// Call original implementation
		this.base_destroy();
	};

	this.reset();
}

/**
 * Disconnects the ElementMonitor and stops monitoring create calls.
 */
ElementMonitor.prototype.disconnect = function (elementClass) {
	var that = this;

	// Restore the 'base' implementations
	elementClass.prototype.init = elementClass.prototype.base_init;
	elementClass.prototype.destroy = elementClass.prototype.base_destroy;
};

/**
 * Returns the id to use for the next object.
 */
ElementMonitor.prototype.getId = function () {
	return this.nextId++;
};

/**
 * Registers an element with the monitor.
 */
ElementMonitor.prototype.registerElement = function (element, nodeName) {
	// 1. Create an id so to not have a reference to the object
	// 2. Store the id in our registry and in the object
	// 3. Add a mapping from the id to the elements nodeName
	var id;
	if (element[this.KEY] !== undefined) {
		id = element[this.KEY];
	} else {
		element[this.KEY] = id = this.getId();
	}

	// Create registry item if its not there
	if (!this.registry[id]) {
		this.registry[id] = {
			nodeName: nodeName,
			// caller path: registerElement -> SVGElement -> SVGRenderer -> SVGRenderer -> interesting stuff
			caller: ElementMonitor.prototype.registerElement.caller.caller.caller.toString()
		};
	}
};

/**
 * Registers an element to the monitor.
 */
ElementMonitor.prototype.unregisterElement = function (element) {
	var id = element[this.KEY];
	if (id === undefined) {
		jstestdriver.console.log('Trying to unregister an element (' + element.nodeName + ') thats not registered yet.');
	}

	var elementObject = this.registry[id];

	if (!elementObject)  {
		jstestdriver.console.log('Trying to unregister an element (' + element.nodeName + ') thats not found in the registry.');
	} else {
		//elementObject.removed = true;
		delete this.registry[id];
		delete element[this.KEY];
	}
};

/**
 * Logs currently monitored elements to the console.
 */
ElementMonitor.prototype.log = function () {
	var writeHeader = true,
		countByType = {},
		total = 0;

	for (var id in this.registry) {
		if (writeHeader) {
			jstestdriver.console.log('');
			jstestdriver.console.log('----- registered elements with functions -----');
			writeHeader = false;
		}
		var elementObject = this.registry[id];
		jstestdriver.console.log(id + ' nodeName: ' + elementObject.nodeName + ' <- ' + elementObject.caller);
	}
	writeHeader = true;

	for (var id in this.registry) {
		if (writeHeader) {
			jstestdriver.console.log('');
			jstestdriver.console.log('----- registered elements summary -----');
			writeHeader = false;
		}
		var elementObject = this.registry[id];
		jstestdriver.console.log(id + ' nodeName: ' + elementObject.nodeName);

		countByType[elementObject.nodeName] = countByType[elementObject.nodeName] ? countByType[elementObject.nodeName] + 1 : 1;
	}

	if (writeHeader === false) { // Meaning there were some elements in the registry
		jstestdriver.console.log('');
		jstestdriver.console.log('--- summary ---');
		for (var name in countByType) {
			jstestdriver.console.log(countByType[name] + '\t' + name);
			total += countByType[name];
		}
		jstestdriver.console.log(total + '\ttotal');
	}

	if (this.nextId === 0) {
		jstestdriver.console.log('Warning: There were no logged elements in the test, this may indicate setup problems.');
	}
};

/**
 * Resets the id counter and clears the registry.
 */
ElementMonitor.prototype.reset = function () {
	this.registry = {};
	this.nextId = 0;
};
