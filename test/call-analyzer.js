/* eslint no-console: 0, no-extend-native: 0 */
(function (window) {

    var applyLogger,
        callLogger,
        originalApply = Function.prototype.apply,
        originalCall = Function.prototype.call,
        printLive = false,
        stackDepth = 0,
        stackLog = [];

    /**
     * The internal logger for function applies.
     *
     * @return {any}
     * The return value of the applied function.
     */
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

    /**
     * The internal logger for function calls.
     *
     * @return {any}
     * The return value of the called function.
     */
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
     */
    window.CallAnalyzer.activate = function (live) {
        stackDepth = 0;
        printLive = live;
        Function.prototype.apply = applyLogger;
        Function.prototype.call = callLogger;
    };

    /**
     * Turns the logging of function calls off.
     *
     * @return {void}
     */
    window.CallAnalyzer.deactivate = function () {
        Function.prototype.apply = originalApply;
        Function.prototype.call = originalCall;
        printLive = false;
        stackDepth = 0;
    };

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

        window.CallAnalyzer.deactivate();

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
     * Prints the log into the console log.
     *
     * @param {function} filter
     * Optional filter function to select log items. Has to return true, if the
     * item should be part of the returned array.
     *
     * @return {void}
     */
    window.CallAnalyzer.printLog = function (filter) {

        window.CallAnalyzer.deactivate();

        var log = window.CallAnalyzer.getLog(filter),
            logItem,
            logPrefix = '',
            logString = '';

        for (var i = 0, ie = log.length; i < ie; ++i) {
            logItem = log[i];
            if (logItem.stackDepth < logPrefix.length) {
                logPrefix = (
                    logItem.stackDepth < 1 ? '' :
                    logPrefix.substr(logPrefix.length - logItem.stackDepth)
                );
            } else if (logItem.stackDepth > logPrefix.length) {
                logPrefix = (logPrefix.length < 1 ? '∟' : ' ' + logPrefix);
            }
            logString += '\n' + logPrefix + (logItem.name || '<anonymous>');
        }

        window.console.log(logString);
    };

}(this));
