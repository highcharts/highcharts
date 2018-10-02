/* eslint-disable */
/* eslint-env node,es6 */
/**
 * @module plugins/highcharts.namespace.js
 * @author Sophie Bremer
 * @author e-cloud
 */

/* *
 *
 *  Requires
 * 
 * */

const childProcess = require('child_process');
const deepEqual = require('fast-deep-equal');
const fs = require('fs');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const rootPath = process.cwd();

/* *
 *
 *  Variables
 *
 * */

let allDocletPropertyNames = [],
    apiOptionMembers = [],
    currentFilePath = '',
    globalNamespace = {},
    privateMembers = [];

/* *
 *
 *  Is Functions
 *
 * */

/**
 * Returns true, if the doclet is part of the Highcharts options.
 *
 * @private
 * @function isApiOption
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet to analyze.
 *
 * @return {boolean}
 *         True, if the doclet is from a Highcharts option.
 */
function isApiOption (doclet) {

    let name = getName(doclet),
        comment = (doclet.comment || ''),
        isApiOption = (
            name.indexOf('Highcharts') !== 0 &&
            (
                comment.indexOf('@apioption') >= 0 ||
                comment.indexOf('@optionparent') >= 0 ||
                comment.indexOf('@ignore-option') >= 0 ||
                (
                    !doclet.undocumented &&
                    doclet.kind === 'member' &&
                    (
                        doclet.children ||
                        doclet.scope === 'global'
                    )
                )
            )
        );

    if (isApiOption) {
        apiOptionMembers.push(name);
        return true;
    } else {
        // looking for a parent option
        return (apiOptionMembers.some(member => name.indexOf(member) === 0));
    }
}

/**
 * Compares two light doclets for basic equality.
 *
 * @param {JSDoclet} docletA
 *        First ligh doclet to analyze.
 *
 * @param {JSDoclet} docletB
 *        Second light doclet to analyze.
 *
 * @return {boolean}
 *         True, if the doclet is basically equal.
 */
function isEqual (docletA, docletB) {

    return (
        typeof docletA === typeof docletB &&
        typeof docletA.name === typeof docletB.name &&
        docletA.name === docletB.name &&
        (
            Object.keys(docletA).length == 1 ||
            Object.keys(docletB).length == 1 ||
            deepEqual(docletA, docletB)
        )
    );
}

/**
 * Returns true, if the doclet is a global member.
 *
 * @private
 * @function isGlobal
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet to analyze.
 * 
 * @return {boolean}
 *         True, if the doclet is a global member.
 */
function isGlobal (doclet) {

    return (doclet.scope === 'global');
}

/**
 * Returns true, if a doclet with the same full name has already been added.
 *
 * @private
 * @function
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet to analyze.
 *
 * @return {boolean}
 *         True, if a similar doclet has been added.
 */
function isOverload (doclet) {

    let name = getName(doclet),
        existingNode = getNodeFor(name, undefined, true);

    if (!existingNode) {
        return false;
    }

    let kind = doclet.kind;

    switch (kind) {
        default:
            return false;
        case 'class':
        case 'constructor':
        case 'function':
            break;
    }

    if (kind === 'constructor') {

        existingNode = getNodeFor(name + '.constructor', undefined, true);

        if (!existingNode) {
            return false;
        }
    }

    let existingDoclet = existingNode.doclet;

    return (
        !!existingDoclet &&
        existingDoclet.kind === kind &&
        !!doclet.params &&
        doclet.params.length > 0
    );
}

/**
 * Returns true, if the doclet is part of a private member tree.
 *
 * @private
 * @function isPrivate
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet to analyze.
 *
 * @return {boolean}
 *         True, if the doclet is a part of a private member tree.
 */
function isPrivate (doclet) {

    let name = getName(doclet),
        isPrivate = (
            doclet.ignore ||
            doclet.name[0] === '_' ||
            name.indexOf('~') > -1
        );

    if (isPrivate) {
        privateMembers.push(name);
        return true;
    } else {
        // looking for a parent member that is private
        return (privateMembers.some(member => (name.indexOf(member) === 0)));
    }
}

