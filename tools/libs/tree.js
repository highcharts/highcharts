/* *
 *
 *  Handles tree structure and old options structure.
 *
 *  Copyright (C) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


/* eslint-disable no-unused-expressions, no-use-before-define */


/* *
 *
 *  Imports
 *
 * */


const FS = require('node:fs');


/* *
 *
 *  Constants
 *
 * */


/**
 * Valid properties in a node doclet.
 * @type {Array<string>}
 */
const OPTION_DOCLET_PROPERTIES = [
    'defaultByProduct',
    'defaultvalue',
    'deprecated',
    'description',
    'exclude',
    'extends',
    'productdesc',
    'products',
    'requires',
    'samples',
    'see',
    'since',
    'type',
    'values'
];


/* *
 *
 *  Functions
 *
 * */


/**
 * Assign name information to each node meta.
 *
 * @param {TreeNode} node
 * Root node to assign names.
 *
 * @param {string} fullname
 * Full name of root node.
 */
function assignFullNames(node, fullname) {
    const meta = node.meta = node.meta || {};

    meta.fullname = meta.fullname || fullname;
    meta.name = meta.name || fullname.split('.').pop();

    const children = node.children || {};

    for (const child of Object.keys(children)) {
        assignFullNames(children[child], `${fullname}.${child}`);
    }

}


/**
 * Removes empty children and sort keys.
 *
 * @template {Options} T
 *
 * @param {T} tree
 * Options tree to clean up.
 *
 * @return {T}
 * Cleaned options tree.
 */
function cleanUpChildren(
    tree
) {
    const sortedKeys = Object.keys(tree).sort();
    const sortedChildren = {};

    /** @type {TreeNode} */
    let node;

    for (const name of sortedKeys) {
        node = tree[name];
        if (node.doclet) {
            const sortedDoclet = {};
            for (const property of Object.keys(node.doclet).sort()) {
                if (property !== 'exclude') {
                    sortedDoclet[property] = node.doclet[property];
                }
                delete node.doclet[property];
            }
            node.doclet = sortedDoclet;
        }
        if (node.meta) {
            const sortedMeta = {};
            for (const property of Object.keys(node.meta).sort()) {
                sortedMeta[property] = node.meta[property];
                delete node.meta[property];
            }
            node.meta = sortedMeta;
        }
        if (node.children) {
            if (!Object.keys(node.children).length) {
                delete node.children;
            } else {
                node.children = cleanUpChildren(node.children);
            }
        }
        sortedChildren[name] = node;
        delete tree[name];
    }

    return sortedChildren;
}


/**
 * Create a clone of option node.
 *
 * @param {Option} sourceOption
 * Option node to clone.
 *
 * @param {string} fullname
 * Full name of clone.
 *
 * @return {Option}
 * Clone of option node.
 */
function cloneTreeNode(sourceOption, fullname) {
    const sourceChildren = sourceOption.children;
    const sourceDoclet = sourceOption.doclet;
    const sourceMeta = sourceOption.meta;
    /** @type {OptionDoclet} */
    const targetDoclet = {};
    /** @type {OptionMeta} */
    const targetMeta = {};
    /** @type {Option} */
    const targetOption = {
        doclet: targetDoclet,
        meta: targetMeta
    };

    for (const property of Object.keys(sourceDoclet)) {
        if (typeof sourceDoclet[property] === 'object') {
            if (sourceDoclet[property] instanceof Array) {
                targetDoclet[property] = sourceDoclet[property].slice();
            } else {
                targetDoclet[property] =
                    Object.assign({}, sourceDoclet[property]);
            }
        } else {
            targetDoclet[property] = sourceDoclet[property];
        }
    }

    for (const property of Object.keys(sourceMeta)) {
        if (typeof sourceMeta[property] === 'object') {
            if (sourceMeta[property] instanceof Array) {
                targetMeta[property] = sourceMeta[property].slice();
            } else {
                targetMeta[property] = Object.assign({}, sourceMeta[property]);
            }
        } else {
            targetMeta[property] = sourceMeta[property];
        }
    }

    if (
        sourceChildren &&
        Object.keys(sourceChildren).length
    ) {
        /** @type {Record<string,TreeNode>} */
        const targetChildren = targetOption.children = {};

        for (const child of Object.keys(sourceChildren)) {
            targetChildren[child] = cloneTreeNode(
                sourceChildren[child],
                `${fullname}.${child}`
            );
        }
    }

    return targetOption;
}


