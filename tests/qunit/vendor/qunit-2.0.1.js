/*!
 * QUnit 2.0.1
 * https://qunitjs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2016-07-23T19:39Z
 */

( function( global ) {

var QUnit = {};

var Date = global.Date;
var now = Date.now || function() {
	return new Date().getTime();
};

var setTimeout = global.setTimeout;
var clearTimeout = global.clearTimeout;

// Store a local window from the global to allow direct references.
var window = global.window;

var defined = {
	document: window && window.document !== undefined,
	setTimeout: setTimeout !== undefined,
	sessionStorage: ( function() {
		var x = "qunit-test-string";
		try {
			sessionStorage.setItem( x, x );
			sessionStorage.removeItem( x );
			return true;
		} catch ( e ) {
			return false;
		}
	}() )
};

var fileName = ( sourceFromStacktrace( 0 ) || "" ).replace( /(:\d+)+\)?/, "" ).replace( /.+\//, "" );
var globalStartCalled = false;
var runStarted = false;

var autorun = false;

var toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty;

// Returns a new Array with the elements that are in a but not in b
function diff( a, b ) {
	var i, j,
		result = a.slice();

	for ( i = 0; i < result.length; i++ ) {
		for ( j = 0; j < b.length; j++ ) {
			if ( result[ i ] === b[ j ] ) {
				result.splice( i, 1 );
				i--;
				break;
			}
		}
	}
	return result;
}

// From jquery.js
function inArray( elem, array ) {
	if ( array.indexOf ) {
		return array.indexOf( elem );
	}

	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}

/**
 * Makes a clone of an object using only Array or Object as base,
 * and copies over the own enumerable properties.
 *
 * @param {Object} obj
 * @return {Object} New object with only the own properties (recursively).
 */
function objectValues ( obj ) {
	var key, val,
		vals = QUnit.is( "array", obj ) ? [] : {};
	for ( key in obj ) {
		if ( hasOwn.call( obj, key ) ) {
			val = obj[ key ];
			vals[ key ] = val === Object( val ) ? objectValues( val ) : val;
		}
	}
	return vals;
}

function extend( a, b, undefOnly ) {
	for ( var prop in b ) {
		if ( hasOwn.call( b, prop ) ) {
			if ( b[ prop ] === undefined ) {
				delete a[ prop ];
			} else if ( !( undefOnly && typeof a[ prop ] !== "undefined" ) ) {
				a[ prop ] = b[ prop ];
			}
		}
	}

	return a;
}

function objectType( obj ) {
	if ( typeof obj === "undefined" ) {
		return "undefined";
	}

	// Consider: typeof null === object
	if ( obj === null ) {
		return "null";
	}

	var match = toString.call( obj ).match( /^\[object\s(.*)\]$/ ),
		type = match && match[ 1 ];

	switch ( type ) {
		case "Number":
			if ( isNaN( obj ) ) {
				return "nan";
			}
			return "number";
		case "String":
		case "Boolean":
		case "Array":
		case "Set":
		case "Map":
		case "Date":
		case "RegExp":
		case "Function":
		case "Symbol":
			return type.toLowerCase();
	}
	if ( typeof obj === "object" ) {
		return "object";
	}
}

// Safe object type checking
function is( type, obj ) {
	return QUnit.objectType( obj ) === type;
}

// Doesn't support IE9, it will return undefined on these browsers
// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
function extractStacktrace( e, offset ) {
	offset = offset === undefined ? 4 : offset;

	var stack, include, i;

	if ( e.stack ) {
		stack = e.stack.split( "\n" );
		if ( /^error$/i.test( stack[ 0 ] ) ) {
			stack.shift();
		}
		if ( fileName ) {
			include = [];
			for ( i = offset; i < stack.length; i++ ) {
				if ( stack[ i ].indexOf( fileName ) !== -1 ) {
					break;
				}
				include.push( stack[ i ] );
			}
			if ( include.length ) {
				return include.join( "\n" );
			}
		}
		return stack[ offset ];
	}
}

function sourceFromStacktrace( offset ) {
	var error = new Error();

	// Support: Safari <=7 only, IE <=10 - 11 only
	// Not all browsers generate the `stack` property for `new Error()`, see also #636
	if ( !error.stack ) {
		try {
			throw error;
		} catch ( err ) {
			error = err;
		}
	}

	return extractStacktrace( error, offset );
}

/**
 * Config object: Maintain internal state
 * Later exposed as QUnit.config
 * `config` initialized at top of scope
 */
var config = {

	// The queue of tests to run
	queue: [],

	// Block until document ready
	blocking: true,

	// By default, run previously failed tests first
	// very useful in combination with "Hide passed tests" checked
	reorder: true,

	// By default, modify document.title when suite is done
	altertitle: true,

	// HTML Reporter: collapse every test except the first failing test
	// If false, all failing tests will be expanded
	collapse: true,

	// By default, scroll to top of the page when suite is done
	scrolltop: true,

	// Depth up-to which object will be dumped
	maxDepth: 5,

	// When enabled, all tests must call expect()
	requireExpects: false,

	// Placeholder for user-configurable form-exposed URL parameters
	urlConfig: [],

	// Set of all modules.
	modules: [],

	// Stack of nested modules
	moduleStack: [],

	// The first unnamed module
	currentModule: {
		name: "",
		tests: []
	},

	callbacks: {}
};

// Push a loose unnamed module to the modules collection
config.modules.push( config.currentModule );

// Register logging callbacks
function registerLoggingCallbacks( obj ) {
	var i, l, key,
		callbackNames = [ "begin", "done", "log", "testStart", "testDone",
			"moduleStart", "moduleDone" ];

	function registerLoggingCallback( key ) {
		var loggingCallback = function( callback ) {
			if ( objectType( callback ) !== "function" ) {
				throw new Error(
					"QUnit logging methods require a callback function as their first parameters."
				);
			}

			config.callbacks[ key ].push( callback );
		};

		return loggingCallback;
	}

	for ( i = 0, l = callbackNames.length; i < l; i++ ) {
		key = callbackNames[ i ];

		// Initialize key collection of logging callback
		if ( objectType( config.callbacks[ key ] ) === "undefined" ) {
			config.callbacks[ key ] = [];
		}

		obj[ key ] = registerLoggingCallback( key );
	}
}

function runLoggingCallbacks( key, args ) {
	var i, l, callbacks;

	callbacks = config.callbacks[ key ];
	for ( i = 0, l = callbacks.length; i < l; i++ ) {
		callbacks[ i ]( args );
	}
}

( function() {
	if ( !defined.document ) {
		return;
	}

	// `onErrorFnPrev` initialized at top of scope
	// Preserve other handlers
	var onErrorFnPrev = window.onerror;

	// Cover uncaught exceptions
	// Returning true will suppress the default browser handler,
	// returning false will let it run.
	window.onerror = function( error, filePath, linerNr ) {
		var ret = false;
		if ( onErrorFnPrev ) {
			ret = onErrorFnPrev( error, filePath, linerNr );
		}

		// Treat return value as window.onerror itself does,
		// Only do our handling if not suppressed.
		if ( ret !== true ) {
			if ( QUnit.config.current ) {
				if ( QUnit.config.current.ignoreGlobalErrors ) {
					return true;
				}
				QUnit.pushFailure( error, filePath + ":" + linerNr );
			} else {
				QUnit.test( "global failure", extend( function() {
					QUnit.pushFailure( error, filePath + ":" + linerNr );
				}, { validTest: true } ) );
			}
			return false;
		}

		return ret;
	};
}() );

// Figure out if we're running the tests from a server or not
QUnit.isLocal = !( defined.document && window.location.protocol !== "file:" );

// Expose the current QUnit version
QUnit.version = "2.0.1";

extend( QUnit, {

	// Call on start of module test to prepend name to all tests
	module: function( name, testEnvironment, executeNow ) {
		var module, moduleFns;
		var currentModule = config.currentModule;

		if ( arguments.length === 2 ) {
			if ( objectType( testEnvironment ) === "function" ) {
				executeNow = testEnvironment;
				testEnvironment = undefined;
			}
		}

		module = createModule();

		if ( testEnvironment && ( testEnvironment.setup || testEnvironment.teardown ) ) {
			console.warn(
				"Module's `setup` and `teardown` are not hooks anymore on QUnit 2.0, use " +
				"`beforeEach` and `afterEach` instead\n" +
				"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
			);
		}

		moduleFns = {
			before: setHook( module, "before" ),
			beforeEach: setHook( module, "beforeEach" ),
			afterEach: setHook( module, "afterEach" ),
			after: setHook( module, "after" )
		};

		if ( objectType( executeNow ) === "function" ) {
			config.moduleStack.push( module );
			setCurrentModule( module );
			executeNow.call( module.testEnvironment, moduleFns );
			config.moduleStack.pop();
			module = module.parentModule || currentModule;
		}

		setCurrentModule( module );

		function createModule() {
			var parentModule = config.moduleStack.length ?
				config.moduleStack.slice( -1 )[ 0 ] : null;
			var moduleName = parentModule !== null ?
				[ parentModule.name, name ].join( " > " ) : name;
			var module = {
				name: moduleName,
				parentModule: parentModule,
				tests: [],
				moduleId: generateHash( moduleName ),
				testsRun: 0
			};

			var env = {};
			if ( parentModule ) {
				parentModule.childModule = module;
				extend( env, parentModule.testEnvironment );
				delete env.beforeEach;
				delete env.afterEach;
			}
			extend( env, testEnvironment );
			module.testEnvironment = env;

			config.modules.push( module );
			return module;
		}

		function setCurrentModule( module ) {
			config.currentModule = module;
		}

	},

	test: test,

	skip: skip,

	only: only,

	start: function( count ) {
		var globalStartAlreadyCalled = globalStartCalled;

		if ( !config.current ) {
			globalStartCalled = true;

			if ( runStarted ) {
				throw new Error( "Called start() while test already started running" );
			} else if ( globalStartAlreadyCalled || count > 1 ) {
				throw new Error( "Called start() outside of a test context too many times" );
			} else if ( config.autostart ) {
				throw new Error( "Called start() outside of a test context when " +
					"QUnit.config.autostart was true" );
			} else if ( !config.pageLoaded ) {

				// The page isn't completely loaded yet, so bail out and let `QUnit.load` handle it
				config.autostart = true;
				return;
			}
		} else {
			throw new Error(
				"QUnit.start cannot be called inside a test context. This feature is removed in " +
				"QUnit 2.0. For async tests, use QUnit.test() with assert.async() instead.\n" +
				"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
			);
		}

		scheduleBegin();
	},

	config: config,

	is: is,

	objectType: objectType,

	extend: extend,

	load: function() {
		config.pageLoaded = true;

		// Initialize the configuration options
		extend( config, {
			stats: { all: 0, bad: 0 },
			moduleStats: { all: 0, bad: 0 },
			started: 0,
			updateRate: 1000,
			autostart: true,
			filter: ""
		}, true );

		if ( !runStarted ) {
			config.blocking = false;

			if ( config.autostart ) {
				scheduleBegin();
			}
		}
	},

	stack: function( offset ) {
		offset = ( offset || 0 ) + 2;
		return sourceFromStacktrace( offset );
	}
} );

registerLoggingCallbacks( QUnit );

function scheduleBegin() {

	runStarted = true;

	// Add a slight delay to allow definition of more modules and tests.
	if ( defined.setTimeout ) {
		setTimeout( function() {
			begin();
		}, 13 );
	} else {
		begin();
	}
}

function begin() {
	var i, l,
		modulesLog = [];

	// If the test run hasn't officially begun yet
	if ( !config.started ) {

		// Record the time of the test run's beginning
		config.started = now();

		// Delete the loose unnamed module if unused.
		if ( config.modules[ 0 ].name === "" && config.modules[ 0 ].tests.length === 0 ) {
			config.modules.shift();
		}

		// Avoid unnecessary information by not logging modules' test environments
		for ( i = 0, l = config.modules.length; i < l; i++ ) {
			modulesLog.push( {
				name: config.modules[ i ].name,
				tests: config.modules[ i ].tests
			} );
		}

		// The test run is officially beginning now
		runLoggingCallbacks( "begin", {
			totalTests: Test.count,
			modules: modulesLog
		} );
	}

	config.blocking = false;
	process( true );
}

function process( last ) {
	function next() {
		process( last );
	}
	var start = now();
	config.depth = ( config.depth || 0 ) + 1;

	while ( config.queue.length && !config.blocking ) {
		if ( !defined.setTimeout || config.updateRate <= 0 ||
				( ( now() - start ) < config.updateRate ) ) {
			if ( config.current ) {

				// Reset async tracking for each phase of the Test lifecycle
				config.current.usedAsync = false;
			}
			config.queue.shift()();
		} else {
			setTimeout( next, 13 );
			break;
		}
	}
	config.depth--;
	if ( last && !config.blocking && !config.queue.length && config.depth === 0 ) {
		done();
	}
}

function done() {
	var runtime, passed;

	autorun = true;

	// Log the last module results
	if ( config.previousModule ) {
		runLoggingCallbacks( "moduleDone", {
			name: config.previousModule.name,
			tests: config.previousModule.tests,
			failed: config.moduleStats.bad,
			passed: config.moduleStats.all - config.moduleStats.bad,
			total: config.moduleStats.all,
			runtime: now() - config.moduleStats.started
		} );
	}
	delete config.previousModule;

	runtime = now() - config.started;
	passed = config.stats.all - config.stats.bad;

	runLoggingCallbacks( "done", {
		failed: config.stats.bad,
		passed: passed,
		total: config.stats.all,
		runtime: runtime
	} );
}

function setHook( module, hookName ) {
	if ( module.testEnvironment === undefined ) {
		module.testEnvironment = {};
	}

	return function( callback ) {
		module.testEnvironment[ hookName ] = callback;
	};
}

var unitSampler,
	focused = false,
	priorityCount = 0;

function Test( settings ) {
	var i, l;

	++Test.count;

	this.expected = null;
	extend( this, settings );
	this.assertions = [];
	this.semaphore = 0;
	this.usedAsync = false;
	this.module = config.currentModule;
	this.stack = sourceFromStacktrace( 3 );

	// Register unique strings
	for ( i = 0, l = this.module.tests; i < l.length; i++ ) {
		if ( this.module.tests[ i ].name === this.testName ) {
			this.testName += " ";
		}
	}

	this.testId = generateHash( this.module.name, this.testName );

	this.module.tests.push( {
		name: this.testName,
		testId: this.testId
	} );

	if ( settings.skip ) {

		// Skipped tests will fully ignore any sent callback
		this.callback = function() {};
		this.async = false;
		this.expected = 0;
	} else {
		this.assert = new Assert( this );
	}
}

Test.count = 0;

Test.prototype = {
	before: function() {
		if (

			// Emit moduleStart when we're switching from one module to another
			this.module !== config.previousModule ||

				// They could be equal (both undefined) but if the previousModule property doesn't
				// yet exist it means this is the first test in a suite that isn't wrapped in a
				// module, in which case we'll just emit a moduleStart event for 'undefined'.
				// Without this, reporters can get testStart before moduleStart  which is a problem.
				!hasOwn.call( config, "previousModule" )
		) {
			if ( hasOwn.call( config, "previousModule" ) ) {
				runLoggingCallbacks( "moduleDone", {
					name: config.previousModule.name,
					tests: config.previousModule.tests,
					failed: config.moduleStats.bad,
					passed: config.moduleStats.all - config.moduleStats.bad,
					total: config.moduleStats.all,
					runtime: now() - config.moduleStats.started
				} );
			}
			config.previousModule = this.module;
			config.moduleStats = { all: 0, bad: 0, started: now() };
			runLoggingCallbacks( "moduleStart", {
				name: this.module.name,
				tests: this.module.tests
			} );
		}

		config.current = this;

		if ( this.module.testEnvironment ) {
			delete this.module.testEnvironment.before;
			delete this.module.testEnvironment.beforeEach;
			delete this.module.testEnvironment.afterEach;
			delete this.module.testEnvironment.after;
		}
		this.testEnvironment = extend( {}, this.module.testEnvironment );

		this.started = now();
		runLoggingCallbacks( "testStart", {
			name: this.testName,
			module: this.module.name,
			testId: this.testId
		} );

		if ( !config.pollution ) {
			saveGlobal();
		}
	},

	run: function() {
		var promise;

		config.current = this;

		this.callbackStarted = now();

		if ( config.notrycatch ) {
			runTest( this );
			return;
		}

		try {
			runTest( this );
		} catch ( e ) {
			this.pushFailure( "Died on test #" + ( this.assertions.length + 1 ) + " " +
				this.stack + ": " + ( e.message || e ), extractStacktrace( e, 0 ) );

			// Else next test will carry the responsibility
			saveGlobal();

			// Restart the tests if they're blocking
			if ( config.blocking ) {
				internalRecover( this );
			}
		}

		function runTest( test ) {
			promise = test.callback.call( test.testEnvironment, test.assert );
			test.resolvePromise( promise );
		}
	},

	after: function() {
		checkPollution();
	},

	queueHook: function( hook, hookName, hookOwner ) {
		var promise,
			test = this;
		return function runHook() {
			if ( hookName === "before" ) {
				if ( hookOwner.testsRun !== 0 ) {
					return;
				}

				test.preserveEnvironment = true;
			}

			if ( hookName === "after" && hookOwner.testsRun !== numberOfTests( hookOwner ) - 1 ) {
				return;
			}

			config.current = test;
			if ( config.notrycatch ) {
				callHook();
				return;
			}
			try {
				callHook();
			} catch ( error ) {
				test.pushFailure( hookName + " failed on " + test.testName + ": " +
				( error.message || error ), extractStacktrace( error, 0 ) );
			}

			function callHook() {
				promise = hook.call( test.testEnvironment, test.assert );
				test.resolvePromise( promise, hookName );
			}
		};
	},

	// Currently only used for module level hooks, can be used to add global level ones
	hooks: function( handler ) {
		var hooks = [];

		function processHooks( test, module ) {
			if ( module.parentModule ) {
				processHooks( test, module.parentModule );
			}
			if ( module.testEnvironment &&
				QUnit.objectType( module.testEnvironment[ handler ] ) === "function" ) {
				hooks.push( test.queueHook( module.testEnvironment[ handler ], handler, module ) );
			}
		}

		// Hooks are ignored on skipped tests
		if ( !this.skip ) {
			processHooks( this, this.module );
		}
		return hooks;
	},

	finish: function() {
		config.current = this;
		if ( config.requireExpects && this.expected === null ) {
			this.pushFailure( "Expected number of assertions to be defined, but expect() was " +
				"not called.", this.stack );
		} else if ( this.expected !== null && this.expected !== this.assertions.length ) {
			this.pushFailure( "Expected " + this.expected + " assertions, but " +
				this.assertions.length + " were run", this.stack );
		} else if ( this.expected === null && !this.assertions.length ) {
			this.pushFailure( "Expected at least one assertion, but none were run - call " +
				"expect(0) to accept zero assertions.", this.stack );
		}

		var i,
			skipped = !!this.skip,
			bad = 0;

		this.runtime = now() - this.started;

		config.stats.all += this.assertions.length;
		config.moduleStats.all += this.assertions.length;

		for ( i = 0; i < this.assertions.length; i++ ) {
			if ( !this.assertions[ i ].result ) {
				bad++;
				config.stats.bad++;
				config.moduleStats.bad++;
			}
		}

		notifyTestsRan( this.module );
		runLoggingCallbacks( "testDone", {
			name: this.testName,
			module: this.module.name,
			skipped: skipped,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length,
			runtime: skipped ? 0 : this.runtime,

			// HTML Reporter use
			assertions: this.assertions,
			testId: this.testId,

			// Source of Test
			source: this.stack
		} );

		config.current = undefined;
	},

	preserveTestEnvironment: function() {
		if ( this.preserveEnvironment ) {
			this.module.testEnvironment = this.testEnvironment;
			this.testEnvironment = extend( {}, this.module.testEnvironment );
		}
	},

	queue: function() {
		var priority,
			test = this;

		if ( !this.valid() ) {
			return;
		}

		function run() {

			// Each of these can by async
			synchronize( [
				function() {
					test.before();
				},

				test.hooks( "before" ),

				function() {
					test.preserveTestEnvironment();
				},

				test.hooks( "beforeEach" ),

				function() {
					test.run();
				},

				test.hooks( "afterEach" ).reverse(),
				test.hooks( "after" ).reverse(),

				function() {
					test.after();
				},

				function() {
					test.finish();
				}
			] );
		}

		// Prioritize previously failed tests, detected from sessionStorage
		priority = QUnit.config.reorder && defined.sessionStorage &&
				+sessionStorage.getItem( "qunit-test-" + this.module.name + "-" + this.testName );

		return synchronize( run, priority, config.seed );
	},

	pushResult: function( resultInfo ) {

		// Destructure of resultInfo = { result, actual, expected, message, negative }
		var source,
			details = {
				module: this.module.name,
				name: this.testName,
				result: resultInfo.result,
				message: resultInfo.message,
				actual: resultInfo.actual,
				expected: resultInfo.expected,
				testId: this.testId,
				negative: resultInfo.negative || false,
				runtime: now() - this.started
			};

		if ( !resultInfo.result ) {
			source = sourceFromStacktrace();

			if ( source ) {
				details.source = source;
			}
		}

		runLoggingCallbacks( "log", details );

		this.assertions.push( {
			result: !!resultInfo.result,
			message: resultInfo.message
		} );
	},

	pushFailure: function( message, source, actual ) {
		if ( !( this instanceof Test ) ) {
			throw new Error( "pushFailure() assertion outside test context, was " +
				sourceFromStacktrace( 2 ) );
		}

		var details = {
				module: this.module.name,
				name: this.testName,
				result: false,
				message: message || "error",
				actual: actual || null,
				testId: this.testId,
				runtime: now() - this.started
			};

		if ( source ) {
			details.source = source;
		}

		runLoggingCallbacks( "log", details );

		this.assertions.push( {
			result: false,
			message: message
		} );
	},

	resolvePromise: function( promise, phase ) {
		var then, resume, message,
			test = this;
		if ( promise != null ) {
			then = promise.then;
			if ( QUnit.objectType( then ) === "function" ) {
				resume = internalStop( test );
				then.call(
					promise,
					function() { resume(); },
					function( error ) {
						message = "Promise rejected " +
							( !phase ? "during" : phase.replace( /Each$/, "" ) ) +
							" " + test.testName + ": " + ( error.message || error );
						test.pushFailure( message, extractStacktrace( error, 0 ) );

						// Else next test will carry the responsibility
						saveGlobal();

						// Unblock
						resume();
					}
				);
			}
		}
	},

	valid: function() {
		var filter = config.filter,
			regexFilter = /^(!?)\/([\w\W]*)\/(i?$)/.exec( filter ),
			module = config.module && config.module.toLowerCase(),
			fullName = ( this.module.name + ": " + this.testName );

		function moduleChainNameMatch( testModule ) {
			var testModuleName = testModule.name ? testModule.name.toLowerCase() : null;
			if ( testModuleName === module ) {
				return true;
			} else if ( testModule.parentModule ) {
				return moduleChainNameMatch( testModule.parentModule );
			} else {
				return false;
			}
		}

		function moduleChainIdMatch( testModule ) {
			return inArray( testModule.moduleId, config.moduleId ) > -1 ||
				testModule.parentModule && moduleChainIdMatch( testModule.parentModule );
		}

		// Internally-generated tests are always valid
		if ( this.callback && this.callback.validTest ) {
			return true;
		}

		if ( config.moduleId && config.moduleId.length > 0 &&
			!moduleChainIdMatch( this.module ) ) {

			return false;
		}

		if ( config.testId && config.testId.length > 0 &&
			inArray( this.testId, config.testId ) < 0 ) {

			return false;
		}

		if ( module && !moduleChainNameMatch( this.module ) ) {
			return false;
		}

		if ( !filter ) {
			return true;
		}

		return regexFilter ?
			this.regexFilter( !!regexFilter[ 1 ], regexFilter[ 2 ], regexFilter[ 3 ], fullName ) :
			this.stringFilter( filter, fullName );
	},

	regexFilter: function( exclude, pattern, flags, fullName ) {
		var regex = new RegExp( pattern, flags );
		var match = regex.test( fullName );

		return match !== exclude;
	},

	stringFilter: function( filter, fullName ) {
		filter = filter.toLowerCase();
		fullName = fullName.toLowerCase();

		var include = filter.charAt( 0 ) !== "!";
		if ( !include ) {
			filter = filter.slice( 1 );
		}

		// If the filter matches, we need to honour include
		if ( fullName.indexOf( filter ) !== -1 ) {
			return include;
		}

		// Otherwise, do the opposite
		return !include;
	}
};

QUnit.pushFailure = function() {
	if ( !QUnit.config.current ) {
		throw new Error( "pushFailure() assertion outside test context, in " +
			sourceFromStacktrace( 2 ) );
	}

	// Gets current test obj
	var currentTest = QUnit.config.current;

	return currentTest.pushFailure.apply( currentTest, arguments );
};

// Based on Java's String.hashCode, a simple but not
// rigorously collision resistant hashing function
function generateHash( module, testName ) {
	var hex,
		i = 0,
		hash = 0,
		str = module + "\x1C" + testName,
		len = str.length;

	for ( ; i < len; i++ ) {
		hash  = ( ( hash << 5 ) - hash ) + str.charCodeAt( i );
		hash |= 0;
	}

	// Convert the possibly negative integer hash code into an 8 character hex string, which isn't
	// strictly necessary but increases user understanding that the id is a SHA-like hash
	hex = ( 0x100000000 + hash ).toString( 16 );
	if ( hex.length < 8 ) {
		hex = "0000000" + hex;
	}

	return hex.slice( -8 );
}

function synchronize( callback, priority, seed ) {
	var last = !priority,
		index;

	if ( QUnit.objectType( callback ) === "array" ) {
		while ( callback.length ) {
			synchronize( callback.shift() );
		}
		return;
	}

	if ( priority ) {
		config.queue.splice( priorityCount++, 0, callback );
	} else if ( seed ) {
		if ( !unitSampler ) {
			unitSampler = unitSamplerGenerator( seed );
		}

		// Insert into a random position after all priority items
		index = Math.floor( unitSampler() * ( config.queue.length - priorityCount + 1 ) );
		config.queue.splice( priorityCount + index, 0, callback );
	} else {
		config.queue.push( callback );
	}

	if ( autorun && !config.blocking ) {
		process( last );
	}
}

function unitSamplerGenerator( seed ) {

	// 32-bit xorshift, requires only a nonzero seed
	// http://excamera.com/sphinx/article-xorshift.html
	var sample = parseInt( generateHash( seed ), 16 ) || -1;
	return function() {
		sample ^= sample << 13;
		sample ^= sample >>> 17;
		sample ^= sample << 5;

		// ECMAScript has no unsigned number type
		if ( sample < 0 ) {
			sample += 0x100000000;
		}

		return sample / 0x100000000;
	};
}

function saveGlobal() {
	config.pollution = [];

	if ( config.noglobals ) {
		for ( var key in global ) {
			if ( hasOwn.call( global, key ) ) {

				// In Opera sometimes DOM element ids show up here, ignore them
				if ( /^qunit-test-output/.test( key ) ) {
					continue;
				}
				config.pollution.push( key );
			}
		}
	}
}

function checkPollution() {
	var newGlobals,
		deletedGlobals,
		old = config.pollution;

	saveGlobal();

	newGlobals = diff( config.pollution, old );
	if ( newGlobals.length > 0 ) {
		QUnit.pushFailure( "Introduced global variable(s): " + newGlobals.join( ", " ) );
	}

	deletedGlobals = diff( old, config.pollution );
	if ( deletedGlobals.length > 0 ) {
		QUnit.pushFailure( "Deleted global variable(s): " + deletedGlobals.join( ", " ) );
	}
}

// Will be exposed as QUnit.test
function test( testName, callback ) {
	if ( focused )  { return; }

	var newTest;

	newTest = new Test( {
		testName: testName,
		callback: callback
	} );

	newTest.queue();
}

// Will be exposed as QUnit.skip
function skip( testName ) {
	if ( focused )  { return; }

	var test = new Test( {
		testName: testName,
		skip: true
	} );

	test.queue();
}

// Will be exposed as QUnit.only
function only( testName, callback ) {
	var newTest;

	if ( focused )  { return; }

	QUnit.config.queue.length = 0;
	focused = true;

	newTest = new Test( {
		testName: testName,
		callback: callback
	} );

	newTest.queue();
}

// Put a hold on processing and return a function that will release it.
function internalStop( test ) {
	var released = false;

	test.semaphore += 1;
	config.blocking = true;

	// Set a recovery timeout, if so configured.
	if ( config.testTimeout && defined.setTimeout ) {
		clearTimeout( config.timeout );
		config.timeout = setTimeout( function() {
			QUnit.pushFailure( "Test timed out", sourceFromStacktrace( 2 ) );
			internalRecover( test );
		}, config.testTimeout );
	}

	return function resume() {
		if ( released ) {
			return;
		}

		released = true;
		test.semaphore -= 1;
		internalStart( test );
	};
}

// Forcefully release all processing holds.
function internalRecover( test ) {
	test.semaphore = 0;
	internalStart( test );
}

// Release a processing hold, scheduling a resumption attempt if no holds remain.
function internalStart( test ) {

	// If semaphore is non-numeric, throw error
	if ( isNaN( test.semaphore ) ) {
		test.semaphore = 0;

		QUnit.pushFailure(
			"Invalid value on test.semaphore",
			sourceFromStacktrace( 2 )
		);
		return;
	}

	// Don't start until equal number of stop-calls
	if ( test.semaphore > 0 ) {
		return;
	}

	// Throw an Error if start is called more often than stop
	if ( test.semaphore < 0 ) {
		test.semaphore = 0;

		QUnit.pushFailure(
			"Tried to restart test while already started (test's semaphore was 0 already)",
			sourceFromStacktrace( 2 )
		);
		return;
	}

	// Add a slight delay to allow more assertions etc.
	if ( defined.setTimeout ) {
		if ( config.timeout ) {
			clearTimeout( config.timeout );
		}
		config.timeout = setTimeout( function() {
			if ( test.semaphore > 0 ) {
				return;
			}

			if ( config.timeout ) {
				clearTimeout( config.timeout );
			}

			begin();
		}, 13 );
	} else {
		begin();
	}
}

function numberOfTests( module ) {
	var count = module.tests.length;
	while ( module = module.childModule ) {
		count += module.tests.length;
	}
	return count;
}

function notifyTestsRan( module ) {
	module.testsRun++;
	while ( module = module.parentModule ) {
		module.testsRun++;
	}
}

function Assert( testContext ) {
	this.test = testContext;
}

// Assert helpers
QUnit.assert = Assert.prototype = {

	// Specify the number of expected assertions to guarantee that failed test
	// (no assertions are run at all) don't slip through.
	expect: function( asserts ) {
		if ( arguments.length === 1 ) {
			this.test.expected = asserts;
		} else {
			return this.test.expected;
		}
	},

	// Put a hold on processing and return a function that will release it a maximum of once.
	async: function( count ) {
		var resume,
			test = this.test,
			popped = false,
			acceptCallCount = count;

		if ( typeof acceptCallCount === "undefined" ) {
			acceptCallCount = 1;
		}

		test.usedAsync = true;
		resume = internalStop( test );

		return function done() {

			if ( popped ) {
				test.pushFailure( "Too many calls to the `assert.async` callback",
					sourceFromStacktrace( 2 ) );
				return;
			}
			acceptCallCount -= 1;
			if ( acceptCallCount > 0 ) {
				return;
			}

			popped = true;
			resume();
		};
	},

	// Exports test.push() to the user API
	// Alias of pushResult.
	push: function( result, actual, expected, message, negative ) {
		var currentAssert = this instanceof Assert ? this : QUnit.config.current.assert;
		return currentAssert.pushResult( {
			result: result,
			actual: actual,
			expected: expected,
			message: message,
			negative: negative
		} );
	},

	pushResult: function( resultInfo ) {

		// Destructure of resultInfo = { result, actual, expected, message, negative }
		var assert = this,
			currentTest = ( assert instanceof Assert && assert.test ) || QUnit.config.current;

		// Backwards compatibility fix.
		// Allows the direct use of global exported assertions and QUnit.assert.*
		// Although, it's use is not recommended as it can leak assertions
		// to other tests from async tests, because we only get a reference to the current test,
		// not exactly the test where assertion were intended to be called.
		if ( !currentTest ) {
			throw new Error( "assertion outside test context, in " + sourceFromStacktrace( 2 ) );
		}

		if ( currentTest.usedAsync === true && currentTest.semaphore === 0 ) {
			currentTest.pushFailure( "Assertion after the final `assert.async` was resolved",
				sourceFromStacktrace( 2 ) );

			// Allow this assertion to continue running anyway...
		}

		if ( !( assert instanceof Assert ) ) {
			assert = currentTest.assert;
		}

		return assert.test.pushResult( resultInfo );
	},

	ok: function( result, message ) {
		message = message || ( result ? "okay" : "failed, expected argument to be truthy, was: " +
			QUnit.dump.parse( result ) );
		this.pushResult( {
			result: !!result,
			actual: result,
			expected: true,
			message: message
		} );
	},

	notOk: function( result, message ) {
		message = message || ( !result ? "okay" : "failed, expected argument to be falsy, was: " +
			QUnit.dump.parse( result ) );
		this.pushResult( {
			result: !result,
			actual: result,
			expected: false,
			message: message
		} );
	},

	equal: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		this.pushResult( {
			result: expected == actual,
			actual: actual,
			expected: expected,
			message: message
		} );
	},

	notEqual: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		this.pushResult( {
			result: expected != actual,
			actual: actual,
			expected: expected,
			message: message,
			negative: true
		} );
	},

	propEqual: function( actual, expected, message ) {
		actual = objectValues( actual );
		expected = objectValues( expected );
		this.pushResult( {
			result: QUnit.equiv( actual, expected ),
			actual: actual,
			expected: expected,
			message: message
		} );
	},

	notPropEqual: function( actual, expected, message ) {
		actual = objectValues( actual );
		expected = objectValues( expected );
		this.pushResult( {
			result: !QUnit.equiv( actual, expected ),
			actual: actual,
			expected: expected,
			message: message,
			negative: true
		} );
	},

	deepEqual: function( actual, expected, message ) {
		this.pushResult( {
			result: QUnit.equiv( actual, expected ),
			actual: actual,
			expected: expected,
			message: message
		} );
	},

	notDeepEqual: function( actual, expected, message ) {
		this.pushResult( {
			result: !QUnit.equiv( actual, expected ),
			actual: actual,
			expected: expected,
			message: message,
			negative: true
		} );
	},

	strictEqual: function( actual, expected, message ) {
		this.pushResult( {
			result: expected === actual,
			actual: actual,
			expected: expected,
			message: message
		} );
	},

	notStrictEqual: function( actual, expected, message ) {
		this.pushResult( {
			result: expected !== actual,
			actual: actual,
			expected: expected,
			message: message,
			negative: true
		} );
	},

	"throws": function( block, expected, message ) {
		var actual, expectedType,
			expectedOutput = expected,
			ok = false,
			currentTest = ( this instanceof Assert && this.test ) || QUnit.config.current;

		// 'expected' is optional unless doing string comparison
		if ( QUnit.objectType( expected ) === "string" ) {
			if ( message == null ) {
				message = expected;
				expected = null;
			} else {
				throw new Error(
					"throws/raises does not accept a string value for the expected argument.\n" +
					"Use a non-string object value (e.g. regExp) instead if it's necessary." +
					"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
				);
			}
		}

		currentTest.ignoreGlobalErrors = true;
		try {
			block.call( currentTest.testEnvironment );
		} catch ( e ) {
			actual = e;
		}
		currentTest.ignoreGlobalErrors = false;

		if ( actual ) {
			expectedType = QUnit.objectType( expected );

			// We don't want to validate thrown error
			if ( !expected ) {
				ok = true;
				expectedOutput = null;

			// Expected is a regexp
			} else if ( expectedType === "regexp" ) {
				ok = expected.test( errorString( actual ) );

			// Expected is a constructor, maybe an Error constructor
			} else if ( expectedType === "function" && actual instanceof expected ) {
				ok = true;

			// Expected is an Error object
			} else if ( expectedType === "object" ) {
				ok = actual instanceof expected.constructor &&
					actual.name === expected.name &&
					actual.message === expected.message;

			// Expected is a validation function which returns true if validation passed
			} else if ( expectedType === "function" && expected.call( {}, actual ) === true ) {
				expectedOutput = null;
				ok = true;
			}
		}

		currentTest.assert.pushResult( {
			result: ok,
			actual: actual,
			expected: expectedOutput,
			message: message
		} );
	}
};

