/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const log = require('./lib/log.js');

/* eslint-disable no-use-before-define */

/* *
 *
 *  Functions
 *
 * */

/**
 * Compares two sets of node children
 *
 * @param {Array<object>} oldChildren
 * Old node children
 *
 * @param {Array<object>} newChildren
 * New node children
 *
 * @param {string} path
 * Full node path
 *
 * @return {void}
 */
function compareChildren(oldChildren, newChildren, path) {

    const keys = Array.from(new Set(Object.keys(oldChildren).concat(Object.keys(newChildren))));

    let key;

    for (let i = 0, ie = keys.length; i < ie; ++i) {

        key = keys[i];

        compareNode(
            oldChildren[key],
            newChildren[key],
            path ? `${path}.${key}` : key
        );
    }
}

/**
 * Compares two tree nodes.
 *
 * @param {object} oldNode
 * Old node
 *
 * @param {object} newNode
 * New node
 *
 * @param {string} path
 * Full node path
 *
 * @return {void}
 */
function compareNode(oldNode, newNode, path) {

    if (!oldNode) {
        log.warn(`CREATE: ${path}`);
        return;
    }

    if (!newNode) {
        log.failure(`DELETE: ${path}`);
        return;
    }

    const oldDoclet = (oldNode.doclet || {});
    const newDoclet = (newNode.doclet || {});

    if (oldDoclet.description !== newDoclet.description) {
        log.warn(`CHANGE: ${path} [description]`);
    }

    if (JSON.stringify(oldDoclet.products) !== JSON.stringify(newDoclet.products)) {
        log.warn(`CHANGE: ${path} [products]`);
    }

    if (JSON.stringify(oldDoclet.type) !== JSON.stringify(newDoclet.type)) {
        log.warn(`CHANGE: ${path} [type]`);
    }

    compareChildren((oldNode.children || {}), (newNode.children || {}), path);
}

/**
 * Loads the new tree.json.
 *
 * @return {Promise<object>}
 * JSON object
 */
function loadNewTree() {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const fs = require('fs').promises;

    log.message('Loading new tree.json...');

    return fs
        .readFile('tree.json')
        .then(newTree => {

            log.message('Parsing new tree.json...');

            return JSON.parse(newTree);
        });
}

/**
 * Loads the old tree.json.
 *
 * @return {Promise<object>}
 * JSON object
 */
function loadOldTree() {
    const request = require('request');

    return new Promise((resolve, reject) => {
        log.message('Loading old tree.json...');
        request.get(
            'https://api.highcharts.com/highcharts/tree.json',
            function (error, response) {

                if (error) {
                    reject(error);
                    return;
                }

                log.message('Parsing old tree.json...');

                resolve(JSON.parse(response.body.toString()));
            }
        );

    });
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Run the test suite.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
function testTree() {
    return Promise
        .all([
            loadOldTree(),
            loadNewTree()
        ])
        .then(trees => {
            const [
                oldTree,
                newTree
            ] = trees;

            /* eslint-disable no-underscore-dangle */
            delete oldTree._meta;
            delete newTree._meta;
            /* eslint-enable no-underscore-dangle */

            log.message('Comparing trees...');
            compareChildren(oldTree, newTree);
            log.message('Done.');
        })
        .catch(error => {

            log.failure(error);

            return error;
        });
}

gulp.task('test-tree', testTree);