/**
 * Extend target option with information from source option.
 *
 * @param {Option} sourceOption
 * Source option node.
 *
 * @param {Option} targetOption
 * Target option node.
 */
function extendTreeNode(sourceOption, targetOption) {

    if (!sourceOption || !targetOption) {
        return;
    }

    const sourceDoclet = sourceOption.doclet;
    const sourceName = sourceOption.meta.fullname;
    const targetDoclet = targetOption.doclet;

    if (
        !sourceDoclet ||
        !targetDoclet ||
        !Object.keys(sourceDoclet).length
    ) {
        return;
    }

    for (const property of OPTION_DOCLET_PROPERTIES) {
        if (
            !sourceDoclet[property] ||
            property === 'defaultByProduct' ||
            property === 'defaultvalue' ||
            (
                !sourceName.startsWith('plotOptions') &&
                property === 'see'
            )
        ) {
            continue;
        }
        if (
            property === 'exclude' &&
            targetDoclet.exclude
        ) {
            targetDoclet.exclude = Array.from(new Set([].concat(
                targetDoclet.exclude,
                sourceDoclet.exclude
            )).entries());
        }
        if (
            property === 'type' &&
            targetDoclet.type
        ) {
            targetDoclet.type.names = Array.from(new Set([].concat(
                targetDoclet.type.names,
                sourceDoclet.type.names
            )).entries());
        }
        if (targetDoclet[property]) {
            continue;
        }
        if (sourceDoclet[property] instanceof Array) {
            targetDoclet[property] = sourceDoclet[property].slice();
        } else if (typeof sourceDoclet[property] === 'object') {
            targetDoclet[property] = Object.assign({}, sourceDoclet[property]);
        } else {
            targetDoclet[property] = sourceDoclet[property];
        }
    }

    if (
        !sourceOption.children ||
        !Object.keys(sourceOption.children).length
    ) {
        return;
    }

    const sourceChildren = sourceOption.children || {};
    const targetChildren = targetOption.children = targetOption.children || {};
    const targetExclude = targetDoclet.exclude || [];

    for (const name in sourceChildren) {
        if (targetExclude.includes(name)) {
            continue;
        }
        if (targetChildren[name]) {
            extendTreeNode(
                sourceChildren[name],
                targetChildren[name]
            );
        } else {
            targetChildren[name] = cloneTreeNode(
                sourceChildren[name],
                `${targetOption.meta.fullname}.${name}`
            );
        }
    }

}


/**
 * Extend tree node based on `extends` information.
 *
 * @param {Options} tree
 * Option tree to extend from.
 *
 * @param {Option} option
 * Option node to extend.
 */
function extendTreeNodes(
    tree,
    option
) {
    const doclet = option.doclet;

    if (doclet.extends) {
        for (const ext of doclet.extends.split(',')) {
            doclet.extends = doclet.extends.substring(ext + 1);
            extendTreeNode(getTreeNode(tree, ext.trim()), option);
        }
        delete doclet.extends;
    }

    const children = option.children;

    if (children) {
        for (const child of Object.keys(children)) {
            extendTreeNodes(tree, children[child]);
        }
    }

}

/**
 * Retrieves a node from the tree.
 *
 * @param {Options} tree
 * Tree root to walk on.
 *
 * @param {string} nodePath
 * Node path to retrieve.
 *
 * @return {Option|undefined}
 * Option or `undefined`, if not found.
 */
