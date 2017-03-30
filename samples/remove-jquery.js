/* eslint-env node, es6 */

'use strict';
const glob = require('glob');
const fs = require('fs');

const write = true;

['highcharts', 'maps', 'stock', 'unit-tests'].forEach(folder => {
    glob(folder + '/*/*/demo.js', null, (er, files) => {
        files.forEach((file, i) => {
            let script = fs.readFileSync(file, { encoding: 'utf8' });

            if (i < 10000000) {

                // 1. Remove jQuery from the script itself
                script = script.replace(
                    /\$\(function \(\) \{([\s\S]+)\n\}\);/,
                    function (m, inner) {
                        return inner.replace(/\n[ ]{4}/g, '\n');
                    }
                );

                if (write) {
                    fs.writeFileSync(file, script, { encoding: 'utf8' });
                }

                // 2. Detect if jQuery is still needed for the demo. If it is,
                // add jQuery as a script in demo.html.
                if (script.indexOf('$') !== -1 || script.indexOf('jQuery') !== -1) {
                    let htmlFile = file.replace('demo.js', 'demo.html');
                    let html = fs.readFileSync(
                        htmlFile,
                        { encoding: 'utf8' }
                    );
                    html = html.replace(
                        /^/,
                        '<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>\n'
                    );

                    if (write) {
                        fs.writeFileSync(htmlFile, html, { encoding: 'utf8' });
                    }
                }

                // 3. Add js_wrap to demo.details
                let detailsFile = file.replace('demo.js', 'demo.details');

                try {
                    let details = fs.readFileSync(detailsFile, { encoding: 'utf8' });

                    if (details.indexOf('js_wrap') === -1) {
                        details = details.replace('...', ' js_wrap: b\n...');

                        if (write) {
                            fs.writeFileSync(detailsFile, details, { encoding: 'utf8' });
                        }
                    }
                } catch (e) {
                    let details = `---
     name: Highcharts Demo
     authors:
       - Torstein Hønsi
     js_wrap: b
    ...`;
                    if (write) {
                        fs.writeFileSync(detailsFile, details, { encoding: 'utf8' });
                    }
                }

                // 4. Check demos using jQuery UI or resources
            }
        });
    });
});