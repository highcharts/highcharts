/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, valid-jsdoc:0 */
/* eslint-disable func-style */
'use strict';

/*
 * Script to compare two different tree.json versions.
 * Use to verifiy that a generated API isn't missing half its options.
 *
 */

const path = require('path');
const url = require('url');
const fs = require('fs');
const args = process.argv;
const defaultInput = path.join(__dirname, '/../', 'tree.json');

// /////////////////////////////////////////////////////////////////////////////

/*
 * Flatten a tree to {'path.to.option'} style
 */
const flatten = input => {
    let res = {};

    /*
         * Visit a single node
         */
    const visit = (node, name, pname) => {
        let index = (pname && pname.length ? pname + '.' : '') + name;

        if (res[index]) {
            console.log('WARN: found dupe node!'.red, index);
        }

        res[index] = node;

        Object.keys(node.children || {}).forEach(childName => {
            visit(
                node.children[childName],
                childName,
                (pname && pname.length ? pname + '.' : '') + name
            );
        });
    };

    Object.keys(input).forEach(id => {
        if (id !== '_meta') {
            visit(input[id], id, '');
        }
    });

    return {
        meta: input._meta, // eslint-disable-line no-underscore-dangle
        nodes: res
    };
};

/**
 * Do a compare
 */
const compare = (comparePath, inputPath) => {
    console.log('');

    console.log(
        'Comparing',
        inputPath.bold,
        '(input)'.gray,
        'to',
        comparePath.bold,
        '(reference)'.gray
    );

    console.log('');

    let compareTree = false;
    let inputTree = false;

    try {
        compareTree = JSON.parse(fs.readFileSync(comparePath, 'utf8'));
    } catch (e) {
        console.log('when loading comparission tree:'.red, e);
        return false;
    }

    try {
        inputTree = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    } catch (e) {
        console.log('when loading new tree:'.red, e);
        return false;
    }

    compareTree = flatten(compareTree);
    inputTree = flatten(inputTree);

    let report = {
        inputCount: Object.keys(inputTree.nodes).length,
        compareCount: Object.keys(compareTree.nodes).length,
        warnings: 0,
        errors: 0,
        augmented: 0
    };

    const getURL = (node, tree) => {
        if (!node.meta || !node.meta.filename) {
            return '????';
        }

        return url
            .format(
                'https://github.com/highcharts/highcharts/blob/' +
                    tree.meta.commit +
                    '/' +
                    node.meta.filename.replace('highcharts', '') +
                    '#L' +
                    node.meta.line +
                    '-#L' +
                    node.meta.lineEnd
            )
            .replace(/\/\//g, '/')
            .replace('https:/', 'https://');
    };

    const warn = (cnode, tnode, id, ...things) => {
        console.log(
            ['WARNING:'].concat(things).join(' ').yellow,
            ':',
            id.bold.blue,
            '\n    ',
            'source: '.gray + getURL(tnode, inputTree).bold,
            '\n    ',
            'ref:    '.gray + getURL(cnode, compareTree).bold
        );
        ++report.warnings;
    };

    // Disable the no-unused rule here so we can actually do a non-verbose mode..
    const augmented = (id, ...things) => { // eslint-disable-line no-unused-vars
        // console.log(
        //  'Augmented'.gray,
        //  (id + ':').gray,
        //  things.join(' ').gray
        // );

        ++report.augmented;
    };

    Object.keys(compareTree.nodes).forEach(id => {
        let cnode = compareTree.nodes[id];

        if (typeof inputTree.nodes[id] === 'undefined') {
            console.log(
                'ERROR: missing option:'.red,
                id.bold.blue,
                '\n    last seen at',
                getURL(cnode, compareTree).bold
            );
            ++report.errors;
        } else {
            // Do a proper compare
            let tnode = inputTree.nodes[id];

            cnode.doclet = cnode.doclet || {};
            tnode.doclet = tnode.doclet || {};

            if (cnode.doclet.type && !tnode.doclet.type) {
                warn(cnode, tnode, id, 'reference has type, new version does not');
            }

            if (cnode.doclet.samples && !tnode.doclet.samples) {
                warn(cnode, tnode, id, 'reference has samples, new version does not');
            }

            if (
                cnode.doclet.description &&
                cnode.doclet.description.length &&
                (!tnode.doclet.description || !tnode.doclet.description.length)
            ) {
                warn(
                    cnode,
                    tnode,
                    id,
                    'reference has description, new version does not'
                );
            }

            if (!cnode.doclet.description || !cnode.doclet.description.length) {
                if (tnode.doclet.description && tnode.doclet.description.length) {
                    augmented(id, 'got a description');
                }
            }

            if (!cnode.doclet.type && tnode.doclet.type) {
                augmented(id, 'got a type definition');
            }

            if (
                (!cnode.doclet.samples && tnode.doclet.samples) ||
                (!cnode.doclet.sample && tnode.doclet.sample)
            ) {
                augmented(id, 'got sample(s)');
            }

            if (!cnode.doclet.products && tnode.doclet.products) {
                augmented(id, 'got product filter');
            }

            if (
                typeof cnode.doclet.defaultvalue === 'undefined' &&
                typeof tnode.doclet.defaultvalue !== 'undefined'
            ) {
                augmented(id, 'got a doclet-defined default value');
            }

            if (
                Object.keys(cnode.children).length &&
                !Object.keys(tnode.children).length
            ) {
                warn(cnode, tnode, id, 'reference has children, new version does not');
            }
        }
    });

    let missing = report.compareCount - report.inputCount;

    if (report.augmented) {
        console.log(
            ('' + report.augmented).bold,
            'augmentations/changes detected in the new API tree.'
        );
    }

    if (missing > 0) {
        console.log(
            'There is a difference of',
            ('' + missing).bold.red,
            'in option counts! Deploying the new API is',
            'NOT'.red,
            'recommended!'
        );
    }

    if (missing <= 0) {
        if (report.errors === 0 && report.warnings === 0) {
            console.log(
                'Everything is OK!'.green,
                'All options are there, nodes are ok, and',
                'the reference should be replaced with the new API!',
                '\n    ',
                (report.inputCount +
                    ' options in input, ' +
                    report.compareCount +
                    ' options in reference').gray
            );

            return true;
        }

        console.log(
            'Something is not right. Please check the error/warning output'
        );
    }

    console.log(
        'Comparisson finished with',
        ('' + report.warnings).yellow,
        'warnings, and',
        ('' + report.errors).red,
        'errors'
    );

    console.log('');

    return false;
};

// /////////////////////////////////////////////////////////////////////////////

require('colors');

if (args.length < 2) {
    console.log(
        'Usage:'.bold,
        'compare-api.js',
        '<path/to/reference/tree.json>',
        '[tree.json]'
    );
} else {
    let comparePath = args[2];
    let inputPath = args[3] || defaultInput;

    if (!compare(comparePath, inputPath)) {
        throw 'mismatches';
    }
}