/**
 * Returns true, if the doclet is a static member.
 *
 * @private
 * @function isStatic
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet to analyze.
 *
 * @return {boolean}
 *         True, if the doclet is a static member.
 */
function isStatic (doclet) {

    return (doclet.scope === 'static');
}

/**
 * Returns true, if the doclet in undocumented.
 *
 * @private
 * @function isUndocumented
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet to analyze.
 *
 * @return {boolean}
 *         True, if the doclet is undocumented.
 */
function isUndocumented (doclet) {

    return (
        doclet.undocumented ||
        doclet.comment.indexOf('(c)') > -1
    );
}

/* *
 *
 *  Get Functions
 *
 * */

/**
 * Removes unnecessary name fragments
 *
 * @private
 * @function getClearName
 *
 * @param {string} name
 *        Name to filter.
 *
 * @return {string}
 *         Filtered name.
 */
function getClearName (name) {

    if (!name) {
        return '';
    } else {
        return name
            .replace('~<anonymous>~', '~')
            .replace('~<anonymous>', '')
            .replace('<anonymous>~', '')
            .replace('~', '.')
            .replace('#', '.');
    }
}

/**
 * Returns the description of the doclet.
 *
 * @private
 * @function getDescription
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {string}
 *         Description of the doclet.
 */
function getDescription (doclet) {

    if (doclet.highchartsDescription) {
        return doclet.highchartsDescription;
    }

    let description = doclet.description;

    if (!description) {

        description = doclet.comment;

        if (!description) {
            return '';
        }

        let tagPosition = description.indexOf(' @');

        if (tagPosition >= 0) {
            description = description.substr(0, tagPosition + 1);
        }

        description = description.replace(/\/?\*\/?/gm, '');
    }

    description = description.replace(/\s+/gm, ' ');
    description = description.trim();

    if (description.indexOf('(c)') > -1) {
        // found only a file header with the copyright line
        return '';
    } else {
        doclet.highchartsDescription = description;
        return description;
    }
}

/**
 * Returns the emitted events in the doclet.
 *
 * @private
 * @function getEmits
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {Array<string>|undefined}
 *         Emitted events of the doclet.
 */
function getFires (doclet) {

    if (!doclet.fires) {
        return undefined;
    }

    return doclet.fires
        .slice()
        .map(eventName => eventName.replace('event:', ''));
}

/**
 * Returns the kind of the doclet.
 *
 * @private
 * @function getKind
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {string}
 *         Kind of the doclet.
 */
function getKind (doclet) {

    return (doclet.kind || 'member');
}

/**
 * Returns a light doclet object of the doclet.
 *
 * @private
 * @function getLightDoclet
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {NodeDoclet}
 *         Doclet information of the source.
 */
function getLightDoclet (doclet) {

    let lightDoclet = {
        description: getDescription(doclet),
        kind: getKind(doclet),
        name: getName(doclet)
    };

    if (typeof doclet.deprecated !== 'undefined') {
        lightDoclet.isDeprecated = true;
    }

    if (typeof doclet.optional !== 'undefined') {
        lightDoclet.isOptional = true;
    }

    if (typeof doclet.defaultvalue !== 'undefined') {
        lightDoclet.defaultValue = doclet.defaultvalue;
    }

    if (typeof doclet.products !== 'undefined') {
        lightDoclet.products = doclet.products;
    }

    if (typeof doclet.values !== 'undefined') {
        lightDoclet.values = doclet.values;
    }

    if (typeof doclet.see !== 'undefined') {
        lightDoclet.see = doclet.see;
    }

    if (isGlobal(doclet)) {
        lightDoclet.isGlobal = true;
    } else if (isPrivate(doclet)) {
        lightDoclet.isPrivate = true;
    }

    switch (lightDoclet.kind) {
        case 'function':
        case 'member':
            if (isStatic(doclet)) {
                lightDoclet.isStatic = true;
            }
            break;
    }

    return lightDoclet;
}

/**
 * Returns a ligh meta object of the doclet.
 *
 * @private
 * @function getLightMeta
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {NodeMeta}
 *         Meta information of the source.
 */
