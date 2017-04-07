/* Generate a patch script based on API dump */

require('colors');

const request = require('request');
const fs = require('fs');
const markdownify = require('to-markdown');
const async = require('async');

const products = [
    // Highcharts
    {
        name: 'highcharts',
        url: 'http://api.highcharts.com/highcharts/option/dump.json'
    },
    // Highstock
    {
        name: 'highstock',
        url: 'http://api.highcharts.com/highstock/option/dump.json'
    },
    // Highmaps
    {
        name: 'highmaps',
        url: 'http://api.highcharts.com/highmaps/option/dump.json'
    }
];


const args = process.argv;

function flatten(productName, dump, target) {
    var res = target || {};

    dump.forEach(function (entry) {
        var key = entry.fullname;

        key = key.replace('<', '.').replace('>', '');

        if (!res[key]) {
            res[key] = entry;
        }

        entry = res[key];

        entry.products = entry.products || [];

        if (entry.products.filter(function (b) {return b === productName}).length === 0) {
            entry.products.push(productName);
        }

        //res[key] = entry;
    });

    return res;
}

function flattenTree(tree) {
    var res = {};

    function next(name, node) {
        var entry = {};

        res[name] = entry;

        Object.keys(node).forEach(function (key) {
            if (key !== 'children') {
                entry[key] = node[key];
            }
        });

        if (node.children) {
            Object.keys(node.children).forEach(function (key) {
                name = node.children[key].meta ? node.children[key].meta.fullname : (name + '.' + key);
                next(name, node.children[key]);
            });
        }
    }

    Object.keys(tree).forEach(function (key) {
        next(key, tree[key]);
    });

    return res;
}

function fixStr (str, prefix, indentation) {
    var lines = [],
        c = '',
        count = 0,
        splits = {
            ' ': true,
            ',': true,
            '.': true,
            '-': true
        }
    ;

    indentation = indentation || 0;
    count = indentation;

    str = str.replace(/\n/g, ' ').replace(/\r/g, '');
    str = markdownify(str);

    prefix = prefix || '';    

    for (var i = 0; i < str.length; i++) {
        c += str[i];
        ++count;

        if (str[i] === '\n') {
            lines.push(c.trim());
            c = '';
            count = indentation;
        }
        
        if (count >= (80 - prefix.length - 10) && splits[str[i]]) {
            lines.push(c.trim());
            c = '';
            count = indentation;
        }
    }

    if (c.length > 0) {
        lines.push(c);        
    }

    return lines;
}

function fixSample(str) {

    res = [];

    function extractNext() {
        var start = str.indexOf('<a'),
            stop = str.indexOf('</a>'),
            original,
            url
        ;

        if (start >= 0 && stop >= 0) {
            original = str.substr(start, (stop - start) + 4);
            

            start = original.indexOf
            url = original.substr(original.indexOf('"'))

            str = str.replace(original, 'REMOVED');
            extractNext();
        }
    }

    str = str.replace(/[^<]*(<a href="([^"]+)"[^>]+>([^<]+)<\/a>)/g, function (o, orig, url, title) {        
        url = url.substr(url.lastIndexOf('highcharts/'));
        title = title.replace(/\t/g, ' ').trim() || 'View Sample';
        res.push(url + ' ' + title[0].toUpperCase() + title.substr(1));
    });

    return res;
}

function processTarget(target, mergedAPI, fn) {
    var api;

    console.log('Fetching dump from', target.url);

    function fetchRemote() {
        request(target.url, function (error, response, body) {    
            if (error) return fn(error);
            try {
                api = JSON.parse(body)
            } catch (e) {

            }

            fs.writeFile(target.name + '.cache.json', body, function () {

            });

            fn(false, flatten(target.name, api, mergedAPI));
        });        
    }

    fs.readFile(target.name + '.cache.json', function (err, data) {
        if (err) return console.log('could not find mongo dumps');//fetchRemote();
        
        try {
            api = JSON.parse(data.toString());
        } catch (e) {

        }

        fn(false, flatten(target.name, api, mergedAPI));
    });
}

