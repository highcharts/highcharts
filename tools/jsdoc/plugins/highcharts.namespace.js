/* eslint-disable */
/* eslint-env node,es6 */
/**
 * @module plugins/highcharts.namespace.js
 * @author Sophie Bremer
 */

/* *
 *
 *  Requires
 * 
 * */

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
    namespace = {
        doclet: {
            description: 'Copyright (c) Highsoft AS. All rights reserved.',
            types: [ 'global' ]
        },
        meta: {
            filename: currentFilePath,
            line: 0
        }
    },
    privateMembers = [];

/* *
 *
 *  Is Functions
 * 
 * */

function isApiOption (doclet) {

    let comment = doclet.comment,
        longname = getLongname(doclet),
        isApiOption = (
            comment.indexOf('@default') >= 0 ||
            comment.indexOf('@product') >= 0 ||
            comment.indexOf('@apioption') >= 0 ||
            comment.indexOf('@optionparent') >= 0
        );

    if (isApiOption) {
        apiOptionMembers.push(longname);
        return true;
    } else {
        return (apiOptionMembers.some(
            member => longname.indexOf(member) === 0
        ));
    }
}

function isInstance (doclet) {

    if (doclet.scope === 'inner' ||
        doclet.scope === 'instance'
    ) {
        return true;
    }

    let longname = getLongname(doclet);

    return (longname.lastIndexOf('#') > longname.lastIndexOf('.'));
}

function isPrivate (doclet) {

    let longname = getLongname(doclet),
        privateFlag = (
            doclet.ignore ||
            doclet.name[0] === '_' ||
            longname.indexOf('~') >= 0
        );

    if (privateFlag) {
        privateMembers.push(longname);
        return true;
    } else {
        return (privateMembers.some(member => {
            return longname.indexOf(member) === 0;
        }));
    }
}

function isStatic (doclet) {

    if (doclet.scope === 'static') {
        return true;
    }

    let longname = getLongname(doclet);

    return (longname.lastIndexOf('.') > longname.lastIndexOf('#'));
}

function isUndocumented (doclet) {

    return (doclet.undocumented || !getDescription(doclet));
}

/* *
 *
 *  Get Functions
 *
 * */

function getDeanonymousName (name) {

    if (!name) {
        return '';
    } else {
        return name
            .replace('~<anonymous>~', '~')
            .replace('~<anonymous>', '')
            .replace('<anonymous>~', '');
    }
}

function getDeclarationFilePath (filePath) {

    let fileExtension = path.extname(filePath);

    if (fileExtension) {

        if (fileExtension === '.ts' &&
            filePath.lastIndexOf('.d.ts') === (filePath.length - 6)
        ) {
            fileExtension = '.d.ts';
        }

        filePath = filePath.substr(0, fileExtension.length);
    }

    return (filePath + '.d.ts');
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
                    .replace('/**', '')
                    .replace(' * ', '')
                    .replace(' */', '');
            }
        }

        description = description.replace(/(?:\\n|\s)+/gm, ' ');

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
        kind: getKind(doclet)
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

    return lightDoclet;
}

function getLongname (doclet) {

    if (doclet.highchartsLongname) {
        return doclet.highchartsLongname;
    }

    let kind = getKind(doclet),
        longname = getDeanonymousName(doclet.longname);

    try {

        if (longname.indexOf('H.') === 0) {
            longname = longname.substr(2);
        } else if (longname === 'H') {
            longname = 'Highcharts';
        }

        if (kind !== 'global' &&
            longname.indexOf('Highcharts.') !== 0
        ) {
            
            let memberOf = getDeanonymousName(doclet.memberOf);

            if (memberOf
                && memberOf.indexOf('Highcharts') === 0
            ) {
                longname = memberOf + '.' + longname;
            } else {
                longname = ('Highcharts.' + longname);
            }
        }

        longname = longname.replace('#', '.');

        return longname
    
    } finally {
        doclet.highchartsLongname = longname;
    }
}