// Provide an alternative to assert.throws(), for environments that consider throws a reserved word
// Known to us are: Closure Compiler, Narwhal
( function() {
	/*jshint sub:true */
	Assert.prototype.raises = Assert.prototype [ "throws" ]; //jscs:ignore requireDotNotation
}() );

function errorString( error ) {
	var name, message,
		resultErrorString = error.toString();
	if ( resultErrorString.substring( 0, 7 ) === "[object" ) {
		name = error.name ? error.name.toString() : "Error";
		message = error.message ? error.message.toString() : "";
		if ( name && message ) {
			return name + ": " + message;
		} else if ( name ) {
			return name;
		} else if ( message ) {
			return message;
		} else {
			return "Error";
		}
	} else {
		return resultErrorString;
	}
}

// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
QUnit.equiv = ( function() {

	// Stack to decide between skip/abort functions
	var callers = [];

	// Stack to avoiding loops from circular referencing
	var parents = [];
	var parentsB = [];

	var getProto = Object.getPrototypeOf || function( obj ) {

		/*jshint proto: true */
		return obj.__proto__;
	};

	function useStrictEquality( b, a ) {

		// To catch short annotation VS 'new' annotation of a declaration. e.g.:
		// `var i = 1;`
		// `var j = new Number(1);`
		if ( typeof a === "object" ) {
			a = a.valueOf();
		}
		if ( typeof b === "object" ) {
			b = b.valueOf();
		}

		return a === b;
	}

	function compareConstructors( a, b ) {
		var protoA = getProto( a );
		var protoB = getProto( b );

		// Comparing constructors is more strict than using `instanceof`
		if ( a.constructor === b.constructor ) {
			return true;
		}

		// Ref #851
		// If the obj prototype descends from a null constructor, treat it
		// as a null prototype.
		if ( protoA && protoA.constructor === null ) {
			protoA = null;
		}
		if ( protoB && protoB.constructor === null ) {
			protoB = null;
		}

		// Allow objects with no prototype to be equivalent to
		// objects with Object as their constructor.
		if ( ( protoA === null && protoB === Object.prototype ) ||
				( protoB === null && protoA === Object.prototype ) ) {
			return true;
		}

		return false;
	}

	function getRegExpFlags( regexp ) {
		return "flags" in regexp ? regexp.flags : regexp.toString().match( /[gimuy]*$/ )[ 0 ];
	}

	var callbacks = {
		"string": useStrictEquality,
		"boolean": useStrictEquality,
		"number": useStrictEquality,
		"null": useStrictEquality,
		"undefined": useStrictEquality,
		"symbol": useStrictEquality,
		"date": useStrictEquality,

		"nan": function() {
			return true;
		},

		"regexp": function( b, a ) {
			return a.source === b.source &&

				// Include flags in the comparison
				getRegExpFlags( a ) === getRegExpFlags( b );
		},

		// - skip when the property is a method of an instance (OOP)
		// - abort otherwise,
		// initial === would have catch identical references anyway
		"function": function() {
			var caller = callers[ callers.length - 1 ];
			return caller !== Object && typeof caller !== "undefined";
		},

		"array": function( b, a ) {
			var i, j, len, loop, aCircular, bCircular;

			len = a.length;
			if ( len !== b.length ) {

				// Safe and faster
				return false;
			}

			// Track reference to avoid circular references
			parents.push( a );
			parentsB.push( b );
			for ( i = 0; i < len; i++ ) {
				loop = false;
				for ( j = 0; j < parents.length; j++ ) {
					aCircular = parents[ j ] === a[ i ];
					bCircular = parentsB[ j ] === b[ i ];
					if ( aCircular || bCircular ) {
						if ( a[ i ] === b[ i ] || aCircular && bCircular ) {
							loop = true;
						} else {
							parents.pop();
							parentsB.pop();
							return false;
						}
					}
				}
				if ( !loop && !innerEquiv( a[ i ], b[ i ] ) ) {
					parents.pop();
					parentsB.pop();
					return false;
				}
			}
			parents.pop();
			parentsB.pop();
			return true;
		},

		"set": function( b, a ) {
			var innerEq,
				outerEq = true;

			if ( a.size !== b.size ) {
				return false;
			}

			a.forEach( function( aVal ) {
				innerEq = false;

				b.forEach( function( bVal ) {
					if ( innerEquiv( bVal, aVal ) ) {
						innerEq = true;
					}
				} );

				if ( !innerEq ) {
					outerEq = false;
				}
			} );

			return outerEq;
		},

		"map": function( b, a ) {
			var innerEq,
				outerEq = true;

			if ( a.size !== b.size ) {
				return false;
			}

			a.forEach( function( aVal, aKey ) {
				innerEq = false;

				b.forEach( function( bVal, bKey ) {
					if ( innerEquiv( [ bVal, bKey ], [ aVal, aKey ] ) ) {
						innerEq = true;
					}
				} );

				if ( !innerEq ) {
					outerEq = false;
				}
			} );

			return outerEq;
		},

		"object": function( b, a ) {
			var i, j, loop, aCircular, bCircular;

			// Default to true
			var eq = true;
			var aProperties = [];
			var bProperties = [];

			if ( compareConstructors( a, b ) === false ) {
				return false;
			}

			// Stack constructor before traversing properties
			callers.push( a.constructor );

			// Track reference to avoid circular references
			parents.push( a );
			parentsB.push( b );

			// Be strict: don't ensure hasOwnProperty and go deep
			for ( i in a ) {
				loop = false;
				for ( j = 0; j < parents.length; j++ ) {
					aCircular = parents[ j ] === a[ i ];
					bCircular = parentsB[ j ] === b[ i ];
					if ( aCircular || bCircular ) {
						if ( a[ i ] === b[ i ] || aCircular && bCircular ) {
							loop = true;
						} else {
							eq = false;
							break;
						}
					}
				}
				aProperties.push( i );
				if ( !loop && !innerEquiv( a[ i ], b[ i ] ) ) {
					eq = false;
					break;
				}
			}

			parents.pop();
			parentsB.pop();

			// Unstack, we are done
			callers.pop();

			for ( i in b ) {

				// Collect b's properties
				bProperties.push( i );
			}

			// Ensures identical properties name
			return eq && innerEquiv( aProperties.sort(), bProperties.sort() );
		}
	};

	function typeEquiv( a, b ) {
		var type = QUnit.objectType( a );
		return QUnit.objectType( b ) === type && callbacks[ type ]( b, a );
	}

	// The real equiv function
	function innerEquiv( a, b ) {

		// We're done when there's nothing more to compare
		if ( arguments.length < 2 ) {
			return true;
		}

		// Require type-specific equality
		return ( a === b || typeEquiv( a, b ) ) &&

			// ...across all consecutive argument pairs
			( arguments.length === 2 || innerEquiv.apply( this, [].slice.call( arguments, 1 ) ) );
	}

	return innerEquiv;
}() );

