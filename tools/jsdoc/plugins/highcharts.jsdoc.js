/* eslint-disable */
/* eslint-env node,es6 */
/**
 * @module plugins/highcharts.jsdoc
 * @author Chris Vasseng
 */

"use strict";

var hcRoot = process.cwd(); // __dirname + '/../../../..';

var parseTag = require('jsdoc/tag/type').parse;

var exec = require('child_process').execSync;
var logger = require('jsdoc/util/logger');
var Doclet = require('jsdoc/doclet.js').Doclet;
var colors = require('colors');
var fs = require('fs');
var getPalette = require('highcharts-assembler/src/process.js').getPalette;
var path = require('path');
var options = {
    _meta: {
        commit: '',
        branch: ''
    }
};

function getLocation(option) {
    return {
        start:
            (option.leadingComments && option.leadingComments[0].loc.start) ||
            option.key.loc.start,
        end:
            (option.leadingComments && option.leadingComments[0].loc.end) ||
            option.key.loc.end
    };
}

function sortProperties(node) {

    if (!node) {
        return;
    }

    if (node instanceof Array) {
        let slice = node.slice().sort();
        node.length = 0;
        node.push(...slice);
        node.forEach(item => sortProperties)
    }

    if (node.constructor !== Object) {
        return;
    }

    let keys = Object.keys(node).sort();

    if (keys.length === 0) {
        return;
    }

    let pointer = {};

    keys.forEach(key => {
        pointer[key] = node[key];
        delete node[key];
    });

    keys.forEach(key => {
        node[key] = pointer[key];
        sortProperties(node[key]);
    });

}

function dumpOptions() {
    sortProperties(options);
    fs.writeFile(
        'tree.json',
        JSON.stringify(
            options,
            undefined,
            '  '
        ),
        function () {
            //console.log('Wrote tree!');
        }
    );
}

function resolveBinaryExpression(node) {
    var val = '';
    var lside = '';
    var rside = '';

    if (node.left.type === 'Literal') {
        lside = node.left.value;    
    } 
        
    if (node.right.type === 'Literal') {
        rside = node.right.value;
    }

    if (node.left.type === 'BinaryExpression') {
        lside = resolveBinaryExpression(node.left);
    }

    if (node.right.type === 'BinaryExpression') {
        rside = resolveBinaryExpression(node.right);
    }

    if (node.operator === '+') {
        val = lside + rside;
    }

    // This is totally not needed, but maybe someone is doing something
    // really really strange, so might as well support it
    if (node.operator === '-') {
        val = lside - rside;
    }

    return val;
}

