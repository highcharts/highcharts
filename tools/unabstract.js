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

            file = file.replace(/grep = (H\.|Highcharts\.)grep,\s+/g, '');
            let regex = /(H\.|Highcharts\.)?grep\(/g;
            let arr;


                console.log(`- ${fileName}`.yellow);
                while ((arr = regex.exec(file)) !== null) {
                    let i = regex.lastIndex;
                    let inParen = 0;
                    let inBrackets = 0;
                    let requiresParen = false;

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

                        if (file.charAt(i) === ',' && inParen === 0 && inBrackets === 0) {
                            break;
                        }
                        i++;
                    }
                    console.log(
                        arr[0],
                        file.substr(regex.lastIndex, i - regex.lastIndex).cyan
                    );
                    file = file.replace(
                        arr[0] +
                        file.substr(regex.lastIndex, i - regex.lastIndex) +
                        ',',
                        (requiresParen ? '(' : '') +
                        file.substr(regex.lastIndex, i - regex.lastIndex).trim() +
                        (requiresParen ? ')' : '') + 
                        '.filter('
                    );
                    
                }

                file = file
                    //.replace(/_map_/g, 'map')
                    .replace(/\.filter\( /g, '.filter(');

            
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