// Based on jsDump by Ariel Flesler
// http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html
QUnit.dump = ( function() {
	function quote( str ) {
		return "\"" + str.toString().replace( /\\/g, "\\\\" ).replace( /"/g, "\\\"" ) + "\"";
	}
	function literal( o ) {
		return o + "";
	}
	function join( pre, arr, post ) {
		var s = dump.separator(),
			base = dump.indent(),
			inner = dump.indent( 1 );
		if ( arr.join ) {
			arr = arr.join( "," + s + inner );
		}
		if ( !arr ) {
			return pre + post;
		}
		return [ pre, inner + arr, base + post ].join( s );
	}
	function array( arr, stack ) {
		var i = arr.length,
			ret = new Array( i );

		if ( dump.maxDepth && dump.depth > dump.maxDepth ) {
			return "[object Array]";
		}

		this.up();
		while ( i-- ) {
			ret[ i ] = this.parse( arr[ i ], undefined, stack );
		}
		this.down();
		return join( "[", ret, "]" );
	}

	function isArray( obj ) {
		return (

			//Native Arrays
			toString.call( obj ) === "[object Array]" ||

			// NodeList objects
			( typeof obj.length === "number" && obj.item !== undefined ) &&
			( obj.length ?
				obj.item( 0 ) === obj[ 0 ] :
				( obj.item( 0 ) === null && obj[ 0 ] === undefined )
			)
		);
	}

	var reName = /^function (\w+)/,
		dump = {

			// The objType is used mostly internally, you can fix a (custom) type in advance
			parse: function( obj, objType, stack ) {
				stack = stack || [];
				var res, parser, parserType,
					inStack = inArray( obj, stack );

				if ( inStack !== -1 ) {
					return "recursion(" + ( inStack - stack.length ) + ")";
				}

				objType = objType || this.typeOf( obj  );
				parser = this.parsers[ objType ];
				parserType = typeof parser;

				if ( parserType === "function" ) {
					stack.push( obj );
					res = parser.call( this, obj, stack );
					stack.pop();
					return res;
				}
				return ( parserType === "string" ) ? parser : this.parsers.error;
			},
			typeOf: function( obj ) {
				var type;

				if ( obj === null ) {
					type = "null";
				} else if ( typeof obj === "undefined" ) {
					type = "undefined";
				} else if ( QUnit.is( "regexp", obj ) ) {
					type = "regexp";
				} else if ( QUnit.is( "date", obj ) ) {
					type = "date";
				} else if ( QUnit.is( "function", obj ) ) {
					type = "function";
				} else if ( obj.setInterval !== undefined &&
						obj.document !== undefined &&
						obj.nodeType === undefined ) {
					type = "window";
				} else if ( obj.nodeType === 9 ) {
					type = "document";
				} else if ( obj.nodeType ) {
					type = "node";
				} else if ( isArray( obj ) ) {
					type = "array";
				} else if ( obj.constructor === Error.prototype.constructor ) {
					type = "error";
				} else {
					type = typeof obj;
				}
				return type;
			},

			separator: function() {
				return this.multiline ? this.HTML ? "<br />" : "\n" : this.HTML ? "&#160;" : " ";
			},

			// Extra can be a number, shortcut for increasing-calling-decreasing
			indent: function( extra ) {
				if ( !this.multiline ) {
					return "";
				}
				var chr = this.indentChar;
				if ( this.HTML ) {
					chr = chr.replace( /\t/g, "   " ).replace( / /g, "&#160;" );
				}
				return new Array( this.depth + ( extra || 0 ) ).join( chr );
			},
			up: function( a ) {
				this.depth += a || 1;
			},
			down: function( a ) {
				this.depth -= a || 1;
			},
			setParser: function( name, parser ) {
				this.parsers[ name ] = parser;
			},

			// The next 3 are exposed so you can use them
			quote: quote,
			literal: literal,
			join: join,
			depth: 1,
			maxDepth: QUnit.config.maxDepth,

			// This is the list of parsers, to modify them, use dump.setParser
			parsers: {
				window: "[Window]",
				document: "[Document]",
				error: function( error ) {
					return "Error(\"" + error.message + "\")";
				},
				unknown: "[Unknown]",
				"null": "null",
				"undefined": "undefined",
				"function": function( fn ) {
					var ret = "function",

						// Functions never have name in IE
						name = "name" in fn ? fn.name : ( reName.exec( fn ) || [] )[ 1 ];

					if ( name ) {
						ret += " " + name;
					}
					ret += "(";

					ret = [ ret, dump.parse( fn, "functionArgs" ), "){" ].join( "" );
					return join( ret, dump.parse( fn, "functionCode" ), "}" );
				},
				array: array,
				nodelist: array,
				"arguments": array,
				object: function( map, stack ) {
					var keys, key, val, i, nonEnumerableProperties,
						ret = [];

					if ( dump.maxDepth && dump.depth > dump.maxDepth ) {
						return "[object Object]";
					}

					dump.up();
					keys = [];
					for ( key in map ) {
						keys.push( key );
					}

					// Some properties are not always enumerable on Error objects.
					nonEnumerableProperties = [ "message", "name" ];
					for ( i in nonEnumerableProperties ) {
						key = nonEnumerableProperties[ i ];
						if ( key in map && inArray( key, keys ) < 0 ) {
							keys.push( key );
						}
					}
					keys.sort();
					for ( i = 0; i < keys.length; i++ ) {
						key = keys[ i ];
						val = map[ key ];
						ret.push( dump.parse( key, "key" ) + ": " +
							dump.parse( val, undefined, stack ) );
					}
					dump.down();
					return join( "{", ret, "}" );
				},
				node: function( node ) {
					var len, i, val,
						open = dump.HTML ? "&lt;" : "<",
						close = dump.HTML ? "&gt;" : ">",
						tag = node.nodeName.toLowerCase(),
						ret = open + tag,
						attrs = node.attributes;

					if ( attrs ) {
						for ( i = 0, len = attrs.length; i < len; i++ ) {
							val = attrs[ i ].nodeValue;

							// IE6 includes all attributes in .attributes, even ones not explicitly
							// set. Those have values like undefined, null, 0, false, "" or
							// "inherit".
							if ( val && val !== "inherit" ) {
								ret += " " + attrs[ i ].nodeName + "=" +
									dump.parse( val, "attribute" );
							}
						}
					}
					ret += close;

					// Show content of TextNode or CDATASection
					if ( node.nodeType === 3 || node.nodeType === 4 ) {
						ret += node.nodeValue;
					}

					return ret + open + "/" + tag + close;
				},

				// Function calls it internally, it's the arguments part of the function
				functionArgs: function( fn ) {
					var args,
						l = fn.length;

					if ( !l ) {
						return "";
					}

					args = new Array( l );
					while ( l-- ) {

						// 97 is 'a'
						args[ l ] = String.fromCharCode( 97 + l );
					}
					return " " + args.join( ", " ) + " ";
				},

				// Object calls it internally, the key part of an item in a map
				key: quote,

				// Function calls it internally, it's the content of the function
				functionCode: "[code]",

				// Node calls it internally, it's a html attribute value
				attribute: quote,
				string: quote,
				date: quote,
				regexp: literal,
				number: literal,
				"boolean": literal,
				symbol: function( sym ) {
					return sym.toString();
				}
			},

			// If true, entities are escaped ( <, >, \t, space and \n )
			HTML: false,

			// Indentation unit
			indentChar: "  ",

			// If true, items in a collection, are separated by a \n, else just a space.
			multiline: true
		};

	return dump;
}() );

