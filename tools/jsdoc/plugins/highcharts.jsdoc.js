/* eslint-disable */
/**
 * @module plugins/highcharts.jsdoc
 * @author Chris Vasseng
 */

"use strict";

var exec = require('child_process').execSync;
var logger = require('jsdoc/util/logger');
var Doclet = require('jsdoc/doclet.js').Doclet;
var fs = require('fs');
var options = {
    _meta: {
        commit: '',
        branch: ''
    }
};

function dumpOptions() {
    fs.writeFile(
        'tree.json',
        JSON.stringify(
            options,
            undefined,
            '  '
        ),
        function () {
            console.log('Wrote tree!');
        }
    );
}

function decorateOptions(parent, target, option, filename) {
    var index;

    if (!option) {
        console.log('WARN: decorateOptions called with no valid AST node');
        return;
    }

    index = option.key.name;

    if (parent && parent.length > 0) {
        parent += '.';
    }

    target[index] = target[index] || {
        doclet: {},
      //  type: option.key.type,
        children: {}
    };

    target[index].meta = {
        fullname: parent + index,
        name: index,
        line: option.key.loc.start.line,
        column: option.key.loc.start.column,
        filename: filename//.replace('highcharts/', '')
    };

    if (option.value && option.value.type == 'ObjectExpression') {

        // This is a nested object probably
        option.value.properties.forEach(function (sub) {
            var s = {};

            s = target[index].children;

            decorateOptions(
                parent + index,
                s,
                sub,
                filename
            );
        });
    } else if (option.value && option.value.type === 'Literal') {
       target[index].meta.default = option.value.value;
       //target[option.key.name].meta.type = option.value.type;
    } else {
       // return;
    }

    // Add options decorations directly to the node
    option.highcharts = option.highcharts || {};
    option.highcharts.fullname = parent + index;
    option.highcharts.name = index;
    option.highcharts.isOption = true;

    // if (option.comment) {
    //     option.comment = option.comment.replace('*/', '\n* @apioption ' + parent + index + '\n*/');
    // } else {
    //     option.comment = '/** @apioption ' + parent + index + ' */';
    // }
}

function addToComment(comment, line) {
    comment = comment || '';

    return '/*' +
            comment.replace('/*', '').replace('*/', '') +
            '\n * ' +
            line +
            '\n*/'
    ;
}