function getLightMeta (doclet) {

    let meta = (doclet.meta || {}),
        line = (meta.lineno || 0);

    return {
        files: [{
            path: currentFilePath,
            line: line
        }]
    };
}

/**
 * Returns the full name of the doclet.
 *
 * @private
 * @function getName
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {string}
 *         Full name.
 */
function getName (doclet) {

    if (doclet.highchartsName) {
        return doclet.highchartsName;
    }

    let memberOf = getClearName(doclet.memberOf),
        name = getClearName(doclet.longname);

    try {

        if (memberOf) {
            name = memberOf + '.' + name;
        }

        if (name.indexOf('H.') === 0) {
            name = 'Highcharts.' + name.substr(2);
        } else if (name === 'H') {
            name = 'Highcharts';
        } else if (!isGlobal(doclet) &&
            name.indexOf('.') === -1 &&
            name.indexOf('global') !== 0 &&
            name.indexOf('Highcharts') !== 0
        ) {
            name = 'Highcharts.' + name;
        }

        return name;
    
    } finally {
        doclet.highchartsName = name;
    }
}

/**
 * Returns all components of the name.
 *
 * @private
 * @function getNamespaces
 *
 * @param {string} name
 *        Name with components.
 *
 * @return {Array<string>}
 *         The components of the name.
 */
function getNamespaces (name) {

    let subspace = (name.match(/(?:\<.+\>|\[\w+\:.+\])$/) || [])[0];

    if (subspace) {
        name = name.substr(0, (name.length - subspace.length));
    }

    let namespaces = name.split('.');

    if (subspace) {
        namespaces[namespaces.length-1] += subspace;
    }

    let fullSpace;

    return namespaces.map(space => {

        if (fullSpace) {
            fullSpace += '.' + space;
        }
        else {
            fullSpace = space;
        }

        return fullSpace;
    });
}

/**
 * Returns a node in a tree, or creates it.
 *
 * @private
 * @function getNodeFor
 *
 * @param {string} name
 *        The full qualified name for the node.
 *
 * @param {number} [overload]
 *        Create additional node, if number of parameters has not been found.
 *
 * @param {boolean} [searchOnly]
 *        Create no nodes at all.
 *
 * @return {Node}
 *         Node in the tree.
 */
function getNodeFor (name, overload, searchOnly) {

    let found = false,
        node = globalNamespace,
        spaceNames = getNamespaces(name),
        indexEnd = (spaceNames.length - 1);

    spaceNames.forEach((spaceName, index) => {

        if (!node) {
            return;
        }

        if (!node.children) {

            if (searchOnly) {
                node = undefined;
                return;
            }

            node.children = [];
        }

        found = node.children.some(child => {
            if (child.doclet &&
                child.doclet.name === spaceName && (
                !child.doclet.parameters ||
                typeof overload !== 'number' ||
                Object(child.doclet.parameters).length === overload
            )) {
                node = child;
                return true;
            }
            else {
                return false;
            }
        });

        if (found) {
            return;
        }

        if (searchOnly) {
            node = undefined;
        }
        else {
            let newNode = {
                doclet: {
                    name: spaceName
                }
            };

            node.children.push(newNode);

            node = newNode;
        }
    });

    return node;
}

/**
 * Returns a name-based dictionary with parameter description and types.
 *
 * @private
 * @function getParameters
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {Dictionary<Parameter>}
 *         Parameter dictionary.
 */
function getParameters (doclet) {

    if (!doclet.params) {
        return undefined;
    }

    let parameters = {};

    (doclet.params || []).forEach(item => {

        if (!item.name) {
            return;
        }

        parameters[item.name] = {};

        if (item.description) {
            parameters[item.name].description = item.description;
        }

        if (item.optional) {
            parameters[item.name].isOptional = true;
        }

        if (item.type) {
            parameters[item.name].types = item.type.names.slice();
        }
    });

    return parameters;
}

/**
 * Returns the possible return types of the doclet.
 *
 * @private
 * @function getReturn
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {Array<string>}
 *         Possible return types.
 */
