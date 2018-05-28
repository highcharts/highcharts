/* eslint no-console: 0, no-extend-native: 0 */
/* global Highcharts */
(function (window) {

    var // applyLogger,
        // callLogger,
        // isHighcharts,
        // originalApply = Function.prototype.apply,
        // originalCall = Function.prototype.call,
        // printLive = false,
        stackDepth = 0,
        stackLog = [],
        wrapStack = [];

    /**
     * The internal logger for function applies.
     *
     * @return {any}
     * The return value of the applied function.
     *
    applyLogger = function () {
        Function.prototype.call = originalCall;
        Function.prototype.apply = originalApply;
        try {
            stackLog.push({
                functionName: this.name,
                stackDepth: stackDepth++
            });
            if (printLive) {
                window.console.log(stackDepth + ': ' + (this.name || '<anonymous>'));
            }
            return originalApply.bind(this)(arguments);
        } finally {
            --stackDepth;
            Function.prototype.apply = applyLogger;
            Function.prototype.call = callLogger;
        }
    };
    // */

    /**
     * The internal logger for function calls.
     *
     * @return {any}
     * The return value of the called function.
     *
    callLogger = function () {
        Function.prototype.call = originalCall;
        Function.prototype.apply = originalApply;
        try {
            stackLog.push({
                functionName: this.name,
                stackDepth: stackDepth++
            });
            if (printLive) {
                window.console.log(stackDepth + ': ' + (this.name || '<anonymous>'));
            }
            return originalCall.bind(this)(arguments);
        } finally {
            --stackDepth;
            Function.prototype.apply = applyLogger;
            Function.prototype.call = callLogger;
        }
    };
    // */

    /*
    isHighcharts = function (obj) {
        return (window.Highcharts && (
            obj instanceof Highcharts.Annotation ||
            obj instanceof Highcharts.Axis ||
            obj instanceof Highcharts.Chart ||
            obj instanceof Highcharts.Legend ||
            obj instanceof Highcharts.Point ||
            obj instanceof Highcharts.Pointer ||
            obj instanceof Highcharts.Series ||
            obj instanceof Highcharts.SVGElement ||
            obj instanceof Highcharts.SVGRenderer ||
            obj instanceof Highcharts.Time
        ));
    };
    // */

    /**
     * The call analyzer to track function calls.
     */
    window.CallAnalyzer = (window.CallAnalyzer || {});

    /**
     * Turns the logging of function calls on.
     *
     * @param {boolean} live
     * Optional flag to activate live print of function calls.
     *
     * @return {void}
     *
    window.CallAnalyzer.activate = function (live) {
        stackDepth = 0;
        printLive = live;
        Function.prototype.apply = applyLogger;
        Function.prototype.call = callLogger;
    };
    // */

    /**
     * Removes all items from the log.
     *
     * @return {void}
     */
    window.CallAnalyzer.clearLog = function () {
        stackDepth = 0;
        stackLog.length = 0;
    };

    /**
     * Turns the logging of function calls off.
     *
     * @return {void}
     *
    window.CallAnalyzer.deactivate = function () {
        Function.prototype.apply = originalApply;
        Function.prototype.call = originalCall;
        printLive = false;
        stackDepth = 0;
    };
    // */

    /**
     * Returns an array of log items. Each log item contains the properties
     * `functionName` and `stackDepth`.
     *
     * @param {function} filter
     * Optional filter function to select log items. Has to return true, if the
     * item should be part of the returned array.
     *
     * @return {Array}
     * The array of log items.
     */
    window.CallAnalyzer.getLog = function (filter) {

        // window.CallAnalyzer.deactivate();

        if (typeof filter !== 'function') {
            return stackLog;
        }

        var logItem,
            filteredLog = [];

        for (var i = 0, ie = stackLog.length; i < ie; ++i) {
            logItem = stackLog[i];
            if (filter(logItem) === true) {
                filteredLog.push(logItem);
            }
        }

        return filteredLog;
    };

    /**
     * Wraps the official Highcharts classes.
     *
     * @return {void}
     */
    window.CallAnalyzer.wrapHighcharts = function () {

        if (!window.Highcharts) {
            return;
        }

        /**
         * Creates a wrapper for a given function.
         *
         * @param {function} fn
         * The function to wrap.
         *
         * @param {string} fnName
         * The name of the function to wrap.
         *
         * @return {function}
         * The wrapper for the function.
         */
        function createWrapper(fn, fnName) {
            return function () {
                try {
                    stackLog.push({
                        functionName: fnName,
                        stackDepth: stackDepth++
                    });
                    return fn.apply(this, arguments);
                } finally {
                    --stackDepth;
                }
            };
        }

        /**
         * Wrap the function properties of an object.
         *
         * @param {object} obj
         * The object to wrap.
         *
         * @param {string} objName
         * The name in the parent object.
         *
         * @return {void}
         */
        function wrap(obj, objName) {

            var prop;

            for (var key in obj) {

                if (typeof obj[key] === 'undefined' ||
                    obj[key] === null ||
                    !obj.hasOwnProperty(key)
                ) {
                    continue;
                }

                prop = obj[key];

                if (typeof prop === 'function') {

                    obj[key] = createWrapper(prop, objName + '.' + key);

                    if (typeof prop.prototype !== 'undefined') {
                        obj[key].prototype = prop.prototype;
                    }

                    wrapStack.push({
                        obj: obj,
                        property: prop,
                        functionName: key
                    });
                }

            }
        }

        for (var className in Highcharts) {

            if (typeof Highcharts[className] === 'undefined' ||
                Highcharts[className] === null ||
                !Highcharts.hasOwnProperty(className)
            ) {
                continue;
            }

            switch (className) {
                default:
                    continue;
                case 'Annotation':
                case 'Axis':
                case 'Chart':
                case 'Legend':
                case 'Point':
                case 'Pointer':
                case 'Series':
                case 'SVGElement':
                case 'SVGRenderer':
                case 'Time':
                    wrap(Highcharts[className].prototype, className);
                    break;
            }

        }

    };

    /**
     * Unwraps the official Highcharts classes.
     *
     * @return {void}
     */
    window.CallAnalyzer.unwrapHighcharts = function () {

        if (!window.Highcharts) {
            return;
        }

        for (var i = 0, ie = wrapStack.length, wrap; i < ie; ++i) {
            wrap = wrapStack[i];
            wrap.obj[wrap.functionName] = wrap.property;
        }

    };

    /**
     * Prints the log into the console log.
     *
     * @param {function} filter
     * Optional filter function to select log items. Has to return true, if the
     * item should be part of the returned array.
     *
     * @return {void}
     */
    window.CallAnalyzer.printLog = function (filter) {

        // window.CallAnalyzer.deactivate();

        var log = window.CallAnalyzer.getLog(filter),
            logItem,
            logSpacing = '',
            logString = '';

        for (var i = 0, ie = log.length; i < ie; ++i) {
            logItem = log[i];
            if (logItem.stackDepth < logSpacing.length) {
                logSpacing = logSpacing.substring(0, logSpacing.length - 2);
                logString += '\n' + logSpacing + '}';
            } else if (logItem.stackDepth > logSpacing.length) {
                logSpacing += '  ';
                logString += ' {';
            }
            logString += '\n' + logSpacing;
            logString += (logItem.functionName || '<anonymous>') + '()';
        }

        if (logString.indexOf('{') >= 0) {
            logString += '\n}';
        }

        window.console.log(logString);

    };

}(this));