function nodeVisitor(node, e, parser, currentSourceName) {
    var exp,
        args,
        target,
        parent,
        comment,
        properties,
        fullPath,
        s
    ;

    if (node.highcharts && node.highcharts.isOption) {
        if (e.comment) {
            e.comment = e.comment.replace('*/', '\n* @optionparent ' + node.highcharts.fullname + '\n*/');
        } else {
            e.comment = '/** @optionparent ' + node.highcharts.fullname + ' */';
        }
        //if (node.highcharts.name === 'colors') {
        //    console.log('tagged', node.highcharts.fullname);
        //}
        return;
    }

    if (node.leadingComments && node.leadingComments.length > 0) {
        comment = node.leadingComments[0].raw;

        s = comment.indexOf('@optionparent');

        if (s >= 0) {
            s = comment.substr(s).replace(/\*/g, '').trim();
            fullPath = '';

            parent = s.split('\n')[0].trim().split(' ');

            console.log('doing optionparent:', currentSourceName, '->', parent.length > 1 ? parent[1] : 'root');

            if (parent && parent.length > 1) {
                parent = parent[1].trim() || '';

                s = parent.split('.');
                target = options;

                s.forEach(function (p, i) {
                    fullPath = fullPath + (fullPath.length > 0 ? '.' : '') + p

                    target[p] = target[p] || {};

                    target[p].doclet = target[p].doclet || {};
                    target[p].children = target[p].children || {};

                    target[p].meta = {
                        filename: currentSourceName,
                        name: p,
                        fullname: fullPath,
                        line: node.loc.start.line,
                        column: node.loc.start.column
                    };

                    target = target[p].children;

                });
            } else {
                parent = '';

                //options.children = options.children || {};
                target = options;
            }

            if (target) {
                if (node.type === 'CallExpression' && node.callee.name === 'seriesType') {
                    properties = node.arguments[2].properties;
                } else if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.property.name === 'setOptions') {
                    properties = node.arguments[0].properties;
                } else if (node.type === 'ObjectExpression') {
                    properties = node.properties;
                } else if (node.init && node.init.type === 'ObjectExpression') {
                    properties = node.init.properties;
                } else if (node.value && node.value.type === 'ObjectExpression') {
                    properties = node.value.properties;
                } else if (node.operator === '=' && node.right.type === 'ObjectExpression') {
                    properties = node.right.properties;
                } else if (node.right && node.right.type === 'CallExpression' && node.right.callee.property.name === 'seriesType') {
                    properties = node.right.arguments[2].properties;
                } else {
                    logger.error('code tagged with @optionparent must be an object:', currentSourceName, node);
                }

                if (properties && properties.length > 0) {
                    properties.forEach(function (child) {
                        decorateOptions(parent, target, child, e.filename || currentSourceName);
                    });
                } else {
                    console.log('INVALID properties for node', node);
                }
            } else {
                logger.error('@optionparent is missing an argument');
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////

function augmentOption(path, obj) {
    // This is super nasty.
    var current = options,
        p = (path || '').split('.')
    ;

    if (!obj) {
        return;
    }

    try {

        // if (p.length === 1) {
        //     current[p[0]] = current[p[0]] || {};
        //     current[p[0]].doclet = {};
        //     current[p[0]].meta = {};
        //     current[p[0]].children = {};

        //     Object.keys(obj).forEach(function (property) {
        //         if (property !== 'comment' && property !== 'meta') {
        //             current[p[0]].doclet[property] = obj[property];
        //         }
        //     });
        //     return;
        // }

        // if (p.length === 1) {
        //     if (current.children) {
        //         current = current.children;
        //     } else {
        //         current = current.children = {};
        //     }
        // }

        p.forEach(function (thing, i) {
            if (i === p.length - 1) {
                // Merge in stuff
                current[thing] = current[thing] || {};

                current[thing].doclet = current[thing].doclet || {};
                current[thing].children = current[thing].children || {};
                current[thing].meta = current[thing].meta || {};

                Object.keys(obj).forEach(function (property) {
                    if (property !== 'comment' && property !== 'meta') {
                        current[thing].doclet[property] = obj[property];
                    }
                });

                //==current[thing].meta = current[thing].meta || {};

                // if (obj && obj.meta) {
                //     if (!current[thing].meta.filename === '??') {
                //         current[thing].meta.filename = obj.meta.filename.substr(
                //             obj.meta.filename.indexOf('highcharts/')
                //         );
                //     }
                // }

                return;
            }

            current[thing] = current[thing] || {children: {}};
            current = current[thing].children;
        });

    } catch (e) {
        console.log('ERROR deducing path', path);
    }
}

function resolveProductTypes(doclet, tagObj) {
    var reg = /^\{([a-z\|]+)\}/g,
        match = tagObj.value.match(reg),
        products,
        value = tagObj.value;

    if (match) {
        value = value.replace(reg, '');
        products = match[0].replace('{', '').replace('}', '').split('|');
    }


    doclet[tagObj.originalTitle] = value;
    doclet[tagObj.originalTitle + '_products'] = products;
}

////////////////////////////////////////////////////////////////////////////////

exports.defineTags = function (dictionary) {
    dictionary.defineTag('apioption', {
        onTagged: function (doclet, tagObj) {
            augmentOption(tagObj.value, doclet);
        }
    });

    dictionary.defineTag('sample', {
        onTagged: function (doclet, tagObj) {
            var del = tagObj.text.indexOf(' '),
                name = tagObj.text.substr(del).trim().replace(/\s\s+/g, ' ')
            ;

            doclet.samples = doclet.samples || {};
            doclet.samples[name] = tagObj.text.substr(0, del).trim();
        }
    });

    dictionary.defineTag('context', {
      onTagged: function (doclet, tagObj) {
        doclet.context = tagObj.value;
      }
    });

    dictionary.defineTag('optionparent', {
        onTagged: function (doclet, tagObj) {
            //doclet.fullname = tagObj.value;
            augmentOption(tagObj.value, doclet);
        }
    });

    dictionary.defineTag('product', {
        onTagged: function (doclet, tagObj) {
            doclet.products = tagObj.value.split(' ');
        }
    });

    dictionary.defineTag('exclude', {
        onTagged: function (doclet, tagObj) {
            var items = tagObj.text.split(',');

            doclet.exclude = doclet.exclude || [];

            items.forEach(function (entry) {
                doclet.exclude.push(entry.trim());
            });
        }
    });

    dictionary.defineTag('extends', {
        onTagged: function (doclet, tagObj) {
            doclet.extends = tagObj.value;
        }
    });

    dictionary.defineTag('productdesc', {
        onTagged: resolveProductTypes
    });
};

exports.astNodeVisitor = {
    visitNode: nodeVisitor
};

exports.handlers = {
    beforeParse: function (e) {

    },

    jsdocCommentFound: function (e) {

    },

    newDoclet: function (e) {

    },

    parseComplete: function () {
        options._meta.version = require(__dirname + '/../../../package.json').version;
        options._meta.commit = exec('git rev-parse --short HEAD', {cwd: process.cwd()}).toString().trim();
        options._meta.branch = exec('git rev-parse --abbrev-ref HEAD', {cwd: process.cwd()}).toString().trim();
        options._meta.date = (new Date()).toString();

        dumpOptions();
    }
};