function getReturn (doclet) {

    let returnObj = {
        types: []
    };

    (doclet.returns || []).forEach(item => {

        if (item.description) {
            returnObj.description = (
                (returnObj.description || '') + item.description
            );
        }

        if (item.type && item.type.names) {
            returnObj.types = (returnObj.types || []).concat(
                ...item.type.names.slice()
            );
        }
    });

    if (returnObj.types.length === 0) {
        returnObj.types.push('void');
    }

    return returnObj;
}

/**
 * Returns the possible types of the doclet.
 *
 * @private
 * @function getTypes
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {Array<string>}
 *         Possible types.
 */
function getTypes (doclet) {

    let types = (
        doclet &&
        doclet.type &&
        doclet.type.names
    );

    if (!types) {
        return (
            doclet.augments &&
            doclet.augments.slice()
        );
    }

    return types;
}

/**
 * Returns a merged array with unique items.
 *
 * @private
 * @function getUniqueArray
 *
 * @param {Array} array1
 *        First array to merge.
 *
 * @param {Array} array2
 *        Second array to merge.
 *
 * @return {Array}
 *         Merged array.
 */
function getUniqueArray(array1, array2) {

    return Array.from(new Set([].concat(...arguments)));
}

/* *
 *
 *  Update Functions
 * 
 * */

/**
 * Removes nodes without doclet from the tree.
 *
 * @private
 * @function filterNodes
 *
 * @param {Node} node 
 *        Root node.
 *
 * @return {void}
 */
function filterNodes (node) {

    if (!node.children) {
        return;
    }

    node.children = node.children.filter(child => (
        child.doclet &&
        (child.doclet.name === 'global' ||
        Object.keys(child.doclet).length > 1)
    ));

    node.children.forEach(filterNodes);
}

/**
 * Updates corresponding node in the tree with information from the doclet.
 *
 * @private
 * @function updateNodeFor
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @param {number} [overload]
 *        Create additional node, if number of parameters has not been found.
 *
 * @return {Node}
 *         Updated node.
 */
function updateNodeFor (doclet, overload) {

    let name = getName(doclet),
        node = getNodeFor(name),
        newDoclet = getLightDoclet(doclet),
        newMeta = getLightMeta(doclet),
        oldDoclet = node.doclet,
        oldMeta = node.meta;

    if (overload &&
        doclet.params &&
        !isEqual(oldDoclet, newDoclet)
    ) {
        node = getNodeFor(name, doclet.params.length);
        oldDoclet = node.doclet;
        oldMeta = node.meta;
    }

    if (!oldDoclet) {
        oldDoclet = node.doclet = newDoclet;
    } else {
        Object
            .keys(newDoclet)
            .filter(key =>
                key !== 'products' &&
                typeof oldDoclet[key] === 'undefined'
            )
            .forEach(key => oldDoclet[key] = newDoclet[key]);

        if (newDoclet.products) {

            let oldProducts = oldDoclet.products = (oldDoclet.products || []);

            oldProducts.push(...newDoclet.products.filter(product =>
                oldProducts.indexOf(product) === -1)
            );
        }
    }

    if (!oldMeta) {
        oldMeta = node.meta = newMeta;
    } else {
        Object
            .keys(newMeta)
            .filter(key =>
                key !== 'files' &&
                typeof oldMeta[key] === 'undefined'
            )
            .forEach(key => oldMeta[key] = newMeta[key]);

        if (newMeta.files) {

            let oldMetaFiles = oldMeta.files = (oldMeta.files || []),
                oldMetaFilePaths = oldMetaFiles.map(metaFile => metaFile.path);

            oldMetaFiles.push(...newMeta.files.filter(metaFile =>
                metaFile.path &&
                oldMetaFilePaths.indexOf(metaFile.path) === -1
            ));
        }
    }

    return node;
}

/* *
 *
 *  Add Functions
 * 
 * */

/**
 * Adds the doclet as a class node to the tree.
 *
 * @private
 * @function addClass
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addClass (doclet) {

    let node = updateNodeFor(doclet);

    if (doclet.params) {
        addConstructor(doclet);
    }
}

/**
 * Adds the doclet as a function node to the tree.
 *
 * @private
 * @function addConstructor
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addConstructor (doclet) {

    addFunction ({
        description: doclet.description,
        fires: doclet.fires,
        kind: 'constructor',
        longname: doclet.longname + '#constructor',
        name: 'constructor',
        params: doclet.params
    });
}

/**
 * Adds the doclet as a event node to the tree.
 *
 * @private
 * @function addEvent
 *
 * @param {JSDoclet} doclet
 *
 * @return {void}
 */
