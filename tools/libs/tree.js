/* *
 *
 *  Handles old option structure.
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
const DOCLET_PROPERTIES = [
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
 * Create a clone of option node.
 *
 * @param {TreeNode} sourceNode
 * Option node to clone.
 *
 * @param {string} fullname
 * Full name of clone.
 *
 * @return {TreeNode}
 * Clone of option node.
 */
function cloneTreeNode(sourceNode, fullname) {
    const sourceChildren = sourceNode.children;
    const sourceDoclet = sourceNode.doclet;
    const sourceMeta = sourceNode.meta;
    /** @type {TreeNodeDoclet} */
    const targetDoclet = {};
    /** @type {TreeNodeMeta} */
    const targetMeta = {};
    /** @type {TreeNode} */
    const targetNode = {
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
        const targetChildren = targetNode.children = {};

        for (const child of Object.keys(sourceChildren)) {
            targetChildren[child] = cloneTreeNode(
                sourceChildren[child],
                `${fullname}.${child}`
            );
        }
    }

    return targetNode;
}


/**
 * Extend target option with information from source option.
 *
 * @param {TreeNode} sourceNode
 * Source option node.
 *
 * @param {TreeNode} targetNode
 * Target option node.
 */
function extendTreeNode(sourceNode, targetNode) {

    if (!sourceNode || !targetNode) {
        return;
    }

    const sourceDoclet = sourceNode.doclet;
    const sourceName = sourceNode.meta.fullname;
    const targetDoclet = targetNode.doclet;

    if (
        !sourceDoclet ||
        !targetDoclet ||
        !Object.keys(sourceDoclet).length
    ) {
        return;
    }

    for (const property of DOCLET_PROPERTIES) {
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
        !sourceNode.children ||
        !Object.keys(sourceNode.children).length
    ) {
        return;
    }

    const sourceChildren = sourceNode.children || {};
    const targetChildren = targetNode.children = targetNode.children || {};
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
                `${targetNode.meta.fullname}.${name}`
            );
        }
    }

}


/**
 * Extend tree node based on `extends` information.
 *
 * @param {Tree} tree
 * Option tree to extend from.
 *
 * @param {TreeNode} node
 * Option node to extend.
 */
function extendTreeNodes(
    tree,
    node
) {
    const doclet = node.doclet;

    if (doclet.extends) {
        for (const ext of doclet.extends.split(',')) {
            doclet.extends = doclet.extends.substring(ext + 1);
            extendTreeNode(getTreeNode(tree, ext.trim()), node);
        }
        delete doclet.extends;
    }

    const children = node.children;

    if (children) {
        for (const child of Object.keys(children)) {
            extendTreeNodes(tree, children[child]);
        }
    }

}

/**
 * Retrieves a node from the tree.
 *
 * @param {Record<string,TreeNode>} tree
 * Tree root to walk on.
 *
 * @param {string} nodePath
 * Node path to retrieve.
 *
 * @return {TreeNode|undefined}
 * TreeNode or `undefined`, if not found.
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
 * @return {Tree}
 * Option tree.
 */
function loadOptionsTree() {
    /** @type {Tree} */
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
 * Removes empty children and sort keys.
 *
 * @param {Tree} tree
 * Option tree to clean up.
 *
 * @return {Tree}
 * Cleaned option tree.
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


/* *
 *
 *  Default Export
 *
 * */


module.exports = {
    getTreeNode,
    loadOptionsTree
};


/* *
 *
 *  Doclet Declarations
 *
 * */

/**
 * @typedef {Record<string,TreeNode>} Tree
 */

/**
 * @typedef TreeNode
 * @property {Tree} [children]
 * @property {TreeNodeDoclet} doclet
 * @property {TreeNodeMeta} meta
 */

/**
 * @typedef TreeNodeMeta
 * @property {string} [default]
 * @property {string} fullname
 * @property {string} name
 */

/**
 * @typedef TreeNodeDoclet
 * @property {string} [declare]
 * @property {boolean|null|number|string} [defaultvalue]
 * @property {string} [description]
 * @property {Array<string>} [exclude]
 * @property {string} [extends]
 * @property {Array<string>} [requires]
 * @property {Array<Record<string,string>>} [samples]
 * @property {Array<string>} [see]
 * @property {string} [since]
 * @property {Record<string,Array<string>>} [type]
 */

('');
