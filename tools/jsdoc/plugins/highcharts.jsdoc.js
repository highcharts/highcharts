/* eslint-disable */
/**
 * @module plugins/highcharts.jsdoc
 * @author Chris Vasseng
 */

"use strict";

var hcRoot = __dirname + '/../../..';

var parseTag = require('jsdoc/tag/type').parse;

var exec = require('child_process').execSync;
var logger = require('jsdoc/util/logger');
var Doclet = require('jsdoc/doclet.js').Doclet;
var fs = require('fs');
var getPalette = require('highcharts-assembler/src/process.js').getPalette;
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
function dumpOptions() {
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
    }

    // Add options decorations directly to the node
    option.highcharts = option.highcharts || {};
    option.highcharts.fullname = parent + index;
    option.highcharts.name = index;
    option.highcharts.isOption = true;
}

function appendComment(node, lines) {
  if (typeof node.comment !== 'undefined') {
    node.comment = node.comment + '\n* ' + lines.join('\n* ');
  } else {
    node.comment = '* ' + lines.join('\n* ');
  }
  node.event = 'jsdocCommentFound';
}

function nodeVisitor(node, e, parser, currentSourceName) {
    var exp,
        args,
        target,
        parent,
        properties,
        fullPath,
        s,
        shouldIgnore = false
    ;

    if (node.highcharts && node.highcharts.isOption) {

      shouldIgnore = (e.comment || '').indexOf('@ignore-option') > 0;

      if (shouldIgnore) {
        return;
      } else {
        appendComment(node, ['@optionparent ' + node.highcharts.fullname]);
      }

      return;
    }

    if (node.leadingComments && node.leadingComments.length > 0) {

        if (!e.comment) {
          e.comment = node.leadingComments[0].raw || node.leadingComments[0].value;
        }

        s = e.comment.indexOf('@optionparent');

        if (s >= 0) {
            s = e.comment.substr(s).replace(/\*/g, '').trim();
            fullPath = '';

            parent = s.split('\n')[0].trim().split(' ');

            if (parent && parent.length > 1) {
                parent = parent[1].trim() || '';

                s = parent.split('.');
                target = options;

                s.forEach(function (p, i) {

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

        p.forEach(function (thing, i) {
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

	console.log('removing', path);

	if (!obj) {
		return;
	}

	p.some(function (thing, i) {
		if (i === p.length - 1) {
			delete curent[thing];
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
			if (doclet.ignored) return removeOption(tagObj.value);

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

    dictionary.defineTag('exclude', {
        onTagged: function (doclet, tagObj) {
            console.log('@exdlude', tagObj.text)
            var items = tagObj.text.split(',');

            doclet.exclude = doclet.exclude || [];

            items.forEach(function (entry) {
                doclet.exclude.push(entry.trim());
            });
        }
    });

    dictionary.defineTag('excluding', {
        onTagged: function (doclet, tagObj) {
            var items = tagObj.text.split(',');

            doclet.exclude = doclet.exclude || [];

            items.forEach(function (entry) {
                doclet.exclude.push(entry.trim());
            });
        }
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
		return;

		var t;
		doclet.values = doclet.values || [];

		// A lot of these options are defined as json.
		try {
			t = JSON.parse(tagObj.value);
			if (Array.isArray(t)) {
				doclet.values = doclet.values.concat(t);
			} else {
				doclet.values.push(t);
			}
		} catch (e) {
			doclet.values.push(tabObj.value);
		}
	}

	dictionary.defineTag('validvalue', {
		onTagged: function (doclet, tag) {
			handleValue(doclet, tag);
		}
	});

	dictionary.defineTag('values', {
		onTagged: function (doclet, tag) {
			handleValue(doclet, tag);
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
        var palette = getPalette(hcRoot + '/css/highcharts.scss');

        Object.keys(palette).forEach(function (key) {
            var reg = new RegExp('\\$\\{palette\\.' + key + '\\}', 'g');

            e.source = e.source.replace(
                reg,
                palette[key]
            );
        });
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