function getTreeNode(
    tree,
    nodePath
) {

    if (!nodePath) {
        return void 0;
    }

    if (nodePath === 'series') {
        nodePath = 'plotOptions.series';
    }

    /** @type {TreeNodeDoclet} */
    let doclet;
    /** @type {TreeNode} */
    let node = {
        doclet: {},
        meta: {},
        children: tree
    };

    for (const name of nodePath.split('.')) {

        if (
            !node.children ||
            !node.children[name]
        ) {
            return void 0;
        }

        node = node.children[name];
        doclet = node.doclet;

        if (doclet.extends) {
            for (const ext of doclet.extends.split(',')) {
                doclet.extends = doclet.extends.substring(ext.length + 1);
                extendTreeNode(getTreeNode(tree, ext.trim()), node);
            }
            delete doclet.extends;
        }

    }

    return node;
}


/**
 * Loads and autocompletes the options tree.
 *
 * @return {Options}
 * Option tree.
 */
function loadOptionsTree() {
    /** @type {Options} */
    const tree = JSON.parse(FS.readFileSync('tree.json', 'utf8'));

    /* eslint-disable-next-line no-underscore-dangle */
    delete tree._meta;

    for (const child of Object.keys(tree)) {
        assignFullNames(tree[child], child);
    }

    for (const child of Object.keys(tree)) {
        extendTreeNodes(tree, tree[child]);
    }

    return cleanUpChildren(tree);
}


/**
 * Sorts tree nodes in alphabetical order except for arrays, which follow last.
 *
 * @template {*} T
 *
 * @param {T} jsonTree
 * Tree to sort.
 *
 * @return {T}
 * New sorted tree.
 */
function sortJSONTree(
    jsonTree
) {
    const newTree = {};
    const follows = {};

    for (const key of Object.keys(jsonTree).sort()) {
        if (typeof jsonTree[key] === 'object') {
            if (
                key === 'children' ||
                jsonTree[key] === null
            ) {
                newTree[key] = jsonTree[key];
            } else {
                follows[key] = (
                    jsonTree[key].constructor === Object ?
                        sortJSONTree(jsonTree[key]) :
                        jsonTree[key]
                );
            }
        } else {
            newTree[key] = jsonTree[key];
        }
    }

    for (const key of Object.keys(follows)) {
        newTree[key] = follows[key];
    }

    return newTree;
}


/**
 * Converts any tree to a JSON string, while converting TypeScript nodes to raw
 * code.
 *
 * @param {*} jsonTree
 * Tree to convert.
 *
 * @param {number|string} [indent]
 * Indent option.
 *
 * @return {string}
 * Converted JSON string.
 */
function toJSONString(
    jsonTree,
    indent
) {

    if (typeof indent === 'number') {
        indent = ''.padEnd(indent, ' ');
    }

    return JSON.stringify(
        jsonTree,
        (_key, value) => (
            (
                value &&
                typeof value === 'object' &&
                typeof value.kind === 'number' &&
                typeof value.getText === 'function'
            ) ?
                value.getText() :
                value
        ),
        indent
    );
}


/* *
 *
 *  Default Export
 *
 * */


module.exports = {
    getTreeNode,
    loadOptionsTree,
    sortJSONTree,
    toJSONString
};


/* *
 *
 *  Doclet Declarations
 *
 * */

/**
 * @typedef {Record<string,Option>} Options
 */

/**
 * @typedef Option
 * @property {Options} [children]
 * @property {OptionDoclet} doclet
 * @property {OptionMeta} meta
 */

/**
 * @typedef OptionDoclet
 * @property {string} [declare]
 * @property {boolean|null|number|string} [defaultvalue]
 * @property {string} [description]
 * @property {Array<string>} [exclude]
 * @property {string} [extends]
 * @property {Array<Record<string,string>>} [productdescs]
 * @property {Array<string>} [requires]
 * @property {Array<Record<string,string>>} [samples]
 * @property {Array<string>} [see]
 * @property {string} [since]
 * @property {Record<string,Array<string>>} [type]
 */

/**
 * @typedef OptionMeta
 * @property {string} [default]
 * @property {string} fullname
 * @property {string} name
 */

('');