function addEvent (doclet) {

    let name = getName(doclet).replace('event:', ''),
        description = getDescription(doclet),
        types = getTypes(doclet),
        parentName = name,
        lastPoint = name.lastIndexOf('.');

    if (lastPoint === -1) {
        parentName = '';
    }
    else {
        name = name.substr(lastPoint + 1);
        parentName = parentName.substr(0, lastPoint);
    }

    let parentNode = getNodeFor(parentName),
        parentDoclet = parentNode.doclet = (parentNode.doclet || {}),
        events = parentDoclet.events = (parentDoclet.events || {});

    events[name] = {
        description: description,
        types: types
    };
}

/**
 * Adds the doclet as a global namespace node to the tree.
 *
 * @private
 * @function addExternal
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addExternal (doclet) {

    updateNodeFor(doclet);
}

/**
 * Adds the doclet as a function node to the tree.
 *
 * @private
 * @function addFunction
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addFunction (doclet) {

    let node = updateNodeFor(doclet, true),
        fires = getFires(doclet),
        parameters = getParameters(doclet),
        returns = getReturn(doclet),
        types = getTypes(doclet);

    if (fires) {
        node.doclet.fires = fires;
    }

    if (parameters) {
        node.doclet.parameters = parameters;
    }

    if (returns) {
        node.doclet.return = returns;
    }

    if (types) {
        node.doclet.types = types;
    }
}

/**
 * Adds the doclet as a interface node to the tree.
 *
 * @private
 * @function addInterface
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addInterface (doclet) {

    let node = updateNodeFor(doclet),
        types = getTypes(doclet);

    if (!node.doclet.parameters) {
        node.doclet.parameters = getParameters(doclet);
    }

    if (types) {
        node.doclet.types = types;
    }
}

/**
 * Adds the doclet as a member node to the tree.
 *
 * @private
 * @function addMember
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addMember (doclet) {

    let node = updateNodeFor(doclet);

    if (!node.doclet.types) {
        node.doclet.types = getTypes(doclet);
    }
}

/**
 * Adds the doclet as a namespace node to the tree.
 *
 * @private
 * @function addNamespace
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addNamespace (doclet) {

    let node = updateNodeFor(doclet);

    // the Highcharts namespaces should always be in every file
    if (node.doclet.name === 'Highcharts') {
        node.meta.files = globalNamespace.meta.files;
    }
}

/**
 * Adds the doclet as a type definition to the tree.
 *
 * @private
 * @function addTypeDef
 *
 * @param {JSDoclet} doclet
 *        JSDoc doclet source.
 *
 * @return {void}
 */
function addTypeDef (doclet) {

    let node = updateNodeFor(doclet);

    node.doclet.types = (getTypes(doclet) || [ '*' ]);

    if (doclet.params ||
        doclet.returns
    ) {
        node.doclet.parameters = getParameters(doclet);
        node.doclet.return = getReturn(doclet);
    }

    if (!doclet.properties) {
        return;
    }

    let name = getName(doclet);

    Object.values(doclet.properties).forEach(propertyDoclet => {

        if (propertyDoclet.name.indexOf(':') > 0) {
            propertyDoclet.longname = (name + '.[' + propertyDoclet.name + ']');
            delete propertyDoclet.optional;
        } else {
            propertyDoclet.longname = (name + '.' + propertyDoclet.name);
        }

        propertyDoclet.comment = propertyDoclet.description;
        propertyDoclet.kind = 'member';
        propertyDoclet.meta = doclet.meta;
        propertyDoclet.scope = 'inner';

        addMember(propertyDoclet);
    })
}

/* *
 *
 *  JSDoc Functions
 *
 *  Documentation: http://usejsdoc.org/about-plugins.html
 * 
 * */