function getMeta (doclet) {

    let meta = doclet.meta,
        line = meta.lineno;

    return {
        filename: currentFilePath,
        line: line
    };
}

function getNodeFor (doclet) {

    let node = namespace,
        parts = getLongname(doclet).replace('#', '.').split('.');

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

function getReturns (doclet) {

    let returns = {
        types: [ 'void' ]
    };

    (doclet.returns || []).forEach(item => {

        if (!item.name) {
            return;
        }

        if (item.description) {
            returns.description = item.description;
        }

        if (item.type) {
            returns.types = item.type.slice();
        }
    });

    return returns;
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
        }
    });
}

function getUniqueArray(array1, array2) {

    return Array.from(new Set([].concat(...arguments)));
}

/* *
 *
 *  Add Functions
 * 
 * */

function addClass (doclet) {

    let node = getNodeFor(doclet);

    if (!node.doclet) {
        node.doclet = getLightDoclet(doclet);
        node.doclet.parameters = getParameters(doclet);
    }

    if (!node.meta) {
        node.meta = getMeta(doclet);
    }

}

function addFunction (doclet) {

    let node = getNodeFor(doclet);

    if (!node.doclet) {
        node.doclet = getLightDoclet(doclet);
        node.doclet.parameters = getParameters(doclet);
        node.doclet.returns = getReturns(doclet);
    }

    if (!node.meta) {
        node.meta = getMeta(doclet);
    }
}

function addMember (doclet) {

    let node = getNodeFor(doclet);

    if (!node.doclet) {
        node.doclet = getLightDoclet(doclet);
        node.doclet.types = getTypes(doclet);
    }

    if (!node.meta) {
        node.meta = getMeta(doclet);
    }
}

function addNamespace (doclet) {

    let node = getNodeFor(doclet);

    if (!node.doclet) {
        node.doclet = getLightDoclet(doclet);
    }

    if (!node.meta) {
        node.meta = getMeta(doclet);
    }
}

function addTypeDef (doclet) {

    let longname = getLongname(doclet),
        node = getNodeFor(doclet);

    if (!node.doclet) {
        node.doclet = getLightDoclet(doclet);
        node.doclet.types = getTypes(doclet);
    }

    if (!node.meta) {
        node.meta = getMeta(doclet);
    }

    Object.values(doclet.properties || []).forEach(doclet => {
        doclet.longname = (longname + '.' + doclet.name);
        doclet.meta = {
            lineno: node.meta.line
        }
        addMember(doclet);
    })
}

/* *
 *
 *  JSDoc Functions
 *
 *  Documentation: http://usejsdoc.org/about-plugins.html
 * 
 * */

function fileBegin (e) {

    let filePath = e.filename;

    if (filePath.indexOf(rootPath) === 0) {
        filePath = filePath.substr(rootPath.length + 1);
    }

    currentFilePath = filePath;
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
                'Unknown doclet kind: ' + kind,
                'Found at symbol: ' + doclet.longname
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
        case 'typedef':
            addTypeDef(doclet);
            break;
    }
}

function fileComplete (e) {

    currentFilePath = '';
}

function processingComplete (e) {

    /**
     * A doclet can contain the following properties: 
     * access
     * alias
     * augments
     * comment
     * defaultvalue
     * deprecated
     * description
     * examples
     * ignore
     * kind
     * longname
     * memberof
     * meta
     * name
     * params
     * properties
     * returns
     * scope
     * see
     * since
     * tags
     * todo
     * type
     * undocumented
     */
    console.log(
        'Processing completed.',
        'A doclet can contain the following properties:',
        allDocletPropertyNames.sort().join(', ')
    );

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
    fileBegin: fileBegin,
    newDoclet: newDoclet,
    fileComplete: fileComplete,
    processingComplete: processingComplete
};