// Back compat
QUnit.jsDump = QUnit.dump;

function applyDeprecated( name ) {
	return function() {
		throw new Error(
			name + " is removed in QUnit 2.0.\n" +
			"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
		);
	};
}

Object.keys( Assert.prototype ).forEach( function( key ) {
	QUnit[ key ] = applyDeprecated( "`QUnit." + key + "`" );
} );

QUnit.asyncTest = function() {
	throw new Error(
		"asyncTest is removed in QUnit 2.0, use QUnit.test() with assert.async() instead.\n" +
		"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
	);
};

QUnit.stop = function() {
	throw new Error(
		"QUnit.stop is removed in QUnit 2.0, use QUnit.test() with assert.async() instead.\n" +
		"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
	);
};

function resetThrower() {
	throw new Error(
		"QUnit.reset is removed in QUnit 2.0 without replacement.\n" +
		"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
	);
}

Object.defineProperty( QUnit, "reset", {
	get: function() {
		return resetThrower;
	},
	set: resetThrower
} );

if ( defined.document ) {
	if ( window.QUnit ) {
		throw new Error( "QUnit has already been defined." );
	}

	[
		"test",
		"module",
		"expect",
		"start",
		"ok",
		"notOk",
		"equal",
		"notEqual",
		"propEqual",
		"notPropEqual",
		"deepEqual",
		"notDeepEqual",
		"strictEqual",
		"notStrictEqual",
		"throws",
		"raises"
	].forEach( function( key ) {
		window[ key ] = applyDeprecated( "The global `" + key + "`" );
	} );

	window.QUnit = QUnit;
}

// For nodejs
if ( typeof module !== "undefined" && module && module.exports ) {
	module.exports = QUnit;

	// For consistency with CommonJS environments' exports
	module.exports.QUnit = QUnit;
}

// For CommonJS with exports, but without module.exports, like Rhino
if ( typeof exports !== "undefined" && exports ) {
	exports.QUnit = QUnit;
}

if ( typeof define === "function" && define.amd ) {
	define( function() {
		return QUnit;
	} );
	QUnit.config.autostart = false;
}

// Get a reference to the global object, like window in browsers
}( ( function() {
	return this;
}() ) ) );

( function() {

if ( typeof window === "undefined" || !window.document ) {
	return;
}

var config = QUnit.config,
	hasOwn = Object.prototype.hasOwnProperty;

// Stores fixture HTML for resetting later
function storeFixture() {

	// Avoid overwriting user-defined values
	if ( hasOwn.call( config, "fixture" ) ) {
		return;
	}

	var fixture = document.getElementById( "qunit-fixture" );
	if ( fixture ) {
		config.fixture = fixture.innerHTML;
	}
}

QUnit.begin( storeFixture );

// Resets the fixture DOM element if available.
function resetFixture() {
	if ( config.fixture == null ) {
		return;
	}

	var fixture = document.getElementById( "qunit-fixture" );
	if ( fixture ) {
		fixture.innerHTML = config.fixture;
	}
}

QUnit.testStart( resetFixture );

}() );