/**
 * The parseBegin event is fired before JSDoc starts loading and parsing the
 * source files.
 *
 * @function parseBegin
 *
 * @param {Event} e
 *        JSDoc event.
 *
 * @return {void}
 */
function parseBegin (e) {

    globalNamespace.doclet = {
        description: 'Copyright (c) Highsoft AS. All rights reserved.',
        kind: 'global',
        name: ''
    };

    globalNamespace.meta = {
        branch: childProcess.execSync('git rev-parse --abbrev-ref HEAD', {cwd: rootPath}).toString().trim(),
        commit: childProcess.execSync('git rev-parse --short HEAD', {cwd: rootPath}).toString().trim(),
        date: (new Date()).toString(),
        files: [],
        version: require(rootPath  + '/package.json').version
    };
}

/**
 * The fileBegin event is fired when the parser is about to parse a file.
 *
 * @function fileBegin
 *
 * @param {Event} e
 *        JSDoc event.
 *
 * @return {void}
 */
function fileBegin (e) {

    currentFilePath = path.relative(rootPath, e.filename);
    globalNamespace.meta.files.push({
        path: currentFilePath,
        line: 0
    });
}

/**
 * The newDoclet event is fired when a new doclet has been created.
 *
 * @function newDoclet
 *
 * @param {Event} e
 *        JSDoc event.
 *
 * @return {void}
 */
function newDoclet (e) {

    let doclet = e.doclet;

    allDocletPropertyNames = getUniqueArray(
        allDocletPropertyNames,
        Object.keys(doclet)
    );

    if (isPrivate(doclet) ||
        isUndocumented(doclet)
    ) {
        return;
    }

    let kind = getKind(doclet);

    switch (kind) {
        default:
            console.error(
                'Unknown kind: ' + kind,
                doclet.longname
            );
            break;
        case 'class':
            addClass(doclet);
            break;
        case 'constructor':
            addConstructor(doclet);
            break;
        case 'event':
            addEvent(doclet);
            break;
        case 'external':
            addExternal(doclet);
            break;
        case 'function':
            addFunction(doclet);
            break;
        case 'interface':
            addInterface(doclet);
            break;
        case 'member':
            if (!isApiOption(doclet)) {
                addMember(doclet);
            }
            break;
        case 'namespace':
            addNamespace(doclet);
            break;
        case 'typedef':
            addTypeDef(doclet);
            break;
    }
}

/**
 * The fileComplete event is fired when the parser has finished parsing a file.
 *
 * @function fileComplete
 *
 * @param {Event} e
 *        JSDoc event.
 *
 * @return {void}
 */
function fileComplete (e) {

    currentFilePath = '';
}

/**
 * The processingComplete event is fired after JSDoc updates the parse results
 * to reflect inherited and borrowed symbols.
 *
 * @function processingComplete
 *
 * @param {Event} e
 *        JSDoc event.
 *
 * @return {void}
 */
function processingComplete (e) {

    filterNodes(globalNamespace);

    fs.writeFileSync(
        path.join(rootPath, 'tree-namespace.json'),
        JSON.stringify(globalNamespace, undefined, '\t')
    );
}

/**
 * Adding tags to the tag dictionary is a mid-level way to affect documentation
 * generation.
 *
 * @function defineTags
 *
 * @param {*} dictionary
 *        JSDoc tags dictionary.
 *
 * @return {void}
 */
exports.defineTags = function (dictionary) {

    dictionary.defineTag('private', {
        mustNotHaveValue: true,
        onTagged: (doclet) => doclet.ignore = true
    });

    dictionary.defineTag('product', {
        mustHaveValue: true,
        onTagged: (doclet, tag) => doclet.products =
            tag.value
                .split(',')
                .map(product => product.trim())
    });

    dictionary.defineTag('validvalue', {
        mustHaveValue: true,
        onTagged: (doclet, tag) => doclet.values = tag.value
    })

};

/**
 * JSDoc event handlers.
 *
 * @name handlers
 * @type {Dictionary<Function>}
 */
exports.handlers = {
    parseBegin: parseBegin,
    fileBegin: fileBegin,
    newDoclet: newDoclet,
    fileComplete: fileComplete,
    processingComplete: processingComplete
};
