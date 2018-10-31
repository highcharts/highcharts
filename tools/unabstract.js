/* eslint-env node, es6 */
/* eslint-disable */

/*
This file exists for the one-time job of converting array abstractions
like H.each, H.map etc to their native counterparts. After that, this file can
be deleted. See https://github.com/highcharts/highcharts/issues/9225.

Usage:
node tools/unabstract
*/

const fs = require('fs');
const glob = require('glob');

require('colors');


glob('js/**/**.js', null, (err, files) => {
    files.forEach((fileName, i) => {
        if (i < 30000) {
            let file = fs.readFileSync(fileName, 'utf-8');

            file = file.replace(/reduce = (H\.|Highcharts\.)reduce,\s+/g, '');
            let regex = /(H\.|Highcharts\.)?reduce\(/g;
            let arr;


                console.log(`- ${fileName}`.yellow);
                while ((arr = regex.exec(file)) !== null) {
                    let i = regex.lastIndex;
                    let lastIndex = regex.lastIndex;
                    let inParen = 0;
                    let inBrackets = 0;
                    let requiresParen = false;

                    let args = [];

                    while (i < file.length) {
                        if (file.charAt(i) === '(') {
                            inParen++;
                        } else if (file.charAt(i) === ')') {
                            inParen--;
                        } else if (file.charAt(i) === '[') {
                            inBrackets++;
                        } else if (file.charAt(i) === ']') {
                            inBrackets--;
                        } else if (file.charAt(i) === '|') {
                            requiresParen = true;
                        } else if (file.charAt(i) === '&') {
                            requiresParen = true;
                        } else if (file.charAt(i) === '?') {
                            requiresParen = true;
                        }

                        if (
                            (
                                file.charAt(i) === ',' ||
                                file.charAt(i) === ')'
                            ) &&
                            inParen === 0 &&
                            inBrackets === 0
                        ) {
                            args.push(file.substr(lastIndex, i - lastIndex));
                            lastIndex = i + 1;
                        }

                        if (file.charAt(i) === ')' && inParen === 0 && inBrackets === 0) {
                            break;
                        }
                        i++;
                    }
                    console.log(
                        arr[0],
                        args[0].trim().cyan
                    );
                    file = file.replace(
                        arr[0] + args[0] + ',',
                        (
                            (requiresParen ? '(' : '') +
                            args[0].trim() +
                            (requiresParen ? ')' : '') + 
                            '._reduce_('
                        )
                    );
                    
                }

                file = file
                    .replace(/_reduce_/g, 'reduce')
                    .replace(/\.reduce\( /g, '.reduce(');

            
            /*
            // Replace simple each calls without arrays, function calls, or
            // operators or ternaries.
            file = file.replace(
                /(H\.)?each\(\s*([^,\[\(\|]+),\s+/g,
                '$2.forEach('
            );

            // Each calls with literal arrays
            file = file.replace(
                /(H\.)?each\(\s*(\[[^\]]+\]),\s+/g,
                '$2.forEach('
            );
            */


            fs.writeFileSync(fileName, file, 'utf8');
        }
    });
});
