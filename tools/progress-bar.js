/* eslint-env node, es6 */
/* eslint-disable func-style */

'use strict';
const logUpdate = require('log-update');
const ProgressBar = function (user) {
    const getBar = (options) => {
        const length = options.length;
        const percentage = options.count / options.total;
        const chars = Math.floor(percentage * length);
        return options.complete.repeat(chars) + options.incomplete.repeat(length - chars);
    };
    const getMsg = (options) => {
        const protectedKeys = ['message', 'bar'];
        const reduceFn = (msg, key) => (
            protectedKeys.includes(key) ?
            msg :
            msg.replace(`:${key}`, options[key])
        );
        return Object.keys(options)
            .reduce(reduceFn, options.message.replace(':bar', getBar(options)));
    };
    const options = Object.assign({
        count: 0,
        complete: '=',
        incomplete: '-',
        length: 30,
        message: '[:bar] - :count of :total',
        total: 100
    }, user);
    this.render = () => {
        logUpdate(getMsg(options));
    };
    this.complete = function () {
        this.tick = () => {};
        logUpdate.done();
    };
    this.tick = function (editOptions = {}) {
        options.count++;
        Object.assign(options, editOptions);
        this.render();
        if (options.count === options.total) {
            this.complete();
        }
    };
    this.render();
    return this;
};

module.exports = ProgressBar;