( function() {

// Only interact with URLs via window.location
var location = typeof window !== "undefined" && window.location;
if ( !location ) {
	return;
}

var urlParams = getUrlParams();

QUnit.urlParams = urlParams;

// Match module/test by inclusion in an array
QUnit.config.moduleId = [].concat( urlParams.moduleId || [] );
QUnit.config.testId = [].concat( urlParams.testId || [] );

// Exact case-insensitive match of the module name
QUnit.config.module = urlParams.module;

// Regular expression or case-insenstive substring match against "moduleName: testName"
QUnit.config.filter = urlParams.filter;

// Test order randomization
if ( urlParams.seed === true ) {

	// Generate a random seed if the option is specified without a value
	QUnit.config.seed = Math.random().toString( 36 ).slice( 2 );
} else if ( urlParams.seed ) {
	QUnit.config.seed = urlParams.seed;
}

// Add URL-parameter-mapped config values with UI form rendering data
QUnit.config.urlConfig.push(
	{
		id: "hidepassed",
		label: "Hide passed tests",
		tooltip: "Only show tests and assertions that fail. Stored as query-strings."
	},
	{
		id: "noglobals",
		label: "Check for Globals",
		tooltip: "Enabling this will test if any test introduces new properties on the " +
			"global object (`window` in Browsers). Stored as query-strings."
	},
	{
		id: "notrycatch",
		label: "No try-catch",
		tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging " +
			"exceptions in IE reasonable. Stored as query-strings."
	}
);

QUnit.begin( function() {
	var i, option,
		urlConfig = QUnit.config.urlConfig;

	for ( i = 0; i < urlConfig.length; i++ ) {

		// Options can be either strings or objects with nonempty "id" properties
		option = QUnit.config.urlConfig[ i ];
		if ( typeof option !== "string" ) {
			option = option.id;
		}

		if ( QUnit.config[ option ] === undefined ) {
			QUnit.config[ option ] = urlParams[ option ];
		}
	}
} );

function getUrlParams() {
	var i, param, name, value;
	var urlParams = {};
	var params = location.search.slice( 1 ).split( "&" );
	var length = params.length;

	for ( i = 0; i < length; i++ ) {
		if ( params[ i ] ) {
			param = params[ i ].split( "=" );
			name = decodeQueryParam( param[ 0 ] );

			// Allow just a key to turn on a flag, e.g., test.html?noglobals
			value = param.length === 1 ||
				decodeQueryParam( param.slice( 1 ).join( "=" ) ) ;
			if ( urlParams[ name ] ) {
				urlParams[ name ] = [].concat( urlParams[ name ], value );
			} else {
				urlParams[ name ] = value;
			}
		}
	}

	return urlParams;
}

function decodeQueryParam( param ) {
	return decodeURIComponent( param.replace( /\+/g, "%20" ) );
}

// Don't load the HTML Reporter on non-browser environments
if ( typeof window === "undefined" || !window.document ) {
	return;
}

QUnit.init = function() {
	throw new Error(
		"QUnit.init is removed in QUnit 2.0, use QUnit.test() with assert.async() instead.\n" +
		"Details in our upgrade guide at https://qunitjs.com/upgrade-guide-2.x/"
	);
};

var config = QUnit.config,
	document = window.document,
	collapseNext = false,
	hasOwn = Object.prototype.hasOwnProperty,
	unfilteredUrl = setUrl( { filter: undefined, module: undefined,
		moduleId: undefined, testId: undefined } ),
	defined = {
		sessionStorage: ( function() {
			var x = "qunit-test-string";
			try {
				sessionStorage.setItem( x, x );
				sessionStorage.removeItem( x );
				return true;
			} catch ( e ) {
				return false;
			}
		}() )
	},
	modulesList = [];

// Escape text for attribute or text content.
function escapeText( s ) {
	if ( !s ) {
		return "";
	}
	s = s + "";

	// Both single quotes and double quotes (for attributes)
	return s.replace( /['"<>&]/g, function( s ) {
		switch ( s ) {
		case "'":
			return "&#039;";
		case "\"":
			return "&quot;";
		case "<":
			return "&lt;";
		case ">":
			return "&gt;";
		case "&":
			return "&amp;";
		}
	} );
}

function addEvent( elem, type, fn ) {
	elem.addEventListener( type, fn, false );
}

function removeEvent( elem, type, fn ) {
	elem.removeEventListener( type, fn, false );
}

function addEvents( elems, type, fn ) {
	var i = elems.length;
	while ( i-- ) {
		addEvent( elems[ i ], type, fn );
	}
}

function hasClass( elem, name ) {
	return ( " " + elem.className + " " ).indexOf( " " + name + " " ) >= 0;
}

function addClass( elem, name ) {
	if ( !hasClass( elem, name ) ) {
		elem.className += ( elem.className ? " " : "" ) + name;
	}
}

function toggleClass( elem, name, force ) {
	if ( force || typeof force === "undefined" && !hasClass( elem, name ) ) {
		addClass( elem, name );
	} else {
		removeClass( elem, name );
	}
}

function removeClass( elem, name ) {
	var set = " " + elem.className + " ";

	// Class name may appear multiple times
	while ( set.indexOf( " " + name + " " ) >= 0 ) {
		set = set.replace( " " + name + " ", " " );
	}

	// Trim for prettiness
	elem.className = typeof set.trim === "function" ? set.trim() : set.replace( /^\s+|\s+$/g, "" );
}

function id( name ) {
	return document.getElementById && document.getElementById( name );
}

function interceptNavigation( ev ) {
	applyUrlParams();

	if ( ev && ev.preventDefault ) {
		ev.preventDefault();
	}

	return false;
}

function getUrlConfigHtml() {
	var i, j, val,
		escaped, escapedTooltip,
		selection = false,
		urlConfig = config.urlConfig,
		urlConfigHtml = "";

	for ( i = 0; i < urlConfig.length; i++ ) {

		// Options can be either strings or objects with nonempty "id" properties
		val = config.urlConfig[ i ];
		if ( typeof val === "string" ) {
			val = {
				id: val,
				label: val
			};
		}

		escaped = escapeText( val.id );
		escapedTooltip = escapeText( val.tooltip );

		if ( !val.value || typeof val.value === "string" ) {
			urlConfigHtml += "<label for='qunit-urlconfig-" + escaped +
				"' title='" + escapedTooltip + "'><input id='qunit-urlconfig-" + escaped +
				"' name='" + escaped + "' type='checkbox'" +
				( val.value ? " value='" + escapeText( val.value ) + "'" : "" ) +
				( config[ val.id ] ? " checked='checked'" : "" ) +
				" title='" + escapedTooltip + "' />" + escapeText( val.label ) + "</label>";
		} else {
			urlConfigHtml += "<label for='qunit-urlconfig-" + escaped +
				"' title='" + escapedTooltip + "'>" + val.label +
				": </label><select id='qunit-urlconfig-" + escaped +
				"' name='" + escaped + "' title='" + escapedTooltip + "'><option></option>";

			if ( QUnit.is( "array", val.value ) ) {
				for ( j = 0; j < val.value.length; j++ ) {
					escaped = escapeText( val.value[ j ] );
					urlConfigHtml += "<option value='" + escaped + "'" +
						( config[ val.id ] === val.value[ j ] ?
							( selection = true ) && " selected='selected'" : "" ) +
						">" + escaped + "</option>";
				}
			} else {
				for ( j in val.value ) {
					if ( hasOwn.call( val.value, j ) ) {
						urlConfigHtml += "<option value='" + escapeText( j ) + "'" +
							( config[ val.id ] === j ?
								( selection = true ) && " selected='selected'" : "" ) +
							">" + escapeText( val.value[ j ] ) + "</option>";
					}
				}
			}
			if ( config[ val.id ] && !selection ) {
				escaped = escapeText( config[ val.id ] );
				urlConfigHtml += "<option value='" + escaped +
					"' selected='selected' disabled='disabled'>" + escaped + "</option>";
			}
			urlConfigHtml += "</select>";
		}
	}

	return urlConfigHtml;
}

// Handle "click" events on toolbar checkboxes and "change" for select menus.
// Updates the URL with the new state of `config.urlConfig` values.
function toolbarChanged() {
	var updatedUrl, value, tests,
		field = this,
		params = {};

	// Detect if field is a select menu or a checkbox
	if ( "selectedIndex" in field ) {
		value = field.options[ field.selectedIndex ].value || undefined;
	} else {
		value = field.checked ? ( field.defaultValue || true ) : undefined;
	}

	params[ field.name ] = value;
	updatedUrl = setUrl( params );

	// Check if we can apply the change without a page refresh
	if ( "hidepassed" === field.name && "replaceState" in window.history ) {
		QUnit.urlParams[ field.name ] = value;
		config[ field.name ] = value || false;
		tests = id( "qunit-tests" );
		if ( tests ) {
			toggleClass( tests, "hidepass", value || false );
		}
		window.history.replaceState( null, "", updatedUrl );
	} else {
		window.location = updatedUrl;
	}
}

function setUrl( params ) {
	var key, arrValue, i,
		querystring = "?",
		location = window.location;

	params = QUnit.extend( QUnit.extend( {}, QUnit.urlParams ), params );

	for ( key in params ) {

		// Skip inherited or undefined properties
		if ( hasOwn.call( params, key ) && params[ key ] !== undefined ) {

			// Output a parameter for each value of this key (but usually just one)
			arrValue = [].concat( params[ key ] );
			for ( i = 0; i < arrValue.length; i++ ) {
				querystring += encodeURIComponent( key );
				if ( arrValue[ i ] !== true ) {
					querystring += "=" + encodeURIComponent( arrValue[ i ] );
				}
				querystring += "&";
			}
		}
	}
	return location.protocol + "//" + location.host +
		location.pathname + querystring.slice( 0, -1 );
}

function applyUrlParams() {
	var i,
		selectedModules = [],
		modulesList = id( "qunit-modulefilter-dropdown-list" ).getElementsByTagName( "input" ),
		filter = id( "qunit-filter-input" ).value;

	for ( i = 0; i < modulesList.length; i++ )  {
		if ( modulesList[ i ].checked ) {
			selectedModules.push( modulesList[ i ].value );
		}
	}

	window.location = setUrl( {
		filter: ( filter === "" ) ? undefined : filter,
		moduleId: ( selectedModules.length === 0 ) ? undefined : selectedModules,

		// Remove module and testId filter
		module: undefined,
		testId: undefined
	} );
}

function toolbarUrlConfigContainer() {
	var urlConfigContainer = document.createElement( "span" );

	urlConfigContainer.innerHTML = getUrlConfigHtml();
	addClass( urlConfigContainer, "qunit-url-config" );

	addEvents( urlConfigContainer.getElementsByTagName( "input" ), "change", toolbarChanged );
	addEvents( urlConfigContainer.getElementsByTagName( "select" ), "change", toolbarChanged );

	return urlConfigContainer;
}

function toolbarLooseFilter() {
	var filter = document.createElement( "form" ),
		label = document.createElement( "label" ),
		input = document.createElement( "input" ),
		button = document.createElement( "button" );

	addClass( filter, "qunit-filter" );

	label.innerHTML = "Filter: ";

	input.type = "text";
	input.value = config.filter || "";
	input.name = "filter";
	input.id = "qunit-filter-input";

	button.innerHTML = "Go";

	label.appendChild( input );

	filter.appendChild( label );
	filter.appendChild( document.createTextNode( " " ) );
	filter.appendChild( button );
	addEvent( filter, "submit", interceptNavigation );

	return filter;
}

function moduleListHtml () {
	var i, checked,
		html = "";

	for ( i = 0; i < config.modules.length; i++ ) {
		if ( config.modules[ i ].name !== "" ) {
			checked = config.moduleId.indexOf( config.modules[ i ].moduleId ) > -1;
			html += "<li><label class='clickable" + ( checked ? " checked" : "" ) +
				"'><input type='checkbox' " + "value='" + config.modules[ i ].moduleId + "'" +
				( checked ? " checked='checked'" : "" ) + " />" +
				escapeText( config.modules[ i ].name ) + "</label></li>";
		}
	}

	return html;
}

function toolbarModuleFilter () {
	var allCheckbox, commit, reset,
		moduleFilter = document.createElement( "form" ),
		label = document.createElement( "label" ),
		moduleSearch = document.createElement( "input" ),
		dropDown = document.createElement( "div" ),
		actions = document.createElement( "span" ),
		dropDownList = document.createElement( "ul" ),
		dirty = false;

	moduleSearch.id = "qunit-modulefilter-search";
	addEvent( moduleSearch, "input", searchInput );
	addEvent( moduleSearch, "input", searchFocus );
	addEvent( moduleSearch, "focus", searchFocus );
	addEvent( moduleSearch, "click", searchFocus );

	label.id = "qunit-modulefilter-search-container";
	label.innerHTML = "Module: ";
	label.appendChild( moduleSearch );

	actions.id = "qunit-modulefilter-actions";
	actions.innerHTML =
		"<button style='display:none'>Apply</button>" +
		"<button type='reset' style='display:none'>Reset</button>" +
		"<label class='clickable" +
		( config.moduleId.length ? "" : " checked" ) +
		"'><input type='checkbox'" + ( config.moduleId.length ? "" : " checked='checked'" ) +
		">All modules</label>";
	allCheckbox = actions.lastChild.firstChild;
	commit = actions.firstChild;
	reset = commit.nextSibling;
	addEvent( commit, "click", applyUrlParams );

	dropDownList.id = "qunit-modulefilter-dropdown-list";
	dropDownList.innerHTML = moduleListHtml();

	dropDown.id = "qunit-modulefilter-dropdown";
	dropDown.style.display = "none";
	dropDown.appendChild( actions );
	dropDown.appendChild( dropDownList );
	addEvent( dropDown, "change", selectionChange );
	selectionChange();

	moduleFilter.id = "qunit-modulefilter";
	moduleFilter.appendChild( label );
	moduleFilter.appendChild( dropDown ) ;
	addEvent( moduleFilter, "submit", interceptNavigation );
	addEvent( moduleFilter, "reset", function() {

		// Let the reset happen, then update styles
		window.setTimeout( selectionChange );
	} );

	// Enables show/hide for the dropdown
	function searchFocus() {
		if ( dropDown.style.display !== "none" ) {
			return;
		}

		dropDown.style.display = "block";
		addEvent( document, "click", hideHandler );
		addEvent( document, "keydown", hideHandler );

		// Hide on Escape keydown or outside-container click
		function hideHandler( e )  {
			var inContainer = moduleFilter.contains( e.target );

			if ( e.keyCode === 27 || !inContainer ) {
				if ( e.keyCode === 27 && inContainer ) {
					moduleSearch.focus();
				}
				dropDown.style.display = "none";
				removeEvent( document, "click", hideHandler );
				removeEvent( document, "keydown", hideHandler );
				moduleSearch.value = "";
				searchInput();
			}
		}
	}

	// Processes module search box input
	function searchInput() {
		var i, item,
			searchText = moduleSearch.value.toLowerCase(),
			listItems = dropDownList.children;

		for ( i = 0; i < listItems.length; i++ ) {
			item = listItems[ i ];
			if ( !searchText || item.textContent.toLowerCase().indexOf( searchText ) > -1 ) {
				item.style.display = "";
			} else {
				item.style.display = "none";
			}
		}
	}

	// Processes selection changes
	function selectionChange( evt ) {
		var i, item,
			checkbox = evt && evt.target || allCheckbox,
			modulesList = dropDownList.getElementsByTagName( "input" ),
			selectedNames = [];

		toggleClass( checkbox.parentNode, "checked", checkbox.checked );

		dirty = false;
		if ( checkbox.checked && checkbox !== allCheckbox ) {
		   allCheckbox.checked = false;
		   removeClass( allCheckbox.parentNode, "checked" );
		}
		for ( i = 0; i < modulesList.length; i++ )  {
			item = modulesList[ i ];
			if ( !evt ) {
				toggleClass( item.parentNode, "checked", item.checked );
			} else if ( checkbox === allCheckbox && checkbox.checked ) {
				item.checked = false;
				removeClass( item.parentNode, "checked" );
			}
			dirty = dirty || ( item.checked !== item.defaultChecked );
			if ( item.checked ) {
				selectedNames.push( item.parentNode.textContent );
			}
		}

		commit.style.display = reset.style.display = dirty ? "" : "none";
		moduleSearch.placeholder = selectedNames.join( ", " ) || allCheckbox.parentNode.textContent;
		moduleSearch.title = "Type to filter list. Current selection:\n" +
			( selectedNames.join( "\n" ) || allCheckbox.parentNode.textContent );
	}

	return moduleFilter;
}

function appendToolbar() {
	var toolbar = id( "qunit-testrunner-toolbar" );

	if ( toolbar ) {
		toolbar.appendChild( toolbarUrlConfigContainer() );
		toolbar.appendChild( toolbarModuleFilter() );
		toolbar.appendChild( toolbarLooseFilter() );
		toolbar.appendChild( document.createElement( "div" ) ).className = "clearfix";
	}
}

function appendHeader() {
	var header = id( "qunit-header" );

	if ( header ) {
		header.innerHTML = "<a href='" + escapeText( unfilteredUrl ) + "'>" + header.innerHTML +
			"</a> ";
	}
}

function appendBanner() {
	var banner = id( "qunit-banner" );

	if ( banner ) {
		banner.className = "";
	}
}

function appendTestResults() {
	var tests = id( "qunit-tests" ),
		result = id( "qunit-testresult" );

	if ( result ) {
		result.parentNode.removeChild( result );
	}

	if ( tests ) {
		tests.innerHTML = "";
		result = document.createElement( "p" );
		result.id = "qunit-testresult";
		result.className = "result";
		tests.parentNode.insertBefore( result, tests );
		result.innerHTML = "Running...<br />&#160;";
	}
}

function appendFilteredTest() {
	var testId = QUnit.config.testId;
	if ( !testId || testId.length <= 0 ) {
		return "";
	}
	return "<div id='qunit-filteredTest'>Rerunning selected tests: " +
		escapeText( testId.join( ", " ) ) +
		" <a id='qunit-clearFilter' href='" +
		escapeText( unfilteredUrl ) +
		"'>Run all tests</a></div>";
}

function appendUserAgent() {
	var userAgent = id( "qunit-userAgent" );

	if ( userAgent ) {
		userAgent.innerHTML = "";
		userAgent.appendChild(
			document.createTextNode(
				"QUnit " + QUnit.version + "; " + navigator.userAgent
			)
		);
	}
}

function appendInterface() {
	var qunit = id( "qunit" );

	if ( qunit ) {
		qunit.innerHTML =
			"<h1 id='qunit-header'>" + escapeText( document.title ) + "</h1>" +
			"<h2 id='qunit-banner'></h2>" +
			"<div id='qunit-testrunner-toolbar'></div>" +
			appendFilteredTest() +
			"<h2 id='qunit-userAgent'></h2>" +
			"<ol id='qunit-tests'></ol>";
	}

	appendHeader();
	appendBanner();
	appendTestResults();
	appendUserAgent();
	appendToolbar();
}

function appendTestsList( modules ) {
	var i, l, x, z, test, moduleObj;

	for ( i = 0, l = modules.length; i < l; i++ ) {
		moduleObj = modules[ i ];

		for ( x = 0, z = moduleObj.tests.length; x < z; x++ ) {
			test = moduleObj.tests[ x ];

			appendTest( test.name, test.testId, moduleObj.name );
		}
	}
}

function appendTest( name, testId, moduleName ) {
	var title, rerunTrigger, testBlock, assertList,
		tests = id( "qunit-tests" );

	if ( !tests ) {
		return;
	}

	title = document.createElement( "strong" );
	title.innerHTML = getNameHtml( name, moduleName );

	rerunTrigger = document.createElement( "a" );
	rerunTrigger.innerHTML = "Rerun";
	rerunTrigger.href = setUrl( { testId: testId } );

	testBlock = document.createElement( "li" );
	testBlock.appendChild( title );
	testBlock.appendChild( rerunTrigger );
	testBlock.id = "qunit-test-output-" + testId;

	assertList = document.createElement( "ol" );
	assertList.className = "qunit-assert-list";

	testBlock.appendChild( assertList );

	tests.appendChild( testBlock );
}

// HTML Reporter initialization and load
QUnit.begin( function( details ) {
	var i, moduleObj, tests;

	// Sort modules by name for the picker
	for ( i = 0; i < details.modules.length; i++ ) {
		moduleObj = details.modules[ i ];
		if ( moduleObj.name ) {
			modulesList.push( moduleObj.name );
		}
	}
	modulesList.sort( function( a, b ) {
		return a.localeCompare( b );
	} );

	// Initialize QUnit elements
	appendInterface();
	appendTestsList( details.modules );
	tests = id( "qunit-tests" );
	if ( tests && config.hidepassed ) {
		addClass( tests, "hidepass" );
	}
} );

QUnit.done( function( details ) {
	var i, key,
		banner = id( "qunit-banner" ),
		tests = id( "qunit-tests" ),
		html = [
			"Tests completed in ",
			details.runtime,
			" milliseconds.<br />",
			"<span class='passed'>",
			details.passed,
			"</span> assertions of <span class='total'>",
			details.total,
			"</span> passed, <span class='failed'>",
			details.failed,
			"</span> failed."
		].join( "" );

	if ( banner ) {
		banner.className = details.failed ? "qunit-fail" : "qunit-pass";
	}

	if ( tests ) {
		id( "qunit-testresult" ).innerHTML = html;
	}

	if ( config.altertitle && document.title ) {

		// Show ✖ for good, ✔ for bad suite result in title
		// use escape sequences in case file gets loaded with non-utf-8-charset
		document.title = [
			( details.failed ? "\u2716" : "\u2714" ),
			document.title.replace( /^[\u2714\u2716] /i, "" )
		].join( " " );
	}

	// Clear own sessionStorage items if all tests passed
	if ( config.reorder && defined.sessionStorage && details.failed === 0 ) {
		for ( i = 0; i < sessionStorage.length; i++ ) {
			key = sessionStorage.key( i++ );
			if ( key.indexOf( "qunit-test-" ) === 0 ) {
				sessionStorage.removeItem( key );
			}
		}
	}

	// Scroll back to top to show results
	if ( config.scrolltop && window.scrollTo ) {
		window.scrollTo( 0, 0 );
	}
} );

function getNameHtml( name, module ) {
	var nameHtml = "";

	if ( module ) {
		nameHtml = "<span class='module-name'>" + escapeText( module ) + "</span>: ";
	}

	nameHtml += "<span class='test-name'>" + escapeText( name ) + "</span>";

	return nameHtml;
}

QUnit.testStart( function( details ) {
	var running, testBlock, bad;

	testBlock = id( "qunit-test-output-" + details.testId );
	if ( testBlock ) {
		testBlock.className = "running";
	} else {

		// Report later registered tests
		appendTest( details.name, details.testId, details.module );
	}

	running = id( "qunit-testresult" );
	if ( running ) {
		bad = QUnit.config.reorder && defined.sessionStorage &&
			+sessionStorage.getItem( "qunit-test-" + details.module + "-" + details.name );

		running.innerHTML = ( bad ?
			"Rerunning previously failed test: <br />" :
			"Running: <br />" ) +
			getNameHtml( details.name, details.module );
	}

} );

function stripHtml( string ) {

	// Strip tags, html entity and whitespaces
	return string.replace( /<\/?[^>]+(>|$)/g, "" ).replace( /\&quot;/g, "" ).replace( /\s+/g, "" );
}

QUnit.log( function( details ) {
	var assertList, assertLi,
		message, expected, actual, diff,
		showDiff = false,
		testItem = id( "qunit-test-output-" + details.testId );

	if ( !testItem ) {
		return;
	}

	message = escapeText( details.message ) || ( details.result ? "okay" : "failed" );
	message = "<span class='test-message'>" + message + "</span>";
	message += "<span class='runtime'>@ " + details.runtime + " ms</span>";

	// The pushFailure doesn't provide details.expected
	// when it calls, it's implicit to also not show expected and diff stuff
	// Also, we need to check details.expected existence, as it can exist and be undefined
	if ( !details.result && hasOwn.call( details, "expected" ) ) {
		if ( details.negative ) {
			expected = "NOT " + QUnit.dump.parse( details.expected );
		} else {
			expected = QUnit.dump.parse( details.expected );
		}

		actual = QUnit.dump.parse( details.actual );
		message += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" +
			escapeText( expected ) +
			"</pre></td></tr>";

		if ( actual !== expected ) {

			message += "<tr class='test-actual'><th>Result: </th><td><pre>" +
				escapeText( actual ) + "</pre></td></tr>";

			// Don't show diff if actual or expected are booleans
			if ( !( /^(true|false)$/.test( actual ) ) &&
					!( /^(true|false)$/.test( expected ) ) ) {
				diff = QUnit.diff( expected, actual );
				showDiff = stripHtml( diff ).length !==
					stripHtml( expected ).length +
					stripHtml( actual ).length;
			}

			// Don't show diff if expected and actual are totally different
			if ( showDiff ) {
				message += "<tr class='test-diff'><th>Diff: </th><td><pre>" +
					diff + "</pre></td></tr>";
			}
		} else if ( expected.indexOf( "[object Array]" ) !== -1 ||
				expected.indexOf( "[object Object]" ) !== -1 ) {
			message += "<tr class='test-message'><th>Message: </th><td>" +
				"Diff suppressed as the depth of object is more than current max depth (" +
				QUnit.config.maxDepth + ").<p>Hint: Use <code>QUnit.dump.maxDepth</code> to " +
				" run with a higher max depth or <a href='" +
				escapeText( setUrl( { maxDepth: -1 } ) ) + "'>" +
				"Rerun</a> without max depth.</p></td></tr>";
		} else {
			message += "<tr class='test-message'><th>Message: </th><td>" +
				"Diff suppressed as the expected and actual results have an equivalent" +
				" serialization</td></tr>";
		}

		if ( details.source ) {
			message += "<tr class='test-source'><th>Source: </th><td><pre>" +
				escapeText( details.source ) + "</pre></td></tr>";
		}

		message += "</table>";

	// This occurs when pushFailure is set and we have an extracted stack trace
	} else if ( !details.result && details.source ) {
		message += "<table>" +
			"<tr class='test-source'><th>Source: </th><td><pre>" +
			escapeText( details.source ) + "</pre></td></tr>" +
			"</table>";
	}

	assertList = testItem.getElementsByTagName( "ol" )[ 0 ];

	assertLi = document.createElement( "li" );
	assertLi.className = details.result ? "pass" : "fail";
	assertLi.innerHTML = message;
	assertList.appendChild( assertLi );
} );

QUnit.testDone( function( details ) {
	var testTitle, time, testItem, assertList,
		good, bad, testCounts, skipped, sourceName,
		tests = id( "qunit-tests" );

	if ( !tests ) {
		return;
	}

	testItem = id( "qunit-test-output-" + details.testId );

	assertList = testItem.getElementsByTagName( "ol" )[ 0 ];

	good = details.passed;
	bad = details.failed;

	// Store result when possible
	if ( config.reorder && defined.sessionStorage ) {
		if ( bad ) {
			sessionStorage.setItem( "qunit-test-" + details.module + "-" + details.name, bad );
		} else {
			sessionStorage.removeItem( "qunit-test-" + details.module + "-" + details.name );
		}
	}

	if ( bad === 0 ) {

		// Collapse the passing tests
		addClass( assertList, "qunit-collapsed" );
	} else if ( bad && config.collapse && !collapseNext ) {

		// Skip collapsing the first failing test
		collapseNext = true;
	} else {

		// Collapse remaining tests
		addClass( assertList, "qunit-collapsed" );
	}

	// The testItem.firstChild is the test name
	testTitle = testItem.firstChild;

	testCounts = bad ?
		"<b class='failed'>" + bad + "</b>, " + "<b class='passed'>" + good + "</b>, " :
		"";

	testTitle.innerHTML += " <b class='counts'>(" + testCounts +
		details.assertions.length + ")</b>";

	if ( details.skipped ) {
		testItem.className = "skipped";
		skipped = document.createElement( "em" );
		skipped.className = "qunit-skipped-label";
		skipped.innerHTML = "skipped";
		testItem.insertBefore( skipped, testTitle );
	} else {
		addEvent( testTitle, "click", function() {
			toggleClass( assertList, "qunit-collapsed" );
		} );

		testItem.className = bad ? "fail" : "pass";

		time = document.createElement( "span" );
		time.className = "runtime";
		time.innerHTML = details.runtime + " ms";
		testItem.insertBefore( time, assertList );
	}

	// Show the source of the test when showing assertions
	if ( details.source ) {
		sourceName = document.createElement( "p" );
		sourceName.innerHTML = "<strong>Source: </strong>" + details.source;
		addClass( sourceName, "qunit-source" );
		if ( bad === 0 ) {
			addClass( sourceName, "qunit-collapsed" );
		}
		addEvent( testTitle, "click", function() {
			toggleClass( sourceName, "qunit-collapsed" );
		} );
		testItem.appendChild( sourceName );
	}
} );

// Avoid readyState issue with phantomjs
// Ref: #818
var notPhantom = ( function( p ) {
	return !( p && p.version && p.version.major > 0 );
} )( window.phantom );

if ( notPhantom && document.readyState === "complete" ) {
	QUnit.load();
} else {
	addEvent( window, "load", QUnit.load );
}

/*
 * This file is a modified version of google-diff-match-patch's JavaScript implementation
 * (https://code.google.com/p/google-diff-match-patch/source/browse/trunk/javascript/diff_match_patch_uncompressed.js),
 * modifications are licensed as more fully set forth in LICENSE.txt.
 *
 * The original source of google-diff-match-patch is attributable and licensed as follows:
 *
 * Copyright 2006 Google Inc.
 * https://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * More Info:
 *  https://code.google.com/p/google-diff-match-patch/
 *
 * Usage: QUnit.diff(expected, actual)
 *
 */
QUnit.diff = ( function() {
	function DiffMatchPatch() {
	}

	//  DIFF FUNCTIONS

	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1,
		DIFF_INSERT = 1,
		DIFF_EQUAL = 0;

	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {boolean=} optChecklines Optional speedup flag. If present and false,
	 *     then don't run a line-level diff first to identify the changed areas.
	 *     Defaults to true, which does a faster, slightly less optimal diff.
	 * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
	 */
	DiffMatchPatch.prototype.DiffMain = function( text1, text2, optChecklines ) {
		var deadline, checklines, commonlength,
			commonprefix, commonsuffix, diffs;

		// The diff must be complete in up to 1 second.
		deadline = ( new Date() ).getTime() + 1000;

		// Check for null inputs.
		if ( text1 === null || text2 === null ) {
			throw new Error( "Null input. (DiffMain)" );
		}

		// Check for equality (speedup).
		if ( text1 === text2 ) {
			if ( text1 ) {
				return [
					[ DIFF_EQUAL, text1 ]
				];
			}
			return [];
		}

		if ( typeof optChecklines === "undefined" ) {
			optChecklines = true;
		}

		checklines = optChecklines;

		// Trim off common prefix (speedup).
		commonlength = this.diffCommonPrefix( text1, text2 );
		commonprefix = text1.substring( 0, commonlength );
		text1 = text1.substring( commonlength );
		text2 = text2.substring( commonlength );

		// Trim off common suffix (speedup).
		commonlength = this.diffCommonSuffix( text1, text2 );
		commonsuffix = text1.substring( text1.length - commonlength );
		text1 = text1.substring( 0, text1.length - commonlength );
		text2 = text2.substring( 0, text2.length - commonlength );

		// Compute the diff on the middle block.
		diffs = this.diffCompute( text1, text2, checklines, deadline );

		// Restore the prefix and suffix.
		if ( commonprefix ) {
			diffs.unshift( [ DIFF_EQUAL, commonprefix ] );
		}
		if ( commonsuffix ) {
			diffs.push( [ DIFF_EQUAL, commonsuffix ] );
		}
		this.diffCleanupMerge( diffs );
		return diffs;
	};

	/**
	 * Reduce the number of edits by eliminating operationally trivial equalities.
	 * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
	 */
	DiffMatchPatch.prototype.diffCleanupEfficiency = function( diffs ) {
		var changes, equalities, equalitiesLength, lastequality,
			pointer, preIns, preDel, postIns, postDel;
		changes = false;
		equalities = []; // Stack of indices where equalities are found.
		equalitiesLength = 0; // Keeping our own length var is faster in JS.
		/** @type {?string} */
		lastequality = null;

		// Always equal to diffs[equalities[equalitiesLength - 1]][1]
		pointer = 0; // Index of current position.

		// Is there an insertion operation before the last equality.
		preIns = false;

		// Is there a deletion operation before the last equality.
		preDel = false;

		// Is there an insertion operation after the last equality.
		postIns = false;

		// Is there a deletion operation after the last equality.
		postDel = false;
		while ( pointer < diffs.length ) {

			// Equality found.
			if ( diffs[ pointer ][ 0 ] === DIFF_EQUAL ) {
				if ( diffs[ pointer ][ 1 ].length < 4 && ( postIns || postDel ) ) {

					// Candidate found.
					equalities[ equalitiesLength++ ] = pointer;
					preIns = postIns;
					preDel = postDel;
					lastequality = diffs[ pointer ][ 1 ];
				} else {

					// Not a candidate, and can never become one.
					equalitiesLength = 0;
					lastequality = null;
				}
				postIns = postDel = false;

			// An insertion or deletion.
			} else {

				if ( diffs[ pointer ][ 0 ] === DIFF_DELETE ) {
					postDel = true;
				} else {
					postIns = true;
				}

				/*
				 * Five types to be split:
				 * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
				 * <ins>A</ins>X<ins>C</ins><del>D</del>
				 * <ins>A</ins><del>B</del>X<ins>C</ins>
				 * <ins>A</del>X<ins>C</ins><del>D</del>
				 * <ins>A</ins><del>B</del>X<del>C</del>
				 */
				if ( lastequality && ( ( preIns && preDel && postIns && postDel ) ||
						( ( lastequality.length < 2 ) &&
						( preIns + preDel + postIns + postDel ) === 3 ) ) ) {

					// Duplicate record.
					diffs.splice(
						equalities[ equalitiesLength - 1 ],
						0,
						[ DIFF_DELETE, lastequality ]
					);

					// Change second copy to insert.
					diffs[ equalities[ equalitiesLength - 1 ] + 1 ][ 0 ] = DIFF_INSERT;
					equalitiesLength--; // Throw away the equality we just deleted;
					lastequality = null;
					if ( preIns && preDel ) {

						// No changes made which could affect previous entry, keep going.
						postIns = postDel = true;
						equalitiesLength = 0;
					} else {
						equalitiesLength--; // Throw away the previous equality.
						pointer = equalitiesLength > 0 ? equalities[ equalitiesLength - 1 ] : -1;
						postIns = postDel = false;
					}
					changes = true;
				}
			}
			pointer++;
		}

		if ( changes ) {
			this.diffCleanupMerge( diffs );
		}
	};

	/**
	 * Convert a diff array into a pretty HTML report.
	 * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
	 * @param {integer} string to be beautified.
	 * @return {string} HTML representation.
	 */
	DiffMatchPatch.prototype.diffPrettyHtml = function( diffs ) {
		var op, data, x,
			html = [];
		for ( x = 0; x < diffs.length; x++ ) {
			op = diffs[ x ][ 0 ]; // Operation (insert, delete, equal)
			data = diffs[ x ][ 1 ]; // Text of change.
			switch ( op ) {
			case DIFF_INSERT:
				html[ x ] = "<ins>" + escapeText( data ) + "</ins>";
				break;
			case DIFF_DELETE:
				html[ x ] = "<del>" + escapeText( data ) + "</del>";
				break;
			case DIFF_EQUAL:
				html[ x ] = "<span>" + escapeText( data ) + "</span>";
				break;
			}
		}
		return html.join( "" );
	};

	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	DiffMatchPatch.prototype.diffCommonPrefix = function( text1, text2 ) {
		var pointermid, pointermax, pointermin, pointerstart;

		// Quick check for common null cases.
		if ( !text1 || !text2 || text1.charAt( 0 ) !== text2.charAt( 0 ) ) {
			return 0;
		}

		// Binary search.
		// Performance analysis: https://neil.fraser.name/news/2007/10/09/
		pointermin = 0;
		pointermax = Math.min( text1.length, text2.length );
		pointermid = pointermax;
		pointerstart = 0;
		while ( pointermin < pointermid ) {
			if ( text1.substring( pointerstart, pointermid ) ===
					text2.substring( pointerstart, pointermid ) ) {
				pointermin = pointermid;
				pointerstart = pointermin;
			} else {
				pointermax = pointermid;
			}
			pointermid = Math.floor( ( pointermax - pointermin ) / 2 + pointermin );
		}
		return pointermid;
	};

	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	DiffMatchPatch.prototype.diffCommonSuffix = function( text1, text2 ) {
		var pointermid, pointermax, pointermin, pointerend;

		// Quick check for common null cases.
		if ( !text1 ||
				!text2 ||
				text1.charAt( text1.length - 1 ) !== text2.charAt( text2.length - 1 ) ) {
			return 0;
		}

		// Binary search.
		// Performance analysis: https://neil.fraser.name/news/2007/10/09/
		pointermin = 0;
		pointermax = Math.min( text1.length, text2.length );
		pointermid = pointermax;
		pointerend = 0;
		while ( pointermin < pointermid ) {
			if ( text1.substring( text1.length - pointermid, text1.length - pointerend ) ===
					text2.substring( text2.length - pointermid, text2.length - pointerend ) ) {
				pointermin = pointermid;
				pointerend = pointermin;
			} else {
				pointermax = pointermid;
			}
			pointermid = Math.floor( ( pointermax - pointermin ) / 2 + pointermin );
		}
		return pointermid;
	};

	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {boolean} checklines Speedup flag.  If false, then don't run a
	 *     line-level diff first to identify the changed areas.
	 *     If true, then run a faster, slightly less optimal diff.
	 * @param {number} deadline Time when the diff should be complete by.
	 * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
	 * @private
	 */
	DiffMatchPatch.prototype.diffCompute = function( text1, text2, checklines, deadline ) {
		var diffs, longtext, shorttext, i, hm,
			text1A, text2A, text1B, text2B,
			midCommon, diffsA, diffsB;

		if ( !text1 ) {

			// Just add some text (speedup).
			return [
				[ DIFF_INSERT, text2 ]
			];
		}

		if ( !text2 ) {

			// Just delete some text (speedup).
			return [
				[ DIFF_DELETE, text1 ]
			];
		}

		longtext = text1.length > text2.length ? text1 : text2;
		shorttext = text1.length > text2.length ? text2 : text1;
		i = longtext.indexOf( shorttext );
		if ( i !== -1 ) {

			// Shorter text is inside the longer text (speedup).
			diffs = [
				[ DIFF_INSERT, longtext.substring( 0, i ) ],
				[ DIFF_EQUAL, shorttext ],
				[ DIFF_INSERT, longtext.substring( i + shorttext.length ) ]
			];

			// Swap insertions for deletions if diff is reversed.
			if ( text1.length > text2.length ) {
				diffs[ 0 ][ 0 ] = diffs[ 2 ][ 0 ] = DIFF_DELETE;
			}
			return diffs;
		}

		if ( shorttext.length === 1 ) {

			// Single character string.
			// After the previous speedup, the character can't be an equality.
			return [
				[ DIFF_DELETE, text1 ],
				[ DIFF_INSERT, text2 ]
			];
		}

		// Check to see if the problem can be split in two.
		hm = this.diffHalfMatch( text1, text2 );
		if ( hm ) {

			// A half-match was found, sort out the return data.
			text1A = hm[ 0 ];
			text1B = hm[ 1 ];
			text2A = hm[ 2 ];
			text2B = hm[ 3 ];
			midCommon = hm[ 4 ];

			// Send both pairs off for separate processing.
			diffsA = this.DiffMain( text1A, text2A, checklines, deadline );
			diffsB = this.DiffMain( text1B, text2B, checklines, deadline );

			// Merge the results.
			return diffsA.concat( [
				[ DIFF_EQUAL, midCommon ]
			], diffsB );
		}

		if ( checklines && text1.length > 100 && text2.length > 100 ) {
			return this.diffLineMode( text1, text2, deadline );
		}

		return this.diffBisect( text1, text2, deadline );
	};

	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 * @private
	 */
	DiffMatchPatch.prototype.diffHalfMatch = function( text1, text2 ) {
		var longtext, shorttext, dmp,
			text1A, text2B, text2A, text1B, midCommon,
			hm1, hm2, hm;

		longtext = text1.length > text2.length ? text1 : text2;
		shorttext = text1.length > text2.length ? text2 : text1;
		if ( longtext.length < 4 || shorttext.length * 2 < longtext.length ) {
			return null; // Pointless.
		}
		dmp = this; // 'this' becomes 'window' in a closure.

		/**
		 * Does a substring of shorttext exist within longtext such that the substring
		 * is at least half the length of longtext?
		 * Closure, but does not reference any external variables.
		 * @param {string} longtext Longer string.
		 * @param {string} shorttext Shorter string.
		 * @param {number} i Start index of quarter length substring within longtext.
		 * @return {Array.<string>} Five element Array, containing the prefix of
		 *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
		 *     of shorttext and the common middle.  Or null if there was no match.
		 * @private
		 */
		function diffHalfMatchI( longtext, shorttext, i ) {
			var seed, j, bestCommon, prefixLength, suffixLength,
				bestLongtextA, bestLongtextB, bestShorttextA, bestShorttextB;

			// Start with a 1/4 length substring at position i as a seed.
			seed = longtext.substring( i, i + Math.floor( longtext.length / 4 ) );
			j = -1;
			bestCommon = "";
			while ( ( j = shorttext.indexOf( seed, j + 1 ) ) !== -1 ) {
				prefixLength = dmp.diffCommonPrefix( longtext.substring( i ),
					shorttext.substring( j ) );
				suffixLength = dmp.diffCommonSuffix( longtext.substring( 0, i ),
					shorttext.substring( 0, j ) );
				if ( bestCommon.length < suffixLength + prefixLength ) {
					bestCommon = shorttext.substring( j - suffixLength, j ) +
						shorttext.substring( j, j + prefixLength );
					bestLongtextA = longtext.substring( 0, i - suffixLength );
					bestLongtextB = longtext.substring( i + prefixLength );
					bestShorttextA = shorttext.substring( 0, j - suffixLength );
					bestShorttextB = shorttext.substring( j + prefixLength );
				}
			}
			if ( bestCommon.length * 2 >= longtext.length ) {
				return [ bestLongtextA, bestLongtextB,
					bestShorttextA, bestShorttextB, bestCommon
				];
			} else {
				return null;
			}
		}

		// First check if the second quarter is the seed for a half-match.
		hm1 = diffHalfMatchI( longtext, shorttext,
			Math.ceil( longtext.length / 4 ) );

		// Check again based on the third quarter.
		hm2 = diffHalfMatchI( longtext, shorttext,
			Math.ceil( longtext.length / 2 ) );
		if ( !hm1 && !hm2 ) {
			return null;
		} else if ( !hm2 ) {
			hm = hm1;
		} else if ( !hm1 ) {
			hm = hm2;
		} else {

			// Both matched.  Select the longest.
			hm = hm1[ 4 ].length > hm2[ 4 ].length ? hm1 : hm2;
		}

		// A half-match was found, sort out the return data.
		text1A, text1B, text2A, text2B;
		if ( text1.length > text2.length ) {
			text1A = hm[ 0 ];
			text1B = hm[ 1 ];
			text2A = hm[ 2 ];
			text2B = hm[ 3 ];
		} else {
			text2A = hm[ 0 ];
			text2B = hm[ 1 ];
			text1A = hm[ 2 ];
			text1B = hm[ 3 ];
		}
		midCommon = hm[ 4 ];
		return [ text1A, text1B, text2A, text2B, midCommon ];
	};

	/**
	 * Do a quick line-level diff on both strings, then rediff the parts for
	 * greater accuracy.
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} deadline Time when the diff should be complete by.
	 * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
	 * @private
	 */
	DiffMatchPatch.prototype.diffLineMode = function( text1, text2, deadline ) {
		var a, diffs, linearray, pointer, countInsert,
			countDelete, textInsert, textDelete, j;

		// Scan the text on a line-by-line basis first.
		a = this.diffLinesToChars( text1, text2 );
		text1 = a.chars1;
		text2 = a.chars2;
		linearray = a.lineArray;

		diffs = this.DiffMain( text1, text2, false, deadline );

		// Convert the diff back to original text.
		this.diffCharsToLines( diffs, linearray );

		// Eliminate freak matches (e.g. blank lines)
		this.diffCleanupSemantic( diffs );

		// Rediff any replacement blocks, this time character-by-character.
		// Add a dummy entry at the end.
		diffs.push( [ DIFF_EQUAL, "" ] );
		pointer = 0;
		countDelete = 0;
		countInsert = 0;
		textDelete = "";
		textInsert = "";
		while ( pointer < diffs.length ) {
			switch ( diffs[ pointer ][ 0 ] ) {
			case DIFF_INSERT:
				countInsert++;
				textInsert += diffs[ pointer ][ 1 ];
				break;
			case DIFF_DELETE:
				countDelete++;
				textDelete += diffs[ pointer ][ 1 ];
				break;
			case DIFF_EQUAL:

				// Upon reaching an equality, check for prior redundancies.
				if ( countDelete >= 1 && countInsert >= 1 ) {

					// Delete the offending records and add the merged ones.
					diffs.splice( pointer - countDelete - countInsert,
						countDelete + countInsert );
					pointer = pointer - countDelete - countInsert;
					a = this.DiffMain( textDelete, textInsert, false, deadline );
					for ( j = a.length - 1; j >= 0; j-- ) {
						diffs.splice( pointer, 0, a[ j ] );
					}
					pointer = pointer + a.length;
				}
				countInsert = 0;
				countDelete = 0;
				textDelete = "";
				textInsert = "";
				break;
			}
			pointer++;
		}
		diffs.pop(); // Remove the dummy entry at the end.

		return diffs;
	};

	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} deadline Time at which to bail if not yet complete.
	 * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
	 * @private
	 */
	DiffMatchPatch.prototype.diffBisect = function( text1, text2, deadline ) {
		var text1Length, text2Length, maxD, vOffset, vLength,
			v1, v2, x, delta, front, k1start, k1end, k2start,
			k2end, k2Offset, k1Offset, x1, x2, y1, y2, d, k1, k2;

		// Cache the text lengths to prevent multiple calls.
		text1Length = text1.length;
		text2Length = text2.length;
		maxD = Math.ceil( ( text1Length + text2Length ) / 2 );
		vOffset = maxD;
		vLength = 2 * maxD;
		v1 = new Array( vLength );
		v2 = new Array( vLength );

		// Setting all elements to -1 is faster in Chrome & Firefox than mixing
		// integers and undefined.
		for ( x = 0; x < vLength; x++ ) {
			v1[ x ] = -1;
			v2[ x ] = -1;
		}
		v1[ vOffset + 1 ] = 0;
		v2[ vOffset + 1 ] = 0;
		delta = text1Length - text2Length;

		// If the total number of characters is odd, then the front path will collide
		// with the reverse path.
		front = ( delta % 2 !== 0 );

		// Offsets for start and end of k loop.
		// Prevents mapping of space beyond the grid.
		k1start = 0;
		k1end = 0;
		k2start = 0;
		k2end = 0;
		for ( d = 0; d < maxD; d++ ) {

			// Bail out if deadline is reached.
			if ( ( new Date() ).getTime() > deadline ) {
				break;
			}

			// Walk the front path one step.
			for ( k1 = -d + k1start; k1 <= d - k1end; k1 += 2 ) {
				k1Offset = vOffset + k1;
				if ( k1 === -d || ( k1 !== d && v1[ k1Offset - 1 ] < v1[ k1Offset + 1 ] ) ) {
					x1 = v1[ k1Offset + 1 ];
				} else {
					x1 = v1[ k1Offset - 1 ] + 1;
				}
				y1 = x1 - k1;
				while ( x1 < text1Length && y1 < text2Length &&
					text1.charAt( x1 ) === text2.charAt( y1 ) ) {
					x1++;
					y1++;
				}
				v1[ k1Offset ] = x1;
				if ( x1 > text1Length ) {

					// Ran off the right of the graph.
					k1end += 2;
				} else if ( y1 > text2Length ) {

					// Ran off the bottom of the graph.
					k1start += 2;
				} else if ( front ) {
					k2Offset = vOffset + delta - k1;
					if ( k2Offset >= 0 && k2Offset < vLength && v2[ k2Offset ] !== -1 ) {

						// Mirror x2 onto top-left coordinate system.
						x2 = text1Length - v2[ k2Offset ];
						if ( x1 >= x2 ) {

							// Overlap detected.
							return this.diffBisectSplit( text1, text2, x1, y1, deadline );
						}
					}
				}
			}

			// Walk the reverse path one step.
			for ( k2 = -d + k2start; k2 <= d - k2end; k2 += 2 ) {
				k2Offset = vOffset + k2;
				if ( k2 === -d || ( k2 !== d && v2[ k2Offset - 1 ] < v2[ k2Offset + 1 ] ) ) {
					x2 = v2[ k2Offset + 1 ];
				} else {
					x2 = v2[ k2Offset - 1 ] + 1;
				}
				y2 = x2 - k2;
				while ( x2 < text1Length && y2 < text2Length &&
					text1.charAt( text1Length - x2 - 1 ) ===
					text2.charAt( text2Length - y2 - 1 ) ) {
					x2++;
					y2++;
				}
				v2[ k2Offset ] = x2;
				if ( x2 > text1Length ) {

					// Ran off the left of the graph.
					k2end += 2;
				} else if ( y2 > text2Length ) {

					// Ran off the top of the graph.
					k2start += 2;
				} else if ( !front ) {
					k1Offset = vOffset + delta - k2;
					if ( k1Offset >= 0 && k1Offset < vLength && v1[ k1Offset ] !== -1 ) {
						x1 = v1[ k1Offset ];
						y1 = vOffset + x1 - k1Offset;

						// Mirror x2 onto top-left coordinate system.
						x2 = text1Length - x2;
						if ( x1 >= x2 ) {

							// Overlap detected.
							return this.diffBisectSplit( text1, text2, x1, y1, deadline );
						}
					}
				}
			}
		}

		// Diff took too long and hit the deadline or
		// number of diffs equals number of characters, no commonality at all.
		return [
			[ DIFF_DELETE, text1 ],
			[ DIFF_INSERT, text2 ]
		];
	};

	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @param {number} deadline Time at which to bail if not yet complete.
	 * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
	 * @private
	 */
	DiffMatchPatch.prototype.diffBisectSplit = function( text1, text2, x, y, deadline ) {
		var text1a, text1b, text2a, text2b, diffs, diffsb;
		text1a = text1.substring( 0, x );
		text2a = text2.substring( 0, y );
		text1b = text1.substring( x );
		text2b = text2.substring( y );

		// Compute both diffs serially.
		diffs = this.DiffMain( text1a, text2a, false, deadline );
		diffsb = this.DiffMain( text1b, text2b, false, deadline );

		return diffs.concat( diffsb );
	};

	/**
	 * Reduce the number of edits by eliminating semantically trivial equalities.
	 * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
	 */
	DiffMatchPatch.prototype.diffCleanupSemantic = function( diffs ) {
		var changes, equalities, equalitiesLength, lastequality,
			pointer, lengthInsertions2, lengthDeletions2, lengthInsertions1,
			lengthDeletions1, deletion, insertion, overlapLength1, overlapLength2;
		changes = false;
		equalities = []; // Stack of indices where equalities are found.
		equalitiesLength = 0; // Keeping our own length var is faster in JS.
		/** @type {?string} */
		lastequality = null;

		// Always equal to diffs[equalities[equalitiesLength - 1]][1]
		pointer = 0; // Index of current position.

		// Number of characters that changed prior to the equality.
		lengthInsertions1 = 0;
		lengthDeletions1 = 0;

		// Number of characters that changed after the equality.
		lengthInsertions2 = 0;
		lengthDeletions2 = 0;
		while ( pointer < diffs.length ) {
			if ( diffs[ pointer ][ 0 ] === DIFF_EQUAL ) { // Equality found.
				equalities[ equalitiesLength++ ] = pointer;
				lengthInsertions1 = lengthInsertions2;
				lengthDeletions1 = lengthDeletions2;
				lengthInsertions2 = 0;
				lengthDeletions2 = 0;
				lastequality = diffs[ pointer ][ 1 ];
			} else { // An insertion or deletion.
				if ( diffs[ pointer ][ 0 ] === DIFF_INSERT ) {
					lengthInsertions2 += diffs[ pointer ][ 1 ].length;
				} else {
					lengthDeletions2 += diffs[ pointer ][ 1 ].length;
				}

				// Eliminate an equality that is smaller or equal to the edits on both
				// sides of it.
				if ( lastequality && ( lastequality.length <=
						Math.max( lengthInsertions1, lengthDeletions1 ) ) &&
						( lastequality.length <= Math.max( lengthInsertions2,
							lengthDeletions2 ) ) ) {

					// Duplicate record.
					diffs.splice(
						equalities[ equalitiesLength - 1 ],
						0,
						[ DIFF_DELETE, lastequality ]
					);

					// Change second copy to insert.
					diffs[ equalities[ equalitiesLength - 1 ] + 1 ][ 0 ] = DIFF_INSERT;

					// Throw away the equality we just deleted.
					equalitiesLength--;

					// Throw away the previous equality (it needs to be reevaluated).
					equalitiesLength--;
					pointer = equalitiesLength > 0 ? equalities[ equalitiesLength - 1 ] : -1;

					// Reset the counters.
					lengthInsertions1 = 0;
					lengthDeletions1 = 0;
					lengthInsertions2 = 0;
					lengthDeletions2 = 0;
					lastequality = null;
					changes = true;
				}
			}
			pointer++;
		}

		// Normalize the diff.
		if ( changes ) {
			this.diffCleanupMerge( diffs );
		}

		// Find any overlaps between deletions and insertions.
		// e.g: <del>abcxxx</del><ins>xxxdef</ins>
		//   -> <del>abc</del>xxx<ins>def</ins>
		// e.g: <del>xxxabc</del><ins>defxxx</ins>
		//   -> <ins>def</ins>xxx<del>abc</del>
		// Only extract an overlap if it is as big as the edit ahead or behind it.
		pointer = 1;
		while ( pointer < diffs.length ) {
			if ( diffs[ pointer - 1 ][ 0 ] === DIFF_DELETE &&
					diffs[ pointer ][ 0 ] === DIFF_INSERT ) {
				deletion = diffs[ pointer - 1 ][ 1 ];
				insertion = diffs[ pointer ][ 1 ];
				overlapLength1 = this.diffCommonOverlap( deletion, insertion );
				overlapLength2 = this.diffCommonOverlap( insertion, deletion );
				if ( overlapLength1 >= overlapLength2 ) {
					if ( overlapLength1 >= deletion.length / 2 ||
							overlapLength1 >= insertion.length / 2 ) {

						// Overlap found.  Insert an equality and trim the surrounding edits.
						diffs.splice(
							pointer,
							0,
							[ DIFF_EQUAL, insertion.substring( 0, overlapLength1 ) ]
						);
						diffs[ pointer - 1 ][ 1 ] =
							deletion.substring( 0, deletion.length - overlapLength1 );
						diffs[ pointer + 1 ][ 1 ] = insertion.substring( overlapLength1 );
						pointer++;
					}
				} else {
					if ( overlapLength2 >= deletion.length / 2 ||
							overlapLength2 >= insertion.length / 2 ) {

						// Reverse overlap found.
						// Insert an equality and swap and trim the surrounding edits.
						diffs.splice(
							pointer,
							0,
							[ DIFF_EQUAL, deletion.substring( 0, overlapLength2 ) ]
						);

						diffs[ pointer - 1 ][ 0 ] = DIFF_INSERT;
						diffs[ pointer - 1 ][ 1 ] =
							insertion.substring( 0, insertion.length - overlapLength2 );
						diffs[ pointer + 1 ][ 0 ] = DIFF_DELETE;
						diffs[ pointer + 1 ][ 1 ] =
							deletion.substring( overlapLength2 );
						pointer++;
					}
				}
				pointer++;
			}
			pointer++;
		}
	};

	/**
	 * Determine if the suffix of one string is the prefix of another.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of the first
	 *     string and the start of the second string.
	 * @private
	 */
	DiffMatchPatch.prototype.diffCommonOverlap = function( text1, text2 ) {
		var text1Length, text2Length, textLength,
			best, length, pattern, found;

		// Cache the text lengths to prevent multiple calls.
		text1Length = text1.length;
		text2Length = text2.length;

		// Eliminate the null case.
		if ( text1Length === 0 || text2Length === 0 ) {
			return 0;
		}

		// Truncate the longer string.
		if ( text1Length > text2Length ) {
			text1 = text1.substring( text1Length - text2Length );
		} else if ( text1Length < text2Length ) {
			text2 = text2.substring( 0, text1Length );
		}
		textLength = Math.min( text1Length, text2Length );

		// Quick check for the worst case.
		if ( text1 === text2 ) {
			return textLength;
		}

		// Start by looking for a single character match
		// and increase length until no match is found.
		// Performance analysis: https://neil.fraser.name/news/2010/11/04/
		best = 0;
		length = 1;
		while ( true ) {
			pattern = text1.substring( textLength - length );
			found = text2.indexOf( pattern );
			if ( found === -1 ) {
				return best;
			}
			length += found;
			if ( found === 0 || text1.substring( textLength - length ) ===
					text2.substring( 0, length ) ) {
				best = length;
				length++;
			}
		}
	};

	/**
	 * Split two texts into an array of strings.  Reduce the texts to a string of
	 * hashes where each Unicode character represents one line.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
	 *     An object containing the encoded text1, the encoded text2 and
	 *     the array of unique strings.
	 *     The zeroth element of the array of unique strings is intentionally blank.
	 * @private
	 */
	DiffMatchPatch.prototype.diffLinesToChars = function( text1, text2 ) {
		var lineArray, lineHash, chars1, chars2;
		lineArray = []; // E.g. lineArray[4] === 'Hello\n'
		lineHash = {};  // E.g. lineHash['Hello\n'] === 4

		// '\x00' is a valid character, but various debuggers don't like it.
		// So we'll insert a junk entry to avoid generating a null character.
		lineArray[ 0 ] = "";

		/**
		 * Split a text into an array of strings.  Reduce the texts to a string of
		 * hashes where each Unicode character represents one line.
		 * Modifies linearray and linehash through being a closure.
		 * @param {string} text String to encode.
		 * @return {string} Encoded string.
		 * @private
		 */
		function diffLinesToCharsMunge( text ) {
			var chars, lineStart, lineEnd, lineArrayLength, line;
			chars = "";

			// Walk the text, pulling out a substring for each line.
			// text.split('\n') would would temporarily double our memory footprint.
			// Modifying text would create many large strings to garbage collect.
			lineStart = 0;
			lineEnd = -1;

			// Keeping our own length variable is faster than looking it up.
			lineArrayLength = lineArray.length;
			while ( lineEnd < text.length - 1 ) {
				lineEnd = text.indexOf( "\n", lineStart );
				if ( lineEnd === -1 ) {
					lineEnd = text.length - 1;
				}
				line = text.substring( lineStart, lineEnd + 1 );
				lineStart = lineEnd + 1;

				if ( lineHash.hasOwnProperty ? lineHash.hasOwnProperty( line ) :
							( lineHash[ line ] !== undefined ) ) {
					chars += String.fromCharCode( lineHash[ line ] );
				} else {
					chars += String.fromCharCode( lineArrayLength );
					lineHash[ line ] = lineArrayLength;
					lineArray[ lineArrayLength++ ] = line;
				}
			}
			return chars;
		}

		chars1 = diffLinesToCharsMunge( text1 );
		chars2 = diffLinesToCharsMunge( text2 );
		return {
			chars1: chars1,
			chars2: chars2,
			lineArray: lineArray
		};
	};

	/**
	 * Rehydrate the text in a diff from a string of line hashes to real lines of
	 * text.
	 * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
	 * @param {!Array.<string>} lineArray Array of unique strings.
	 * @private
	 */
	DiffMatchPatch.prototype.diffCharsToLines = function( diffs, lineArray ) {
		var x, chars, text, y;
		for ( x = 0; x < diffs.length; x++ ) {
			chars = diffs[ x ][ 1 ];
			text = [];
			for ( y = 0; y < chars.length; y++ ) {
				text[ y ] = lineArray[ chars.charCodeAt( y ) ];
			}
			diffs[ x ][ 1 ] = text.join( "" );
		}
	};

	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
	 */
	DiffMatchPatch.prototype.diffCleanupMerge = function( diffs ) {
		var pointer, countDelete, countInsert, textInsert, textDelete,
			commonlength, changes, diffPointer, position;
		diffs.push( [ DIFF_EQUAL, "" ] ); // Add a dummy entry at the end.
		pointer = 0;
		countDelete = 0;
		countInsert = 0;
		textDelete = "";
		textInsert = "";
		commonlength;
		while ( pointer < diffs.length ) {
			switch ( diffs[ pointer ][ 0 ] ) {
			case DIFF_INSERT:
				countInsert++;
				textInsert += diffs[ pointer ][ 1 ];
				pointer++;
				break;
			case DIFF_DELETE:
				countDelete++;
				textDelete += diffs[ pointer ][ 1 ];
				pointer++;
				break;
			case DIFF_EQUAL:

				// Upon reaching an equality, check for prior redundancies.
				if ( countDelete + countInsert > 1 ) {
					if ( countDelete !== 0 && countInsert !== 0 ) {

						// Factor out any common prefixes.
						commonlength = this.diffCommonPrefix( textInsert, textDelete );
						if ( commonlength !== 0 ) {
							if ( ( pointer - countDelete - countInsert ) > 0 &&
									diffs[ pointer - countDelete - countInsert - 1 ][ 0 ] ===
									DIFF_EQUAL ) {
								diffs[ pointer - countDelete - countInsert - 1 ][ 1 ] +=
									textInsert.substring( 0, commonlength );
							} else {
								diffs.splice( 0, 0, [ DIFF_EQUAL,
									textInsert.substring( 0, commonlength )
								] );
								pointer++;
							}
							textInsert = textInsert.substring( commonlength );
							textDelete = textDelete.substring( commonlength );
						}

						// Factor out any common suffixies.
						commonlength = this.diffCommonSuffix( textInsert, textDelete );
						if ( commonlength !== 0 ) {
							diffs[ pointer ][ 1 ] = textInsert.substring( textInsert.length -
									commonlength ) + diffs[ pointer ][ 1 ];
							textInsert = textInsert.substring( 0, textInsert.length -
								commonlength );
							textDelete = textDelete.substring( 0, textDelete.length -
								commonlength );
						}
					}

					// Delete the offending records and add the merged ones.
					if ( countDelete === 0 ) {
						diffs.splice( pointer - countInsert,
							countDelete + countInsert, [ DIFF_INSERT, textInsert ] );
					} else if ( countInsert === 0 ) {
						diffs.splice( pointer - countDelete,
							countDelete + countInsert, [ DIFF_DELETE, textDelete ] );
					} else {
						diffs.splice(
							pointer - countDelete - countInsert,
							countDelete + countInsert,
							[ DIFF_DELETE, textDelete ], [ DIFF_INSERT, textInsert ]
						);
					}
					pointer = pointer - countDelete - countInsert +
						( countDelete ? 1 : 0 ) + ( countInsert ? 1 : 0 ) + 1;
				} else if ( pointer !== 0 && diffs[ pointer - 1 ][ 0 ] === DIFF_EQUAL ) {

					// Merge this equality with the previous one.
					diffs[ pointer - 1 ][ 1 ] += diffs[ pointer ][ 1 ];
					diffs.splice( pointer, 1 );
				} else {
					pointer++;
				}
				countInsert = 0;
				countDelete = 0;
				textDelete = "";
				textInsert = "";
				break;
			}
		}
		if ( diffs[ diffs.length - 1 ][ 1 ] === "" ) {
			diffs.pop(); // Remove the dummy entry at the end.
		}

		// Second pass: look for single edits surrounded on both sides by equalities
		// which can be shifted sideways to eliminate an equality.
		// e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
		changes = false;
		pointer = 1;

		// Intentionally ignore the first and last element (don't need checking).
		while ( pointer < diffs.length - 1 ) {
			if ( diffs[ pointer - 1 ][ 0 ] === DIFF_EQUAL &&
					diffs[ pointer + 1 ][ 0 ] === DIFF_EQUAL ) {

				diffPointer = diffs[ pointer ][ 1 ];
				position = diffPointer.substring(
					diffPointer.length - diffs[ pointer - 1 ][ 1 ].length
				);

				// This is a single edit surrounded by equalities.
				if ( position === diffs[ pointer - 1 ][ 1 ] ) {

					// Shift the edit over the previous equality.
					diffs[ pointer ][ 1 ] = diffs[ pointer - 1 ][ 1 ] +
						diffs[ pointer ][ 1 ].substring( 0, diffs[ pointer ][ 1 ].length -
							diffs[ pointer - 1 ][ 1 ].length );
					diffs[ pointer + 1 ][ 1 ] =
						diffs[ pointer - 1 ][ 1 ] + diffs[ pointer + 1 ][ 1 ];
					diffs.splice( pointer - 1, 1 );
					changes = true;
				} else if ( diffPointer.substring( 0, diffs[ pointer + 1 ][ 1 ].length ) ===
						diffs[ pointer + 1 ][ 1 ] ) {

					// Shift the edit over the next equality.
					diffs[ pointer - 1 ][ 1 ] += diffs[ pointer + 1 ][ 1 ];
					diffs[ pointer ][ 1 ] =
						diffs[ pointer ][ 1 ].substring( diffs[ pointer + 1 ][ 1 ].length ) +
						diffs[ pointer + 1 ][ 1 ];
					diffs.splice( pointer + 1, 1 );
					changes = true;
				}
			}
			pointer++;
		}

		// If shifts were made, the diff needs reordering and another shift sweep.
		if ( changes ) {
			this.diffCleanupMerge( diffs );
		}
	};

	return function( o, n ) {
		var diff, output, text;
		diff = new DiffMatchPatch();
		output = diff.DiffMain( o, n );
		diff.diffCleanupEfficiency( output );
		text = diff.diffPrettyHtml( output );

		return text;
	};
}() );

}() );