function decorateOptions(parent, target, option, filename) {
    var index;

    if (!option) {
        console.log('WARN: decorateOptions called with no valid AST node');
        return;
    }

    if (
        option.leadingComments &&
        option.leadingComments[0].value.indexOf('@ignore') !== -1
    ) {
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

    // Look for the start of the doclet first
    var location = getLocation(option);


    target[index].meta = {
        fullname: parent + index,
        name: index,
        line: location.start.line,
        lineEnd: location.end.line,
        column: location.start.column,
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
    } else if (option.value && option.value.type === 'UnaryExpression') {
        if (option.value.argument && option.value.argument.type === 'Literal') {
            target[index].meta.default = option.value.operator + option.value.argument.value;

            if (!isNaN(target[index].meta.default) && isFinite(target[index].meta.default)) {
                target[index].meta.default = parseInt(target[index].meta.default, 10);
            }
        }
    } else if (option.value && option.value.type === 'BinaryExpression') {
        target[index].meta.default = resolveBinaryExpression(option.value);
    } else {
      // if (option.leadingComments && option.leadingComments[0].value.indexOf('@apioption') >= 0) {
        // console.log('OPTION:', option, 'COMMENT:', option.leadingComments);
      // }
    }

    // Add options decorations directly to the node
    option.highcharts = option.highcharts || {};
    option.highcharts.fullname = parent + index;
    option.highcharts.name = index;
    option.highcharts.isOption = true;
}

function appendComment(node, lines) {

    if (typeof node.comment !== 'undefined') {
        node.comment = node.comment.replace(/\/\*/g, '').replace(/\*\//g, '*');
        node.comment = '/**\n' + node.comment + '\n* ' + lines.join('\n* ') + '\n*/';
    } else {
        node.comment = '/**\n* ' + lines.join('\n* ') + '\n*/';
    }

    node.event = 'jsdocCommentFound';
}

function nodeVisitor(node, e, parser, currentSourceName) {
    var exp,
        args,
        target,
        parent,
        comment,
        properties,
        fullPath,
        s,
        rawComment,
        shouldIgnore = false
    ;

    if (node.highcharts && node.highcharts.isOption) {

        shouldIgnore = (e.comment || '').indexOf('@ignore-option') > 0;

        if (shouldIgnore) {
            removeOption(node.highcharts.fullname);
        } else if ((e.comment || '').indexOf('@apioption') < 0) {
            appendComment(e, [
            '@optionparent ' + node.highcharts.fullname
            ]);
        } else if ((e.comment || '').indexOf('@apioption tooltip') >= 0) {
            console.log(e.comment);
        }

        return;
    }

    if (!node.leadingComments ||
        node.leadingComments.length === 0
    ) {
        return;
    }

    if (!e.comment) {
        rawComment = '';
        (node.leadingComments || []).some(function (c) {
            // We only use the one containing @optionparent
            rawComment = c.raw || c.value;
            if (rawComment.indexOf('@optionparent') >= 0) {
                return true;
            }
            return false;
        });

        e.comment = rawComment;
        // e.comment = node.leadingComments[0].raw || node.leadingComments[0].value;
    }

    s = e.comment.indexOf('@optionparent');

    if (s >= 0) {
        s = e.comment.substr(s).trim();
        fullPath = '';

        parent = s.split('\n')[0].trim().split(' ');

        if (parent && parent.length > 1) {
            parent = parent[1].trim() || '';

            s = parent.split('.');
            target = options;

            s.forEach(function (p, i) {
                // p = p.trim();

                fullPath = fullPath + (fullPath.length > 0 ? '.' : '') + p

                target[p] = target[p] || {};

                target[p].doclet = target[p].doclet || {};
                target[p].children = target[p].children || {};

                var location = getLocation(node);
                target[p].meta = {
                    filename: currentSourceName,
                    name: p,
                    fullname: fullPath,
                    line: location.start.line,
                    lineEnd: location.end.line,
                    column: location.start.column
                };

                target = target[p].children;

            });
        } else {
            parent = '';
            target = options;
        }

        if (target) {
            if (node.type === 'CallExpression' && node.callee.name === 'seriesType') {
                console.log('    found series type', node.arguments[0].value, '- inherited from', node.arguments[1].value);
                // console.log('    found series type:', JSON.stringify(node.arguments[2], undefined, '  '));
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
                console.log('    found series type', node.right.arguments[0].value, '- inherited from', node.right.arguments[1].value);
                properties = node.right.arguments[2].properties;
            } else {
                logger.error('code tagged with @optionparent must be an object:', currentSourceName, node);
            }

            if (properties) {
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

////////////////////////////////////////////////////////////////////////////////

function isNum(what) {
    return !isNaN(parseFloat(what)) && isFinite(what);
};

function isBool (what) {
    return (what === true || what === false);
};

function isStr (what) {
    return (typeof what === 'string' || what instanceof String);
};

function inferType(node) {
    var defVal;

    node.doclet = node.doclet || {};
    node.meta = node.meta || {};

    if (typeof node.doclet.type !== 'undefined') {
        // We allready have a type, so no infering is required
        return;
    }

    defVal = node.doclet.defaultvalue;

    if (typeof node.meta.default !== 'undefined' && typeof node.doclet.defaultvalue === 'undefined') {
        defVal = node.meta.default;
    }

    if (typeof defVal === 'undefined') {
        // There may still be hope - if this node has children, it's an object.
        if (node.children && Object.keys(node.children).length) {
            node.doclet.type = {
                names: ['Object']
            };
        }

        // We can't infer this type, so abort.
        return;
    }
    
    node.doclet.type = { names: [] };
    
    if (isBool(defVal)) {
        node.doclet.type.names.push('Boolean');
    }
    
    if (isNum(defVal)) {
        node.doclet.type.names.push('Number');
    }
    
    if (isStr(defVal)) {
        node.doclet.type.names.push('String');
    }

    // If we were unable to deduce a type, assume it's an object
    if (node.doclet.type.names.length === 0) {
        node.doclet.type.names.push('Object');
    }

}

function augmentOption(path, obj) {
    // This is super nasty.
    var current = options,
        p = (path || '').trim().split('.')
    ;

    if (!obj) {
        return;
    }

    try {

        p.forEach(function (thing, i) {
            // thing = thing.trim();

            if (i === p.length - 1) {
                // Merge in stuff
                current[thing] = current[thing] || {};

                current[thing].doclet = current[thing].doclet || {};
                current[thing].children = current[thing].children || {};
                current[thing].meta = current[thing].meta || {};

                // Free floating doclets marked with @apioption
                if (!current[thing].meta.filename) {
                    current[thing].meta.filename = obj.meta.path + '/' + obj.meta.filename;
                    current[thing].meta.line = obj.meta.lineno;
                    current[thing].meta.lineEnd = obj.meta.lineno + obj.comment.split(/\n/g).length - 1;
                }

                Object.keys(obj).forEach(function (property) {
                    if (property !== 'comment' && property !== 'meta') {
                        current[thing].doclet[property] = obj[property];
                    }
                });
                return;
            }

            current[thing] = current[thing] || {children: {}};
            current = current[thing].children;
        });

    } catch (e) {
        console.log('ERROR deducing path', path);
    }
}

function removeOption(path) {
    var current = options,
        p = (path || '').split('.')
    ;

    // console.log('found ignored option: removing', path);

    if (!p) {
        return;
    }

    p.some(function (thing, i) {
        if (i === p.length - 1) {
            delete current[thing];
            return true;
        }

        if (!current[thing]) {
            return true;
        }

        current = current[thing].children;
    });
}

/**
 * Resolve properties where the product can be specified like {highcharts|highmaps}
 * etc. Return an object with value and products.
 */
function resolveProductTypes(doclet, tagObj) {
    var reg = /^\{([a-z\|]+)\}/g,
        match = tagObj.value.match(reg),
        products,
        value = tagObj.value;

    if (match) {
        value = value.replace(reg, '');
        products = match[0].replace('{', '').replace('}', '').split('|');
    }

    return doclet[tagObj.originalTitle] = {
        value: value.trim(),
        products: products
    };
}

////////////////////////////////////////////////////////////////////////////////

exports.defineTags = function (dictionary) {
    dictionary.defineTag('apioption', {
        onTagged: function (doclet, tagObj) {

            if (doclet.ignored) {
                return removeOption(tagObj.value);
            }

            augmentOption(tagObj.value, doclet);
        }
    });

    dictionary.defineTag('sample', {
        onTagged: function (doclet, tagObj) {

            var valueObj = resolveProductTypes(doclet, tagObj);

            var text = valueObj.value;

            var del = text.search(/\s/),
                name = text.substr(del).trim().replace(/\s\s+/g, ' '),
                value = text.substr(0, del).trim(),
                folder = hcRoot + /samples/ + value
            ;

            doclet.samples = doclet.samples || [];

            if (!fs.existsSync(folder)) {
                console.error('@sample does not exist: ' + value);
            }
            doclet.samples.push({
                name: name,
                value: value,
                products: valueObj.products
            });
        }
    });

    dictionary.defineTag('context', {
      onTagged: function (doclet, tagObj) {
            doclet.context = tagObj.value;
      }
    });

    dictionary.defineTag('optionparent', {
        onTagged: function (doclet, tagObj) {
            if (doclet.ignored) return removeOption(tagObj.value);

            //doclet.fullname = tagObj.value;
            augmentOption(tagObj.value, doclet);
        }
    });

    dictionary.defineTag('product', {
        onTagged: function (doclet, tagObj) {
            var adds = tagObj.value.split(' ');
            doclet.products = doclet.products || [];

            // Need to make sure we don't add dupes
            adds.forEach(function (add) {
                if (doclet.products.filter(function (e) {
                    return e === add;
                }).length === 0) {
                    doclet.products.push(add);
                }
            });
        }
    });

    function handleExclude (doclet, tagObj) {
        var items = tagObj.text.split(',');

        doclet.exclude = doclet.exclude || [];

        items.forEach(function (entry) {
            doclet.exclude.push(entry.trim());
        });
    }

    dictionary.defineTag('exclude', {
        onTagged: handleExclude
    });

    dictionary.defineTag('excluding', {
        onTagged: handleExclude
    });

    dictionary.defineTag('ignore-option', {
        onTagged: function (doclet, tagObj) {
            doclet.ignored = true;
        }
    });

    dictionary.defineTag('default', {
        onTagged: function (doclet, tagObj) {

            if (!tagObj.value) {
                return;
            }

            if (tagObj.value.indexOf('highcharts') < 0 &&
                tagObj.value.indexOf('highmaps') < 0 &&
                tagObj.value.indexOf('highstock') < 0) {

                doclet.defaultvalue = tagObj.text;
                return;
            }

            var valueObj = resolveProductTypes(doclet, tagObj);

            doclet.defaultByProduct = doclet.defaultByProduct || {};

            (valueObj.products || []).forEach(function (p) {
                doclet.defaultByProduct[p] = valueObj.value;
            });

            //var parsed = parseTag(tagObj.value, true, true);
            //doclet.defaultvalue = parsed;
        }
    });

    function handleValue(doclet, tagObj) {
        doclet.values = tagObj.value;
    }

    dictionary.defineTag('validvalue', {
        onTagged: handleValue
    });

    dictionary.defineTag('values', {
        onTagged: handleValue
    });

    dictionary.defineTag('extends', {
        onTagged: function (doclet, tagObj) {
            doclet.extends = tagObj.value;
        }
    });

    dictionary.defineTag('productdesc', {
        onTagged: resolveProductTypes
    });

    dictionary.defineTag('typedesc', {
        onTagged: function (doclet, tagObj) {
            if (!doclet.type) {
                doclet.type = {};
            }
            doclet.type.description = tagObj.value;
        }
    });
};

exports.astNodeVisitor = {
    visitNode: nodeVisitor
};

exports.handlers = {

    beforeParse: function (e) {
        var palette = getPalette(hcRoot + '/css/highcharts.scss');

        Object.keys(palette).forEach(function (key) {
            var reg = new RegExp('\\$\\{palette\\.' + key + '\\}', 'g');

            e.source = e.source.replace(
                reg,
                palette[key]
            );
        });

        var match = e.source.match(
            /(\s*)\/\*\*(?:\1 \*[^\n]*)+\1 \*\/[\s]+\}/g
        );
        if (match && match.some(m =>
                m.indexOf('@apioption') === -1 &&
                m.indexOf('@name') === -1
        )) {
            console.log(
`Warning: Detected ${match.length} cases of a comment followed by } in
${e.filename}.
This may lead to loose doclets not being parsed into the API. Move them up
before functional code for JSDoc to see them.`.yellow
            );
        }

    },

    jsdocCommentFound: function (e) {

    },

    newDoclet: function (e) {

    },

    parseComplete: function () {
        options._meta.version = require(hcRoot  + '/package.json').version;
        options._meta.commit = exec('git rev-parse --short HEAD', {cwd: process.cwd()}).toString().trim();
        options._meta.branch = exec('git rev-parse --abbrev-ref HEAD', {cwd: process.cwd()}).toString().trim();
        options._meta.date = (new Date()).toString();

        function inferTypeForTree(obj) {
            inferType(obj);

            if (obj.meta && obj.meta.filename) {
                // Remove user-identifiable info in filename
                obj.meta.filename = obj.meta.filename.substr(
                    obj.meta.filename.indexOf('highcharts')
                );
            }

            // Infer types
            if (obj.children) {
                Object.keys(obj.children).forEach(function (child) {
                    // work around #8260:
                    if (child === '' || child === 'undefined') {
                        delete obj.children[child];
                        return;
                    }
                    inferTypeForTree(obj.children[child]);
                });
            }
        }

        Object.keys(options).forEach(function (name) {
            // work around #8260:
            if (name === '' || name === 'undefined') {
                delete options[name];
                return;
            }
            if (name !== '_meta') {
                inferTypeForTree(options[name]);
            }
        });

        function addSeriesTypeDescription(type) {
            var node = type;

            // Make sense of the examples for general series
            if (type === 'series') {
                type = 'line';
            }
            var s = `

Configuration options for the series are given in three levels:
1. Options for all series in a chart are defined in the
   [plotOptions.series](plotOptions.series) object.
2. Options for all \`${type}\` series are defined in
   [plotOptions.${type}](plotOptions.${type}).
3. Options for one single series are given in
   [the series instance array](series.${type}).

<pre>
Highcharts.chart('container', {
    plotOptions: {
        series: {
            // general options for all series
        },
        ${type}: {
            // shared options for all ${type} series
        }
    },
    series: [{
        // specific options for this series instance
        type: '${type}'
    }]
});
</pre>
            `;
            options.plotOptions.children[node].doclet.description += s;
            if (options.series.children[node]) {
                options.series.children[node].doclet.description += s;
            }
        }

        Object.keys(options.plotOptions.children).forEach(addSeriesTypeDescription);

        dumpOptions();
    }
};