function doCompare(code, dump) {
    var res = {},
        htmlReport = {
            missingInAPI: [],
            missingInCode: [],
            outOfSync: []
        },
        supplementalDoclets = []
    ;

    function toDolcet(dentry, doclet, spaces, indentation) {
        /*
            Missing things:
                - Context
                - Extending
                - Excluding
                - See also
                - Values (possible values)
                - Return type
         */
        
         if (dentry.description && dentry.description.length) {
            doclet.push(
                fixStr(dentry.description, false, indentation).
                    join(
                        '\n' +
                        (spaces || '') + ' * '
                    )
            );

            doclet.push('');
        }
        
        if (dentry.values && dentry.values.length) {
            doclet.push('@validvalue ' + dentry.values);
        }
        
        if (dentry.returnType && dentry.returnType.length > 0) {
            doclet.push('@type {' + dentry.returnType + '}');
        }

        if (dentry.seeAlso && dentry.seeAlso.length > 0) {            
            doclet.push('@see ' + fixStr(dentry.seeAlso, false, indentation).
                    join(
                        '\n' +
                        (spaces || '') + ' * '
                    )
            );
        }

        if (dentry.extending && dentry.extending.length > 0) {
            doclet.push('@extends ' + dentry.extending.replace(/\-\-/g, '.').replace(/\-/g, '.'));
        }

        if (dentry.context && dentry.context.length > 0) {
            doclet.push('@context ' + dentry.context);
        }

        if (dentry.defaults && dentry.defaults.length > 0) {
            doclet.push('@default ' + dentry.defaults);
        }
        
        if (dentry.todo) {
            doclet.push('@todo ' + dentry.todo);
        }
        
        if (dentry.excluding) {
            doclet.push('@excluding ' + dentry.excluding);
        }

        if (dentry.deprecated) {
            doclet.push('@deprecated');
        }

        if (dentry.demo) {
            samples = fixSample(dentry.demo.replace(/\n/g, ' ').replace(/\r/g, ''));
            samples.forEach(function (sample) {
                doclet.push('@sample ' + sample);
            });
        }

        if (dentry.since) {
            doclet.push('@since ' + dentry.since);
        }

        if (dentry.products && dentry.products.length > 0) {
            doclet.push('@product ' + dentry.products.join(' '));
        }

        return doclet;
    }

    // Do sanity check on things not documented in JSDOC
    Object.keys(dump).forEach(function (dkey) {
        if (typeof code[dkey] === 'undefined') {
            var doclet = [];

            console.log(
                'warning'.yellow,
                'found something in the API docs not in the code:',
                dkey,
                'added it to supplemental.docs.js'
            );

            htmlReport.missingInCode.push(dkey);

            supplementalDoclets.push(                
                '\n' +
                '/**\n' +
                ' * ' +
                toDolcet(
                    dump[dkey], 
                    doclet
                ).concat([
                    '@todo Copy ' + dkey + ' docs to actual source code',
                    '@apioption ' + dump[dkey].fullname.replace('<', '.').replace('>', '')
                ]).join('\n * ') +
                '\n */'
            );
        }
    });

    fs.writeFile(
        'supplemental.docs.js', 
        '/*\n   This file contains things that are referrenced in the old API dump,\n' +
        '   which can\'t be found in the source code.\n*/\n' +
        supplementalDoclets.join('\n')
    );

    // Copy plotOptions to series

    console.log("LENGTH", htmlReport.missingInCode.length, Object.keys(dump).length);

    fs.writeFile('processed.api.json', JSON.stringify(dump, undefined, '  '));
    fs.writeFile('missing.in.code.json', JSON.stringify(htmlReport.missingInCode, undefined, '  '));


    Object.keys(code).forEach(function (ckey) {
        var dentry = dump[ckey],
            centry = code[ckey],
            fname,
            samples,
            doclet = [],
            spaces
        ;

        if (ckey === '_meta') {
            return;
        }

        if (!dentry) {
            htmlReport.missingInAPI.push(centry);
            console.log(
                'warning'.yellow, 
                'found something in the code thats not in the API docs:', 
                ckey
            );
            
            dentry = {
                todo: 'implement docs for ' + ckey
            };
        }

        // Compare the contents
        // if ((!dentry.description || dentry.description.length === 0) && centry.description && centry.description.length > 0) {
        //     console.log('error'.red,
        //         'Out of sync:',
        //         'There\s a description in the code that\'s not in the dump'
        //     );
        // }

         // Build the patch entry
        if (!centry.meta) {
            return;
        }

        if (Object.keys(centry.doclet || {}).length > 0) {
            // There's already a doclet on in the code
            if (centry) {
                htmlReport.outOfSync.push(centry);                
            }

            return console.log(
                'warning'.yellow,
                'there\s already a doclet for entry:',
                ckey,
                'skipping'
            );
        }

        var col = centry.meta.column || 0;
        if (col > 0) {
            col++;
        }

        spaces = Array(col).join('\t');

        fname = centry.meta.filename;

        res[fname] = res[fname] || [];

        doclet.push('');
       
        toDolcet(dentry, doclet, spaces, centry.meta.column);

        res[fname].push({
            line: centry.meta.line - 1,
            column: centry.meta.column,
            //products: dentry.products,
            doclet: ('\n' + 
                    spaces + 
                    '/**' + 
                    doclet.join(
                        '\n' + 
                        spaces + 
                        ' * '
                    ) + 
                    '\n' +
                    spaces +
                    ' */')//.split('\n')
        });
    });

    // Generate report
    let r = fs.readFileSync(__dirname + '/report_template.html', 'utf8');

    fs.writeFile(
        'report.html',
        
        r.replace('{{MissingCodeCount}}', htmlReport.missingInCode.length)
        .replace('{{MissingCode}}', htmlReport.missingInCode.map(function (t) {
            return '<tr><td>' + t + '</td></tr>';
            // return '<tr>' + 
            //         '<td><code>' + t.fullname + '</code></td>' +
            //         '<td>' + t.description + '</td>' +
            //         '</tr>';
        }).join(''))
        .replace('{{MissingAPI}}', htmlReport.missingInAPI.map(function (t) {
            return '<tr>' + 
                    '<td><code>' + t.meta.fullname + '</code></td>' +
                    '<td>' + t.meta.filename + ':' + t.meta.line + '</td>' +
                    '</tr>';
        }).join(''))
        .replace('{{MissingAPICount}}', htmlReport.missingInAPI.length)
        .replace('{{OutOfSync}}', htmlReport.outOfSync.map(function (t) {
            return '<tr>' +
                    '<td><code>' + t.doclet.description + '</code></td>' +
                    '<td>' + t.meta.filename + ':' + t.meta.line + '</td>' +
                    '</tr>';
        }).join(''))
        ,
        function () {

        }
    );

    // Sort based on line
    Object.keys(res).forEach(function (script) {
        res[script].sort(function (a, b) {
            if (a.line < b.line) return 1;
            if (a.line > b.line) return -1;
            return 0;
        });
    });

    return res;
}

console.log('API Patch Generator'.green);

fs.readFile(__dirname + '/../tree.json', function (err, data) {
    if (err) {
        return console.log('ERROR: no tree found. Have you ran JSDoc?');
    }

    var input = flattenTree(JSON.parse(fs.readFileSync(__dirname + '/../tree.json', 'utf8'))),
        funs = [],
        mergedAPI = {}
    ;

    console.log('Using', __dirname + 'tree.json...');

    products.forEach(function (product) {
        funs.push(function (next) {
            processTarget(product, mergedAPI, function (err, api) {
                next(err);
            });
        });
    });

    async.waterfall(funs, function () {
        fs.writeFile(__dirname + '/patch.json', JSON.stringify(doCompare(input, mergedAPI), undefined, '  '), function () {

        });
    });

});
