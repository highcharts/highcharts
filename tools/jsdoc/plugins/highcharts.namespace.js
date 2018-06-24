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
    namespace = {},
    privateMembers = [];

/* *
 *
 *  Is Functions
 * 
 * */

function isApiOption (doclet) {

    let comment = doclet.comment,
        name = getName(doclet),
        isApiOption = (
            comment.indexOf('@default') >= 0 ||
            comment.indexOf('@product') >= 0 ||
            comment.indexOf('@apioption') >= 0 ||
            comment.indexOf('@optionparent') >= 0
        );

    if (isApiOption) {
        apiOptionMembers.push(name);
        return true;
    } else {
        return (apiOptionMembers.some(
            member => name.indexOf(member) === 0
        ));
    }
}

function isInstance (doclet) {

    if (doclet.scope === 'inner' ||
        doclet.scope === 'instance'
    ) {
        return true;
    }

    let name = getName(doclet);

    return (name.lastIndexOf('#') > name.lastIndexOf('.'));
}

function isPrivate (doclet) {

    let name = getName(doclet),
        privateFlag = (
            doclet.ignore ||
            doclet.name[0] === '_' ||
            name.indexOf('~') >= 0
        );

    if (privateFlag) {
        privateMembers.push(name);
        return true;
    } else {
        return (privateMembers.some(member => {
            return name.indexOf(member) === 0;
        }));
    }
}

function isStatic (doclet) {

    if (doclet.scope === 'static') {
        return true;
    }

    let name = getName(doclet);

    return (name.lastIndexOf('.') > name.lastIndexOf('#'));
}

function isUndocumented (doclet) {

    return (doclet.undocumented || !getDescription(doclet));
}

/* *
 *
 *  Get Functions
 *
 * */

function getClearName (name) {

    if (!name) {
        return '';
    } else {
        return name
            .replace('~<anonymous>~', '~')
            .replace('~<anonymous>', '')
            .replace('<anonymous>~', '')
            .replace('#', '.');
    }
}

function getDescription (doclet) {

    if (doclet.highchartsDescription) {
        return doclet.highchartsDescription;
    }

    let description = (doclet.description || '');

    if (description.indexOf('(c)') >= 0) {
        return '';
    }

    try {

        if (!description) {
            let comment = (doclet.comment || ''),
                tagPosition = comment.indexOf('@');

            if (tagPosition >= 0) {
                description = comment
                    .substr(0, tagPosition)
                    .replace(/\/\*\*| \* | *\//gm, '');
            }
        }

        description = description.replace(/\s+/gm, ' ');
        description = description.trim();

        return description;

    } finally {
        doclet.highchartsDescription = description;
    }
}

function getKind (doclet) {

    return (doclet.kind || 'member');
}

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

    if (isPrivate(doclet)) {
        lightDoclet.isPrivate = true;
    }

    if (isStatic(doclet)) {
        lightDoclet.isStatic = true;
    }

    return lightDoclet;
}

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

function getName (doclet) {

    if (doclet.highchartsName) {
        return doclet.highchartsName;
    }

    let name = getClearName(doclet.longname),
        scope = doclet.scope;
        
    try {

        if (name.indexOf('H.') === 0) {
            name = name.substr(2);
        } else if (name === 'H') {
            name = 'Highcharts';
        }

        if (scope !== 'global' &&
            name.indexOf('Highcharts.') !== 0
        ) {
            
            let memberOf = getClearName(doclet.memberOf);

            if (memberOf
                && memberOf.indexOf('Highcharts') === 0
            ) {
                name = memberOf + '.' + name;
            } else {
                name = ('Highcharts.' + name);
            }
        }

        return name
    
    } finally {
        doclet.highchartsName = name;
    }
}

function getNodeFor (doclet) {

    let node = namespace,
        parts = getName(doclet).replace('#', '.').split('.');

    parts.forEach(part => {

        if (typeof node.children === 'undefined') {
            node.children = {};
        }

        if (typeof node.children[part] === 'undefined') {
            node.children[part] = {};
        }

        node = node.children[part];
    });

    return node;
}

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

        if (item.type) {
            parameters[item.name].types = item.type.names.slice();
        }
    });

    return parameters;
}

function getReturn (doclet) {

    let returnObj = {
        types: [ 'void' ]
    };

    (doclet.returns || []).forEach(item => {

        if (!item.name) {
            return;
        }

        if (item.description) {
            returnObj.description = item.description;
        }

        if (item.type) {
            returnObj.types = item.type.slice();
        }
    });

    return returnObj;
}

function getTypes (doclet) {

    let types = (
        doclet &&
        doclet.type &&
        doclet.type.names &&
        doclet.type.names.slice()
    );

    if (!types) {
        return undefined;
    }

    return types.map(name => {
        switch(name) {
            default:
                return name;
            case 'Boolean':
            case 'Function':
            case 'Number':
            case 'Object':
            case 'String':
            case 'Symbol':
                return name.toLowerCase();
            case 'Color':
                return 'ColorString';
        }
    });
}

function getUniqueArray(array1, array2) {

    return Array.from(new Set([].concat(...arguments)));
}

/* *
 *
 *  Update Functions
 * 
 * */

function finalizeNodes (node) {

    let children = (node.children || {});

    Object
        .keys(children)
        .forEach(childName => {

            if (!children[childName].doclet) {
                delete children[childName];
            } else {
                finalizeNodes(children[childName]);
            }
        });
}

function updateNode (node, doclet) {

    let newDoclet = getLightDoclet(doclet),
        newMeta = getLightMeta(doclet),
        oldDoclet = node.doclet,
        oldMeta = node.meta;

    if (!oldDoclet) {
        oldDoclet = node.doclet = newDoclet;
    } else {
        Object.keys(newDoclet).forEach(key => {
            if (typeof oldDoclet[key] === 'undefined') {
                oldDoclet[key] = newDoclet[key];
            }
        });
    }

    if (!oldMeta) {
        oldMeta = node.meta = newMeta;
    } else {
        Object.keys(newMeta).forEach(key => {
            if (key !== 'files' &&
                typeof oldMeta[key] === 'undefined'
            ) {
                oldMeta[key] = newMeta[key];
            }
        });
    }

    let newMetaFilePath = newMeta.files[0].path,
        newMetaFileLine = newMeta.files[0].line,
        oldMetaFiles = oldMeta.files;

    if (newMetaFilePath &&
        !oldMetaFiles.some(file => file.path === newMetaFilePath)
    ) {
        oldMetaFiles.push({
            path: newMetaFilePath,
            line: newMetaFileLine
        });
    }
}

/* *
 *
 *  Add Functions
 * 
 * */

function addClass (doclet) {

    let node = getNodeFor(doclet);

    updateNode(node, doclet);

    if (!node.doclet.parameters) {
        node.doclet.parameters = getParameters(doclet);
    }
}

function addFunction (doclet) {

    let node = getNodeFor(doclet);

    updateNode(node, doclet);

    if (!node.doclet.parameters) {
        node.doclet.parameters = getParameters(doclet);
    }

    if (!node.doclet.return) {
        node.doclet.return = getReturn(doclet);
    }
}

function addMember (doclet) {

    let node = getNodeFor(doclet);

    updateNode(node, doclet);

    if (!node.doclet.types) {
        node.doclet.types = getTypes(doclet);
    }
}

function addNamespace (doclet) {

    let node = getNodeFor(doclet);

    updateNode(node, doclet);
}

function addTypeDef (doclet) {

    let name = getName(doclet),
        node = getNodeFor(doclet);

    updateNode(node, doclet);

    if (!node.doclet.types) {
        node.doclet.types = getTypes(doclet);
    }

    Object.values(doclet.properties || []).forEach(propertyDoclet => {
        propertyDoclet.longname = (name + '.' + propertyDoclet.name);
        propertyDoclet.meta = {
            line: node.meta.line
        }
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

function parseBegin (e) {

    namespace.doclet = {
        description: 'Copyright (c) Highsoft AS. All rights reserved.',
        kind: 'global',
        name: ''
    };

    namespace.meta = {
        branch: childProcess.execSync('git rev-parse --abbrev-ref HEAD', {cwd: rootPath}).toString().trim(),
        commit: childProcess.execSync('git rev-parse --short HEAD', {cwd: rootPath}).toString().trim(),
        date: (new Date()).toString(),
        files: [],
        version: require(rootPath  + '/package.json').version
    };
}

function fileBegin (e) {

    currentFilePath = path.relative(rootPath, e.filename);
    namespace.meta.files.push({
        path: currentFilePath,
        line: 0
    });
}

function newDoclet (e) {

    let doclet = e.doclet;

    allDocletPropertyNames = getUniqueArray(
        allDocletPropertyNames,
        Object.keys(doclet)
    );

    if (isUndocumented(doclet) ||
        isApiOption(doclet) ||
        isPrivate(doclet)
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
        case 'function':
            addFunction(doclet);
            break;
        case 'member':
            addMember(doclet);
            break;
        case 'namespace':
            addNamespace(doclet);
            break;
        case 'typedef':
            addTypeDef(doclet);
            break;
    }
}

function fileComplete (e) {

    currentFilePath = '';
}

function processingComplete (e) {

    finalizeNodes(namespace);

    fs.writeFileSync(
        path.join(rootPath, 'tree-namespace.json'),
        JSON.stringify(namespace, undefined, '\t')
    );
}

exports.defineTags = function (dictionary) {

    dictionary.defineTag('private', {
        onTagged: (doclet) => doclet.ignore = true
    });
};

exports.handlers = {
    parseBegin: parseBegin,
    fileBegin: fileBegin,
    newDoclet: newDoclet,
    fileComplete: fileComplete,
    processingComplete: processingComplete
};
